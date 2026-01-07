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

let dialogVisible = ref(false);
// let
let propertiesChecked = ref<string[]>([]);
let propertiesList = ref([
  {
    key: '',
    value: '',
    id: randomString(6),
  },
]);

function addProperty() {
  propertiesList.value.push({
    key: '',
    value: '',
    id: randomString(6),
  });
}

function deleteProperty(index: number) {
  propertiesList.value.splice(index, 1);
}

// 移除要素的properties
function removeFeatureProperties() {
  let fs = _olHelper.highLightLayer.getSource()?.getFeatures();
  fs?.forEach((feature) => {
    let keys = feature.getKeys().filter((key) => key !== 'geometry');
    keys.forEach((key) => {
      feature.unset(key);
    });
    feature.setId(undefined);
  });
  startGenerate();
}

// 添加要素的properties
function addFeatureProperties() {
  let fs = _olHelper.highLightLayer.getSource()?.getFeatures();
  let properties = propertiesList.value
    .filter((item) => propertiesChecked.value.includes(item.id))
    .reduce((acc: { [key: string]: string }, cur) => {
      console.log('cur', cur);
      acc[cur.key] = cur.value;
      return acc;
    }, {});
  console.log('fs', fs);
  fs?.forEach((feature) => {
    feature.setProperties(properties);
    if (idInfo.checked) {
      feature.setId(idInfo.id + randomString(6));
    }
  });
  startGenerate();
}

let idInfo = reactive({
  checked: false,
  id: '',
});

// 生成指定长度的随机字符串
function randomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 天地图接口搜索
let loading = ref(false);
let selectData = ref({});
let remoteOptions = ref<
  {
    address: string;
    gbCode: string;
    lonlat: string;
    name: string;
  }[]
>([]);
function remoteMethod(keyword: string) {
  if (!keyword.length) {
    return;
  }
  let mapPack = _olHelper.getMapInfo();
  let param = {
    keyWord: keyword,
    start: 0,
    count: 30,
    queryType: 4,
    level: mapPack.zoom.toString(),
    mapBound: [mapPack.xmax, mapPack.ymax, mapPack.xmin, mapPack.ymin].join(','),
  };
  loading.value = true;
  getTianditu(param).then((res) => {
    loading.value = false;
    remoteOptions.value = res?.suggests ?? [];
  });
}

function jumpTianditu(value: string) {
  let item = JSON.parse(value);
  if (item?.lonlat) {
    let pointArr = item.lonlat.split(',');
    _olHelper.wktTempRender(`POINT(${pointArr[0]} ${pointArr[1]})`);
  } else {
    ElMessage.error('该地名暂无定位!');
  }
}

// 天地图搜索接口
async function getTianditu(postStr: TianDiTuSearchStrParam) {
  const params = new URLSearchParams({
    postStr: JSON.stringify(postStr),
    type: 'query',
    tk: 'eff04facf768eb72adaea1adfe2f5614',
  });
  let f = await fetch(`https://api.tianditu.gov.cn/v2/search?${params}`);
  return f.json();
}
interface TianDiTuSearchStrParam {
  keyWord: string;
  level: string;
  mapBound: string;
  queryType: number;
  start: number;
  count: number;
}
</script>

<template>
  <div class="flex items-center my-4 gap-col-2">
    <div>搜索天地图地名:</div>
    <el-select
      v-model="selectData"
      filterable
      @change="jumpTianditu"
      remote
      placeholder="输入关键字"
      :remote-method="remoteMethod"
      :loading="loading"
      style="width: 240px">
      <el-option v-for="item in remoteOptions" :key="item.gbCode" :label="item.name" :value="JSON.stringify(item)" />
    </el-select>
  </div>

  <div class="flex items-center my-4 gap-x-2 flex-wrap gap-y-2">
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
  <div class="flex items-center my-4 gap-x-2 flex-wrap gap-y-2">
    <span>数据:</span>
    <el-radio-group v-model="generateType" text-color="#fff" fill="#6c6cff" @change="startGenerate">
      <el-radio-button label="wkt" value="wkt" />
      <el-radio-button label="geoJson" value="geojson" />
    </el-radio-group>
    <div>
      <el-button @click="generateData = ''" type="primary">清空数据</el-button>
      <el-button @click="renderFromData" type="success">渲染</el-button>
      <el-button @click="dialogVisible = true" type="primary" v-if="generateType === 'geojson'">设置properties</el-button>
    </div>
  </div>

  <el-input v-model="generateData" :rows="20" type="textarea" resize="none" />

  <el-dialog v-model="dialogVisible" title="设置properties" width="400" align-center>
    <div class="mb-2">
      <el-button type="primary" @click="addProperty"> 添加属性 </el-button>
    </div>
    <div class="h-40vh overflow-y-auto">
      <el-checkbox v-model="idInfo.checked" class="">
        <el-input v-model="idInfo.id" class="">
          <template #prepend>前缀</template>
          <template #append>随机值</template>
        </el-input>
      </el-checkbox>
      <el-checkbox-group v-model="propertiesChecked">
        <el-checkbox :value="properties.id" v-for="(properties, index) in propertiesList" :key="properties.id" class="my-2 !mr-0">
          <template class="flex items-center gap-x-4">
            <el-input v-model="properties.key">
              <template #prepend>键</template>
            </el-input>
            <el-input v-model="properties.value">
              <template #prepend>值</template>
            </el-input>
            <el-button type="danger" text bg @click="deleteProperty(index)">删除</el-button>
          </template>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="removeFeatureProperties"> 移除所有属性 </el-button>
        <el-button type="primary" @click="addFeatureProperties"> 注入 </el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
