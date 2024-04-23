<template>
  <div class="GalleryInspectionStyle">
    <fm-nav-bar left-arrow :title="taskDetail.taskName" @click-left="goBackToTask" @click-right="onSelect">
      <template #right>
        <template>
          <i class="fm-icon fm-icon-plus" style="font-size: 18px" v-if='isEdit'></i>
        </template>
      </template>
    </fm-nav-bar>
    <div class="mapContainer" :style="isEdit ? 'height: calc(100% - 72px);' : 'height: calc(100% - 2px);'">
      <div class="topCard">
        <img src="@/assets/img/inspection/侧边蓝条.png" alt="" />
        <div class="bigtext">{{ objectName }}</div>
        <div class="tagStyle" :class="isEdit ? 'ipsIng' : 'ipsEd'">{{ isEdit ? '待巡检' : '已巡检' }}</div>
      </div>
      <div class="bottomCard">
        <div v-for="(item, index) in  mainPointInfo" :key="index" class="textLine">
          <span class="topText">{{ index + 1 }}.
            {{ item.mainPoint }}
          </span>
          <fm-radio-group v-if="item.inputType != '数值'" v-model="item.mainValue" direction="horizontal"
            style="margin: 0 0 5px 5px; font-size: 16px" :disabled="!isEdit">
            <fm-radio name="正常" icon-size="16px">正常</fm-radio>
            <fm-radio name="异常" icon-size="16px">异常</fm-radio>
          </fm-radio-group>
          <fm-field v-else v-model="item.mainValue" type='number' placeholder="请输入数值" :disabled="!isEdit"
            style="height: 45px;;background-color: rgba(255,255,255,0);">
            <template #extra>
              {{ item.unit }}
            </template>
          </fm-field>
        </div>
        <div class="imgLine">
          <span class="topText">现场照片<span style="color:red">*</span></span>
          <div class="imgStyle">
            <fm-image width="100" height="100" v-for="(item, index) in fileUrlList" :key="index" :src="item"
              @click="preview(item)" />
            <fm-popup :visible.sync="imgPreviewShow">
              <fm-image width="400" height="300" :src="imgPreview"></fm-image>
            </fm-popup>
            <Uploader v-if='isEdit' value="" label="" @fileChangeGallery="fileChange" />
          </div>
        </div>
        <div class="inputLine">
          <span class="topText">现场描述</span>
          <div class="inputStyle">
            <fm-field v-model="message" v-if='isEdit' rows="2" autosize label="" type="textarea" maxlength="300"
              placeholder="请输入" show-word-limit />
            <fm-field style="padding:0px 10px" v-model="message" v-else rows="2" autosize label="" type="textarea"
              disabled />
          </div>
        </div>
      </div>

      <div class="submitStyle" v-if="isEdit" @click="newSubmit">提交</div>
      <!-- <div class="submitStyle" v-else @click="goBackToTask">返回</div> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import * as Api from './api'
import bus from '@/utils/bus'
import { ENUM } from '@/store/State/stateTypes'
import * as turf from '@turf/turf'
import { bbox, center as getCenter } from '@turf/turf'
import _cloneDeep from 'lodash/cloneDeep'
import { addIconToMap } from '@/utils/mapUtils'
import mapboxgl from 'mapbox-gl'
import { Toast, Dialog, Notify, ImagePreview } from 'fawkes-mobile-lib'
import mixins from '@/views/inspectMap/mixins/mixins.js'
import dayjs from 'dayjs'
import request from '@/utils/request'
import Uploader from '@/components/upload/Uploader.vue'
import _ from "lodash";


