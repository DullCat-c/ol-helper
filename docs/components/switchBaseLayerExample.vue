<template>
  <div class="relative">
    <div class="absolute top-4 z-2 flex justify-center w-full">
      <div class="flex items-center">
        <div
          class="hover:text-white hover:bg-blue-600 bg-white border-2 border-blue-200 mr-2 rounded-xl has-checked:bg-blue-600 has-checked:text-white">
          <input type="radio" id="img" name="layer" value="img" checked class="hidden" />
          <label for="img" class="h-10 p-2 flex items-center">影像底图</label>
        </div>
        <div
          class="hover:text-white hover:bg-blue-600 bg-white border-2 border-blue-200 mr-2 rounded-xl has-checked:bg-blue-600 has-checked:text-white">
          <input type="radio" id="vec" name="layer" value="vec" class="hidden" />
          <label for="vec" class="h-10 p-2 flex items-center">矢量底图</label>
        </div>
      </div>
    </div>
    <div id="map" class="w-full h-50vh"></div>
  </div>
</template>

<script setup lang="ts">
import olHelper, { td4326WMTSPreset } from '../../olHelper/olHelper';

let _olHelper = reactive({});
onMounted(() => {
  let tdKey = '086d31664864bb1b890c28084f786ca8';
  _olHelper = new olHelper('map');
  // Object.assign(_olHelper, new olHelper('map'))
  _olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'img_c'));
  _olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'cva_c'));
  _olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'vec_c', false));
  _olHelper.map.addLayer(td4326WMTSPreset(tdKey, 'cva_c', false));

  _olHelper.setMapCenter([114.393569, 30.50846], 18);

  _olHelper.map.a = 1;
  console.log('_olHelper', _olHelper);
  // 获取DOM元素
  const option1 = document.getElementById('img');
  const option2 = document.getElementById('vec');

  // 添加事件监听器
  option1.addEventListener('change', handleRadioChange);
  option2.addEventListener('change', handleRadioChange);

  // 事件处理函数
  function handleRadioChange(event) {
    const selectedValue = event.target.value;
    closeAllBaseLayer();
    if (selectedValue === 'img') {
      _olHelper.getLayerByName('img_c').setVisible(true);
      _olHelper.getLayerByName('cva_c').setVisible(true);
    } else {
      _olHelper.getLayerByName('vec_c').setVisible(true);
      _olHelper.getLayerByName('cva_c').setVisible(true);
    }
  }

  // 关闭所有底图,td4326WMTSPreset函数生成的图层会自带type属性,值为baseLayer
  function closeAllBaseLayer() {
    let totalLayer = _olHelper.map.getLayers().getArray();
    totalLayer
      .filter((item) => item.get('type') === 'baseLayer')
      .forEach((layer) => {
        layer?.setVisible(false);
      });
  }
});

function getterHelper() {
  return _olHelper;
}

// let a = 1;
defineExpose({ getterHelper });
</script>

<style scoped></style>
