<template>
    <div class="content">
        <div class="floatBtn">
            <img src="@/assets/img/BZList/zuTaiBtn.png" @click="showPopup">
        </div>
        <fm-popup class="www" :visible.sync="show" position="bottom" :style="{ height: '30%' }">
            <fm-picker title="组态列表" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel"
                @change="onChange" />
        </fm-popup>
        <div class="floatBtn1">
            <i class="fm-icon fm-icon-arrow-left" @click="back"></i>
        </div>
        <iframe v-if="url!=''&&url!=null&&url.includes('http')" id="webView" width="100%" height="100%"
            :src='url'>
        </iframe>
        <template>
            <div style="color:white;text-align: center;padding-top: 50%;">暂无数据</div>
        </template>
    </div>
</template>
<script>
import request from '@/utils/request'
export default {
    components: {
        request,
    },
    mounted() {
        this.id = this.$route.query.id
        request({
                url: '/xasw-pump/pump/app/getConfiguration',
                method: 'get',
                params:
                {
                    pumpId: this.id,
                }
            }).then((res) => {
                this.tempArr = this.tempArr.concat(res.data)
                this.url=res.data[0].confUrl
                this.tempArr.forEach((item, index) => {
                    this.columns = this.columns.concat(item.areaLocation)
                })
                console.log(this.url)
            }).finally(() => {

            })
        console.log(this.tappedObject)
    },
    data() {
        return {
            id: '',
            tempArr: [],
            show: false,
            columns: [],
            url:''
        }
    },
    methods: {
        back() {
            this.$router.replace('/BZList')
        },
        onConfirm(value, index) {
            this.show=!this.show
            this.url=this.tempArr[index].confUrl
        },
        onChange(picker, value, index) {
            
        },
        onCancel() {
            this.show=!this.show
        },
        showPopup() {
            this.show = !this.show;
        },
    },

}
</script>
<style lang="less" scoped>
.content {
    width: 100%;
    height: 100%;
    background-color: black;
}

.floatBtn {
    color: #ffffff;
    overflow: hidden;
    top: 50px;
    right: 20px;
    height: 200px;
    width: 90px;
    position: fixed;
    z-index: 9999;
}

.www {
    z-index: 9999;
}

.floatBtn1 {
    color: #ffffff;
    overflow: hidden;
    top: 50px;
    left: 20px;
    height: 100px;
    width: 100px;
    position: fixed;
    z-index: 9998;
}
.main {

    .no-data-text-descripe {
        font-size: 32px;
        font-weight: 400;
        color: #999999;
    }

    .no-data-text {
        display: flex;
        align-items: center;
        color: white;
        justify-content: center;
    }

    .no-data-img {
        margin: 200px 95px 0 95px;
    }

}
</style>