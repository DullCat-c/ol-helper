import Style, { StyleLike } from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { SelectEvent, Options as OlSelectOptions } from 'ol/interaction/Select';
import Geometry from 'ol/geom/Geometry';

// 要高亮的数据
export interface HighlightInfoType {
  //要高亮要素的唯一标识值
  id: string | number | null;
  //要高亮要素的唯一标识符的key
  idKey: string | null;
  //图层name
  layerName: string | null;
  //select事件的名称
  selectName: string | null;
  //高亮样式
  style: StyleLike | null;
}

// 管理图层的属性
export interface LayerHandlesObject {
  layerName: string;
  layer: VectorLayer<VectorSource>;
  updateFunc: () => void;
}
