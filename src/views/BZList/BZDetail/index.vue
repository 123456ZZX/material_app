<template>
    <div class="main">
        <img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
        <fm-nav-bar :title="tappedObject.pumpName" left-arrow @click-left="$router.go(-1)">
            <template #right>
                <div class="actionSlots">
                    <img class="actions" src="@/assets/img/BZList/zuTai.png" />
                </div>
                <div class="actionText" @click="goZuTai">组态</div>
            </template>
        </fm-nav-bar>
        <div class="content">
            <fm-tabs v-model="active" @tab-click="changeType(active)" animated>


                <fm-tab name="运维记录" :label="recrod">
                    <div class="main-container">
                        <template v-if="this.tappedObject==null||tempData==null||tempData.length==0 && !loading">
                            <div class="no-data-img">
                                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
                            </div>
                            <div class="no-data-text">
                                <div class="no-data-text-descripe">暂无数据</div>
                            </div>
                        </template>
                        <template v-else-if="active=='运维记录'">
                            <mantianVue :maintenance="tempData"></mantianVue>
                        </template>
                    </div>
                </fm-tab>

                <fm-tab name="监控视频" :label="monitor">
                    <div class="main-container">
                        <template v-if="this.tappedObject==null||tempData==null||tempData.length==0 && !loading">
                            <div class="no-data-img">
                                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
                            </div>
                            <div class="no-data-text">
                                <div class="no-data-text-descripe">暂无数据</div>
                            </div>
                        </template>
                        <template v-else-if="active=='监控视频'">
                            <monitorVue :video-data="tempArr"></monitorVue>
                        </template>
                    </div>
                </fm-tab>
                <fm-tab name="水泵信息" :label="bzInfo">
                    <div class="main-container">
                        <template v-if="this.tappedObject==null||tempData==null||tempData.length==0 && !loading">
                            <div class="no-data-img">
                                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
                            </div>
                            <div class="no-data-text">
                                <div class="no-data-text-descripe">暂无数据</div>
                            </div>
                        </template>
                        <template v-else-if="active=='水泵信息'">
                            <pumInfoVue :pumpData="tempArr"></pumInfoVue>
                        </template>
                    </div>
                </fm-tab>

                <fm-tab name="门禁记录" :label="doorRecrod">
                    <div class="main-container">
                        <template v-if="this.tappedObject==null||tempData==null||tempData.length==0 && !loading">
                            <div class="no-data-img">
                                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
                            </div>
                            <div class="no-data-text">
                                <div class="no-data-text-descripe">暂无数据</div>
                            </div>
                        </template>
                        <template v-else-if="active=='门禁记录'">
                            <div>
                                <div class="selectStyle">
                                    <SelectVue :selectData="tempArr" :selValue="dateType" color="white"
                                        @getValue="getValue">
                                    </SelectVue>
                                </div>
                            </div>
                            <doorRecordVue :door-data="doorData"></doorRecordVue>
                        </template>
                    </div>
                </fm-tab>

                <fm-tab name="水池信息" :label="poolInfo">
                    <div class="main-container">
                        <template v-if="this.tappedObject==null||tempData==null||tempData.length==0 && !loading">
                            <div class="no-data-img">
                                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
                            </div>
                            <div class="no-data-text">
                                <div class="no-data-text-descripe">暂无数据</div>
                            </div>
                        </template>
                        <template v-else-if="active=='水池信息'">
                            <poolInfoVue :pool-data="tempArr"></poolInfoVue>
                        </template>
                    </div>
                </fm-tab>

                <!-- <fm-tab name="实时数据" :label="nowData">
                    <div class="main-container">
                        <template v-if="this.tappedObject==null||tempData==null||tempData.length==0 && !loading">
                            <div class="no-data-img">
                                <fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
                            </div>
                            <div class="no-data-text">
                                <div class="no-data-text-descripe">暂无数据</div>
                            </div>
                        </template>
                        <template v-else-if="active=='实时数据'">
                            <liveDataVue :liveData="tempData" :tapped-objects="tappedObject"></liveDataVue>
                        </template>
                    </div>
                </fm-tab> -->
            </fm-tabs>
        </div>
    </div>
