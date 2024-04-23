import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Vue from "vue";
import closeButton from "../common/popup/closeButton";
import popup from "../common/popup/pupop.vue";
import swanTool from "../swanTool";

/**
 * 面积测量
 */
export default class swanArea extends swanTool {
  constructor(map) {
    super(map);
    this.polygonData = [];
    this.moveData = [];
    this.startDraw = false;
    this.popupList = [];
    this.vmList = [];
    this.lastPopup = null;
  }

  onAdd() {
    this.initMeasure();
    this.map.on("click", this.addPolygon)
    this.map.on("mousemove", this.addMovePolygon)
    this.map.on("dblclick", this.stopAdd)
  }

  initMeasure() {
    this.popupList.forEach(item => {
      item.remove()
    })
    this.lastPopup && this.lastPopup.remove()
    this.polygonData = [{
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[]]
      }
    }]
    this.map.getCanvas().style.cursor = "crosshair";
    !this.map.getSource("polygon") && this.map.addSource("polygon", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      },
      "maxzoom": 12 //当以更高的缩放级别显示地图时，将使用来自最大缩放的瓦片的数据
    })
    !this.map.getLayer("polygon") && this.map.addLayer({
      "id": "polygon",
      "source": "polygon",
      "type": "fill",
      "paint": { // 绘制类属性
        "fill-antialias": true, // 填充时是否反锯齿（可选，默认值为 true）
        "fill-opacity": 0.1, // 填充的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
        "fill-color": "#FFFF00", // 填充的颜色（可选，默认值为 #000000。如果设置了 fill-pattern，则 fill-color 将无效）
        "fill-outline-color": "#06CEAE",
      }
    })
    !this.map.getLayer("polygon_cap") && this.map.addLayer({
      "id": "polygon_cap",
      "source": "polygon",
      "type": "circle",
      "paint": { // 绘制类属性
        "circle-opacity": 1, // 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
        "circle-radius": 4, // 圆点的半径（可选，值 >= 0，默认值为 5，单位：像素）
        "circle-color": "#FFFF00", // 圆点的颜色（可选，默认值为 #000000）
      }
    })
  }

  addPolygon = (e) => {
    this.startDraw = true
    this.polygonData[0].geometry.coordinates[0].push([e.lngLat.lng, e.lngLat.lat]);
    let geojson = {
      "type": "FeatureCollection",
      "features": this.polygonData
    };
    this.map.getSource("polygon").setData(geojson);
  }

  addMovePolygon = (e) => {
    if (!this.startDraw) return
    this.moveData = [{
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[]]
      }
    }]
    this.moveData[0].geometry.coordinates[0] = [
      ...this.polygonData[0].geometry.coordinates[0],
      [e.lngLat.lng, e.lngLat.lat]
    ]
    let geojson = {
      "type": "FeatureCollection",
      "features": this.moveData
    };
    this.map.getSource("polygon").setData(geojson);

    this.lastPopup && this.lastPopup.remove()
    if (this.moveData[0].geometry.coordinates[0].length < 4) return
    let area = this.getArea(this.moveData[0].geometry.coordinates[0])
    let displayText = [{
      key: "面积:",
      value: area
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

  getArea(areaList) {
    let polygon = turf.polygon([[...areaList, areaList[0]]]);
    let area = turf.area(polygon);
    if (area < 1000000) {
      return `${area.toFixed(2)}㎡`
    } else {
      return `${(area / 1000000).toFixed(2)}k㎡`
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
    this.map.off("click", this.addPolygon)
    this.map.off("mousemove", this.addMovePolygon)
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
    this.map.getLayer("polygon") && this.map.removeLayer("polygon");
    this.map.getLayer("polygon_cap") && this.map.removeLayer("polygon_cap");
    this.map.getSource("polygon") && this.map.removeSource("polygon");
  }
}