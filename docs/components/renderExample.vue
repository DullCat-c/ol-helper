<template>
  <div class="relative">
    <el-descriptions v-for="f in featureObjs" :key="f.id" column="4">
      <el-descriptions-item label="图层名">{{ f.layerName }}</el-descriptions-item>
      <el-descriptions-item label="唯一标识符">{{ f.idKey }}</el-descriptions-item>
      <el-descriptions-item label="唯一标识符的值">{{ f.id }}</el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button type="primary" @click="locateFeature(f)">定位</el-button>
      </el-descriptions-item>
    </el-descriptions>
    <switchBaseLayerExample ref="mapRef"></switchBaseLayerExample>
  </div>
</template>

<script setup lang="ts">
import GeoJSON from 'ol/format/GeoJSON';
import switchBaseLayerExample from './switchBaseLayerExample.vue';
import olHelper, { colorStyleFunc, td4326WMTSPreset } from '../../olHelper/olHelper';
import { geoJsonData, geoJsonData2 } from '../fakeData';
import { Options } from 'ol/interaction/Select';
import { drawTypeEnum } from '../../olHelper/type';

let mapRef = ref<typeof switchBaseLayerExample>();

let _olHelper: olHelper;

let featureObjs = [
  {
    layerName: 'test1',
    id: 'layer1.XJ8hjX',
    idKey: 'id',
  },
  {
    layerName: 'test1',
    id: 'layer1.OYjYFT',
    idKey: 'id',
  },
];

function locateFeature(feature: any) {
  _olHelper.locateAndHighlight(feature);
}

// function locateFeatureAndModifyColor(feature: any) {
//   _olHelper.locateAndHighlight(feature);
//   let fs = _olHelper.highLightLayer.getSource()?.getFeatures();
//   if (fs?.[0]) {
//     fs[0].setStyle(colorStyleFunc('black'));
//   }
// }

onMounted(() => {
  if (mapRef.value) {
    _olHelper = mapRef.value.getHelper();
    let newFeatures = new GeoJSON().readFeatures(geoJsonData);
    _olHelper.createUniLayer('test1', newFeatures, { style: colorStyleFunc('blue') });
    // let newFeatures2 = new GeoJSON().readFeatures(geoJsonData2);
    // _olHelper.createUniLayer('test2', newFeatures2, { style: colorStyleFunc('yellow') });
  }
});
</script>
