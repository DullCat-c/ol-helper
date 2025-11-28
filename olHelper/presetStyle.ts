import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Stroke from 'ol/style/Stroke';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';

// 原生绘制样式
export const walkDrawStyle = new Style({
  // 绘制几何图形的样式
  fill: new Fill({
    color: 'rgb(38,88,180,0.2)',
  }),
  stroke: new Stroke({
    color: 'rgb(255, 0, 0)',
    width: 8,
  }),
  image: new CircleStyle({
    radius: 5,
    // stroke: new Stroke({
    // color: 'rgb(255, 0, 0)',
    // width: 10,
    // }),
    fill: new Fill({
      color: 'rgba(255, 0, 0)',
    }),
  }),
  zIndex: 99999,
});
