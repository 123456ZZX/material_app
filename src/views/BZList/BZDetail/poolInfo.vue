<template>
    <fm-list class="content">
        <div class="card" v-for="item, index in poolData" :key="index" :title="index">
            <div class="row">
                <img class="icon" src="@/assets/img/BZList/poolIcon.png"/>
                <div class="title">{{index+1}}.{{poolData[index].poolName==null?'未获取到数据':poolData[index].poolName}}</div>
            </div>
            <div class="row">
                <div class="childCard">
                    <div class="childValueL">{{poolData[index].poolLevel==null?'未获取到数据':poolData[index].poolLevel}}</div>
                    <div class="childTitle">水池液位</div>
                </div>
                <div class="childCard">
                    <div class="childValueR">{{poolData[index].upperWaterLevel==null?'未获取到数据':poolData[index].upperWaterLevel}}</div>
                    <div class="childTitle">上限液位</div>
                </div>
            </div>
            <div class="row">
                <div class="blueIcon"></div>
                <div class="cardText">更新时间: {{poolData[index].poolLevelUpdateTime==null?'未获取到数据':poolData[index].poolLevelUpdateTime}}</div>
            </div>
            <div class="row">
                <div class="blueIcon"></div>
                <div class="cardText">近次清洗: {{poolData[index].clearTime==null?'未获取到数据':poolData[index].clearTime}}</div>
            </div>
        </div>
    </fm-list>
</template>
<script>
export default{
    props:{
        poolData:{
            type:Array
        }
    },
    data() {
        return {
            list:[
                '1',
                '2',
                '3',
            ]
        }
    },
}
</script>
<style style lang="less" scoped>
.card{
    width: 690px;
    height: 448px;
    border-radius: 16px;
    background-color: #FFFFFF;
    margin-top: 20px;
}
.row{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px;
}
.icon{
    width: 48px;
    height: 48px;
    size: 10px;
    margin-right: 20px;
    margin-left: 10px;
}
.title{
    font-weight: 600;
    color: #191919;
    font-size: 32px;
    height: 32px;
    line-height: 32px;
    max-lines: 1;
    width: 600px;
    overflow-y: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    color: #333333;
}
.childCard{
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-right: 10px;
    margin-left: 10px;
    width: 304px;
    height: 120px;
    background-color: #F5F7F9;
    border-radius: 8px;
    align-items: center;
    justify-content: space-around;
}
.childValueL{
    color: #2D7EFF;
    max-width: 300px;
    height: 64px;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 32px;
    font-weight: 600;
}
.childValueR{
    max-width: 300px;
    height: 64px;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #FF4D4F;
    font-size: 32px;
    font-weight: 600;
}
.childTitle{
    font-size: 28px;
    height: 28px;
    line-height: 28px;
    overflow: hidden;
    color: #333333;
    font-weight: 400;
}
.cardText{
    margin-left: 10px;
    margin-right: 10px;
    font-size: 24px;
    font-weight: 400;
    color: #333333;
}
.blueIcon{
    display: flex;
    margin-right: 20px;
    margin-left: 10px;
    width: 12px;
    height: 12px;
    border-radius: 100px;
    background-color: #2D7EFF;
}
.content{
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>