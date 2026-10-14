/**
 * [INPUT]: 固定Git提交的公开Markdown、ASR文本与八张PNG，依赖npm或环境指定的marked解析。
 * [OUTPUT]: dist/content-data.js、dist/assets/、dist/sources/及带SHA-256的来源清单。
 * [POS]: tools的内容构建入口；只整理已公开原件，页面交互与视觉由dist其它组件消费。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// === 固定来源与路径 ===
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SOURCE_DIR = path.join(DIST, 'sources');
const COMMIT = 'fb160b19e5d5e19b306c9e3e8ea1f67ffd3458f2';
const REPO = 'https://github.com/Meracle-sjj/wuwa-roguelike-system-analysis';
const { Marked } = process.env.WUWA_MARKED_PATH
  ? await import(pathToFileURL(process.env.WUWA_MARKED_PATH).href)
  : await import('marked');
const SOURCE_FILES = execFileSync('git', ['ls-tree', '-rz', '--name-only', COMMIT], { cwd: ROOT })
  .toString('utf8').split('\0').filter(Boolean).filter(file => /\.(md|txt|png)$/iu.test(file));
const snapshot = new Map(SOURCE_FILES.map(file => [file,
  execFileSync('git', ['show', `${COMMIT}:${file}`], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 })]));
const text = file => {
  if (!snapshot.has(file)) throw new Error(`来源提交缺少公开文件：${file}`);
  return snapshot.get(file).toString('utf8');
};
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const encodePath = value => value.split('/').map(encodeURIComponent).join('/');
const withoutContract = value => value.replace(/^\s*<!--\s*\n\[INPUT\]:[\s\S]*?-->\s*\n/u, '');

// === 渲染边界：原件链接离线映射，禁止可执行URL与原始HTML ===
function hrefFor(href, sourceFile, image = false) {
  const value = String(href || '').trim();
  if (/^https?:\/\//iu.test(value)) return image ? null : value;
  if (/^mailto:/iu.test(value)) return image ? null : value;
  if (!value || /^\/\/|^[a-z][a-z0-9+.-]*:/iu.test(value)) return null;
  if (value.startsWith('#')) return image ? null : value;
  let decoded;
  try { decoded = decodeURIComponent(value); } catch { return null; }
  const [pathname, fragment = ''] = decoded.split('#', 2);
  const cleanPath = path.posix.normalize(path.posix.join(path.posix.dirname(sourceFile), pathname));
  if (cleanPath.startsWith('../') || path.posix.isAbsolute(cleanPath) || !snapshot.has(cleanPath)) return null;
  const destination = image && cleanPath.startsWith('assets/') ? cleanPath : `sources/${cleanPath === 'CLAUDE.md' ? 'SOURCE-CLAUDE.md' : cleanPath}`;
  return `./${encodePath(destination)}${fragment ? `#${encodeURIComponent(fragment)}` : ''}`;
}

function render(markdown, sourceFile) {
  const parser = new Marked({ gfm: true, breaks: false });
  parser.use({ renderer: {
    html({ text: raw }) { return escapeHtml(raw); },
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      const mapped = hrefFor(href, sourceFile);
      if (!mapped) return `<span class="source-link-disabled">${label}</span>`;
      const external = /^https?:\/\//iu.test(mapped);
      return `<a href="${escapeHtml(mapped)}"${title ? ` title="${escapeHtml(title)}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    },
    image({ href, title, text: alt }) {
      const mapped = hrefFor(href, sourceFile, true);
      if (!mapped) return `<span class="source-image-disabled">${escapeHtml(alt)}</span>`;
      const number = String(href).match(/(?:^|\/)(\d{2})-/u)?.[1];
      return `<img src="${escapeHtml(mapped)}" alt="${escapeHtml(alt)}"${title ? ` title="${escapeHtml(title)}"` : ''}${number ? ` data-figure-id="figure-${number}"` : ''} loading="lazy" decoding="async">`;
    }
  }});
  return parser.parse(withoutContract(markdown));
}

// === 原稿：不删节地切分六个h2章节 ===
const articleFile = '系统拆解案.md';
const articleMd = withoutContract(text(articleFile));
const headings = [...articleMd.matchAll(/^## (.+)$/gmu)];
const sectionIds = ['position', 'design-sources', 'build', 'metaphor-rhythm', 'feedback', 'delivery'];
if (headings.length !== sectionIds.length) throw new Error(`原稿章节数改变：预期6，实际${headings.length}`);
const introMarkdown = articleMd.slice(0, headings[0].index);
const title = articleMd.match(/^# (.+)$/mu)?.[1];
const introBodyMarkdown = introMarkdown.replace(/^# .+\n\n/u, '').replace(/^v0\.14.+\n\n/u, '');
const sections = headings.map((match, index) => {
  const start = match.index;
  const end = headings[index + 1]?.index ?? articleMd.length;
  const markdown = articleMd.slice(start, end);
  return { id: sectionIds[index], title: match[1], html: render(markdown, articleFile),
    sourcepath: `./sources/${encodePath(articleFile)}`, sourceHeading: match[1],
    subheadings: [...markdown.matchAll(/^### (.+)$/gmu)].map(item => item[1]) };
});
if (introMarkdown + headings.map((match, index) => articleMd.slice(match.index, headings[index + 1]?.index ?? articleMd.length)).join('') !== articleMd) {
  throw new Error('原稿切分没有逐字覆盖全部正文');
}

const captions = new Map([...articleMd.matchAll(/!\[([^\]]+)\]\((assets\/[^)]+)\)\s*\n\s*\*([^*]+)\*/gu)]
  .map(match => [match[2], { alt: match[1], caption: match[3] }]));
