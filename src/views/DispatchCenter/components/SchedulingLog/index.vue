<template>
    <div class="main">
        <fm-nav-bar title="调度日志" left-arrow @click-left="$router.go(-1)" />
        <div class="selectStyle">
            <Select :selectData="dateTypeList" :selValue="dateType" color="white" @getValue="getValue"></Select>
            <Select :selectData="weatherTypeList" :selValue="weatherType" color="white" @getValue="getValue"></Select>
        </div>
        <div class="list-container">
            <fm-pull-refresh style="height: 100%;overflow: overlay;" v-model="refreshing" success-text="刷新成功"
                @refresh="onRefresh">
                <fm-list :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <!-- <fm-cell v-for="(item, index) in logList" :key="index" :title="item.logName" /> -->
                    <div class="infoCard" v-for="(item, index) in logList" :key="index">
                        <img style="width:5px;height:30px;float: left;margin-right: 4px;margin-top: 10px;"
                            src="@assets/img/dispatchCenter/schedulingEvents/标题.png" alt="">
                        <span class="title">调度日志</span>
                        <fm-button text style="float: right;color: #1B67D8;padding: 15px;" @click="jump(item)">查看
                        </fm-button>
                        <div class="under">
                            <div class="under-div"><i class="fm-icon fm-icon-underway-o"></i>
                                &nbsp;{{ item.logTime }}&nbsp;</div>
                            <div class="under-div">&nbsp;{{ item.weather }}</div>
                        </div>
                    </div>
                </fm-list>
            </fm-pull-refresh>
        </div>

    </div>
</template>

<script>
import * as api from './api'
// 下拉选择框
import Select from './Select.vue'
export default {
    name: "SchedulingLog",
    components: { Select },
    data() {
        return {
            // 筛选
            dateTypeList: [
                { type: 1, name: '全部时间', value: '全部时间' },
                { type: 1, name: '近一周', value: '近一周' },
                { type: 1, name: '近一月', value: '近一月' },
                { type: 1, name: '近三月', value: '近三月' },
            ],
            weatherTypeList: [
                { type: 2, name: '全部类型', value: '全部类型' },
                { type: 2, name: '多云', value: '多云' },
                { type: 2, name: '雨', value: '雨' },
                { type: 2, name: '雪', value: '雪' },
                { type: 2, name: '晴', value: '晴' }
            ],
            dateType: '全部时间',
            startDate: "",
            endDate: "",
            weatherType: '全部类型',
            logList: [],
            loading: false,
            finished: false,
            refreshing: false,
            pageNum: 1,
            pageSize: 10,
        }
    },
    watch: {
        dateType: {
            handler(val) {
                this.changeDateweather(val)
                this.getList()
            },
        },
        weatherType: {
            handler(val) {
                this.changeDateweather(val)
                this.getList()
            },
        },
    },
    mounted() {
        this.getList()
    },
    methods: {
        // select框选择回调
        getValue(type, name, value) {
            if (type === 1) {
                this.dateType = value
            } else if (type === 2) {
                this.weatherType = value
            }
        },
        // 页面加载/下拉刷新
        onRefresh() {
            // this.pageReset()
            this.loading = false
            this.finished = false
            this.getList()
        },
        // // 列表加载更多
        onLoad() {
            this.pageNum = this.pageNum + 1
            this.getList()
        },
        // // 重置列表page,list值
        // pageReset() {
        //     this.pageNum = 1
        //     this.logList = []
        // },
        // 获取列表数据
        changeDateweather() {
            let startTime = ''
            switch (this.dateType) {
                case '近一周':
                    startTime = this.$dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
                    break;
                case '近一月':
                    startTime = this.$dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
                    break;
                case '近三月':
                    startTime = this.$dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss')
                    break
                default:
                    startTime = ''
                    break
            }
            this.startDate = startTime
            this.endDate = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        },
        getList() {
            let params = {
                page: 1,
                size: 20,
            }
            this.dateType != '全部时间' ? params.startTime1 = this.startDate : ''
            this.dateType != '全部时间' ? params.endTime1 = this.endDate : ''
            this.weatherType != '全部类型' ? params.weather = this.weatherType : ''
            console.log('params: ', params);
            api.getTableData(params).then(res => {
                console.log('res: ', res);
                if (res.status) {
                    this.logList = res.data.records
                    this.refreshing = false
                    this.loading = false
                    this.finished = true
                }
            })
        },
        jump(item) {
            this.$router.push({
                name: "detailLog",
                query: { item }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    height: 100%;
}

.selectStyle {
    display: flex;
    justify-content: space-between;
    width: 690px;
    margin: 24px auto 12px;
    background-color: #ffffff;
}

.list-container {
    height: calc(100% - 208px);
    overflow: auto;
    background-color: #F5F7F9;

    .infoCard {
        // width: 690px;
        // height: 160px;
        background: #FFFFFF;
        border-radius: 16px;
        margin: 28px;

        .title {
            font-size: 36px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 50px;
            margin-left: 12px;
        }
    }

    .under {
        width: 100%;
        display: flex;
        justify-content: start;
        height: 70px;
        line-height: 70px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        margin-top: 10px;
        margin-left: 22px;

        .under-div {
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #555555;
            line-height: 40px;
        }
    }
}
</style>