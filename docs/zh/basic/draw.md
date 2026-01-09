---
outline: deep
---

# 绘制和编辑



# 用法

绘制和编辑操作使用hook函数

````js



````


# 绘制 

`useDraw(type,options)`

创建绘制事件,会将内置的highLightLayer图层作为编辑图层

| 名称      |                 详情                 |      类型       | 默认 |
|---------|:----------------------------------:|:-------------:|:--:|
| type   |              可以绘制的类型               |   `drawTypeEnum`    | -  |
| options  | openlayers的ol/interaction/Draw实例配置 | `Partial<DrawOptions>` | {} |

`drawTypeEnum = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Square' | 'Box';`

返回:

| 名称      |    详情    |     类型     |  
|---------|:--------:|:----------:|
| drawInstance   |   绘制实例   |   `Draw`   |   
| setEventFunc  | 设置事件回调函数 | `function` |
| remove |  移除绘制事件  | `function` |


## 编辑

`useModify(options)`

创建编辑事件,无需配置,会将内置的highLightLayer图层作为编辑图层

| 名称      |                 详情                 |      类型       | 默认 |
|---------|:----------------------------------:|:-------------:|:--:|
| options  | openlayers的ol/interaction/Modify实例配置 | `ModifyOptions` | {} |


返回:

| 名称      |    详情    |     类型     |  
|---------|:--------:|:----------:|
| modifyInstance   |   编辑实例   |  `Modify`  |   
| setEventFunc  | 设置事件回调函数 | `function` |
| remove |  移除编辑事件  | `function` |



<script setup>
import { useData } from 'vitepress';
const { site, theme, page, frontmatter } = useData()
</script>

