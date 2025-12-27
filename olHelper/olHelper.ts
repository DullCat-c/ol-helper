/*
 * @Author: DullCat
 * @Date: 2023-03-07 17:46:09
 * @Description: 主要用途:单例化ol的Map类,保存公共变量,Map类函数
 * ol支持多个重复的name,但是此框架不做重复name的考虑,因为本人认为重复的name是多余且麻烦的
 * ol的设计兼具颗粒度和简洁,为此我一直认为我的封装是画蛇添足,纠结到底有没有必要写这样的一个类
 * 但是工作中遇到了大量需要快速构建一个地图项目的需求,不停的催生我的想法
 */

import olMap from 'ol/Map';
import View, { ViewOptions } from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import * as olProj from 'ol/proj';
import type { ProjectionLike } from 'ol/proj';
import * as olExtent from 'ol/extent';
import WMTS from 'ol/source/WMTS';
import XYZ from 'ol/source/XYZ';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import ScaleLine from 'ol/control/ScaleLine';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import olSelect from 'ol/interaction/Select';
import { Options as OlSelectOptions, SelectEvent } from 'ol/interaction/Select';
import Style from 'ol/style/Style';
import WKT from 'ol/format/WKT.js';
import { circular } from 'ol/geom/Polygon';
import { defaults as defaultInteractions } from 'ol/interaction';
import { click as olSelectClick, singleClick } from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { HighlightInfoType, LayerHandlesObject } from './type';
import { highLightStyle } from './presetStyle';
import { equals } from 'ol/coordinate';
import { Options as BaseVectorOptions } from 'ol/layer/BaseVector';
// import SelectEvent from 'ol/interaction/Select';
// import  * from './presetConfig'
export * from './presetConfig';
export * from './presetStyle';

export default class olHelper {
  // ol的map实例
  map!: olMap;
  // 管理需要更新的图层
  layerHandles: Map<string, LayerHandlesObject> = new Map();
  // 点击map数组
  selectHandles: Map<string, olSelect> = new Map();
  // 高亮层,没有自身的style,只用于不被declutter
  highLightLayer = new VectorLayer({
    properties: { name: 'highLightLayer' },
    source: new VectorSource({
      features: [],
    }),
    zIndex: 100, // zIndex全地图最大
    declutter: true, //避免点位重叠
  });
  // 要高亮的数据
  private highlightInfo: HighlightInfoType = {
    id: null, //要高亮要素的唯一标识值
    idKey: null, //要高亮要素的唯一标识符的key
    layerName: null, //图层name
    selectName: null, //select事件的名称
    style: null, //高亮样式
  };

  // 单例
  constructor(target: string, viewOptions = {}) {
    if (!target) {
      throw new Error('target is not defined');
    }
    this.initMap(target, viewOptions);
  }

  /**
   * 初始化地图
   * @param target
   * @param viewOptions
   */
  initMap(target: string, viewOptions: ViewOptions = {}) {
    let defaultView = {
      maxZoom: 22,
      minZoom: 8,
      zoom: 18,
      projection: 'EPSG:4326', // 默认坐标系为4326
    };
    Object.assign(defaultView, viewOptions);
    this.map = new olMap({
      target: target,
      view: new View(defaultView),
      // 天地图加载
      layers: [this.highLightLayer],
      // logo: false,
      // 设置openlayers的控制插件
      controls: [],
      interactions: defaultInteractions({
        doubleClickZoom: false, // 屏蔽双击放大事件
      }),
    });
    if (!(this.map instanceof olMap)) {
      throw new Error('new map error');
    }
    this.map.on('moveend', (evt) => {
      // if (this.layerHandles.length > 0) {
      this.layerHandles?.forEach((value) => {
        value?.updateFunc();
      });
      // }
    });
  }

  // 刷新地图
  refreshMap() {
    this.layerHandles?.forEach((l) => {
      l?.updateFunc();
    });
  }

