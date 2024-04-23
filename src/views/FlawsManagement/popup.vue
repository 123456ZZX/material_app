<template>
    <div style='min-width:80px;min-height:50px;'>
        <div>{{ smallType }} </div>
        <div>{{ deviceCode }}</div>
        <div>{{ lng }},&nbsp;{{ lat }}&nbsp; </div>
        <fm-button @click="fun" icon="success" type="primary" size="mini" style="margin-left: 12px">确认
        </fm-button>
    </div>
</template>
<script>
export default {
    name: "popup",
    props: [
        'detailId',
        "lng",
        "lat",
        "bigType",
        "smallType",
        "deviceCode",
        "fun",
    ],
}
</script>
<style lang="scss" scoped>
div {
    font-size: 22px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 30px;
}
</style>