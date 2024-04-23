export const RDBaseLayerConfig = [
  {
    'id': 'countries',
    'type': 'fill',
    'metadata': {'layerId': '1499931378475601922'},
    'source': '1499931378475601922',
    'source-layer': '1499931378475601922',
    'minzoom': 0,
    'paint': {'fill-color': 'rgba(252, 253, 255, 1)'}
  },
  {
    'id': 'other_points',
    'type': 'symbol',
    'metadata': {'layerId': '1482888190447587330'},
    'source': '外部矢量数据源',
    'source-layer': 'other_points'
  },
  {
    'id': 'amenity_points',
    'type': 'symbol',
    'metadata': {'layerId': '1482888190414032898'},
    'source': '外部矢量数据源',
    'source-layer': 'amenity_points'
  },
  {
    'id': 'amenity_areas',
    'type': 'fill',
    'metadata': {'layerId': '1482888190376284161'},
    'source': '外部矢量数据源',
    'source-layer': 'amenity_areas',
    'paint': {'fill-color': 'rgba(206, 226, 255, 1)'}
  },
  {
    'id': 'transport_points',
    'type': 'symbol',
    'metadata': {'layerId': '1482888190346924033'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_points'
  },
  {
    'id': 'transport_areas',
    'type': 'fill',
    'metadata': {'layerId': '1482888190304980993'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_areas',
    'paint': {'fill-color': 'rgba(211, 214, 222, 1)'}
  },
  {
    'id': 'water_lines_river',
    'type': 'line',
    'metadata': {'layerId': '1482888190237872130'},
    'source': '外部矢量数据源',
    'source-layer': 'water_lines',
    'minzoom': 7,
    'filter': ['all', ['==', 'type', 'river']],
    'layout': {'line-cap': 'round', 'visibility': 'visible'},
    'paint': {
      'line-color': 'rgb(158,189,255)',
      'line-opacity': 0.5,
      'line-width': 2
    }
  },
  {
    'id': 'water_areas',
    'type': 'fill',
    'metadata': {'layerId': '1482888190200123394'},
    'source': '外部矢量数据源',
    'source-layer': 'water_areas',
    'layout': {'visibility': 'visible'},
    'paint': {'fill-color': 'rgba(172, 206, 251, 1)'}
  },
  {
    'id': 'admin_lines',
    'type': 'line',
    'metadata': {'layerId': '1482888190086877185'},
    'source': '外部矢量数据源',
    'source-layer': 'admin_lines',
    'minzoom': 0,
    'layout': {'visibility': 'visible'},
    'paint': {'line-color': 'rgba(228, 228, 228, 1)'}
  },
  {
    'id': 'admin_administrative',
    'type': 'line',
    'metadata': {'layerId': '1482888190086877185'},
    'source': '外部矢量数据源',
    'source-layer': 'admin_lines',
    'minzoom': 0,
    'filter': ['all', ['<=', 'admin_level', 7]],
    'layout': {'visibility': 'visible'},
    'paint': {'line-color': 'rgba(216, 216, 216, 1)'}
  },
  {
    'id': 'landuse_areas',
    'type': 'fill',
    'metadata': {'layerId': '1482888190153986049'},
    'source': '外部矢量数据源',
    'source-layer': 'landuse_areas',
    'layout': {'visibility': 'visible'},
    'paint': {
      'fill-color': 'rgba(252, 253, 255, 1)',
      'fill-opacity': {'stops': [[6, 0.3], [10, 0.5], [11, 0.8], [12, 1]]}
    }
  },
  {
    'id': 'landuse_water',
    'type': 'fill',
    'metadata': {'layerId': '1482888190153986049'},
    'source': '外部矢量数据源',
    'source-layer': 'landuse_areas',
    'filter': ['all', ['==', 'type', 'water']],
    'layout': {'visibility': 'visible'},
    'paint': {'fill-color': 'rgba(172, 206, 251, 1)'}
  },
  {
    'id': 'landuse_railway',
    'type': 'fill',
    'metadata': {'layerId': '1482888190153986049'},
    'source': '外部矢量数据源',
    'source-layer': 'landuse_areas',
    'filter': ['all', ['==', 'type', 'railway']],
    'paint': {'fill-color': 'rgba(194, 203, 209, 1)', 'fill-opacity': 0.5}
  },
  {
    'id': 'landuse_commercial',
    'type': 'fill',
    'metadata': {'layerId': '1482888190153986049'},
    'source': '外部矢量数据源',
    'source-layer': 'landuse_areas',
    'filter': ['all', ['==', 'type', 'commercial']],
    'layout': {'visibility': 'visible'},
    'paint': {'fill-color': 'rgba(219, 231, 246, 1)'}
  },
  {
    'id': 'landuse_wood',
    'type': 'fill',
    'metadata': {'layerId': '1482888190153986049'},
    'source': '外部矢量数据源',
    'source-layer': 'landuse_areas',
    'filter': ['all', ['==', 'type', 'wood']],
    'paint': {'fill-color': 'rgba(206, 226, 255, 1)', 'fill-opacity': 0.4}
  },
  {
    'id': 'highway-copy',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'minzoom': 9,
    'filter': ['all'],
    'paint': {
      'line-color': 'rgba(216, 216, 216, 1)',
      'line-width': {'stops': [[6, 1], [10, 2], [18, 6]]}
    }
  },
  {
    'id': 'highway',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'minzoom': 9,
    'filter': ['all'],
    'paint': {
      'line-color': 'rgba(225, 234, 245, 1)',
      'line-width': {'stops': [[6, 1], [10, 1], [18, 7]]}
    }
  },
  {
    'id': 'highway_rail',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'rail']],
    'paint': {'line-color': 'rgba(225, 234, 245, 1)', 'line-width': 2}
  },
  {
    'id': 'highway_secondary',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'secondary']],
    'paint': {
      'line-color': 'rgba(225, 234, 245, 1)',
      'line-width': {'stops': [[8, 1.5], [20, 10]]}
    }
  },
  {
    'id': 'highway_secondary-copy',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'secondary']],
    'paint': {
      'line-color': 'rgba(225, 234, 245, 1)',
      'line-width': {'stops': [[6, 0], [8, 0.5], [20, 8]]}
    }
  },
  {
    'id': 'highway_primary-copy',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'primary']],
    'paint': {
      'line-color': 'rgba(225, 234, 245, 1)',
      'line-width': {'stops': [[6, 0.5], [7, 1], [10, 2], [12, 5]]},
      'line-opacity': {'stops': [[6, 0], [10, 0.1], [11, 1]]}
    }
  },
  {
    'id': 'highway_primary',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'primary']],
    'paint': {
      'line-color': 'rgba(225, 234, 245, 1)',
      'line-width': {'stops': [[6, 0.3], [7, 0.6], [10, 0.8], [11, 2.2]]},
      'line-opacity': {'stops': [[6, 0], [10, 0.1], [11, 1]]}
    }
  },
  {
    'id': 'highway_trunk_link',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'trunk_link']],
    'paint': {'line-color': 'rgba(236, 239, 244, 1)'}
  },
  {
    'id': 'highway_trunk',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'trunk']],
    'paint': {
      'line-color': 'rgba(225, 234, 245, 1)',
      'line-width': {'stops': [[6, 1], [10, 1], [18, 5]]}
    }
  },
  {
    'id': 'highway_trunk-copy',
    'type': 'line',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'trunk']],
    'paint': {
      'line-color': 'rgba(225, 234, 245, 1)',
      'line-width': {'stops': [[6, 1], [10, 1], [18, 7]]}
    }
  },
  {
    'id': 'poi_water_areas',
    'type': 'symbol',
    'metadata': {'layerId': '1482888190200123394'},
    'source': '外部矢量数据源',
    'source-layer': 'water_areas',
    'minzoom': 9,
    'layout': {'text-field': '{name}', 'text-size': 12},
    'paint': {
      'text-color': 'rgba(25, 165, 236, 1)',
      'text-halo-color': 'rgba(255, 255, 255, 1)',
      'text-halo-width': 2
    }
  },
  {
    'id': 'poi_buildings_label',
    'type': 'symbol',
    'metadata': {'layerId': '1482888190560833538'},
    'source': '外部矢量数据源',
    'source-layer': 'buildings',
    'filter': ['all', ['==', 'type', 'yes']],
    'layout': {
      'text-field': '{name}',
      'text-size': {'stops': [[6, 10], [10, 14]]}
    },
    'paint': {
      'text-color': 'rgba(153, 153, 153, 1)',
      'text-halo-color': 'hsl(0, 0%, 100%)',
      'text-halo-width': 2
    }
  },
  {
    'id': 'poi_highway_primary_label-copy',
    'type': 'symbol',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'minzoom': 10,
    'filter': ['all', ['!=', 'type', 'primary']],
    'layout': {
      'text-field': '{name}',
      'text-size': {'stops': [[10, 8], [20, 14]]},
      'text-letter-spacing': 0.1,
      'symbol-placement': 'line'
    },
    'paint': {
      'text-halo-color': 'hsl(0, 0%, 100%)',
      'text-halo-width': 2,
      'text-color': 'rgba(153, 153, 153, 1)',
      'text-opacity': 0.8
    }
  },
  {
    'id': 'poi_highway_primary_label',
    'type': 'symbol',
    'metadata': {'layerId': '1482888190271426561'},
    'source': '外部矢量数据源',
    'source-layer': 'transport_lines',
    'filter': ['all', ['==', 'type', 'primary']],
    'layout': {
      'text-field': '{name}',
      'text-size': {'stops': [[10, 8], [20, 14]]},
      'text-letter-spacing': 0.1,
      'symbol-placement': 'line'
    },
    'paint': {
      'text-color': 'rgba(153, 153, 153, 1)',
      'text-halo-color': 'hsl(0, 0%, 100%)',
      'text-halo-width': 2
    }
  },
  {
    'id': 'poi_buildings_3D-no-ras-copy',
    'type': 'symbol',
    'metadata': {'layerId': '1482888190560833538'},
    'source': '外部矢量数据源',
    'source-layer': 'buildings',
    'filter': ['all', ['==', 'type', 'apartments']],
    'layout': {
      'text-field': '{name}',
      'text-size': {'stops': [[6, 10], [10, 12]]}
    },
    'paint': {
      'text-color': 'hsl(0, 0%, 25%)',
      'text-halo-color': 'hsl(0, 0%, 100%)',
      'text-halo-width': 2,
      'text-opacity': 0.8
    }
  }]

