<template>
    <div>
        <div v-if="liveData.alarmRecord!=null" class="notice" @click="goWarning">
            <div class="noticeLeadingIcon">
                <img src="@/assets/img/BZList/dole.png" />
                <div class="noticeIconText">{{liveData.alarmNum >99?'99+':liveData.alarmNum}}</div>
            </div>
            <fm-swipe class="my-swipe" style="height: 46px;" :autoplay="2000" vertical :show-indicators="false">
                <fm-swipe-item>
                    <div>
                        <div class="noticeText">
                            {{liveData.alarmRecord.event}}
                        </div>
                    </div>
                </fm-swipe-item>
                <fm-swipe-item></fm-swipe-item>
            </fm-swipe>
        </div>
        <div >
            <div class="title">
                泵组状态
            </div>
            <fm-cell-group inset>
                <!-- 表头 -->
                <fm-cell class="chartCell" :border="false">
                    <template #title>
                        <div class="chartHeader">
                            <div class="chartHeaderText">序号</div>
                            <div class="chartHeaderText">泵总数</div>
                            <div class="chartHeaderText">泵运行中</div>
                            <div class="chartHeaderText">泵故障</div>
                            <div class="chartHeaderText">泵离线</div>
                        </div>
                    </template>
                </fm-cell>
                <fm-cell>
                    <template #title>
                        <div class="headChartBody">
                            <div class="numText">1</div>
                            <div class="pumNumText">{{liveData.pumpState.totalNum !=null?liveData.pumpState.totalNum:
                            '--'}}</div>
                            <div class="pumRunningText">{{liveData.pumpState.runNum !=null?liveData.pumpState.runNum :
                            '--'}}</div>
                            <div class="pumBrokenText">{{liveData.pumpState.alarmNum !=null?liveData.pumpState.alarmNum:
                            '--'}}</div>
                            <div class="pumOfflineText">{{liveData.pumpState.offNum !=null?liveData.pumpState.offNum:
                            '--'}}</div>
                        </div>
                    </template>
                </fm-cell>
            </fm-cell-group>

            <div class="title">
                水量压力
            </div>
            <fm-cell-group inset>
                <!-- 表头 -->
                <fm-cell class="chartCell" :border="false">
                    <template #title>
                        <div class="chartHeader">
                            <div class="chartHeaderText">序号</div>
                            <div class="chartHeaderText">监测项</div>
                            <div class="chartHeaderText">进水</div>
                            <div class="chartHeaderText">出水</div>
                        </div>
                    </template>
                </fm-cell>
                <fm-cell v-for="item,index in liveData.waterPressure" :key="index">
                    <template #title>
                        <div class="chartBody">
                            <div class="commonText">{{index}}</div>
                            <div class="commonText">{{item.monitorItem!=null?item.monitorItem: '--'}}</div>
                            <div class="commonText">{{item.inner!=null?item.inner: '--'}}</div>
                            <div class="commonText">{{item.outer!=null?item.outer: '--'}}</div>
                        </div>
                    </template>
                </fm-cell>
            </fm-cell-group>

            <div class="title">
                水质
            </div>
            <fm-cell-group inset>
                <!-- 表头 -->
                <fm-cell class="chartCell" :border="false">
                    <template #title>
                        <div class="chartHeader">
                            <div class="chartHeaderText">序号</div>
                            <div class="chartHeaderText">监测项</div>
                            <div class="chartHeaderText">进水</div>
                            <div class="chartHeaderText">出水</div>
                        </div>
                    </template>
                </fm-cell>

                <fm-list>
                    <fm-cell v-for="item,index  in liveData.waterQuality" :key="index">
                        <template #title>
                            <div class="chartBody">
                                <div class="commonText">{{index}}</div>
                                <div class="commonText">{{item.monitorItem!=null?item.monitorItem: '--'}}</div>
                                <div class="commonText">{{item.inner!=null?item.inner: '--'}}</div>
                                <div class="commonText">{{item.outer!=null?item.outer: '--'}}</div>
                            </div>
                        </template>
                    </fm-cell>
                </fm-list>
            </fm-cell-group>
        </div>
    </div>
</template>
<script>
export default {
    name: 'liveData',
    data() {
        return {
            waterPressure: [
                {}
            ]
        }
    },
    mounted() {

    },
    methods: {
        goWarning() {
            this.$router.push({
                path: '/BZList/warning',
                query: {
                    loc: this.liveData.alarmRecord.pumpName,
                    des: this.liveData.alarmRecord.event,
                    beginTime: this.liveData.alarmRecord.beginTime,
                    endTime: this.liveData.alarmRecord.endTime,
                    tappedObjects: this.tappedObjects,
                    liveData: this.liveData,
                }
            })
        }
    },
    props: {
        liveData: {
            type: Object,
        },
        tappedObjects: {
            type: Object,
        }
    }
}
</script>
<style lang="less" scoped>
.chartCell {
    background-color: #F8FBFD;
}
.chartHeader {
    display: flex;
}

.headChartBody {
    display: flex;
    flex-direction: row;
}

.chartBody {
    display: flex;
    flex-direction: row;
}

.chartHeaderText {
    color: #999999;
    width: 100%;
    font-size: 28px;
    text-align: center;
}

.commonText {
    font-size: 10pt;
    font-weight: 500;
    color: #333333;
    width: 100%;
    text-align: center;
}

.numText {
    color: #333333;
    size: 14pt;
    width: 100%;
    text-align: center;
}

.pumNumText {
    font-size: 14pt;
    font-weight: 500;
    color: #333333;
    width: 100%;
    text-align: center;
}

.pumRunningText {
    width: 100%;
    text-align: center;
    font-size: 14pt;
    font-weight: 500;
    color: #2D7EFF;
}

.pumBrokenText {
    color: #FF4D4F;
    width: 100%;
    text-align: center;
    font-size: 14pt;
    font-weight: 500;
}

.pumOfflineText {
    color: #999999;
    width: 100%;
    text-align: center;
    font-size: 14pt;
    font-weight: 500;
}


.notice {
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: #FFDBDC;
    height: 88px;
    margin-top: 10px;
    margin-left: 15pt;
    margin-right: 15pt;
    border-radius: 8pt;
    font-size: 12pt;
}

.noticeIconText {
    color: white;
    font-size: 30px;
    margin-left: 5px;
}

.title {
    margin: 15pt;
    font-size: 30px;
    font-weight: 600;
    color: #333333;
}

.noticeText {
    padding: 10px;
    max-lines: 2;
    word-break: break-word;
}

.noticeLeadingIcon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 8pt;
    width: 76px;
    height: 56px;
    padding: 12px;
    margin-right: 30px;
    background-color: #FF4D4F;
}

.my-swipe .fm-swipe-item {
    font-size: 20px;
    line-height: 30px;
    text-align: center;
}
</style>