  // 定位到center
  setMapCenter(center: [number, number], zoom: number | null) {
    // console.log('this.map.getView()', this.map.getView());
    this.map.getView().setCenter(center);
    if (zoom) this.map.getView().setZoom(zoom);
  }

  // wkt 定位
  toWkt(wkt: WKT) {
    let geometry = new WKT().readGeometry(wkt);
    this.map.getView().fit(geometry.getExtent(), { padding: [50, 50, 50, 50] });
  }

  // 通过图层名获取某个图层,只返回单一
  // 只考虑name单一的情况,需要标识多个图层用type
  getLayerByName(name: string) {
    let layer = null;
    let totalLayer = this.map.getLayers().getArray();
    for (let i = 0; i < totalLayer.length; i++) {
      if (totalLayer[i].get('name') == name) {
        layer = totalLayer[i];
        break;
      }
    }
    return layer;
  }

  // 根据properties里的属性筛选图层,返回图层数组
  getLayerByProperty(key: string, value: string) {
    let totalLayer = this.map.getLayers().getArray();
    return totalLayer.filter((item) => item.get(key) == value);
  }

  // 创建唯一name的图层
  createUniLayer(layerName: string, features: Feature[] = [], options: BaseVectorOptions<VectorSource> = {}) {
    let presetOptions = {
      declutter: true,
      zIndex: 1,
      properties: { name: layerName },
      source: new VectorSource({
        features: features,
      }),
    };
    Object.assign(presetOptions, options);
    //创建图层
    let _layer = new VectorLayer(presetOptions);
    // 图层名唯一,第二次加载图层则删除已有同名图层
    let oldLayer = this.getLayerByName(layerName);
    if (oldLayer) {
      this.map.removeLayer(oldLayer);
    }
    // 加入地图
    this.map.addLayer(_layer);
    return _layer;
  }

  /**
   * @description: 创建图层
   * @param layerName 图层名称
   * @param update 更新函数
   * @param options 选项,可以覆盖和融合没有预设的值
   */
  createUpdateLayer(
    layerName: string,
    update = (_layer: VectorLayer<VectorSource>): void => {},
    options: BaseVectorOptions<VectorSource> = {},
  ) {
    let _layer = this.createUniLayer(layerName, [], options);
    let ob = {
      layerName: layerName,
      layer: _layer,
      updateFunc: () => update(_layer),
    };
    // 加入地图,加入图层管理数组
    this.layerHandles.set(layerName, ob);
  }

  // 更新图层
  updateLayerFromFeatures(newFeatures: Feature[], layer: VectorLayer<VectorSource>) {
    let currentSource = layer.getSource();
    if (!currentSource) {
      throw Error(`Unable to preprocessing feature: ${layer}`);
    }
    let extend = this.map.getView().calculateExtent();
    let extendFeatures = currentSource.getFeaturesInExtent(extend);
    let currentAllFeatures = currentSource.getFeatures();
    let zoom = this.map.getView().getZoom() ?? 18;
    let selectedFeature: Feature[] = [];
    this.selectHandles.forEach((s) => (selectedFeature = selectedFeature.concat(s.getFeatures().getArray())));
    // 循环遍历当前所有要素,删除不需要的元素
    currentAllFeatures.forEach((v, i) => {
      //如果对应feature已经高亮，则不进行移除，这样可以看到跨区地名的全貌
      let found = selectedFeature.find((sf) => v.getId() === sf.getId());
      if (found) return;
      // 判断缩放区间,超出的删除
      // 没有zoom的删除
      if (v.get('max_zoom') <= zoom || v.get('min_zoom') > zoom || !v.get('max_zoom') || !v.get('min_zoom')) {
        currentSource.removeFeature(v);
        return;
      }
      // 判断是否在当前视图内,不在就删除
      let inExt = extendFeatures.find((ef) => v.getId() === ef.getId());
      if (!inExt) {
        currentSource.removeFeature(v);
      }
    });
    //避免了重复添加相同的 Feature
    // newFeatures.forEach(f => {
    //   let existingFeature = currentSource.getFeatureById(f.getId());
    //   if (!existingFeature) {
    //     currentSource.addFeature(f);
    //   }
    // });
    // 统一添加新元素
    currentSource.addFeatures(newFeatures);
    // 循环高亮元素,只能放在这里,因为你无法确定要高亮的元素是否存在于当前视口
    if (layer.get('name') === this.highlightInfo.layerName) {
      let features = layer.getSource()?.getFeatures() ?? [];
      this.setHighlightFeature(features);
    }
  }

