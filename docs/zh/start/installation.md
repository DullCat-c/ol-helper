---
outline: deep
---

# 快速上手

## 安装

::: code-group

```sh [npm]
npm install @dullcat/ol-helper
```
```sh [pnpm]
pnpm add @dullcat/ol-helper
```
```sh [yarn]
yarn add @dullcat/ol-helper
```
```sh [bun]
bun add @dullcat/ol-helper
```
:::


## 试试看

```html
  <div id="map" style="height: 100vh;width: 100vw;"></div>
```
天地图key,需去[官网](https://oauth.tianditu.gov.cn/login)申请
```js
document.addEventListener('DOMContentLoaded', ()=> {
  let tdKey = 'xxxxxxxxx';
  let _olHelper = new olHelper('map');
  _olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'img_c'));
  _olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'cva_c'));
  _olHelper.setMapCenter([114.393569, 30.50846], 18);
});

```
::: info
建议搭配openlayers一起使用,ol>6
:::
