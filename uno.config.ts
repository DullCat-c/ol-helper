import { defineConfig } from 'unocss';
import presetWind4 from '@unocss/preset-wind4';
import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [
    presetIcons({}),
    presetAttributify(),
    presetWind4(),
    // ...other presets
  ],
  rules: [
    ['scrollbar-thin', { 'scrollbar-width': 'thin' }],
    [
      'glass',
      {
        background: 'rgba(255,255,255,0.1)',
        'border-radius': '8px',
        'backdrop-filter': 'blur(10px)',
        '-webkit-backdrop-filter': 'blur(10px)',
      },
    ],

    // 深色模式磨砂
    [
      'glass-dark',
      {
        background: 'rgba(0,0,0,0.5)',
        'backdrop-filter': 'blur(10px)',
        '-webkit-backdrop-filter': 'blur(10px)',
      },
    ],
  ],
  theme: {
    colors: {
      main: '#75F9FD',
      vice: '#07344FCC',
      vice2: '#093E5F',
      greenHigh: '#A0EC4E',
      whiteHigh: '#FFFFFF',
    },
  },
});