</template>
<script>
import {
    Toast,
    PullRefresh,
    Dialog,
    Notify,
} from 'fawkes-mobile-lib'
import liveDataVue from './liveData.vue'
import mantianVue from './mantian.vue'
import pumInfoVue from './pumInfo.vue'
import SelectVue from './BzSelect.vue';
import doorRecordVue from './doorRecord.vue';
import poolInfoVue from './poolInfo.vue';
import monitorVue from './monitor.vue';
import request from '@/utils/request'
import { each, forEach } from 'lodash';
export default {
    components: {
        liveDataVue,
        mantianVue,
        pumInfoVue,
        SelectVue,
        doorRecordVue,
        poolInfoVue,
        monitorVue,
        [Toast.name]: Toast,
        [PullRefresh.name]: PullRefresh,
        [Dialog.name]: Dialog,
        [Notify.Component.name]: Notify.Component,
    },
    data() {
        return {
            GsData: [],
            WsData: [],
            RnData: [],
            list: [{ title: '123' }],
            tempData: {},
            tempArr: [],
            doorData: [],
            tappedObject: null,
            nowData: '实时数据',
            recrod: '运维记录',
            monitor: '监控视频',
            bzInfo: '水泵信息',
            doorRecrod: '门禁记录',
            poolInfo: '水池信息',
            active: '运维记录',
            token: '',
            refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
            loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
            finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
            inspDateTypeList: [
                { type: 1, name: '门禁名称一', value: '门禁名称一' },
                { type: 1, name: '门禁名称二', value: '门禁名称二' },
                { type: 1, name: '门禁名称三', value: '门禁名称三' },
            ],
            dateType: '请选择',
        }
    },
    created() {
        // 初始化下拉框
        this.dateType = this.inspDateTypeList[0].value
    },
    mounted() {
        this.GsData = this.$route.query.GsData
        this.WsData = this.$route.query.WsData
        this.RnData = this.$route.query.RnData
        this.tappedObject = this.$route.query.tappedObject
        if (this.tappedObject.id == null) {
            Notify({
                type: 'error',
                message: '页面已失效，请返回上一页',
                duration: 2000,
            });
            setTimeout(() => {
                this.$router.replace('/BZList')
            }, 1999);
        } else {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0
            })
            this.getToken()
            this.onRefresh(this.active)
        }

    },
    onLoad() {
        this.getData(this.active)
    },
    methods: {
        goZuTai() {
            this.$router.push({
                path: '/BZList/zuTai',
                query: {
                    id: this.tappedObject.id,
                }
            })
        },
        getValue(type, name, value) {
            this.dateType = value
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0
            })
            request({
                url: '/xasw-pump/pump/app/getAccessRecord',
                method: 'get',
                params:
                {
                    pumpId: this.tappedObject.id,
                    entranceCode: this.dateType,
                }
            }).then((res) => {
                this.doorData = this.doorData.concat(res.data)
                console.log(this.doorData + '123')
            }).finally(() => {
                Toast.clear()
                this.loading = false
            })
            this.onRefresh(this.active)
        },
        //获取工单token
        getToken() {
            return request({
                url: `${process.env.VUE_APP_WPG_URL}/main/userCenterApi/sso/tokenByToken`,
                method: 'post',
                headers: {
                    Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
                },
                params: {
                    token: this.$storage.get('access_token'),
                },

            }).then((res) => {
                console.log(res)
                this.token = 'Bearer ' + res.accessToken
            })
        },
        // 获取列表数据
        getData(act) {
            this.tempData = {}
            let url = ''
            let id = ''
            let more = ''
            switch (act) {
                case this.nowData:
                    url = '/xasw-pump/pump/app/monitoringAlarm'
                    id = this.tappedObject.id
                    break;
                case '运维记录':
                    url = '/xasw-pump/pump/app/operationRecord'
                    //id=item.id
                    id = this.tappedObject.id
                    break;
                case '监控视频':
                    url = '/xasw-pump/pump/app/videoMonitor'
                    id = this.tappedObject.id
                    break;
                case '水泵信息':
                    url = '/xasw-pump/pump/app/getPumpInfo'
                    id = this.tappedObject.id
                    break;
                case '门禁记录':
                    url = '/xasw-pump/pump/app/getEntranceNames'
                    id = this.tappedObject.id
                    more = this.dateType
                    break;
                case '水池信息':
                    url = '/xasw-pump/pump/app/getPoolInfo'
                    id = this.tappedObject.id
                    break;
                default:
                    url = ''
                    id = ''
            }
            request({
                url: url,
                method: 'get',
                headers: {
                    Authorization: this.token
                },
                params:
                    more == '' ?
                        {
                            pumpId: id,
                        } :
                        {
                            pumpId: id,
                            more: more
                        }
            }).then((res) => {
                this.tempData = res.data
                this.tempArr = this.tempArr.concat(res.data)
                console.log(this.tempData)
            }).finally(() => {
                Toast.clear()
                this.loading = false
            })
        },
        // tab切换回调
        changeType(name,) {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0
            })
            this.active = name
            this.onRefresh(name)
        },
        // 页面加载/下拉刷新
        onRefresh(act) {
            this.pageReset()
            this.loading = true
            this.finished = false
            this.getData(act)
        },
        onClear() {
            // 复用刷新接口
            // this.searchParams.reimburseName = ''
            this.onRefresh()
        },
        // 重置列表page,list值
        pageReset() {
            this.pageNum = 1
            this.tempData = {}
            this.tempArr = []
            this.GsList = []
            this.WsList = []
            this.RnList = []
        },
    },
}
</script>
<style lang="less" scoped>
.main {
    background-color: #055ffc !important;
    height: 100%;

    .main-bg {
        position: absolute;
        width: 100%;
    }

    .no-data-text-descripe {
        font-size: 32px;
        font-weight: 400;
        color: #999999;
    }

    .no-data-text {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .no-data-img {
        margin: 200px 95px 0 95px;
    }

    .content {
        margin-top: 40px;
        position: relative;
        background: #d4e8fc;
        height: calc(100% - 46px);
        width: 100%;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;

        .bgImg {
            position: absolute;
            height: 100px;
            z-index: 1;
            top: -20px;
        }

    }
}

.actionSlots {
    display: flex;
    flex-direction: row;
    margin-right: 10px;
}

.main-container {
    height: calc(95vh - 208px);
    overflow: auto;
    background-color: #d4e8fc;
}

//导航栏右侧按钮
.actions {
    width: 28px;
    height: 28px;
}

.actionText {
    color: #FFFFFF;
    font-size: 28px;
}

.selectStyle {
    display: flex;
    justify-content: space-between;
    width: 690px;
    margin: 24px auto 12px;
}

/deep/.fm-hairline--bottom::after {
    border-bottom-width: 0;
}

/deep/.fm-nav-bar__title {
    color: #FFFFFF !important;
}

/deep/.fm-nav-bar__content {
    background-color: transparent;
}

/deep/ .fm-nav-bar .fm-icon {
    color: #FFFFFF !important;
}

/deep/.fm-nav-bar {
    background: transparent;
}

/deep/.fm-tabs__nav--line {
    background-color: #d4e8fc;
    display: flex;
    align-items: flex-end;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
}

/deep/.fm-tab {
    line-height: 35pt;
    // height: 80%;
    border-radius: 0px 0px 0px 0px;
    // // background-image: linear-gradient(40deg, #99cc33, #ff6666, #336699, #ff0033);
    // background-image: linear-gradient(180deg, #d0e7ff, #d3e8fe, #dbebff, #ecf4ff);
}
</style>