<template>
    <div class="main">
        <fm-nav-bar title="缺陷管理" left-arrow @click-left="$router.go(-1)" @click-right="clickPlus">
            <template #right>
                <i class="fm-icon fm-icon-plus"></i>
            </template>
        </fm-nav-bar>
        <div class="mapContainer">
            <xa-map :create="mapLoaded"></xa-map>
        </div>

        <!-- <div v-if="!isAdd && !isDetail" class="flaws-list-container">
            <div class="tableList">
                <div class="con-div" v-for="(item, index) in tableList" :key="index">
                    <div class="top">
                        <div class="name">
                            {{ item.deviceName.length > 0 ? getZHCN(item.deviceName[0]) : '' }}
                            {{ item.deviceName.length > 1 ? getZHCN(item.deviceName) : '' }}
                        </div>
                        <div :class="item.state == '已完成' ? 'state c1' : item.state == '处理中' ? 'state c2' : 'state c3'">
                            {{ item.state }}</div>
                        <img class="img" src="./img/gps.png" @click="toTarget(item.lnglat)" />
                    </div>
                    <div @click="enterDetail(item.id)">
                        <div class="content">
                            缺陷类型 {{ getZHCN(item.flawsName) }}
                        </div>
                        <div class="content">
                            现场情况 {{ item.content }}
                        </div>
                    </div>

                    <div class="under">
                        <div class="under-div"><i class="fm-icon fm-icon-contact"></i>{{ item.people }}</div>
                        <div class="under-div"><i class="fm-icon fm-icon-down"></i>
                            {{ getZHCN(item.flawsFrom) }}</div>
                        <div class="under-div"><i class="fm-icon fm-icon-underway-o"></i>{{ item.time }}</div>
                    </div>
                </div>
            </div>
        </div> -->
        <listFlaws :tableList="tableList" @toTarget="toTarget"></listFlaws>

        <!-- <div v-show="isAdd && !isDetail" class="add-container">
            <fm-nav-bar title="缺陷新增" left-arrow @click-left="isAdd = false;">
            </fm-nav-bar>
            <fm-form class="bigForm-container" @submit="onSubmit" @failed="onFailed">
                <fm-field readonly clickable required name="picker" :value="commonForm.defectFrom" label="缺陷来源"
                    placeholder="缺陷来源" suffix-icon="arrow" @click="choosePicker('缺陷来源')"
                    :rules="[{ required: true, message: '请填写缺陷来源' }]" input-align="right" />
                <fm-field readonly clickable required name="picker" :value="commonForm.bigType" label="业务类型"
                    placeholder="业务类型" suffix-icon="arrow" @click="choosePicker('业务类型')"
                    :rules="[{ required: true, message: '请填写业务类型' }]" input-align="right" />
                <fm-field readonly clickable required name="picker" :value="commonForm.smallType" label="设施类型"
                    placeholder="设施类型" suffix-icon="arrow" @click="choosePicker('设施类型')"
                    :rules="[{ required: true, message: '请填写设施类型' }]" input-align="right" />

                <fm-popup :visible.sync="showPicker" position="bottom">
                    <fm-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
                </fm-popup>

                <fm-field clearable v-model="commonForm.smallCode" name="input" label="设施编号" placeholder="设施编号"
                    input-align="right" />
                <fm-field v-model="commonForm.position" name="input" label="缺陷位置" placeholder="缺陷位置"
                    input-align="right" />
                <div class="subtable" v-for="(item, index) in subForms" :key="item.id">
                    <img src="./img/link.png" alt="" style="position: absolute;height: 34px;z-index: 2;top: -18px">
                    <img src="./img/link.png" alt=""
                        style="position: absolute;height: 34px;z-index: 2;float: right;right: 5px; top: -18px">
                    <fm-form>
                        <fm-field v-model="item.defectType" readonly clickable name="picker" label="缺陷类型"
                            suffix-icon="arrow" placeholder="缺陷类型" @click="showPickerDefect = true" input-align="right">
                        </fm-field>
                        <fm-popup :visible.sync="showPickerDefect" position="bottom">
                            <fm-picker show-toolbar :columns="defectTypeList"
                                @confirm="(val) => { item.defectType = val; showPickerDefect = false }"
                                @cancel="showPickerDefect = false" />
                        </fm-popup>

                        <fm-field v-model="item.note" name="input" label="备注" placeholder="备注" input-align="right">
                        </fm-field>
                        <uploader :wpgHeader="wpgHeader" label="照片" v-model="picUp" ref="picUp"
                            @fileChange="(recall) => fileChange(recall, '', item.pic)" style="width: 100%;">
                        </uploader>
                    </fm-form>
                </div>
                <fm-button native-type="button" type="default" icon="plus" size="large" @click="addRow"
                    style="margin-left: 8px;width:96%">新增缺陷
                </fm-button>
                <fm-field v-model="commonForm.describe" name="input" label="现场描述" placeholder="现场描述" type="textarea"
                    rows="2" autosize maxlength="200" show-word-limit input-align="right" />

                <uploader :wpgHeader="wpgHeader" label="多媒体附件" v-model="attachment" ref="attachment"
                    @fileChange="(recall) => fileChange(recall, '公共')" style="width: 100%;">
                </uploader>


                <fm-field readonly v-model="upPerson" name="input" label="上报人" placeholder="上报人" input-align="right" />
                <fm-field readonly v-model="upTime" name="input" label="上报时间" placeholder="上报时间" input-align="right" />
                <div style="margin-top:10px;display:flex;justify-content: space-around;">
                    <fm-button type="default" @click="concle" native-type="button">取消</fm-button>
                    <fm-button type="primary" :disabled="subForms.length < 1" native-type="submit">提交</fm-button>
                </div>
            </fm-form>
        </div> -->
        <!-- <div v-if="isDetail " class="detail-container">
            <fm-nav-bar title="缺陷详情" left-arrow @click-left="isDetail = false"></fm-nav-bar>
            <iframe id="form_frame" class="formFrame" name="form_frame" :src="formURL" />
        </div> -->
    </div>