const figureTitles = [
  '单局玩法总览', '周度游历与奖励定位', '十二徽记的设计来源', '两类基础反馈节奏',
  '跟随稀有度提示的构筑与挑战结果', '隐喻如何改写体验节奏', '已有阶段信息与强化过程感知', '强化窗口内的两层感知提升'
];
const figures = SOURCE_FILES.filter(file => /^assets\/\d{2}-.+\.png$/u.test(file)).sort().map((file, index) => {
  const number = file.match(/\/([0-9]{2})-/u)[1];
  const caption = captions.get(file);
  if (!caption) throw new Error(`原稿缺少图注：${file}`);
  return { id: `figure-${number}`, file: `./${encodePath(file)}`, title: figureTitles[index],
    caption: caption.caption, alt: caption.alt,
    sourceKind: [4, 6, 8].includes(index + 1) ? 'conceptual-model' : 'analysis-illustration',
    provenance: '公开原稿附图；模型生成并经作者核对，不是实机画面。',
    sourcepath: `./sources/${encodePath(file)}`, sha256: sha(snapshot.get(file)) };
});
if (figures.length !== 8) throw new Error(`原件图数改变：预期8，实际${figures.length}`);

// === 记录摘要是页面导航文案，完整修正稿和ASR另行保留 ===
const recordSummaries = [
  ['R03', '狂欢', '齿轮之心重排回能与延时需求；当时的免死预期、后续生命压力判断分开记录。',
    '永久解梦不是无限免死；生命压力是本人体验，不能推为机制量化或最优策略。', '31:58', 32],
  ['R04', '雷暴', '按稀有度线索选择并正常操作，取得配套核心，普通与追加两阶段通过；两处偏好与实际取项不同。',
    '19次常规隐喻选择不含开局与商店；本局开始前周进度已满，不能称再次从零实测周奖。', '16:14', 17],
  ['R05', '飓风', '声骸轮换转为解梦内集中释放；凋零的梦改变触发可用时段，维里奈参与声骸触发。',
    '开头口称第六把，公开研究编号保留为R05；10/04补充确认追加挑战通过，未提供完整开局面板。', '22:38', 23],
  ['R06', '坚盾', '回能充足时拒绝齿轮，后期改用千咲；区分领域生成的重击类伤害与角色直接重击动作。',
    '绯雪难以连续重击是当局操作体验；未拿到冰绽不等于面板未出现，精确动作阶段与零散成交未继续追查。', '25:33', 26]
];
const records = recordSummaries.map(([id, route, summary, boundary, recordingLength, asrSegments]) => {
  const file = `records/${id}-修正稿.md`;
  return { id, route, summary, boundary, recordingLength, asrSegments,
    sourcepath: `./sources/${encodePath(file)}`, asrpath: `./sources/${encodePath(`records/${id}-原始ASR.txt`)}`,
    summaryKind: 'adaptation-navigation', html: render(text(file), file) };
});

