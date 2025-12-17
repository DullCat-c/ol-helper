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

    <switchBaseLayerExample ref="map" class="map"></switchBaseLayerExample>
    <!--    <div id="map" class="w-full h-50vh"></div>-->
  </div>
</template>

<script setup lang="ts">
import olHelper, { td4326WMTSPreset } from '../../olHelper/olHelper';
import switchBaseLayerExample from './switchBaseLayerExample.vue';

let map = ref(null);
onMounted(() => {
  // console.log('map', map.value.getterHelper());
  // setTimeout(()=>{
  //
  // },5000)
});
</script>
