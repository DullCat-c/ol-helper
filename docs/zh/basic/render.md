---
outline: deep
---

# 空间数据的渲染,更新,高亮


## 空间数据类型

空间数据类型有许多,这里不详细展开介绍,`ol-helper`将以`openlayers`的`Feature`类来作为入参  

各种类型的空间数据可以用`openlayers`的`ol\format\*`类来转换成`Feature`


## 创建图层

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

## 渲染临时要素

将要素加入进内置的`highLightLayer`图层,再高亮其他要素时会自动清除,可一次性高亮多个要素

````js
    _olHelper.wktTempRender(`POINT(114.39293331646354 30.50944437070846)`);
````



## 定位并高亮要素

根据图层名,要素唯一标识符,要素的唯一标识符的值来定位某个要素,同时也可以将要素加入select事件

<renderExample></renderExample>



## 相关函数

`createUniLayer(layerName, features, options)`  
创建唯一名称的图层

| 名称      |                        详情                        |    类型     | 默认 |
|---------|:------------------------------------------------:|:---------:|:--:|
| <span style="color:red">*</span>layerName   |                       图层名称                       | `string`  | -  |
| features  |                     要加载的要素数组                     |  `Feature[]`   | [] |
| options | openlayers创建`ol/layer/Vector`类的初始化参数,用以覆盖函数的预设参数 | `BaseVectorOptions<VectorSource>` | {} |


`createUpdateLayer(layerName, update, options)`  
创建自动更新图层

| 名称      |                        详情                        |                        类型                         |      默认      |
|---------|:------------------------------------------------:|:-------------------------------------------------:|:------------:|
| <span style="color:red">*</span>layerName   |                       图层名称                       |                     `string`                      |      -       |
| <span style="color:red">*</span>update  |               获取新视口要素的函数,将在视口变动后调用               | `(_layer: VectorLayer<VectorSource>)=> void` | (_layer)=>{} |
| options | openlayers创建`ol/layer/Vector`类的初始化参数,用以覆盖函数的预设参数 |         `BaseVectorOptions<VectorSource>`         |      {}      |


`getMapInfo(options)`  
获取当前视口信息,并将options融入进返回的对象,用于请求当前改显示的数据

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


`locateAndHighlight(highlightInfo,wkt)`  
定位并且高亮要素,如果缺少wkt则直接在图层里找已存在的要素

| 名称      |   详情   |                        类型                         | 默认 |
|---------|:------:|:-------------------------------------------------:|:--:|
| <span style="color:red">*</span>highlightInfo  | 高亮信息对象 | `HighlightInfoType` | -  |
| wkt   | wkt字符串 |                     `string`                      | -  |

`HighlightInfoType`类型

| 名称                                 |       详情        |           类型            |   
|------------------------------------|:---------------:|:-----------------------:|
| <span style="color:red">*</span>id |  要高亮要素的唯一标识符的值  | `string    \|  number ` |  
| <span style="color:red">*</span>idKey                              | 要高亮要素的唯一标识符的key |        `string`         | 
| <span style="color:red">*</span>layerName                          |      图层名称       |        `string`         |  
| selectName                         | 要加入的select事件的名称 |    `string \| null`     | 



`wktTempRender(wkt, properties, style)`  
wkt临时渲染要素,加入高亮图层并定位

| 名称        |     详情     |                类型                 |        默认        |
|-----------|:----------:|:---------------------------------:|:----------------:|
|  <span style="color:red">*</span>wkt      | wkt格式的空间信息 |             `string`              |        -         |
| properties |   要素属性信息   |             `object`              |        {}        |
| style     |   ol原生样式   | `StyleLike` | `highLightStyle` |






<script setup>
import { useData } from 'vitepress';
import renderExample from '../../components/renderExample.vue';
const { site, theme, page, frontmatter } = useData()
</script>

