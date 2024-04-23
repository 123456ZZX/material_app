<!-- '底部日历组件' -->
<template>
    <div>
        <!-- 日历滑块，显示当前周及前后一周 -->
        <fm-swipe class="my-swipe" indicator-color="white" :show-indicators="false" :initial-swipe="1" :loop="false">
            <fm-swipe-item class="calendarBar">
                <div class="topSide">
                    <div class="singleItem" :class="nowTime === date1 ? 'numSide' : ''" @click="dateClick(date1)">
                        日
                    </div>
                    <div class="singleItem" :class="nowTime === date2 ? 'numSide' : ''" @click="dateClick(date2)">
                        一
                    </div>
                    <div class="singleItem" :class="nowTime === date3 ? 'numSide' : ''" @click="dateClick(date3)">
                        二
                    </div>
                    <div class="singleItem" :class="nowTime === date4 ? 'numSide' : ''" @click="dateClick(date4)">
                        三
                    </div>
                    <div class="singleItem" :class="nowTime === date5 ? 'numSide' : ''" @click="dateClick(date5)">
                        四
                    </div>
                    <div class="singleItem" :class="nowTime === date6 ? 'numSide' : ''" @click="dateClick(date6)">
                        五
                    </div>
                    <div class="singleItem" :class="nowTime === date7 ? 'numSide' : ''" @click="dateClick(date7)">
                        六
                    </div>
                </div>
                <div class="bottomSide">
                    <div class="singleItem" :class="nowTime === date1 ? 'downSide' : ''" @click="dateClick(date1)">
                        {{ day1 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date2 ? 'downSide' : ''" @click="dateClick(date2)">
                        {{ day2 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date3 ? 'downSide' : ''" @click="dateClick(date3)">
                        {{ day3 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date4 ? 'downSide' : ''" @click="dateClick(date4)">
                        {{ day4 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date5 ? 'downSide' : ''" @click="dateClick(date5)">
                        {{ day5 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date6 ? 'downSide' : ''" @click="dateClick(date6)">
                        {{ day6 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date7 ? 'downSide' : ''" @click="dateClick(date7)">
                        {{ day7 }}
                    </div>
                </div>
            </fm-swipe-item>
            <fm-swipe-item class="calendarBar">
                <div class="topSide">
                    <div class="singleItem" :class="nowTime === date8 ? 'numSide' : ''" @click="dateClick(date8)">
                        日
                    </div>
                    <div class="singleItem" :class="nowTime === date9 ? 'numSide' : ''" @click="dateClick(date9)">
                        一
                    </div>
                    <div class="singleItem" :class="nowTime === date10 ? 'numSide' : ''" @click="dateClick(date10)">
                        二
                    </div>
                    <div class="singleItem" :class="nowTime === date11 ? 'numSide' : ''" @click="dateClick(date11)">
                        三
                    </div>
                    <div class="singleItem" :class="nowTime === date12 ? 'numSide' : ''" @click="dateClick(date12)">
                        四
                    </div>
                    <div class="singleItem" :class="nowTime === date13 ? 'numSide' : ''" @click="dateClick(date13)">
                        五
                    </div>
                    <div class="singleItem" :class="nowTime === date14 ? 'numSide' : ''" @click="dateClick(date14)">
                        六
                    </div>
                </div>
                <div class="bottomSide">
                    <div class="singleItem" :class="nowTime === date8 ? 'downSide' : ''" @click="dateClick(date8)">
                        {{ day8 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date9 ? 'downSide' : ''" @click="dateClick(date9)">
                        {{ day9 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date10 ? 'downSide' : ''" @click="dateClick(date10)">
                        {{ day10 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date11 ? 'downSide' : ''" @click="dateClick(date11)">
                        {{ day11 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date12 ? 'downSide' : ''" @click="dateClick(date12)">
                        {{ day12 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date13 ? 'downSide' : ''" @click="dateClick(date13)">
                        {{ day13 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date14 ? 'downSide' : ''" @click="dateClick(date14)">
                        {{ day14 }}
                    </div>
                </div>
            </fm-swipe-item>
            <fm-swipe-item class="calendarBar">
                <div class="topSide">
                    <div class="singleItem" :class="nowTime === date15 ? 'numSide' : ''" @click="dateClick(date15)">
                        日
                    </div>
                    <div class="singleItem" :class="nowTime === date16 ? 'numSide' : ''" @click="dateClick(date16)">
                        一
                    </div>
                    <div class="singleItem" :class="nowTime === date17 ? 'numSide' : ''" @click="dateClick(date17)">
                        二
                    </div>
                    <div class="singleItem" :class="nowTime === date18 ? 'numSide' : ''" @click="dateClick(date18)">
                        三
                    </div>
                    <div class="singleItem" :class="nowTime === date19 ? 'numSide' : ''" @click="dateClick(date19)">
                        四
                    </div>
                    <div class="singleItem" :class="nowTime === date20 ? 'numSide' : ''" @click="dateClick(date20)">
                        五
                    </div>
                    <div class="singleItem" :class="nowTime === date21 ? 'numSide' : ''" @click="dateClick(date21)">
                        六
                    </div>
                </div>
                <div class="bottomSide">
                    <div class="singleItem" :class="nowTime === date15 ? 'downSide' : ''" @click="dateClick(date15)">
                        {{ day15 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date16 ? 'downSide' : ''" @click="dateClick(date16)">
                        {{ day16 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date17 ? 'downSide' : ''" @click="dateClick(date17)">
                        {{ day17 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date18 ? 'downSide' : ''" @click="dateClick(date18)">
                        {{ day18 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date19 ? 'downSide' : ''" @click="dateClick(date19)">
                        {{ day19 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date20 ? 'downSide' : ''" @click="dateClick(date20)">
                        {{ day20 }}
                    </div>
                    <div class="singleItem" :class="nowTime === date21 ? 'downSide' : ''" @click="dateClick(date21)">
                        {{ day21 }}
                    </div>
                </div>
            </fm-swipe-item>
        </fm-swipe>
    </div>
</template>

<script>
import { Swipe, SwipeItem } from 'fawkes-mobile-lib'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
    },
    data() {
        return {
            day1: '',
            day2: '',
            day3: '',
            day4: '',
            day5: '',
            day6: '',
            day7: '',
            day8: '',
            day9: '',
            day10: '',
            day11: '',
            day12: '',
            day13: '',
            day14: '',
            day15: '',
            day16: '',
            day17: '',
            day18: '',
            day19: '',
            day20: '',
            day21: '',
            // ----------
            date1: '',
            date2: '',
            date3: '',
            date4: '',
            date5: '',
            date6: '',
            date7: '',
            date8: '',
            date9: '',
            date10: '',
            date11: '',
            date12: '',
            date13: '',
            date14: '',
            date15: '',
            date16: '',
            date17: '',
            date18: '',
            date19: '',
            date20: '',
            date21: '',
            // ----------
            nowTime: '', // 当前时间，用于选中上色
        }
    },
    created() {
        this.nowTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss') // 2022-08-12 17:09:11
        let nowDay = new Date().getDay() // 获取星期(0-6, 0代表星期天)
        if (nowDay == 0) nowDay = -1
        let sevenDay = [-1, 1, 2, 3, 4, 5, 6]
        let less = sevenDay.filter((item) => {
            return item < nowDay
        })
        let more = sevenDay.filter((item) => {
            return item > nowDay
        })
        let dayArr = [] // 存放星期几
        let dateArr = [] // 存放完整日期
        let lessLength = 7 + less.length
        let moreLength = 7 + more.length
        for (let i = 0; i <= lessLength; i++) {
            dayArr.push(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * i).getDate()) // i = 0包含当前日期
            dateArr.push(
                this.$dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * i)).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
            ) // i = 0包含当前日期
        }
        let allDayArr = dayArr.reverse()
        let allDateArr = dateArr.reverse()
        for (let i = 1; i <= moreLength; i++) {
            allDayArr.push(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * i).getDate())
            allDateArr.push(
                this.$dayjs(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * i)).format(
                    'YYYY-MM-DD HH:mm:ss'
                )
            )
        }
        // console.log(allDateArr)
        allDayArr.forEach((item, index, arr) => {
            this['day' + `${index + 1}`] = arr[index]
        })
        allDateArr.forEach((item, index, arr) => {
            this['date' + `${index + 1}`] = arr[index]
            // console.log(this['date' + `${index + 1}`])
        })
    },
    methods: {
        dateClick(date) {
            console.log(date)
            this.nowTime = date;
            this.$emit('dateClick', date)
        },
    },
}
</script>

<style lang="less" scoped>
.my-swipe {
    // width: 690px;
    height: 150px;
    margin: 0 auto;
    margin-top: 10px;
    // box-shadow: 0 0 10px #ccc;
    // background-color: rgb(255, 70, 209);
}

.my-swipe .calendarBar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .topSide {
        height: 50%;
        display: flex;
        justify-content: space-around;
        // background-color: #027aff;
    }

    .bottomSide {
        height: 50%;
        display: flex;
        justify-content: space-around;
        // background-color: #ff0000;
    }
}

.singleItem {
    // width: 13%;
    width: 90px;
    text-align: center;
    line-height: 70px;
    transition: all .5s;
}

.numSide {
    color: #ffffff;
    font-weight: 700;
    background: linear-gradient(90deg, #247BFD 0%, #3AA0EE 100%);
    border-radius: 50% 50% 0 0;

}

.downSide {
    position: relative;
    color: #1B67D8;
    line-height: 70px;
    font-weight: 700;
    background: linear-gradient(90deg, #247BFD 0%, #3AA0EE 100%);
    border-radius: 0 0 50% 50%;
    z-index: -1;

    &::after {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      display: inline-block;
      content: '';
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #ffffff;
      z-index: -1;
    }
}
</style>