const content = {
  meta: { title, version: 'v0.14', date: '2026-10-07', commit: COMMIT, repo: REPO,
    sourceUrl: `${REPO}/blob/${COMMIT}/${encodePath(articleFile)}`,
    evidenceBoundary: '原稿研究版本与亲测范围保持不变；图示曲线为概念模型，反馈方案尚未实装。' },
  article: { introHtml: render(introMarkdown, articleFile), introBodyHtml: render(introBodyMarkdown, articleFile), sections,
    sourcepath: `./sources/${encodePath(articleFile)}`, sha256: sha(snapshot.get(articleFile)) },
  methodHtml: render(text('来源与方法.md'), '来源与方法.md'),
  auditHtml: render(text('徽记触发核验.md'), '徽记触发核验.md'),
  recordIndexHtml: render(text('records/README.md'), 'records/README.md'),
  imagegenHtml: render(text('imagegen/README.md'), 'imagegen/README.md'),
  records, figures,
  sourceLinks: { article: `./sources/${encodePath(articleFile)}`, method: `./sources/${encodePath('来源与方法.md')}`,
    audit: `./sources/${encodePath('徽记触发核验.md')}`, records: './sources/records/README.md',
    imagegen: './sources/imagegen/README.md', snapshot: './sources/SNAPSHOT.md', manifest: './sources/source-manifest.json' }
};