export const RDPipeLayer = {
    gx: [
      {
        "id": "rd_map_drainpipe_ys",
        "type": "line",
        "metadata": {"layerId": "1549000686380879873"},
        "source": "1549000686380879873",
        "source-layer": "1549000686380879873",
        "filter": [
          "all",
          ["==", "line_type", "雨水"]
        ],
        "paint": {"line-color": "rgba(57, 154, 234, 1)"}
      },
      {
        "id": "rd_map_drainpipe_ws",
        "type": "line",
        "metadata": {"layerId": "1549000686380879873"},
        "source": "1549000686380879873",
        "source-layer": "1549000686380879873",
        "filter": [
          "all",
          ["==", "line_type", "污水"]
        ],
        "paint": {"line-color": "rgba(145, 81, 10, 1)"}
      },
      {
        "id": "rd_map_comb",
        "type": "symbol",
        "metadata": {"layerId": "1548567778616774658"},
        "source": "1548567778616774658",
        "source-layer": "1548567778616774658",
        "layout": {"icon-image": "水务_雨水口"}
      },
      {
        "id": "rd_map_gate",
        "type": "symbol",
        "metadata": {"layerId": "1548568088177381377"},
        "source": "1548568088177381377",
        "source-layer": "1548568088177381377",
        "layout": {"icon-image": "闸门"}
      },
      {
        "id": "rd_map_manhole",
        "type": "symbol",
        "metadata": {"layerId": "1548568183727820801"},
        "source": "1548568183727820801",
        "source-layer": "1548568183727820801",
        "layout": {"icon-image": "污水检查井"}
      },
      {
        "id": "rd_map_outfall",
        "type": "symbol",
        "metadata": {"layerId": "1548568268092051457"},
        "source": "1548568268092051457",
        "source-layer": "1548568268092051457",
        "layout": {"icon-image": "水务_排放口-116"}
      }]
  }