<!--
 * @Description: 
 * @Author: wei_qx@hdec.com
 * @Date: 2021-04-23 08:52:00
 * @LastEditor: wei_qx@hdec.com
 * @LastEditTime: 2021-09-23 17:04:57
-->
<template>
  <div class="popup-container">
    <fm-popup 
      :visible.sync="popupShow"
      position="bottom"
      height="100%"
      width="100%"
      :modal="false"
      :close-on-click-modal="false"
      class="popup"
    >
      <div class="head">
        <i class="fm-icon fm-icon-arrow-left" width="24" height="24" @click="onCancel"></i>
        <text style="font-weight: 600;">{{"请选位置"}}</text>
        <text class="on-confirm" @click="onConfirm">确定</text>
      </div>
      <MapComp ref="mymap" :ifInspection="true" :inspBusinessType="taskDetail.inspBusinessType" @mapLoaded="mapLoaded" ></MapComp>
      <fm-list class="emergency-pull-bar" v-if="popupShow">
        <div class="content">
          <fm-search placeholder="请输入设备编号" shape="square" v-model="keyword" :show-action="false" @change="filterEngList"></fm-search>
          <!-- <uni-data-checkbox class="checkbox" mode="list" icon="right" v-model="curEng" :localdata="filteredList" @change="chooseEng"></uni-data-checkbox> -->
          <fm-empty
            v-if="!filteredList.length"
            description="暂无数据"
          />
        </div>
      </fm-list>
    </fm-popup>
    <fm-nav-bar title="事件上报" left-arrow @click-left="$router.go(-1)">
    </fm-nav-bar>
    <fm-list v-if="!popupShow" class="scroll">
      <fm-form :model="eventForm" ref="eventForm" class="event-form">
        <fm-field label="事件类型" label-width="4.44rem" required v-model="eventForm.eventType">
        </fm-field>
        <!-- <fm-picker
          v-model="selectEventType"
          :columns="eventTypeListNewFiltered"
          @confirm="eventTypeConfirm"
          title="事件类型"
          confirm-button-text="确定"
          cancel-button-text="返回"
        ></fm-picker> -->
        <fm-field label="现场描述" v-model="eventForm.remark.text" label-width="4.44rem" />
        <fm-field label="初步处理" v-model="eventForm.inspTaskDetailDesc.text" label-width="4.44rem" />
        <!-- <u-gap height="8" bg-color="#F5F7F9"></u-gap> -->
        <fm-field label="多媒体附件" label-width="4.44rem" label-position="top" required>
          <div>
            <fm-uploader
            />
          </div>
          <fm-field style="width: 0.55rem;visibility:hidden;" v-model="eventForm.photoLength"  placeholder="" disabled />
        </fm-field>
        <!-- <u-gap height="8" bg-color="#F5F7F9"></u-gap> -->
        <div class="position">
          <MapComp style="height: 7.77rem;" ref="mymap" :ifInspection="true" :inspBusinessType="taskDetail.inspBusinessType" ></MapComp>
          <fm-field label="位置" v-model="locationName" label-width="3.33rem" @click-suffix-icon="pickPosition" suffix-icon="location-o">
          </fm-field>
        </div>
      </fm-form>
    </fm-list>
    <div class="submit-event">
      <fm-button style="width: 100%;" type="primary" @click="submit">提交</fm-button>
    </div>
  </div>
