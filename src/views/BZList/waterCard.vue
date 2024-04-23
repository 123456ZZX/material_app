<template>
    <div class="card">
        <div class="column">
            <div class="right">
                <div class="tags">
                    <img v-if="StationType==='供水'" src="@/assets/img/BZList/GSTag.png" class="tag"/>
                    <img v-if="StationType==='污水'" src="@/assets/img/BZList/WSTag.png" class="tag"/>
                    <img v-if="StationType==='雨水'" src="@/assets/img/BZList/RNTag.png" class="tag"/>
                </div>
            </div>
            <div class="row">
                <img v-if="StationType==='供水'" src="@/assets/img/BZList/GSside.png" class="header"/>
                <img v-if="StationType==='供水'" src="@/assets/img/BZList/GScamera.png" class="camera"/>
                <img v-if="StationType==='雨水'" src="@/assets/img/BZList/RNSide.png" class="header"/>
                <img v-if="StationType==='雨水'" src="@/assets/img/BZList/RNCamera.png" class="camera"/>
                <img v-if="StationType==='污水'" src="@/assets/img/BZList/WSSide.png" class="header"/>
                <img v-if="StationType==='污水'" src="@/assets/img/BZList/WSCamera.png" class="camera"/>
                <div class="title">{{title}}</div>
            </div>
            <div class="location">
                <img src="@/assets/img/BZList/location.png" class="locIcon"/>
                <div v-if="location!=''" class="locText">{{location}}</div>
                <div v-else class="locText">未获取到位置</div>
            </div>
        </div>

    </div>
</template>
<script>
export default{
    name:'waterCard',
    props:{
        title:{
            type:String,
            default:"0号增压泵站"
        },
        StationType:{
            type:String,
            default:"供水"
        },
        location:{
            type:String,
            default:"位置"
        },
    },
    data() {
        return {
            
        }
    },
}
</script>
<style lang="less" scoped>
.card{
    display: flex;
    justify-content: space-between;
    width: 96%;
    border-radius: 16px;
    box-shadow: 0px 4px 16px 0px rgba(104, 115, 127, 0.06);
    background-color: rgb(255, 255, 255);
    margin: 24px auto;
}
.title{
    margin-top: 5px;
    overflow: hidden;
    margin-left: 10px;
    font-size: 36px;
    text-overflow: ellipsis;
}
.tags{
    display: flex;
    justify-content: flex-end;
}
.header{
    width: 6px;
    height: 42px;
}
.camera{
    width: 48px;
    height: 48px;
    padding-left: 12px;
}
.row{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.column{
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.tag{
    height: 42px;
    width: 130px;
}
.location{
    display: flex;
    margin-top: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    align-items: center;
    overflow-x: auto;
    margin-bottom: 10px;
    .locIcon{
        width: 28px;
        height: 28px;
        margin-left: 20px;
    }
    .locText{
        margin-left: 15px;
        font-size: 28px;
        clip: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #999999;
    }
}

.right{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
}

</style>