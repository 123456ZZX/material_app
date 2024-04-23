/* eslint-disable no-console, no-unused-vars */
import axios from "axios";
import Vue from "vue";
import mapboxgl from "mapbox-gl";
import { getArrayGeo } from "@/utils/util.js";
import * as turf from "@turf/turf";
const type = {
  Point: "POINT",
  LineString: "LINE",
  MultiPoint: "POINT",
  MultiLineString: "LINE",
  Polygon: "REGION",
  MultiPlygon: "REGION",
};
export default class MapInit {
  constructor({ container, options, center }, callBack) {
    // access token
    this.accessToken =
      "pk.eyJ1IjoiOTM0MDk0Mjg2IiwiYSI6ImNsMnNmdmVrZDBrZGMzZG50cHJudXJkbW8ifQ.C0wKhJgrToFJgL8GH5M8rg";
    window.xaMap = this.map = this.createMap({ container, options, center });
    // 预设做图层管理
    this.groups = {};
    // 单机事件区分 全局 all 分析事件 analysis  //default "all"
    this.clickState = "all";
    //重新选择第二个对象执行时只能点击触发一次
    this.continueVer = "ok";
    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    callBack && this.map.on("load", callBack(this));
    this.changeCursor();
    // this.getClickFeatures()

    //分析功能部分记录当前执行功能的销毁函数，在切换功能时调用销毁
    this.nowFunction = null;
    //储存3D，2D图层
    this.layer2D = [];
    this.layer3D = [];

    //划区域显示时各区域标记
    this.markers = [];
  }
  createMap({ container, options, center }) {
    mapboxgl.accessToken = this.accessToken;
    const map = new mapboxgl.Map(
      Object.assign(
        {
          container,
          center: center,
          preserveDrawingBuffer: true,
          doubleClickZoom: false,
          zoom: 13.570532360577655, // starting zoom
          minZoom: 10,
          maxZoom: 22,
        },
        options
      )
    );
    return map;
  }
  hzT4549(X, Y) {
    var moveX = 435542.834434922;
    var moveY = 3267268.38850877;
    var rotationAngle = 0.001343;
    var scaleChange = 0.999991455270843;
    var newLon =
      X * scaleChange * Math.cos(rotationAngle) -
      Y * scaleChange * Math.sin(rotationAngle) +
      moveX;
    var newLat =
      X * scaleChange * Math.sin(rotationAngle) +
      Y * scaleChange * Math.cos(rotationAngle) +
      moveY;
    return [newLon, newLat];
  }
  f4549THz(X, Y) {
    var moveX = -439934.104062;
    var moveY = -3266708.426255;
    var rotationAngle = -0.001343;
    var scaleChange = 1.000008544802;
    var newLon =
      X * scaleChange * Math.cos(rotationAngle) -
      Y * scaleChange * Math.sin(rotationAngle) +
      moveX;
    var newLat =
      X * scaleChange * Math.sin(rotationAngle) +
      Y * scaleChange * Math.cos(rotationAngle) +
      moveY;
    return [newLon, newLat];
  }
  position(features) {
    let bbox = turf.bbox({
      type: "FeatureCollection",
      features,
    });
    let b = turf.bboxPolygon(bbox);
    let v2 = new mapboxgl.LngLatBounds(
      b.geometry.coordinates[0][0],
      b.geometry.coordinates[0][2]
    );
    this.map.fitBounds(v2, {
      linear: false,
    });
  }
  /**
   * 绘制元素
   * @param {Array} features 元素数组
   */
  drawFeatures(name, features) {
    this.map.getSource(name).setData({
      type: "FeatureCollection",
      features,
    });
  }
  /**
   * 地图 pop
   * @param {Object} params 参数
   * @param {MapEvent} params.event 事件源
   * @param {Object} params.info 待展示信息
   */
  showPop({ event, info }) {
    this.map.getCanvas().style.cursor = "pointer";
    this.popup.setLngLat(event.lngLat).setHTML(info).addTo(this.map);
  }
  /**
   * 隐藏 pop
   */
  hidePop() {
    this.changeCursor();
    this.popup.remove();
  }
  /**
   * 获取name图层
   */
  getLayer(name) {
    return this.groups[name];
  }
  /**
   * 设置name图层
   * layers是数组
   */
  setLayer(name, layers) {
    this.groups[name] = layers;
  }
  changeCursor(type = "default") {
    this.map.getCanvas().style.cursor = type;
  }
  reflush() {
    this.map.on("moveend", (e) => {
      let result = Object.values(this.groups).map((layer) => {
        return layer.mapStyleCollection(layer.filters);
      });
      result.forEach((item) => {
        Object.keys(item).forEach((name) => {
          this.drawFeatures(name, item[name]);
        });
      });
    });
  }

