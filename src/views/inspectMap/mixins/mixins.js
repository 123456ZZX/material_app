import { gisDomain } from '../settings.js';
import * as actions from '../utils/action.js';
import bus from "../utils/Bus.js";
import { showProperties2 } from "@/common/properties.js";
import Vue from 'vue';
import mapboxgl from 'mapbox-gl';
import countTimePop from "../components/countTimePop.vue";
import layers from './layerConfig';
import axios from 'axios';
import border from '../utils/border.json';
import API from '@/common/config.js';
import baseUrl from "@/common/config.js"
import { Toast } from 'fawkes-mobile-lib';
import Popup from '../components/popup.vue'
const PopupItem = Vue.extend(Popup)
import * as turf from '@turf/turf'
import { recordInspLine } from '../../inspectionManage/api.js'
const CountTimePop = Vue.extend(countTimePop);
const layer_yuhang_ws = [
  {
    "id": "yuhangws_ws_wsg_symbol",
    "type": "symbol",
    "maxzoom": 24,
    "minzoom": 10,
    "filter": ['all', ['has', 'caliber'], ['any', ['==', ['get', 'flowdir'], '0'], ['==', ['get', 'flowdir'], '1']]],
    "source": "yuhang_ws_wsg",
    "source-layer": "ws_wsg",
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      "icon-image": "jiantou",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "rgba(145, 80, 9, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  },
  {
    "id": "yuhangws_ws_wsg",
    "type": "line",
    "source": "yuhang_ws_wsg",
    "source-layer": "ws_wsg",
    "maxzoom": 24,
    "minzoom": 10,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "rgba(145, 80, 9, 1)",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  {
    "id": "yuhangws_ws_pjg_symbol",
    "type": "symbol",
    "maxzoom": 24,
    "minzoom": 11,
    "source": "yuhang_ws_pjg",
    "filter": ['any', ['==', ['get', 'flowdir'], '0'], ['==', ['get', 'flowdir'], '1']],
    "source-layer": "ps_pjg",
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      "icon-image": "pjgjt",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "#F262FF", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  },
  {
    "id": "yuhangws_ws_pjg",
    "type": "line",
    "source": "yuhang_ws_pjg",
    "source-layer": "ps_pjg",
    "maxzoom": 24,
    "minzoom": 11,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "#F262FF",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  {
    "id": "yuhangws_ws_wsgwyj",
    "type": "line",
    "source": "yuhang_ws_wsgwyj",
    "source-layer": "ws_wsgwyj",
    "maxzoom": 24,
    "minzoom": 11,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "#de5a03",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  {
    "id": "yuhangws_ws_wsgwyj_symbol",
    "type": "symbol",
    "maxzoom": 24,
    "minzoom": 11,
    "source": "yuhang_ws_wsgwyj",
    "filter": ['any', ['==', ['get', 'flowdir'], '0'], ['==', ['get', 'flowdir'], '1']],
    "source-layer": "ws_wsgwyj",
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      "icon-image": "wyjgxjt",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "#de5a03", "icon-color": "#de5a03", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  }
];
const layer_yuhang_gs = [
  {
    "id": "yuhanggs_gs_75mmyxgd",
    "type": "line",
    "source": "yuhang_gs_75mm",
    "source-layer": "gs_75mmyxgd",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "rgba(57, 154, 234, 1)",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  {
    "id": "yuhanggs_gs_75_300mmgd",
    "type": "line",
    "source": "yuhang_gs_75-300mm",
    "source-layer": "gs_75_300mmgd",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "rgba(57, 154, 234, 1)",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  {
    "id": "yuhanggs_gs_300_500mmgd",
    "type": "line",
    "source": "yuhang_gs_300-500mm",
    "source-layer": "gs_300_500mmgd",
    "maxzoom": 24,
    "minzoom": 13,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "rgba(57, 154, 234, 1)",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  {
    "id": "yuhanggs_gs_500_800mmgd",
    "type": "line",
    "source": "yuhang_gs_500-800mm",
    "source-layer": "gs_500_800mmgd",
    "maxzoom": 24,
    "minzoom": 12,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "rgba(57, 154, 234, 1)",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  {
    "id": "yuhanggs_gs_800mmysgd",
    "type": "line",
    "source": "yuhang_gs_800mm",
    "source-layer": "gs_800mmysgd",
    "maxzoom": 24,
    "minzoom": 10,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "rgba(57, 154, 234, 1)",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  {
    "id": "yuhanggs_gs_ysgx",
    "type": "line",
    "source": "yuhang_gs_ysgx",
    "source-layer": "gs_ysgx",
    "maxzoom": 24,
    "minzoom": 10,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "rgba(168, 168, 0, 1)",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  },
  // {
  //     "id": "yuhanggs_gs_fqgx",
  //     "type": "line",
  //     "source": "yuhang_gs_fqgx",
  //     "source-layer": "gs_fqgx",
  //     "maxzoom":24,
  //     "minzoom": 15,
  //     "layout": { "visibility": "visible" },
  //     "paint": {
  //         "line-color": "rgba(168, 168, 0, 1)",
  //         "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
  //     }
  // },
  {
    "id": "yuhanggs_gs_75mmyxgd_symbol",
    "type": "symbol",
    "source": "yuhang_gs_75mm",
    "source-layer": "gs_75mmyxgd",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      // "icon-image": "GS-jiantou",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  },
  {
    "id": "yuhanggs_gs_75_300mmgd_symbol",
    "type": "symbol",
    "source": "yuhang_gs_75-300mm",
    "source-layer": "gs_75_300mmgd",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      // "icon-image": "GS-jiantou",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  },
  {
    "id": "yuhanggs_gs_300_500mmgd_symbol",
    "type": "symbol",
    "source": "yuhang_gs_300-500mm",
    "source-layer": "gs_300_500mmgd",
    "maxzoom": 24,
    "minzoom": 13,
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      // "icon-image": "GS-jiantou",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  },
  {
    "id": "yuhanggs_gs_500_800mmgd_symbol",
    "type": "symbol",
    "source": "yuhang_gs_500-800mm",
    "source-layer": "gs_500_800mmgd",
    "maxzoom": 24,
    "minzoom": 12,
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      // "icon-image": "GS-jiantou",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  },
  {
    "id": "yuhanggs_gs_800mmysgd_symbol",
    "type": "symbol",
    "source": "yuhang_gs_800mm",
    "source-layer": "gs_800mmysgd",
    "maxzoom": 24,
    "minzoom": 10,
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      // "icon-image": "GS-jiantou",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  },
  // {
  //     "id": "yuhanggs_gs_gsqtgjgd_symbol",
  //     "type": "symbol",
  //     "source": "yuhang_gs_gsqtgjgd",
  //     "source-layer": "gs_gsqtgjgd",
  //     "maxzoom":24,
  //     "minzoom": 16,
  //     "layout": {
  //         "text-field": ["concat", "DN", ["get", "caliber"]],
  //         "symbol-placement": "line",
  //         "symbol-spacing": [
  //             'interpolate',
  //             ['linear'],
  //             ['zoom'],
  //             10,
  //             5,
  //             15,
  //             50,
  //             18,
  //             100
  //         ],
  //         "icon-allow-overlap": true,
  //         "icon-rotation-alignment": "map",
  //         "text-rotate": 0,
  //         "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
  //         "text-size": 16,
  //         "text-allow-overlap": true,
  //         "text-ignore-placement": true,
  //         "text-pitch-alignment": "map",
  //         "text-rotation-alignment": "map",
  //         "text-anchor": "center",
  //         "text-offset": [0, 1],
  //         "icon-padding": 2,
  //         "icon-offset": [0, -5],
  //         "text-padding": 0,
  //         "icon-text-fit": "none",
  //         // "icon-image": "GS-jiantou",
  //         "text-max-width": 10,
  //         "icon-ignore-placement": true,
  //         "symbol-z-order": "auto",
  //         "text-justify": "center",
  //         "text-writing-mode": [],
  //         "icon-size": 1.6,
  //         "visibility": "visible"
  //     },
  //     "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
  // },
  {
    "id": "yuhanggs_gs_ysgx_symbol",
    "type": "symbol",
    "source": "yuhang_gs_ysgx",
    "source-layer": "gs_ysgx",
    "maxzoom": 24,
    "minzoom": 10,
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      // "icon-image": "GS-jiantou",
      "text-max-width": 12,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  },
];
const layer_yuhang_ys = [
  {
    "id": "yuhangys_ys_ysg",
    "type": "line",
    "source": "yuhang_ys_ysg",
    "source-layer": "ys_ysg",
    "maxzoom": 24,
    "minzoom": 10,
    "layout": { "visibility": "visible" },
    "paint": {
      "line-color": "rgba(39, 54, 155, 1)",
      "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
    }
  }, {
    "id": "yuhangys_ys_ysg_symbol",
    "type": "symbol",
    "source": "yuhang_ys_ysg",
    "source-layer": "ys_ysg",
    "filter": ['any', ['==', ['get', 'flowdir'], '0'], ['==', ['get', 'flowdir'], '1']],
    "maxzoom": 24,
    "minzoom": 10,
    "layout": {
      "text-field": ["concat", "DN", ["get", "caliber"]],
      "symbol-placement": "line",
      "symbol-spacing": [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        5,
        15,
        50,
        18,
        100
      ],
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "text-rotate": 0,
      "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
      "text-offset": [0, 1],
      "icon-padding": 2,
      "icon-offset": [0, -5],
      "text-padding": 0,
      "icon-text-fit": "none",
      "icon-image": "YS-jiantou",
      "text-max-width": 10,
      "icon-ignore-placement": true,
      "symbol-z-order": "auto",
      "text-justify": "center",
      "text-writing-mode": [],
      "icon-size": 1.6,
      "visibility": "visible"
    },
    "paint": { "text-color": "rgba(39, 54, 155, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
  }
];
const layer_yuhang_ys_icon = [
  {
    //雨水口
    "id": "yuhangws_ys_ysk",
    "type": "symbol",
    "source": "yuhang_ys_ysk",
    "maxzoom": 24,
    "minzoom": 15,
    "source-layer": "ys_ysk",
    "layout": {
      "icon-image": "yushui-yushuikou",
      "icon-size": 1
    }
  }, {
    //雨水井
    "id": "yuhangys_ys_ysjcj",
    "type": "symbol",
    "minzoom": 15,
    "maxzoom": 24,
    "source": "yuhang_ys_ysj",
    "source-layer": "ys_ysj",
    "layout": {
      "icon-image": "yushui-yushuijing",
      "icon-size": 1
    },
    // 'paint':{
    //     'circle-color':"red",
    //     'circle-radius':3
    // }
  }, {
    //节点
    "id": "yuhangys_ys_ysjd",
    "maxzoom": 24,
    "minzoom": 15,
    "type": "symbol",
    "source": "yuhang_ys_ysgd",
    "source-layer": "ys_ysgd",
    "layout": {
      "icon-image": "雨水",
      "icon-size": 1
    }
  }, {
    //雨水排放口
    "id": "yuhangys_ys_yspfk",
    "type": "symbol",
    "maxzoom": 24,
    "minzoom": 15,
    "source": "yuhang_ys_yspfk",
    "source-layer": "ys_yspfk",
    "layout": {
      "icon-image": "yushui-paifangkou",
      "icon-size": 1
    }
  },
  // {   
  //     //监测点
  //     "id": "yuhangys_ys_ysjcd",
  //     "type": "symbol",
  //     "source": "yuhang_ys_ysjcd",
  //     "maxzoom":24,
  //     "minzoom": 15,
  //     "source-layer": "ys_ysjcd",
  //     "layout":{
  //         "icon-image":"yushui-jiancedian",
  //         "icon-size":1
  //     }
  // },
  {
    //雨水泵站
    "id": "yuhangys_ys_ysbz",
    "type": "symbol",
    "source": "yuhang_ys_ysbz",
    "maxzoom": 24,
    "minzoom": 11,
    "source-layer": "ys_ysbz",
    'filter': [
      'any',
      ['all', ['==', ['get', 'display_level'], 1], ['>=', ['zoom'], 11]],
      ['all', ['==', ['get', 'display_level'], 2], ['>=', ['zoom'], 12]],
      ['all', ['==', ['get', 'display_level'], 3], ['>=', ['zoom'], 13]]
    ],
    "layout": {
      "icon-image": "yushui-bengzhan",
      "icon-size": 1,
      "text-field": ["get", "name"],
      "text-offset": [0, 1],
      "text-size": 10,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
    }
  }
]
const layer_yuhang_ws_icon = [
  {
    "id": "yuhangws_ws_wsc",
    "type": "symbol",
    "source": "yuhang_ws_wsc",
    "source-layer": "ws_wsc",
    "maxzoom": 24,
    "minzoom": 11,
    "layout": {
      "visibility": "visible",
      "icon-image": "wushui-shuichang",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      "icon-size": 1,
      "text-field": ["get", "name"],
      "text-offset": [0, 1],
      "text-size": 16,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
    }
  },
  {
    //闸门
    "id": "yuhangws_ws_wszm",
    "type": "symbol",
    "source": "yuhang_ws_wszm",
    "source-layer": "ws_wszm",
    "maxzoom": 24,
    "minzoom": 14,
    "layout": {
      "icon-rotate": 360,
      "icon-image": "wushui-zhamen",
    }
  },
  {
    //污水口
    "id": "yuhangws_ws_wsk",
    "type": "symbol",
    "source": "yuhang_ws_wsk",
    "source-layer": "ws_wsk",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": {
      "icon-image": "wushui-wushuikou",
      "icon-size": 1
    }
  },
  {
    //管点
    "id": "yuhangws_ws_wsgd",
    "type": "symbol",
    "source": "yuhang_ws_wsgd",
    "source-layer": "ws_wsgd",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": {
      "icon-image": "wushui",
      "icon-size": 1
    }
  },
  {
    //排放口
    "id": "yuhangws_ws_wspfk",
    "type": "symbol",
    "source": "yuhang_ws_wspfk",
    "source-layer": "ws_wspfk",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": {
      "icon-image": "wushui-paifangkou",
      "icon-size": 1
    }
  },
  {
    //泵站
    "id": "yuhangws_ws_wsbz",
    "type": "symbol",
    "source": "yuhang_ws_wsbz",
    "source-layer": "ws_wsbz_with_iot",
    "maxzoom": 24,
    "minzoom": 15,
    'filter': [
      'any',
      ['all', ['==', ['get', 'display_level'], 1], ['>=', ['zoom'], 11]],
      ['all', ['==', ['get', 'display_level'], 2], ['>=', ['zoom'], 12]],
      ['all', ['==', ['get', 'display_level'], 3], ['>=', ['zoom'], 13]]
    ],
    "layout": {
      "icon-image": "wushui-bengzhan",
      "icon-size": 1,
      "text-field": ["get", "name"],
      "text-offset": [0, 1],
      "text-size": 10,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-anchor": "center",
    }
  },
  {
    //阀门
    "id": "yuhangws_ws_wsfm",
    "type": "symbol",
    "source": "yuhang_ws_wsfm",
    "source-layer": "ws_wsfm",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": {
      "icon-image": "wushui-famen",
      "icon-size": 1
    }
  },
  {
    //污水井
    "id": "yuhangws_ws_wsj",
    "type": "symbol",
    "source": "yuhang_ws_wsj",
    "source-layer": "ws_wsj",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": {
      "icon-image": "wushui-wushuijing",
      "icon-size": 1
    }
  },
  {
    //监测点
    "id": "yuhangws_ws_wsjcd",
    "type": "symbol",
    "source": "yuhang_ws_wsjcd",
    "source-layer": "ws_wsjcd",
    "maxzoom": 24,
    "minzoom": 15,
    "layout": {
      "icon-image": "wushui-jiancedian",
      "icon-size": 1
    }
  }
]
const layer_yuhang_gs_icon = [{
  //供水泵站
  "id": "yuhanggs_gs_gsbz",
  "type": "symbol",
  "source": "yuhang_gs_gsbz",
  "source-layer": "gs_jyd",
  "maxzoom": 24,
  "minzoom": 10,
  'filter': [
    'any',
    ['all', ['==', ['get', 'display_level'], 1], ['>=', ['zoom'], 11]],
    ['all', ['==', ['get', 'display_level'], 2], ['>=', ['zoom'], 12]],
    ['all', ['==', ['get', 'display_level'], 3], ['>=', ['zoom'], 13]]
  ],
  "layout": {
    "icon-image": "gongshui-bengzhan",
    "icon-size": 1,
    "text-field": ["get", "name"],
    "text-offset": [0, 1],
    "text-size": 10,
    "text-allow-overlap": true,
    "text-ignore-placement": true,
    "text-pitch-alignment": "map",
    "text-rotation-alignment": "map",
    "text-anchor": "center",
  }
},
{
  //供水阀门
  "id": "yuhanggs_gs_fm",
  "type": "symbol",
  "source": "yuhang_gs_fm",
  "source-layer": "gs_fm",
  "maxzoom": 24,
  "minzoom": 17,
  "layout": {
    "icon-image": [
      'case',
      ['==', ['get', 'display'], '减压阀'],
      'gongshui-jianyafa',
      'yibanfamen'
    ],
    "icon-size": 1
  }
}, {
  //自来水厂
  "id": "yuhanggs_gs_gsc",
  "type": "symbol",
  "source": "yuhang_gs_gsc",
  "source-layer": "gs_gsc",
  "maxzoom": 24,
  "minzoom": 10,
  "layout": {
    "icon-image": "gongshui-shuichang",
    "icon-size": 1,
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
    "text-field": ["get", "name"],
    "text-offset": [0, 1],
    "text-size": 16,
    "text-allow-overlap": true,
    "text-ignore-placement": true,
    "text-pitch-alignment": "map",
    "text-rotation-alignment": "map",
    "text-anchor": "center",
  },
  paint: { 'text-halo-color': "#ffffff", 'text-halo-width': 1 }
}, {
  //水表箱
  "id": "yuhanggs_gs_sbx",
  "type": "symbol",
  "source": "yuhang_gs_sbx",
  "source-layer": "gs_sbx",
  "maxzoom": 24,
  "minzoom": 18,
  "layout": {
    "icon-image": "shuibiaoxiangkuang",
    "icon-size": 1,
    "text-field": [
      'case',
      ['to-boolean', ["get", "metercnt"]],
      '0',
      ["get", "metercnt"]
    ],
    "text-size": 12,
    "text-allow-overlap": true,
    "text-ignore-placement": true,
    "text-anchor": "center",
  },
  paint: {
    "text-color": '#399aea',
  }
},
{
  //监测点
  "id": "yuhanggs_gs_jcd",
  "type": "symbol",
  "source": "yuhang_gs_gsjcd",
  "source-layer": "gs_monitor",
  "maxzoom": 24,
  "minzoom": 14,
  "layout": {
    "icon-image": "gongshui-jiancedian",
    "icon-size": 1,
    "text-offset": [0, 1],
    "text-size": 10,
    "text-allow-overlap": true,
    "text-ignore-placement": true,
    "text-pitch-alignment": "map",
    "text-rotation-alignment": "map",
    "text-anchor": "center",
  }
},
{
  //节点
  "id": "yuhanggs_gs_jd",
  "type": "symbol",
  "source": "yuhang_gs_ljd",
  "source-layer": "gs_ljd",
  "maxzoom": 24,
  "minzoom": 18,
  "layout": {
    "icon-image": "供水",
    "icon-size": 1
  }
}, {
  //消火栓
  "id": "yuhanggs_gs_xhs",
  "type": "symbol",
  "source": "yuhang_gs_xfs",
  "source-layer": "gs_xfs",
  "maxzoom": 24,
  "minzoom": 16,
  "layout": {
    "icon-image": "xiaohuoshuan",
    "icon-size": 1
  }
},
{
  //排气阀
  "id": "yuhanggs_gs_pqf",
  "type": "symbol",
  "source": "yuhang_gs_pqf",
  "source-layer": "gs_pqf",
  "maxzoom": 24,
  "minzoom": 15,
  "layout": {
    "icon-image": "gongshui-paiqifa",
    "icon-size": 1
  }
}, {
  //排污阀
  "id": "yuhanggs_gs_pwf",
  "type": "symbol",
  "source": "yuhang_gs_pwf",
  "source-layer": "gs_pwf",
  "maxzoom": 24,
  "minzoom": 15,
  "layout": {
    "icon-image": "gongshui-paiwufa",
    "icon-size": 1
  }
}, {
  //排污口
  "id": "yuhanggs_gs_pwk",
  "type": "symbol",
  "source": "yuhang_gs_pwk",
  "source-layer": "gs_pwk",
  "maxzoom": 24,
  "minzoom": 15,
  "layout": {
    "icon-image": "gongshui-paiwukou",
    "icon-size": 1
  }
}, {
  //预留口
  "id": "yuhanggs_gs_ylk",
  "type": "symbol",
  "source": "yuhang_gs_ylk",
  "source-layer": "gs_ylk",
  "maxzoom": 24,
  "minzoom": 15,
  "layout": {
    "icon-image": "gongshui-yuliukou",
    "icon-size": 1
  }
},
]
const LayerType = {
  '供水': [layer_yuhang_gs, layer_yuhang_gs_icon],
  '雨水': [layer_yuhang_ys, layer_yuhang_ys_icon],
  '污水': [layer_yuhang_ws, layer_yuhang_ws_icon],
}
const mapObj = {
  map: null,
  mapInstance: null
}
const recordFeatures = []
export default {
  name: "mixins",
  data() {
    return {
      hasListen: false,
      uploadFiledPipeIdList: [], // 上传失败的已巡检管线id
      currentPoint: null,
      GSL: [
        "case",
        [
          "any",
          ["==", ["get", "SBLB"], "FM"],
          ["==", ["get", "SBLB"], "PQF"],
          ["==", ["get", "SBLB"], "PNF"],
        ],
        "ybfm",
        ["==", ["get", "SBLB"], "JYD"],
        "gs-bz",
        ["==", ["get", "SBLB"], "PWK"],
        "ybfm",
        ["==", ["get", "SBLB"], "XHS"],
        "xhs",
        ["==", ["get", "SBLB"], "DB"],
        "zdyh",
        ["==", ["get", "SBLB"], "JSD"],
        "sbx",
        // ['==',['get', "SBLB"], '自来水厂'],'供水-水厂',
        "gs",
      ],
      YSL: [
        "case",
        ["==", ["get", "SBLB"], "泵站"],
        "ys-bz",
        ["==", ["get", "SBLB"], "排放口"],
        "ys-pfk",
        ["==", ["get", "SBLB"], "雨水口"],
        "ys-ysk",
        ["==", ["get", "SBLB"], "雨水井"],
        "ys-ysj",
        ["==", ["get", "SBLB"], "监测点"],
        "ys-jcd",
        "ys",
      ],
      WSL: [
        "case",
        [
          "any",
          ["==", ["get", "SBLB"], "FM"],
          ["==", ["get", "SBLB"], "污水阀门"],
          ["==", ["get", "SBLB"], "P污水闸门NF"],
        ],
        "ybfm",
        ["==", ["get", "SBLB"], "泵站"],
        "ws-bz",
        ["==", ["get", "SBLB"], "排放口"],
        "ws-pfk",
        ["==", ["get", "SBLB"], "污水口"],
        "ws-wsk",
        ["==", ["get", "SBLB"], "污水井"],
        "ws-wsj",
        ["==", ["get", "SBLB"], "监测点"],
        "ws-jcd",
        // ['==',['get', "SBLB"], '污水厂'], "wushui-shuichang",
        "ws",
      ],

      baseMapurl: [
        gisDomain +
        "/iserver/services/map-mvt-YuHangShuiWuDiTuQiePian/restjsr/v1/vectortile/maps/余杭水务底图切片/style.json",
        gisDomain +
        "/iserver/services/map-mvt-JianZhuHeLvDi/restjsr/v1/vectortile/maps/建筑和绿地/style.json",
        gisDomain +
        "/iserver/services/map-mvt-YuHangQuHangZhengQuHuaShiLiangWaPian/restjsr/v1/vectortile/maps/余杭区行政区划矢量瓦片/style.json",
        gisDomain +
        "/iserver/services/map-mvt-YuHangShuiWuLuWangShuiXiDiTuQiePian/restjsr/v1/vectortile/maps/余杭水务路网水系底图切片/style.json",
      ],
      bzLayerUrls: [
        gisDomain +
        "/iserver/services/map-mvt-GongShuiGuanXianBiaoZhu/restjsr/v1/vectortile/maps/供水管线标注/style.json",
        gisDomain +
        "/iserver/services/map-mvt-YuShuiGuanXianBiaoZhu2/restjsr/v1/vectortile/maps/雨水管线标注/style.json",
        gisDomain +
        "/iserver/services/map-mvt-WuShuiGuanXianBiaoZhu2/restjsr/v1/vectortile/maps/污水管线标注/style.json",
      ],
      timer: [],
      //供水矢量瓦片服务
      gsUrl:
        gisDomain +
        "/iserver/services/map-mvt-GongShui/restjsr/v1/vectortile/maps/供水/style.json",
      //雨水矢量瓦片服务
      ysUrl:
        gisDomain +
        "/iserver/services/map-mvt-YuShui/restjsr/v1/vectortile/maps/雨水/style.json",
      //污水矢量瓦片服务
      wsUrl:
        gisDomain +
        "/iserver/services/map-mvt-WuShui/restjsr/v1/vectortile/maps/污水/style.json",

      swLayer: {
        '供水': [],
        '雨水': [],
        '污水': [],
      },
      vm: null,
      deviceLayers: [],
      factoryNameMarkers: [],

      //选中设施
      chooseDevice: [],

      diyPoint: {},
      //协办人
      marker: null,
      isOnLoad: false,
      event: "",

      databaseNames: ['供水:供水管道', '供水:T75mm以下管道', '供水:T800mm以上管道', '供水:T75_300mm管道', '供水:T300_500mm管道', '供水:T500_800mm管道', '供水:排气阀', '供水:排污阀', '供水:阀门', '网络分析:雨水管', '网络分析:雨水井', '网络分析:雨水泵站', '网络分析:雨水口', '网络分析:雨水排放口', '网络分析:雨水管点', '网络分析:污水管', '网络分析:污水井', '网络分析:污水泵站', '网络分析:污水口', '网络分析:污水排放口', '网络分析:污水阀门', '网络分析:污水管点', '网络分析:污水监测点', '供水:三通', '供水:消防栓', '供水:连接点', '供水:加压点', '供水:四通', '供水:预留口', '供水:水表箱', '供水:排污口', '供水:大表'],

      gsDatabaseNames: ['供水:供水管道', '供水:T75mm以下管道', '供水:T800mm以上管道', '供水:T75_300mm管道', '供水:T300_500mm管道', '供水:T500_800mm管道', '供水:排气阀', '供水:排污阀', '供水:阀门', '供水:三通', '供水:消防栓', '供水:连接点', '供水:加压点', '供水:四通', '供水:预留口', '供水:水表箱', '供水:排污口', '供水:大表'],
      ysDatabaseNames: ['网络分析:雨水管', '网络分析:雨水井', '网络分析:雨水泵站', '网络分析:雨水口', '网络分析:雨水排放口', '网络分析:雨水管点'],
      wsDatabaseNames: ['网络分析:污水管', '网络分析:污水井', '网络分析:污水泵站', '网络分析:污水口', '网络分析:污水排放口', '网络分析:污水阀门', '网络分析:污水管点', '网络分析:污水监测点'],

      databaseNames1: ['供水:排气阀', '供水:排污阀', '供水:阀门', '网络分析:雨水管', '网络分析:雨水井', '网络分析:雨水泵站', '网络分析:雨水口', '网络分析:雨水排放口', '网络分析:雨水管点', '网络分析:污水管', '网络分析:污水井', '网络分析:污水泵站', '网络分析:污水口', '网络分析:污水排放口', '网络分析:污水阀门', '网络分析:污水管点', '网络分析:污水监测点', '供水:三通', '供水:消防栓', '供水:连接点', '供水:加压点', '供水:四通', '供水:预留口', '供水:水表箱', '供水:排污口', '供水:大表'],

      gsDatabaseNames1: ['供水:排气阀', '供水:排污阀', '供水:阀门', '供水:三通', '供水:消防栓', '供水:连接点', '供水:加压点', '供水:四通', '供水:预留口', '供水:水表箱', '供水:排污口', '供水:大表'],
      ysDatabaseNames1: ['网络分析:雨水管', '网络分析:雨水井', '网络分析:雨水泵站', '网络分析:雨水口', '网络分析:雨水排放口', '网络分析:雨水管点'],
      wsDatabaseNames1: ['网络分析:污水管', '网络分析:污水井', '网络分析:污水泵站', '网络分析:污水口', '网络分析:污水排放口', '网络分析:污水阀门', '网络分析:污水管点', '网络分析:污水监测点'],

      gsLayers: [],
      ysLayers: [],
      wsLayers: [],
      recordTimer: null,
      // 当前关键点
      currentKeyPoint: null,
      // 当前应急任务的marker
      currentEmeMarker: null,
      callback: null,
      dataNames: [],
      navMarkers: [],
      featuresLine: [],
      areaMarkers: [],
      markersLinePoints: [],
      markersAreaPoints: [],
      allDistance: null,
      navigatorMarker: null,
      navigatorMarker2: null,
      lineMarkers: [],
      areaMarker: null,
      firstPoint: [],
      boxFeatures: [],
      multiTaskSAL: [],

      // 字典
      dictionary: {},
      eventTypeList: {},
      accessToken: this.$storage.get('access_token'),
      formToken: ''
    }
  },
  created() {
    // 获取header，查询工单用
    axios({
      url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
      method: 'post',
      params: {
        token: this.accessToken,
      },
      headers: {
        Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
      }
    }).then((res) => {
      if (res.status == 200) {
        this.formToken = res.data.resultData.token
      }
    })
  },
  mounted() {
  },
  methods: {
    mapLoad(mapInstance) {
      mapObj.map = mapInstance.map
      mapObj.mapInstance = mapInstance
    },
    getEventTypeList() {
      if (this.dictionary.length > 0) {
        // 处理字典，将其转换为对象，便于回显事件名称
        let detailList = this.dictionary.filter(
          // 对特定事件前缀处理
          (item) => item.code.indexOf('inspection_event_type_') !== -1
        );
        let eventCodeList = [];
        detailList.forEach(item => {
          eventCodeList = eventCodeList.concat(item.dictionaryDetailList);
        });
        // 转换为对象
        eventCodeList.forEach((item) => {
          this.eventTypeList[item.code] = item.zh;
        });
      } else {
        Toast({
          title: "字典加载失败",
        });
      }
    },
    isOnLoaded() {
      return this.isOnLoad && mapObj.mapInstance && mapObj.mapInstance.map;
    },
    //通用方法
    async addCommonLayer() {
      for await (const url of this.baseMapurl) {
        await mapObj.mapInstance.addSuperStyleData(url);
      }
    },
    async addPipeLayer() {
      let map = mapObj.map;
      let env = process.env.VUE_APP_ENV;
      //底图
      await axios
        .get(
          API.VUE_APP_MAP_REQUEST_URL +
          "/api/swan/mapWorkshopSource/detail?id=1557650273895288834"
        )
        .then((res) => {
          let layers = JSON.parse(res.data.data.combineJsonData);

          Object.keys(layers.sources).forEach((key) => {
            let temp = layers.sources[key].tiles[0];
            // temp = temp.replaceAll("172.20.79.65:8008", "xasw.hdec.com");
            
            // temp = temp.replaceAll("172.23.0.123:8008", "xasw.hdec.com");
            // temp = temp.replaceAll("172.17.142.136:8008", "sw.chinaxiongan.cn");
            temp = temp.replaceAll("http://10.24.1.15:8008", "https://xionganwater.cn");
            layers.sources[key].tiles[0] = temp;
            // if (env == "production") {
            // }
            map.addSource(key, layers.sources[key]);
          });
          layers.layers.forEach((layer) => {
            console.log('layer: ', layer);
            if (!layer.layout || layer.layout.visibility == "visible") {
              this.defaultBaseLayers.push(layer); //控制地图显隐
            }
            map.addLayer(layer);
          });
        })
        .catch((e) => { })
        .finally(() => { });
      //管线
      await axios
        .get(
          API.VUE_APP_MAP_REQUEST_URL +
          "/api/swan/mapWorkshopSource/detail?id=1548573412963749889"
        )
        .then((res) => {
          let layers = JSON.parse(res.data.data.jsonData);

          Object.keys(layers.sources).forEach((key) => {
            let temp = layers.sources[key].tiles[0];
            // temp = temp.replaceAll("172.20.79.65:8008", "xasw.hdec.com");
            // temp = temp.replaceAll("172.23.0.123:8008", "xasw.hdec.com");
            // temp = temp.replaceAll("172.17.142.136:8008", "sw.chinaxiongan.cn");
            temp = temp.replaceAll("http://10.24.1.15:8008", "https://xionganwater.cn");
            layers.sources[key].tiles[0] = temp;
            // if (env == "production") {
            // }
            map.addSource(key, layers.sources[key]);
          });
          layers.layers.forEach((layer) => {
            map.addLayer(layer);
            //图层移入移除以及点击事件
            // map.on("mouseenter", layer.id, this.handleLayerEnter);
            // map.on("mouseout", layer.id, this.handleLayerLeave);
            // map.on("click", layer.id, this.handleLayerClick); 
          });
        })
        .catch((e) => { })
        .finally(() => {
          
        });
      await this.addLineGeoLayer();
      // 边框
      await map.addLayer({
        id: "mapBorder",
        type: "line",
        source: {
          type: "geojson",
          data: border,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#17E9FE",
          "line-opacity": 0.4,
          "line-width": 2,
        },
      });
      await this.addKeyPointLayer();
      // this.isOnLoad = true;
    },
    // async addPipeLayer() {
    //   this.isOnLoad = true;
    //   await mapObj.mapInstance.()
    //   // await mapObj.mapInstance.addTimerSource();
    //   // this.swLayer['雨水'] = mapObj.mapInstance.addTimerLayer('雨水');
    //   // this.swLayer['污水'] = mapObj.mapInstance.addTimerLayer('污水');
    //   // this.swLayer['供水'] = await mapObj.mapInstance.addTimerLayer('供水');
    //   // let gsLayerType = LayerType['供水'][0].concat(LayerType['供水'][1])
    //   // gsLayerType.forEach((item, index) => {
    //   //   mapObj.mapInstance.map.setLayoutProperty(item.id, 'visibility', 'none');
    //   // })
    //   // mapObj.mapInstance.addSource('lightLayer', {
    //   //   type: "geojson",
    //   //   data: {
    //   //     type: "FeatureCollection",
    //   //     features: []
    //   //   }
    //   // });
    //   // this.swLayer['供水'] = await this.pipeSettings(this.gsUrl, this.GSL);
    //   // this.swLayer['雨水'] = await this.pipeSettings(this.ysUrl, this.YSL);
    //   // this.swLayer['污水'] = await this.pipeSettings(this.wsUrl, this.WSL);
    //   // for await (const url of this.bzLayerUrls) {
    //   //   await mapObj.mapInstance.addSuperStyleData(url);
    //   // }
    //   // mapObj.mapInstance.addLayer({
    //   //   id: "lightPoint",
    //   //   type: "symbol",
    //   //   source: "lightLayer",
    //   //   filter: ["==", "$type", "Point"],
    //   //   layout: {
    //   //     'icon-size': 1.4,
    //   //     'icon-image': [...this.GSL.slice(0, this.GSL.length - 1), ...this.WSL.slice(1, this.WSL.length - 1), ...this.YSL.slice(1)],
    //   //     'icon-ignore-placement': true,
    //   //     'icon-allow-overlap': true
    //   //   }
    //   // }, "lightLayer")
    //   // mapObj.mapInstance.addLayer({
    //   //   id: "lightLine",
    //   //   type: "line",
    //   //   source: "lightLayer",
    //   //   filter: ["==", "$type", "LineString"],
    //   //   paint: {
    //   //     'line-width': 3,
    //   //     'line-color': "red",
    //   //   }
    //   // }, "lightLayer");
    //   // this.isOnLoad = true;
    //   // if (this.tripleVisible) {
    //   //   this.gsLayers.forEach((item, index) => {
    //   //     mapObj.mapInstance.map.setLayoutProperty(this.gsLayers[index], 'visibility', 'none');
    //   //   })
    //   // }
    // },
    async pipeSettings(url, setting) {
      let { data } = await actions.getAction(url);
      mapObj.mapInstance.addSource(data.name, data.sources[data.name]);
      data.layers = data.layers.filter(item => { return item.type !== "background" })
      // data.sources[data.name].tiles[0] = gisDomain + '/iserver' + data.sources[data.name].tiles[0].split('iserver')[1];
      let layers = data.layers;
      switch (data.name) {
        case '供水':
          this.gsLayers = layers.map(layer => { return layer.id });
          break;
        case '雨水':
          this.ysLayers = layers.map(layer => { return layer.id });
          break;
        case '污水':
          this.wsLayers = layers.map(layer => { return layer.id });
          break;
        default:
          break;
      }
      data.layers.forEach(layer => {
        delete layer.maxzoom;
        if (layer.layout && layer.layout.visibility == "visible" && layer.type == "line") {
          mapObj.mapInstance.addLayer(layer, 'deviceMap');
        } else if (layer.layout && layer.layout.visibility == "visible" && layer.type == "circle") {
          layer.type = "symbol";
          layer.paint = {};
          layer.layout = {
            "icon-image": setting,
            "icon-size": 1
          }
          mapObj.mapInstance.addLayer(layer, 'deviceMap');
        }
        this.deviceLayers.push(layer.id);
        // mapObj.mapInstance.map.on('click',layer.id,this.layerClick)
      });
    },
    addUser() {
      mapObj.mapInstance.addSource('user', {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      })
      mapObj.mapInstance.addLayer({
        id: "user",
        type: "symbol",
        source: "user",
        layout: {
          "icon-image": "user",
          "icon-size": 0.25,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      })
    },
    //H5定位
    async getUserPosition() {
      // let p;
      // if (navigator.geolocation){
      //   navigator.geolocation.watchPosition((position) => {
      //     p = [position.coords.longitude,position.coords.latitude];
      //     alert(p)
      //   },(error) => {
      //     switch(error.code) {
      //       case error.PERMISSION_DENIED: 
      //         alert("定位失败,用户拒绝请求地理定位");
      //         break;
      //       case error.POSITION_UNAVAILABLE:
      //         alert("定位失败,位置信息是不可用");
      //         break;
      //       case error.TIMEOUT:
      //         alert("定位失败,请求获取用户位置超时");
      //         break;
      //       case error.UNKNOWN_ERROR:
      //         alert("定位失败,定位系统失效");
      //         break;
      //       }
      //   }); 
      // }else{ 
      //   alert("不支持地理定位。"); 
      // }
      let point = await actions.getPosition()
      return point;
    },
    setUserPosition(position) {
      mapObj.mapInstance.setSourceData('user', {
        type: "FeatureCollection",
        features: position.length > 0 ? [turf.point(position)] : []
      })
    },
    flyTo({ position, zoom }) {
      mapObj.mapInstance.flyTo(position, zoom);
    },
    position(coords) {
      mapObj.mapInstance.position(coords);
    },
    //公司选择
    //传公司数组 例如:['临平供排水']
    async chooseFactory(factory) {
      let fac = factory[factory.length - 1];
      let fac0 = factory[0];
      this.factoryNameMarkers.forEach(marker => {
        marker.remove();
      })
      if (fac0.label !== "杭州余杭水务控股集团") {
        let res = await this.$api.getAction("/yhsw-drainage-entity/userMap/orgTree", {
          orgNo: fac.label === '全部' ? fac0.value : fac.value
        })
        let arr = [];
        if (res.data.length) {
          arr = mapObj.mapInstance.iteration(res.data, 'children', ['companyName', 'geom'])
        }
        if (factory.length == 1) {
          arr.shift();
        }
        let coordsArr = [];
        let factoryNameMarkers = [];
        arr.forEach(item => {
          coordsArr.push(item.geom.coordinates)
          let center = this.getCenter(item.geom.coordinates[0]);
          let ele = document.createElement('div');
          ele.innerHTML = `<span style="color:#495665;font-size:18px;font-weight:bold">${item.companyName}</span>`
          factoryNameMarkers.push(mapObj.mapInstance.addMarker(ele, center));
        })
        this.factoryNameMarkers = factoryNameMarkers;
        this.makeLocation(res.data[0].geom.coordinates);
        this.paintingRange({ position: coordsArr, lineDasharray: [3, 4] })
      } else {
        this.makeLocation();
        this.paintingRange({});
      }
    },
    randomString(len) {
      len = len || 32;
      let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      let maxPos = $chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    initMarker(i, w = 20, h = 20) {
      let ele = document.createElement('img');
      ele.src = i;
      ele.style.width = w;
      ele.style.height = h;
      return ele;
    },
    mapOnLoad(callback) {
      if (this.isOnLoad) {
        callback && callback()
      } else {
        let timer = setInterval(() => {
          if (this.isOnLoad) {
            this.timer.forEach(timer => {
              clearInterval(timer)
            })
            this.timer = null;
            callback && callback()
          }
        }, 100)
        this.timer.push(timer);
      }

    },
    /**
     * @name:业务代码
     */
    //管网和设施增加点击选中事件，选中设施信息储存至this.chooseDevice
    addDeviceLayersClickEvent(that, isSW = false) {
      let deviceLayers = this.deviceLayers.length > 0 ? this.deviceLayers : mapObj.mapInstance.deviceLayers;
      this.vm = that || null;
      deviceLayers.forEach(layerId => {
        mapObj.mapInstance.map.on('click', layerId, isSW ? this.layerClick1 : this.layerClick);
      })
    },
    removeDeviceLayersClickEvent(isSW = false) {
      let deviceLayers = this.deviceLayers.length > 0 ? this.deviceLayers : mapObj.mapInstance.deviceLayers;
      deviceLayers.forEach(layerId => {
        mapObj.mapInstance.map.off('click', layerId, isSW ? this.layerClick1 : this.layerClick);
      });
      this.vm = null;
    },
    layerClick(e) {
      let index = this.chooseDevice.findIndex(item => { return item.properties.id == e.features[0].id });
      let device = null;
      let operationMode = "";
      if (index == -1) {
        let feature = e.features[0];
        device = {
          type: "feature",
          geometry: feature.geometry,
          properties: { ...feature.properties, id: feature.id }
        };
        this.chooseDevice.push(device);
        operationMode = 'add';
      } else {
        device = this.chooseDevice[index];
        this.chooseDevice.splice(index, 1)
        operationMode = 'remove';
      }
      mapObj.mapInstance.setSourceData('lightLayer', {
        type: "FeatureCollection",
        features: this.chooseDevice
      });
      this.vm && this.vm.$emit('getDevice', this.chooseDevice, {
        operationMode,
        device
      });
      device = null;
    },
    /**
     * 三网合一
     */
    layerClick1(e) {
      console.log('e :>> ', e);

      let feature = mapObj.mapInstance.map.queryRenderedFeatures([
        [e.point.x - 2, e.point.y - 2],
        [e.point.x + 2, e.point.y + 2]
      ])[0];
      if (feature && feature.properties.deviceid && !feature.layer.id.includes('_symbol')) {
        console.log('feature :>> ', feature);
        mapObj.mapInstance.setSourceData('lightLayer', {
          type: "FeatureCollection",
          features: [feature]
        });
        this.$emit('getDevice', feature);
        if (feature.properties.display.indexOf('管线') > -1) {
          let location = [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1] - 0.0005]
          this.flyTo({ position: location, zoom: 17 })
        } else {
          let location2 = [feature.geometry.coordinates[0], feature.geometry.coordinates[1] - 0.0005]
          this.flyTo({ position: location2, zoom: 17 })
        }
      }
    },
    //查看时回显
    echoWxDeveice(features) {
      this.chooseDevice = features;
      mapObj.mapInstance.setSourceData('lightLayer', {
        type: "FeatureCollection",
        features: this.chooseDevice
      })
    },
    //添加带浮窗事件图标
    addEventMarker({ position, event }) {
      let ele = this.initMarker(require('@/assets/img/map/eventPoint.png'), 10, 10);
      let marker = mapObj.mapInstance.newMarker({
        element: ele
      });
      marker.setLngLat(position).setPopup(mapObj.mapInstance.newPopup({ offset: [0, -10], closeButton: false }).setHTML(`<strong>${event}</strong>`)).addTo(mapObj.mapInstance.map);
      marker.togglePopup();
    },
    //切换地图 name:tdt||yxt||baseMap
    changeMap(name) {
      mapObj.mapInstance.changeBaseMap(name);
    },
    /**
     * @name:维修部份
     */
    addOrganizerMarker({ position, distance }) {
      let ele = this.initMarker(require('@/assets/img/map/gj.png'));
      this.marker = mapObj.mapInstance.newMarker({
        element: ele
      });
      this.marker.setLngLat(position).setPopup(mapObj.mapInstance.newPopup({ offset: [0, -10], closeButton: false }).setHTML(`<strong>${distance}</strong>`)).addTo(mapObj.mapInstance.map);
      this.marker.togglePopup();
    },
    //更新协办人员位置
    updateOrganizerPosition({ position, distance }) {
      this.marker.setLngLat(position).getPopup().setHTML(`<strong>${distance}</strong>`);
    },
    //移除协办人员
    removeOrganizerMarker() {
      this.marker.remove();
      this.marker = null;
    },
    // 点击地图添加自定义选择维修设施
    startAddDiyPoint(event, vm) {
      this.event = event;
      this.vm = vm;
      mapObj.map.on('click', this.AddDiyPoint)
    },
    AddDiyPoint(e) {
      this.addDiyrMarker({ position: [e.lngLat.lng, e.lngLat.lat], name: event })
    },
    // 地图录入设施添加图标
    addDiyrMarker({ position, name }) {
      let ele = document.createElement('img');
      ele.src = require('@/assets/img/map/diyPoint.png');
      ele.style.width = '20px';
      ele.style.height = '20px';
      this.diyPoint.marker && this.diyPoint.marker.remove();
      let marker = mapObj.mapInstance.newMarker({ element: ele });
      marker.setLngLat(position).setPopup(mapObj.mapInstance.newPopup({ offset: [-1, 0] }).setHTML(`<strong>${name}</strong>`)).addTo(mapObj.mapInstance.map);
      this.diyPoint = { name, position, marker };
      this.vm.$emit('getDiyPoint', this.diyPoint);
    },
    //移除新录入设施图标
    removeDiyMarker() {
      this.diyPoint.marker.remove();
      this.diyPoint.marker = null;
    },
    //结束自定义选择维修设施
    endDiyPoint() {
      mapObj.map.off('click', this.AddDiyPoint);
      this.vm = null;
    },
    /**
     * @name:养护部份
     */
    addNavigatorPoint(point) {
      let that = this;
      if (that.navigatorMarker) that.navigatorMarker.remove();
      if (that.navigatorMarker2) that.navigatorMarker2.remove();
      let ele = that.initMarker(require('@/assets/img/map/eventPoint.png'), 25, 25);
      let marker = mapObj.mapInstance.newMarker({
        element: ele
      });
      if (point) {
        ele.addEventListener('click', function (val) {
          let ele2 = document.createElement("div");
          ele2.innerHTML = `
              <div style="padding: 0px 5px; border: 1px solid #eee; border-radius: 2px; background: #fff; color: #2A83E6">去导航</div>
            `
          let marker2 = mapObj.mapInstance.newMarker({
            element: ele2,
            offset: [35, 0]
          });
          ele2.addEventListener('click', function (val) {
            that.navigatorMarker2.remove();
            that.$emit('goToNavigator', point)
          })
          marker2.setLngLat(point).addTo(mapObj.mapInstance.map);
          that.navigatorMarker2 = marker2;
        })
        marker.setLngLat(point).addTo(mapObj.mapInstance.map);
        that.navigatorMarker = marker;
        that.$emit('getNavigatorPoint', point)
      }
    },
    // 测距
    addNavigatorPointsLine(point) {
      if (point) {
        this.markersLinePoints.push(point)
        mapObj.mapInstance.map.getLayer("PointsLayer") && mapObj.mapInstance.map.removeLayer("PointsLayer");
        mapObj.mapInstance.map.getSource("PointSource") && mapObj.mapInstance.map.removeSource("PointSource");
        mapObj.mapInstance.map.getLayer("LineLayer") && mapObj.mapInstance.map.removeLayer("LineLayer");
        mapObj.mapInstance.map.getSource("LineSource") && mapObj.mapInstance.map.removeSource("LineSource");
        let temp = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: point
          },
          properties: {}
        }
        this.navMarkers.push(temp)
        mapObj.mapInstance.addSource('PointSource', {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: this.navMarkers
          }
        });
        mapObj.mapInstance.map.addLayer({
          'id': 'PointsLayer',
          'type': 'symbol',
          'source': 'PointSource',
          'layout': {
            'icon-image': 'diyPoint',
            'icon-size': 0.8,
          }
        })
        if (this.navMarkers.length > 1) {

          let distance = turf.distance(turf.point(this.markersLinePoints[this.navMarkers.length - 2]), turf.point(this.markersLinePoints[this.navMarkers.length - 1])) * 1000;
          this.allDistance = Number(distance) + Number(this.allDistance);
          let feature = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: this.markersLinePoints
            },
            properties: {
              distance: this.allDistance.toFixed(2) + ' m'
            }
          }
          this.featuresLine.push(feature)
          mapObj.mapInstance.addSource('LineSource', {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: this.featuresLine
            }
          });
          mapObj.mapInstance.map.addLayer({
            'id': 'LineLayer',
            'type': 'line',
            'source': 'LineSource',
            paint: {
              "line-color": '#FF4A4A',
              "line-width": 3
            }
          }, 'PointsLayer')
          let ele = document.createElement("div");
          ele.innerHTML = `
              <div style="color: #FF4A4A">${(this.allDistance / 1000).toFixed(2) + ' km'}</div>
            `
          let marker = mapObj.mapInstance.newMarker({
            element: ele,
            offset: [0, 15]
          });
          marker.setLngLat(point).addTo(mapObj.mapInstance.map);
          this.lineMarkers.push(marker);

        }
      }
    },
    // 测面
    addNavigatorPointsArea(point) {
      if (this.firstPoint.length === 0) this.firstPoint = point;
      if (point) {
        this.markersAreaPoints.push(point)
        mapObj.mapInstance.map.getLayer("PointALayer") && mapObj.mapInstance.map.removeLayer("PointALayer");
        mapObj.mapInstance.map.getLayer("AreasLayer") && mapObj.mapInstance.map.removeLayer("AreasLayer");
        mapObj.mapInstance.map.getSource("PointASource") && mapObj.mapInstance.map.removeSource("PointASource");
        mapObj.mapInstance.map.getSource("AreasSource") && mapObj.mapInstance.map.removeSource("AreasSource");
        let temp = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: point
          },
          properties: {}
        }
        this.areaMarkers.push(temp)
        mapObj.mapInstance.addSource('PointASource', {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: this.areaMarkers
          }
        });
        mapObj.mapInstance.map.addLayer({
          'id': 'PointALayer',
          'type': 'symbol',
          'source': 'PointASource',
          'layout': {
            'icon-image': 'diyPoint',
            'icon-size': 0.8,
          }
        })
        let feature = this.markersAreaPoints.concat([this.firstPoint]);
        let features = turf.polygon([feature]);
        mapObj.mapInstance.addSource('AreasSource', {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [features]
          }
        });
        mapObj.mapInstance.map.addLayer({
          'id': 'AreasLayer',
          'type': 'fill',
          'source': 'AreasSource',
          paint: {
            'fill-color': '#FF4A4A',
            'fill-opacity': 0.4
          }
        }, 'PointALayer')
        let distance = turf.area(features);
        if (this.areaMarker) this.areaMarker.remove();
        let ele = document.createElement("div");
        ele.innerHTML = `
              <div style="color: #FF4A4A">${(distance / 1000 / 1000).toFixed(2) + ' km²'}</div>
            `
        let marker = mapObj.mapInstance.newMarker({
          element: ele,
          offset: [0, 15]
        });
        marker.setLngLat(point).addTo(mapObj.mapInstance.map);
        this.areaMarker = marker;
      }

    },
    addNavigationControl() {
      mapObj.mapInstance.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    },
    addFullscreenControl() {
      mapObj.mapInstance.map.addControl(new mapboxgl.FullscreenControl());
    },
    addScaleControl() {
      mapObj.mapInstance.map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
    },
    clearNavigatorPoint() {
      if (this.navigatorMarker) {
        this.navigatorMarker.remove()
      };
      if (this.navigatorMarker2) {
        this.navigatorMarker2.remove()
      };
      if (this.lineMarkers.length > 0) {
        this.lineMarkers.forEach(marker => {
          marker.remove();
        });
      }
      if (this.areaMarker) this.areaMarker.remove();
      mapObj.mapInstance.map.getLayer("LineLayer") && mapObj.mapInstance.map.removeLayer("LineLayer");
      mapObj.mapInstance.map.getSource("LineSource") && mapObj.mapInstance.map.removeSource("LineSource");
      mapObj.mapInstance.map.getLayer("PointsLayer") && mapObj.mapInstance.map.removeLayer("PointsLayer");
      mapObj.mapInstance.map.getSource("pointSource") && mapObj.mapInstance.map.removeSource("pointSource");
      mapObj.mapInstance.map.getLayer("PointALayer") && mapObj.mapInstance.map.removeLayer("PointALayer");
      mapObj.mapInstance.map.getLayer("AreasLayer") && mapObj.mapInstance.map.removeLayer("AreasLayer");
      mapObj.mapInstance.map.getSource("pointASource") && mapObj.mapInstance.map.removeSource("pointASource");
      mapObj.mapInstance.map.getSource("AreasSource") && mapObj.mapInstance.map.removeSource("AreasSource");
      this.navMarkers = [];
      this.lineMarkers = [];
      this.featuresLine = [];
      this.areaMarkers = [];
      this.firstPoint = [];
      this.markersLinePoints = [];
      this.markersAreaPoints = [];
      this.allDistance = null;
    },
    echoYhDeveice({ uncured, curing }, callback) {
      if (!mapObj.mapInstance.getLayer('uncuredLine')) {
        mapObj.mapInstance.addSource('uncured', {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        })
        mapObj.mapInstance.addLayer({
          id: "uncuredLine",
          type: "line",
          source: "uncured",
          paint: {
            'line-width': 3,
            'line-color': "#ffa01e",
          }
        }, 'cure')
        mapObj.mapInstance.addLayer({
          id: "uncuredPoint",
          type: "symbol",
          filter: ["==", '$type', "Point"],
          source: "uncured",
          filter: ['==', '$type', 'Point'],
          layout: {
            'icon-size': 1,
            'icon-image': "eventPoint"
          }
        }, 'cure')

        mapObj.mapInstance.addSource('curing', {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        })
        mapObj.mapInstance.addLayer({
          id: "curingLine",
          type: "line",
          source: "curing",
          paint: {
            'line-width': 10,
            'line-color': "#39d98a",
          }
        }, 'cure');
        mapObj.mapInstance.addLayer({
          id: "curingPoint",
          type: "symbol",
          filter: ["==", '$type', "Point"],
          source: "curing",
          filter: ['==', '$type', 'Point'],
          layout: {
            'icon-size': 1,
            'icon-image': "eventLine"
          }
        }, 'cure');
      }

      if (callback) {
        mapObj.mapInstance.map.off('click', this.callback)
        this.callback = callback;
        mapObj.mapInstance.map.on('click', callback)
      }
      mapObj.mapInstance.setSourceData('uncured', {
        type: "FeatureCollection",
        features: uncured
      })
      mapObj.mapInstance.setSourceData('curing', {
        type: "FeatureCollection",
        features: curing
      });
      this.makePosition(uncured.concat(curing))
    },
    makePosition(features) {
      if (features.length) {
        let bbox = turf.bbox({
          type: "FeatureCollection",
          features
        });
        mapObj.mapInstance.map.fitBounds(bbox, {
          padding: { top: 10, bottom: 25, left: 15, right: 5 }
        });
      } else {
        mapObj.mapInstance.map.fitBounds([[120.38188484498045, 30.56868547578088], [119.51549097554295, 30.178356987720612]], {
          linear: false
        });
      }
    },
    //超图几何查询
    async getDataWithSpatial({ datasetNames = this.wsDatabaseNames1, geometry }) {
      return await mapObj.mapInstance.getDataWithSpatial({ datasetNames, geometry });
    },
    //超图几何条件查询
    async getDataWithSpatialAtt({ datasetNames = this.dataNames, geometry, sql }) {
      return await mapObj.mapInstance.getDataWithSpatialAtt({ datasetNames, geometry, sql });
    },
    async getDataWithSql({ datasetNames = this.databaseNames1, sql }) {
      return await mapObj.mapInstance.getDataWithSql(datasetNames, sql);
    },
    //查询点击处特征
    queryRenderedFeatures(e) {
      return mapObj.mapInstance.queryRenderedFeatures(e);
    },
    //进入养护展示养护面区
    showPology(features) {
      mapObj.mapInstance.addSource('yhPology', {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features
        }
      });
      mapObj.mapInstance.addLayer({
        id: "yhPology",
        source: "yhPology",
        type: "fill",
        paint: {
          'fill-color': "#2A83E6",
          'fill-opacity': 0.2
        }
      }, 'yhppp', 'user');
      mapObj.mapInstance.addLayer({
        id: "yhLine",
        source: "yhPology",
        type: "line",
        paint: {
          'line-color': "#2A83E6",
          'line-width': 2
        }
      }, 'yhppp', 'user');
      mapObj.mapInstance.addSource('yhPology1', {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
      mapObj.mapInstance.addLayer({
        id: "yhPology1",
        source: "yhPology1",
        type: "fill",
        paint: {
          'fill-color': "#2A83E6",
          'fill-opacity': 0.2
        }
      }, 'yhppp', 'user')
    },
    //判断是否到达指定范围
    checkPosition(point, features) {
      this.dataNames = [];
      let tempFeature = features.find(feature => turf.inside(point, feature));
      if (tempFeature && tempFeature.properties && tempFeature.properties.businessType === '供水') {
        this.dataNames = this.gsDatabaseNames1;
      } else {
        this.dataNames = this.wsDatabaseNames1;
      }
      let ptsWithin = turf.within(turf.featureCollection([turf.point(point)]), turf.featureCollection(features));
      if (ptsWithin.features.length !== 0) {
        return features.find(feature => turf.inside(point, feature));
      }
      return false
    },
    //生成2km为半径的圆,并查找设施
    async setBuffer(point, radius = 0.035, feature) {
      let buffered = turf.buffer(turf.point(point), radius, 'kilometers');
      if (feature) {
        return turf.intersect(buffered, feature);
      }
      // mapObj.mapInstance.map.setLayoutProperty('yhPology','visibility','none');
      // mapObj.mapInstance.setSourceData('yhPology1',{
      //   type:"FeatureCollection",
      //   features:[buffered]
      // });
      return buffered;
    },
    //到达错误，回退
    pologyBack() {
      mapObj.mapInstance.map.setLayoutProperty('yhPology1', 'visibility', 'none');
      mapObj.mapInstance.map.setLayoutProperty('yhPology', 'visibility', 'visible');
    },
    //移除养护所有面区
    removeAllYH() {
      if (mapObj.mapInstance.map.getSource('yhPology1')) {
        mapObj.mapInstance.removeGroupLayer('yhppp');
        mapObj.mapInstance.removeSource('yhPology1');
        mapObj.mapInstance.removeSource('yhPology');
      }

    },
    // 超图集合查询通过管径级别和特定的数据集
    async getDataWithSpatialAndPipeLevel({ inspBusinessType, geom, pipeLevel }) {
      let datasetNames = [];
      let isSupply = false;
      switch (inspBusinessType) {
        case "WATER_SUPPLY":
          datasetNames = this.gsDatabaseNames;
          isSupply = true;
          break;
        case "RAI_WATER":
          datasetNames = this.ysDatabaseNames;
          break;
        case "POLLUTED_WATER":
          datasetNames = this.wsDatabaseNames;
          break;
        default:
          datasetNames = this.databaseNames;
          break;
      }
      return await mapObj.mapInstance.getDataWithSpatialAndPipeLevel({ datasetNames, geom, pipeLevel, isSupply });
    },
    // 画半径为radius的圆范围
    drawBuffer(point, radius = 0.020) {
      let buffered = turf.buffer(point, radius, { unit: 'kilometers' });
      mapObj.mapInstance.setSourceData('buffered', {
        type: "FeatureCollection",
        features: [buffered]
      })
    },
    // 添加缓冲区的图层
    addBufferLayer() {
      mapObj.mapInstance.addSource('buffered', {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      })
      mapObj.mapInstance.addLayer({
        id: "bufferLayer",
        type: "fill",
        source: "buffered",
        paint: {
          "fill-color": "#FFB6C1",
          "fill-opacity": 0.5
        }
      }, 'lightLayer');
    },
    async addInspLayer() {
      await mapObj.mapInstance.map.addLayer({
        id: "rangePipesLayer",
        source: "1549000686380879873",
        "source-layer": "1549000686380879873",
        "metadata": {
          "layerId": "1549000686380879873"
        },
        type: "line",
        "layout": { "visibility": "none" },
        paint: {
          // "line-color": [
          //   'case',
          //   ['boolean', ['feature-state', 'insp'], false],
          //   "#00945e",
          //   "#ff0000"
          // ],
          "line-color": "#44BA5A",
          "line-width": 3
        }
      }, 'mapBorder')
    },
    // 添加巡检范围,暂时为polygon类型
    addRangeLayer(geom, idx) {
      if (!mapObj.map.getSource("rangeSource_" + idx)) {
        mapObj.mapInstance.addSource("rangeSource_" + idx, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [{
              geometry: geom,
              type: 'Feature'
            }]
          }
        });
      }
      if (!mapObj.map.getLayer("rangeLayer_" + idx)) {
        mapObj.mapInstance.map.addLayer({
          id: "rangeLayer_" + idx,
          type: "fill",
          source: "rangeSource_" + idx,
          paint: {
            "fill-color": "#e6edfa",
            "fill-opacity": 0.6
          }
        }, 'keypointsLayer');
      }
      if (!mapObj.map.getLayer("rangeLayerLine_" + idx)) {
        mapObj.mapInstance.map.addLayer({
          id: "rangeLayerLine_" + idx,
          type: "line",
          source: "rangeSource_" + idx,
          paint: {
            "line-color": "#e6edfa",
            "line-dasharray": [4, 4],
            "line-width": 3
          }
        }, 'keypointsLayer');
      }
    },
    // 根据管径级别、范围、业务类型查询范围内的矢量瓦片
    async addRangeMVT(params) {
      const that = this;
      that.removeRangeMVT();
      /**
      const geomStr = params.geom;
      const res = await that.$api.postAction("/yhsw-postgis/addQueryPlane", geomStr);
      let id;
      if (res.status) {
        id = res.data || '1398548977837674498';
      }
      let pipeType;
      switch (params.inspBusinessType) {
        case "WATER_SUPPLY":
          pipeType = "供水管线";
          break;
        case "RAI_WATER":
          pipeType = "雨水管线";
          break;
        case "POLLUTED_WATER":
          pipeType = "污水管线";
          break;
        case "ORIGIN_WATER":
          pipeType = "源水管线";
          break;
        case "RIVER_WATER":
          pipeType = "排江管";
          break;
        default:
          break;
      }
      // const res2 = await that.$api.getAction("/")
      let url;
      if (params.calibers) {
        url = baseUrl.url_config + `/yhsw-postgis/getAllLineHashInsp/{x}/{y}/{z}?rangId=${id}&calibres=${params.calibers}&type=${pipeType}&endDate=${params.endDate}`;
      } else {
        let caliberStr = window.btoa(JSON.stringify(params.caliberVOS));
        url = baseUrl.url_config + `/yhsw-postgis/getAllLineInfoInspMultiple/{x}/{y}/{z}?id=${id}&caliberVOListStr=${caliberStr}&type=${pipeType}&endDate=${params.endDate}`;
      }
      */
      let url = baseUrl.url_config + `ops-inspection/getAllLineTask/{x}/{y}/{z}?taskId=${params.taskId}`;
      mapObj.mapInstance.addSource("rangePipeVector", {
        type: "vector",
        tiles: [url],
        promoteId: 'guid'
      })
      mapObj.mapInstance.map.addLayer({
        id: "rangePipesLayer",
        source: "rangePipeVector",
        "source-layer": "line",
        type: "line",
        paint: {
          "line-color": [
            'case',
            ['boolean', ['feature-state', 'insp'], false],
            "#00945e",
            "#ff0000"
          ],
          "line-width": 3
        }
      }, 'keypointsLayer')
      // 选中当前管线图层
      mapObj.mapInstance.addSource("curInspLineSource", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
      mapObj.mapInstance.map.addLayer({
        id: "curInspLineLayer",
        type: "line",
        source: "curInspLineSource",
        paint: {
          "line-color": "#4264FB",
          "line-width": 8
        }
      }, "keypointsLayer");
      mapObj.mapInstance.map.addLayer({
        id: "curInspPointLayer",
        type: "circle",
        source: "curInspLineSource",
        filter: ['==', '$type', 'Point'],
        paint: {
          "circle-color": "#FFA01E",
          "circle-radius": 8
        },
      }, "keypointsLayer")
      // 对管线进行上报
      mapObj.mapInstance.map.on('click', 'rangePipesLayer', function (e) {
        let features = mapObj.mapInstance.map.queryRenderedFeatures(e.point, {
          layers: ["rangePipesLayer"]
        });
        that.setLineGeoSource([features[0]], "curInspLineSource");
      })
    },
    // 移除巡检管线MVT
    removeRangeMVT() {
      // 如果存在范围的MVT图层，就移除该图层
      mapObj.mapInstance.map.getLayer("rangePipesLayer") && mapObj.mapInstance.map.removeLayer("rangePipesLayer");
      mapObj.mapInstance.map.getSource("rangePipeVector") && mapObj.mapInstance.map.removeSource("rangePipeVector");
      mapObj.mapInstance.map.getLayer("curInspLineLayer") && mapObj.mapInstance.map.removeLayer("curInspLineLayer");
      mapObj.mapInstance.map.getLayer("curInspPointLayer") && mapObj.mapInstance.map.removeLayer("curInspPointLayer");
      mapObj.mapInstance.map.getSource("curInspLineSource") && mapObj.mapInstance.map.removeSource("curInspLineSource");
      // 清空此次巡检保存的要素
      recordFeatures = [];
    },
    // 设置巡检范围
    setRangeLayer(rangeList, ifEmergency = false) {
      let that = this;
      rangeList.forEach((range) => {
        // 如果为应急任务，不加载管线数据
        if (!ifEmergency) {
          // 替换为新的超图查询方法
          const params = {
            taskId: range.taskId ? range.taskId : undefined,
            calibers: range.calibers ? range.calibers : undefined,
            caliberVOS: range.caliberVOS ? range.caliberVOS : undefined,
            endDate: range.endDate ? range.endDate : undefined,
            inspBusinessType: range.inspBusinessType,
            geom: range.geometry,
            pipeLevel: range.pipeLevel
          }
          // 高亮管线替换矢量瓦片
          this.addRangeMVT(params);

          // that.getDataWithSpatialAndPipeLevel(params)
          //   .then(devices => {
          //     if (devices.data.features.length > 0) {
          //       let features = devices.data.features;
          //       that.handleInspData(features, false, !ifEmergency);
          //     }
          //   })
        }
      })
      that.setLineGeoSource(rangeList, "rangeSource")
    },
    // 在图层中添加关键点，优化性能
    addKeyPointLayer() {
      mapObj.mapInstance.map.addSource('keypoints', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        promoteId: 'engId'
      });
      mapObj.mapInstance.map.addLayer({
        id: 'keypointsLayer',
        type: 'symbol',
        source: 'keypoints',
        layout: {
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-image": [
            'case',
            ['==', ['get', 'isOrange'], true],
            '已退回',
            ['==', ['get', 'isGreen'], true],
            '正常',
            ['==', ['get', 'isRed'], true],
            '异常',
            ['==', ['get', 'isBlue'], true],
            '未巡检',
            '未巡检'
          ],
          'icon-size': 0.4,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      }, 'mapBorder');
      mapObj.map.on('click', 'keypointsLayer', this.signInBuffer)
    },
    signInBuffer(e) {
      // if (localStorage.getItem('startRecordLines') == 'start') {
        if (true) {
        let features = mapObj.mapInstance.map.queryRenderedFeatures(e.point, {
          layers: ["keypointsLayer"]
        });
        if (features.length > 0) {
          const feat = JSON.parse(features[0].properties.feature);
          this.drawBuffer(feat.geom);
          bus.$emit("startSignIn", feat);
        }
      } else {
        Toast({
          message: '巡检未开始，无法打卡签到',
          duration: 2000
        })
        return
      }
    },
    setKeyPointLayer(features) {
      let timer = setInterval(() => {
        if (mapObj.map.getSource('keypoints')) {
          mapObj.mapInstance.setSourceData('keypoints', {
            type: "FeatureCollection",
            features: features
          });
          clearInterval(timer)
        }
      }, 100)
    },
    // 添加关键点marker
    addKeyPointMarker(feature, ifDetail = false) {
      let position = feature.engGeom.coordinates;
      let name = feature.engNum || "关键点名称";
      const src = require('@/assets/img/inspection/icon_key_point_pink.png');
      let ele = document.createElement("div");
      ele.innerHTML = `
          <img id="keypoint_${feature.engId}" src="${src}" width="24" height="24">
        `

      let marker = mapObj.mapInstance.newMarker({
        element: ele,
        offset: [0, -10]
      });
      // const markerHTML = `
      //     <div>
      //       <div
      //         style="float: left;"
      //       >
      //         <strong>${name}</strong>
      //       </div>
      //       <button
      //         id="btn_${feature.engId}"
      //         style="color: #fff;background-color: #2A83E6;border-color: #fff;border-width:0px;"
      //       >签到</button>
      //     </div>
      //   `
      // const markerHTMLDetail = `
      //     <div>
      //       <div
      //         style="float: left;"
      //       >
      //         <strong>${name}</strong>
      //       </div>
      //     </div>
      //   `
      marker
        .setLngLat(position)
        .addTo(mapObj.mapInstance.map);
      //   .setPopup(mapObj.mapInstance.newPopup({ offset: [0, -15], closeButton: false })
      //     .setHTML(ifDetail ? markerHTMLDetail : markerHTML))
      //   .addTo(mapObj.mapInstance.map);
      // marker.togglePopup();
      if (!ifDetail) {
        // 对按钮添加事件，进行调出签到框
        // document.getElementById("btn_" + feature.engId).addEventListener("click", (e) => {
        //   bus.$emit("startSignIn", feature);
        //   e.stopPropagation();
        // })
        // 对img添加点击事件
        document.getElementById("keypoint_" + feature.engId).addEventListener("click", (e) => {
          // 获取当前点击的关键点
          let clickKeyPoint = document.getElementById("keypoint_" + feature.engId);
          if (clickKeyPoint) {
            if (clickKeyPoint == this.currentKeyPoint) {
              // 如果当前点击的关键点与全局的当前关键点相同，即重复点击取消放大或进行放大
              if (clickKeyPoint.style.width == "24px") {
                clickKeyPoint.style.width = "40px";
                clickKeyPoint.style.height = "40px";
                // marker.togglePopup();
                this.drawBuffer(feature.engGeom);
                bus.$emit("startSignIn", feature);
              } else {
                clickKeyPoint.style.width = "24px";
                clickKeyPoint.style.height = "24px";
              }
            } else {
              if (this.currentKeyPoint) {
                // 初始情况下，暂不设置全局的当前关键点的大小，如果已经存在全局当前关键点，则将其恢复原状
                this.currentKeyPoint.style.width = "24px";
                this.currentKeyPoint.style.height = "24px";
              }
              // 放大当前点击的关键点
              clickKeyPoint.style.width = "40px";
              clickKeyPoint.style.height = "40px";
              // marker.togglePopup();
              this.drawBuffer(feature.engGeom);
              bus.$emit("startSignIn", feature);
              this.currentKeyPoint = clickKeyPoint;
            }
          }
          e.stopPropagation();
        })
      }

    },
    removeKeyPointMarker(ids) {
      ids.forEach(id => {
        let currentEle = document.getElementById("keypoint_" + id);
        if (currentEle) {
          currentEle.parentNode.removeChild(currentEle);
        }
      })
    },
    // 改变关键点marker的颜色，替换图片地址, status为true显示绿色，为false显示份色
    changeKeyPointMarker(engId, status) {
      const src = require('@/assets/img/inspection/icon_key_point_pink.png');
      const src2 = require('@/assets/img/inspection/icon_key_point_green.png');
      let clickKeyPoint = document.getElementById("keypoint_" + engId);
      if (clickKeyPoint) {
        if (status) {
          clickKeyPoint.src = src2;
        } else {
          clickKeyPoint.src = src;
        }

      }
    },
    // 移除所有应急巡检marker
    removeInspEmeMarker(ids) {
      ids.forEach(id => {
        // 如果存在id为eventObj_one的元素，则删除此元素重新创建，保持全局只有一个此元素
        let currentEle = document.getElementById("eme_" + id);
        if (currentEle) {
          currentEle.parentNode.removeChild(currentEle);
        }
      })
    },
    // 添加应急巡检的marker
    addInspEmeMarker(feature, ifDetail = false) {
      let position;
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        const center = turf.center(feature.geometry);
        position = center.geometry.coordinates;
      } else if (feature.geometry.type === 'LineString') {
        const center = turf.center(feature.geometry);
        position = center.geometry.coordinates;
      } else if (feature.geometry.type === 'Point') {
        position = feature.geometry.coordinates;
      }
      if (!position) return;
      let name = feature.properties.name || "巡检范围";
      const src = require('@/assets/img/inspection/icon_emergency_point.png');
      let ele = document.createElement("div");
      ele.innerHTML = `
          <img id="eme_${feature.id}" src="${src}" width="24" height="24"></img>
        `
      let marker = mapObj.mapInstance.newMarker({
        element: ele,
        offset: [0, -5]
      });
      const markerHTML = `
          <div id="base_${feature.id}">
          </div>
        `
      if (!ifDetail) {
        marker
          .setLngLat(position)
          .setPopup(mapObj.mapInstance.newPopup({ offset: [0, -15], closeButton: false })
            .setHTML(markerHTML))
          .addTo(mapObj.mapInstance.map);
        marker.togglePopup();
        let countTime = new CountTimePop({ propsData: { restTime: feature.restTime } });
        countTime.$mount(`#base_${feature.id}`);
        // 对img添加点击事件
        document.getElementById("eme_" + feature.id).addEventListener("click", (e) => {
          // 获取当前点击的关键点
          let clickEmeMarker = document.getElementById("eme_" + feature.id);
          if (clickEmeMarker) {
            if (clickEmeMarker == this.currentEmeMarker) {
              if (clickEmeMarker.style.width == "24px") {
                clickEmeMarker.style.width = "40px";
                clickEmeMarker.style.height = "40px";
                bus.$emit("startEmeSignIn", feature);
                marker.togglePopup();
              } else {
                clickEmeMarker.style.width = "24px";
                clickEmeMarker.style.height = "24px";
              }
            } else {
              if (this.currentEmeMarker) {
                this.currentEmeMarker.style.width = "24px";
                this.currentEmeMarker.style.height = "24px";
              }
              clickEmeMarker.style.width = "40px";
              clickEmeMarker.style.height = "40px";
              marker.togglePopup();
              bus.$emit("startEmeSignIn", feature);
              this.currentEmeMarker = clickEmeMarker;
            }
          }
          e.stopPropagation();
        })
      } else {
        marker
          .setLngLat(position)
          .addTo(mapObj.mapInstance.map);
      }
    },
    // 添加巡检事件marker
    addInspEventMarker(feature) {
      let position;
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        const center = turf.center(feature.geometry);
        position = center.geometry.coordinates;
      } else if (feature.geometry.type === 'LineString') {
        const center = turf.center(feature.geometry);
        position = center.geometry.coordinates;
      } else if (feature.geometry.type === 'Point') {
        position = feature.geometry.coordinates;
      }
      if (!position) return;
      const src = require('@/assets/img/inspection/icon_event_map.png');
      let ele = document.createElement("div");
      ele.innerHTML = `
          <img id="event_${feature.id}" src="${src}" width="24" height="24"></img>
        `
      let marker = mapObj.mapInstance.newMarker({
        element: ele,
        offset: [0, 10]
      });
      marker
        .setLngLat(position)
        .setPopup(mapObj.mapInstance.newPopup({ offset: [0, 0], closeButton: false })
          .setHTML(`
            <div style="color: #333333;">
              <strong>${this.eventTypeList[feature.eventType] || '上报事件'}</strong>
            </div>
          `))
        .addTo(mapObj.mapInstance.map);
      marker.togglePopup();
    },
    // 添加巡检事件在图层中
    addInspEventLayer(features) {
      let that = this;
      mapObj.map.loadImage(
        require('@/assets/img/inspection/icon_event_map.png'),
        function (error, image) {
          if (error) throw error;
          if (!mapObj.map.hasImage('event-marker')) {
            mapObj.map.addImage('event-marker', image);
          }
          mapObj.map.addSource('eventPoints', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': features
            }
          });
          mapObj.map.addLayer({
            'id': 'eventPointsLayer',
            'type': 'symbol',
            'source': 'eventPoints',
            'layout': {
              "visibility": 'none',
              "icon-allow-overlap": true,//自动避让属性
              "icon-ignore-placement": true,
              'icon-image': 'event-marker',
              'icon-size': 0.4,
              'icon-offset': [0, 10]
            }
          })
        }
      )
      // mapObj.mapInstance.map.on('click', 'eventPointsLayer', function (e) {
      //   let features = mapObj.mapInstance.map.queryRenderedFeatures(e.point, {
      //     layers: ["eventPointsLayer"]
      //   });
      //   let eventType = "";
      //   features.forEach(item => {
      //     if (item.properties && item.properties.eventType) {
      //       eventType += that.eventTypeList[item.properties.eventType] + " ";
      //     }
      //   });
      //   let popup = mapObj.mapInstance.newPopup({ offset: [0, -5], closeButton: false })
      //     .setLngLat(e.lngLat)
      //     .setHTML(`<h3>${eventType}</h3>`)
      //     .addTo(mapObj.mapInstance.map)
      // })
    },
    // 添加上报对象的marker
    addEventObjMarker(feature, pointType, type, gridObj) {
      let position;
      let pop
      let marker
      if (pointType == 'device') {
        console.log(feature)
        if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
          const center = turf.center(feature.geometry);
          position = center.geometry.coordinates;
        } else if (feature.geometry.type === 'LineString') {
          const center = turf.center(feature.geometry);
          position = center.geometry.coordinates;
        } else if (feature.geometry.type === 'Point') {
          position = feature.geometry.coordinates;
        }
        this.currentPoint = JSON.parse(JSON.stringify(feature))
        this.currentPoint.taskId = this.$route.query.taskId
        this.currentPoint.gridId = gridObj.gridId
        this.currentPoint.gridName = gridObj.gridName
        this.currentPoint.gridManager = gridObj.gridManager
        this.currentPoint.lng = feature.geometry.coordinates[0]
        this.currentPoint.lat = feature.geometry.coordinates[1]
        // 要素所在图层ID和属性信息
        this.currentPoint.layerID = feature.layer.id
        this.currentPoint.layerType = feature.layer.type
        this.currentPoint.properties = feature.properties
        // 底图要素name_local或设施要素road_name,id
        this.currentPoint.road_name = feature.properties.road_name
        this.currentPoint.id = feature.properties.id
        this.currentPoint.code = feature.properties.manhole_code || feature.properties.gate_code || feature.properties.outlet_code
          || feature.properties.comb_code || feature.properties.valve_code || feature.properties.pump_station_code
          || feature.properties.plant_code || feature.properties.pump_code || feature.properties.fire_cock_code
          || feature.properties.start_code + ',' + feature.properties.end_code || ''
        // 要素对象类型（业务类型/设施类型）
        switch (feature.layer.id) {
          // 雨水
          case "rd_map_comb"://comb一定是雨水口
            this.currentPoint.bigType = '雨水'
            this.currentPoint.smallType ='雨水口'
            break
          case "rd_map_outfall"://排放口 1-雨水； 2-污水； 3-合流； 4-其他
            this.currentPoint.bigType = feature.properties.pipe_type
            this.currentPoint.smallType = '排放口'
            break
          case "rd_map_manhole"://检查井  1-雨水；2-污水
            this.currentPoint.bigType = feature.properties.manhole_type
            this.currentPoint.smallType = feature.properties.manhole_type + '检查井'
            break
          case "rd_map_gate"://闸门 1-雨水； 2-污水； 3-合流； 4-其他
            this.currentPoint.bigType = feature.properties.pipe_type
            this.currentPoint.smallType = '闸门'
            break
          case "rd_map_drainpipe_ys_big":
            this.currentPoint.bigType = '雨水'
            this.currentPoint.smallType = '雨水管线'
            break
          case "rd_map_drainpipe_ys_small":
            this.currentPoint.bigType = '雨水'
            this.currentPoint.smallType = '雨水管线'
            break
          // 污水
          case "rd_map_drainpipe_ws_big":
            this.currentPoint.bigType = '污水'
            this.currentPoint.smallType = '污水管线'
            break
          case "rd_map_drainpipe_ws_small":
            this.currentPoint.bigType = '污水'
            this.currentPoint.smallType = '污水管线'
            break
          // 给水
          case "map_supply_firehydrant"://消火栓一定是给水
            this.currentPoint.bigType = '供水'
            this.currentPoint.smallType = '消火栓'
            break
            case "map_recycle_valve"://阀门valve一定是给水
              this.currentPoint.bigType = '再生水'
              this.currentPoint.smallType = '阀门'
              break
          case "map_supply_valve"://阀门valve一定是给水
            this.currentPoint.bigType = '供水'
            this.currentPoint.smallType = '阀门'
            break
          case "map_supply_pipe_distribute"://配水管线
            this.currentPoint.bigType = '给水'
            this.currentPoint.smallType = '配水管线'
            break
          case "map_supply_pipe_delivery"://输水管线
            this.currentPoint.bigType = 'supply'
            this.currentPoint.smallType = '输水管线'
            break
          case "map_supply_pipe_circulating"://回水管线
            this.currentPoint.bigType = '给水'
            this.currentPoint.smallType = '回水管线'
            break
          case "map_waterwork"://供水厂
            this.currentPoint.bigType = '给水'
            this.currentPoint.smallType = '供水厂'
            break
          // 再生水
          case "map_recycle_pipe"://再生水管线
            this.currentPoint.bigType = '再生水'
            this.currentPoint.smallType = 'pipeline'
            break
          case "map_waterwork"://再生水厂
            this.currentPoint.bigType = '再生水'
            this.currentPoint.smallType = '再生水厂'
            break
        }
  
        const src = require(`@/assets/img/legend/事件上报.png`);
        // 如果存在id为eventObj_one的元素，则删除此元素重新创建，保持全局只有一个此元素
        let currentEle = document.getElementById("eventObj_one");
        if (currentEle) {
          currentEle.parentNode.removeChild(currentEle);
        }
        let ele = document.createElement("div");
        ele.innerHTML = `
            <img id="eventObj_one" src="${src}" width="40" height="40">
          `
        marker = mapObj.mapInstance.newMarker({
          element: ele
        });
        marker
          .setLngLat(position)
          .setPopup(mapObj.mapInstance.newPopup({ offset: [0, -7], closeButton: false })
            .setHTML(`<div id="deviceDetail"></div>`))
          .addTo(mapObj.map);
        pop = new PopupItem({ propsData: { deviceCode: this.currentPoint.code, type: type, isDevice: true, fun: this.goToDetail } })
      } else if (pointType == 'lnglat') {
        this.currentPoint = feature
        this.currentPoint.taskId = this.$route.query.taskId
        this.currentPoint.gridId = gridObj.gridId
        this.currentPoint.gridName = gridObj.gridName
        this.currentPoint.gridManager = gridObj.gridManager
        position = [feature.lng, feature.lat]
  
        const src = require(`@/assets/img/legend/事件上报.png`);
        // 如果存在id为eventObj_one的元素，则删除此元素重新创建，保持全局只有一个此元素
        let currentEle = document.getElementById("eventObj_one");
        if (currentEle) {
          currentEle.parentNode.removeChild(currentEle);
        }
        let ele = document.createElement("div");
        ele.innerHTML = `
            <img id="eventObj_one" src="${src}" width="40" height="40">
          `
        marker = mapObj.mapInstance.newMarker({
          element: ele
        });
        marker
          .setLngLat(position)
          .setPopup(mapObj.mapInstance.newPopup({ offset: [0, -7], closeButton: false })
            .setHTML(`<div id="deviceDetail"></div>`))
          .addTo(mapObj.map);
        pop = new PopupItem({ propsData: { lng: this.currentPoint.lng, lat: this.currentPoint.lat, type: type, isDevice: false, fun: this.goToDetail } })
      }
      this.$nextTick(() => {
        pop.$mount('#deviceDetail')
      })
      marker.togglePopup();

    },
    goToDetail(type) {
      if (type == 'event') {
        this.$router.push({
          name: 'addProblemIndex',
          query: { msg: this.currentPoint, token: this.formToken, taskId: this.$route.query.taskId, from: 'insp' },
          params: { type: 'add' }
        })
      } else {
        this.$router.push({
          name: 'addFlaws',
          query: { msg: this.currentPoint, token: this.formToken, taskId: this.$route.query.taskId, from: 'insp' },
          params: { type: 'add' }
        })
      }
    },
    // 移除上报事件的对象marker
    removeEventObjMarker() {
      // 如果存在id为eventObj_one的元素，则删除此元素重新创建，保持全局只有一个此元素
      let currentEle = document.getElementById("eventObj_one");
      if (currentEle) {
        currentEle.parentNode.removeChild(currentEle);
        // bus.$emit("reportInspEvent", {}, false);
      }
    },
    // 加载巡检人的1公里以内的管线数据
    addInspBufferData(position, radius = 0.5) {
      let buffered = turf.buffer(position, radius, 'kilometers');
      const params = {
        inspBusinessType: position.inspBusinessType,
        geom: buffered.geometry,
        pipeLevel: position.pipeLevel
        // pipeLevel: {
        //   pipeMax: null,
        //   pipeMin: null
        // }
        // pipeLevel: null
      }
      // this.getDataWithSpatial({ geometry: buffered.geometry})
      this.getDataWithSpatialAndPipeLevel(params)
        .then(devices => {
          // console.log("devices==>", devices);
          if (devices.data.features.length > 0) {
            let features = devices.data.features;
            this.handleInspData(features, true, false);
          }
        })
    },
    // 返回radius为半径范围的工程对象数据
    async getInspDataInRange(position, radius = 0.035) {
      let buffered = turf.buffer(position, radius, 'kilometers');
      // const devices = await this.getDataWithSpatial({geometry: buffered.geometry});
      const params = {
        inspBusinessType: position.inspBusinessType,
        geom: buffered.geometry,
        // pipeLevel: position.pipeLevel
        // pipeLevel: {
        //   pipeMax: null,
        //   pipeMin: null
        // }
        pipeLevel: null
      }
      const devices = await this.getDataWithSpatialAndPipeLevel(params);
      let featuresData = [];
      if (devices.data.features.length > 0) {
        let features = devices.data.features;
        features.map(item => {
          let paramsObj = {};
          let fieldNames = item.fieldNames;
          let fieldValues = item.fieldValues;
          let lxnIndex = fieldNames.findIndex(it => it == "LXN");
          let pipeIndex = fieldNames.findIndex(it => it == "PIPETYPE");
          let properties = lxnIndex
            ? showProperties2[`${fieldValues[pipeIndex]}`]
            : pipeIndex
              ? showProperties2[`${fieldValues[pipeIndex]}`]
              : [];
          for (let i = 0; i < fieldNames.length; i++) {
            this.$set(paramsObj, `${fieldNames[i]}`, fieldValues[i]);
          }
          if (fieldNames.findIndex(it => it == "LENGTH") > -1) {
            this.$set(paramsObj, "UNIT", "米");
            this.$set(
              paramsObj,
              "LENGTH",
              fieldValues[fieldNames.findIndex(i => i == "LENGTH")]
            );
          } else {
            this.$set(paramsObj, "UNIT", "个");
          }
          this.$set(paramsObj, "ID", item.ID);
          let tempGeometry = turf.feature(
            {
              type: item.geometry.type === "LINE" ? "LineString" : "Point",
              coordinates: item.geometry.points.map(point => [
                point.x,
                point.y
              ])
            },
            paramsObj
          );
          this.$set(tempGeometry, "id", item.ID);
          featuresData.push(tempGeometry);
          let geometry = JSON.parse(JSON.stringify(tempGeometry));
          this.$set(paramsObj, `geometry`, geometry);
          return paramsObj;
        })
      }
      return featuresData;
    },
    // 返回radius为半径范围的工程对象数据
    async getInspDataInRangeTile(position, radius = 0.035) {
      let pipeType;
      switch (position.inspBusinessType) {
        case "WATER_SUPPLY":
          pipeType = "供水管线";
          break;
        case "RAI_WATER":
          pipeType = "雨水管线";
          break;
        case "POLLUTED_WATER":
          pipeType = "污水管线";
          break;
        case "ORIGIN_WATER":
          pipeType = "源水管线";
          break;
        case "RIVER_WATER":
          pipeType = "排江管";
          break;
        default:
          break;
      }
      const params = {
        geomPoint: position.geometry,
        pipeType: pipeType,
        radius: radius,
        type: "线"
      }
      const res = await this.$api.getAction('/yhsw-postgis/getAllPointOrLineGeomInsp', params);
      console.log("get all Point or Line geom==>", res.data);
    },
    // 处理管线等巡检数据数据
    handleInspData(data, inspUser = false, unInspLineSource = false) {
      let featuresData = [];
      data.map(item => {
        let paramsObj = {};
        let fieldNames = item.fieldNames;
        let fieldValues = item.fieldValues;
        let lxnIndex = fieldNames.findIndex(it => it == "LXN");
        let pipeIndex = fieldNames.findIndex(it => it == "PIPETYPE");
        let properties = lxnIndex
          ? showProperties2[`${fieldValues[pipeIndex]}`]
          : pipeIndex
            ? showProperties2[`${fieldValues[pipeIndex]}`]
            : [];
        for (let i = 0; i < fieldNames.length; i++) {
          this.$set(paramsObj, `${fieldNames[i]}`, fieldValues[i]);
        }
        if (fieldNames.findIndex(it => it == "LENGTH") > -1) {
          this.$set(paramsObj, "UNIT", "米");
          this.$set(
            paramsObj,
            "LENGTH",
            fieldValues[fieldNames.findIndex(i => i == "LENGTH")]
          );
        } else {
          this.$set(paramsObj, "UNIT", "个");
        }
        this.$set(paramsObj, "ID", item.ID);
        let tempGeometry = turf.feature(
          {
            type: item.geometry.type === "LINE" ? "LineString" : "Point",
            coordinates: item.geometry.points.map(point => [
              point.x,
              point.y
            ])
          },
          paramsObj
        );
        this.$set(tempGeometry, "id", item.ID);
        featuresData.push(tempGeometry);
        let geometry = JSON.parse(JSON.stringify(tempGeometry));
        this.$set(paramsObj, `geometry`, geometry);
        return paramsObj;
      })
      try {
        const that = this;
        var timer = setInterval(function () {
          if (mapObj.mapInstance && that.map.getSource("unInspLineSource") && mapObj.mapInstance.map.isSourceLoaded("rangeSource")) {
            clearInterval(timer);
            if (inspUser) {
              that.setLineGeoSource(featuresData, "inspUserLineSource");
            } else {
              that.setLineGeoSource(featuresData, "initInspLineSource");
              // 如果是未巡检线数据源
              if (unInspLineSource) {
                that.setLineGeoSource(featuresData, "unInspLineSource");
              }
            }
          }
        }, 100);
      } catch (e) {
        console.log(e);
      }
    },
    // 设置线数据源,data是数组，source为数据源名称
    setLineGeoSource(data, source) {
      if (source === "inspUserLineSource") {
        data = data;
      } else if (source === "curInspLineSource") {
        // 如果数据源是curInspLineSource，则触发管线任务上报
        // if (data.length > 0) {
        //   bus.$emit("reportInspEvent", data[0], true);
        // } else {
        //   bus.$emit("reportInspEvent", {}, false);
        // }
      } else {
        let sourceData = mapObj.mapInstance.map.getSource(source);
        data = data.concat(sourceData._data.features);
        // 数组对象去重
        let obj = {};
        data = data.reduce(function (item, next) {
          obj[next.id] ? '' : obj[next.id] = true && item.push(next);
          return item;
        }, []);
      }
      mapObj.mapInstance.setSourceData(source, {
        type: "FeatureCollection",
        features: data
      });
    },
    // 将管线数据从一个图层改到另一个图层
    changeInspLineSource(data, fromSource, toSource) {
      try {
        // 如果fromSourceData在toSourceData之后加载，则filter过滤失败，暂时将to的图层放在from上方
        let fromSourceData = mapObj.mapInstance.map.getSource(fromSource);
        let toSourceData = mapObj.mapInstance.map.getSource(toSource);

        let fromData = fromSourceData._data.features.filter(x => data.every(y => y.id !== x.id));
        data = fromSourceData._data.features.filter(x => data.some(y => y.id === x.id));
        let toData = data.concat(toSourceData._data.features);
        // console.log("fromData==>",fromSourceData._data,toSourceData._data, fromData, toData);
        mapObj.mapInstance.setSourceData(fromSource, {
          type: "FeatureCollection",
          features: fromData
        })
        mapObj.mapInstance.setSourceData(toSource, {
          type: "FeatureCollection",
          features: toData
        });
      } catch (e) {
        console.log(e);
      }
    },
    setAllInspLineSource(data) {
      try {
        const that = this;
        let timer = setInterval(function () {
          if (that.isOnLoaded() && mapObj.map.getSource("initInspLineSource") && mapObj.map.isSourceLoaded("initInspLineSource")) {
            clearInterval(timer)
            mapObj.mapInstance.setSourceData('initInspLineSource', {
              type: "FeatureCollection",
              features: data
            })
          }
        }, 100);
      } catch (e) {
        console.log(e);
      }
    },
    addInspRecordLineSource(data) {
      mapObj.mapInstance.map.addSource('')
    },
    // 已巡检管线回显, 涉及数据遍历，如果数量巨大，需要处理
    addInspRecordTileLineSource(data, completion = null) {
      const that = this;
      try {
        Toast.loading({
          message: "加载地图管线中..."
        })
        data = [...new Set(data)]
        recordFeatures.length = 0
        recordFeatures.push(...data)
        let flag = false
        that.recordTimer = setInterval(function () {
          if (flag) {
            clearInterval(that.recordTimer);
            return
          }
          setTimeout(() => {
            if (that.recordTimer) {
              clearInterval(that.recordTimer);
            }
          }, 10000)
          console.log('1')
          if (that.isOnLoaded() && mapObj.mapInstance.map.getSource("initInspLineSource") && mapObj.mapInstance.map.isSourceLoaded("initInspLineSource")) {
            let filterData = ["in", "id"];
            filterData.push(...recordFeatures)
            console.log(filterData)

            const boxFeatures = mapObj.mapInstance.map.querySourceFeatures("initInspLineSource", {
              filter: filterData
            })
            console.log(boxFeatures)
            boxFeatures.forEach(feat => {
              // 如果不存在这个state
              if (!feat.state || !feat.state.isInsp) {
                mapObj.map.setFeatureState({
                  source: "initInspLineSource",
                  id: feat.id
                }, {
                  isInsp: true
                })
              }
            })
            if (filterData.length >= 3 && boxFeatures.length > 0) {
              flag = true
            }
          }
        }, 500);
      } catch (error) {
        console.log(error);
      }
    },
    // 初始化图层，初始管线图层，已巡检管线图层，未巡检管线图层，选中当前管线图层
    addLineGeoLayer() {
      // 巡检人员范围管线
      // mapObj.mapInstance.addSource("inspUserLineSource", {
      //   type: "geojson",
      //   data: {
      //     type: "FeatureCollection",
      //     features: []
      //   }
      // });
      // mapObj.mapInstance.addLayer({
      //   id: "inspUserLineLayer",
      //   type: "line",
      //   source: "inspUserLineSource",
      //   paint: {
      //     "line-color": "#4264FB",
      //     "line-width": 3
      //   }
      // }, "rangeLayer");
      // 初始化管线图层
      mapObj.mapInstance.map.addSource("initInspLineSource", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
      mapObj.mapInstance.map.addLayer({
        id: "initInspLineLayer",
        type: "line",
        source: "initInspLineSource",
        paint: {
          "line-color": [
            'case',
            ['boolean', ['feature-state', 'isInsp'], false],
            "#44BA5A",
            "#FF0000"
          ],
          "line-width": 3
        }
      }, "rd_map_outfall");
      // 未巡检管线图层
      // mapObj.mapInstance.addSource("unInspLineSource", {
      //   type: "geojson",
      //   data: {
      //     type: "FeatureCollection",
      //     features: []
      //   }
      // });
      // mapObj.mapInstance.addLayer({
      //   id: "unInspLineLayer",
      //   type: "line",
      //   source: "unInspLineSource",
      //   paint: {
      //     "line-color": "#FF0000",
      //     "line-width": 3
      //   }
      // }, "initInspLineLayer");
      // 已巡检管线图层
      // mapObj.mapInstance.addSource("inspLineSource", {
      //   type: "geojson",
      //   data: {
      //     type: "FeatureCollection",
      //     features: []
      //   }
      // });
      // mapObj.mapInstance.addLayer({
      //   id: "inspLineLayer",
      //   type: "line",
      //   source: "inspLineSource",
      //   paint: {
      //     "line-color": "#44BA5A",
      //     "line-width": 3
      //   }
      // }, "unInspLineLayer");
    },
    setRecordData(val) {
      let that = this;
      mapObj.mapInstance.map.getLayer("rangeL") && mapObj.mapInstance.map.removeLayer("rangeL");
      mapObj.mapInstance.map.getLayer("rangeM") && mapObj.mapInstance.map.removeLayer("rangeM");
      mapObj.mapInstance.map.getSource("rangeS") && mapObj.mapInstance.map.removeSource("rangeS");
      val.forEach(item => {
        item.device_id = item.equipmentId;
        item.geometry = item.geomTemp ? item.geomTemp : item.geom;
        if (['热点', '热点用户群', '热点标签'].includes(item.yhType)) {
          item.iconName = this.getIconName('done', item)
        }
      })
      mapObj.mapInstance.map.getLayer("yhPipePointsLayer") && mapObj.mapInstance.map.removeLayer("yhPipePointsLayer");
      mapObj.mapInstance.map.getSource("yhPipePoints") && mapObj.mapInstance.map.removeSource("yhPipePoints");
      mapObj.mapInstance.map.getLayer("yhPipeLinesLayer") && mapObj.mapInstance.map.removeLayer("yhPipeLinesLayer");
      mapObj.mapInstance.map.getSource("yhPipeLines") && mapObj.mapInstance.map.removeSource("yhPipeLines");
      let features = val.map(item => {
        if (item.geometry.type === 'Point')
          return {
            id: item.id,
            properties: item,
            geometry: item.geometry,
            type: "Feature"
          }
      })
      let features2 = val.map(item => {
        if (item.geometry.type === 'LineString')
          return {
            id: item.id,
            properties: item,
            geometry: item.geometry,
            type: "Feature"
          }
      })
      console.log('features :>> ', features);
      mapObj.mapInstance.map.addSource('yhPipePoints', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': features.filter((item) => {
            return item != undefined
          })
        }
      });
      mapObj.mapInstance.map.addLayer(
        {
          id: "yhPipePointsLayer",
          type: "symbol",
          source: "yhPipePoints",
          "layout": {
            // "icon-image": features[0].properties.yhType ? features[0].properties.yhType.indexOf('养护')>-1 ? "wsj3" : features[0].properties.yhType.indexOf('热点')>-1 ? "wcrd" : "rwwc" : "wsj3",
            "icon-image": [
              'case',
              ["==", ["has", "yhType"], false],
              "wsj3",
              [
                "any",
                ["==", ["get", "yhType"], "井养护"],
                ["==", ["get", "yhType"], "管网养护"],
              ],
              "wsj3",
              [
                "any",
                ["==", ["get", "yhType"], "热点"],
                ["==", ["get", "yhType"], "热点标签"],
                ["==", ["get", "yhType"], "热点用户群"],
              ],
              ["get", "iconName"],
              [
                "any",
                ["==", ["get", "yhType"], "用户群任务"],
                ["==", ["get", "yhType"], "标签任务"],
                ["==", ["get", "yhType"], "设备任务"],
                ["==", ["get", "yhType"], "井任务"],
                ["==", ["get", "yhType"], "管网任务"],
              ],
              // "rwwc",
              [
                "case",
                ["==", ["get", "approveStatus"], 2],
                "th",
                "rwwc"
              ],
              "wsj3"
            ],
            "icon-size": 0.55,
            'icon-allow-overlap': true
          },
        },
        "user"
      );
      mapObj.mapInstance.map.addSource('yhPipeLines', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': features2.filter((item) => {
            return item != undefined
          })
        }
      });
      mapObj.mapInstance.map.addLayer(
        {
          id: "yhPipeLinesLayer",
          type: "line",
          source: "yhPipeLines",
          paint: {
            "line-color": "#44BA5A",
            "line-width": 3.5
          }
        },
        "user"
      );
    },
    getIconName(type, obj) {
      switch (type) {
        case 'todo':
          switch (obj.name) {
            case '低保户':
              return 'dbh'
            case '长辈':
              return 'zb'
            case '违规用户':
              return 'wgyh'
            case '一年内销户':
              return 'ynnxh'
            case '一年内报停':
              return 'ynnbt'
            case '基建表排查':
              return 'jjb'
            case '三期零吨':
              return 'ld'
            case '大流量客户':
              return 'dll'
            case '多期零吨':
              return 'ld'
            case '污水单独计量用户':
              return 'wsddjlyh'
            default:
              return 'hotdata'
          }
        case 'selected':
          switch (obj.name) {
            case '低保户':
              return 'dbhxz'
            case '长辈':
              return 'zbxz'
            case '违规用户':
              return 'wgyhxz'
            case '一年内销户':
              return 'ynnxhxz'
            case '一年内报停':
              return 'ynnbtxz'
            case '基建表排查':
              return 'jjbxz'
            case '三期零吨':
              return 'ldxz'
            case '大流量客户':
              return 'dllxz'
            case '多期零吨':
              return 'ldxz'
            case '污水单独计量用户':
              return 'wsddjlyhxz'
            default:
              return 'xzrd'
          }
        case 'done':
          switch (obj.name) {
            case '低保户':
              return 'dbhwc'
            case '长辈':
              return 'zbwc'
            case '违规用户':
              return 'wgyhwc'
            case '一年内销户':
              return 'ynnxhwc'
            case '一年内报停':
              return 'ynnbtwc'
            case '基建表排查':
              return 'jjbwc'
            case '三期零吨':
              return 'ldwc'
            case '大流量客户':
              return 'dllwc'
            case '多期零吨':
              return 'ldwc'
            case '污水单独计量用户':
              return 'wsddjlyhwc'
            default:
              return 'wcrd'
          }
      }
    },
    setHotData(hotdata, index) {
      let that = this;
      // hotdata.forEach(item => {
      //   item.device_id = item.code;
      //   item.geometry = {
      //     type: 'Point',
      //     coordinates: [item.longi, item.lati]
      //   };
      // })
      mapObj.mapInstance.map.getLayer("hotDataLayer" + String(index)) && mapObj.mapInstance.map.removeLayer("hotDataLayer" + String(index));
      mapObj.mapInstance.map.getSource("hotDataSource" + String(index)) && mapObj.mapInstance.map.removeSource("hotDataSource" + String(index));
      hotdata.forEach((item) => {
        item.iconName = this.getIconName('todo', item)
      })
      let features = hotdata.map(item => {
        return {
          id: item.code,
          properties: item,
          geometry: item.geometry,
          type: "Feature"
        }
      })
      console.log('features :>> ', features);
      mapObj.mapInstance.map.addSource('hotDataSource' + String(index), {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': features
        }
      });
      mapObj.mapInstance.map.addLayer(
        {
          id: "hotDataLayer" + String(index),
          type: "symbol",
          source: "hotDataSource" + String(index),
          "layout": {
            "icon-image": ["get", "iconName"],
            "icon-size": 0.5,
            'icon-allow-overlap': true
          },
        }, 'unPointLayer0'
      );
      // console.log(mapObj.mapInstance.map.getStyle())
    },
    // 获取范围内设施
    getRangs(taskId, callback) {
      let that = this;
      mapObj.mapInstance.map.getLayer("unLineLayer") && mapObj.mapInstance.map.removeLayer("unLineLayer");
      mapObj.mapInstance.map.getLayer("unPointLayer") && mapObj.mapInstance.map.removeLayer("unPointLayer");
      mapObj.mapInstance.map.getLayer("unPointLayerBiaozhu") && mapObj.mapInstance.map.removeLayer("unPointLayerBiaozhu");
      mapObj.mapInstance.map.getSource("yhPipeVectorSource") && mapObj.mapInstance.map.removeSource("yhPipeVectorSource");
      let url = baseUrl.url_config + `/yhsw-maintain/maintainTask/resultmvt/{x}/{y}/{z}?taskId=${taskId}`
      mapObj.mapInstance.addSource(`yhPipeVectorSource`, {
        type: "vector",
        tiles: [url],
        promoteId: 'id'
      })
      mapObj.mapInstance.map.addLayer({
        id: "unLineLayer",
        type: "line",
        source: "yhPipeVectorSource",
        "source-layer": "line",
        paint: {
          "line-color": "#ff0000",
          "line-width": 3
        }
      }, 'user')
      mapObj.mapInstance.map.addLayer({
        id: "unPointLayer",
        type: "symbol",
        source: "yhPipeVectorSource",
        "source-layer": "point",
        "layout": {
          "icon-image": "wsj1",
          "icon-size": 0.5,
          'icon-allow-overlap': true

        }
      }, 'user')
      mapObj.mapInstance.map.addLayer({
        id: "unPointLayerBiaozhu",
        type: "symbol",
        source: "yuhang_ws_wsj",
        "source-layer": "ws_wsj",
        "minzoom": 18,
        "layout": {
          "text-field": ['concat', ["get", "floorelevation"], '/', ["get", "depth"]],
          "text-offset": [1, 1]
        }
      }, 'user')
      console.log(mapObj.mapInstance.map.getSource("yhPipeVectorSource"))
      if (callback) {
        mapObj.mapInstance.map.off('click', this.callback)
        this.callback = callback;
        mapObj.mapInstance.map.on('click', callback)
      }
    },
    getGridRangs(taskId, callback, ifMulti) {
      let that = this;
      that.multiTaskSAL.forEach((item) => {
        mapObj.mapInstance.map.getLayer("unLineLayer" + item) && mapObj.mapInstance.map.removeLayer("unLineLayer" + item);
        mapObj.mapInstance.map.getLayer("unPointLayer" + item) && mapObj.mapInstance.map.removeLayer("unPointLayer" + item);
        mapObj.mapInstance.map.getSource("yhPipeVectorSource" + item) && mapObj.mapInstance.map.removeSource("yhPipeVectorSource" + item);
      })
      that.multiTaskSAL = []
      mapObj.mapInstance.map.getLayer("unLineLayer") && mapObj.mapInstance.map.removeLayer("unLineLayer");
      mapObj.mapInstance.map.getLayer("unPointLayer") && mapObj.mapInstance.map.removeLayer("unPointLayer");
      mapObj.mapInstance.map.getLayer("unPointLayerBiaozhu") && mapObj.mapInstance.map.removeLayer("unPointLayerBiaozhu");
      mapObj.mapInstance.map.getSource("yhPipeVectorSource") && mapObj.mapInstance.map.removeSource("yhPipeVectorSource");
      console.log(taskId)
      if (!ifMulti) {
        let url = baseUrl.url_config + `/yhsw-grid/maintainTask/resultmvt/{x}/{y}/{z}?taskId=${taskId}`
        mapObj.mapInstance.addSource(`yhPipeVectorSource`, {
          type: "vector",
          tiles: [url],
          promoteId: 'id'
        })
        mapObj.mapInstance.map.addLayer({
          id: "unLineLayer0",
          type: "line",
          source: "yhPipeVectorSource",
          "source-layer": "line",
          paint: {
            "line-color": "#ff0000",
            "line-width": 3
          }
        }, 'user')
        mapObj.mapInstance.map.addLayer({
          id: "unPointLayer0",
          type: "symbol",
          source: "yhPipeVectorSource",
          "source-layer": "point",
          "layout": {
            "icon-image": "rw1",
            "icon-size": 0.5,
            'icon-allow-overlap': true

          }
        }, 'user')
        that.multiTaskSAL.push('0')
      } else {
        // let urlArray = taskId.map((item)=>{
        //   return baseUrl.url_config + `/yhsw-grid/maintainTask/resultmvt/{x}/{y}/{z}?taskId=${item}`
        // })
        // mapObj.mapInstance.addSource(`yhPipeVectorSource`, {
        //   type: "vector",
        //   tiles: urlArray,
        //   promoteId: 'id'
        // })
        taskId.forEach((task, index) => {
          let url = baseUrl.url_config + `/yhsw-grid/maintainTask/resultmvt/{x}/{y}/{z}?taskId=${task}`
          mapObj.mapInstance.addSource(`yhPipeVectorSource` + String(index), {
            type: "vector",
            tiles: [url],
            promoteId: 'id'
          })
          mapObj.mapInstance.map.addLayer({
            id: "unLineLayer" + String(index),
            type: "line",
            source: "yhPipeVectorSource" + String(index),
            "source-layer": "line",
            paint: {
              "line-color": "#ff0000",
              "line-width": 3
            }
          }, 'user')
          mapObj.mapInstance.map.addLayer({
            id: "unPointLayer" + String(index),
            type: "symbol",
            source: "yhPipeVectorSource" + String(index),
            "source-layer": "point",
            "layout": {
              "icon-image": "rw" + String(index % 8),
              "icon-size": 0.5,
              'icon-allow-overlap': true

            }
          }, 'user')
          that.multiTaskSAL.push(String(index))
        })
      }
      // mapObj.mapInstance.addLayer({
      //   id: "unLineLayer",
      //   type: "line",
      //   source: "yhPipeVectorSource",
      //   "source-layer": "line",
      //   paint: {
      //     "line-color": "#ff0000",
      //     "line-width": 3
      //   }
      // }, 'cure')
      // mapObj.mapInstance.addLayer({
      //   id: "unPointLayer",
      //   type: "symbol",
      //   source: "yhPipeVectorSource",
      //   "source-layer": "point",
      //   "layout": {
      //     "icon-image": "wsj1",
      //     "icon-size": 0.5,
      //     'icon-allow-overlap': true

      //   }
      // }, 'cure')
      mapObj.mapInstance.map.addLayer({
        id: "unPointLayerBiaozhu",
        type: "symbol",
        source: "yuhang_ws_wsj",
        "source-layer": "ws_wsj",
        "minzoom": 18,
        "layout": {
          "text-field": ['concat', ["get", "floorelevation"], '/', ["get", "depth"]],
          "text-offset": [1, 1]
        }
      }, 'user')
      if (callback) {
        mapObj.mapInstance.map.off('click', this.callback)
        this.callback = callback;
        mapObj.mapInstance.map.on('click', callback)
      }
    },
    setRangFilter(done, status) {
      let that = this
      mapObj.mapInstance.map.getLayer("yhPipeLinesLayer") && mapObj.mapInstance.map.setLayoutProperty('yhPipeLinesLayer', 'visibility', status ? 'none' : 'visible')
      mapObj.mapInstance.map.getLayer("yhPipePointsLayer") && mapObj.mapInstance.map.setLayoutProperty('yhPipePointsLayer', 'visibility', status ? 'none' : 'visible')
      mapObj.mapInstance.map.setFilter('unLineLayer', status ? ['==', ['index-of', ["get", "device_id"], ['literal', done]], -1] : null)
      mapObj.mapInstance.map.setFilter('unPointLayer', status ? ['==', ['index-of', ["get", "device_id"], ['literal', done]], -1] : null)
    },
    rangClick(feature) {
      let that = this;
      console.log(feature)
      mapObj.mapInstance.map.getLayer("rangeL") && mapObj.mapInstance.map.removeLayer("rangeL");
      mapObj.mapInstance.map.getLayer("rangeM") && mapObj.mapInstance.map.removeLayer("rangeM");
      mapObj.mapInstance.map.getSource("rangeS") && mapObj.mapInstance.map.removeSource("rangeS");
      var features = feature[0];
      mapObj.mapInstance.map.addSource('rangeS', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [features]
        }
      });
      if (features.geometry.type === 'LineString') {
        mapObj.mapInstance.addLayer(
          {
            id: "rangeL",
            type: "line",
            source: "rangeS",
            paint: {
              "line-color": "#FFFF00",
              "line-width": 7,
            },
          },
          "initInspLineLayer"
        );
      } else {
        mapObj.mapInstance.addLayer(
          {
            id: "rangeM",
            type: "symbol",
            source: "rangeS",
            "layout": {
              "icon-image": features.properties.yhType ? features.properties.yhType.indexOf('养护') > -1 ? "wsj2" : features.properties.yhType.indexOf('热点') > -1 ? this.getIconName('selected', features.properties) : features.properties.approveStatus == 2 ? "thxz" : "rwxz" : "wsj2",
              "icon-size": features.properties.yhType ? features.properties.yhType.indexOf('养护') > -1 ? 0.7 : 0.5 : 0.7
            },
          },
          "yhPipePointsLayer"
        );
      }
      let coordinates = features.geometry.type === 'Point' ? features.geometry.coordinates : features.geometry.coordinates[0];
      that.flyTo({ position: coordinates, zoom: 17 })
    },
    listLicik(val) {
      let newData = val.new.item;
      let features = [{
        type: 'feature',
        geometry: JSON.parse(newData.geom),
        properties: newData,
      }]
      this.rangClick(features)
    },

    /**
     * 提供坐标数组，返回中心点,限线和面
     * @param {*} position 坐标数组
     */
    getCenter(position) {
      let coord = [];
      let center;
      if (position instanceof Array && position.length !== 0) {
        let pos1 = position[0];
        if (pos1 instanceof Array) {
          let pos2 = pos1[0];
          if (pos2 instanceof Array) {
            center = turf.center(turf.polygon(position));
          } else {
            center = turf.center(turf.lineString(position));
          }
        }
      }
      if (center) {
        coord = center.geometry.coordinates;
      }
      return coord;
    },

    paintingRange({
      position = [],
      color = "#ff4a4a",
      lineWidth = 3,
      circleRadius = 3,
      boldBorder,
      borderWidth = 5,
      isRepaint = true,
      lineDasharray
    }) {
      let features = [];
      if (position instanceof Array && position[0] instanceof Array) {
        let pos1 = position[0];
        if (pos1[0] instanceof Array) {
          position.forEach(line => {
            let feature;
            if (this.getArrayGeo(line) == 2) {
              feature = turf.lineString(line);
              features.push(feature);
            } else if (this.getArrayGeo(line) == 3) {
              feature = turf.multiLineString(line);
              features.push(feature);
            } else if (this.getArrayGeo(line) == 4) {
              feature = turf.polygonToLine(turf.multiPolygon(line));
              feature.features.forEach(f => {
                features.push(f)
              })
            }
          })
          if (boldBorder instanceof Array) {
            features = features.concat(turf.lineString(boldBorder, { name: "boldBorder" }));
            this.addRangeLayer2({ features, color, lineWidth, lineDasharray, borderWidth, isRepaint })
          } else {
            this.addRangeLayer2({ features, color, lineWidth, lineDasharray, isRepaint })
          }
        } else {
          let feature = turf.lineString(position);
          features.push(feature);
          this.addRangeLayer2({ features, color, lineWidth, lineDasharray, isRepaint })
        }
      } else if (position instanceof Array && position.length !== 0) {
        let feature = turf.point(position);
        features.push(feature);
        this.addRangeLayer2({ features, color, circleRadius, isRepaint })
      } else {
        this.addRangeLayer2({ features, color, isRepaint });
      }
    },
    getArrayGeo(arr = []) {
      let num = 0;
      function bl(arr) {
        if (arr instanceof Array) {
          num++;
          bl(arr[0]);
        }
      }
      bl(arr);
      return num;
    },
    addRangeLayer2({ features, color, lineWidth, lineDasharray, circleRadius, borderWidth, isRepaint }) {
      // let that = this;
      console.log('features :>> ', features);
      let layerId = "rangeLayer2";
      // function makeId(id = "rangeLayer2"){
      //     if(that.map.getSource(id)){
      //         makeId(id++)
      //     }else{
      //         layerId = id;
      //     }
      // }
      // makeId();
      if (isRepaint) {
        this.removeRangeLayer();
      }
      mapObj.mapInstance.addSource(layerId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        }
      });
      if (circleRadius) {
        mapObj.mapInstance.addLayer({
          id: layerId,
          source: layerId,
          type: "circle",
          paint: {
            "circle-radius": circleRadius,
            "circle-color": color
          }
        })
      } else if (lineWidth) {
        mapObj.mapInstance.addLayer({
          id: layerId,
          source: layerId,
          type: "line",
          paint: {
            "line-color": color,
            "line-width": [
              'case',
              ['==', ['get', 'name'], 'boldBorder'],
              borderWidth || 0,
              lineWidth
            ],
            "line-dasharray": lineDasharray || []
          }
        })
      }
    },
    removeRangeLayer() {
      if (mapObj.mapInstance.map.getLayer("rangeLayer2")) mapObj.mapInstance.map.removeLayer("rangeLayer2");
      if (mapObj.mapInstance.map.getSource("rangeLayer2")) mapObj.mapInstance.map.removeSource("rangeLayer2");
    },

    /**
     * 点，多点，线，多线，面，多面定位
     * @param {*} position 定位坐标
     * @param {*} reset 若不传坐标，是否定位到初始位置
     */
    makeLocation(position, reset = true) {
      let type = '';
      if (position instanceof Array && position.length !== 0) {
        if (position[0] instanceof Array) {
          let pos1 = position[0];
          if (pos1[0] instanceof Array) {
            let pos2 = pos1[0]
            if (pos2[0] instanceof Array) {
              var multipolygon = turf.multiPolygon(position);
              var bbox = turf.bbox(multipolygon);
              var bboxPolygon = turf.bboxPolygon(bbox);
              type = 'multipolygon';
            } else {
              var polygon = turf.polygon(position);
              var bbox = turf.bbox(polygon);
              var bboxPolygon = turf.bboxPolygon(bbox);
              type = 'polygon';
            }
          } else {
            var line = turf.lineString(position);
            var bbox = turf.bbox(line);
            var bboxPolygon = turf.bboxPolygon(bbox);
            type = 'line';
          }
          var v2 = new mapboxgl.LngLatBounds(bboxPolygon.geometry.coordinates[0][0], bboxPolygon.geometry.coordinates[0][2])
          mapObj.mapInstance.map.fitBounds(v2, {
            linear: false,
            padding: { top: 60, bottom: 60, left: 60, right: 60 }
          });
        } else {
          this.flyTo({ position: position, zoom: 14 });
          type = 'point';
        }
      } else if (reset) {
        mapObj.mapInstance.map.fitBounds([[120.38188484498045, 30.56868547578088], [119.51549097554295, 30.178356987720612]], {
          linear: false
        });
        type = 'errPosition'
      }
      return type;
    },

    // 切换供水，雨水，污水瓦片
    async changePipeTileLayer(inspBusinessType) {
      mapObj.mapInstance.addSource('lightLayer', {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
      mapObj.mapInstance.addLayer({
        id: "lightPoint",
        type: "symbol",
        source: "lightLayer",
        filter: ["==", "$type", "Point"],
        layout: {
          'icon-size': 1.4,
          'icon-image': [...this.GSL.slice(0, this.GSL.length - 1), ...this.WSL.slice(1, this.WSL.length - 1), ...this.YSL.slice(1)],
          'icon-ignore-placement': true,
          'icon-allow-overlap': true
        }
      }, "lightLayer")
      mapObj.mapInstance.addLayer({
        id: "lightLine",
        type: "line",
        source: "lightLayer",
        filter: ["==", "$type", "LineString"],
        paint: {
          'line-width': 3,
          'line-color': "red",
        }
      }, "lightLayer");
      this.addBufferLayer();
      this.addRangeLayer();
      this.addInspUserLayer();
      this.addKeyPointLayer();
      this.isOnLoad = true;
    },
    // 通过业务类型改变图层显示
    changePipeTileLayerByBusiness(type) {
      switch (type) {
        case "WATER_SUPPLY":
          this.gsLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.gsLayers[index], 'visibility', 'visible');
          })
          this.ysLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.ysLayers[index], 'visibility', 'none');
          })
          this.wsLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.wsLayers[index], 'visibility', 'none');
          })
          break;
        case "RAI_WATER":
          this.ysLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.ysLayers[index], 'visibility', 'visible');
          })
          this.gsLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.gsLayers[index], 'visibility', 'none');
          })
          this.wsLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.wsLayers[index], 'visibility', 'none');
          })
          break;
        case "POLLUTED_WATER":
          this.wsLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.wsLayers[index], 'visibility', 'visible');
          })
          this.ysLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.ysLayers[index], 'visibility', 'none');
          })
          this.gsLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.gsLayers[index], 'visibility', 'none');
          })
          break;
        default:
          this.wsLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.wsLayers[index], 'visibility', 'none');
          })
          this.ysLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.ysLayers[index], 'visibility', 'none');
          })
          this.gsLayers.forEach((item, index) => {
            mapObj.mapInstance.map.setLayoutProperty(this.gsLayers[index], 'visibility', 'none');
          })
          break;
      }
      try {
        const that = this;
        var timer = setInterval(function () {
          if (that.isOnLoaded()) {
            clearInterval(timer);
            mapObj.mapInstance.changeBZLayer(type);
          }
        }, 100)
      } catch (e) {
        console.log(e);
      }
    },
    // 通过业务类型改变图层显示 三网合一
    changeLayerByBusiness({ gs = 'none', ys = 'none', ws = 'none' }) {
      if (!mapObj.mapInstance) return
      let gsLayerType = LayerType['供水'][0].concat(LayerType['供水'][1])
      let wsLayerType = LayerType['污水'][0].concat(LayerType['污水'][1])
      let ysLayerType = LayerType['雨水'][0].concat(LayerType['雨水'][1])
      gsLayerType.forEach((item, index) => {
        mapObj.mapInstance.map.setLayoutProperty(item.id, 'visibility', gs);
      })
      ysLayerType.forEach((item, index) => {
        mapObj.mapInstance.map.setLayoutProperty(item.id, 'visibility', ys);
      })
      wsLayerType.forEach((item, index) => {
        mapObj.mapInstance.map.setLayoutProperty(item.id, 'visibility', ws);
      })
      this.isOnLoad = true;
    },
    // 添加巡检人员
    addInspUserLayer() {
      mapObj.mapInstance.addSource("inspUser", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        },
        generateId: true
      });
      mapObj.mapInstance.addLayer({
        id: "inspUserLayer",
        type: "symbol",
        source: "inspUser",
        layout: {
          "icon-image": "userInsp",
          "icon-size": 0.2,
          "icon-allow-overlap": true,//自动避让属性
          "icon-ignore-placement": true,
        }
      }, "unInspLineLayer");
    },
    getDirection() {
      window.addEventListener('deviceorientationabsolute', this.setRotate)
      this.hasListen = true
    },

    // 设置巡检人员位置
    setInspUserPosition(position) {
      // xCode，yCode为经纬度
      const coord = [parseFloat(position.longitude), parseFloat(position.latitude)];
      const point = turf.point(coord);
      try {
        const that = this;
        // 定时器
        var timer = setInterval(function () {
          // 如果地图实例创建、巡检人员图层存在且加载完毕
          if (that.isOnLoaded()
            && mapObj.map.getSource("inspUser")
            && mapObj.map.isSourceLoaded("inspUser")
          ) {
            // 清除定时器
            clearInterval(timer);
            // 巡检人员图标
            mapObj.mapInstance.setSourceData("inspUser", {
              type: "FeatureCollection",
              features: [point]
            })
            !that.hasListen && that.getDirection()
            // 如果开始巡检，地图以人员为中心
            let changeLine = localStorage.getItem("startRecordLines");
            // 如果上报事件，取消地图设置中心操作
            // let isReportEvent = localStorage.getItem("isReportEvent");
            if (changeLine == 'start') {
              mapObj.map.setCenter(coord);
            }
          }
        }, 100)
      } catch (e) {
        console.log(e);
      }
    },
    setRotate(e) {
      let bearing = (e.alpha - 180) >= 0 ? (180 - e.alpha) : (180 - e.alpha)
      // 调整罗盘方向
      mapObj.map && mapObj.map.setLayoutProperty("inspUserLayer", "icon-rotate", bearing);
    },
    // 设置巡检管线为已巡检
    changeInspLineState(geometry) {
      let that = this
      // 将地理坐标系转化为屏幕坐标系
      function geoTransToPixel(geom) {
        const polygonBox = turf.bbox(geom);
        const southWest = [polygonBox[0], polygonBox[1]];
        const northEast = [polygonBox[2], polygonBox[3]];
        let southWestPointPixel = mapObj.map.project(southWest);
        let northEastPointPixel = mapObj.map.project(northEast);
        // 增大bbox的查询范围
        southWestPointPixel = [
          southWestPointPixel.x - 50,
          southWestPointPixel.y + 50
        ]
        northEastPointPixel = [
          northEastPointPixel.x + 50,
          northEastPointPixel.y - 50
        ]
        return [southWestPointPixel, northEastPointPixel];
      }
      // 对每个划分出来的bbox进行处理
      function chunk(geom) {
        // let wasLoaded = false;
        // if (wasLoaded) return;
        const boxFeatures = mapObj.map.queryRenderedFeatures(geoTransToPixel(geom), {
          layers: ["initInspLineLayer"]
        });
        console.log(boxFeatures, 'boxFeatures')
        let tempPipeList = []
        boxFeatures.forEach(feat => {
          try {
            // const result = turf.intersect(feat.geometry, geometry);
            const result = turf.booleanDisjoint(feat.geometry, geometry)
            // 如果查出的要素与真实的范围相交且没有被巡检过，则改变其状态,并记录其关键字
            if (!result && !feat.state.isInsp) {
              mapObj.map.setFeatureState({
                source: feat.source,
                id: feat.id
              }, { isInsp: true })
              let date = that.$dayjs().format('YYYY-MM-DD HH:mm:ss')
              tempPipeList.push({
                inspDate: date,
                pipeId: feat.id,
                ext3: feat.properties.bizType,
                pipeLength: feat.properties['length'] || 0,
                taskId: that.$route.query.taskId
              })
              // for (let it of tempPipeList) {
              //   if (it.pipeId != feat.id) {
              //     tempPipeList.push({
              //       inspDate: date,
              //       pipeId: feat.id,
              //       pipeLength: feat.properties['length'] || 0,
              //       taskId: that.$route.query.taskId
              //     })
              //   }
              // }
            }
          } catch (error) {
            console.log(error)
          }
        })
        tempPipeList.length > 0 && recordInspLine(tempPipeList).then(res => {
          if (res.status) {
            console.log('管线上传成功')
            bus.$emit('updateData')
          } else {
            console.log('上传失败的tempPipeList: ', tempPipeList);
            this.uploadFiledPipeIdList.push(...tempPipeList)
          }
        })
        // wasLoaded = true;
        // mapObj.mapInstance.map.on('sourcedata', function () {
        // })
      }
      function cb(features) {
        if (features.length > 0 && that.isOnLoaded()) {
          setTimeout(() => {
            chunk(features.shift());
            cb(features);
          }, 100);
        }
      }
      cb([geometry]);
    },
    findHadInspFeature() {
      const that = this;
      return new Promise(function (resolve, reject) {
        try {
          if (recordFeatures.length <= 0) {
            resolve([]);
          }
          let data = [...new Set(recordFeatures)];
          let filterData = ["in", "guid"];
          data.forEach((item, index) => {
            filterData.push(data[index]);
          })
          var timer = setInterval(function () {
            if (that.isOnLoaded() && mapObj.mapInstance.map.getSource("rangePipeVector")) {
              clearInterval(timer);
              mapObj.mapInstance.map.once("data", function () {
                const boxFeatures = mapObj.mapInstance.map.querySourceFeatures("rangePipeVector", {
                  sourceLayer: "line",
                  filter: filterData
                })
                boxFeatures.forEach(feat => {
                  mapObj.mapInstance.map.setFeatureState({
                    source: "rangePipeVector",
                    sourceLayer: "line",
                    id: feat.id
                  }, {
                    insp: true
                  })
                })
                resolve(boxFeatures);
              })
            }
          }, 500)
        } catch (error) {
          console.log(error);
        }
      })
    },
    // 根据速度改变巡检管线颜色
    async changeInspLineSourceBySpeed(position) {
      const coord = [parseFloat(position.longitude), parseFloat(position.latitude)];
      // const coord = [115.9466387418314, 39.06638916509243] // 测试
      const point = turf.point(coord);
      try {
        const that = this;
        var timer = setInterval(function () {
          if (that.isOnLoaded() && mapObj.mapInstance.map.getSource("inspUser") && mapObj.mapInstance.map.isSourceLoaded("inspUser")) {
            clearInterval(timer);
            let changeLine = localStorage.getItem("startRecordLines");
            // if (changeLine == 'start') {
              if (true) {
              // 改变周围要素的状态
              let buffered = turf.buffer(point, that.$route.query.taskType == '人巡' ? 0.020 : 0.050, { unit: 'kilometers' });
              that.changeInspLineState(buffered);
            }
          }
        }, 100)
      } catch (e) {
        console.log(e);
      }
    },
    // 新增上报事件marker
    addReportEventMarker(position, callback) {
      const that = this;
      const src = require(`@/assets/img/legend/eventPoint.png`);
      // 如果存在id为eventPointMarker的元素，则删除此元素重新创建，保持全局只有一个此元素
      let currentEle = document.getElementById("eventPointMarker");
      if (currentEle) {
        currentEle.parentNode.removeChild(currentEle);
      }
      let ele = document.createElement("div");
      ele.innerHTML = `
          <img id="eventPointMarker" src="${src}" width="40" height="40">
        `

      let marker = mapObj.mapInstance.newMarker({
        element: ele,
        offset: [0, 0],
        // draggable: true
      });

      marker
        .setLngLat(position)
        .addTo(mapObj.mapInstance.map);

      // function onDragEnd() {
      //   let lngLat = marker.getLngLat();
      //   console.log("onDragEnd==>", lngLat);
      //   const pos = [lngLat.lng, lngLat.lat];
      //   bus.$emit("eventMarkerPosition", pos);
      // }
      // marker.on('dragend', onDragEnd);
      // 更换选位置的交互逻辑
      function onTouchEnd() {
        let lngLat = mapObj.mapInstance.map.getCenter();
        const pos = [lngLat.lng, lngLat.lat];
        bus.$emit("eventMarkerPosition", pos);
      }
      mapObj.mapInstance.map.on('touchend', onTouchEnd);
      function onTouchMove() {
        let lngLat = mapObj.mapInstance.map.getCenter();
        const pos = [lngLat.lng, lngLat.lat];
        marker.setLngLat(pos);
      }
      mapObj.mapInstance.map.on('touchmove', onTouchMove);
      function onMoveEnd() {
        let lngLat = mapObj.mapInstance.map.getCenter();
        const pos = [lngLat.lng, lngLat.lat];
        marker.setLngLat(pos);
      }
      mapObj.mapInstance.map.on('moveend', onMoveEnd);
      if (callback) {
        mapObj.mapInstance.map.off('click', this.callback)
        this.callback = callback;
        mapObj.mapInstance.map.on('click', callback)
      }
    },

    addAllViewsLayers(type = '供水') {
      const layer = layers[type];
      mapObj.mapInstance.map.on('click', this.layerClick1);
      (layer || []).forEach(item => {
        if (!mapObj.map.getLayer(item.layer.id)) {
          mapObj.map.addLayer(item.layer);
          if (item.markId && !mapObj.map.getLayer(item.markId.id))
            mapObj.map.addLayer(item.markId);
        }
      })
    },
    removeAllViewsLayers(type = '供水') {
      const layer = layers[type];
      mapObj.mapInstance.map.off('click', this.layerClick1);
      (layer || []).forEach(item => {
        if (mapObj.map.getLayer(item.layer.id)) {
          mapObj.map.removeLayer(item.layer.id);
          if (item.markId && mapObj.map.getLayer(item.markId.id))
            thismap.removeLayer(item.markId.id);
        }
      })
    },
    setAllViewsLayersVisible(type = '供水', visible = 'visible') {
      const layer = layers[type];
      (layer || []).forEach(item => {
        if (mapObj.map.getLayer(item.layer.id)) {
          mapObj.map.setLayoutProperty(item.layer.id, 'visibility', visible);
          if (item.markId && mapObj.map.getLayer(item.markId.id))
            mapObj.map.setLayoutProperty(item.markId.id, 'visibility', visible);
        }
      })
    }
  },
}