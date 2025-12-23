import Style from 'ol/style/Style';
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
