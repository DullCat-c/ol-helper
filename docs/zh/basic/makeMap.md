---
outline: deep
---

# 创建一个实例

## olHelper实例

````html
<div id="map" style="height: 50vh;width: 50vw;"></div>
````
````js
//实例化,传入dom id, 会把地图canvas挂载到dom节点上
//每次实例化会生成一个新的实例,需要复用请保存或传值,重复实例化会使以前的实例化对象失效
let _olHelper = new olHelper('map');

````

## 坐标系
openlayers内置的坐标系只有两个,即EPSG:4326和EPSG:3857 

一般来说业务主要使用EPSG:4326坐标系,也被称为WGS84坐标系.它使用经度和纬度表示地球上的点位置,适合描述大范围的地理信息,单位是度.是国际上一种广泛使用的地理坐标系统.

还有一种很常见的坐标系,EPSG:4490坐标系,也称为中国2000大地坐标系(CGCS2000),是中国国家测绘局于2007年发布的地理坐标系统.

具体技术细节这里不讨论,两者之间差距为厘米级,而对于绝大多数民用场景,定位误差在5米到15米以内通常被认为是合理或良好的.

所以大多数情况下,我们可以认为,CGCS2000(EPSG:4490)坐标和WGS84(EPSG:4326)坐标是一致的.

olHelper默认使用EPSG:4326坐标系,如果需要设置其他的坐标系可以在实例时传入坐标系配置

::: warning
创建实例后无法更改坐标系,必须重新创建实例
:::


## 底图加载

实例化主要是快速创建了openlayers的Map类,我们想要显示地图还需要加载底图和设置中心点

````js
// 天地图官网申请的key
let tdKey = 'xxxxxxxxx';
// 添加底图图层
_olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'img_c'));
_olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'cva_c'));

// 设置中心点
i.setMapCenter([114.393569, 30.50846]);

````


## 功能点-切换底图
<SwitchBaseLayerExample></SwitchBaseLayerExample>
````html
  <div class="relative">
    <div class="absolute top-4 z-2 flex justify-center w-full">
        <div class="flex items-center">
            <div
                    class="hover:text-white hover:bg-blue-600 bg-white border-2 border-blue-200 mr-2 rounded-xl has-checked:bg-blue-600 has-checked:text-white">
                <input type="radio" id="img" name="layer" value="img" checked class="hidden" />
                <label for="img" class="h-10 p-2 flex items-center">影像底图</label>
            </div>
            <div
                    class="hover:text-white hover:bg-blue-600 bg-white border-2 border-blue-200 mr-2 rounded-xl has-checked:bg-blue-600 has-checked:text-white">
                <input type="radio" id="vec" name="layer" value="vec" class="hidden" />
                <label for="vec" class="h-10 p-2 flex items-center">矢量底图</label>
            </div>
        </div>
    </div>
    <div id="map" class="w-full h-50vh"></div>
</div>
````


````js

let _olHelper = new olHelper('map');

let tdKey = 'xxxxxxxxx';
let _olHelper = new olHelper('map');
_olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'img_c'));
_olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'cva_c'));
_olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'vec_c', false));
_olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'cva_c', false));
_olHelper.setMapCenter([114.393569, 30.50846], 18);
// 获取DOM元素
const option1 = document.getElementById('img');
const option2 = document.getElementById('vec');

// 添加事件监听器
option1.addEventListener('change', handleRadioChange);
option2.addEventListener('change', handleRadioChange);

// 事件处理函数
function handleRadioChange(event) {
    const selectedValue = event.target.value;
    closeAllBaseLayer();
    if (selectedValue === 'img') {
        _olHelper.getLayerByName('img_c').setVisible(true);
        _olHelper.getLayerByName('cva_c').setVisible(true);
    } else {
        _olHelper.getLayerByName('vec_c').setVisible(true);
        _olHelper.getLayerByName('cva_c').setVisible(true);
    }
}

// 关闭所有底图,td4326WMTSPreset函数生成的图层会自带type属性,值为baseLayer
function closeAllBaseLayer() {
    let totalLayer = _olHelper.map.getLayers().getArray();
    totalLayer
        .filter((item) => item.get('type') === 'baseLayer')
        .forEach((layer) => {
            layer?.setVisible(false);
        });
}

````




## 相关函数

`td4326WMTSPreset(tdKey, tdType, visible)`  
函数内置了天地图EPSG:4326的影像底图和矢量地图配置

| 名称      |                               详情                                |    类型     |  默认  |
|---------|:---------------------------------------------------------------:|:---------:|:----:|
| tdKey   |                           天地图官网申请的key                           | `string`  |  -   |
| tdType  | 天地图底图类型:`vec_c`(矢量底图),`cva_c`(矢量注记),<br/>`img_c`(影像底图),`cia_c`(影像注记) |  `enum`   |  -   |
| visible |                              是否显示                               | `boolean` | true |




`olHelper(target,viewOptions )`  
类构造函数

| 名称      |           详情           |      类型       |                                          默认                                        |
|---------|:----------------------:|:-------------:|:----------------------------------------------------------------------------------:|
| target   |     要挂载的dom的id字符串      |   `string`    |                                          -                                         |
| viewOptions  | openlayers的ol/View实例配置 | `ViewOptions` | `{maxZoom: 22,minZoom: 8,zoom: 18,projection: olProj.get('EPSG:4326')}` |



`setMapCenter(center,zoom )`  
定位函数,`setCenter`和`setZoom`的合并函数

| 名称      |         详情         |        类型         |  默认   |
|---------|:------------------:|:-----------------:|:-----:|
| center   |      要定位的中心点       | `[number,number]` |   -   |
| zoom  | 要设置的zoom层级,省略即不做操作 |     `number | null` | -  |








<script setup>
import { useData } from 'vitepress';
import SwitchBaseLayerExample from '../../components/switchBaseLayerExample.vue';
const { site, theme, page, frontmatter } = useData()
</script>

<style>
</style>
