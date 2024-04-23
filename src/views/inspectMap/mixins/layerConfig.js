const layers = {
    '供水':[
        {
            name:"75mm管线",
            layer:{
                "id": "yuhanggs_gs_75mmyxgd_allShow",
                "type": "line",
                "source": "yuhang_gs_75mm",
                "source-layer": "gs_75mmyxgd",
                "maxzoom":24,
                "minzoom": 15,
                "layout": { "visibility": "visible" },
                "paint": {
                    "line-color": "rgba(115,38,0, 1)",
                    "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
                }
            },
            markId:{
                "id": "yuhanggs_gs_75mmyxgd_symbol_allShow",
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
                    "text-max-width": 10,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "rgba(115, 38, 0, 1)", "icon-color": "rgba(59, 55, 55, 1)", 'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"75-300mm管线",
            layer:{
                "id": "yuhanggs_gs_75_300mmgd_allShow",
                "type": "line",
                "source": "yuhang_gs_75-300mm",
                "source-layer": "gs_75_300mmgd",
                "maxzoom":24,
                "minzoom": 14,
                "layout": { "visibility": "visible" },
                "paint": {
                    "line-color": "rgba(0,115,76, 1)",
                    "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
                }
            },
            markId:{
                "id": "yuhanggs_gs_75_300mmgd_symbol_allShow",
                "type": "symbol",
                "source": "yuhang_gs_75-300mm",
                "source-layer": "gs_75_300mmgd",
                "maxzoom":24,
                "minzoom": 14,
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
                    "text-max-width": 10,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "rgba(0, 115, 76, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"300-500mm管线",
            layer:{
                "id": "yuhanggs_gs_300_500mmgd_allShow",
                "type": "line",
                "source": "yuhang_gs_300-500mm",
                "source-layer": "gs_300_500mmgd",
                "maxzoom":24,
                "minzoom": 12,
                "layout": { "visibility": "visible" },
                "paint": {
                    "line-color": "rgba(169,0,230, 1)",
                    "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
                }
            },
            markId:{
                "id": "yuhanggs_gs_300_500mmgd_symbol_allShow",
                "type": "symbol",
                "source": "yuhang_gs_300-500mm",
                "source-layer": "gs_300_500mmgd",
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
                    "text-max-width": 10,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "rgba(169, 0, 230, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"500-800mm管线",
            layer:{
                "id": "yuhanggs_gs_500_800mmgd_allShow",
                "type": "line",
                "source": "yuhang_gs_500-800mm",
                "source-layer": "gs_500_800mmgd",
                "maxzoom":24,
                "minzoom": 11,
                "layout": { "visibility": "visible" },
                "paint": {
                    "line-color": "rgba(230,0,0, 1)",
                    "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
                }
            },
            markId:{
                "id": "yuhanggs_gs_500_800mmgd_symbol_allShow",
                "type": "symbol",
                "source": "yuhang_gs_500-800mm",
                "source-layer": "gs_500_800mmgd",
                "maxzoom":24,
                "minzoom": 11,
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
                    "text-max-width": 10,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "rgba(230, 0, 0, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"800mm管线",
            layer:{
                "id": "yuhanggs_gs_800mmysgd_allShow",
                "type": "line",
                "source": "yuhang_gs_800mm",
                "source-layer": "gs_800mmysgd",
                "maxzoom":24,
                "minzoom": 10,
                "layout": { "visibility": "visible" },
                "paint": {
                    "line-color": "rgba(0, 92, 230, 1)",
                    "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
                }
            },
            markId:{
                "id": "yuhanggs_gs_800mmysgd_symbol_allShow",
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
                    "text-max-width": 10,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "rgba(0, 92, 230, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"原水管线",
            layer:{
                "id": "yuhanggs_gs_ysgx_allShow",
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
            markId:{
                "id": "yuhanggs_gs_ysgx_symbol_allShow",
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
                    "text-max-width": 12,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "rgba(168, 168, 0, 1)", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"节点",
            layer:{   
                //节点
                "id": "yuhanggs_gs_jd_allShow",
                "type": "symbol",
                "source": "yuhang_gs_ljd",
                "source-layer": "gs_ljd",
                "maxzoom":24,
                "minzoom": 17,
                "layout":{
                    "icon-image":"供水",
                    "icon-size":1
                }
            }
        },
        {
            name:"监测点",
            layer:{
                //监测点
                "id": "yuhanggs_gs_jcd_allShow",
                "type": "symbol",
                "source": "yuhang_gs_gsjcd",
                "source-layer": "gs_monitor",
                "maxzoom":24,
                "minzoom": 15,
                "layout":{
                    "icon-image":"gongshui-jiancedian",
                    "icon-size":1
                }
            },
        },{
            name:"加压泵站",
            layer:{   
                //供水泵站
                "id": "yuhanggs_gs_gsbz_allShow",
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
                    "icon-size":1.2,
                    "text-field": ["get", "name"],
                    "text-offset": [0, 1],
                    "text-size": 12,
                    "text-allow-overlap": true,
                    "text-ignore-placement": true,
                    "text-pitch-alignment": "map",
                    "text-rotation-alignment": "map",
                    "text-anchor": "center",
                },
                "paint":{
                    "text-color": "rgba(57, 154, 234, 1)",
                }
            }
        },{
            name:"阀门",
            layer:{   
                //供水阀门
                "id": "yuhanggs_gs_fm_allShow",
                "type": "symbol",
                "source": "yuhang_gs_fm",
                "source-layer": "gs_fm",
                "maxzoom":24,
                "minzoom": 16,
                "layout":{
                    "icon-image":[
                        'case',
                        ['==',['get','display'],'减压阀'],
                        'gongshui-jianyafa',
                        'yibanfamen'
                    ],
                    "icon-size":1
                }
            }
        },{
            name:"水厂",
            layer:{   
                //自来水厂
                "id": "yuhanggs_gs_ghc_allShow",
                "type": "symbol",
                "source": "yuhang_gs_gsc",
                "source-layer": "gs_gsc",
                "maxzoom":24,
                "minzoom": 10,
                "layout":{
                    "icon-image":"gongshui-shuichang",
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
            "paint":{
                "text-color": "#2A83E6",
                'text-halo-color':"#ffffff",'text-halo-width':1
            }
        },{
            name:"消火栓",
            layer:{   
                //消火栓
                "id": "yuhanggs_gs_xhs_allShow",
                "type": "symbol",
                "source": "yuhang_gs_xfs",
                "source-layer": "gs_xfs",
                "maxzoom":24,
                "minzoom": 15,
                "layout":{
                    "icon-image":"xiaohuoshuan",
                    "icon-size":1
                }
            }
        },{
            name:"水表箱",
            layer:{   
                //水表箱
                "id": "yuhanggs_gs_sbx_allShow",
                "type": "symbol",
                "source": "yuhang_gs_sbx",
                "source-layer": "gs_sbx",
                "maxzoom":24,
                "minzoom": 17,
                "layout":{
                    "icon-image":"shuibiaoxiangkuang",
                    "icon-size":1,
                    "text-field": [
                        'case',
                        ['==',['to-boolean',["get", "metercnt"]],false],
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
            }
        },{
            name:"排气阀",
            layer:{   
                //排气阀
                "id": "yuhanggs_gs_pqf_allShow",
                "type": "symbol",
                "source": "yuhang_gs_pqf",
                "source-layer": "gs_pqf",
                "maxzoom":24,
                "minzoom": 14,
                "layout":{
                    "icon-image":"gongshui-paiqifa",
                    "icon-size":1
                }
            }
        },{
            name:"排污阀",
            layer:{   
                //排污阀
                "id": "yuhanggs_gs_pwf_allShow",
                "type": "symbol",
                "source": "yuhang_gs_pwf",
                "source-layer": "gs_pwf",
                "maxzoom":24,
                "minzoom": 14,
                "layout":{
                    "icon-image":"gongshui-paiwufa",
                    "icon-size":1
                }
            }
        },{
            name:"排污口",
            layer:{   
                //排污口
                "id": "yuhanggs_gs_pwk_allShow",
                "type": "symbol",
                "source": "yuhang_gs_pwk",
                "source-layer": "gs_pwk",
                "maxzoom":24,
                "minzoom": 14,
                "layout":{
                    "icon-image":"gongshui-paiwukou",
                    "icon-size":1
                }
            }
        },{
            name:"预留口",
            layer:{   
                //预留口
                "id": "yuhanggs_gs_ylk_allShow",
                "type": "symbol",
                "source": "yuhang_gs_ylk",
                "source-layer": "gs_ylk",
                "maxzoom":24,
                "minzoom": 14,
                "layout":{
                    "icon-image":"gongshui-yuliukou",
                    "icon-size":1
                }
            }
        },
    ],
    '雨水':[
        {
            name:"雨水管线",
            layer:{
                "id": "yuhangys_ys_ysg_allShow",
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
            },
            markId:{
                "id": "yuhangys_ys_ysg_symbol_allShow",
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
        },{
            name:"小区雨水管线",
            layer:{
                "id": "yuhangys_ys_xqgxys_allShow",
                "type": "line",
                "source": "yuhang_ys_xqgxys",
                "source-layer": "ys_xqgxys",
                "maxzoom":24,
                "minzoom": 15,
                "layout": { "visibility": "visible" },
                "paint": {
                    "line-color": "#448970",
                    "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
                }
            },
            markId:{
                "id": "yuhangys_ys_xqgxys_symbol_allShow",
                "type": "symbol",
                "source": "yuhang_ys_xqgxys",
                "source-layer": "ys_xqgxys",
                "maxzoom":24,
                "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
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
                    "icon-allow-overlap": false,
                    "icon-rotation-alignment": "map",
                    "text-rotate": 0,
                    "icon-rotate": ["*", ["to-number", ["get", "flowdir"]], 180],
                    "text-size": 16,
                    "text-allow-overlap": false,
                    "text-ignore-placement": false,
                    "text-pitch-alignment": "map",
                    "text-rotation-alignment": "map",
                    "text-anchor": "center",
                    "text-offset": [0, 1],
                    "icon-padding": 2,
                    "icon-offset": [0, -5],
                    "text-padding": 0,
                    "icon-text-fit": "none",
                    "icon-image": "xiaoquyushui-jt",
                    "text-max-width": 10,
                    "icon-ignore-placement": false,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "#448970", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{   
            //节点
            name:"节点",
            layer:{   
                "id": "yuhangys_ys_ysjd_allShow",
                "maxzoom":24,
                "minzoom": 17,
                "type": "symbol",
                "source": "yuhang_ys_ysgd",
                "source-layer": "ys_ysgd",
                "layout":{
                    "icon-image":"yushui",
                    "icon-size":1
                }
            }
        },{
            name:"雨水口",
            layer:{   
                //雨水口
                "id": "yuhangws_ys_ysk_allShow",
                "type": "symbol",
                "source": "yuhang_ys_ysk",
                "maxzoom":24,
                "minzoom": 14,
                "source-layer": "ys_ysk",
                "layout":{
                    "icon-image":"yushui-yushuikou",
                    "icon-size":1
                }
            }
        },{
            name:"雨水井",
            layer:{
                //雨水井
                "id": "yuhangys_ys_ysjcj_allShow",
                "type": "symbol",
                "minzoom": 14,
                "maxzoom":24,
                "source": "yuhang_ys_ysj",
                "source-layer": "ys_ysj",
                "layout":{
                    "icon-image":"yushui-yushuijing",
                    "icon-size":1
                }
            }
        },{
            name:"排放口",
            layer:{   
                //雨水排放口
                "id": "yuhangys_ys_yspfk_allShow",
                "type": "symbol",
                "maxzoom":24,
                "minzoom": 14,
                "source": "yuhang_ys_yspfk",
                "source-layer": "ys_yspfk",
                "layout":{
                    "icon-image":"yushui-paifangkou",
                    "icon-size":1
                }
            }
        },{
            name:"雨水泵站",
            layer:{   
                //雨水泵站
                "id": "yuhangys_ys_ysbz_allShow",
                "type": "symbol",
                "source": "yuhang_ys_ysbz",
                "maxzoom":24,
                "minzoom": 13,
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
        }
    ],
    '污水':[
        {
            name:"重力管",
            layer:{
                "id": "yuhangws_ws_wsgzl_allShow",
                "type": "line",
                "source": "yuhang_ws_wsgzl",
                "source-layer": "ws_wsgzl",
                "maxzoom":24,
                "minzoom": 10,
                "layout": { "visibility": "visible" },
                "paint": {
                    "line-color": "#9F6EFF",
                    "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
                }
            },
            markId:{
                "id": "yuhangws_ws_wsgzl_symbol_allShow",
                "type": "symbol",
                "maxzoom":24,
                "minzoom":10,
                "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
                "source": "yuhang_ws_wsgzl",
                "source-layer": "ws_wsgzl",
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
                    "icon-image": "wushuizhongli-jt",
                    "text-max-width": 10,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "#9F6EFF", "icon-color": "#9F6EFF",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"压力管",
            layer:{
                "id": "yuhangws_ws_wsgyl_allShow",
                "type": "line",
                "source": "yuhang_ws_wsgyl",
                "source-layer": "ws_wsgyl",
                "maxzoom":24,
                "minzoom": 10,
                "layout": { "visibility": "visible" },
                "paint": {
                    "line-color": "#FF4D4F",
                    "line-width": ["+", ["/", ["to-number", ["get", "caliber"]], 500], 0.2]
                }
            },
            markId:{
                "id": "yuhangws_ws_wsgyl_symbol_allShow",
                "type": "symbol",
                "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
                "maxzoom":24,
                "minzoom":10,
                "source": "yuhang_ws_wsgyl",
                "source-layer": "ws_wsgyl",
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
                    "icon-image": "wushuiyali-jt",
                    "text-max-width": 10,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "#FF4D4F", "icon-color": "#FF4D4F",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"未移交管线",
            layer:{
                //未移交管线
                "id": "yuhangws_ws_wsgwyj_allShow",
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
            markId:{
                "id": "yuhangws_ws_wsgwyj_symbol_allShow",
                "type": "symbol",
                "maxzoom":24,
                "minzoom":12,
                "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
                "source": "yuhang_ws_wsgwyj",
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
                "paint": { "text-color": "#de5a03", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{
            name:"排江管",
            layer:{
                "id": "yuhangws_ws_pjg_allShow",
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
            markId:{
                "id": "yuhangws_ws_pjg_symbol_allShow",
                "type": "symbol",
                "maxzoom":24,
                "minzoom":12,
                "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
                "source": "yuhang_ws_pjg",
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
            }
        },{
            name:"小区污水管线",
            layer:{
                "id": "yuhangws_ws_xqgxws_allShow",
                "type": "line",
                "source": "yuhang_ws_xqgxws",
                "source-layer": "ws_xqgxws",
                "maxzoom":24,
                "minzoom": 15,
                "layout": { "visibility": "visible" },
                "paint": { "line-color": "#737300", "line-width": 0.5 }
            },
            markId:{
                "id": "yuhangws_ws_xqgxws_symbol_allShow",
                "type": "symbol",
                "maxzoom":24,
                "minzoom":15,
                "filter":['any',['==',['get','flowdir'],'0'],['==',['get','flowdir'],'1']],
                "source": "yuhang_ws_xqgxws",
                "source-layer": "ws_xqgxws",
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
                    "icon-image": "xiaoquwushui-jt",
                    "text-max-width": 10,
                    "icon-ignore-placement": true,
                    "symbol-z-order": "auto",
                    "text-justify": "center",
                    "text-writing-mode": [],
                    "icon-size": 1.6,
                    "visibility": "visible"
                },
                "paint": { "text-color": "#737300", "icon-color": "rgba(59, 55, 55, 1)",'text-halo-color':"#ffffff",'text-halo-width':1 }
            }
        },{   
            //闸门
            name:"闸门",
            layer:{
                "id": "yuhangws_ws_wszm",
                "type": "symbol",
                "source": "yuhang_ws_wszm",
                "source-layer": "ws_wszm",
                "maxzoom":24,
                "minzoom": 14,
                "layout": {
                    "icon-image":"wushui-zhamen",
                    "icon-size":1
                }
            }
        },{
            name:"管点",
            //管点
            layer:{
                "id": "yuhangws_ws_wsgd",
                "type": "symbol",
                "source": "yuhang_ws_wsgd",
                "source-layer": "ws_wsgd",
                "maxzoom":24,
                "minzoom": 14,
                "layout":{
                    "icon-image":"wushui",
                    "icon-size":1
                }
            }
        },{
            name:"净水厂",
            layer:{
                "id": "yuhangws_ws_wsc_allShow",
                "type": "symbol",
                "source": "yuhang_ws_wsc",
                "source-layer": "ws_wsc",
                "maxzoom":24,
                "minzoom": 11,
                "layout": {
                    "visibility": "visible",
                    "icon-image":"wushui-shuichang",
                    "icon-size":1,
                    "icon-allow-overlap": true,
                    "icon-ignore-placement": true,
                    "text-field": ["get", "name"],
                    "text-offset": [0, 1],
                    "text-size": 16,
                    "text-allow-overlap": true,
                    "text-ignore-placement": true,
                }
            },
        },{
            name:"污水口",
            layer:{   
                //污水口
                "id": "yuhangws_ws_wsk_allShow",
                "type": "symbol",
                "source": "yuhang_ws_wsk",
                "source-layer": "ws_wsk",
                "maxzoom":24,
                "minzoom": 14,
                "layout":{
                    "icon-image":"wushui-wushuikou",
                    "icon-size":1
                }
            },
        },{
            name:"排放口",
            layer:{
                //排放口
                "id": "yuhangws_ws_wspfk_allShow",
                "type": "symbol",
                "source": "yuhang_ws_wspfk",
                "source-layer": "ws_wspfk",
                "maxzoom":24,
                "minzoom": 14,
                "layout":{
                    "icon-image":"wushui-paifangkou",
                    "icon-size":1
                }
            },
        },{
            name:"污水泵站",
            layer:{
                //泵站
                "id": "yuhangws_ws_wsbz_allShow",
                "type": "symbol",
                "source": "yuhang_ws_wsbz",
                "source-layer": "ws_wsbz_with_iot",
                "maxzoom":24,
                "minzoom": 11,
                'filter':[
                    'any',
                    ['all',['==',['get','display_level'],1],['>=',['zoom'],11]],
                    ['all',['==',['get','display_level'],2],['>=',['zoom'],12]],
                    ['all',['==',['get','display_level'],3],['>=',['zoom'],13]]
                ],
                "layout":{
                    "icon-image":"wushui-bengzhan",
                    "icon-size":1.2,
                    "text-field": ["get", "name"],
                    "text-offset": [0, 1],
                    "text-size": 12,
                    "text-allow-overlap": true,
                    "text-ignore-placement": true,
                    "text-pitch-alignment": "map",
                    "text-rotation-alignment": "map",
                    "text-anchor": "center",
                },
                "paint":{
                    "text-color": "rgba(145, 80, 9, 1)",
                }
            },
        },{
            name:"阀门",
            layer:{
                //阀门
                "id": "yuhangws_ws_wsfm_allShow",
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
        },{
            name:"污水井",
            layer:{
                //污水井
                "id": "yuhangws_ws_wsj_allShow",
                "type": "symbol",
                "source": "yuhang_ws_wsj",
                "source-layer": "ws_wsj",
                "maxzoom":24,
                "minzoom": 15,
                "layout":{
                    "icon-image":"wushui-wushuijing",
                    "icon-size":1,
                    'symbol-z-order':"source"
                }
            },
        },{
            name:"监测点",
            layer:{
                //监测点
                "id": "yuhangws_ws_wsjcd_allShow",
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
        }
    ]
}
export function changeLayerVisible(map,LayerName,visible) {
    let layer = null;
    Object.keys(layers).find(key => {
        layer = layers[key].find(i => i.name === LayerName);
        return layer
    });
    if (layer && map.getLayer(layer.layer.id)) {
        map.setLayoutProperty(layer.layer.id,'visibility',visible ? 'visible' : 'none');
        if(layer.markId && map.getLayer(layer.markId.id)) {
            map.setLayoutProperty(layer.markId.id,'visibility',visible ? 'visible' : 'none');
        } 
    }
}
export function changeOneTypeLayersVisible(map,type,visible) {
    (layers[type] || []).forEach(layer => {
        map.setLayoutProperty(layer.layer.id,'visibility',visible ? 'visible' : 'none');
        if(layer.markId && map.getLayer(layer.markId.id)) {
            map.setLayoutProperty(layer.markId.id,'visibility',visible ? 'visible' : 'none');
        } 
    })
}
export default layers

