import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Stroke from 'ol/style/Stroke';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';

// 高亮样式
export const highLightStyle = new Style({
  // 绘制几何图形的样式
  fill: new Fill({
    color: 'rgba(255, 0, 0,0.1)',
  }),
  stroke: new Stroke({
    color: 'rgba(255, 0, 0)',
    width: 8,
  }),
  image: new CircleStyle({
    radius: 5,
    // stroke: new Stroke({
    // color: 'rgb(255, 0, 0)',
    // width: 10,
    // }),
    fill: new Fill({
      color: 'rgba(255, 0, 0)',
    }),
  }),
  zIndex: 99999,
});

export function colorStyleFunc(color: string) {
  return new Style({
    // 绘制几何图形的样式
    fill: new Fill({
      color: setColorOpacity(color),
    }),
    stroke: new Stroke({
      color: color,
      width: 8,
    }),
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: color,
      }),
    }),
    zIndex: 99999,
  });
}

/**
 * 增强版颜色透明度转换函数
 * @param {string} color - 颜色值
 * @param {number} opacity - 透明度（0-1之间），默认为0.2
 * @param {boolean} returnHex - 是否返回带透明度的十六进制格式
 * @returns {string} 指定透明度的颜色值
 */
export function setColorOpacity(color: string, opacity = 0.2, returnHex = false) {
  // 验证透明度参数
  if (opacity < 0 || opacity > 1) {
    throw new Error('透明度必须在0-1之间');
  }

  // 去除空格
  const cleanedColor = color.trim().toLowerCase();
  let r,
    g,
    b,
    a = 1;

  // 解析颜色的帮助函数
  const parseHex = (hex: string) => {
    if (hex.length === 3) {
      return hex.split('').map((ch) => parseInt(ch + ch, 16));
    } else if (hex.length === 6) {
      return [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)];
    } else if (hex.length === 8) {
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
        parseInt(hex.substring(6, 8), 16) / 255,
      ];
    }
    return null;
  };

  // 1. 十六进制格式
  if (cleanedColor.startsWith('#')) {
    const hex = cleanedColor.substring(1);
    const result = parseHex(hex);

    if (!result) {
      throw new Error('无效的十六进制颜色格式');
    }

    [r, g, b] = result;
    if (result.length === 4) {
      a = result[3]; // 保留原有透明度
    }
  }
  // 2. RGB/RGBA格式
  else if (cleanedColor.startsWith('rgb')) {
    const match = cleanedColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);

    if (!match) {
      throw new Error('无效的RGB颜色格式');
    }

    r = parseInt(match[1]);
    g = parseInt(match[2]);
    b = parseInt(match[3]);

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error('RGB值必须在0-255范围内');
    }

    if (match[4]) {
      a = parseFloat(match[4]);
      if (a < 0 || a > 1) {
        throw new Error('透明度必须在0-1之间');
      }
    }
  }
  // 3. 颜色关键字
  else {
    try {
      // 尝试创建临时元素来解析颜色
      const div = document.createElement('div');
      div.style.color = color;
      document.body.appendChild(div);
      const computedColor = window.getComputedStyle(div).color;
      document.body.removeChild(div);

      // 递归解析计算后的颜色
      return setColorOpacity(computedColor, opacity, returnHex);
    } catch (error) {
      throw new Error('无法解析的颜色格式');
    }
  }

  // 计算新的透明度（与原有透明度相乘）
  const newAlpha = a * opacity;

  // 返回指定格式
  if (returnHex) {
    // 转换为带透明度的十六进制 #RRGGBBAA
    const toHex = (num: number) => {
      const hex = Math.round(num).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const alphaHex = toHex(newAlpha * 255);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
  }

  return `rgba(${r}, ${g}, ${b}, ${newAlpha.toFixed(3)})`;
}
