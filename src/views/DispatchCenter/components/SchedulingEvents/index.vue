<template>
    <div>
        <fm-nav-bar title="事件中心" left-arrow @click-left="$router.go(-1)" />
        <div class="mapContainer">
            <xa-map :create="initScene"></xa-map>
            <div class="selectStyle">
                <Select :selectData="dateTypeList" :selValue="dateType" color="white" @getValue="getValue"></Select>
                <Select :selectData="ObjTypeList" :selValue="ObjType" color="white" @getValue="getValue"></Select>
                <!-- <div style="z-index: 999999;margin-top: -20px">
                    <img style="width:80px;height:80px;" src="@assets/img/dispatchCenter/schedulingEvents/筛选.png"
                        alt="">
                </div> -->
            </div>
        </div>

        <div class="statisPart">
            <fm-tabs v-model="activeName">
                <fm-tab :label="'全部 ' + numTotal" name="numTotal">
                    <listEvents :tableList="tableList" @toTarget="toTarget"></listEvents>
                </fm-tab>
                <fm-tab :label="'办理中 ' + numIng" name="numIng">
                    <listEvents :tableList="tableList" @toTarget="toTarget"></listEvents>
                </fm-tab>
                <fm-tab :label="'挂起 ' + numHover" name="numHover">
                    <listEvents :tableList="tableList" @toTarget="toTarget"></listEvents>
                </fm-tab>
                <fm-tab :label="'已完成 ' + numEd" name="numEd">
                    <listEvents :tableList="tableList" @toTarget="toTarget"></listEvents>
                </fm-tab>
            </fm-tabs>
        </div>
    </div>
</template>

