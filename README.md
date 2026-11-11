# DSH quick switcher / 快捷切换器

Keyboard-first workspace, model and recent-conversation selection for DeepSeek Harness (DSH).
个人键盘切换插件，不修改 DSH 应用本体。拼音词库打包在浏览器产物中，不需要 CDN。

## 功能

| 功能 | Desktop 默认快捷键 |
| --- | --- |
| 选择工作区（仅新会话） | Cmd/Ctrl+R；冲突时 Cmd/Ctrl+Shift+R |
| 切换模型 | Cmd/Ctrl+M |
| 最近会话 | Ctrl+Tab / Ctrl+Shift+Tab（macOS 也是 Control） |

工作区/模型选择器支持有序词前缀及中文拼音搜索、↑↓、Enter 确认、Esc 取消。
名称按 ASCII 字母/数字/下划线连续词和逐字汉字拆分，不拆驼峰或下划线。
可跳过整个词，但命中词时只能连续消费词首前缀；例如 `github workflow` 可匹配 `gw`、`giwo`，不能匹配 `gh`、`hub`。
`工作台` 可匹配 `gzt`、`gongzt`、`工作台`、`工台`；不支持 `工zt` 的拼音原文混用。
项目名和完整路径分别匹配；路径/显示副文本优先支持字面连续子串。
不自动 trim、不做 Unicode normalization、不按空格拆成 AND 条件；保留原列表排序。

多个 Provider 时显示双栏：← 进入 Provider 栏，↑↓ 筛选，→ 或 Enter 进入模型栏。
只有一个 Provider 时隐藏左栏。

最近会话中，按住 Ctrl 配合 Tab 或 ↑↓ 选择，松开 Ctrl 提交。鼠标点击直接切换并关闭，
后续松开 Ctrl 不会重复触发。旋转圆环表示运行中，绿色点表示已完成未读。
只展示当前打开的空白会话（`blank === true`），并放在第一行；其他空白会话隐藏。
状态复用 DSH 数据，插件不会自行标记已读。

## 可视化配置

在 DSH **设置 → 快捷切换器** 中调整，修改立即生效并保存在当前设备 localStorage，重启保留：

配置按三个选择器分组：

- **通用**：动画开关（默认开启），统一控制三个选择器及 loading 旋转。
- **工作区选择器**：选择项目后聚焦输入框（默认开启）。聚焦仅在项目会话成功打开后执行，与模型选择的聚焦设置独立。
- **模型选择器**：模型提供方筛选栏（自动／始终显示／隐藏）、选择模型后聚焦输入框。
- **最近会话切换器**：最近会话数量（默认 12，2–50）、最近修改时间（默认 7 天内，可选 1／3／7／14／30／90 天内或不限制）。

当前打开的会话不受时间限制，作为切换起点保留；其他会话按 DSH 的 `updatedAt` 修改时间过滤。
旧版分组动画设置会迁移为统一开关：只要任一分组曾关闭动画，统一开关默认关闭；此后以通用组的选择为准。

设置不跨设备同步。损坏或不支持版本的数据不会被覆盖；保存失败保留此前生效的值。

## 安装

通过 DSH 插件管理安装本地包目录。插件包名是 `@local/dsh-quick-switcher`。
需要在支持 Cordis Client Slots、sessions、workspaces、uiWorkspace 和 shortcuts 的 DSH 中使用。
已针对 DSH `0.2.2-rc.1` 开发与测试；其他版本的兼容性未验证。

如果采用本地链接安装，不要在更新安装链接之前移动或删除源码目录。
浏览器 Web 默认模型快捷键为 Alt+Cmd/Ctrl+M，工作区默认不绑定；Linux Web 不声明默认绑定。

## 快捷键副作用与限制

- Desktop 的 Cmd/Ctrl+R 原属于 DSH 的右侧页面刷新。本插件首次激活时尝试通过 DSH
  快捷键服务清除该默认绑定，再分配给工作区选择；已有自定义冲突不会覆盖。
- 可在 DSH 快捷键设置中改绑。卸载不会自动清除设备保存的覆盖；恢复刷新之前先改绑或清除工作区选择。
- 模型选择使用 DSH 原有操作，更新当前会话，并可能更新后续新会话的默认模型。
- macOS 系统可能抢占 Ctrl+↑/↓。可自行在系统快捷键设置中关闭这两个系统绑定，或继续使用 Ctrl+Tab。
  插件本身不会修改 macOS 系统偏好。

## 隐私与权限

- 插件显示当前 DSH 实例提供的工作区名称/目录、会话标题/状态和模型列表。
- 最近会话历史仅在浏览器 localStorage 保存配置数量（默认 12，最多 50）的会话 ID；不保存消息正文、标题或工作区路径。
- 插件没有第三方 HTTP 请求、遥测、凭据读取、Shell 执行或文件读取功能。
  切换操作通过 DSH 服务完成，DSH 本身的网络行为不属于本插件的保证范围。
- 屏幕共享时，选择器可能展示工作区路径、会话标题及模型 Provider 名称，请注意隐私。

## 开发与验证

项目 `.npmrc` 固定使用公开镜像 `https://registry.npmmirror.com/`，并为 `@esbuild` 显式指定相同镜像，避免继承本机的私有 registry。现有锁文件中的公开 `registry.npmjs.org` 下载地址保留不变。

命令行 `--registry`、环境变量或其他作用域配置仍可能覆盖项目设置，因此变更依赖后应检查锁文件的 `resolved` 地址；不要提交私有镜像地址或认证信息。

修改 `client-source.js` 或 `string-match.js` 后运行构建；`client.js` 是含拼音词库的生成产物，不应手工修改：

```sh
npm ci
npm run build
npm test
node --check client.js
node --check index.js
node test.mjs
node recent-test.mjs
node settings-test.mjs
node search-test.mjs
```

回归测试覆盖 Provider 双栏导航、空白会话过滤、Ctrl+方向键、鼠标提交防重复、运行及未读状态。
macOS 初版选择器做过按键验证；最新所有状态和动画并未逐一做视觉端到端验证。

本仓库不包含个人系统偏好备份、凭据、会话数据或本机 DSH profile。
仓库当前仅用于 GitHub 私有发布；npm 发布保持禁用（`private: true`）。

## 匹配模块

`string-match.js` 提供 `genStringMatchFn`、`genChineseMatchFn`、`genContentMatchFn`，返回 `null` 或原文 inclusive UTF-16 高亮区间。
词前缀快速路径及必要条件检查为线性；歧义回退 DP 最坏 O(L×K) 时间/空间，不限制或截断输入，超长歧义输入仍可能耗费较多内存。
保留消费优先、分隔符捕获计数高亮、拼音先原文后及重复区间。拼音由固定 pinyin-pro 3.29.5 决定。
本工具采用统一 UTF-16 映射，所有分隔符 UTF-16 单元可跳过，明确不复现旧非 /u 可选正则的代理对量词 bug 或非中文 code-point 映射偏移。
本次仅替换匹配算法，未增加 UI 高亮、评分、排序或防抖。
