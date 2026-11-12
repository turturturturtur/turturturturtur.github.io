# 项目规矩

## 只有一个站点（硬性要求）

**整个项目只有一个网站：`PRISM/`。中文和英文是同一个站点的两种语言，靠页面内的语言开关切换——不是两个网站、不是两个端口、不是两个域名。**

- 唯一入口：本地 `http://localhost:4000`，线上 `https://turturturturtur.github.io/`
- 切换方式：页面右上角的语言开关（`PRISM/src/components/ui/LanguageToggle.tsx`），或 URL 参数 `?lang=en` / `?lang=zh`
- 两种语言的内容在构建时一起注入同一个页面（`dataByLocale`），切换是纯前端状态，不发生跳转

**禁止的做法：**

- 给中文或英文再单独起一个服务、端口或子路径
- 用 `<a href>` 从一种语言"跳到另一个语言站点"
- 新增 `english_url` / `chinese_url` 这类跨站链接配置项
- 把内容分拆到两套独立部署的站点里

**根目录的 Jekyll 站点已退役**（`_pages/`、`_includes/`、`_layouts/`、`_sass/`、`_data/`、`_config.yml`、`_site/`）。它只作为历史文件留在仓库里：不要启动它、不要往里加内容、不要把它当中文页维护。`.github/workflows/deploy-next.yml` 只发布 `PRISM/out`，Jekyll 不参与部署。

- 唯一例外：`_config.yml` 的 `exclude` 里必须保留 `PRISM`，否则万一有人跑 Jekyll，会把 `PRISM/node_modules` 整个拷进 `_site`，构建时间从 3 秒涨到 500 秒以上。
- 退役页里有一处 PRISM 尚未收录的信息：本科专业排名 1/207、GPA 3.97/4.00、学分绩 95.732（`_pages/about.md:20`）。是否搬进 PRISM 由本人决定，不要擅自搬运或删除。

## 本地预览

```bash
./run_server.sh        # Windows 用 run_server.bat
```

起一个 `next dev -p 4000` 进程，中英文都在里面。改 `PRISM/content/` 或 `PRISM/content_zh/` 后**刷新浏览器即可生效，不用重启**。

要核对线上部署的真实产物（静态导出）时，另跑：

```bash
cd PRISM
pid=$(ss -ltnpH | grep ':4000' | grep -oE 'pid=[0-9]+' | head -1 | cut -d= -f2); [ -n "$pid" ] && kill "$pid"
rm -rf out && npm run build && npx --yes serve out -l 4000
```

**`npm run build` 与 `npm run dev` 不能同时跑**，两者共用 `.next/`。并行会让 dev 报 `ENOENT: no such file or directory, open '.../.next/static/development/_buildManifest.js.tmp.xxx'`；build 完要回到 dev，先 `rm -rf .next` 再启动，否则会残留混合产物。

**`npm run build` 前必须先停掉占用 `out/` 的进程**（dev server 或 `serve`），否则 Next 清理目录时会报 `ENOTEMPTY: directory not empty, rmdir .../out/papers`。

## 语言切换机制

优先级：**URL 参数 `?lang=` / `?locale=` > `<html data-locale>` > localStorage > 浏览器语言 > `default_locale`**。

两处实现必须同步修改，否则首屏会闪一下错误语言：

- `PRISM/src/app/layout.tsx` 的 `buildLocaleBootstrapScript`（首屏内联脚本，防闪烁）
- `PRISM/src/lib/stores/localeStore.ts` 的 `resolveInitialLocale`（水合后的 store）

支持的 locale 由 `PRISM/content/config.toml` 的 `[i18n]` 决定（当前 `en` / `zh`，默认 `en`）；i18n 配置只从 `content/config.toml` 读取，`content_zh/config.toml` 里写了也不生效。

## 中英文界面必须完全一致

**每次更改都必须保证中文和英文界面完全一致，只是语言不一致。**

### 双语内容位置

| 内容 | 英文 | 中文 |
| --- | --- | --- |
| 站点配置、导航、联系方式 | `PRISM/content/config.toml` | `PRISM/content_zh/config.toml` |
| 首页区块与研究兴趣 | `PRISM/content/about.toml` | `PRISM/content_zh/about.toml` |
| 个人简介 / 教育 / 实习 | `PRISM/content/bio.md` | `PRISM/content_zh/bio.md` |
| 动态 | `PRISM/content/news.toml` | `PRISM/content_zh/news.toml` |
| 论文 | `PRISM/content/publications.bib` | `PRISM/content_zh/publications.bib` |
| 论文专利页配置 | `PRISM/content/publications.toml` | `PRISM/content_zh/publications.toml` |
| 专利 | `PRISM/content/patents.md` | `PRISM/content_zh/patents.md` |
| 荣誉奖项 | `PRISM/content/awards.toml` | `PRISM/content_zh/awards.toml` |
| 媒体采访 | `PRISM/content/media.toml` | `PRISM/content_zh/media.toml` |
| 界面固定文案 | `PRISM/src/lib/i18n/messages.ts` 中的 `en` | 同文件中的 `zh` |

