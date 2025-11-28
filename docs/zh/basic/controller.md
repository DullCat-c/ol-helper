---
outline: deep
---

## 坐标系讲解
openlayers内置的坐标系只有两个,即EPSG:4326和EPSG:3857 

业务主要使用EPSG:4326坐标系,也被称为WGS84坐标系.它使用经度和纬度表示地球上的点位置,适合描述大范围的地理信息,单位是度.是国际上一种广泛使用的地理坐标系统.

还有一种很常见,EPSG:4490坐标系,也称为中国2000大地
标系(CGCS2000),是中国国家测绘局于2007年发布的地理坐标系统.

具体技术细节这里不讨论,两者之间差距为厘米级,而对于绝大多数民用场景,定位误差在5米到15米以内通常被认为是合理或良好的.

所以大多数情况下,我们可以认为,CGCS2000(EPSG:4490)坐标和WGS84(EPSG:4326)坐标是一致的.

内置四种天地图底图配置
| 底图类型 | type值 |
| ------------ | :------: |
| 矢量底图 |  vec_c |
| 矢量注记 |  cva_c |
| 影像底图 |  img_c |
| 影像注记 |  cia_c |


<script setup>
import { useData } from 'vitepress';
const { site, theme, page, frontmatter } = useData()
</script>

<style>
</style>
