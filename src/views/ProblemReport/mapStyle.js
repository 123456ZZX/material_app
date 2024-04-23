export default {
  version: 8,
  //为了显示点要素
  glyphs: "http://172.20.79.65:8008/mapboxSource/fonts/{fontstack}/{range}.pbf",
  sprite: "http://172.20.79.65:8008/mapboxSource/sprites/sprite",
  sources: {
    vec: {
      type: "raster",
      // tiles: ['http://t6.tianditu.gov.cn/DataServer/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=e48b86c567979db35a7f7dc268d2b1ba'],
      tiles: [
        "http://t6.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e48b86c567979db35a7f7dc268d2b1ba",
      ],
      tileSize: 256,
    },
    cva: {
      type: "raster",
      // tiles: ['http://t6.tianditu.gov.cn/DataServer/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=e48b86c567979db35a7f7dc268d2b1ba'],
      tiles: [
        "http://t6.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e48b86c567979db35a7f7dc268d2b1ba",
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "vec",
      type: "raster",
      source: "vec",
      maxzoom: 17,
      paint: {
        "raster-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4,
          1,
          12,
          0.4,
        ],
        "raster-saturation": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4,
          0,
          12,
          -0.8,
        ],
      },
    },
    {
      id: "cva",
      type: "raster",
      source: "cva",
      minzoom: 8.909804045192478,
    },
  ],
}