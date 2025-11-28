<template>
  <div>
    <div id="map" class="w-full h-50vh"></div>

    <div>
      <div>影像</div>
      <div>矢量</div>
    </div>
  </div>
</template>

<script setup>
import olHelper from '../../olHelper/olHelper';

onMounted(() => {
  let tdkey = 'eff04facf768eb72adaea1adfe2f5614';
  // let i = new olHelper('map').get('map');
  let olHelperInstance = new olHelper('map');
  olHelperInstance.mapInstance.addLayer(olHelperInstance.td4326WMTSPreset(tdkey, 'img_c'));
  olHelperInstance.mapInstance.addLayer(olHelperInstance.td4326WMTSPreset(tdkey, 'cva_c'));
  // i.setMapCenter
  i.setMapCenter([114.393569, 30.50846], 18);
  // let i2 = new olHelper('map2');
  // i2.mapInstance.addLayer(i.td4326WMTSPreset(tdkey, 'img_c'));
  // i2.mapInstance.addLayer(i.td4326WMTSPreset(tdkey, 'cva_c'));
  // i
  // console.log('i', i.mapInstance.getLayers().getArray());

  let totalLayer = i.mapInstance.getLayers().getArray();

  totalLayer.forEach((item) => {
    // console.log("item.get('name')", item.get('name'));
    // if (item.get('name') == name) {
    //   layer = item;
    // }
  });
});
</script>

<style scoped></style>
