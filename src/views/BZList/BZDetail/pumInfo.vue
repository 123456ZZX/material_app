<template>
<div>
    <div class="card" v-for="(item,index) in pumpData" :key="index" :title="index">
        <div class="column">
            <div class="rowParent">
                <div class="rowChild">
                    <img src="@/assets/img/BZList/GScamera.png" class="camera"/>
                    <div class="title">{{item.name}}</div>
                </div>
                <div class="rowChild">
                    <fm-tag round type="primary" class="tag">{{item.deviceStatus}}</fm-tag>
                    <fm-tag v-if="item.runStatus!=null&&item.runStatus=='运行中'" round type="success" class="tag">{{item.runStatus}}</fm-tag>
                    <fm-tag v-else-if="item.runStatus!=null&&item.runStatus=='故障'" round type="danger" class="tag">{{item.runStatus}}</fm-tag>
                    <fm-tag v-else-if="item.runStatus!=null&&item.runStatus=='离线'" round type="info" class="tag">{{item.runStatus}}</fm-tag>
                </div>
            </div>
            <div class="rowParent">
                <div class="childCard">
                    <div class="startUptimes">{{item.startUpNum==null?0:item.startUpNum}}</div>
                    <div class="runningTimes">启动总次数</div>
                </div>
                <div class="childCard">
                    <div class="startTime">{{item.operationTime==null?0:item.operationTime}}</div>
                    <div class="runningTimes">本月运行时长</div>
                </div>
                <div class="childCard">
                    <div class="childCardTitle">{{item.scrapDate==null?0:item.scrapDate}}</div>
                    <div class="runningTimes">距报废</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default{
    name:'pumInfo',
    mounted(){
    },
    props:{
        pumpData:{
            type:Array,
            default:[],
        }
    },
    data() {
        return {
        }
    },
}

</script>
<style lang="less" scoped>
    .rowChild{
        display: flex;
        align-items: center;
    }
    .rowParent{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .startUptimes{
        margin-bottom: 13pt;
        color: #2D7EFF;
        font-size: 36px;
    }
    .startTime{
        margin-bottom: 13pt;
        color: #2D7EFF;
        font-size: 36px;
    }
    .childCardTitle{
        margin-bottom: 13pt;
        color: red;
        font-size: 36px;
    }
    .runningTimes{
        color: #555555;
        font-size: 24px;
    }
    .column{
        margin-top: 15pt;
        padding-left: 15pt;
        padding-right: 15pt;
        padding-bottom: 15pt;
        width: 100%;
    }
    .tag{
        align-items: center;
        justify-content: center;
        width: 90px;
        height:50px ;
        margin-left: 10pt ;
        font-size: small;
    }
.card{
    display: flex;
    justify-content: space-between;
    height: 147pt;
    width: 96%;
    border-radius: 16px;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    background-color: rgb(255, 255, 255);
    margin: 24px auto;
}
    .childCard{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 78pt;
        width: 32%;
        border-radius: 16px;
        background-color: #F5F7F9;
        margin-top: 15pt;
    }
.title{
    height: 56px;
    line-height: 28px;
    width: 300px;
    overflow-y: hidden;
    text-overflow: ellipsis;
    font-size: 28px;
    font-weight: 600;
    color: #333333;
}
.camera{
    width: 48px;
    height: 48px;
    margin-right: 10pt;
}
</style>