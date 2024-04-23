<template>
  <div class="ChangeBizDate">
    <img @click="updateDate('subtract')" src="../imgs/subtract.png" alt="" />
    <div class="dateContainer">{{ nowDate }}</div>
    <img @click="updateDate('addition')" src="../imgs/addition.png" alt="" />
  </div>
</template>

<script>
export default {
  name: 'ChangeBizDate',
  props: {
    dateType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      nowDate: '',
    }
  },
  mounted() {
    this.getNowDate() // 初始化当前日期
  },
  methods: {
    getNowDate() {
      if (this.dateType === '日') {
        this.nowDate = this.$dayjs().format('YYYY年MM月DD日')
      } else if (this.dateType === '月') {
        this.nowDate = this.$dayjs().format('YYYY年MM月')
      } else if (this.dateType === '年') {
        this.nowDate = this.$dayjs().format('YYYY年')
      }
    },
    updateDate(operation) {
      // 将this.nowDate中的汉字替换成'-'，并去掉最后一个'-'
      this.nowDate = this.nowDate.replace(/[\u4e00-\u9fa5]/g, '-').slice(0, -1)
      let unit = ''
      if (this.dateType === '日') {
        unit = 'day'
      } else if (this.dateType === '月') {
        unit = 'month'
      } else if (this.dateType === '年') {
        unit = 'year'
      }

      if (unit) {
        if (operation === 'subtract') {
          this.nowDate = this.$dayjs(this.nowDate)
            .subtract(1, unit)
            .format(`YYYY年${unit === 'day' ? 'MM月DD日' : unit === 'month' ? 'MM月' : ''}`)
        } else if (operation === 'addition') {
          this.nowDate = this.$dayjs(this.nowDate)
            .add(1, unit)
            .format(`YYYY年${unit === 'day' ? 'MM月DD日' : unit === 'month' ? 'MM月' : ''}`)
        }

        let cloneDate = this.nowDate
        cloneDate = cloneDate.replace(/[\u4e00-\u9fa5]/g, '-').slice(0, -1) // 将this.nowDate中的汉字替换成'-'，并去掉最后一个'-'
        // 如果增加后的日期大于当前日期，则不更新日期
        if (this.$dayjs(cloneDate).isAfter(this.$dayjs())) {
          // isAfter() 方法用于检查当前日期是否在指定日期之后
          this.nowDate = this.$dayjs().format(
            `YYYY年${unit === 'day' ? 'MM月DD日' : unit === 'month' ? 'MM月' : ''}`
          )
          console.log('增加后的日期大于当前日期，不更新日期：', this.nowDate)
          return
        }
        this.$emit('dateChange', operation)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.ChangeBizDate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 40px);
  height: 88px;
  background: #ffffff;
  border-radius: 16px;
  padding: 0 20px;

  .dateContainer {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-family: MicrosoftYaHei;
    color: #555555;
  }

  img {
    width: 40px;
    height: 40px;
  }
}
</style>