**`type = "card"` 的页面（`awards.toml`、`media.toml`）由 `src/components/pages/CardPage.tsx` 渲染。** 页级可选字段：`columns = 2` 走两列网格（缺省单列）、`clamp_lines = 5` 限制描述显示行数（超出省略号）；条目级可选字段：`image`（图片放 `PRISM/public/media/`，卡片顶部按 16:9 裁切）、`link`（整张卡片成为新窗口打开的超链接）。这两个页级字段属于非文案字段，两份文件必须写成一样。

**首页「精选科研成果」只放论文，不放专利。** 它是 `about.toml` 里的一个 section（`id = "featured_research"`，`type = "publications"`，配 `filter = "selected"` + `limit`）。两份 `about.toml` 的 section 数量与 `id` 必须一致（当前均为 3 个）。

**全部专利集中在 `/publications` 页**，也就是导航里的「论文专利」/ "Publications & Patents"。`publications.toml` 的 `title` 要与导航标题保持一致，专利挂在论文列表下方，标题层级为 `<h2>`。

挂载用的是通用的 `extra_source` + `extra_title` 两个字段，首页 section 和独立页都支持：

- 首页：`src/app/page.tsx` 的 `processSections` 读取，`src/components/home/SelectedPublications.tsx` 渲染
- 独立页：`src/app/[slug]/page.tsx` 的 `loadDynamicPageData` 读取，`src/components/publications/PublicationsList.tsx` 渲染
- markdown 一律走 `src/components/ui/MarkdownBlock.tsx`，不要在组件里各写一份 ReactMarkdown 配置

### 具体要求

1. **改一边必须改另一边。** 任何新增、删除、修改内容，都要在 `content/` 和 `content_zh/` 同步落地，不允许只改一种语言。
2. **条目数量与顺序必须一致。** 列表类内容（`news`、`awards` 的 `[[items]]`、`patents`、`navigation`、`research_interests`、`bib` 条目）在两边的条数、排列顺序、一一对应关系必须相同。渲染时不排序，文件顺序就是页面顺序。
3. **信息量必须一致。** 不允许一边写了某个限定词、机构名、奖项等级、日期，另一边漏掉。翻译可以换措辞，但不能增减事实。
4. **结构与字段必须一致。** 同一条目在两边的字段集合要相同（`title` / `subtitle` / `date` / `content` / `tags` / `selected` / `preview` / `keywords` / `extra_title` 等文案字段），`id`、`type`、`target`、`href`、`filter`、`limit`、`extra_source` 这类非文案字段应当逐字相同。
5. **专有名词与格式统一。** 机构名、论文名、缩写（arXiv、NeurIPS、AAAI、ACL、MCM/ICM、KTH 等）两边写法一致；日期格式统一为 `YYYY.MM`，区间统一用 en dash `–`（例如 `2025.03 – 至今` / `2025.03 – Present`）。
6. **术语沿用既有译法。** 界面文案的中文译法以 `PRISM/src/lib/i18n/messages.ts` 的 `zh` 为准（如 Selected Publications → 精选论文，News → 动态，Awards → 荣誉奖项）。内容文件里的标题不要另造译名。同一英文术语的中文译法要全局统一（condensation → 凝缩，pruning → 剪枝，不要把两者都译成「压缩」）。
7. **`content_zh/config.toml` 可以省略继承字段。** `src/lib/config.ts` 的 `mergeConfig` 会用 `content/config.toml` 兜底，`favicon`、`[features]`、`[i18n]`、共用的 URL 等无需重复；但 `[site]` / `[author]` / `[social]` / `[[navigation]]` 里凡是**需要显示成中文**的字段都必须写全。
   - **反过来，删字段必须两份 config 都删。** `mergeConfig` 是逐字段浅覆盖，只删英文版的话中文版仍会继承到该字段，结果只有一种语言的界面被改掉。
   - **侧栏联系图标靠删字段隐藏，不要改组件代码。** `Profile.tsx` 里每个图标都是条件渲染（`social.xxx ? [...] : []`）。注意有的显示条件是「或」，例如地址图标是 `social.location || social.location_details`，两个字段都要删干净。
