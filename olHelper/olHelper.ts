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
import * as olExtent from 'ol/extent';
import WMTS from 'ol/source/WMTS';
import XYZ from 'ol/source/XYZ';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import ScaleLine from 'ol/control/ScaleLine';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import olSelect from 'ol/interaction/Select';
import Style from 'ol/style/Style';
import WKT from 'ol/format/WKT.js';
import { circular } from 'ol/geom/Polygon';
import { defaults as defaultInteractions } from 'ol/interaction';
import { click as olSelectClick } from 'ol/events/condition';
// import  * from './presetConfig'
export * from './presetConfig';
export * from './presetStyle';

export default class olHelper {
  // ol的map实例
  map = null;
  // 管理需要更新的图层
  layerHandles = new Map();
  // 点击map数组
  selectHandles = new Map();
  // 高亮层,没有自身的style,只用于不被declutter
  highLightLayer = new VectorLayer({
    properties: { name: 'highLightLayer' },
    source: new VectorSource(),
    zIndex: 100, // zIndex全地图最大
    declutter: true, //避免点位重叠
  });
  // 要高亮的数据
  highlightInfo = {
    id: null,
    layerName: null,
    counterIdKey: null,
    counterIdFunction: null,
    selectName: null,
  };

  // 单例
  constructor(target: string, viewOptions = {}) {
    if (!target) {
      throw new Error('target is not defined');
    }
    this.initMap(target, viewOptions);
  }

  /**
   * 自定义加载底图
   * @param target
   * @param viewOptions
   */
  initMap(target: string, viewOptions: ViewOptions = {}) {
    let defaultView = {
      maxZoom: 22,
      minZoom: 8,
      zoom: 18,
      projection: olProj.get('EPSG:4326'), // 默认坐标系为4326
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
      interactions: new defaultInteractions({
        doubleClickZoom: false, // 屏蔽双击放大事件
      }),
    });

