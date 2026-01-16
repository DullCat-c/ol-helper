import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Select, { SelectEvent, Options as OlSelectOptions } from 'ol/interaction/Select';
import olHelper from './olHelper';

// 要高亮的数据
export interface HighlightInfoType {
  //要高亮要素的唯一标识值
  id: string | number | null;
  //要高亮要素的唯一标识符的key
  idKey: string | null;
  //图层名称
  layerName: string | null;
  //select事件的名称
  selectName: string | null;
}

// 管理图层的属性
export interface LayerHandlesObject {
  layerName: string;
  layer: VectorLayer<VectorSource>;
  updateFunc: () => void;
}

// 视图相关属性
export interface mapViewInfoType {
  zoom: number;
  ymin: number;
  ymax: number;
  xmin: number;
  xmax: number;
  [key: string]: any;
}

export type drawTypeEnum = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Square' | 'Box';
export type UseDrawReturn = ReturnType<olHelper['useDraw']>;
// export type useSelectReturn = ReturnType<olHelper['useSelect']>;

export interface useSelectReturn {
  remove: () => void;
  setSelectMod: (mod: 'click' | 'multiSelect') => void;
  getSelectMod: () => 'click' | 'multiSelect';
  setEventFunc: (func: (event: SelectEvent) => void) => void;
  selectInstance: any;
}
