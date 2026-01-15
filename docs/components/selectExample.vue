<template>
  <div class="relative">
    <el-descriptions v-for="f in selectObjs" :key="f.name" column="2">
      <el-descriptions-item label="点击事件名称">{{ `${f.name}(${f.name == 'test1' ? '蓝色' : '黄色'})` }}</el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button type="primary" @click="createSelect(f)" :disabled="f.instance">创建</el-button>
        <el-button type="primary" @click="destroySelect(f)" :disabled="!f.instance">销毁</el-button>
        <el-button type="primary" @click="switchMode(f)" :disabled="!f.instance">{{
          f.mode === 'click' ? '切换多选' : '切换单选'
        }}</el-button>
        <el-button type="primary" @click="forbiddenSelect(f)" :disabled="!f.instance">{{
          f.forbidden ? '启用' : '禁用'
        }}</el-button>
        <el-button type="primary" @click="clearSelect(f)" :disabled="!f.instance">清空</el-button>
      </el-descriptions-item>
    </el-descriptions>

    <switchBaseLayerExample ref="mapRef"></switchBaseLayerExample>
  </div>
</template>

<script setup lang="ts">
import GeoJSON from 'ol/format/GeoJSON';
import switchBaseLayerExample from './switchBaseLayerExample.vue';
import olHelper, { colorStyleFunc, highLightStyle, highLightStyle2, td4326WMTSPreset } from '../../olHelper/olHelper';
import { geoJsonData, geoJsonData2 } from '../fakeData';
import { Options } from 'ol/interaction/Select';
import { useSelectReturn } from '../../olHelper/type';

let mapRef = ref<typeof switchBaseLayerExample>();

let _olHelper: olHelper;

let selectObjs = ref<SelectObj[]>([
  {
    name: 'test1',
    instance: undefined,
    forbidden: false,
    mode: 'click',
  },
  {
    name: 'test2',
    instance: undefined,
    forbidden: false,
    mode: 'click',
  },
]);

type SelectObj = {
  name: string;
  instance?: useSelectReturn;
  forbidden: boolean;
  mode: 'click' | 'multiSelect';
};

let test1Select: useSelectReturn;
onMounted(() => {
  if (mapRef.value) {
    _olHelper = mapRef.value.getHelper();
    let newFeatures = new GeoJSON().readFeatures(geoJsonData);
    _olHelper.createUniLayer('test1', newFeatures, { style: colorStyleFunc('blue') });
    let newFeatures2 = new GeoJSON().readFeatures(geoJsonData2);
    _olHelper.createUniLayer('test2', newFeatures2, { style: colorStyleFunc('yellow') });
    // selectObjs.value[0].instance = _olHelper.useSelect('test1', {
    //   layers: (layer) => layer.get('name') === 'test1',
    // });
  }
});

function createSelect(f: SelectObj) {
  f.instance = _olHelper.useSelect(f.name, {
    layers: (layer) => layer.get('name') === f.name,
  });
}

function destroySelect(f: SelectObj) {
  f.instance?.remove();
  f.instance = undefined;
}

function clearSelect(f: SelectObj) {
  f.instance?.selectInstance.getFeatures().clear();
}

function forbiddenSelect(f: SelectObj) {
  f.forbidden = !f.forbidden;
  if (f.forbidden) {
    _olHelper.setSelectActive([f.name], []);
  } else {
    _olHelper.setSelectActive([], [f.name]);
  }
}

function switchMode(f: SelectObj) {
  if (f.mode === 'click') {
    f.mode = 'multiSelect';
  } else {
    f.mode = 'click';
  }
  f.instance?.setSelectMod(f.mode);
}
</script>
