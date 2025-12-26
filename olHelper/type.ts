import Style, { StyleLike } from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { SelectEvent, Options as OlSelectOptions } from 'ol/interaction/Select';
import Geometry from 'ol/geom/Geometry';
export interface CreateSelectOptions {
  style?: Style;
  multi?: boolean;
  multiSelect?: boolean;
  layers?: OlSelectOptions['layers'];
  hitTolerance?: number;
  cancelFunc?: (event: SelectEvent) => void;
  selectFunc?: (event: SelectEvent) => void;
}

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