  // 对比并设置高亮
  private setHighlightFeature(features: Feature[]) {
    if (this.highlightInfo.id && this.highlightInfo.idKey) {
      features.forEach((f) => {
        if (this.highlightInfo.id === f.get(this.highlightInfo.idKey!)) {
          // 加入的对应的点击事件,没有就加入到高亮图层
          if (this.highlightInfo.selectName) {
            let selectHandles = this.selectHandles.get(this.highlightInfo.selectName);
            selectHandles?.getFeatures().clear();
            selectHandles?.getFeatures().push(f);
          } else {
            this.highLightLayer.getSource()?.clear(true);
            this.highLightLayer.getSource()?.addFeature(f);
          }

          // 是否有自定义style
          if (this.highlightInfo.style) {
            if (typeof this.highlightInfo.style === 'function') {
              f.setStyle(this.highlightInfo.style(f, this.map.getView().getResolution()!)!);
            } else {
              f.setStyle(this.highlightInfo.style);
            }
          }
          this.resetHighLightInfo();
        }
      });
    }
  }

  // 重置高亮
  resetHighLightInfo() {
    this.highlightInfo = {
      id: null, //要高亮要素的唯一标识值
      idKey: null, //要高亮要素的唯一标识符的key
      layerName: null, //图层name
      selectName: null, //select事件的名称
      style: null, //高亮样式
    };
  }
  // 定位并且高亮要素
  locateAndHighlight(wkt: WKT, highlightInfo: HighlightInfoType) {
    if (!(this.highlightInfo.id && this.highlightInfo.idKey && this.highlightInfo.layerName && wkt)) {
      throw Error(`Please input the correct parameters.`);
    }
    // 定位,并且保存定位前后的坐标点
    Object.assign(this.highlightInfo, highlightInfo);
    let oldCenter = this.map.getView().getCenter() ?? null;
    let geometry = new WKT().readGeometry(wkt);
    this.map.getView().fit(geometry.getExtent(), { padding: [50, 50, 50, 50] });
    let center = this.map.getView().getCenter() ?? null;

    // 如果地图没有移动,此时不会走到加载要素然后对比的函数里,所以在这里抓取当前视口的要素进行对比
    if (oldCenter && center && equals(oldCenter, center)) {
      let layer = this.layerHandles.get(this.highlightInfo.layerName)?.layer;
      if (layer) {
        let features = layer.getSource()?.getFeatures() ?? [];
        this.setHighlightFeature(features);
      }
    }
  }

