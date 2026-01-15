---
outline: deep
---

# 选择事件

## 创建点击事件

````js
    //创建点击事件,如果存在同名点击事件则移除已存在的点击事件
    // 此处的点击事件可以点击任意图层
    _olHelper.useSelect('test');
    // 此处的点击事件只能点击名为test1的图层的要素
    let test1Select =  _olHelper.useSelect('test1', {
      layers: (layer) => layer.get('name') === 'test1',
    });
    // 设置回调函数,以获取点击后的要素
    test1Select.setEventFunc((event)=>{
        //  do something
    })
````



## 多选模式切换

````js
    // 随时切换多选和单选
    test1Select.setSelectMod('multiSelect')
    test1Select.setSelectMod('click')
````


## 自由设置select状态

````js

    // 业务中经常需要只能点击某些图层,此时可以使用setSelectActive来设置
    
    // 只激活test1事件,禁止其他所有点击事件
    setSelectActive(['test1'])
    // 激活test1事件,对其他事件不操作
    setSelectActive(['test1'],[])
    // 只禁用test1事件,对其他事件不操作
    setSelectActive([],['test1'])
    // 禁用test1事件,对其他事件不操作
    setSelectActive(undefined,['test1'])
````


## 示例
<selectExample></selectExample>


## 相关函数

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
| getSelectMod   |  获取选择类型  | `'click' \| 'multiSelect'` |   
| setEventFunc  | 设置事件回调函数 |         `function`         |
| remove |  移除绘制事件  |         `function`         |
| selectInstance | ol原生点击实例 |          `Select`          |



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
import selectExample from '../../components/selectExample.vue';
const { site, theme, page, frontmatter } = useData()
</script>
