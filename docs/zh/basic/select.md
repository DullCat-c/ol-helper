---
outline: deep
---

# 选择事件

## 创建点击事件

## 
`useSelect(name,options)`

创建选择事件,会将创建的实例放入`selectHandles`属性中,以方便管理(考虑到会存在多个选择事件,并且多个图层可能会有同一个点,需要实现互斥)

| 名称      |                 详情                 |      类型       | 默认 |
|---------|:----------------------------------:|:-------------:|:--:|
| name   |              选择事件的名称               |   `string`    | -  |
| options  | openlayers的ol/interaction/Select实例配置 | `OlSelectOptions` | {} |


返回:

| 名称      |    详情    |             类型             |  
|---------|:--------:|:--------------------------:|
| setSelectMod   |  设置选择类型  | `'click' \| 'multiSelect'` |   
| getSelectMod   |  获取选择类型  |     `'click' \| 'multiSelect'`|   
| setEventFunc  | 设置事件回调函数 |         `function`         |
| remove |  移除绘制事件  |         `function`         |


## 根据业务自由设置select状态

`setSelectActive(activeLayerNameArray,inactiveLayerNameArray)`

根据业务自由设置select状态

| 名称      |                 详情                 |      类型       | 默认 |
|---------|:----------------------------------:|:-------------:|:--:|
| activeLayerNameArray   |              可点击的图层名数组               |   `string`    | -  |
| inactiveLayerNameArray  | openlayers的ol/interaction/Select实例配置 | `OlSelectOptions` | {} |



`clearAllSelect()`
移除所有选择要素



<script setup>
import { useData } from 'vitepress';
const { site, theme, page, frontmatter } = useData()
</script>