8. **提交前自查。** 用下面这类命令核对两边是否仍然对应：

   ```bash
   cd PRISM
   # 列表条目数是否一致
   diff <(grep -c '^\[\[' content/news.toml) <(grep -c '^\[\[' content_zh/news.toml)
   diff <(grep -c '^\[\[items\]\]' content/awards.toml) <(grep -c '^\[\[items\]\]' content_zh/awards.toml)
   # 首页 section 的 id 与非文案字段是否一致
   diff <(grep -E '^(id|type|filter|limit|extra_source|source) *=' content/about.toml) <(grep -E '^(id|type|filter|limit|extra_source|source) *=' content_zh/about.toml)
   # 论文专利页的非文案字段是否一致
   diff <(grep -E '^(type|source|extra_source) *=' content/publications.toml) <(grep -E '^(type|source|extra_source) *=' content_zh/publications.toml)
   # 论文条目 key、顺序、字段序列是否一致
   diff <(grep -oE '^@[a-z]+\{[^,]+' content/publications.bib) <(grep -oE '^@[a-z]+\{[^,]+' content_zh/publications.bib)
   diff <(grep -oE '^\s*[a-zA-Z]+ =' content/publications.bib) <(grep -oE '^\s*[a-zA-Z]+ =' content_zh/publications.bib)
   # 英文目录里不应残留中文（config.toml 的语言标签除外）
   grep -rnP '[\x{4e00}-\x{9fff}]' content/
   ```

9. **验证。** 改完执行 `cd PRISM && npm run build`，构建通过后在同一个页面上切换语言开关，逐页对照首页、Publications、Awards。

## 荣誉奖项按时间升序（硬性要求）

`content/awards.toml` 与 `content_zh/awards.toml` 的 `[[items]]` **必须按 `date` 从旧到新排列（升序）**。`CardPage.tsx` 渲染时不排序，文件顺序就是页面顺序——文件里写错顺序，页面上就是错的。

- **排序键**：把 `date` 解析成 `(年, 月)`。只写年份的条目（如 `2024`）按「该年最早」处理，排在同年带月份的条目前面。
- **同日期保持稳定**：`date` 相同的条目维持它们原有的相对先后，不要为了版面再手动调换。
- **两份文件用同一个置换重排**：重排后第 N 条中文仍对第 N 条英文，一一对应关系不得改变（见上文规则 2）。
- **新增条目按日期插到正确位置**，不要一律追加到文件末尾；插入后整份文件仍须保持升序。
- **重排只许改顺序，不许改内容**：重排前后条目集合必须完全相同，条目内文本逐字不变。
- **自查**（顺序不对会直接报错退出）：

  ```bash
  cd PRISM
  python3 - <<'PY'
  import tomllib
  z = [i['date'] for i in tomllib.load(open('content_zh/awards.toml','rb'))['items']]
  e = [i['date'] for i in tomllib.load(open('content/awards.toml','rb'))['items']]
  k = lambda d: (int(d[:4]), int(d[5:7]) if len(d) > 4 else 0)
  assert z == e, '中英文 date 序列不一致'
  assert [k(d) for d in z] == sorted(k(d) for d in z), '荣誉奖项未按时间升序'
  print('OK', len(z), '条，时间升序且中英一致')
  PY
  ```

本节只约束两份 `awards.toml`。其他列表（`news.toml`、`publications.bib` 等）的顺序沿用各自现状，不要顺手一起重排。

## 论文条目

1. **每篇挂出来的论文都必须写出完整题目。** 不允许只列作者、只放预览图、或只写简称。`MelTrim`、`DCPI`、`ImageBindDC` 这类简称只能出现在 `news.toml` 和 bib 的 `description` 里，正式条目必须是完整标题。
2. **元数据以权威来源为准，禁止占位内容。** 已发表论文取 ACL Anthology 的官方 BibTeX（`https://aclanthology.org/<anthology-id>.bib`，含 `pages` / `month` / `doi` / `address` / `publisher`）；预印本取 arXiv API（`https://export.arxiv.org/api/query?id_list=<id>`）。**两者都可能与终稿不一致，作者顺序、共同一作标记、摘要里的专有名词大小写要以论文 PDF 首页为准**（例：Anthology 网页把摘要里的 "MelTrim" 转成了 "Meltrim"，arXiv API 返回的是 v1 旧标题 "DRUPI" 而 v3 已改名 "DCPI"）。摘要必须是论文真实摘要，不要写 "XXX paper by A and B et al." 这类占位句。
3. **摘要里的 `%` 必须转义成 `\%`**，否则 BibTeX 会把后面当注释截断。渲染时 `cleanBibTeXString` 会自动去掉反斜杠。
4. **共同一作在 bib 的 `author` 里用 `#` 标记**（如 `Shaobo Wang# and Tianle Niu#`），渲染为下划线；通讯作者目前不标。标记必须有论文首页脚注依据，不要凭印象加。
5. **`booktitle` 保留官方写法（含年份也没关系）。** 列表页由 `PublicationsList.tsx` 的 `formatVenue()` 负责去重，不要为了让显示好看而手动删掉会议名里的年份，否则复制出去的 BibTeX 就不规范了。
6. **两份 bib 除 `description` 外必须逐字相同。** 改一篇论文要同时改 `content/publications.bib` 和 `content_zh/publications.bib`，条目 key、顺序、字段集合、`title` / `author` / `abstract` / `doi` 等全部一致，只有 `description` 是中英文各写一版。摘要两种语言都保留英文原文，与其余条目一致。
