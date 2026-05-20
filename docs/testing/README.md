# 测试与质量门槛

## 统一验证命令

```bash
npm run verify
```

## Foundation 阶段必须覆盖

- lint
- Prisma schema validation
- Prisma client generation
- typecheck
- unit tests
- production build

## 预期命令

```bash
npm run lint
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run test
npm run build
```
