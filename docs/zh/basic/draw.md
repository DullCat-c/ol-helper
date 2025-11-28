---
outline: deep
---

# 绘制

## 绘制

````html
<div id="map" style="height: 50vh;width: 50vw;"></div>
````
````js
//实例化,传入dom id, 会把地图canvas挂载到dom节点上
//每次实例化会生成一个新的实例,需要复用请保存或传值,重复实例化会使以前的实例化对象失效
let mapInstance = new olHelper('map');

````




<aCom></aCom>
<script setup>
import { useData } from 'vitepress';
import aCom from '../../components/aCom.vue';
const { site, theme, page, frontmatter } = useData()
</script>

<style>
</style>
