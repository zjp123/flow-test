# React + Vite + TypeScript + React Flow

这是一个基于 React、Vite 和 TypeScript 的项目，集成了 React Flow 用于流程图和节点编辑器功能。

## 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **React Flow** - 流程图和节点编辑器
- **ESLint** - 代码质量检查（配置了 TypeScript 支持）

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm tsc --noEmit

# 代码检查
pnpm lint

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
src/
  ├── App.tsx          # 主应用组件（包含 React Flow）
  ├── main.tsx         # 应用入口
  ├── index.css        # 全局样式
  ├── App.css          # 应用样式
  ├── vite-env.d.ts    # Vite 类型声明
  └── global.d.ts      # 全局类型声明（CSS、SVG 等）
```

## TypeScript 配置

项目使用严格的 TypeScript 配置，包括：
- 严格模式检查
- 未使用变量和参数检查
- JSX 转换为 React.createElement
- ESM 模块系统

## 已完成的 TypeScript 迁移

✅ 安装了 TypeScript 及相关依赖  
✅ 创建了 `tsconfig.json` 和 `tsconfig.node.json` 配置文件  
✅ 将所有 `.jsx` 文件转换为 `.tsx`  
✅ 将所有 `.js` 文件转换为 `.ts`  
✅ 添加了类型注解到 React Flow 组件  
✅ 更新了 ESLint 配置以支持 TypeScript  
✅ 创建了必要的类型声明文件  
✅ 通过了类型检查和构建测试
