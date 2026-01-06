<script setup lang="ts">
import switchBaseLayerExample from '../switchBaseLayerExample.vue';
import olHelper from '../../../olHelper/olHelper';
import { drawTypeEnum, UseDrawReturn } from '../../../olHelper/type';
let mapRef = ref<typeof switchBaseLayerExample>();
let drawType: Ref<drawTypeEnum | ''> = ref('');

let _olHelper: olHelper;
onMounted(() => {
  if (mapRef.value) {
    _olHelper = mapRef.value.getHelper();
    // _olHelper.useDraw();
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
  draw.setEventFunc((event) => {});
}
</script>

<template>
  <div class="flex items-center my-4">
    <span class="mr-4">绘制:</span>
    <el-radio-group v-model="drawType" text-color="#fff" fill="#6c6cff" @change="startDraw">
      <el-radio-button label="点" value="Point" />
      <el-radio-button label="线" value="LineString" />
      <el-radio-button label="面" value="Polygon" />
    </el-radio-group>
  </div>
  <switchBaseLayerExample ref="mapRef"></switchBaseLayerExample>
</template>

<style scoped></style>
