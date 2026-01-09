---
outline: deep
---

# 空间数据的渲染,更新,高亮


## 空间数据类型

空间数据类型有许多,这里不详细展开介绍,`ol-helper`将以`openlayers`的`Feature`类来作为入参  

各种类型的空间数据可以用`openlayers`的`ol\format\*`类来转换成`Feature`


## 渲染要素

创建一个图层并将空间数据一次性加载到地图上

````js
// 以geojson格式为例,用openlayers的GeoJSON类来创建Feature
import GeoJSON from 'ol/format/GeoJSON';
let newFeatures = new GeoJSON().readFeatures(geoJsonData);
// 创建唯一图层函数
_olHelper.createUniLayer('test', newFeatures);
````


## 创建自动更新图层

创建一个图层,并随着地图的拖动来动态更新地图点位,以减少占用的内存

````js
_olHelper.createUpdateLayer('test', (_layer) => {
  //这里是拖动地图后调用的更新函数,以获取地图范围内的要素
  
  // 获取当前视口的范围和缩放大小,以此请求需要显示的要素;
  let mapInfo = _olHelper.getMapInfo();
  getLayer(mapInfo).then((res) => {
    // 对比,如果不是当前视口的要素,则不予处理
    if (_olHelper.compareMapInfo(mapInfo, _olHelper.getMapInfo())) {
      // 加载要素
      let newFeatures = new GeoJSON().readFeatures(res.data);
      _olHelper.updateLayerFromFeatures(newFeatures, _layer);
    }
  });
});

````


## 定位并高亮要素

根据图层... 来定位某个要素

<renderExample></renderExample>



## 相关函数

`createUniLayer(layerName, features, options)`  
创建唯一名称的图层

| 名称      |                        详情                        |    类型     | 默认 |
|---------|:------------------------------------------------:|:---------:|:--:|
| layerName   |                       图层名称                       | `string`  | -  |
| features  |                     要加载的要素数组                     |  `Feature[]`   | [] |
| options | openlayers创建`ol/layer/Vector`类的初始化参数,用以覆盖函数的预设参数 | `BaseVectorOptions<VectorSource>` | {} |


`createUpdateLayer(layerName, update, options)`  
创建自动更新图层

| 名称      |                        详情                        |                        类型                         |      默认      |
|---------|:------------------------------------------------:|:-------------------------------------------------:|:------------:|
| layerName   |                       图层名称                       |                     `string`                      |      -       |
| update  |               获取新视口要素的函数,将在视口变动后调用               | `(_layer: VectorLayer<VectorSource>)=> void` | (_layer)=>{} |
| options | openlayers创建`ol/layer/Vector`类的初始化参数,用以覆盖函数的预设参数 |         `BaseVectorOptions<VectorSource>`         |      {}      |


`getMapInfo(options)`  
获取当前视口信息,并将options融入进返回的对象

返回:

| 名称      |                        详情                        |                      类型                      |  
|---------|:------------------------------------------------:|:--------------------------------------------:|
| zoom   |                       视口层级                       |                   `number`                   |   
| xmin  |               四至坐标-最小X坐标               | `number` |
| ymin | 四至坐标-最大Y坐标  |      `number`       |
| xmax | 四至坐标-最大X坐标  |      `number`       |
| ymax | 四至坐标-最小Y坐标  |      `number`       |


`compareMapInfo(mapInfo1,mapInfo2)`  
对比两个视口信息是否一致,返回boolean


`locateAndHighlight(wkt, highlightInfo)`  
定位并且高亮要素

| 名称      |   详情   |                        类型                         | 默认 |
|---------|:------:|:-------------------------------------------------:|:--:|
| wkt   | wkt字符串 |                     `string`                      | -  |
| highlightInfo  | 高亮信息对象 | `HighlightInfoType` | -  |

`HighlightInfoType`类型

| 名称         |       详情        |           类型            |   
|------------|:---------------:|:-----------------------:|
| id         |   要高亮要素的唯一标识值   | `string    \|  number ` |  
| idKey      | 要高亮要素的唯一标识符的key |        `string`         | 
| layerName  |      图层名称       |        `string`         |  
| selectName | 要加入的select事件的名称 |    `string \| null`     | 
| style      |      高亮样式       |   `StyleLike \| null`   |  







<script setup>
import { useData } from 'vitepress';
import renderExample from '../../components/renderExample.vue';
import aCom from '../../components/aCom.vue';
const { site, theme, page, frontmatter } = useData()
</script>