</template>
<script>
import MapComp from "../inspectMap/index.vue";
// import SunuiUpimg from '../../components/sunui-upimg/sunui-upimg.vue';
import bus from "../../views/inspectMap/utils/Bus.js";
// import PullupBar from "@comp/pullup-bar/index2.vue";
// import UniDataCheckbox from '../../components/uni-data-checkbox/uni-data-checkbox.vue';
import _ from "lodash";
import axios from "axios";
import url from "@common/config.js";
import * as turf from '@turf/turf'
import { engPropertyValue, tree, insert, getAllPointOrLineGeomInsp } from './api'
import { Toast } from 'fawkes-mobile-lib';
const mapObj = {
  map: null,
  mapInstance: null
}
const superMapUrl = {
  'POI': {
    url:
      url.gisDomain +
      "/iserver/services/data-LuWangYuPOI/rest/data/featureResults.rjson?returnContent=true",
    datasets: ["POI:POI"],
  },
  '道路名': {
    url:
      url.gisDomain +
      "/iserver/services/data-LuWangYuPOI/rest/data/featureResults.rjson?returnContent=true",
    datasets: ["POI:余杭区矢量路网"],
  },
};
export default {
  name: "add-event",
  components: {
    MapComp,
    // SunuiUpimg,
    // PullupBar,
    // UniDataCheckbox
  },
  data() {
    return {
      dictionary: {
        WATER_SUPPLY: '供水',
        RAI_WATER: '雨水',
        POLLUTED_WATER: '污水'
      },

      locationName: "位置描述信息",
      position: [0, 0],
      curEng: null,
      curFeature: null,
      engList: [],
      filteredList: [],
      initTop: "70%",
      keyword: "",
      userInfo: {},
      feature: {},
      popupShow: false,
      eventForm: {
        eventType: "",
        files: [],
        inspTaskDetailDesc: {
          text: "",
          voice: {}
        },
        remark: {
          text: "",
          voice: {}
        }
      },
      eventTypeList: [],
      rangeList: [],
      taskDetail: {},
      engInfoDTO: null,
      selectEventType: false,
      rules: {
        eventType: [
          {
            required: true,
            message: "请选择事件类型"
          }
        ],
        photoLength: [
          {
            required: true,
            message: "请上传附件",
            trigger: ["change", "blur"]
          }
        ]
      },
      previewURL: "/sys-storage/download_image?f8s=",
      upimgPreview: [],
      headers: {},
      url: {
        // 本页面使用到的url
        uploadFile: "sys-storage/upload",
        // findFile: "ecidi-cmp/file/cmpFileGroup/findFilesByGroupId",
      },
      showVisible: false
    }
  },
  computed: {
    eventTypeListNewFiltered() {
      const { dictionary, eventTypeList, taskDetail } = this;
      let temp = eventTypeList.find(item => {
        return item.label === dictionary[taskDetail.inspBusinessType];
      });
      if (temp) {
        return temp.children;
      } else {
        return null;
      }
    }
  },
  created() {
    this.headers = {
      // "Fawkes-Auth": uni.getStorageSync("Fawkes-Auth"),
    };
  },
  activated() {
    this.setLocationName();
    uni.setStorageSync("isReportEvent", true);
    if (!this.showVisible) {
      this.$nextTick(() => {
        this.refreshReportEvent();
      })
      this.getEventTypeList();
    }
  },
  mounted() {
    this.setLocationName();
    localStorage.setItem("isReportEvent", true);
    this.userInfo = localStorage.getItem("userInfo");
    bus.$on("eventMarkerPosition", (pos) => {
      this.position = pos;
      this.getEngData();
    })
    this.$nextTick(() => {
      this.refreshReportEvent();
    })
    this.getEventTypeList();
  },
  methods: {
    mapLoaded(mapInstance) {
      mapObj.mapInstance = mapInstance
      mapObj.map = mapInstance.map
    },
    // 刷新
    refreshReportEvent() {
      this.position= [0, 0];
      this.curEng= null;
      this.curFeature = null;
      this.engList= [];
      this.filteredList= [];
      this.locationName = "位置描述信息";
      this.initTop= "70%";
      this.keyword= "";
      this.eventForm = {
        eventType: "",
        files: [],
        inspTaskDetailDesc: {
          text: "",
          voice: {}
        },
        remark: {
          text: "",
          voice: {}
        }
      };
      this.upimgPreview = [];
      if (this.$route.query.position) {
        // this.feature = this.$route.query.feature;
        this.rangeList = this.$route.query.rangeList;
        this.taskDetail = this.$route.query.taskDetail;
        this.position = this.$route.query.position;
      }
      mapObj.map.mapOnLoad(() => {
        if (this.position) {
          mapObj.map.addReportEventMarker(this.position);
          mapObj.map.addRangeList(this.rangeList);
          mapObj.map.flyTo({ position: this.position, zoom: 18});
        } 
        
      })
      // this.$refs.eventForm.setRules(this.rules);
    },
    // 获取事件类型
    getEventTypeList() {
      tree().then(res => {
        this.eventTypeList = res.data.sons.map(item => {
          return {
            value: item.code,
            label: item.name,
            children: item.sons.map(item => {
              return {
                value: item.code,
                label: item.name,
                children: item.sons.map(item => {
                  return {
                    value: item.code,
                    label: item.name
                  }
                })
              }
            })
          }
        })
      }).catch(() => {
        Toast({
          message: "字典加载失败",
        });
      })
    },
    // 获取图片信息
    getImageInfo(val) {
      if (val && val[0].length > 0) {
        this.eventForm.files = val[0];
        let photoList = [];
        val[0].forEach((item, index) => {
          photoList.push(item.fileToken);
        });
        let temp = photoList.length + "";
        this.$set(this.eventForm, "photoLength", temp);
      } else {
        this.$set(this.eventForm, "photoLength", "");
      }
    },
    // 事件类型选择确认
    eventTypeConfirm(event) {
      this.$set(this.eventForm, "eventType", event[1].label);
      this.$set(this.eventForm, "inspItemCode", event[1].value);
    },
    // 选择位置
    pickPosition() {
      // 上传组件回显
      this.upimgPreview = this.eventForm.files.map((item) => {
        return {
          uploadFile: {
            savePath: item.fileToken,
          },
          ...item
        };
      });
      this.popupShow = true;
      this.locationName = "位置描述信息";
      this.$nextTick(() => {
        mapObj.map.mapOnLoad(() => {
          mapObj.map.addReportEventMarker(this.position);
          if (this.position) {
            mapObj.map.addRangeList(this.rangeList);
            mapObj.map.flyTo({ position: this.position, zoom: 18});
            setTimeout(() => {
              this.curFeature && mapObj.map.setLineGeoSource([this.curFeature], "curInspLineSource");
            }, 1500)
          }
        })
      })
    },
    // 取消选择位置
    onCancel() {
      this.popupShow = false;
      this.$nextTick(() => {
        mapObj.map.mapOnLoad(() => {
          mapObj.map.addReportEventMarker(this.position);
          if (this.position) {
            mapObj.map.addRangeList(this.rangeList);
            mapObj.map.flyTo({ position: this.position, zoom: 18});
            setTimeout(() => {
              this.curFeature && mapObj.map.setLineGeoSource([this.curFeature], "curInspLineSource");
            }, 1500)
          }
        })
      })
    },
    // 确认选择位置
    onConfirm() {
      if (!this.position) return;
      this.popupShow = false;
      this.$nextTick(() => {
        mapObj.map.mapOnLoad(() => {
          mapObj.map.addReportEventMarker(this.position);
          if (this.position) {
            mapObj.map.addRangeList(this.rangeList);
            mapObj.map.flyTo({ position: this.position, zoom: 18});
            setTimeout(() => {
              this.curFeature && mapObj.map.setLineGeoSource([this.curFeature], "curInspLineSource");
            }, 1500)
          }
          /* 注释高德api调用
          var cordForLoc_start =
            this.position[0].toString() +
            "," +
            this.position[1].toString();
          var GaoDeUrl_start =
            "https://restapi.amap.com/v3/geocode/regeo?location=" +
            cordForLoc_start +
            "&key=75046c1d669799e3bec6503efbc94c3e" +
            "&radius=50";
            axios
            .get(GaoDeUrl_start)
            .then((res) => {
              this.locationName = res.data.regeocode.formatted_address.split(
                "市"
              )[res.data.regeocode.formatted_address.split("市").length - 1];
            })
            .catch((err) => {
              console.log("地理编码报错：" + err);
            });
            */
        })
      })
    },
    /**
     * 超图坐标转换为feature
     */
    superMapParamsToFeature(geometry) {
      let coord;
      let type;
      switch (geometry.type) {
        case "POINT":
          type = "Point";
          coord = [geometry.points[0].x, geometry.points[0].y];
          break;
        case "LINE":
          type = "LineString";
          coord = geometry.points.map((point) => [point.x, point.y]);
          break;
        case "REGION":
          type = "Polygon";
          coord = [geometry.points.map((point) => [point.x, point.y])];
          break;
      }
      return {
        type: "Feature",
        geometry: {
          type,
          coordinates: coord,
        },
      };
    },
    featureToObject(names, values) {
      let obj = {};
      names.forEach((name, index) => {
        obj[name] = values[index];
      });
      return obj;
    },
    // 通过超图查询设置locationName
    async setLocationName(type = "POI") {
      if (this.position) {
        // 生成50m缓冲区进行查询
        let geom = turf.buffer(turf.point(this.position), 0.05, {unit: 'kilometers'});
        let geometry = JSON.parse(JSON.stringify(geom.geometry));
        let coordinates = geometry.coordinates[0].map((item) => {
          return {
            x: item[0],
            y: item[1],
          };
        });
        geometry.points = coordinates;
        geometry.type = "REGION";
        delete geometry.coordinates;
        let { data } = await axios({
          method: "post",
          url: superMapUrl[type].url,
          data: JSON.stringify({
            getFeatureMode: "SPATIAL_ATTRIBUTEFILTER",
            datasetNames: superMapUrl[type].datasets,
            attributeFilter: '',
            geometry,
            spatialQueryMode: "CONTAIN",
          }),
        });
        if (data.totalCount) {
          let arr = [];
          data.features &&
            data.features.forEach((item) => {
              let properties = this.featureToObject(
                item.fieldNames,
                item.fieldValues
              );
              let coord = this.superMapParamsToFeature(item.geometry);
              arr.push({
                ...properties,
                coord,
              });
            });
          const tempData = arr.map((item) => {
            item.ADRESS = item.ADRESS ? item.ADRESS.replace("浙江省", "") : item.NAME.replace("浙江省", "");
            item.ADRESS = item.ADRESS ? item.ADRESS.replace("杭州市", "") : item.NAME.replace("杭州市", "");
            return item;
          });
          if (tempData.length > 0) {
            this.locationName = tempData[0].ADRESS;
            return;
          }
        }
      }
      this.locationName = '';
    },
    // 提交
    submit() {
      this.$refs.eventForm.validate(valid => {
        if (valid) {
          // if (!this.engInfoDTO)  {
          //   uni.showToast({
          //     title: "数据不存在",
          //     duration: 3000
          //   });
          //   return;
          // }
          let copyEventForm = this.deepClone(this.eventForm);
          // 上报位置
          // const geom = this.computeCenter(this.feature);
          const geom = {
            type: "Point",
            coordinates: this.position
          }
          let uploadFiles = [];
          if (this.eventForm.inspTaskDetailDesc.voice.fileToken) {
            uploadFiles.push(this.eventForm.inspTaskDetailDesc.voice);
          }
          uploadFiles = uploadFiles.concat(this.eventForm.files);
          const preliminaryHandleFile = JSON.stringify(uploadFiles);
          const inspOrg = JSON.parse(this.taskDetail.inspOrg);
          const eventPayload = {
            address: this.locationName,
            conclusion: copyEventForm.eventType,
            eventDescribe: this.eventForm.remark.text,
            eventSource: "inspection_event_source_inspection",
            eventType: copyEventForm.inspItemCode,
            inspBusinessType: this.taskDetail.inspBusinessType,
            officeId: this.taskDetail.inspOrgId,
            office: inspOrg.office,
            company: inspOrg.company,
            companyId: inspOrg.companyId,
            preliminaryHandle: this.eventForm.inspTaskDetailDesc.text,
            preliminaryHandleFile: preliminaryHandleFile,
            eventDescribeFile:  this.eventForm.remark.voice.fileToken ? JSON.stringify(this.eventForm.remark.voice) : "",
            // 保存上报事件位置
            regionItemText: JSON.stringify(geom),
            // regionItemText: this.engInfoDTO.infoDTO.engGeom,
            taskId: this.taskDetail.taskId,
            // 
            engId: this.engInfoDTO ? this.engInfoDTO.engId : undefined,
            eventItemText: JSON.stringify(geom),
            // eventItemText: this.engInfoDTO.infoDTO.engGeom,

            lng: geom.coordinates[0],
            lat: geom.coordinates[1],
            reporterId: this.userInfo.id,
            reporterName: this.userInfo.userFullname
          }
          insert(eventPayload).then(res => {
            if (res.status) {
              Toast({
                message: "上报事件成功",
                duration: 3000
              });
              this.$router.go(-1);
            }
          })
        }
      })
    },
    // 深拷贝
    deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    },
    // 计算中心点
    computeCenter(feature) {
      let position;
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        const center = turf.center(feature.geometry);
        position = center.geometry;
      } else if (feature.geometry.type === 'LineString') {
        const center = turf.center(feature.geometry);
        position = center.geometry;
      } else if (feature.geometry.type === 'Point') {
        position = feature.geometry;
      }
      return position;
    },
    // 根据关键字查询
    async getEngPropertyVal(guid) {
      const params = {
        value: guid
      }
      const res = await engPropertyValue(params);
      if (res.status) {
        this.engInfoDTO = res.data;
      } else {
        this.engInfoDTO = null;
      }
    },
    getEngData: _.debounce(function() {
      const params = {
        inspBusinessType: this.taskDetail.inspBusinessType,
        geometry: {
          type: "Point",
          coordinates: this.position
        }
      }
      this.setLocationName();
      this.getEngList(params);
    }, 500),
    filterEngList(keyword) {
      if (keyword) {
        this.filteredList = this.engList.filter(item => item.deviceid.search(keyword) != -1);
      } else {
        this.filteredList = this.engList;
      }
    },
    // 返回radius为半径范围的工程对象数据
    async getEngList(position, radius = 35) {
      Toast.loading({
        message: "获取25m内设施数据..."
      })
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
        type: '全部'
      }
      const res = await getAllPointOrLineGeomInsp(params);
      // console.log("get all Point or Line geom==>", res.data);
      if (res && res.status) {
        this.engList = res.data.map(item => {
          return {
            ...item,
            text: item.deviceid + " | " + (item.pipetype || item.type),
            value: item.deviceid
          }
        });
        this.filteredList = this.engList;
      }
    },
    chooseEng(value) {
      const data = value?.detail?.data;
      if (!data) return;
      this.getEngPropertyVal(data.guid);
      const geom = data.st_asgeojson || data.geom;
      if (!geom) return;
      const feature = {
        id: data.id,
        properties: {
          ...data
        },
        geometry: JSON.parse(geom),
        type: 'feature'
      }
      this.curFeature = feature;
      mapObj.map.setLineGeoSource([feature], "curInspLineSource");
    }
  },
  watch: {
    $route: {
      handler(to, from, next) {
        if (from.path === "/preview-image") {
          this.showVisible = true;
        } else {
          this.showVisible = false;
        }
      },
    },
  },
  // 返回到列表页面
  onBackPress(options) {
    if (options.from === 'backbutton') {  
      Dialog.confirm({  
        title: '提示',  
        message: '确定退出上报事件吗？',  
      }).then((res) => {  
          if (res.confirm) {  
            mapObj.map.mapInstance && mapObj.map.mapInstance.destoryMap();
            mapObj.map.mapInstance = null;
            this.$router.push({
              name: 'InspectionManage',
              params: {
                name: '执行',
                taskId: this.taskDetail.taskId,
                inspBusinessType: this.taskDetail.inspBusinessType,
                reportEvent: true
              }
            })
          }  
        })
      // 禁止默认返回  
      return true  
    }
  },
  beforeDestroy() {
    bus.$off("eventMarkerPosition");
  }
}
</script>
<style lang="scss" scoped>
.popup-container {
  width: 100%;
  .popup {
    .head {
      padding: 0.55rem 0.55rem;
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
      font-weight: 400;
      color: #333333;
      .on-confirm {
        color: #2a83e6;
      }
    }
  }

  .scroll {
    height: 33.34rem;
    .event-form {
      margin: 0.44rem;
      .position {
        width: 100%;
        height: 4.44rem;
      }
    }
  }
  .submit-event {
    width: 90%;
    background-color: #fff;
    z-index: 3;
    left: 5%;
    bottom: 0.3rem;
    position: fixed;
  }
  .emergency-pull-bar {
    .content {
      background-color: #ffffff;
      margin: 0.55rem 0.55rem;
      .checkbox {
        margin: 0.27rem 0.55rem;
        height: 17.77rem;
        overflow-y: scroll;
      }
    }
  }
}
</style>