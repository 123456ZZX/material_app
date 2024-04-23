<template>
    <div>
        <div class="box">
            <div class="title">
                巡检记录
            </div>
            <div class="moreButton"  @click="goTo('/pump/inspectionManage/')">
                更多<i class="fm-icon fm-icon-arrow"></i>
            </div>
        </div>
        <fm-cell-group inset v-if="maintenance.patrolRecord!=null">
            <fm-cell v-for="(item, index) in maintenance.patrolRecord.slice(0, 2)" :key="index" >
                <template #title>
                    <div>
                        {{item.taskEndTime}} 完成
                    </div>
                </template>
                <template #icon>
                    <div class="icon">
                    </div>
                </template>
                <template #label>
                    <div class="row">
                        <div class="lableText">
                            {{item.patrolRouteName}}
                        </div>
                        <div class="patrolText">巡检</div>
                    </div>
                
                </template>
            </fm-cell> 
        </fm-cell-group>

        <div class="box">
            <div class="title">
                工单记录
            </div>
            <div  class="moreButton" @click="goTo('/FormBase')">
                更多<i class="fm-icon fm-icon-arrow"></i>
            </div>
        </div>
        <fm-cell-group inset v-if="maintenance.workRecord!=null">
            <fm-cell v-for="(item, index) in maintenance.workRecord.slice(0, 2)" :key="index" >
                <template #title>
                    <div>
                        {{item.updateTime}} 完成
                    </div>
                </template>
                <template #icon>
                    <div class="icon">
                    </div>
                </template>
                <template #label>
                    <div style="color:#2D7EFF">
                        {{item.smallTypeName}}{{item.ticketNo}}
                    </div>
                </template>
            </fm-cell> 
        </fm-cell-group>

        <div class="box">
            <div class="title">
                维养记录
            </div>
        </div>
        <fm-cell-group inset v-if="maintenance.maintenanceRemind!=null">
            <fm-cell v-for="(item, index) in maintenance.maintenanceRemind.slice(0, 2)" :key="index" >
                <template #title>
                    <div>
                        {{item.taskEndTime}} 完成
                    </div>
                </template>
                <template #icon>
                    <div class="icon">
                    </div>
                </template>
                <template #label>
                    <div class="mantianceText">
                        {{item.principalName}}/{{item.maintenanceLocation}}/{{item.planName}}
                    </div>
                </template>
            </fm-cell> 
        </fm-cell-group>
    </div>
</template>
<script>
export default{
    name:'mantian',
    props:{
        maintenance:{
            type:Object
        }
    },  
    data() {
        return {
            items:[
            {
                title:'2022/8/22',
                lable:'巡检线路名称'
            },
            {
                title:'2022/8/22',
                lable:'巡检线路名称'
            },
        ]
        }
    },
    methods :{ 
        goTo(url) {
            this.$router.replace(url)
        }
    }
}
</script>
<style lang="less" scoped>
    .title{
        margin: 30px;
        font-size: 32px;
        font-weight: 600;
        color: #333333;
    }
    .box{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .moreButton{
        margin: 30px;
        font-size: 28px;
        color: #2D7EFF;
    }
    .icon{
        display: flex;
        margin-top: 24pt;
        margin-right: 10pt;
        width: 12px;
        height: 12px;
        border-radius: 100pt;
        background-color: #2D7EFF;
    }
    .lableText{
        color: #2D7EFF;
        font-weight: 400;
        font-size: 28px;
    }
    .row{
        display: flex;
        flex-direction: row;
    }
    .mantianceText{
        font-size: 28px;
        font-weight: 400;
        color: #333333;
    }
    .patrolText{
        font-size: 28px;
        color: #333333;
        font-weight: 400;
    }
</style>