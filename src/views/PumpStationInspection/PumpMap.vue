<template>
  <div>
    <fm-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <fm-swipe-item>
        <div class="item">
          <div class="item-tag">
              <div class="img"></div>
              <div class="imgs"></div>
              <span class="font">10</span>
          </div>
          <div class="item-img"></div>
          <div class="item-content">
            <div class="item-content-icon"></div>
            <div class="item-content-text"></div>
          </div>
        </div>
      </fm-swipe-item>
    </fm-swipe>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  created() {},

  methods: {},
}
</script>

<style scoped lang="scss">
// .fm-swipe-item {
//   font-size: 20px;
//   line-height: 212px;
//   height: 100%;
//   text-align: center;
//   background-color: #39a9ed;
// }

.item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: pink;
  height: 212px;
  box-shadow: 0px 8px 20px 0px rgba(180, 197, 226, 1);
  border-radius: 16px;
  padding: 0 34px 0 24px;

  .item-tag {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
    height: 40px;
    background-color: #fff;

    .img {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(180, 197, 226, 1);
    }

    .imgs {
      width: 10px;
      height: 10px;
      background-color: red;
      z-index: 1;
    }

    .font {
      font-size: 14px;
       z-index: 1;
    }
  }

  .item-img {
    width: 232px;
    height: 132px;
    background-color: #eee;
  }

  .item-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 320px;
    height: 132px;
    background-color: #eee;

    .item-content-icon {
      height: 48px;
      background-color: #fff;
    }
    .item-content-text {
      height: 68px;
      background-color: #fff;
    }
  }
}
</style>
