import olMap from 'ol/Map';
import View from 'ol/View';
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

// 天地图4326底图预设
export function td4326WMTSPreset(tdKey: string, tdType: 'vec_c' | 'cva_c' | 'img_c' | 'cia_c', visible: boolean = true) {
  const projection = olProj.get('EPSG:4326')!; // 设置坐标系为4326
  const projectionExtent = projection.getExtent();
  const size = olExtent.getWidth(projectionExtent) / 256;
  const resolutions = [];
  const matrixIds = [];
  for (let z = 0; z < 19; ++z) {
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
  }
  let layer = tdType.split('_')[0];
  return new TileLayer({
    properties: {
      name: tdType,
      type: 'baseLayer',
    },
    source: new WMTS({
      url: 'http://t{0-7}.tianditu.gov.cn/' + tdType + '/wmts?tk=' + tdKey,
      layer: layer,
      style: 'default',
      matrixSet: 'c',
      format: 'tiles',
      crossOrigin: 'anonymous',
      wrapX: true, // 地图缩小后，防止在一个页面出现多个一样的地图
      tileGrid: new WMTSTileGrid({
        origin: olExtent.getTopLeft(projectionExtent),
        resolutions: resolutions.slice(6, 20),
        matrixIds: matrixIds.slice(6, 20).map((num) => num.toString()),
      }),
    }),
    visible: visible,
  });
}
