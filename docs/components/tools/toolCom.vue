<script setup lang="ts">
import switchBaseLayerExample from '../switchBaseLayerExample.vue';
import olHelper from '../../../olHelper/olHelper';
import { drawTypeEnum, UseDrawReturn } from '../../../olHelper/type';
import WKT from 'ol/format/WKT.js';
import GeoJSON from 'ol/format/GeoJSON';
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { foldAll, unfoldAll } from '@codemirror/language';
import { linter, Diagnostic } from '@codemirror/lint';
import * as olExtent from 'ol/extent';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

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
      nextTick(() => {
        codemirrorCommand('format');
      });
    } else {
      let wkt = new WKT();
      generateData.value = features
        .map((f) => {
          return wkt.writeFeature(f, {
            featureProjection: 'EPSG:4326',
          });
        })
        .join('\n');
    }
  }
}

function renderFromData() {
  try {
    _olHelper.highLightLayer.getSource()?.clear();
    let fs: Feature<Geometry>[] = [];
    if (generateType.value === 'wkt') {
      let format = new WKT();
      // 核心修改：如果是 WKT，按行拆分后逐个读取
      const wktStrings = generateData.value.split('\n').filter((s) => s.trim());
      wktStrings.forEach((wkt) => {
        const f = (format as WKT).readFeature(wkt);
        if (f) fs.push(f);
      });
    } else {
      let format = new GeoJSON();
      fs = format.readFeatures(generateData.value) as Feature<Geometry>[];
    }
    if (fs.length > 0) {
      _olHelper.highLightLayer.getSource()?.addFeatures(fs);
      // 获取所有要素的合并范围进行定位
      let extent = olExtent.createEmpty();
      fs.forEach((f) => {
        const geom = f.getGeometry();
        if (geom) olExtent.extend(extent, geom.getExtent());
      });
      _olHelper.map.getView().fit(extent, { padding: [50, 50, 50, 50] });
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
    _olHelper.highLightLayer.getSource()?.clear();
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

// 自定义中文 JSON 校验器
const jsonLinter = linter((view) => {
  console.log('1', 1);
  jsonError.value = '';
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc.toString();
  if (!doc.trim()) return diagnostics;
  try {
    JSON.parse(doc);
  } catch (e: any) {
    // 尝试解析错误位置 (V8 引擎通常在 message 中包含位置)
    const loc = e.message.match(/position (\d+)/);
    const pos = loc ? parseInt(loc[1]) : 0;
    diagnostics.push({
      from: Math.max(0, pos - 1),
      to: Math.min(pos + 1, doc.length),
      severity: 'error',
      message: e.message
        .replace('Bad control character in string literal', '字符串中的控制字符错误')
        .replace('Unexpected token', '非法字符')
        .replace('in JSON at position', '位置')
        .replace('line', '行')
        .replace('column', '列')
        .replace('Unexpected end of JSON input', 'JSON 格式不完整'),
    });
    jsonError.value = diagnostics[0].message;
    console.log('diagnostics', diagnostics);
  }
  return diagnostics;
});

const jsonError = ref('');
const extensions = [json(), jsonLinter];

// Codemirror EditorView instance ref
const view = shallowRef();
const handleReady = (payload: any) => {
  view.value = payload.view;
  // console.log('view.value', view.value);
};

// Status is available at all times via Codemirror EditorView
// const getCodemirrorStates = () => {
//   const state = view.value.state;
//   const ranges = state.selection.ranges;
//   const selected = ranges.reduce((r, range) => r + range.to - range.from, 0);
//   const cursor = ranges[0].anchor;
//   const length = state.doc.length;
//   const lines = state.doc.lines;
//   // more state info ...
//   // return ...
// };

function codemirrorCommand(command: 'format' | 'compress' | 'expand' | 'fold') {
  if (command === 'format') {
    try {
      const jsonObj = JSON.parse(generateData.value);
      const formatted = JSON.stringify(jsonObj, null, 2);
      generateData.value = formatted;
      jsonError.value = '';
    } catch (e: any) {
      jsonError.value = e.message;
    }
  } else if (command === 'compress') {
    try {
      const jsonObj = JSON.parse(generateData.value);
      const compressed = JSON.stringify(jsonObj);
      generateData.value = compressed;
      jsonError.value = '';
    } catch (e: any) {
      jsonError.value = e.message;
    }
  } else if (command === 'expand') {
    if (view.value) {
      unfoldAll(view.value);
    }
  } else if (command === 'fold') {
    if (view.value) {
      foldAll(view.value);
    }
  }
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

  <el-input v-model="generateData" :rows="20" type="textarea" resize="none" v-if="generateType === 'wkt'" />

  <div v-else>
    <div class="my-2">
      <el-button size="small" type="default" @click="codemirrorCommand('format')">格式化</el-button>
      <el-button size="small" type="default" @click="codemirrorCommand('compress')">压缩</el-button>
      <el-button size="small" type="default" @click="codemirrorCommand('expand')">全展开</el-button>
      <el-button size="small" type="default" @click="codemirrorCommand('fold')">全折叠</el-button>
    </div>
    <!--    TODO: 美化样式-->
    <codemirror
      v-model="generateData"
      placeholder="输入..."
      :class="{ 'json-error-theme': !!jsonError }"
      :style="{ height: '40vh', border: '1px solid #DCDFE6' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady" />
    <div v-if="jsonError" class="error-message">
      {{ jsonError }}
    </div>
  </div>

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

<style scoped>
/* 报错时的背景色 */
.json-error-theme :deep(.cm-editor) {
  background-color: #fff0f0 !important; /* 浅红色背景 */
}
</style>
