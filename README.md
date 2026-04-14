# 太阳系动态 3D 展示系统

这是一个 Web 端太阳系可视化项目（React + TypeScript + Three.js），用于展示太阳、八大行星、冥王星、小行星带与行星卫星的动态轨道。

## 当前实现

- 已实现太阳、八大行星、冥王星
- 已实现卫星系统（首批主要卫星 + 冥王星卫星）
- 已实现小行星带（粒子化渲染）
- 已实现开普勒椭圆轨道近似（替代纯圆轨道）
- 已实现点击天体查看参数信息面板
- 已实现时间流速（含回放）、暂停/继续、时间重置、体积缩放、轨道缩放和标签显隐控制
- 天体球体按真实半径比例建模（体积比例由半径比保持）
- 轨道距离采用独立缩放，便于可视化观察

## 数据来源

- JPL Planetary Physical Parameters
- JPL Planetary Satellite Physical Parameters
- JPL Small-Body Database（用于小行星带扩展）

## 启动

1. 安装 Node.js 20+（当前环境未检测到 npm）
2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 构建

```bash
npm run build
```

## 数据抓取

可抓取 JPL 原始页面快照用于后续解析：

```bash
npm run data:fetch
```

输出目录为 data/raw，并包含 manifest.json。

解析为标准化 JSON：

```bash
npm run data:parse
```

一键抓取+解析：

```bash
npm run data:sync
```

输出文件：data/normalized/jpl-celestial-bodies.json

## 后续建议

- 将卫星扩展到 JPL 全量清单（脚本自动抓取）
- 用开普勒方程替代当前简化圆轨道近似
- 增加天体参数面板（质量、体积、轨道参数、参考来源）
- 增加性能分级策略（LOD、按距离动态更新频率）