<script>
import { Toast } from 'fawkes-mobile-lib'
// 下拉选择框
import Select from './Select.vue'
import listEvents from './listEvents.vue'
import { addIconToMap } from '@/utils/mapUtils'
// import infoPopup from '@/views/DispatchCenter/components/popup.vue' // 事件弹窗
import axios from 'axios'
import { ENUM } from '@/store/State/stateTypes'
import mapboxgl from 'mapbox-gl'
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
    name: "SchedulingEvents",
    components: { Toast, listEvents, Select },
    data() {
        return {
            icons: [
                {
                    name: '事件点',
                    url: require('@/assets/img/map/dw.png'),
                },
            ],
            // 事件
            accessToken: this.$storage.get('access_token'),
            formToken: '',
            header: {},
            tableData: [],//拿到全部数据，切换全部/待处理/已完成时不变，筛选时间和对象时才变
            tableList: [],//用于列表渲染
            tableGeo: [],//用于地图聚类展示
            //事件统计与列表
            activeName: "numTotal",
            numTotal: 0,
            numIng: 0,
            numHover: 0,
            numEd: 0,
            // 筛选
            dateTypeList: [
                { type: 1, name: '全部时间', value: '全部时间' },
                { type: 1, name: '今日', value: '今日' },
                { type: 1, name: '近一周', value: '近一周' },
                { type: 1, name: '近一月', value: '近一月' },
                { type: 1, name: '近三月', value: '近三月' },
            ],
            ObjTypeList: [
                { type: 2, name: '全部类型', value: '全部类型' },
                { type: 2, name: '污水', value: '污水' },
                { type: 2, name: '雨水', value: '雨水' },
                { type: 2, name: '供水', value: '供水' },
                { type: 2, name: '再生水', value: '再生水' }
            ],
            dateType: '全部时间',
            startDate: "",
            endDate: "",
            ObjType: '全部类型',
        }
    },
    watch: {
        activeName: {
            handler(val) {
                this.getListByStatus(val)
            },
            immediate: true
        },
        dateType: {
            handler(val) {
                this.changeDateObj(val)
                this.addEventsLayer()
            },
        },
        ObjType: {
            handler(val) {
                this.changeDateObj(val)
                this.addEventsLayer()
            },
        },
    },
    created() {
        // 初始化下拉框
        this.dateType = this.dateTypeList[0].value
        this.ObjType = this.ObjTypeList[0].value
    },
    mounted() {
        Toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
        })
        console.log("timemmmmmmmmmm:", this.$dayjs());
        console.log("今日:", this.$dayjs().subtract(0, 'day').format('YYYY-MM-DD'));
        console.log("今日:", this.$dayjs().format('YYYY-MM-DD'));
        console.log("timemmmmmmmmmm:", this.$dayjs().subtract(7, 'day'));
        console.log("timemmmmmmmmmm:", this.$dayjs().subtract(1, 'month'));
        console.log("timemmmmmmmmmm:", this.$dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
    },
    methods: {
        // 获取列表数据
        changeDateObj() {
            let startTime = ''
            switch (this.dateType) {
                case '今日':
                    startTime = this.$dayjs().subtract(0, 'day').format('YYYY-MM-DD')
                    break;
                case '近一周':
                    startTime = this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD')
                    break;
                case '近一月':
                    startTime = this.$dayjs().subtract(1, 'month').format('YYYY-MM-DD')
                    break;
                case '近三月':
                    startTime = this.$dayjs().subtract(3, 'month').format('YYYY-MM-DD')
                    break
                default:
                    startTime = ''
                    break
            }
            this.startDate = startTime
            this.endDate = this.$dayjs().format('YYYY-MM-DD')
            console.log('dateType: ', this.dateType);
            console.log('startTime: ', startTime);
            console.log('ObjType: ', this.ObjType);
        },
        // select框选择回调
        getValue(type, name, value) {
            if (type === 1) {
                this.dateType = value
            } else if (type === 2) {
                this.ObjType = value
            }
        },
        toTarget(lnglat) {
            if (lnglat.length == 2) {
                window.xaMap.flyTo({
                    center: lnglat,
                    zoom: 19,
                })
            } else {
                console.log("无位置信息")
            }
        },
        // /*初始化地图事件*/
        async initScene() {
            MapObj.map = window.xaMap
            await addIconToMap(MapObj.map, this.icons)
            // MapObj.map.resize()
            // 添加事件图层 => getTableData() + this.getGeoJson() => renderCluster() 渲染图层和弹窗
            this.addEventsLayer()
        },
        // 事件地图部分----------------------------------------
        // 添加事件图层，先获取header，再通过header获取事件，再将事件列表添加至地图
        async addEventsLayer() {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0
            })
            // 获取header，查询工单用
            axios({
                url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
                method: 'post',
                params: { token: this.accessToken, },
                headers: { Authorization: 'Basic b3V0d29yazp3cGcyMDIw', },
            }).then(async (res) => {
                if (res.status == 200) {
                    this.formToken = res.data.resultData.token
                    this.header = {
                        // 'Content-Type': 'application/json', // 若有 则文件上传 出错
                        Authorization: 'Bearer ' + this.formToken,
                    }
                    // let extParam = JSON.stringify(
                    //     {
                    //         createType: 'PC',
                    //     }
                    // )
                    let extListParam = []
                    if (this.ObjType == '全部类型') {
                        extListParam = [
                            { keyList: ['deviceType'], valueList: ['recycle', 'supply', '供水', '再生水', '污水', '雨水', 'sewage', 'rain'] },
                        ]
                    } else {
                        extListParam = [
                            { keyList: ['deviceType'], valueList: [this.ObjType] },
                        ]
                    }
                    let params = {
                        sysCode: 'outwork',
                        // smallType: 'abnormal_inform',
                        smallType: 'dispatch_problem',
                        startDate: this.startDate,
                        endDate: this.endDate,
                        // extParam: extParam,
                        extListParam: extListParam, // 同时查再生水和供水
                        page: {
                            current: 1,
                            size: -1,
                        },
                    }
                    await this.getTableData(params) // 获取事件列表
                    this.getGeoJson()//将获取到的事件列表构造成GeoJson
                    Toast.clear()
                }
            })
        },
        // 获取事件列表
        async getTableData(params) {
            this.tableData = []
            await axios({
                url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/outworkapi/ticketStatisticClient/getTicketList',
                method: 'post',
                data: params,
                headers: this.header,
            }).then((res) => {
                console.log('获取事件列表结果', res)
                if (res.status == 200 && res.data != null) {
                    this.tableData = res.data?.resultData?.records || []
                    this.tableGeo = this.tableData
                    this.numTotal = res.data?.resultData?.records?.length || 0
                    console.log('事件列表tableData', this.tableData)
                    this.getListByStatus("numIng")
                    this.getListByStatus("numHover")
                    this.getListByStatus("numEd")
                    this.getListByStatus("numTotal")
                }
            })
        },
        //按全部、处理中、已完结划分tableData
        getListByStatus(val) {
            console.log('getListByStatus-val: ', val);
            this.tableGeo = []
            this.tableList = []
            switch (val) {
                case 'numTotal':
                    this.tableData.forEach((td) => {
                        let item = {
                            id: td.id,
                            deviceName: td.formValue.deviceType,
                            ticketNo: td.ticketNo,
                            flawsName: td.formValue.faultTypes,
                            status: td.ticketStatus,
                            state: td.ticketStatusName,
                            content: td.formValue.questionDescribe,
                            people: td.createByName,
                            time: td.createTime.slice(0, 10),
                            flawsFrom: td.formValue.defectFrom,
                            lnglat: [td.appealLng, td.appealLat],
                        }
                        this.tableList.push(item)
                        this.tableGeo.push(td)
                    })
                    this.numTotal = this.tableList.length
                    break
                case 'numIng':
                    this.tableData.forEach((td) => {
                        if (td.ticketStatus == 1) {
                            let item = {
                                id: td.id,
                                deviceName: td.formValue.deviceType,
                                ticketNo: td.ticketNo,
                                flawsName: td.formValue.faultTypes,
                                status: td.ticketStatus,
                                state: td.ticketStatusName,
                                content: td.formValue.questionDescribe,
                                people: td.createByName,
                                time: td.createTime.slice(0, 10),
                                flawsFrom: td.formValue.defectFrom,
                                lnglat: [td.appealLng, td.appealLat],
                            }
                            this.tableList.push(item)
                            this.tableGeo.push(td)
                        }
                    })
                    this.numIng = this.tableList.length
                    break
                case 'numHover':
                    this.tableData.forEach((td) => {
                        if (td.ticketStatus == 3) {
                            let item = {
                                id: td.id,
                                deviceName: td.formValue.deviceType,
                                ticketNo: td.ticketNo,
                                flawsName: td.formValue.faultTypes,
                                status: td.ticketStatus,
                                state: td.ticketStatusName,
                                content: td.formValue.questionDescribe,
                                people: td.createByName,
                                time: td.createTime.slice(0, 10),
                                flawsFrom: td.formValue.defectFrom,
                                lnglat: [td.appealLng, td.appealLat],
                            }
                            this.tableList.push(item)
                            this.tableGeo.push(td)
                        }
                    })
                    this.numHover = this.tableList.length
                    break
                case 'numEd':
                    this.tableData.forEach((td) => {
                        if (td.ticketStatus == 2 || td.ticketStatus == 99) {
                            let item = {
                                id: td.id,
                                deviceName: td.formValue.deviceType,
                                ticketNo: td.ticketNo,
                                flawsName: td.formValue.faultTypes,
                                status: td.ticketStatus,
                                state: td.ticketStatusName,
                                content: td.formValue.questionDescribe,
                                people: td.createByName,
                                time: td.createTime.slice(0, 10),
                                flawsFrom: td.formValue.defectFrom,
                                lnglat: [td.appealLng, td.appealLat],
                            }
                            this.tableList.push(item)
                            this.tableGeo.push(td)
                        }
                    })
                    this.numEd = this.tableList.length
                    break
            }
            this.getGeoJson()//将获取到的事件列表构造成GeoJson
        },
        // 将事件列表添加至地图
        getGeoJson() {
            let features = []
            let withoutPositionCount = 0
            console.log('要聚合展示的tableGeo', this.tableGeo)
            if (this.tableGeo.length == 0) {
                this.removeSomeLayer()
                return
            }
            this.tableGeo.forEach((item) => {
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

                this.popup1
                    .setLngLat(coordinates)
                    .setHTML('<div id="vue-popup-custom" class="vue-popup-custom"><h3>' + formValue.faultTypes + '</h3></div>')//formValue.deviceType[1] + ' ' +
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
    },
}
</script>

<style scoped lang="less">
.mapContainer {
    height: 550px;
    width: 100%;

}

/deep/.vue-popup-custom {
    font-size: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 20px;
}

.selectStyle {
    display: flex;
    justify-content: space-around;
    margin-top: -85px;
}


.statisPart {
    width: 750px;
    height: 100px;
    background: #FFFFFF;
    border-radius: 30px 30px 0px 0px;
}
</style>