  removeLightLayer() {
    if (this.map.getLayer("lightPoint")) this.map.removeLayer("lightPoint");
    if (this.map.getSource("lightPoint")) this.map.removeSource("lightPoint");
    if (this.map.getLayer("lightLine")) this.map.removeLayer("lightLine");
    if (this.map.getSource("lightLine")) this.map.removeSource("lightLine");
    if (this.map.getLayer("mulLightLine")) this.map.removeLayer("mulLightLine");
    if (this.map.getSource("mulLightLine"))
      this.map.removeSource("mulLightLine");
    this.markers.forEach((marker) => {
      marker.remove();
    });
  }
  /**
   * position 数组类型
   * 给搜索模块的定位进行使用
   */
  addLightLine(position, lineType, color = "#ff4a4a", lineWidth = 1.2) {
    if (this.map.getLayer("lightLine")) this.map.removeLayer("lightLine");
    if (this.map.getSource("lightLine")) this.map.removeSource("lightLine");
    if (lineType == "line") {
      this.map.addLayer({
        id: "lightLine",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: position,
            },
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
        },
      });
    } else {
      this.map.addLayer({
        id: "lightLine",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: position,
            },
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": color,
          "line-width": lineWidth,
          "line-dasharray": [3, 4],
        },
      });
    }
  }
  addLightPoint(position, color = "rgb(153,153,153)", circleRadius = 2) {
    if (this.map.getLayer("lightPoint")) this.map.removeLayer("lightPoint");
    if (this.map.getSource("lightPoint")) this.map.removeSource("lightPoint");
    this.map.addLayer({
      id: "lightPoint",
      type: "circle",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: position,
          },
        },
      },
      paint: {
        "circle-color": "#ffffff",
        // "circle-radius": circleRadius,
        "circle-stroke-width": circleRadius,
        "circle-stroke-color": color,
      },
    });
  }
  /**
   * position 点线面经纬度 一维数组 ||二维数组
   * color 高亮元素颜色
   * lineWidth 线属性宽度
   * circleRadius 点属性半径
   * noPaint 默认会绘制元素高亮
   */
  home(position, lineType, lineWidth = 3, color = "#ff4a4a", circleRadius = 2) {
    let type = this.makeLocation(position);
    if (type == "point") {
      this.addLightPoint(position, color, circleRadius);
    } else if (type == "line") {
      this.addLightLine(position, lineType, color, lineWidth);
    }
    // if (position instanceof Array) {
    //     if (position[0] instanceof Array) {
    //         var line = turf.lineString(position);
    //         var bbox = turf.bbox(line);
    //         var bboxPolygon = turf.bboxPolygon(bbox);
    //         var v2 = new mapboxgl.LngLatBounds(bboxPolygon.geometry.coordinates[0][0], bboxPolygon.geometry.coordinates[0][2])
    //         this.map.fitBounds(v2,{
    //             linear:false,
    //             padding: {top:60, bottom:60, left:60, right:60}
    //         });
    //             this.addLightLine(position, lineType, color, lineWidth)
    //     } else {
    //         this.map.flyTo({ center: position });
    //     }
    // } else {
    //     this.map.fitBounds([[120.38188484498045, 30.56868547578088], [119.51549097554295,30.178356987720612]],{
    //         linear:false
    //     });
    // }
  }
  /**
   * 多范围圈选，给公司定位使用
   * @param {*} features
   * @param {*} color
   * @param {*} lineWidth
   */
  addMulLightLine(features, color = "#ff4a4a", lineWidth = 1.2) {
    console.log(features);
    if (this.map.getLayer("mulLightLine")) this.map.removeLayer("mulLightLine");
    if (this.map.getSource("mulLightLine"))
      this.map.removeSource("mulLightLine");
    //https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/
    this.map.addLayer({
      id: "mulLightLine",
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-width": lineWidth,
        "line-dasharray": [4, 5],
      },
    });
  }
  /**
   * features geojson集合
   * color 高亮元素颜色
   * lineWidth 线属性宽度
   * circleRadius 点属性半径
   *
   */
  mulArea(
    position,
    features,
    nameList,
    color = "#ff4a4a",
    lineWidth = 3,
    circleRadius = 2,
    countList
  ) {
    this.makeLocation(position, false);
    var feats = [];
    var markersGemo = [];
    features.forEach((feature) => {
      let line = turf.lineString(feature[0]);
      feats.push(line);
      markersGemo.push(turf.center(line));
    });
    markersGemo.forEach((center, index) => {
      let dom = document.createElement("div");
      dom.innerHTML = `${nameList[index]}`;
      if (countList) {
        dom.innerHTML += countList[nameList[index]];
      }
      dom.style.fontSize = 18 + "px";
      dom.style.fontWeight = "bold";
      dom.style.color = "#495665";
      let option = {
        element: dom,
        anchor: "center",
      };
      this.markers.push(
        new mapboxgl.Marker(option)
          .setLngLat(center.geometry.coordinates)
          .addTo(this.map)
      );
    });

    this.addMulLightLine(feats);
  }

  /**
   * li_x25封装
   * wechat:13093037033
   */

  /**
   * 点，多点，线，多线，面，多面定位
   * @param {*} position 定位坐标
   * @param {*} reset 若不传坐标，是否定位到初始位置
   */
  makeLocation(position, reset = true) {
    let type = "";
    if (position instanceof Array && position.length !== 0) {
      if (position[0] instanceof Array) {
        let pos1 = position[0];
        var bbox = null;
        let bboxPolygon = null;
        if (pos1[0] instanceof Array) {
          let pos2 = pos1[0];
          if (pos2[0] instanceof Array) {
            var multipolygon = turf.multiPolygon(position);
            bbox = turf.bbox(multipolygon);
            bboxPolygon = turf.bboxPolygon(bbox);
            type = "multipolygon";
          } else {
            console.log(position);
            var polygon = turf.polygon(position);
            bbox = turf.bbox(polygon);
            bboxPolygon = turf.bboxPolygon(bbox);
            type = "polygon";
          }
        } else {
          var line = turf.lineString(position);
          bbox = turf.bbox(line);
          bboxPolygon = turf.bboxPolygon(bbox);
          type = "line";
        }
        var v2 = new mapboxgl.LngLatBounds(
          bboxPolygon.geometry.coordinates[0][0],
          bboxPolygon.geometry.coordinates[0][2]
        );
        this.map.fitBounds(v2, {
          linear: false,
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
        });
      } else {
        this.map.flyTo({ center: position, zoom: 15 });
        type = "point";
      }
    } else if (reset) {
      this.map.fitBounds(
        [
          [120.38188484498045, 30.56868547578088],
          [119.51549097554295, 30.178356987720612],
        ],
        {
          linear: false,
        }
      );
      type = "errPosition";
    }
    return type;
  }
  newMarker(option){
    return new mapboxgl.Marker(option || {})
  }

  /**
   * 新增标记
   * @param {*} ele 标签
   * @param {*} centerCoord 坐标
   */
  addMarker(ele, centerCoord, configure = {}, isAdd = true) {
    let option = {
      element: ele,
      anchor: "center",
      pitchAlignment: "map",
      rotationAlignment: "map",
    };
    if (centerCoord && centerCoord.length) {
      let marker = new mapboxgl.Marker(
        Object.assign(option, configure)
      ).setLngLat(centerCoord);
      isAdd && marker.addTo(this.map);
      return marker;
    }
    return new mapboxgl.Marker(option);
  }

  /**
   * 新增标记,with attribute
   * @param {*} ele 标签
   * @param {*} centerCoord 坐标
   * @param {*} configure config Marker object
   * @param {*} attrs set ele attrs
   */
  addMarkerPlus(ele, centerCoord, str = "", attrs = {}) {
    let option = {
      element: ele,
      anchor: "center",
    };
    Object.keys(attrs).forEach((k) => {
      ele.setAttribute(k, attrs[k]);
    });
    if (centerCoord.length) {
      let marker = null;
      marker = new mapboxgl.Marker(option).setLngLat(centerCoord);
      marker.setPopup(
        new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        }).setHTML(str)
      );
      marker.addTo(this.map);
      return marker;
    }
    return "error";
  }
  /**
   * generate direction
   * @param {Array} start
   * @param {Array} end
   * @returns
   */
  async getDirection(start, end) {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${this.accessToken}`,
      { method: "GET" }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
    return geojson;
  }

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
  }

  /**
   * 添加标记并显示浮窗
   * @param {Object} ele 标签
   * @param {Array} centerCoord 坐标
   * @param {Array||String} nameList 弹窗要显示的内容，以name:"",value:""对象数组的形式接受,或者以html字符串的格式接收
   * 注：切换弹窗显隐执行返回值marker.togglePopup()
   */
  addMarkerWithPopup(ele, centerCoord, nameList) {
    let option = {
      element: ele,
      anchor: "center",
    };
    let str = ``;
    if (nameList instanceof Array) {
      nameList &&
        nameList.length !== 0 &&
        nameList.forEach((item) => {
          str += `
                    <p>
                        <span style="color:#999999">${item.name}</span>
                        <span style="color:#555555">${item.value}</span>
                    </p>
                `;
        });
    } else if (typeof nameList === "string") {
      str = nameList;
    } else {
      str = `<p>mapInit方法内容输入有误</p>`;
    }
    if (centerCoord.length) {
      let marker = null;
      marker = new mapboxgl.Marker(option).setLngLat(centerCoord);
      if (str) {
        marker.setPopup(
          new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
          }).setHTML(str)
        );
      }
      marker.addTo(this.map);
      return marker;
    }
    return "error";
  }
  /**
   * 给地图添加可用图标
   * @param {String} imgSrc 图片src
   * @param {String} imgName 图片命名
   */
  addImgToMap(imgSrc, imgName) {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      this.map.addImage(imgName, img);
    };
  }

  /**
   * 添加通用地图图层(该方法仅限超图返回图层),返回根据当前url添加的所有图层
   * @param {String} url 超图提供的加在图层的服务链接
   * @param {Boolean} removeBackground 是否去除背景板
   * @param {Boolean} isBasemap 是否为底图图层，相对于专题图
   * @param {Boolean} visible 图层是否显示
   * @param {Object} 图标配置:
   *      @param {Array} Obj.iconName 图标名称数组，若输入，则根据超图数据配置将点图层转换为相应图标
   *      @param {Object} Obj.layout 图层布局，补充布局属性
   *      @param {Object} Obj.paint 图层绘制，补充绘制属性
   */
  addCommonLayer(
    url,
    { iconName, layout, paint },
    removeBackground = true,
    isBasemap = false,
    visible = true
  ) {
    let promise = new Promise(async (resolve) => {
      let res = await axios.get(url);
      let mvtStyle = res.data;
      let layerArr = [];
      if (this.map.getSource(mvtStyle.name)) return;
      // mvtStyle.sources[mvtStyle.name].tiles[0] = gisDomain + '/iserver' + mvtStyle.sources[mvtStyle.name].tiles[0].split('iserver')[1];
      this.map.addSource(mvtStyle.name, mvtStyle.sources[mvtStyle.name]);
      let baseLayers = mvtStyle.layers;
      if (removeBackground) {
        baseLayers = mvtStyle.layers.filter(
          (layer) => layer.id !== "background"
        );
      } else {
        baseLayers = mvtStyle.layers.map((layer) => {
          if (layer.type == "background") layer.source = mvtStyle.name;
          return layer;
        });
      }
      if (iconName && iconName.length) {
        let layoutObj = {
          "icon-image": iconName,
          "icon-size": ["interpolate", ["linear"], ["zoom"], 12, 0.8, 22, 1.1],
          "icon-padding": 5,
          "symbol-placement": ["step", ["zoom"], "point", 10, "point"],
          "icon-optional": true,
        };
        baseLayers.forEach((layer) => {
          if (!layer.layout || layer.layout.visibility == "visible") {
            if (layer.type == "circle") {
              layer.type = "symbol";
              layer.layout = layout
                ? Object.assign(layoutObj, layout)
                : layoutObj;
              layer.paint = paint ? Object.assign({}, paint) : {};
            }
            layer.metadata = {
              ...layer.metadata,
              isSMLayer: true,
              isBasemap: isBasemap, // 是否是底图图层
            };
            layer.layout.visibility = visible ? "visible" : "none";
            delete layer.maxzoom;
            this.map.addLayer(layer);
            //储存2d图层，供图层切换使用
            this.layer2D.push(layer);
            layerArr.push(layer);
          }
        });
      } else {
        baseLayers.forEach((layer) => {
          if (!layer.layout || layer.layout.visibility == "visible") {
            layer.metadata = {
              ...layer.metadata,
              isSMLayer: true,
              isBasemap: isBasemap, // 是否是底图图层
            };
            layer.layout.visibility = visible ? "visible" : "none";
            delete layer.maxzoom;
            this.map.addLayer(layer);
            this.layer2D.push(layer);
            layerArr.push(layer);
          }
        });
      }
      resolve(layerArr);
    });
    return promise;
  }

  /**
   * 添加3d图层（仅限超图返回图层）,返回根据当前url添加的所有图层
   * @param {String} url 超图提供的加在图层的服务链接
   * @param {Boolean} removeBackground 是否去除背景板
   * @param {Object} 图标配置:
   *      @param {Array} Obj.iconName 图标名称数组，若输入，则根据超图数据配置将点图层转换为相应图标
   *      @param {Object} Obj.layout 图层布局，补充布局属性
   *      @param {Object} Obj.paint 图层绘制，补充绘制属性
   */
  add3dLayer(url, { iconName, layout, paint }, removeBackground = true) {
    let promise = new Promise(async (resolve) => {
      let res = await axios.get(url);
      let mvtStyle = res.data;
      let layerArr = [];
      // mvtStyle.sources[mvtStyle.name].tiles[0] = gisDomain + '/iserver' + mvtStyle.sources[mvtStyle.name].tiles[0].split('iserver')[1];
      this.map.addSource(mvtStyle.name, mvtStyle.sources[mvtStyle.name]);
      let baseLayers = mvtStyle.layers;
      if (removeBackground) {
        baseLayers = mvtStyle.layers.filter(
          (layer) => layer.id !== "background"
        );
      } else {
        baseLayers = mvtStyle.layers.map((layer) => {
          if (layer.type == "background") layer.source = mvtStyle.name;
          return layer;
        });
      }
      baseLayers.forEach((layer) => {
        if (!layer.layout || layer.layout.visibility == "visible") {
          if (layer.type == "fill") {
            layer.type = "fill-extrusion";
            let paintObj = {
              "fill-extrusion-color": layer.paint["fill-color"],
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                0,
                14.5,
                ["get", "height"],
              ],
              "fill-extrusion-opacity": 1,
            };
            let layoutObj = {};
            layer.layout = layout
              ? Object.assign(layoutObj, layout)
              : layoutObj;
            layer.paint = paint ? Object.assign(paintObj, paint) : paintObj;
            this.map.addLayer(layer);
            //储存3d图层，供图层切换使用
            this.layer3D.push(layer);
            layerArr.push(layer);
          } else {
            if (!layer.layout || layer.layout.visibility == "visible") {
              this.map.addLayer(layer);
              this.layer2D.push(layer);
              layerArr.push(layer);
            }
          }
        }
      });
      resolve(layerArr);
    });
    return promise;
  }

  /**
   * 定位圈范围/画点
   * @param {Array} position 范围
   * @param {String} color 颜色
   * @param {Number} lineWidth 线粗
   * @param {Number} circleRadius 半径
   * @param {Array} boldBorder 加粗(只支持二维数组)
   * @param {Number} borderWidth
   * @param {Array} lineDasharray 虚线密度
   * @param {Boolean} isRepaint 是否重画（暂未实现）
   */
  paintingRange({
    position = [],
    color = "#ff4a4a",
    lineWidth = 3,
    circleRadius = 3,
    boldBorder,
    borderWidth = 5,
    isRepaint = true,
    lineDasharray,
  }) {
    // this.makeLocation(position);
    // if(isRepaint){
    //     this.removeRangeLayer();
    // }
    let features = [];
    if (position instanceof Array && position[0] instanceof Array) {
      let pos1 = position[0];
      if (pos1 instanceof Array) {
        position.forEach((line) => {
          let feature;
          if (getArrayGeo(line) == 2) {
            feature = turf.lineString(line);
            features.push(feature);
          } else if (getArrayGeo(line) == 3) {
            feature = turf.multiLineString(line);
            features.push(feature);
          } else if (getArrayGeo(line) == 4) {
            feature = turf.polygonToLine(turf.multiPolygon(line));
            feature.features.forEach((f) => {
              features.push(f);
            });
          }
        });
        if (boldBorder instanceof Array) {
          features = features.concat(
            turf.lineString(boldBorder, { name: "boldBorder" })
          );
          this.addRangeLayer({
            features,
            color,
            lineWidth,
            lineDasharray,
            borderWidth,
            isRepaint,
          });
        } else {
          this.addRangeLayer({
            features,
            color,
            lineWidth,
            lineDasharray,
            isRepaint,
          });
        }
      } else {
        let feature = turf.lineString(position);
        features.push(feature);
        this.addRangeLayer({
          features,
          color,
          lineWidth,
          lineDasharray,
          isRepaint,
        });
      }
    } else if (position instanceof Array && position.length !== 0) {
      let feature = turf.Point(position);
      features.push(feature);
      this.addRangeLayer({ features, color, circleRadius, isRepaint });
    } else {
      this.addRangeLayer({ features, color, isRepaint });
    }
  }
  addRangeLayer({
    features,
    color,
    lineWidth,
    lineDasharray,
    circleRadius,
    borderWidth,
    isRepaint,
  }) {
    // let that = this;
    let layerId = "rangeLayer";
    // function makeId(id = "rangeLayer"){
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
    this.map.addSource(layerId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features,
      },
    });
    if (circleRadius) {
      this.map.addLayer({
        id: layerId,
        source: layerId,
        type: "circle",
        paint: {
          "circle-radius": circleRadius,
          "circle-color": color,
        },
      });
    } else if (lineWidth) {
      this.map.addLayer({
        id: layerId,
        source: layerId,
        type: "line",
        paint: {
          "line-color": color,
          "line-width": [
            "case",
            ["==", ["get", "name"], "boldBorder"],
            borderWidth || 0,
            lineWidth,
          ],
          "line-dasharray": lineDasharray || [],
        },
      });
    }
  }
  removeRangeLayer() {
    if (this.map.getLayer("rangeLayer")) this.map.removeLayer("rangeLayer");
    if (this.map.getSource("rangeLayer")) this.map.removeSource("rangeLayer");
  }
  /**
   * 地图销毁
   */
  destoryMap() {
    this.map.remove();
    if (window.mapInit) {
      window.mapInit = null;
    }
    this.map = null;
  }

  /**
   * 树结构深度遍历
   * @param {Array} targetArr 迭代目标
   * @param {String} iterationName 迭代属性的字段名
   * @param {Array} targetNames 需要获取的字段名
   */
  iteration(targetArr = [], iterationName = "", targetNames = []) {
    let arr = [];
    let fun = function (targetArr, iterationName, targetNames) {
      targetArr.forEach((item) => {
        let obj = {};
        targetNames.forEach((targetName) => {
          obj[targetName] = item[targetName];
        });
        arr.push(obj);
        if (item[iterationName]) {
          fun(item[iterationName], iterationName, targetNames);
        }
      });
    };
    fun(targetArr, iterationName, targetNames);
    return arr;
  }

  /**
   * 图层组管理地图,增删改查
   * @param {String} name 图层组名称
   * @param {Object} layer mapbox图层
   * @param {String} layerId 目标图层id
   */
  addGroupLayer(name, layer) {
    if (layer && name) {
      let index = -1;
      if (!this.groups[name]) {
        this.groups[name] = [];
      }
      index = this.groups[name].findIndex((item) => {
        return item.id == layer.id;
      });
      if (index == -1) {
        this.groups[name].push(layer);
        this.map.addLayer(layer);
      } else {
        console.log("该图层已存在");
      }
    }
  }
  getGroupLayer(name) {
    if (name) {
      return this.groups[name] ? this.groups[name] : [];
    }
  }
  removeGroupLayer(name) {
    if (name && this.groups[name]) {
      this.groups[name].forEach((layer) => {
        if (this.map.getLayer(layer.id)) {
          this.map.removeLayer(layer.id);
        }
      });
      this.groups[name] = [];
    }
  }
  setGroupLayer(name, layerId, layer) {
    if (name && this.groups[name] && layerId) {
      let index = -1;
      index = this.groups[name].findIndex((item) => {
        return layerId == item.id;
      });
      if (index !== -1) {
        this.groups[name][index] = layer;
      } else {
        this.addGroupLayer(name, layer);
      }
    }
  }

  /**
   * 超图对象构造器
   */
  superMapParams(geometry) {
    let superMapType = type[geometry["type"]];
    let params = {
      points: [],
      type: superMapType,
    };
    toXY(geometry.coordinates);
    function toXY(coords) {
      if (coords instanceof Array && !(coords[0] instanceof Array)) {
        params.points.push({ x: coords[0], y: coords[1] });
      } else if (coords instanceof Array && coords[0] instanceof Array) {
        coords.map((item) => {
          return toXY(item);
        });
      } else {
        return {};
      }
    }
    return params;
  }
  /**
   * 超图对象解析器
   */
  deSuperMapParams(geometry) {}
}
/* eslint-enable no-console, no-unused-vars */
