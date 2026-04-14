# 太阳系动态 3D 展示系统

Web 端太阳系可视化项目（React + TypeScript + Three.js），用于展示太阳、八大行星、冥王星、小行星带与卫星系统的动态演化。

## 主要能力

- 太阳、八大行星、冥王星、小行星带、卫星系统
- 开普勒椭圆轨道近似
- 行星与卫星自转展示（支持自转倍率、逆行）
- 太阳显示上限保护（避免遮挡内太阳系）
- 快速定位：目标天体、上一个/下一个天体
- 定位后自动释放控制，不锁定视角
- 参数面板：质量、半径、体积、自转周期、轨道参数

## 交互面板

`显示与时间`:
- 显示标签
- 显示轨道
- 暂停
- 时间倍率
- 自转倍率
- 重置时间
- 天体尺寸
- 太阳显示倍率
- 轨道缩放
- 卫星显示密度

`快速定位`:
- 目标天体
- 定位到目标
- 上一个天体
- 下一个天体

## 数据来源

- JPL Planetary Physical Parameters
- JPL Planetary Satellite Physical Parameters
- JPL Small-Body Database

## 开发命令

```bash
npm install
npm run dev
npm run build
```

## 数据命令

```bash
npm run data:fetch
npm run data:parse
npm run data:sync
```

标准化输出文件：`data/normalized/jpl-celestial-bodies.json`

## 提交前建议

- 不要提交构建产物：`dist/`
- 不要提交依赖目录：`node_modules/`
- 不要提交 TypeScript 构建缓存：`*.tsbuildinfo`
- 不要提交自动生成的 `vite.config.js`、`vite.config.d.ts`
