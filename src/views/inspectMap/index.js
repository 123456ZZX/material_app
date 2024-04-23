import superDataDeal from './utils/superDataDeal.js';
// import mapboxgl from '@cgcs2000/mapbox-gl';
import mapboxgl from 'mapbox-gl';
import baseUrl from "@common/config.js";
import { mapUrlHeader } from "./settings.js";
import { RDBaseLayerConfig, RDPipeLayer } from './utils/RDLayersConfig.js'
import * as turf from '@turf/turf'
const configHeader = process.env.NODE_ENV === 'development' ?  window.location.host +"/lsy" : "zhps.hzyhwater.com:8001/lsy"
const sourceYh={
    "yuhang_gs_800mm": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_800mmysgd/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_500-800mm": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_500_800mmgd/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_300-500mm": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_300_500mmgd/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_75-300mm": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_75_300mmgd/{x}/{y}/{z}" 
        ]
    },
    "yuhang_gs_75mm": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_75mmyxgd/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_ysgx": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_ysgx/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_fqgd": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_fqgd/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_fqgx": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_fqgx/{x}/{y}/{z}"
        ]
    },
    // "yuhang_gs_gsqtgjgd": {
    //     "type": "vector",
    //     "tiles": [
    //         "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_gsqtgjgd/{x}/{y}/{z}"
    //     ]
    // },
    // "yuhang_gs_gsgd": {
    //     "type": "vector",
    //     "tiles": [
    //         "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_gsgd/{x}/{y}/{z}"
    //     ]
    // },
    "yuhang_gs_gsbz": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_jyd/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_gsc": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_gsc/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_lly": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_lly/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_pqf": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_pqf/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_sbx": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_sbx/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_fm": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_fm/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_ljd": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_ljd/{x}/{y}/{z}"
        ]
    },
    // "yuhang_gs_4t": {
    //     "type": "vector",
    //     "tiles": [
    //         "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_4t/{x}/{y}/{z}"
    //     ]
    // },
    // "yuhang_gs_3t": {
    //     "type": "vector",
    //     "tiles": [
    //         "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_3t/{x}/{y}/{z}"
    //     ]
    // },
    "yuhang_gs_ylk": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_ylk/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_pwf": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_pwf/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_xfs": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_xfs/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_pwk": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_pwk/{x}/{y}/{z}"
        ]
    },
    "yuhang_gs_gsjcd": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/gs/gs_monitor/{x}/{y}/{z}"
        ]
    },
  
    "yuhang_ws_wsjcd": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsjcd/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_xqgxws": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_xqgxws/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wspfk": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wspfk/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsbz": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsbz_with_iot/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsgd": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsgd/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsk": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsk/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsj": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsj/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsg": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsg/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsgzl": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsgzl/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsgyl": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsgyl/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsc": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsc/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wszm": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wszm/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsfm": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsfm/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_pjg": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ps_pjg/{x}/{y}/{z}"
        ]
    },
    "yuhang_ws_wsgwyj": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ws/ws_wsgwyj/{x}/{y}/{z}"
        ]
    },
  
    "yuhang_ys_yspfk": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ys/ys_yspfk/{x}/{y}/{z}"
        ]
    },
    "yuhang_ys_ysbz": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ys/ys_ysbz/{x}/{y}/{z}"
        ]
    },
    "yuhang_ys_ysgd": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ys/ys_ysgd/{x}/{y}/{z}"
        ]
    },
    "yuhang_ys_ysg": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ys/ys_ysg/{x}/{y}/{z}"
        ]
    },
    "yuhang_ys_xqgxys": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ys/ys_xqgxys/{x}/{y}/{z}"
        ]
    },
    "yuhang_ys_ysj": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ys/ys_ysj/{x}/{y}/{z}"
        ]
    },
    "yuhang_ys_ysk": {
        "type": "vector",
        "tiles": [
            "http://"+ configHeader + "/mapServer/mapServer/getMvtTile/ys/ys_ysk/{x}/{y}/{z}"
        ]
    }
};
const layer_yuhang_ws = [
    {
        "id": "yuhangws_ws_wsg_symbol",
        "type": "symbol",
        "maxzoom":24,
        "minzoom":10,
        "filter":['all',['has','caliber'],['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']]],
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
        "paint": { "text-color": "rgba(145, 80, 9, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
    },
    {
        "id": "yuhangws_ws_wsg",
        "type": "line",
        "source": "yuhang_ws_wsg",
        "source-layer": "ws_wsg",
        "maxzoom":24,
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
        "maxzoom":24,
        "minzoom":11,
        "source": "yuhang_ws_pjg",
        "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
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
        "paint": { "text-color": "#F262FF", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
    },
    {
        "id": "yuhangws_ws_pjg",
        "type": "line",
        "source": "yuhang_ws_pjg",
        "source-layer": "ps_pjg",
        "maxzoom":24,
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
        "maxzoom":24,
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
        "maxzoom":24,
        "minzoom":11,
        "source": "yuhang_ws_wsgwyj",
        "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
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
        "paint": { "text-color": "#de5a03", "icon-color": "#de5a03",'text-halo-color':"#ffffff",'text-halo-width':1 }
    }
];
const layer_yuhang_gs = [
    {
        "id": "yuhanggs_gs_75mmyxgd",
        "type": "line",
        "source": "yuhang_gs_75mm",
        "source-layer": "gs_75mmyxgd",
        "maxzoom":24,
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
        "maxzoom":24,
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
        "maxzoom":24,
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
        "maxzoom":24,
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
        "maxzoom":24,
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
        "maxzoom":24,
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
        "maxzoom":24,
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
        "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
    },
    {
        "id": "yuhanggs_gs_75_300mmgd_symbol",
        "type": "symbol",
        "source": "yuhang_gs_75-300mm",
        "source-layer": "gs_75_300mmgd",
        "maxzoom":24,
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
        "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
    },
    {
        "id": "yuhanggs_gs_300_500mmgd_symbol",
        "type": "symbol",
        "source": "yuhang_gs_300-500mm",
        "source-layer": "gs_300_500mmgd",
        "maxzoom":24,
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
        "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
    },
    {
        "id": "yuhanggs_gs_500_800mmgd_symbol",
        "type": "symbol",
        "source": "yuhang_gs_500-800mm",
        "source-layer": "gs_500_800mmgd",
        "maxzoom":24,
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
        "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
    },
    {
        "id": "yuhanggs_gs_800mmysgd_symbol",
        "type": "symbol",
        "source": "yuhang_gs_800mm",
        "source-layer": "gs_800mmysgd",
        "maxzoom":24,
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
        "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
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
        "maxzoom":24,
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
        "paint": { "text-color": "rgba(57, 154, 234, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
    },
];
const layer_yuhang_ys = [
    {
        "id": "yuhangys_ys_ysg",
        "type": "line",
        "source": "yuhang_ys_ysg",
        "source-layer": "ys_ysg",
        "maxzoom":24,
        "minzoom": 10,
        "layout": { "visibility": "visible" },
        "paint": {
            "line-color": "rgba(39, 54, 155, 1)",
            "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
        }
    },{
        "id": "yuhangys_ys_ysg_symbol",
        "type": "symbol",
        "source": "yuhang_ys_ysg",
        "source-layer": "ys_ysg",
        "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
        "maxzoom":24,
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
        "paint": { "text-color": "rgba(39, 54, 155, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
    }
];
const layer_yuhang_ys_icon = [
    {   
        //雨水口
        "id": "yuhangws_ys_ysk",
        "type": "symbol",
        "source": "yuhang_ys_ysk",
        "maxzoom":24,
        "minzoom": 15,
        "source-layer": "ys_ysk",
        "layout":{
            "icon-image":"yushui-yushuikou",
            "icon-size":1
        }
    },{   
        //雨水井
        "id": "yuhangys_ys_ysjcj",
        "type": "symbol",
        "minzoom": 15,
        "maxzoom":24,
        "source": "yuhang_ys_ysj",
        "source-layer": "ys_ysj",
        "layout":{
            "icon-image":"yushui-yushuijing",
            "icon-size":1
        },
        // 'paint':{
        //     'circle-color':"red",
        //     'circle-radius':3
        // }
    },{   
        //节点
        "id": "yuhangys_ys_ysjd",
        "maxzoom":24,
        "minzoom": 15,
        "type": "symbol",
        "source": "yuhang_ys_ysgd",
        "source-layer": "ys_ysgd",
        "layout":{
            "icon-image":"yushui",
            "icon-size":1
        }
    },{   
        //雨水排放口
        "id": "yuhangys_ys_yspfk",
        "type": "symbol",
        "maxzoom":24,
        "minzoom": 15,
        "source": "yuhang_ys_yspfk",
        "source-layer": "ys_yspfk",
        "layout":{
            "icon-image":"yushui-paifangkou",
            "icon-size":1
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
        "maxzoom":24,
        "minzoom": 11,
        "source-layer": "ys_ysbz",
        'filter':[
            'any',
            ['all',['==',['get','display_level'],1],['>=',['zoom'],11]],
            ['all',['==',['get','display_level'],2],['>=',['zoom'],12]],
            ['all',['==',['get','display_level'],3],['>=',['zoom'],13]]
        ],
        "layout":{
            "icon-image":"yushui-bengzhan",
            "icon-size":1,
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
        "maxzoom":24,
        "minzoom": 11,
        "layout": {
            "visibility": "visible",
            "icon-image":"wushui-shuichang",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "icon-size":1,
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
        "maxzoom":24,
        "minzoom": 14,
        "layout": {
            "icon-rotate": 360,
            "icon-image":"wushui-zhamen",
        }
    },
    {   
        //污水口
        "id": "yuhangws_ws_wsk",
        "type": "symbol",
        "source": "yuhang_ws_wsk",
        "source-layer": "ws_wsk",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"wushui-wushuikou",
            "icon-size":1
        }
    },
    {
        //管点
        "id": "yuhangws_ws_wsgd",
        "type": "symbol",
        "source": "yuhang_ws_wsgd",
        "source-layer": "ws_wsgd",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"污水",
            "icon-size":1
        }
    },
    {
        //排放口
        "id": "yuhangws_ws_wspfk",
        "type": "symbol",
        "source": "yuhang_ws_wspfk",
        "source-layer": "ws_wspfk",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"wushui-paifangkou",
            "icon-size":1
        }
    },
    {
        //泵站
        "id": "yuhangws_ws_wsbz",
        "type": "symbol",
        "source": "yuhang_ws_wsbz",
        "source-layer": "ws_wsbz_with_iot",
        "maxzoom":24,
        "minzoom": 15,
        'filter':[
            'any',
            ['all',['==',['get','display_level'],1],['>=',['zoom'],11]],
            ['all',['==',['get','display_level'],2],['>=',['zoom'],12]],
            ['all',['==',['get','display_level'],3],['>=',['zoom'],13]]
        ],
        "layout":{
            "icon-image":"wushui-bengzhan",
            "icon-size":1,
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
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"wushui-famen",
            "icon-size":1
        }
    },
    {
        //污水井
        "id": "yuhangws_ws_wsj",
        "type": "symbol",
        "source": "yuhang_ws_wsj",
        "source-layer": "ws_wsj",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"wushui-wushuijing",
            "icon-size":1
        }
    },
    {
        //监测点
        "id": "yuhangws_ws_wsjcd",
        "type": "symbol",
        "source": "yuhang_ws_wsjcd",
        "source-layer": "ws_wsjcd",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"wushui-jiancedian",
            "icon-size":1
        }
    }
]
const layer_yuhang_gs_icon = [{   
        //供水泵站
        "id": "yuhanggs_gs_gsbz",
        "type": "symbol",
        "source": "yuhang_gs_gsbz",
        "source-layer": "gs_jyd",
        "maxzoom":24,
        "minzoom": 10,
        'filter':[
            'any',
            ['all',['==',['get','display_level'],1],['>=',['zoom'],11]],
            ['all',['==',['get','display_level'],2],['>=',['zoom'],12]],
            ['all',['==',['get','display_level'],3],['>=',['zoom'],13]]
        ],
        "layout":{
            "icon-image":"gongshui-bengzhan",
            "icon-size":1,
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
        "maxzoom":24,
        "minzoom": 17,
        "layout":{
            "icon-image":[
                'case',
                ['==',['get','display'],'减压阀'],
                'gongshui-jianyafa',
                'yibanfamen'
            ],
            "icon-size":1
        }
    },{   
        //自来水厂
        "id": "yuhanggs_gs_gsc",
        "type": "symbol",
        "source": "yuhang_gs_gsc",
        "source-layer": "gs_gsc",
        "maxzoom":24,
        "minzoom": 10,
        "layout":{
            "icon-image":"gongshui-shuichang",
            "icon-size":1,
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
        paint:{'text-halo-color':"#ffffff",'text-halo-width':1}
    },{   
        //水表箱
        "id": "yuhanggs_gs_sbx",
        "type": "symbol",
        "source": "yuhang_gs_sbx",
        "source-layer": "gs_sbx",
        "maxzoom":24,
        "minzoom": 18,
        "layout":{
            "icon-image":"shuibiaoxiangkuang",
            "icon-size":1,
            "text-field": [
                'case',
                ['to-boolean',["get", "metercnt"]],
                '0',
                ["get", "metercnt"]
            ],
            "text-size": 12,
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-anchor": "center",
        },
        paint:{
            "text-color": '#399aea',
        }
    },
    {
        //监测点
        "id": "yuhanggs_gs_jcd",
        "type": "symbol",
        "source": "yuhang_gs_gsjcd",
        "source-layer": "gs_monitor",
        "maxzoom":24,
        "minzoom": 14,
        "layout":{
            "icon-image":"gongshui-jiancedian",
            "icon-size":1,
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
        "maxzoom":24,
        "minzoom": 18,
        "layout":{
            "icon-image":"gongshui",
            "icon-size":1
        }
    },{   
        //消火栓
        "id": "yuhanggs_gs_xhs",
        "type": "symbol",
        "source": "yuhang_gs_xfs",
        "source-layer": "gs_xfs",
        "maxzoom":24,
        "minzoom": 16,
        "layout":{
            "icon-image":"xiaohuoshuan",
            "icon-size":1
        }
    },
    {   
        //排气阀
        "id": "yuhanggs_gs_pqf",
        "type": "symbol",
        "source": "yuhang_gs_pqf",
        "source-layer": "gs_pqf",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"gongshui-paiqifa",
            "icon-size":1
        }
    },{   
        //排污阀
        "id": "yuhanggs_gs_pwf",
        "type": "symbol",
        "source": "yuhang_gs_pwf",
        "source-layer": "gs_pwf",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"gongshui-paiwufa",
            "icon-size":1
        }
    },{   
        //排污口
        "id": "yuhanggs_gs_pwk",
        "type": "symbol",
        "source": "yuhang_gs_pwk",
        "source-layer": "gs_pwk",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"gongshui-paiwukou",
            "icon-size":1
        }
    },{   
        //预留口
        "id": "yuhanggs_gs_ylk",
        "type": "symbol",
        "source": "yuhang_gs_ylk",
        "source-layer": "gs_ylk",
        "maxzoom":24,
        "minzoom": 15,
        "layout":{
            "icon-image":"gongshui-yuliukou",
            "icon-size":1
        }
    },
]
const LayerType = {
    '供水' : [layer_yuhang_gs,layer_yuhang_gs_icon],
    '雨水' : [layer_yuhang_ys,layer_yuhang_ys_icon],
    '污水' : [layer_yuhang_ws,layer_yuhang_ws_icon],
}
class MapInit{
    constructor({container, options, center, bus }, callback){
        this.eventBus = bus;
        this.nowMap = 'tdt';
        this.map = this.createMap(container, options, center);
        this.map.on('load', () => {
          callback && callback(this);
        });
        this.popups = [];
        this.markers = [];
        this.popup = new mapboxgl.Popup({closeButton:false});
        this.marker = new mapboxgl.Marker();
        this.superDataDeal = new superDataDeal();
    }
    createMap(container, options, center){
        mapboxgl.accessToken = 'pk.eyJ1IjoiOTM0MDk0Mjg2IiwiYSI6ImNsMnNmdmVrZDBrZGMzZG50cHJudXJkbW8ifQ.C0wKhJgrToFJgL8GH5M8rg';
        const map = new mapboxgl.Map(
            Object.assign({
              container,
              center: center,
              zoom: 13.570532360577655,
              minZoom: 10,
              maxZoom: 22,
              pitchWithRotate: false,
              preserveDrawingBuffer: true,
              doubleClickZoom: false,
              trackResize: true
            //   transformRequest: (url, resourceType) => {
            //     const auth = uni.getStorageSync("Fawkes-Auth");
            //     if (resourceType == 'Tile' && (url.startsWith(baseUrl.url_config + "/ops-inspection") || url.startsWith(baseUrl.url_config + "/yhsw-postgis"))) {
            //       return {
            //         url: url,
            //         headers: { 
            //           'Fawkes-Auth': auth,
            //         }
            //       }
            //     }
            //   }
        }, options));
        map.getCanvas().style.outline = "none"
        return map;
    }
    destoryMap(){
      this.map.remove();
      this.map = null;
    }
    addSource(id,source){
      this.map.addSource(id,source);
    }
    setSourceData(sourceId,data){
        console.log(sourceId, data)
      this.map.getSource(sourceId).setData(data);
    }
    removeSource(sourceId){
      this.map.removeSource(sourceId);
    }

    //图层组
    addLayer(layer) {
        this.map.addLayer(layer);
    }
    // addLayer(layer,groupId,beforeLayerId){
    //   try{
    //     this.map.addLayer(layer,beforeLayerId);
    //     if(groupId){
    //       if(!this.group[groupId]){
    //         this.group[groupId] = [];
    //       }
    //       this.group[groupId].push(layer);
    //     }else{
    //       this.group['common'].push(layer)
    //     }
    //   }catch(err){
    //     console.log(err)
    //   }
    // }
    getLayer(layerId){
      return this.map.getLayer(layerId);
    }
    removeLayer(layerId){
      try{
        this.map.removeLayer(layerId);
        let falg = 0;
        for (let key in this.group){
          this.group[key].forEach((layer,index) => {
            if(layer.id == layerId){
              this.group[key].splice(index,1);
              falg = 1;
            }
          });
          if(falg){
            break;
          }
        }
      }catch(err){
        console.log(err)
      }
    }
    removeGroupLayer(groupId){
      this.group[groupId] && this.group[groupId].forEach(layer => {
        this.map.removeLayer(layer.id);
      })
      delete this.group[groupId];
    }

    addImage(i,w,h){
      const img = new Image();
      img.src = i;
      img.width = w;
      img.height = h;
      img.onload = () => {
        this.map.addImage("user",img);
      }
    }
    async addSuperStyleData(url){
      let data = await this.superDataDeal.getStyleData(url);
      this.addSource(data.name,data.sources[data.name]);
      // data.sources[data.name].tiles[0] = gisDomain + '/iserver' + data.sources[data.name].tiles[0].split('iserver')[1];
      data.layers = data.layers.filter(layer => {return layer.type !== "background"})
      switch (data.name) {
        case "供水管线标注":
          this.gsBZLayers = data.layers.map(layer => { return layer.id});
          break;
        case "雨水管线标注":
          this.ysBZLayers = data.layers.map(layer => { return layer.id});
          break;
        case "污水管线标注":
          this.wsBZLayers = data.layers.map(layer => { return layer.id});
          break;
        default:
          break;
      }
      data.layers.forEach(layer => {
        if(layer.layout && layer.layout.visibility == "visible"){
          delete layer.maxzoom
          this.addLayer(layer,'baseMap')
        }
      })
      this.nowMap = "baseMap";
    }
    newMarker(option){
      return new mapboxgl.Marker(option || {})
    }
    newPopup(option){
      return new mapboxgl.Popup(option || {});
    }
    position(features){
      console.log('turf123 :>> ', turf);
      let bbox = turf.bbox({
        type:"FeatureCollection",
        features
      });
      let bboxPolygon = turf.bboxPolygon(bbox);
      let v2 = new mapboxgl.LngLatBounds(bboxPolygon.geometry.coordinates[0][0], bboxPolygon.geometry.coordinates[0][2])
      this.map.fitBounds(v2,{
          linear:false,
          padding: {top:60, bottom:60, left:60, right:60}
      });
    }
    flyTo(position,zoom){
      this.map.flyTo({center:position,zoom:zoom || 16})
    }
    //查询点击处特征
    queryRenderedFeatures(e){
      return this.map.queryRenderedFeatures(  [
          [e.point.x - 4, e.point.y - 4],
          [e.point.x + 4, e.point.y + 4],
        ]);
    }
    //切换地图,name: tdt||yxt||baseMap
    changeBaseMap(name){
      if(this.group[name]){
        if(this.nowMap){
          this.group[this.nowMap].forEach(layer => {
            this.map.setLayoutProperty(layer.id,'visibility','none');
          })
        }
        this.nowMap = name;
        this.group[name].forEach(layer => {
          this.map.setLayoutProperty(layer.id,'visibility','visible');
        })
      }else{
        alert('暂无该底图');
      }
    }
    //超图几何查询
    async getDataWithSpatial({datasetNames,geometry}){
      return await this.superDataDeal.getDataWithSpatial({datasetNames,geometry});
    }
    //超图几何条件查询
    async getDataWithSpatialAtt({datasetNames,geometry,sql}){
      return await this.superDataDeal.getDataWithSpatialAtt({datasetNames,geometry,sql});
    }
    //超图几何查询 通过业务类型和管线级别
    async getDataWithSpatialAndPipeLevel({datasetNames, geom, pipeLevel, isSupply}) {
      return await this.superDataDeal.getDataWithSpatialAndPipeLevel({datasetNames, geom, pipeLevel, isSupply});
    }
     //超图sql条件查询
     async getDataWithSql(datasetNames, sql){
      return await this.superDataDeal.getDataWithSql(datasetNames, sql);
    }
    // 改变业务类型管线标注
    changeBZLayer(type) {
      switch (type) {
        case "WATER_SUPPLY":
          this.gsBZLayers.forEach((item, index) => {
            this.map.getLayer(this.gsBZLayers[index]) && this.map.setLayoutProperty(this.gsBZLayers[index],'visibility','visible');
          })
          this.ysBZLayers.forEach((item, index) => {
            this.map.getLayer(this.ysBZLayers[index]) && this.map.setLayoutProperty(this.ysBZLayers[index],'visibility','none');
          })
          this.wsBZLayers.forEach((item, index) => {
            this.map.getLayer(this.wsBZLayers[index]) && this.map.setLayoutProperty(this.wsBZLayers[index],'visibility','none');
          })
          break;
        case "RAI_WATER":
          this.ysBZLayers.forEach((item, index) => {
            this.map.getLayer(this.ysBZLayers[index]) && this.map.setLayoutProperty(this.ysBZLayers[index],'visibility','visible');
          })
          this.gsBZLayers.forEach((item, index) => {
            this.map.getLayer(this.gsBZLayers[index]) && this.map.setLayoutProperty(this.gsBZLayers[index],'visibility','none');
          })
          this.wsBZLayers.forEach((item, index) => {
            this.map.getLayer(this.wsBZLayers[index]) && this.map.setLayoutProperty(this.wsBZLayers[index],'visibility','none');
          })
          break;
        case "POLLUTED_WATER":
          this.wsBZLayers.forEach((item, index) => {
            this.map.getLayer(this.wsBZLayers[index]) && this.map.getLayer(this.gsBZLayers[index]) &&this.map.setLayoutProperty(this.wsBZLayers[index],'visibility','visible');
          })
          this.ysBZLayers.forEach((item, index) => {
            this.map.getLayer(this.ysBZLayers[index]) && this.map.setLayoutProperty(this.ysBZLayers[index],'visibility','none');
          })
          this.gsBZLayers.forEach((item, index) => {
            this.map.getLayer(this.gsBZLayers[index]) && this.map.setLayoutProperty(this.gsBZLayers[index],'visibility','none');
          })
          break;
        default:
          this.wsBZLayers.forEach((item, index) => {
            this.map.getLayer(this.wsBZLayers[index]) && this.map.setLayoutProperty(this.wsBZLayers[index],'visibility','none');
          })
          this.ysBZLayers.forEach((item, index) => {
            this.map.getLayer(this.ysBZLayers[index]) && this.map.setLayoutProperty(this.ysBZLayers[index],'visibility','none');
          })
          this.gsBZLayers.forEach((item, index) => {
            this.map.getLayer(this.gsBZLayers[index]) && this.map.setLayoutProperty(this.gsBZLayers[index],'visibility','none');
          })
          break;
      }
    }

    /**
     * 树结构深度遍历
     * @param {Array} targetArr 迭代目标
     * @param {String} iterationName 迭代属性的字段名
     * @param {Array} targetNames 需要获取的字段名
     */
     iteration(targetArr=[],iterationName="",targetNames=[]){
      let arr = [];
      let fun = function(targetArr,iterationName,targetNames){
        targetArr.forEach(item => {
            let obj = {};
            targetNames.forEach(targetName => {
                obj[targetName] = item[targetName];
            })
            arr.push(obj)
            if(item[iterationName]){
                fun(item[iterationName],iterationName,targetNames)
            }
        })
      }
      fun(targetArr,iterationName,targetNames);
      return arr;
    }


  /**
     * 新增标记
     * @param {*} ele 标签
     * @param {*} centerCoord 坐标
     */
   addMarker(ele,centerCoord,configure = {}){
    let option = {
        element: ele,
        anchor: "center",
        pitchAlignment:"map",
        rotationAlignment:"map",
    };
    if(centerCoord.length){
        return new mapboxgl.Marker(Object.assign(option,configure)).setLngLat(centerCoord).addTo(this.map)
    }
    return 'error'
}
    
    /**
     * 加载实时瓦片
     */
     addTimerSource(){
       console.log('window.location.host :>> ', window.location.host);
      Object.keys(sourceYh).forEach(key => {
          this.map.addSource(key,sourceYh[key]);
      })
      }
      addTimerLayer(type = '供水'){
          let layers = LayerType[type];
          let l = layers[0].concat(layers[1]);
          l.forEach(layer => {
            if (!this.map.getLayer(layer.id)) {
              this.map.addLayer(layer);
              this.deviceLayers.push(layer.id);
            }
          })
          return l || [];
      }

      removeTimerLayer(type = '供水') {
        let layers = LayerType[type];
        let l = layers[0].concat(layers[1]);
        l.forEach(layer => {
          if (this.map.getLayer(layer.id)) {
            this.map.removeLayer(layer.id);
          }
        })
      }


}
export default MapInit