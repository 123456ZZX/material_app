import swanTool from "../swanTool";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import popup from "../common/popup/pupop.vue";
import closeButton from "../common/popup/closeButton";
import Vue from "vue";

/**
 * 距离测量
 */
export default class swanDistance extends swanTool {
  constructor(map) {
    super(map);
    this.lineData = [];
    this.moveData = [];
    this.startDraw = false;
    this.popupList = [];
    this.vmList = [];
    this.lastPopup = null;
  }

  onAdd() {
    this.initMeasure();
    this.map.on("click", this.addLine)
    this.map.on("mousemove", this.addMoveLine)
    this.map.on("dblclick", this.stopAdd)
  }

  initMeasure() {
    this.popupList.forEach(item => {
      item.remove()
    })
    this.lastPopup && this.lastPopup.remove()
    this.lineData = [{
      "type": "Feature",
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [[]]
      }
    }]
    this.map.getCanvas().style.cursor = "crosshair";
    !this.map.getSource("distance") && this.map.addSource("distance", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      },
    })
    !this.map.getLayer("distance") && this.map.addLayer({
      "id": "distance",
      "source": "distance",
      "type": "line",
      "paint": { // 绘制类属性
        "line-opacity": 1, // 线的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
        "line-color": "#06CEAE", // 线的颜色（可选，默认值为 #000000。如果设置了 line-pattern，则 line-color 将无效）
        "line-width": 2, // 线的宽度（可选，值 >= 0，默认值为 1，单位：像素）
      }
    })
    !this.map.getLayer("distance_cap") && this.map.addLayer({
      "id": "distance_cap",
      "source": "distance",
      "type": "circle",
      "paint": { // 绘制类属性
        "circle-opacity": 1, // 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
        "circle-radius": 6, // 圆点的半径（可选，值 >= 0，默认值为 5，单位：像素）
        "circle-color": "#FFFF00", // 圆点的颜色（可选，默认值为 #000000）
      }
    })
  }

  addLine = (e) => {
    this.startDraw = true
    this.lineData[0].geometry.coordinates[0].push([e.lngLat.lng, e.lngLat.lat]);
    let arr = this.lineData[0].geometry.coordinates[0]
    if (arr.length > 1) {
      let distance = this.getDistance([arr[arr.length - 1], arr[arr.length - 2]])
      let displayText = [{
        key: "长度:",
        value: distance
      }]
      let popupV = Vue.extend(popup);
      let popupDom = new popupV({
        propsData: { displayText }
      }).$mount();
      this.vmList.push(popupDom);
      this.popupList.push(
        new mapboxgl.Popup({
          offset: {
            'top': [0, 22],
          },
          closeButton: false,//如果为 true ，弹窗右上角将出现关闭按钮。
          closeOnClick: false, //如果为 true ，点击地图时弹窗将关闭。
          className: 'swan-popup'
        })
          .setLngLat(e.lngLat)
          .setDOMContent(popupDom.$el)
          .addTo(this.map)
      )
    }
    let geojson = {
      "type": "FeatureCollection",
      "features": this.lineData
    };
    this.map.getSource("distance").setData(geojson);
  }

  addMoveLine = (e) => {
    if (!this.startDraw)
      return
    this.moveData = [{
      "type": "Feature",
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [[]]
      }
    }]
    this.moveData[0].geometry.coordinates[0] = [
      ...this.lineData[0].geometry.coordinates[0],
      [e.lngLat.lng, e.lngLat.lat]
    ]
    let geojson = {
      "type": "FeatureCollection",
      "features": this.moveData
    };
    this.map.getSource("distance").setData(geojson);

    this.lastPopup && this.lastPopup.remove()
    let distance = this.getDistance(this.moveData[0].geometry.coordinates[0])
    let displayText = [{
      key: "总长度:",
      value: distance
    }]
    let popupV = Vue.extend(popup);
    let popupDom = new popupV({
      propsData: { displayText }
    }).$mount();
    this.vmList.push(popupDom);
    this.lastPopup = new mapboxgl.Popup({
      offset: {
        'top': [0, 22],
      },
      closeButton: false,//如果为 true ，弹窗右上角将出现关闭按钮。
      closeOnClick: false, //如果为 true ，点击地图时弹窗将关闭。
      className: 'swan-popup'
    })
      .setLngLat(e.lngLat)
      .setDOMContent(popupDom.$el)
      .addTo(this.map)
  }

  getDistance(lineList) {
    let line = turf.lineString(lineList);
    let length = turf.length(line, { units: 'kilometers' });
    if (length < 1) {
      return `${(length * 1000).toFixed(1)}M`
    } else {
      return `${length.toFixed(2)}KM`
    }
  }

  stopAdd = () => {
    if (!this.startDraw)
      return
    this.clearListener()
    if (this.moveData[0].geometry.coordinates[0].length - 1 == this.popupList.length) {
      this.popupList[this.popupList.length - 1].remove()
    }
    // closeButton
    //添加关闭按钮
    let popupClose = Vue.extend(closeButton);
    let popupCloseDom = new popupClose({}).$mount();
    popupCloseDom.$on("close", () => {
      this.onCancel();
    })
    this.vmList.push(popupCloseDom);
    let geom = this.moveData[0].geometry.coordinates[0]
    this.popupList.push(
      new mapboxgl.Popup({
        offset: {
          'bottom': [0, 40],
        },
        closeButton: false,//如果为 true ，弹窗右上角将出现关闭按钮。
        closeOnClick: false, //如果为 true ，点击地图时弹窗将关闭。
        className: 'swan-popup-close'
      })
        .setLngLat(geom[geom.length - 1])
        .setDOMContent(popupCloseDom.$el)
        .addTo(this.map)
    )
  }

  clearListener() {
    this.startDraw = false
    this.map.getCanvas().style.cursor = "";
    this.map.off("click", this.addLine)
    this.map.off("mousemove", this.addLastPoint)
    this.map.off("dblclick", this.stopAdd)
  }

  onCancel() {
    this.clearListener()
    this.popupList.forEach(item => {
      item.remove()
    })
    this.vmList.forEach(item => {
      item.$destroy();
    })
    this.lastPopup && this.lastPopup.remove()
    this.map.getLayer("distance") && this.map.removeLayer("distance");
    this.map.getLayer("distance_cap") && this.map.removeLayer("distance_cap");
    this.map.getSource("distance") && this.map.removeSource("distance");
  }
}