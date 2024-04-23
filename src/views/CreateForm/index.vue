<template>
    <div id="container" :style="{ marginTop: `${statusBarHeight}px`}">
    </div>    
</template>

<script>
import axios from 'axios';
import { getWindowHeight } from "@/utils/monitor.js";
export default {
    name: 'CreateForm',
    data() {
        return {
            accessToken: this.$storage.get('access_token'),
            statusBarHeight: 0,
            iframeHeight: 0,
            formToken: ''
        }
    },
    computed: {
        url() {
            return process.env.VUE_APP_THIRD_REQUEST_URL + '/outworkApp/#/pages/index/create?sysCode=outwork&token=' + this.formToken
        }
    },    
    mounted() {
      this.getStatusBarHeight()
      this.getFormToken()
    },
    methods: {
        getStatusBarHeight() {
            this.statusBarHeight = this.$storage.get('statusBarHeight')
            this.iframeHeight = this.statusBarHeight ? `${getWindowHeight() - this.statusBarHeight}px` : `${getWindowHeight()}px`
        },
        getFormToken() {
            axios({
                // url: 'http://172.20.79.70/main/userCenterApi/sso/tokenByToken',
                url: process.env.VUE_APP_WPG_URL + '/main/userCenterApi/sso/tokenByToken',
                method: 'post',
                params: {
                    token: this.accessToken
                },
                headers: {
                    'Authorization': 'Basic b3V0d29yazp3cGcyMDIw'
                }
            }).then(res => {
                if (res.status == 200) {
                    this.formToken = res.data.resultData.token
                    let ele = document.createElement('iframe')
                    ele.src = this.url
                    ele.style.height = this.iframeHeight
                    ele.style.width = '100%'
                    ele.style.border = 'none'
                    let node = document.getElementById('container')
                    node.appendChild(ele)
                }
            })
        },        
    }  
}
</script>

<style lang="scss" scoped>
#container {
    width: 100%;
    height: 100%;
}
</style>