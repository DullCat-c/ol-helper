<script setup lang="ts">
import switchBaseLayerExample from '../switchBaseLayerExample.vue';
import olHelper from '../../../olHelper/olHelper';
import { drawTypeEnum, UseDrawReturn } from '../../../olHelper/type';
import WKT from 'ol/format/WKT.js';
import GeoJSON from 'ol/format/GeoJSON';

let mapRef = ref<typeof switchBaseLayerExample>();
let drawType: Ref<drawTypeEnum | ''> = ref('');

let _olHelper: olHelper;
onMounted(() => {
  if (mapRef.value) {
    _olHelper = mapRef.value.getHelper();
  }
});

let draw: UseDrawReturn;
function startDraw() {
  if (!drawType.value) {
    ElMessage.error('请选择绘制类型');
    return;
  }
  if (draw) {
    draw.remove();
  }
  draw = _olHelper.useDraw(drawType.value);
  let modify = _olHelper.useModify();

  modify.setEventFunc((event) => {
    setTimeout(() => {
      startGenerate();
    }, 100);
  });

  draw.setEventFunc((event) => {
    setTimeout(() => {
      startGenerate();
    }, 100);
  });
}

function clearDrawLayer() {
  _olHelper.clearHighLightSource();
}

let generateType: Ref<'wkt' | 'geojson'> = ref('wkt');
let generateData = ref('');
function startGenerate() {
  let features = _olHelper.highLightLayer.getSource()?.getFeatures();
  if (features) {
    if (generateType.value === 'geojson') {
      let geojson = new GeoJSON();
      generateData.value = geojson.writeFeatures(features, {
        featureProjection: 'EPSG:4326',
      });
    } else {
      let wkt = new WKT();
      generateData.value = wkt.writeFeatures(features, {
        featureProjection: 'EPSG:4326',
      });
    }
  }
}

function renderFromData() {
  _olHelper.highLightLayer.getSource()?.clear();
  let format;
  if (generateType.value === 'geojson') {
    format = new GeoJSON();
  } else {
    format = new WKT();
  }
  try {
    let fs = format.readFeatures(generateData.value);
    _olHelper.highLightLayer.getSource()?.addFeatures(fs);
    let firstFeature = fs[0]?.getGeometry()?.getExtent();
    if (firstFeature) {
      _olHelper.map.getView().fit(firstFeature, { padding: [50, 50, 50, 50] });
    }
  } catch (e) {
    ElMessage.error('数据格式错误');
  }
}

// let
// let proptity = ref(['Option A', 'Option B']);
</script>

<template>
  <div class="flex items-center my-4 gap-x-2">
    <span>绘制:</span>
    <el-radio-group v-model="drawType" text-color="#fff" fill="#6c6cff" @change="startDraw">
      <el-radio-button label="点" value="Point" />
      <el-radio-button label="线" value="LineString" />
      <el-radio-button label="面" value="Polygon" />
      <el-radio-button label="圆形" value="Circle" />
      <el-radio-button label="正方形" value="Square" />
      <el-radio-button label="矩形" value="Box" />
    </el-radio-group>
    <div>
      <el-button @click="clearDrawLayer" type="primary">清空图层</el-button>
      <el-button
        @click="
          draw?.remove();
          drawType = '';
        "
        type="danger"
        >结束绘制</el-button
      >
    </div>
  </div>
  <switchBaseLayerExample ref="mapRef"></switchBaseLayerExample>
  <div class="flex items-center my-4 gap-x-2">
    <span>数据:</span>
    <el-radio-group v-model="generateType" text-color="#fff" fill="#6c6cff" @change="startGenerate">
      <el-radio-button label="wkt" value="wkt" />
      <el-radio-button label="geoJson" value="geojson" />
    </el-radio-group>
    <div>
      <el-button @click="generateData = ''" type="primary">清空数据</el-button>
      <el-button @click="renderFromData" type="success">渲染</el-button>
      <el-button
        @click="
          draw?.remove();
          drawType = '';
        "
        type="danger"
        >结束绘制</el-button
      >
    </div>
  </div>

  <!--  <el-checkbox-group v-model="checkList">-->
  <!--    <el-checkbox label="Option A" value="Value A" />-->
  <!--    <el-checkbox label="Option B" value="Value B" />-->
  <!--    <el-checkbox label="Option C" value="Value C" />-->
  <!--  </el-checkbox-group>-->

  <el-input v-model="generateData" :rows="20" type="textarea" resize="none" />
</template>

<style scoped></style>
