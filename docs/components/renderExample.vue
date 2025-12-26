<template>
  <div class="relative">
    <div id="map" class="w-full h-50vh"></div>
  </div>
</template>

<script setup lang="ts">
import GeoJSON from 'ol/format/GeoJSON';
import olHelper, { highLightStyle2, td4326WMTSPreset } from '../../olHelper/olHelper';
import { geoJsonData, geoJsonData2 } from '../fakeData';
import { Options } from 'ol/interaction/Select';

// console.log('SelectOptions', Options);
onMounted(() => {
  let tdKey = '086d31664864bb1b890c28084f786ca8';
  let _olHelper = new olHelper('map');
  _olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'img_c'));
  _olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'cva_c'));
  _olHelper.setMapCenter([111.94199522379412, 31.81211945837647], 18);
  // let newFeatures = new GeoJSON().readFeatures(geoJsonData);
  // _olHelper.createUniLayer('test', newFeatures);
  _olHelper.createUpdateLayer('test', (_layer) => {
    let newFeatures = new GeoJSON().readFeatures(geoJsonData);
    _olHelper.updateLayerFromFeatures(newFeatures, _layer);
  });

  _olHelper.createUpdateLayer(
    'test2',
    (_layer) => {
      let newFeatures = new GeoJSON().readFeatures(geoJsonData2);
      _olHelper.updateLayerFromFeatures(newFeatures, _layer);
    },
    highLightStyle2,
  );

  // let a = _olHelper.getLayerByName('test');
  // let aa = a ? [a] : [];
  _olHelper.createSelect('test', {
    layers: (_layer) => _layer.get('name') == 'test',
  });

  let a = _olHelper.createSelect('test2', {
    // multiSelect: true,
    layers: (_layer) => _layer.get('name') == 'test2',
  });
  a.setSelectMod('multiSelect');
  // console.log('a.selectMode', a.selectMode);
  a.setEventFunc((event) => {
    console.log('111', 111);
  });
});
</script>
