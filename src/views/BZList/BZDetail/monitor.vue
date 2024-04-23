<template>
    <div class="content">
        <video poster="@/assets/img/BZList/no-data-img.png" style="width:100%;height:220px" id="myVideo"
            class="video-js vjs-default-skin vjs-big-play-centered" preload="auto">
            <!-- <source> -->
        </video>
        <div class="list">
            <fm-grid :column-num="2" :gutter="20">
                <div class="row" v-for="item,index in videoData" :key="index" :title="index">
                    <fm-button v-if="Active==index" class="button" plain color="#2D7EFF" @click="onclick(index)">
                        {{item.monitorName}}
                    </fm-button>
                    <fm-button v-else class="button" color="#68737F" plain @click="onclick(index)">
                        {{item.monitorName}}
                    </fm-button>
                </div>
            </fm-grid>
        </div>
    </div>
</template>

<script>
import "video.js/dist/video-js.css";
import videojs from "video.js";
import "videojs-contrib-hls";
import request from '@/utils/request'
export default {
    props: {
        videoData: {
            type: Array
        }
    },
    watch:{ 
       videoData:{
        handler(){
          this.videoData.length > 0 &&   this.onclick(0)
        },
        deep: true
       }
    },
    components: {
        request
    },
    mounted() {

    },
    data() {
        return {
            videoURL: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
            Active: 0,
            videoStream: '',
        }
    },
    //卸载video
    destroyed() {
        this.myVideo.dispose()
    },
    methods: {
        onclick(index) {
            this.Active = index
            request({
                url: '/xasw-pump/pump/app/getVideoByCode',
                method: 'get',
                params:
                {
                    cameraIndexCode: this.videoData[index].cameraIndexCode,
                    videoId:this.videoData[index].videoId,
                }
            }).then((res) => {
                this.menulistClick(res.data)
            })
        },
        //重制视频源
        menulistClick(data) {
            this.myVideo.reset(); //重置 video
            this.myVideo.src([
                {
                    // type: 'application/x-mpegURL',
                    src: data,
                },
            ]);
            this.myVideo.load();
            this.myVideo.play();
        }
    },
    mounted() {
        //初始化video
        this.myVideo = videojs(
            "myVideo",
            {
                bigPlayButton: true,
                textTrackDisplay: false,
                posterImage: true,
                errorDisplay: false,
                controlBar: true
            },
        );
        this.onclick(0)
    },
}
</script>
<style lang="less" scoped>
.content {
    margin-top: 10px;
}

.row {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: center;

}

.button {
    border-radius: 16px;
    width: 334px;
    height: 100px;
    margin-top: 20px;
    margin-right: 10px;
}

.vjs-big-play-button .vjs-icon-placeholder {
    font-size: 1.63em !important;
}

.list {
    overflow-x: hidden;
    overflow-y: scroll;
    height: 800px;
}

.vjs-paused .vjs-big-play-button,
.vjs-paused.vjs-has-started .vjs-big-play-button {
    display: block !important;
}
</style>