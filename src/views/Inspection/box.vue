<template>
  <iframe :src="url" style="width: 100%; height: 100vh; border: none;"></iframe>
</template>

<script>
import dayjs from "dayjs";
import url_h5 from "../../common/config"
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: "#00ff00"
        }
      },
      ifStart: true,
      deviceId:"",
      currentPosition: {},
      direction: null,
      url:""
    }
  },
  created() {
  },
  mounted() {
    this.url=url_h5.url_h5
    console.log("start get location");
    let that = this;
    // uni.onCompassChange(function (res) {
    //   that.direction = res.direction;
    // })
    this.getLocation();
    const GetDeviceId = uni.requireNativePlugin('uniplugin_device_id')
    GetDeviceId.getAndroidId({}, (ret) => {
      that.deviceId = ret
	    console.log("deviceId===>", that.deviceId)
      that.whiteName()
    })
  },
  methods: {
    handleMessage(evt) {
      console.log("接收到消息"+ JSON.stringify(evt.detail.data));
      const data = evt.detail.data[0];
      const action = data.action;
      switch (action) {
        case "getWhiteName":
          this.getWhiteName();
          break;
        case "startLocation":
          this.ifStart = true;
          console.log("app端启动定位");
          uni.setStorageSync("ifStart", this.ifStart);
          this.getLocation();
          break;
        case "endLocation":
          this.ifStart = false;
          console.log("app端关闭定位");
          uni.setStorageSync("ifStart", this.ifStart);
          this.getLocation();
          break;
        case "getInspRecord":
          this.getAppInspRecordData(data);
          break;
        case "saveInspRecord":
          uni.setStorageSync(`record${data.taskId}`, data.inspRecordData);
          break;
        case "removeInspRecord":
          uni.removeStorageSync(`record${data.taskId}`);
          break;
        case "getTrackPoints":
          this.getAppInspTrackData(data);
          break;
        case "saveTrackPoints":
          uni.setStorageSync(`track${data.taskId}`, data.trackData);
          break;
        case "removeInspRecord":
          uni.removeStorageSync(`track${data.taskId}`);
          break;
        case "wvback":{
          const pages = getCurrentPages();
          const prev = pages[pages.length - 1];
          const webview = prev.$getAppWebview().children()[0];
          webview.back();
          break;
        }
        case "emitNavigation":
          this.navigate(data)
        default:
          break;
      }
    },
    // 返回存储的记录信息
    getAppInspRecordData(data) {
      try {
        // 返回巡检记录
        const pages = getCurrentPages();
        const prev = pages[pages.length - 1];
        const webview = prev.$getAppWebview().children()[0];
        const inspRecordData = uni.getStorageSync(`record${data.taskId}`);
        webview.evalJS(`document.dispatchEvent(new CustomEvent("getInspRecordData", {
            detail: {
              inspRecordData: ${JSON.stringify(inspRecordData)}
            }
          }))`);
      } catch (e) {
        console.log(e);
      }
    },
    // 返回存储的轨迹信息
    getAppInspTrackData(data) {
      try {
        // 返回巡检轨迹
        const pages = getCurrentPages();
        const prev = pages[pages.length - 1];
        const webview = prev.$getAppWebview().children()[0];
        const trackData = uni.getStorageSync(`track${data.taskId}`);
        webview.evalJS(`document.dispatchEvent(new CustomEvent("getTrackData", {
            detail: {
              trackData: ${JSON.stringify(trackData)}
            }
          }))`);
      } catch (e) {
        console.log(e);
      }
    },
    // 上报位置
    reportPosition() {
      try {
        const that = this;
        const pages = getCurrentPages();
        const prev = pages[pages.length - 1];
        const webview = prev.$getAppWebview().children()[0];
        webview.evalJS(`document.dispatchEvent(new CustomEvent("positioning", {
            detail: {
              currentPosition: ${JSON.stringify(that.currentPosition)}
            }
          }))`);
      } catch (e) {
        console.log(e);
      }
    },
    // 白名单
    whiteName() {
      try {
        const that = this;
        const pages = getCurrentPages();
        const prev = pages[pages.length - 1];
        const webview = prev.$getAppWebview().children()[0];
        webview.evalJS(`document.dispatchEvent(new CustomEvent("whiteName", {
            detail: {
              deviceId: ${JSON.stringify(that.deviceId)}
            }
          }))`);
      } catch (e) {
        console.log(e);
      }
    },
    // 
    getWhiteName() {
      const that = this;
      const GetDeviceId = uni.requireNativePlugin('uniplugin_device_id')
        GetDeviceId.getAndroidId({}, (ret) => {
        that.deviceId = ret
        // console.log("deviceId===>", that.deviceId)
        that.whiteName()
      })
    },
    // 获取定位信息
    getLocation() {
      const that = this;
      uni.setStorageSync("ifStart", that.ifStart);
      // console.log("ConsLocation===>", that.$ConsLocation);
      that.$ConsLocation && that.$ConsLocation.getLocation({
        'isStart': uni.getStorageSync('ifStart'), // 开始巡检或者结束巡检
        'locInterval': 1, // 定位时间间隔
        'gpsAccuracy': 100,
        'wifiAccuracy': 250,
        },
        (ret) => {
          // console.log("ret===>", ret);
          // let loc = ret.split(",");
          let obj = {};
          obj.xCode = ret.longitude;
          obj.yCode = ret.latitude;
          // obj.recordTime = moment(Number(ret.recordTime)).format('YYYY-MM-DD HH:mm:ss');
		      obj.recordTime = ret.resultType === "success" && dayjs(Number(new Date())).format('YYYY-MM-DD HH:mm:ss');
          obj.direction = that.direction;
          obj.locationAccuracy = ret.locationAccuracy
          obj.locationType = ret.locationType
          // console.log("obj==>", obj);
          that.currentPosition = obj;
          that.reportPosition();
        }
      )
    },
    // 导航
    navigate(data) {
      let ConsLocation = uni.requireNativePlugin("uniplugin_cons_location")
      ConsLocation.amapNavi({
        end: JSON.parse(data.end),
        naviType: 2, // 可选0驾车 1骑行 2步行， 默认0
        needTransfer: true // 是否需要转换坐标，mapbox坐标需转换为高德坐标，默认值false
      },
      (ret) => {
        console.log(ret)
      })
    }
  },
  onLoad() {
    // #ifdef APP-PLUS
    // alert('定义动态的高度变量')
    let height = 0; //定义动态的高度变量
    let statusbar = 0; // 动态状态栏高度
    uni.getSystemInfo({ // 获取当前设备的具体信息
        success: (sysinfo) => {
            statusbar = sysinfo.statusBarHeight;
            height = sysinfo.windowHeight;
        }
    });
    let currentWebview = this.$scope.$getAppWebview(); //获取当前web-view
    setTimeout(function() {
        var wv = currentWebview.children()[0];
        wv.setStyle({ //设置web-view距离顶部的距离以及自己的高度，单位为px
            top: statusbar, //此处是距离顶部的高度，应该是你页面的头部
            height: height - statusbar, //webview的高度
        })
    }, 200); //如页面初始化调用需要写延迟
    // wv.setStyle({
    //     top: statusbar,
    //     height: height - statusbar, // 我们在这里把webview的高度调整一下
    // })
    // #endif
  },
  onBackPress() {
	  console.log("click onBackPress");
        const pages = getCurrentPages();
        const prev = pages[pages.length - 1];
        const webview = prev.$getAppWebview().children()[0];
	  webview.evalJS(`uniWebView.postMessage({data: {action: 'wvback'}})`);
	  return true;
  }
}
</script>

<style lang="scss" scoped>
</style>