</template>
<script>
import listFlaws from './listFlaws'
import { addIconToMap } from '@/utils/mapUtils'
import { ENUM } from '@/store/State/stateTypes'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapStyle from './mapStyle';
import { Toast } from 'fawkes-mobile-lib';
import Uploader from './upload/Uploader';
import fileUpload from '@/components/fileUpload/index.vue';
import axios from 'axios'
import popup from './popup'
import Vue from 'vue'
var myInterval
const popupItem = Vue.extend(popup)
const MapObj = {
    map: null,
    //   viewer: null,
    //   popupItem: '', // mapbox气泡框
    //   marker: '',
    //   monitorPopups: [],
    //   monitorPopupContent: [],
    //   eventPopupArray: [],// 事件点popup集合
}
export default {
    name: "flawsManagement",
    components: { Uploader, fileUpload, listFlaws },
    // components: {Uploader},
    data() {
        return {
            // 列表相关
            tableData: [],
            total: 0,
            tableList: [],
            objInfo: {},// 地图点选的信息
            chosePoint: false,//点选，弹popup
            // wpg接口与页面显隐
            wpgHeader: {},//上传相关
            accessToken: this.$storage.get('access_token'),
            formToken: '',//详情页URL所需token
            formURL: '',//详情页URL
            icons: [
                {
                    name: '事件点',
                    url: require('@/assets/img/map/dw.png'),
                },
            ],
        };
    },
    computed: {
        defectFromDic() {
            console.log('this.$store.state[ENUM].defectFrom: ', this.$store.state[ENUM].defectFrom);
            return this.$store.state[ENUM].defectFrom;

        },
        faultTypesDic() {
            console.log('this.$store.state[ENUM].faultTypes: ', this.$store.state[ENUM].faultTypes);
            return this.$store.state[ENUM].faultTypes;
        },
        // 系统字典虽叫defectType，但实际二级为 业务类型/设施类型
        // 业务类型/设施类型
        busDeviceTypeDic() {
            console.log('this.$store.state[ENUM].defectType: ', this.$store.state[ENUM].defectType);
            return this.$store.state[ENUM].defectType;

        },
        // getZHCN() {
        //     return (val) => {
        //         try {
        //             let result = val
        //             // 翻译二级字典 业务类型/设施类型中  二级字段---设施类型
        //             if (val instanceof Array) {
        //                 if (this.busDeviceTypeDic.length > 0) {
        //                     this.busDeviceTypeDic.forEach(element => {
        //                         if (val[0] == element.code || val[0] == element['zh-CN']) {
        //                             element.child.forEach(second => {
        //                                 result = val[1]
        //                                 if (val[1] == second.code || val[1] == second['zh-CN']) {
        //                                     result = second['zh-CN']
        //                                 }
        //                             })
        //                         }
        //                     });
        //                 }
        //             } else {
        //                 if (this.faultTypesDic.length > 0) {
        //                     this.faultTypesDic.forEach((dic) => {
        //                         if (val == dic.code || val == dic['zh-CN']) {
        //                             result = dic['zh-CN']
        //                         }
        //                     })
        //                 }
        //                 if (this.defectFromDic.length > 0) {
        //                     this.defectFromDic.forEach((dic) => {
        //                         if (val == dic.code || val == dic['zh-CN']) {
        //                             result = dic['zh-CN']
        //                         }
        //                     })
        //                 }
        //                 if (this.busDeviceTypeDic.length > 0) {
        //                     this.busDeviceTypeDic.forEach((dic) => {
        //                         if (val == dic.code || val == dic['ch-CN']) {
        //                             result = dic['zh-CN']
        //                         }
        //                     })
        //                 }
        //             }
        //             return result
        //         } catch (error) {
        //             console.log('error: ', error);
        //         }
        //     }
        // }
    },
    mounted() {
        // this.initMap()
        this.getwpgHeader() //  获取header，提交工单用; 同时获取 tableData
    },
    beforeDestroy() {

    },
    methods: {

        // 表单接口相关---获取 tableData、提交工单
        // 获取header，提交工单用; 同时获取 tableData
        async getwpgHeader() {
            axios({
                url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
                method: 'post',
                params: {
                    token: this.accessToken
                },
                headers: {
                    'Authorization': 'Basic b3V0d29yazp3cGcyMDIw'
                }
            }).then(res => {
                console.log('wpgHeader6666-res: ', res);
                if (res.status == 200) {
                    this.formToken = res.data.resultData.token
                    this.wpgHeader = {
                        "Authorization": "Bearer " + this.formToken
                    }
                    console.log(' this.wpgHeader : ', this.wpgHeader);
                    this.getTableData()
                }
            })
        },
        // 列表相关
        async getTableData() {
            // 获取 tableData
            let params = {
                "sysCode": "outwork",
                "smallType": "defect",
                "page": {
                    "current": 1,
                    "size": 50,//-1查全部
                }
            }
            axios({
                url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',
                method: 'post',
                data: params,
                headers: this.wpgHeader,
            }).then(res => {
                console.log('getTableData-res: ', res);
                if (res.status == 200) {
                    this.tableData = res.data.resultData.records
                    this.getGeoJson()
                    this.total = res.data.resultData.total;
                    console.log('this.tableData: ', this.tableData);
                    this.tableData.forEach((td) => {
                        let item = {
                            id: td.id,
                            deviceName: td.formValue.deviceType || td.formValue.device_type || [],
                            // flawsName: td.formValue.faultTypes,
                            flawsName: td.formValue.detail?.defectType || td.formValue.faultTypes || '',
                            state: td.ticketStatusName,
                            content: td.formValue.questionDescribe,
                            people: td.createByName,
                            time: td.createTime.slice(0, 10),
                            flawsFrom: td.formValue.defectFrom,
                            lnglat: [td.formValue.deviceDetail?.longitude, td.formValue.deviceDetail?.latitude] || [td.appealLng, td.appealLat],
                        }
                        this.tableList.push(item)

                    })
                    this.$emit('tableList', this.tableList)
                    console.log('this.tableList: ', this.tableList);
                }
            })
        },
        // 将事件列表添加至地图
        getGeoJson() {
            let features = []
            let withoutPositionCount = 0
            console.log('要聚合展示的tableData', this.tableData)
            if (this.tableData.length == 0) {
                this.removeSomeLayer()
                return
            }
            this.tableData.forEach((item) => {
                let feature = {}
                let properties = {}
                let geometry = {}

                properties = item
                properties.defectFrom = item.formValue.defectFrom
                feature.properties = properties
                feature.type = 'Feature'
                geometry.type = 'Point'
                if (item.appealLat && item.appealLng) {
                    // geometry.coordinates = [item.appealLat, item.appealLon]
                    geometry.coordinates = [item.appealLng, item.appealLat] // wgs84
                    feature.geometry = geometry
                    features.push(feature)
                } else if (
                    item.formValue.deviceDetail?.latitude &&
                    item.formValue.deviceDetail?.longitude
                ) {
                    geometry.coordinates = [
                        item.formValue.deviceDetail.longitude,
                        item.formValue.deviceDetail.latitude,
                    ]
                    feature.geometry = geometry
                    features.push(feature)
                } else if (
                    item.formValue.ticketAddress?.longitude &&
                    item.formValue.ticketAddress?.latitude
                ) {
                    geometry.coordinates = [
                        item.formValue.ticketAddress.longitude,
                        item.formValue.ticketAddress.latitude,
                    ]
                    feature.geometry = geometry
                    features.push(feature)
                } else {
                    // geometry.coordinates = [39.06683064435245, 115.9453947097063]
                    withoutPositionCount += 1
                }
            })
            console.log('无坐标个数', withoutPositionCount)
            // 聚合数据 构造头部
            let geoJson = {
                type: 'FeatureCollection',
                crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
                features: [],
            }
            geoJson.features = features
            console.log('聚合的geoJson', geoJson)
            this.renderCluster(geoJson)
        },
        removeSomeLayer() {
            ['clusters', 'cluster-count', 'unclustered-point'].forEach((item) => {
                if (MapObj.map?.getLayer(item)) {
                    MapObj.map.removeLayer(item)
                }
            })
            if (MapObj.map?.getSource('earthquakes')) {
                MapObj.map.removeSource('earthquakes')
            }
        },
        // 渲染
        renderCluster(geoJsonSource) {
            this.removeSomeLayer()
            MapObj.map.addSource('earthquakes', {
                type: 'geojson',
                data: geoJsonSource,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
            })

            MapObj.map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'earthquakes',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': ['step', ['get', 'point_count'], "rgba(0, 209, 134, 0.8)", 5, "rgba(255, 148, 41, 0.8)", 15, "rgba(255, 74, 65, 0.8)"],
                    'circle-radius': ['step', ['get', 'point_count'], 20, 5, 25, 15, 30],
                    // 这个是外边框的颜色 circle-stroke-color这个对应了上面circle-color
                    "circle-stroke-color": [
                        "step",
                        ["get", "point_count"],
                        "rgba(0, 209, 134, 0.3)",
                        5,
                        "rgba(255, 148, 41, 0.3)",
                        15,
                        "rgba(255, 74, 65, 0.3)"
                    ],
                    // 这个是外边框晕染的范围
                    "circle-stroke-width": [
                        "step",
                        ["get", "point_count"],
                        8, //蓝色晕染长度，当点数小于100时为5px晕染
                        5, //对应上面circle-color 数字，意思为100以内
                        12, //点计数在100到750之间时为黄色，6px晕染
                        15, //对应上面circle-color 数字，意思为750以内
                        15 //点计数大于或等于750时为7px像素的粉红色晕染
                    ]
                },
            })

            MapObj.map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'earthquakes',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    // 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                },
            })

            MapObj.map.addLayer({
                id: 'unclustered-point',
                source: 'earthquakes',
                filter: ['!', ['has', 'point_count']],
                type: 'symbol',
                layout: {
                    'icon-image': '事件点', // 点的图标
                    visibility: 'visible',
                    'icon-size': 0.7,
                },
            })

            let defectFromDic = this.$store.state[ENUM].defectFrom
            let that = this
            MapObj.map.on('click', 'unclustered-point', (e) => {
                // 如果当前事件点所有popup为打开状态，即事件点popup数组长度不为0，退出该次点击事件
                // if (MapObj.eventPopupArray.length > 0) return
                // 每次点击新的事件点就清除预案数据
                // this.fileList = []
                console.log('e.features: ', e.features)
                // console.log('formValue: ', JSON.parse(e.features[0].properties.formValue))
                MapObj.map.getCanvas().style.cursor = 'pointer'

                let formValue = JSON.parse(e.features[0].properties.formValue)
                console.log('formValue: ', formValue)

                var coordinates = e.features[0].geometry.coordinates.slice()
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }
                // Create a popup, but don't add it to the map yet.
                this.popup1 = new mapboxgl.Popup({
                    closeOnClick: true,
                    closeButton: false,
                    anchor: 'bottom',
                    offset: { bottom: [0, -15] },
                })
                let text = formValue.detail ? formValue.detail.defectType : '其他'
                console.log('text: ', text);
                this.popup1
                    .setLngLat(coordinates)
                    .setHTML('<div id="vue-popup-custom" class="vue-popup-custom"><h3>'
                        + text
                        + '</h3></div>')
                    .addTo(MapObj.map)
            })

            // inspect a cluster on click
            MapObj.map.on('click', 'clusters', function (e) {
                var features = MapObj.map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
                var clusterId = features[0].properties.cluster_id
                MapObj.map
                    .getSource('earthquakes')
                    .getClusterExpansionZoom(clusterId, function (err, zoom) {
                        if (err) return
                        MapObj.map.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom,
                        })
                    })
            })
            MapObj.map.setMinZoom(0)
            MapObj.map.setMaxZoom(30)
        },

        // 地图相关
        toTarget(lnglat) {
            if (lnglat.length == 2) {
                MapObj.map.flyTo({
                    center: lnglat,
                    zoom: 19,
                })
            } else {
                console.log("无位置信息")
            }
        },
        // 开始点选
        clickPlus() {
            this.objInfo = {}
            Toast({
                message: '地图点选',
                position: 'top',
            });
            this.chosePoint = true
        },
        // 点选要素回填信息
        enterAdd() {
            // this.isAdd = true//进入表单页
            console.log("选点后进入表单页时的this.objInfo:", this.objInfo)
            // // 回填信息
            // this.commonForm.bigType = this.objInfo.bigType || ''
            // this.commonForm.smallType = this.objInfo.smallType || ''
            // this.commonForm.smallCode = this.objInfo.code || ''
            // this.commonForm.position = this.objInfo.road_name || [this.objInfo.lng.toFixed(3), this.objInfo.lat.toFixed(3)].toString()
            // // 提交表单用的，不回填显示
            // this.commonForm.lng = this.objInfo.lng
            // this.commonForm.lat = this.objInfo.lat
            // this.commonForm.properties = this.objInfo.properties
            this.$router.push({
                name: 'addFlaws',
                query: { msg: this.objInfo, token: this.formToken },
                params: { type: 'add' },
            })
        },
        // initMap() {
        //     mapboxgl.accessToken = "pk.eyJ1IjoiOTM0MDk0Mjg2IiwiYSI6ImNsMnNmdmVrZDBrZGMzZG50cHJudXJkbW8ifQ.C0wKhJgrToFJgL8GH5M8rg";
        //     window.xaMap = new mapboxgl.Map({
        //         container: 'mapContainer',// 容器DOM id
        //         style: mapStyle,
        //         center: [115.92486101369428, 39.06075549589073],
        //         zoom: 13,
        //         minZoom: 10,
        //         pitch: 0,
        //     });
        //     // let needLayers=[]
        //     // 加图层 http://172.20.79.65/api/swan/mapWorkshopSource/detail?id=1544640278559821826
        //     axios.get(process.env.VUE_APP_BASE_URL + '/swan/mapWorkshopSource/detail?id=1548573412963749889').then(res => {
        //         // axios.get('http://xasw.hdec.com/api/swan/mapWorkshopSource/detail?id=1548573412963749889').then(res => {
        //         // axios.get(process.env.VUE_APP_MAP_REQUEST_URL+'/api/swan/mapWorkshopSource/detail?id=1548573412963749889').then(res => {
        //         console.log('res: ', res);
        //         let layers = JSON.parse(res.data.data.jsonData)
        //         console.log('layers: ', layers);
        //         Object.keys(layers.sources).forEach(key => {
        //             window.xaMap.addSource(key, layers.sources[key])
        //         })
        //         // needLayers=layers.layers
        //         layers.layers.forEach(layer => {
        //             // console.log('77777777777777777777777', layer);
        //             window.xaMap.addLayer(layer);
        //             window.xaMap.setLayoutProperty(layer.id, 'visibility', 'visible')
        //             // window.xaMap.on("click", layer.id, this.handleMonitorClick);
        //             // window.xaMap.on("mouseenter", layer.id, this.handleMonitorEnter);
        //             // window.xaMap.on("mouseout", layer.id, this.handleMonitorLeave);
        //         })
        //     }).catch(e => { }).finally(() => { });
        //     // 监听地图点击
        //     // window.xaMap.on("click", function(e)  {})
        //     // window.xaMap.on("click", layer.id,function(e)  {})//才能选到features???,就拿到过一次

        //     window.xaMap.on("click", (e) => {
        //         // 若为functio(e){ this是this.window.xaMap}
        //         // (e)=>{ this是this}
        //         console.log("map-click-e", e)
        //         console.log("e.lngLatn", e.lngLat)
        //         var bbox = [
        //             [e.point.x - 1, e.point.y - 1],
        //             [e.point.x + 1, e.point.y + 1]
        //         ];
        //         console.log("bbox:", bbox)
        //         // mapbox 返回查询要素的图层属性
        //         let queryfeatures = window.xaMap.queryRenderedFeatures(bbox, {
        //             layers: ["rd_map_drainpipe_ys_big", "rd_map_drainpipe_ys_small", "rd_map_drainpipe_ws_small", "rd_map_drainpipe_ws_big",
        //                 "rd_map_outfall", "rd_map_gate", "rd_map_manhole", "rd_map_comb",
        //                 "map_supply_firehydrant", "map_supply_valve",
        //                 "map_supply_pipe_distribute", "map_supply_pipe_delivery", "map_supply_pipe_circulating",
        //                 "map_supply_node_distribute", "map_supply_node_delivery", "map_supply_node_circulating",
        //                 "map_recycle_pipe", "map_recycle_node", "map_waterwork"]
        //             // layers: layers
        //         });
        //         console.log("点选(微矩形)查询到的queryfeatures:", queryfeatures)
        //         // console.log("点选(微矩形)查询的queryfeatures:", queryfeatures.properties)
        //         // this.hightLight(queryfeatures)// 高亮表格记录，并高亮地图要素
        //         this.objInfo = {}//先置空再赋值
        //         // 点击位置的经纬度
        //         this.objInfo.lng = e.lngLat.lng
        //         this.objInfo.lat = e.lngLat.lat
        //         if (queryfeatures.length > 0) {
        //             // queryfeatures.forEach(f => {
        //             let f = queryfeatures[0]
        //             console.log('ffff: ', f);
        //             // 点击要素的经纬度，有的话覆盖掉点击位置经纬度
        //             this.objInfo.lng = f.properties.longitude || this.objInfo.lng
        //             this.objInfo.lat = f.properties.latitude || this.objInfo.lat
        //             // 要素所在图层ID和属性信息
        //             this.objInfo.layerID = f.layer.id
        //             this.objInfo.layerType = f.layer.type
        //             this.objInfo.properties = f.properties
        //             // 底图要素name_local或设施要素road_name,id
        //             this.objInfo.name_local = f.properties.name_local
        //             this.objInfo.road_name = f.properties.road_name
        //             this.objInfo.id = f.properties.id
        //             // 要素对象类型（业务类型/设施类型）
        //             objInfo.bigType = ''
        //             objInfo.smallType = ''
        //             switch (f.layer.id) {
        //                 // 雨水
        //                 case "rd_map_comb"://comb一定是雨水口
        //                     objInfo.bigType = '雨水'
        //                     objInfo.smallType = '雨水口'
        //                     break
        //                 case "rd_map_outfall"://排放口 1-雨水； 2-污水； 3-合流； 4-其他
        //                     objInfo.bigType = f.properties.pipe_type
        //                     objInfo.smallType = '排放口'
        //                     break
        //                 case "rd_map_manhole"://检查井  1-雨水；2-污水
        //                     objInfo.bigType = f.properties.manhole_type
        //                     objInfo.smallType = f.properties.manhole_type == "雨水" ? '雨水检查井' : '污水检查井'
        //                     break
        //                 case "rd_map_gate"://闸门 1-雨水； 2-污水； 3-合流； 4-其他
        //                     objInfo.bigType = f.properties.pipe_type
        //                     // objInfo.smallType = '闸门'
        //                     objInfo.smallType = f.properties.pipe_type == "雨水" ? '其他（雨）' : '其他（污）'
        //                     break
        //                 case "rd_map_drainpipe_ys_big":
        //                     objInfo.bigType = '雨水'
        //                     objInfo.smallType = '雨水管渠'
        //                     break
        //                 case "rd_map_drainpipe_ys_small":
        //                     objInfo.bigType = '雨水'
        //                     objInfo.smallType = '雨水管渠'
        //                     break
        //                 // 污水
        //                 case "rd_map_drainpipe_ws_big":
        //                     objInfo.bigType = '污水'
        //                     objInfo.smallType = '污水管道'
        //                     break
        //                 case "rd_map_drainpipe_ws_small":
        //                     objInfo.bigType = '污水'
        //                     objInfo.smallType = '污水管道'
        //                     break
        //                 // 供水
        //                 case "map_supply_firehydrant"://消火栓一定是供水
        //                     objInfo.bigType = '供水'
        //                     objInfo.smallType = '消防栓'
        //                     break
        //                 case "map_supply_valve"://阀门valve一定是供水
        //                     objInfo.bigType = '供水'
        //                     objInfo.smallType = '阀门'
        //                     break
        //                 case "map_supply_pipe_distribute"://配水管线
        //                     objInfo.bigType = '供水'
        //                     objInfo.smallType = '供水管道'
        //                     break
        //                 case "map_supply_pipe_delivery"://输水管线
        //                     objInfo.bigType = 'supply'
        //                     objInfo.smallType = '供水管道'
        //                     break
        //                 case "map_supply_pipe_circulating"://回水管线
        //                     objInfo.bigType = '供水'
        //                     objInfo.smallType = '供水管道'
        //                     break
        //                 // case "map_supply_node_distribute":
        //                 //     objInfo.bigType = '供水'
        //                 //     objInfo.smallType = 
        //                 //     break
        //                 case "map_supply_node_delivery":
        //                     objInfo.bigType = '供水'
        //                     objInfo.smallType = f.properties.appurtenance == "消防井" ? "消防栓" : f.properties.appurtenance == "排气阀" ? "阀门" : '其他（供）'
        //                     break
        //                 // case "map_supply_node_circulating": 
        //                 //     objInfo.bigType = '供水'
        //                 //     objInfo.smallType = 
        //                 //     break
        //                 case "map_waterwork"://供水厂
        //                     objInfo.bigType = '供水'
        //                     objInfo.smallType = '其他（供）'
        //                     break
        //                 // 再生水
        //                 case "map_recycle_pipe"://再生水管线
        //                     objInfo.bigType = '再生水'
        //                     objInfo.smallType = '再生水管道'
        //                     break
        //                 case "map_waterwork"://再生水厂
        //                     objInfo.bigType = '再生水'
        //                     objInfo.smallType = '其他（再）'
        //                     break
        //             }
        //             // 设施编号
        //             objInfo.code = f.properties.start_code && f.properties.end_code ? (f.properties.start_code + ',' + f.properties.end_code) : ''
        //                 || f.properties.manhole_code || f.properties.gate_code || f.properties.outlet_code
        //                 || f.properties.comb_code || f.properties.valve_code || f.properties.pump_station_code
        //                 || f.properties.plant_code || f.properties.pump_code || f.properties.fire_cock_code
        //                 || f.properties.point_code || ''
        //             // })
        //         }
        //         console.log('this.objInfo: ', this.objInfo);
        //         // popup
        //         if (this.chosePoint) {
        //             // let popupHtml = "<div style='width:140px;height:30px;background-color:#08AEE9'><h3>" + e.lngLat.lng.toFixed(3) + ',' + e.lngLat.lat.toFixed(3) + "</h3><h3>"+this.objInfo.smallType+' '+this.objInfo.code+"</h3><br><fm-button  @click='clickPlus'>确定</fm-button>" + "</div>"
        //             let popupHtml = '<div id="base-add"></div>'
        //             new mapboxgl.Popup()
        //                 .setLngLat([e.lngLat.lng, e.lngLat.lat])
        //                 .setHTML(popupHtml)
        //                 .addTo(window.xaMap);
        //             new popupItem({
        //                 propsData: {
        //                     detailId: 99999,
        //                     lng: e.lngLat.lng.toFixed(3),
        //                     lat: e.lngLat.lat.toFixed(3),
        //                     bigType: this.objInfo.bigType,
        //                     smallType: this.objInfo.smallType,
        //                     deviceCode: this.objInfo.code,
        //                     fun: this.enterAdd
        //                 }
        //             }).$mount('#base-add')
        //         }
        //     })
        //     // window.xaMap.on('click',e=>{})结束
        // },
        async mapLoaded() {
            MapObj.map = window.xaMap
            await addIconToMap(MapObj.map, this.icons)
            MapObj.map.on("click", (e) => {
                // 若为functio(e){ this是this.MapObj.map}
                // (e)=>{ this是this}
                console.log("map-click-e", e)
                console.log("e.lngLatn", e.lngLat)
                var bbox = [
                    [e.point.x - 1, e.point.y - 1],
                    [e.point.x + 1, e.point.y + 1]
                ];
                console.log("bbox:", bbox)
                // mapbox 返回查询要素的图层属性
                let queryfeatures = MapObj.map.queryRenderedFeatures(bbox, {
                    layers: ["rd_map_drainpipe_ys_big", "rd_map_drainpipe_ys_small", "rd_map_drainpipe_ws_small", "rd_map_drainpipe_ws_big",
                        "rd_map_outfall", "rd_map_gate", "rd_map_manhole", "rd_map_comb",
                        "map_supply_firehydrant", "map_supply_valve",
                        "map_supply_pipe_distribute", "map_supply_pipe_delivery", "map_supply_pipe_circulating",
                        "map_supply_node_distribute", "map_supply_node_delivery", "map_supply_node_circulating",
                        "map_recycle_pipe", "map_recycle_node", "map_waterwork"]
                    // layers: layers
                });
                console.log("点选(微矩形)查询到的queryfeatures:", queryfeatures)
                // console.log("点选(微矩形)查询的queryfeatures:", queryfeatures.properties)
                // this.hightLight(queryfeatures)// 高亮表格记录，并高亮地图要素
                this.objInfo = {}//先置空再赋值
                // 点击位置的经纬度
                this.objInfo.lng = e.lngLat.lng
                this.objInfo.lat = e.lngLat.lat
                if (queryfeatures.length > 0) {
                    // queryfeatures.forEach(f => {
                    let f = queryfeatures[0]
                    console.log('ffff: ', f);
                    // 点击要素的经纬度，有的话覆盖掉点击位置经纬度
                    // this.objInfo.lng = f.properties.longitude || this.objInfo.lng
                    // this.objInfo.lat = f.properties.latitude || this.objInfo.lat
                    // 要素所在图层ID和属性信息
                    this.objInfo.layerID = f.layer.id
                    this.objInfo.layerType = f.layer.type
                    this.objInfo.properties = f.properties
                    // 底图要素name_local或设施要素road_name,id
                    this.objInfo.name_local = f.properties.name_local
                    this.objInfo.road_name = f.properties.road_name
                    this.objInfo.id = f.properties.id
                    // 要素对象类型（业务类型/设施类型）
                    this.objInfo.bigType = ''
                    this.objInfo.smallType = ''
                    switch (f.layer.id) {
                        // 雨水
                        case "rd_map_comb"://comb一定是雨水口
                            this.objInfo.bigType = '雨水'
                            this.objInfo.smallType = '雨水口'
                            break
                        case "rd_map_outfall"://排放口 1-雨水； 2-污水； 3-合流； 4-其他
                            this.objInfo.bigType = f.properties.pipe_type
                            this.objInfo.smallType = '排放口'
                            break
                        case "rd_map_manhole"://检查井  1-雨水；2-污水
                            this.objInfo.bigType = f.properties.manhole_type
                            this.objInfo.smallType = f.properties.manhole_type == "雨水" ? '雨水检查井' : '污水检查井'
                            break
                        case "rd_map_gate"://闸门 1-雨水； 2-污水； 3-合流； 4-其他
                            this.objInfo.bigType = f.properties.pipe_type
                            // objInfo.smallType = '闸门'
                            this.objInfo.smallType = f.properties.pipe_type == "雨水" ? '其他（雨）' : '其他（污）'
                            break
                        case "rd_map_drainpipe_ys_big":
                            this.objInfo.bigType = '雨水'
                            this.objInfo.smallType = '雨水管渠'
                            break
                        case "rd_map_drainpipe_ys_small":
                            this.objInfo.bigType = '雨水'
                            this.objInfo.smallType = '雨水管渠'
                            break
                        // 污水
                        case "rd_map_drainpipe_ws_big":
                            this.objInfo.bigType = '污水'
                            this.objInfo.smallType = '污水管道'
                            break
                        case "rd_map_drainpipe_ws_small":
                            this.objInfo.bigType = '污水'
                            this.objInfo.smallType = '污水管道'
                            break
                        // 供水
                        case "map_supply_firehydrant"://消火栓一定是供水
                            this.objInfo.bigType = '供水'
                            this.objInfo.smallType = '消防栓'
                            break
                        case "map_supply_valve"://阀门valve一定是供水
                            this.objInfo.bigType = '供水'
                            this.objInfo.smallType = '阀门'
                            break
                        case "map_supply_pipe_distribute"://配水管线
                            this.objInfo.bigType = '供水'
                            this.objInfo.smallType = '供水管道'
                            break
                        case "map_supply_pipe_delivery"://输水管线
                            this.objInfo.bigType = 'supply'
                            this.objInfo.smallType = '供水管道'
                            break
                        case "map_supply_pipe_circulating"://回水管线
                            this.objInfo.bigType = '供水'
                            this.objInfo.smallType = '供水管道'
                            break
                        // case "map_supply_node_distribute":
                        //     objInfo.bigType = '供水'
                        //     objInfo.smallType = 
                        //     break
                        case "map_supply_node_delivery":
                            this.objInfo.bigType = '供水'
                            this.objInfo.smallType = f.properties.appurtenance == "消防井" ? "消防栓" : f.properties.appurtenance == "排气阀" ? "阀门" : '其他（供）'
                            break
                        // case "map_supply_node_circulating": 
                        //     objInfo.bigType = '供水'
                        //     objInfo.smallType = 
                        //     break
                        case "map_waterwork"://供水厂
                            this.objInfo.bigType = '供水'
                            this.objInfo.smallType = '其他（供）'
                            break
                        // 再生水
                        case "map_recycle_pipe"://再生水管线
                            this.objInfo.bigType = '再生水'
                            this.objInfo.smallType = '再生水管道'
                            break
                        case "map_waterwork"://再生水厂
                            this.objInfo.bigType = '再生水'
                            this.objInfo.smallType = '其他（再）'
                            break
                    }
                    // 设施编号
                    this.objInfo.code = f.properties.start_code && f.properties.end_code ? (f.properties.start_code + ',' + f.properties.end_code) : ''
                        || f.properties.manhole_code || f.properties.gate_code || f.properties.outlet_code
                        || f.properties.comb_code || f.properties.valve_code || f.properties.pump_station_code
                        || f.properties.plant_code || f.properties.pump_code || f.properties.fire_cock_code
                        || f.properties.point_code || ''
                    // })
                }
                console.log('this.objInfo: ', this.objInfo);
                // popup
                if (this.chosePoint) {
                    // let popupHtml = "<div style='width:140px;height:30px;background-color:#08AEE9'><h3>" + e.lngLat.lng.toFixed(3) + ',' + e.lngLat.lat.toFixed(3) + "</h3><h3>"+this.objInfo.smallType+' '+this.objInfo.code+"</h3><br><fm-button  @click='clickPlus'>确定</fm-button>" + "</div>"
                    let popupHtml = '<div id="base-add"></div>'
                    new mapboxgl.Popup()
                        .setLngLat([e.lngLat.lng, e.lngLat.lat])
                        .setHTML(popupHtml)
                        .addTo(MapObj.map);
                    new popupItem({
                        propsData: {
                            detailId: 99999,
                            // lng: e.lngLat.lng.toFixed(3),
                            // lat: e.lngLat.lat.toFixed(3),
                            lng: e.lngLat.lng,
                            lat: e.lngLat.lat,
                            bigType: this.objInfo.bigType,
                            smallType: this.objInfo.smallType,
                            deviceCode: this.objInfo.code,
                            fun: this.enterAdd
                        }
                    }).$mount('#base-add')
                }
            })
        }
    },

}
</script>
<style lang="scss" scoped>
.main {
    width: 750px;
    // height: 1334px;
    height: 100%;
    background: #F4F7FC;

    // .map-container {
    //     width: 750px;
    //     height: 680px;

    //     .mapboxgl-ctrl-bottom-left {
    //         display: none !important;
    //     }

    //     .mapboxgl-ctrl a.mapboxgl-ctrl-logo {
    //         display: none !important;
    //     }

    //     .mapboxgl-ctrl-bottom-left div {
    //         display: none !important;
    //     }
    // }
    .mapContainer {
        height: 750px;
        width: 100%;

    }

    .flaws-list-container {
        height: 700px;
        overflow: scroll;

        .tableList {
            padding-bottom: 10px;
            // position: fixed;
            bottom: 0px;
            width: 750px;
            height: auto;
            overflow: scroll;
            max-height: 580px;
            background: #f4f7fc;
            box-shadow: 0px -4px 12px 0px rgba(104, 115, 127, 0.1);

            .con-div {
                margin-top: 20px;
                width: 690px;
                margin-left: 30px;
                height: 270px;
                background: #ffffff;
                box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.08);
                border-radius: 16px;

                .top {
                    width: 100%;
                    height: 80px;
                    line-height: 80px;
                    overflow: auto;

                    // display: inline;
                    .name {
                        margin-left: 20px;
                        float: left;
                        width: auto;
                        font-size: 36px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #191919;
                    }

                    .img {
                        width: 30px;
                        height: 39px;
                        float: right;
                        margin-right: 20px;
                        margin-top: 15px;
                    }

                    .state {
                        float: left;
                        margin-left: 20px;
                        margin-top: 20px;
                        width: auto;
                        padding-left: 10px;
                        padding-right: 10px;
                        height: 42px;
                        line-height: 42px;
                        border-radius: 4px;
                    }

                    .c1 {
                        background: rgba(64, 187, 90, 0.1);
                        font-size: 24px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #40bb5a;
                    }

                    .c2 {
                        font-size: 24px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #027aff;
                        background: rgba(2, 122, 255, 0.1);
                    }

                    .c3 {
                        background: rgba(255, 148, 41, 0.1);
                        font-size: 24px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #ff9429;
                    }
                }

                .content {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 96%;
                    height: 60px;
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #555555;
                    line-height: 60px;
                    padding-left: 20px;
                }

                .under {
                    width: 97%;
                    margin-left: -17px;
                    display: flex;
                    justify-content: space-around;
                    height: 70px;
                    line-height: 70px;
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #555555;

                    .under-div {
                        margin-left: 30px;
                        float: left;
                    }
                }
            }
        }
    }

    .add-container {
        .bigForm-container {
            width: 750px;
            height: 1234px;
            overflow: scroll;
            background: #FFFFFF;

            .subtable {
                position: relative;
                margin: 10px;
                padding: 13px;
                // background-color: aquamarine;
                border-radius: 16px;
                border: 1px solid #5195d0;
            }

        }

    }

    .detail-container {
        width: 750px;
        height: 1290px;

        .formFrame {
            width: 750px;
            height: 1300px;
            margin-top: -65px;

            .outwork-detail {
                .outwork-detail-titlebar .wbgc-card {}

                .outwork-detail-box {
                    height: 100%;
                    width: 100% !important;
                    overflow: auto;
                }
            }
        }
    }
}
</style>