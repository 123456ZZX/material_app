<template>
    <div class="card">
        <div class="list">   
                <fm-cell v-for="item,index in doorData" :key="index" :title="index">
                    <template #title>
                        <div class="row">
                            <div class="row">
                                <div class="icon"></div>
                                <div class="cardText">{{doorData[index].time}}</div>
                            </div>
                            <div class="cardText">{{doorData[index].cardOwner}}</div>
                            <div class="cardText">{{doorData[index].passStatus}}</div>
                        </div>
                    </template>
                </fm-cell>
        </div>
    </div> 
</template>
<script>
export default {
    components:{
    },
    props:{
        doorData:{
            type:Array
        },
        id:{
            type:String
        }
    },
    data() {
        return {
            loading: false,
            finished: false,
        };
    },
    methods: {
        onLoad() {

        },
    },
};
</script>
<style lang="less" scoped>
.card{
    padding: 10px;
    display: flex;
    max-height: 900px;
    justify-content: center;
    border-radius: 20px;
    overflow: hidden;
    clip: auto;
}
.list{
    width: 690px;
    height: 100%;
    border-radius: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
}
.row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.cardText{
    margin-left: 10px;
    margin-right: 10px;
}
.icon{
    display: flex;
    margin-right: 20px;
    width: 12px;
    height: 12px;
    border-radius: 100px;
    background-color: #2D7EFF;
}
</style>