# Claude Code 开发说明

## 项目概况

`kinqimen` 是一个 TypeScript 时家奇门排盘库，以 ESM 格式发布到 npm，支持转盘和鸣法飞盘，均可使用拆补定局。
包的配置与源码位于仓库根目录，使用 Bun 进行测试和构建。

主要目录与入口：

- `src/index.ts`：公开接口与类型导出。
- `src/qimen.ts`：`Qimen` 主接口及盘面组装。
- `src/core/`：天盘、地盘、门盘、星盘、神盘、暗干、马星、长生运、门迫、击刑等计算模块。
- `src/core/mingfa.ts`：鸣法飞盘及暗干支计算。
- `src/calendar/`：基于 `tyme4ts` 的历法、干支和节气适配器。
- `src/data/tables.ts`：静态查表数据。
- `test/`：Bun 测试用例。

## 常用命令

```bash
bun install
bun run typecheck
bun test
bun run build
```

发布前运行完整检查：

```bash
bun run prepublishOnly
```

## 开发约定

- `Qimen.pan({ type, juMethod })` 分别选择盘式和定局方法，默认值为 `"转盘"` 和 `"拆补"`，返回结果也包含这两个字段。盘面结果类型应与定局方法保持独立。
- 公开接口以 `Qimen` 为中心，类型统一从 `src/index.ts` 导出。
- 优先在 `src/core/` 中实现职责明确、以查表为主的计算函数。
- 修改排盘行为或返回的 JSON 结构时，同步更新 `test/` 中对应的回归用例。
- `dist/` 为生成的构建产物，源码修改应放在 `src/` 中。
- 本项目采用 ESM（`"type": "module"`），使用 ESM 导入和导出语法。

## 验证要求

修改代码后，至少运行：

```bash
bun run typecheck
bun test
```

涉及发布的改动，还需运行：

```bash
bun run build
```