export default {
  name: '',
  mixins: [mixins],
  components: { Uploader, ImagePreview },
  data() {
    return {
      galleryRouteParams: {}, // 路由参数
      objectName: '',
      taskDetail: {},
      mainPointInfo: [],
      message: "",
      fileList: [],
      fileUrlList: [],
      imgPreviewShow: false,
      imgPreview: ''
    }
  },
  computed: {
    isEdit() {
      if (Object.keys(this.galleryRouteParams).length > 0) {
        return this.galleryRouteParams.mode == 'edit'
      } else {
        return true
      }
    }
  },
  created() {
    // 当前点击的任务，从本地中获取
    this.taskDetail = JSON.parse(localStorage.getItem('galleryTaskData'))
    console.log('this.taskDetail: ', this.taskDetail);
    // 如果当前跳转过来的路由中有params参数，将params参数存入本地，如果没有，则使用本地存储的数据
    if (Object.keys(this.$route.params).length > 0) {
      this.galleryRouteParams = this.$route.params
      localStorage.setItem('galleryRouteParams', JSON.stringify(this.galleryRouteParams))
    } else {
      this.galleryRouteParams = JSON.parse(localStorage.getItem('galleryRouteParams'))
    }
  },
  mounted() {
    console.log('this.$route.query: ', this.$route.query);
    console.log('this.galleryRouteParams: ', this.galleryRouteParams);
    this.objectName = this.$route.query.objectName
    if (this.isEdit) {
      this.inspMainPoint()
    } else {
      this.inspMainPoint()
      this.inspMainPointReult()
    }
  },
  methods: {
    preview(item) {
      console.log("preview");
      this.imgPreview = item
      this.imgPreviewShow = true
    },
    // 返回任务页
    goBackToTask() {
      this.$router.go(-1)
    },
    // 点击上报漏点加号
    onSelect(val) {
      if (this.isEdit) {
        // this.taskDetail = {
        //   "id": "1635672135967145986",
        //   "createBy": "wang_xu wei",
        //   "createDate": "2023-03-15 00:00:01",
        //   "updateBy": null,
        //   "updateDate": null,
        //   "deleteFlag": 0,
        //   "taskName": "DEG管廊巡检-1",
        //   "planId": "1631099024635125762",
        //   "taskCode": "PLAN230315000001",
        //   "taskStatus": 1,
        //   "planStartTime": "2023-03-06 00:00:00",
        //   "taskType": "管廊巡检",
        //   "planEndTime": "2023-12-31 00:00:00",
        //   "taskStartTime": "2023-03-15 00:00:00",
        //   "taskEndTime": "2023-03-19 23:59:59",
        //   "inspector": "wang_xu wei",
        //   "inspectorFullName": "王旭伟",
        //   "taskResult": "0",
        //   "remarks": null,
        //   "bizType": "再生水,供水",
        //   "completion": null,
        //   "inspectionType": "1630780848805486594,1630780817876688898,1630780788256514050,1630780759089324034,1630780731914428418,1630780703862923265,1630780668781764610,1630780641388765186,1630780607154855937,1630780582244884481,1630780549474787329,1630780518743121922,1630780415902982145,1630780381224476674,1630780347821039618,1630780280494071810,1630780250777427969,1630780310001000450",
        //   "coverage": "0.00",
        //   "reportRate": "1/18",
        //   "pipeLength": null,
        //   "gridManager": "梁宗涛",
        //   "pointNumber": null,
        //   "ext3": "支廊",
        // }

        // this.$route.query = {
        //   "id": "1630780817876688898",
        //   "createBy": "lin_w",
        //   "createDate": "2023-03-01 12:03:40",
        //   "updateBy": null,
        //   "updateDate": null,
        //   "deleteFlag": 0,
        //   "objectType": "支廊",
        //   "objectName": "N6E17东支廊",
        //   "gridName": "综合二班（DEG）",
        //   "gridId": "1590537206429511681",
        //   "buildUnit": "",
        //   "material": "",
        //   "objectStatus": "启用中",
        //   "mainId": "1630370705350893570,1628232356279066626,1628232356279066625,1628232356279066627,1628232356279066628,1627841154576785410,1627841154576785414,1627841154576785413",
        //   "remarks": null,
        //   "tenantId": 100000,
        //   "portalId": "1539806397064622081",
        //   "ext1": null,
        //   "ext2": null,
        //   "ext3": null,
        //   "recordStatus": null,
        //   "lon": null,
        //   "lat": null
        // }

        console.log("this.taskDetail", _cloneDeep(this.taskDetail));
        let currentPoint = {}
        currentPoint.taskId = this.taskDetail.id
        currentPoint.gridManager = { fullName: this.taskDetail.gridManager || '', username: this.taskDetail.userName || '' }
        currentPoint.bigType = '管廊'
        currentPoint.smallType = this.$route.query.objectType || ''
        currentPoint.road_name = ''
        currentPoint.gridId = this.$route.query.gridId || ''
        currentPoint.gridName = this.$route.query.gridName || ''
        currentPoint.code = this.$route.query.objectName || ''
        currentPoint.lng = this.$route.query.lon || ''
        currentPoint.lat = this.$route.query.lat || ''
        // 跳转问题上报   对应不上，例如没有地图点选，回填字段对不上
        this.$router.push({
          name: 'addProblemIndex',
          query: { msg: currentPoint, token: this.galleryRouteParams.formToken, taskId: this.taskDetail.id, from: 'insp' },
          params: { type: 'add' },
        })
      } else {
        Toast({
          message: '该巡检任务已结束',
          duration: '1500',
        })
      }
    },

    // view模式下，根据taskId和objectId，查提交的‘表单’
    async inspMainPointReult() {
      let res = await Api.inspMainPointReult({ taskId: this.galleryRouteParams.taskId, objectId: this.$route.query.id })
      console.log('inspMainPointReult-res: ', res);
      let mainPointInfoResult = []
      if (res.status) {
        res.data.mainPointResult.forEach(element => {
          this.mainPointInfo.map((item, index) => {
            item.id == element.mainId ? mainPointInfoResult.push(Object.assign(item, { mainValue: element.mainValue })) : ''
          })
        });
        this.mainPointInfo = mainPointInfoResult
        this.message = res.data.remarks
        res.data.imagesList.forEach((element) => {
          this.fileUrlList.push(`${process.env.VUE_APP_BASE_URL}/sys-storage/download_image?f8s=${element.imagesToken}`)
        })
        console.log('fileUrlList: ', this.fileUrlList);
      }
      console.log('mainPointInfoResult: ', mainPointInfoResult);
    },

    // 查 该巡检对象的要点
    async inspMainPoint() {
      let res = await Api.inspMainPoint({ mainId: this.$route.query.mainId })
      if (res.status) {
        this.mainPointInfo = res.data
        for (var i = 0; i < this.mainPointInfo.length; i++) {
          this.mainPointInfo[i].inputType == '数值' ? this.$set(this.mainPointInfo[i], 'mainValue', "") : this.$set(this.mainPointInfo[i], 'mainValue', "正常");
        }
      }
    },
    // 文件上传成功或删除后调用
    fileChange(file) {
      console.log('file: ', file);
      // file.file是当前变化(增减)的图片；fileList是当前所有可用的图片
      this.fileList = file.fileList
    },
    newSubmit: _.debounce(function () {
      console.log('Debounce: ');
      this.submit()
    }, 1000),
    async submit() {
      console.log('submit: ');
      let mainPointResult = this.mainPointInfo.map(({ id, mainValue }) => { return { mainId: id, mainValue } })
      let imagesList = this.fileList.map(({ file, fileToken }) => { return { imagesName: file.name, imagesToken: fileToken } })
      if (this.fileList.length == 0) {
        Toast({
          message: '至少上传一张照片',
          position: 'top',
        });
        return false;
      }
      // console.log('提交前检查完毕，可以提交');

      let inspObjectRecord = {
        taskId: this.taskDetail.id,
        objectId: this.$route.query.id,
        remarks: this.message,
        // "inspDate": "",
        // "inspector": "",
        imagesList: imagesList,
        mainPointResult: mainPointResult
      }
      console.log('inspObjectRecord: ', inspObjectRecord);
      let res = await Api.inspObjectRecord(inspObjectRecord)
      console.log('submit-res: ', res);
      if (res.status) {
        Toast({
          message: '提交成功',
          position: 'top',
        });
        // setTimeout(() => { this.$router.push('/inspectionManage/StartGalleryInspection'); }, 1000);
        setTimeout(() => { this.$router.go(-1); }, 1000);
      }
    },


  },
}
</script>