    this.map.on('moveend', (evt) => {
      // if (this.layerHandles.length > 0) {
      this.layerHandles?.forEach((value) => {
        value?.updateFunc();
      });
      // }
    });
  }

  resetHighLightInfo() {
    this.highlightInfo = {
      id: null,
      layerName: null,
      counterId: null,
      selectName: null,
    };
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
  toWkt(wkt, zoom) {
    let center = this.map.getView().getCenter();
    // console.log(center);
    this.map.getView().setCenter(center[0] + 0.00001, center[1]);
    // wkt生成feature

    let feature = new WKT().readGeometry(wkt);
    this.map.getView().fit(feature);
    if (zoom) {
      this.map.getView().setZoom(zoom);
    } else {
      this.map.getView().setZoom(this.map.getView().getZoom() < 16 ? 16 : this.map.getView().getZoom());
    }
  }

  // 定位并且高亮元素
  //TODO::
  locateAndHighLight(wkt, zoom) {
    // wkt生成feature
    let oldCenter = this.map.getView().getCenter();
    let feature = new WKT().readGeometry(wkt);
    this.map.getView().fit(feature);
    if (zoom) {
      this.map.getView().setZoom(18);
    } else {
      this.map.getView().setZoom(this.map.getView().getZoom() - 2);
    }
    let newCenter = this.map.getView().getCenter();

    //说明地图没动,此时触发不了render里面的高亮设置
    if (oldCenter[0] === newCenter[0] && oldCenter[1] === newCenter[1]) {
    }
    // let a = this.map.getView().getCenter();
    // console.log(oldCenter,newCenter);
    // let zoom = this.map.getView().getZoom();
  }

  // geometry类型 转 wkt
  static geometryToWkt(geometry) {
    return new WKT().writeGeometry(geometry);
  }

  // wkt转坐标点
  static wktToCoord(wkt) {
    let feature = new WKT().readGeometry(wkt);
    return feature.flatCoordinates;
  }

  // 点返回圆
  static pointToCircle(point, radius) {
    let coord = MapBase.wktToCoord(point);
    let circularPolygon = circular(coord, radius);
    return new WKT().writeGeometry(circularPolygon);
  }

  // 返回中心点
  static getWktCenter(wkt) {
    let geometry = new WKT().readGeometry(wkt);
    // console.log(geometry.getType());
    if (geometry.getType() === 'Point') {
      return geometry.flatCoordinates;
    } else if (geometry.getType() === 'LineString') {
      return geometry.getCoordinateAt(0.5);
    } else if (geometry.getType() === 'MultiLineString') {
      return olExtent.getCenter(geometry.getExtent());
    } else if (geometry.getType() === 'Polygon') {
      let extent = geometry.getExtent();
      let centerX = (extent[0] + extent[2]) / 2;
      let centerY = (extent[1] + extent[3]) / 2;
      return [centerX, centerY];
      // return geometry.getInteriorPoint().getCoordinates();
    }
  }

  // 设置高亮
  setHighlight(addrSign, style, layer) {
    this.hl_addrSign = addrSign;
    this.hl_style = style;
    this.hl_layer = layer;
  }
  // 通过图层名获取某个图层,只返回单一
  getLayerByName(name) {
    let layer = null;
    let totalLayer = this.map.getLayers().getArray();
    totalLayer.forEach((item) => {
      console.log("item.get('name')", item.get('name'));
      if (item.get('name') == name) {
        layer = item;
      }
    });
    return layer;
  }

  // 根据properties里的属性筛选图层,返回图层数组
  getLayerByProperty(key, value) {
    let totalLayer = this.map.getLayers().getArray();
    return totalLayer.filter((item) => item.get(key) == value);
  }

  //设置全部选择句柄的状态
  setAllSelectActive(boolean, selects = []) {
    this.selectHandles.forEach((selectHandles, key) => {
      // console.log(selectHandles,key);
      if (selects.length > 0) {
        if (selects.find((i) => i === key)) {
          selectHandles.setActive(boolean);
          if (!boolean) {
            selectHandles.getFeatures().clear();
          }
        }
      } else {
        selectHandles.setActive(boolean);
      }
    });
  }

  //清除所有高亮
  clearAllSelect() {
    this.selectHandles.forEach((selectHandles) => {
      selectHandles.getFeatures().clear(true);
    });
    this.highLightLayer.getSource().clear();
  }

  /**
   * @description: 用于加载任意类型的图层
   * @param {*} layerName 图层名称
   * @param {*} update 更新函数，由两部分组成，更新函数和参数
   * @param {*} style 样式，可以支持样式函数
   * @param {*} options 选项,可以覆盖和融合没有预设的值
   * @return {*}
   */
  addUpdateLayer(layerName: string, update = () => {}, style, options = {}) {
    let presetOptions = {
      declutter: true,
      zIndex: 1,
    };
    Object.assign(presetOptions, options);
    //自定义图层
    let _layer = new VectorLayer({
      declutter: presetOptions.declutter,
      style: style,
      zIndex: presetOptions.zIndex,
      properties: { name: layerName },
      source: new VectorSource({
        features: [],
      }),
    });
    let ob = {
      layerName: layerName,
      layer: _layer,
      updateFunc: () => update(_layer),
    };

    // 图层名唯一,第二次加载图层则删除已有同名图层
    // let layer = this.getLayerByName(layerName);
    // if (layer) {
    //   // this.layers = this.layers.filter((l) => l.layerName != layerName);
    //   this.map.removeLayer(layer);
    // }

    // 加入地图,加入图层管理数组
    // this.layers.push(ob);
    // 图层名唯一,第二次加载图层则删除已有同名图层
    if (this.layerHandles.get(layerName)) {
      this.map.removeLayer(layer);
    }
    this.layerHandles.set(layerName, ob);
    this.map.addLayer(_layer);
  }

  // 更新图层
  updateLayerFromGeoJson(geoJson, layer) {
    // console.time(layer.get('name'));
    let newFeatures = new GeoJSON().readFeatures(geoJson);
    this.preprocessingFeature(newFeatures, layer);
  }
  preprocessingFeature(newFeatures, layer) {
    let currentSource = layer.getSource();
    let extend = this.map.getView().calculateExtent();
    let extendFeatures = currentSource.getFeaturesInExtent(extend);
    let currentAllFeatures = currentSource.getFeatures();
    let zoom = this.map.getView().getZoom();
    let selectedFeature = this.highLightLayer.getSource().getFeatures();
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
    if (this.highlightInfo.id) {
      this.highlight(layer);
    }
  }
  //设置高亮：解决异步中，定位高亮的问题
  highlight(layer) {
    let features = [];
    // 如果设置了高亮层,就只遍历高亮层,如果没有,就都遍历
    if (this.highlightInfo.id) {
      if (layer.get('name') === this.highlightInfo.layerName) {
        features = layer?.getSource()?.getFeatures();
      } else {
        return;
      }
    } else {
      features = layer?.getSource()?.getFeatures();
    }
    features?.forEach((f) => {
      //   获取对应的id
      let counterId = f.getId();
      if (this.highlightInfo.counterIdFunction && typeof this.highlightInfo.counterIdFunction === 'function') {
        counterId = this.highlightInfo.counterId(f);
      } else if (this.highlightInfo.counterIdKey) {
        counterId = f.get(this.highlightInfo.counterIdKey);
      }
      //  是否有其他的select名,没有则和图层名一致
      let selectName = this.highlightInfo.selectName ? this.highlightInfo.selectName : this.highlightInfo.layerName;
      if (this.highlightInfo.id === counterId) {
        let selectHandles = this.selectHandles.get(selectName);
        this.highLightLayer.getSource().clear();
        this.highLightLayer.getSource().addFeature(f);
        // 以前的写法,加入到点击事件,但是只有点击的样式,无法触发点击事件
        // 不加入到点击事件,有的点会被盖住无法高亮
        selectHandles.getFeatures().clear();
        selectHandles.getFeatures().push(f);
        this.resetHighLightInfo();
      }
    });
  }

  /**
   * @description: 自定义点击事件
   * @param {String} name 事件名称,用于管理事件
   * @param {*} style 样式
   * @param {Function} s_func 点击事件
   * @param {*} options 可选选项
   * @return {void}
   */
  selectFactory(name, style, s_func = () => {}, options = {}) {
    //移除点击
    let presetOptions = {
      multi: false, //不是多选,是选重叠的要素
      layers: [],
      multiClick: false,
      hitTolerance: 10,
      cancelFunc: () => {},
    };
    Object.assign(presetOptions, options);

    // 实例选择事件
    let selectOptions = {
      style: style,
      multi: presetOptions.multi,
      layers: presetOptions.layers,
      hitTolerance: presetOptions.hitTolerance,
    };

    if (presetOptions.multiClick) {
      selectOptions.condition = olSelectClick;
      selectOptions.toggleCondition = olSelectClick;
    }

    let selectInstance = new olSelect(selectOptions);

    // 绑定事件,并且加入高亮图层
    selectInstance.on('select', (event) => {
      if (event.selected.length !== 0) {
        this.highLightLayer.getSource().clear(true);
        event.selected.forEach((f) => {
          this.highLightLayer.getSource().addFeature(f);
        });
        s_func(event);
      } else {
        event.deselected.forEach((f) => {
          this.highLightLayer.getSource().removeFeature(f);
        });
        presetOptions.cancelFunc(event);
      }
    });

    // 加入地图,并且纳入管理数组
    if (this.selectHandles.get('name')) {
      this.map.removeInteraction(selectInstance);
    }
    this.selectHandles.set(name, selectInstance);
    this.map.addInteraction(selectInstance);
  }
}
