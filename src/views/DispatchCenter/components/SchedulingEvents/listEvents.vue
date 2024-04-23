<template>
    <div class="flaws-list-container">
        <div class="tableList">
            <div class="con-div" @click="jump(item.id)" v-for="(item, index) in tableList" :key="index">
                <div class="top">
                    <div class="name">
                        {{ item.ticketNo }}
                    </div>
                    <div
                        :class="item.status == 0 ? 'state c1' : item.status == 1 ? 'state c2' : item.status == 99 ? 'state c4' : 'state c3'">
                        {{ item.state }}</div>
                    <img class="img" src="@assets/img/dispatchCenter/schedulingEvents/gps.png"
                        @click="toTarget(item.lnglat)" />
                </div>
                <div>
                    <div class="content">
                        <span>事件类型&nbsp; </span>
                        <span>&nbsp; {{ getZHCN(item.flawsName) }}</span>
                    </div>
                    <div class="content">
                        <span>现场情况&nbsp;</span>
                        <span>&nbsp; {{ item.content }}</span>
                    </div>
                </div>
                <div class="under">
                    <div class="under-div"><i class="fm-icon fm-icon-contact"></i>{{ item.people }}</div>
                    <div class="under-div"><i class="fm-icon fm-icon-upgrade"></i>
                        {{ item.deviceName[0] + '-' + item.deviceName[1] }}</div>
                    <div class="under-div"><i class="fm-icon fm-icon-underway-o"></i>{{ item.time }}</div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import { ENUM } from '@/store/State/stateTypes'
import axios from 'axios'
export default {
    name: "listEvents",
    props: {
        tableList: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            formToken: '',
            accessToken: this.$storage.get('access_token'),
        }
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
        getZHCN() {
            return (val) => {
                console.log('val: ', val);
                try {
                    let result = val
                    // 翻译二级字典 业务类型/设施类型中  二级字段---设施类型
                    if (val instanceof Array) {
                        if (this.busDeviceTypeDic.length > 0) {
                            result = val[1]
                            this.busDeviceTypeDic.forEach(element => {
                                if (val[0] == element.code || val[0] == element['zh-CN']) {
                                    element.child.forEach(second => {
                                        if (val[1] == second.code || val[1] == second['zh-CN']) {
                                            result = second['zh-CN']
                                        }
                                    })
                                }
                            });
                        }
                    } else {
                        if (this.faultTypesDic.length > 0) {
                            this.faultTypesDic.forEach((dic) => {
                                if (val == dic.code || val == dic['zh-CN']) {
                                    result = dic['zh-CN']
                                }
                            })
                        }
                        if (this.defectFromDic.length > 0) {
                            this.defectFromDic.forEach((dic) => {
                                if (val == dic.code || val == dic['zh-CN']) {
                                    result = dic['zh-CN']
                                }
                            })
                        }
                        if (this.busDeviceTypeDic.length > 0) {
                            this.busDeviceTypeDic.forEach((dic) => {
                                if (val == dic.code || val == dic['ch-CN']) {
                                    result = dic['zh-CN']
                                }
                            })
                        }
                    }
                    return result
                } catch (error) {
                    console.log('error: ', error);
                }
            }
        }
    },
    methods: {
        jump(id) {
            this.$router.push({
                name: 'detailFlawOrder',
                query: { id }
            })
        },
        // 地图相关
        toTarget(lnglat) {
            if (lnglat.length == 2) {
                this.$emit("toTarget", lnglat)
                window.xaMap.flyTo({
                    center: lnglat,
                    zoom: 19,
                })
            } else {
                console.log("无位置信息")
            }
        },
    },
    created() {
        // 生成formToken，跳详情页用
        axios({
            url: process.env.VUE_APP_WPG_URL + '/main/userCenterApi/sso/tokenByToken',
            method: 'post',
            params: {
                token: this.accessToken,
            },
            headers: {
                Authorization: 'Basic b3V0d29yazp3cGcyMDIw',
            },
        }).then((res) => {
            if (res.status == 200) {
                this.formToken = res.data.resultData.token
                console.log('this.formToken: ', this.formToken);
                this.header = {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.formToken,
                }
                console.log(' this.header : ', this.header)
            }
        })
    },
    mounted() {
        console.log('tableList: ', this.tableList);
    }
}
</script>
<style lang="scss" scoped>
.flaws-list-container {
    position: fixed;
    bottom: -116px;
    height: 700px;
    overflow: scroll;

    .tableList {
        padding-bottom: 10px;
        // position: fixed;
        bottom: 0px;
        width: 750px;
        height: auto;
        overflow: scroll;
        min-height: 580px;
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
                    margin-top: 16px;
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

                .c4 {
                    background: rgba(255, 148, 41, 0.1);
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #6e6d6c;
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

                span:first-child {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 36px;
                }

                span:last-child {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #333333;
                    line-height: 40px;
                }
            }

            .under {
                width: 100%;
                margin-left: -17px;
                display: flex;
                justify-content: space-between;
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
</style>