<style lang="less" scoped>
.GalleryInspectionStyle {
  background-color: #ffffff !important;
  height: 100%;

  // 顶部标题背景色
  /deep/.fm-nav-bar__content {
    background-color: #ffffff;
  }

  /deep/.fm-nav-bar__title {
    color: #191919 !important;
  }

  /deep/ .fm-nav-bar .fm-icon {
    color: #191919 !important;
  }

  .mapContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100% - 72px);
    width: 100%;
    background: linear-gradient(0deg,
        rgba(211, 231, 254, 0) 0%,
        rgba(211, 231, 254, 0.05) 50%,
        rgba(211, 231, 254, 0.4) 100%);

    .topCard {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 690px;
      height: 100px;
      margin: 48px 0px 12px 0px;
      background: #ffffff;
      box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
      border-radius: 16px;

      img {
        position: absolute;
        width: 6px;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }

      .bigtext {
        margin-left: 30px;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #191919;
      }

      .tagStyle {
        margin-right: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 99px;
        height: 42px;
        border-radius: 4px;

        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }

      .ipsIng {
        background: #fff3e8;
        color: #ff9429;
      }

      .ipsEd {
        background: #ecf5ff;
        color: #409eff;
      }
    }

    .bottomCard {
      // margin-top: 24px;
      width: 690px;
      // height: calc(100% - 300px);
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: scroll;
      // background: #ff0000;
      box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
      border-radius: 16px;

      .textLine {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 92%;
        min-height: 146px;
        border-bottom: 1px solid #eeeeee;
        // background-color: #6df85a;
      }

      .imgLine {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 92%;
        // min-height: 267px;
        border-bottom: 1px solid #eeeeee;

        .imgStyle {
          width: 100%;
          // height: calc(100% - 70px);
          margin-top: 16px;
        }
      }

      .inputLine {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 92%;
        min-height: 160px;
        border-bottom: 1px solid #eeeeee;

        .inputStyle {
          height: calc(100% - 60px);
        }
      }

      .topText {
        margin-top: 26px;
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
      }
    }

    .submitStyle {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 690px;
      height: 72px;
      background: #1b67d8;
      box-shadow: 0px 8px 16px 0px rgba(27, 103, 216, 0.2);
      border-radius: 44px;

      font-size: 32px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>