  /**
   * 自定义点击事件
   * @param name 事件名称,用于管理事件
   * @param options 可选选项
   */
  useSelect(name: string, options: OlSelectOptions = {}) {
    let selectMode: 'click' | 'multiSelect' = 'click';
    let eventFunc = (event: SelectEvent) => {};

    //默认设置
    let defaultOptions: OlSelectOptions = {
      multi: false, //不是多选,是选重叠的要素
      layers: () => true,
      style: highLightStyle,
      hitTolerance: 10,
      condition: (event): boolean => {
        // 点击
        if (selectMode === 'click') {
          return singleClick(event);
        } else if (selectMode === 'multiSelect') {
          return olSelectClick(event);
        }
        return false;
      },
      toggleCondition: (event): boolean => {
        if (selectMode === 'click') {
          return singleClick(event);
        } else if (selectMode === 'multiSelect') {
          return olSelectClick(event);
        }
        return false;
      },
    };
    Object.assign(defaultOptions, options);

    let selectInstance = new olSelect(defaultOptions);

    // 绑定事件,并且加入高亮图层
    selectInstance.on('select', (event) => {
      // 目的是为了点击两个图层的重叠点时,防止同时触发两个点击事件
      // 点击时暂停所有的点击事件,并记录暂停的点击事件
      let selectKeys = this.selectHandles.keys();
      let activeSelectKeys: string[] = [];
      selectKeys.forEach((key) => {
        let selectHandle = this.selectHandles.get(key);
        if (selectHandle && selectHandle.getActive()) {
          activeSelectKeys.push(key);
          selectHandle.setActive(false);
        }
      });

      // this.highLightLayer.getSource()?.clear(true);
      // event.selected.forEach((f) => {
      //   this.highLightLayer.getSource()?.addFeature(f);
      // });

      // 执行用户自定义函数
      eventFunc(event);

      // 回调结束后恢复所有的点击事件
      activeSelectKeys.forEach((key) => {
        this.selectHandles.get(key)?.setActive(true);
      });
    });

    // 加入地图,并且纳入管理数组
    if (this.selectHandles.get('name')) {
      this.map.removeInteraction(selectInstance);
    }
    this.selectHandles.set(name, selectInstance);
    this.map.addInteraction(selectInstance);

    // setter 设置选择模式函数
    function setSelectMod(mod: typeof selectMode) {
      selectMode = mod;
    }
    // getter 获取选择模式函数
    function getSelectMod() {
      return selectMode;
    }
    // 设置事件函数
    function setEventFunc(func: (event: SelectEvent) => void) {
      eventFunc = func;
    }

    return {
      setSelectMod,
      getSelectMod,
      setEventFunc,
    };
  }

  //自由设置select状态
  //例:activeLayerNameArray传入可点击的图层名数组,inactiveLayerNameArray传非数组或不传,则将其他图层的操作全部禁止,传入空数组则不设置
  setSelectActive(activeLayerNameArray?: string[], inactiveLayerNameArray?: string[]) {
    // 两者都为空时报错
    if (
      (!Array.isArray(activeLayerNameArray) && !Array.isArray(inactiveLayerNameArray)) ||
      (!activeLayerNameArray?.length && !inactiveLayerNameArray?.length)
    ) {
      throw new Error('必须至少指定 activeLayerNameArray 或 inactiveLayerNameArray');
    }
    let allSelectKeys = this.selectHandles.keys();
    if (Array.isArray(activeLayerNameArray)) {
      activeLayerNameArray.forEach((layerName) => {
        this.selectHandles.get(layerName)?.setActive(true);
      });
    }
    if (Array.isArray(inactiveLayerNameArray)) {
      inactiveLayerNameArray.forEach((layerName) => {
        this.selectHandles.get(layerName)?.setActive(false);
      });
    }

    if (!Array.isArray(activeLayerNameArray) && Array.isArray(inactiveLayerNameArray)) {
      allSelectKeys.forEach((layerName) => {
        if (!inactiveLayerNameArray.find((i) => i === layerName)) {
          this.selectHandles.get(layerName)?.setActive(false);
        }
      });
    }

    if (!Array.isArray(inactiveLayerNameArray) && Array.isArray(activeLayerNameArray)) {
      allSelectKeys.forEach((layerName) => {
        if (!activeLayerNameArray.find((i) => i === layerName)) {
          this.selectHandles.get(layerName)?.setActive(true);
        }
      });
    }
  }

  //清除所有选择
  clearAllSelect() {
    this.selectHandles.forEach((selectHandles) => {
      selectHandles.getFeatures().clear();
    });
    this.highLightLayer.getSource()?.clear();
  }
}
