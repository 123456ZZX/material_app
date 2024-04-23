<template>
    <div id='container' :style="{ marginTop: `${statusBarHeight}px` }">
    </div>
</template>
<script>
import axios from 'axios';
import { getWindowHeight } from "@/utils/monitor.js";
import API from "@/common/config.js";
export default {
    name:"Correction",
    data() {
        return {
            accessToken: this.$storage.get('access_token'),
            formToken: '',
            statusBarHeight: 0,
            iframeHeight: 0
        }
    },
    computed: {
        url() {
            //API.VUE_APP_WPG_URL
            //http://172.20.79.70
            //http://xasw.hdec.com/third
            // http://172.20.79.70/outworkApp/#/pages/index/form?templateCode=pipe_change_template&sysCode=outwork&token=
            return API.VUE_APP_WPG_URL + '/outworkApp/#/pages/index/form?templateCode=pipe_change_template&sysCode=outwork&token=' + this.formToken
        }
    },
    created() {
        this.getStatusBarHeight()
        this.getFormToken()
    },
    methods: {
        getStatusBarHeight() {
            this.statusBarHeight = this.$storage.get('statusBarHeight')
            this.iframeHeight = this.statusBarHeight ? `${getWindowHeight() - this.statusBarHeight}px` : `${getWindowHeight()}px`
        },
        handleMessage() { },
        getFormToken() {
            axios({
                url: window.location.origin + '/myThirdUrl/main/userCenterApi/sso/tokenByToken',
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
    height: 100%;
    width: 100%;
}
</style>