// === 字节快照与来源清单 ===
fs.mkdirSync(SOURCE_DIR, { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
const files = SOURCE_FILES.map(file => {
  const destination = file === 'CLAUDE.md' ? 'SOURCE-CLAUDE.md' : file;
  fs.mkdirSync(path.dirname(path.join(SOURCE_DIR, destination)), { recursive: true });
  fs.writeFileSync(path.join(SOURCE_DIR, destination), snapshot.get(file));
  if (file.startsWith('assets/') && file.endsWith('.png')) fs.writeFileSync(path.join(DIST, file), snapshot.get(file));
  return { source: file, local: destination, bytes: snapshot.get(file).length, sha256: sha(snapshot.get(file)) };
});
const manifest = { schemaVersion: 1, repo: REPO, commit: COMMIT, sourceVersion: 'v0.14', sourceDate: '2026-10-07',
  scope: '固定提交公开Markdown、ASR文本和PNG；没有录音、私有研究文件、Git对象或运行依赖。',
  transformations: ['原件按字节复制；根CLAUDE.md保存为SOURCE-CLAUDE.md以容纳当前快照地图。',
    '页面渲染转义原始HTML；禁止可执行协议；内部链接映射到本地sources或assets。',
    '主稿六个二级章节逐字切分，不删段落；记录摘要只用于导航，不替代原文。'], files,
  articleCoverage: { sections: sections.length, partitionMatchesSource: true, figures: figures.length,
    originalLines: text(articleFile).split('\n').length, sourceSha256: sha(snapshot.get(articleFile)) } };
fs.writeFileSync(path.join(SOURCE_DIR, 'source-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(SOURCE_DIR, 'SNAPSHOT.md'), `<!--
[INPUT]: 公开仓库固定提交的Markdown、ASR文本、PNG与source-manifest.json。
[OUTPUT]: 说明公开原件快照的范围、逐字保存方式和页面改编边界。
[POS]: dist/sources的新增归档说明；它是制作说明，不能冒充原作者原稿。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# 公开资料离线快照说明

本说明由HTML制作过程新增；其它原件除地图文件改名外，保持来源提交字节不变。

来源仓库：${REPO}  
来源提交：\`${COMMIT}\`  
原稿版本：v0.14；发布整理日期：2026-10-07。

先读[系统拆解案](系统拆解案.md)，再按问题核对[来源与方法](来源与方法.md)、[触发核验](徽记触发核验.md)和[游玩记录](records/README.md)。原始ASR有误识别；修正稿和后续确认的边界保留。

原稿、公开记录、图像提示词和八张PNG均按字节保存，[source-manifest.json](source-manifest.json)记录逐文件SHA-256。原仓库根地图保存为[SOURCE-CLAUDE.md](SOURCE-CLAUDE.md)，本目录的CLAUDE.md是新增地图；子目录原地图保持不变。音频、私有研究文件和Git对象未纳入快照。

页面交互由制作者改编。曲线不是DPS或情绪测量；规则分组来自作者对社区文本的分析，不是官方标签；优化方案仍是待验证提案。全文和附图提供独立阅读材料，不需要网页或本次对话。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
`);
fs.writeFileSync(path.join(SOURCE_DIR, 'CLAUDE.md'), `# dist/sources/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

成员清单

README.md: 原仓库作品入口，原件字节保存。
系统拆解案.md: v0.14完整正文，原叙述、图注与附件引用保留。
来源与方法.md: 规则、体验、方法和版本边界原件。
徽记触发核验.md: 十二基础与六核心核验原件，非实机审计。
SOURCE-CLAUDE.md: 来源提交的根地图原件，改名以与当前地图区分。
SNAPSHOT.md: 制作过程新增的快照范围与读取契约，不属于原作者正文。
source-manifest.json: 固定提交、文件SHA-256和变换范围的机器可读清单。
assets/: 八张PNG原件与来源资产地图，支持本目录Markdown相对图片链接。
imagegen/: 八图提示词与工具/模型可知范围原件，含原版局部地图。
records/: R03—R06公开修正稿及原始ASR，含六局索引和原版局部地图。

数据流：固定Git提交 → 原件快照；本目录不反向依赖网页生成数据，便于其它Agent直接用UTF-8文件核对。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
`);
fs.writeFileSync(path.join(DIST, 'assets', 'CLAUDE.md'), `# dist/assets/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

成员清单

${figures.map(figure => `${decodeURIComponent(figure.file.replace('./assets/', ''))}: 图${Number(figure.id.slice(-2))}，${figure.title}；原图字节复制，属于分析示意而非实机。`).join('\n')}

与sources/assets保存同一批原件；此处供HTML页面加载，sources副本保证原稿包独立读取。SHA-256见sources/source-manifest.json。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
`);
const safeJson = JSON.stringify(content).replace(/</gu, '\\u003c').replace(/\u2028/gu, '\\u2028').replace(/\u2029/gu, '\\u2029');
fs.writeFileSync(path.join(DIST, 'content-data.js'), `/**
 * [INPUT]: tools/build-content.mjs读取固定提交${COMMIT}的公开原文。
 * [OUTPUT]: window.WuwaContent，提供六章正文、证据附件、公开记录与八图数据。
 * [POS]: dist的生成内容层；app.js读取，页面改编与原文快照分开。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
window.WuwaContent = ${safeJson};
`);
console.log(JSON.stringify({ sections: sections.map(section => section.id), figures: figures.length, records: records.length,
  snapshotFiles: files.length, commit: COMMIT, partitionMatchesSource: true }));
