<template>
    <div id='container' :style="{ marginTop: `${statusBarHeight}px` }">
    </div>
</template>
<script>
import axios from 'axios';
import { getWindowHeight } from "@/utils/monitor.js";
export default {
    data() {
        return {
            accessToken: this.$storage.get('access_token'),
            formToken: '',
            statusBarHeight: 0,
            iframeHeight: 0,
            formValue: {}
        }
    },
    computed: {
        url() {
            return process.env.VUE_APP_WPG_URL + '/outworkApp/#/pages/index/form?templateCode=pipe_change_template&sysCode=outwork&token=' + this.formToken + '&formValue=' + encodeURIComponent(JSON.stringify(this.formValue))
        }
    },
    created() {
        this.getStatusBarHeight()
        this.getFormToken()
        window.addEventListener('message', this.callBack)
        console.log(this.$route.query.info)
        const info = this.$route.query.info
        if (this.$route.query.equipmentType) {
            if (this.$route.query.equipmentType == 'map_supply_firehydrant') {
                this.formValue.deviceCode = info.fire_cock_code || ''
                this.formValue.deviceType = ['map_supply', 'map_supply_firehydrant']
            } else if (this.$route.query.equipmentType == 'map_supply_valve') {
                this.formValue.deviceCode = info.valve_code || ''
                this.formValue.deviceType = ['map_supply', 'map_supply_valve']
            } else if (this.$route.query.equipmentType == 'rd_map_manhole') {
                this.formValue.deviceCode = info.manhole_code || ''
                this.formValue.deviceType = ['map_drain', 'map_manhole']
            } else if (this.$route.query.equipmentType == 'rd_map_comb') {
                this.formValue.deviceCode = info.comb_code || ''
                this.formValue.deviceType = ['map_drain', 'map_comb']
            } else if (this.$route.query.equipmentType == 'rd_map_outfall') {
                this.formValue.deviceCode = info.outlet_code || ''
                this.formValue.deviceType = ['map_drain', 'map_outfall']
            } else if (this.$route.query.equipmentType == 'rd_map_gate') {
                this.formValue.deviceCode = info.gate_code || ''
                this.formValue.deviceType = ['map_drain', 'map_gate']
            }
            this.formValue.ticketAddress = {
                point: {
                    lng: info.longitude || '',
                    lat: info.latitude || ''
                }
            }
        } else {
            this.formValue.deviceCode = (info.start_code || '') + ',' + (info.end_code || '')
            this.formValue.ticketAddress = {
                point: {
                    lng: info.start_longitude || '',
                    lat: info.start_latitude || ''
                }
            }
        }
        if (info.hasOwnProperty('pipe_category')) {
            this.formValue.deviceType = ['map_supply', 'map_supply_pipe']
        } else if (info.hasOwnProperty('line_type')) {
            this.formValue.deviceType = ['map_drain', 'map_drainpipe']
        } else if (info.hasOwnProperty('category')) {
            this.formValue.deviceType = ['map_recycle', 'map_recycle_pipe']
        }
    },
    beforeDestroy() {
        window.removeEventListener('message', this.callBack)
    },
    methods: {
        callBack(e) {
            if (e.data.data.name == 'navigateBack') {
                this.$router.go(-1);
            }
        },
        getStatusBarHeight() {
            this.statusBarHeight = this.$storage.get('statusBarHeight')
            this.iframeHeight = this.statusBarHeight ? `${getWindowHeight() - this.statusBarHeight}px` : `${getWindowHeight()}px`
        },
        handleMessage() {},
        getFormToken() {
            axios({
                url: process.env.VUE_APP_THIRD_REQUEST_URL + '/main/userCenterApi/sso/tokenByToken',
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