<template>
  <div class="more-container">
    <fm-nav-bar
      title="首页应用"
      left-text=""
      right-text=""
      left-arrow
      @click-left="$router.go(-1)"
      textColor="#027AFF"
      ><div slot="right" style="color: #027aff" @click="edit">
        {{ edited ? '完成' : '编辑' }}
      </div>
    </fm-nav-bar>
    <div class="main-container">
      <div class="more-box">
        <div class="box-bar">
          <div>我的应用</div>
        </div>
        <fm-grid :cols="4" :show-vertical-dividers="false" :show-lr-borders="false" class="grid">
          <fm-grid-item
            v-for="(item, index) in myTempAppList"
            :key="index"
            @click.native="handleAction(item, 'remove')"
            :text="$t(item.title)"
          >
            <template slot="icon">
              <!-- 编辑状态下且非默认应用可删除 -->
              <i class="fm-icon fm-icon-delete" v-if="edited && !item.isFixed"></i>
              <div class="app-img-container">
                <img class="app-img-content" :src="item.src" />
              </div>
            </template>
          </fm-grid-item>
        </fm-grid>
      </div>

      <div class="more-box">
        <div class="box-bar">
          <div>全部应用</div>
        </div>
        <fm-grid :cols="4" :show-vertical-dividers="false" :show-lr-borders="false" class="grid">
          <fm-grid-item
            v-for="(item, index) in appList"
            :key="index"
            @click.native="handleAction(item, 'add')"
            :text="$t(item.title)"
          >
            <!-- 编辑状态下，非默认应用且不在我的应用列表中则可添加 -->
            <template slot="icon">
              <i
                class="fm-icon fm-icon-add"
                v-if="
                  edited &&
                  !item.isFixed &&
                  myTempAppList.findIndex((app) => app.id == item.id) == -1
                "
              ></i>
              <div class="app-img-container">
                <img class="app-img-content" :src="item.src" alt />
              </div>
            </template>
          </fm-grid-item>
        </fm-grid>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { NavBar,Image, Grid, GridItem, Toast ,Icon} from "fawkes-mobile-lib";
import {ALL_APP_LIST} from '@/common/constant'
import {deepClone} from '@/utils/util'
import {QUICK_ACCESS_AREA} from '@/store/Getter/getterTypes.js'
import { SET_QUICK_ACCESS_AREA } from '@/store/Mutation/mutationTypes'
export default {
  components: {
    [NavBar.name]: NavBar,
    [Image.name]: Image,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Toast.name]: Toast,
    [Icon.name]: Icon,
  },
  data () {
    return {
      // 是否为编辑状态
      edited: false,
      appList: ALL_APP_LIST,
      newUser: false,
      appArray: [],
      // 临时存放我的应用列表
      myTempAppList: []
    }
  },
  computed: {
    myAppList(){
      return this.$store.getters[QUICK_ACCESS_AREA]
    }
  },
  created() {
    //从状态管理获取当前的应用列表
     this.myTempAppList = deepClone(this.myAppList)
  },
  methods: {
    edit () {
      if (this.edited) {
        this.$storage.set("quickAccessArea",JSON.stringify(this.myTempAppList))
        this.$store.commit(SET_QUICK_ACCESS_AREA,this.myTempAppList)
        this.edited = !this.edited
      } else {
        this.edited = !this.edited
      }
    },
    // 增加
    add (val) {
      if(this.myTempAppList.length > 6){
        return Toast("首页应用不能超过7个，请移除应用后再操作")
      }
      // 编辑状态，且该应用不在【我的应用】列表中时添加
      if (this.edited && this.myTempAppList.findIndex(app => app.id == val.id) == -1) {
        this.myTempAppList.push(val)
      }
    },
    // 移除
    remove (val) {
      // 从我的应用中移除
      this.myTempAppList.splice(
          this.myTempAppList.findIndex((e) => {
            return e.id == val.id
          }),
          1
        )
      this.$store.commit(SET_QUICK_ACCESS_AREA, this.myAppList.filter(app => app.id != val.id))
    },
    handleAction (app, action) {
      // 编辑情况下路由不可跳转,只能增加或移除应用
      if(this.edited) {
        /*
        * 从全部应用添加到我的应用，其中isFixed表示是否为默认显示且不可操作的应用，本项目中为通讯录
        * 新增，同时该应用不为默认应用，且不在我的应用列表中
        **/
        if(action == 'add' && !app.isFixed) {
          this.add(app)
        /**
         * 从我的应用退还到全部应用
         * 移除，同时该应用不为默认应用。且在我的应用列表中
         **/
        } else if(action == 'remove' && !app.isFixed && this.myTempAppList.findIndex(el => el.id == app.id) != -1) {
          this.remove(app)
        } else {
          return
        }
      } else if (app.path) {
        this.$router.push(app.path);
      } else {
        Toast("暂未开发");
      }
    }
  },
}
</script>

<style lang="less" scoped>
.fm-hairline--top::after {
  border: none;
}
.more-container {
  height: 100%;
}
.main-container {
  height: calc(100% - 50px);
  overflow: auto;
}
.box-bar {
  font-size: 32px;
  padding: 20px;
  font-weight: 500;
}
/deep/.fm-grid-item__content::after {
  border: none;
}
.grid {
  background-color: #ffffff;
  margin-bottom: 8px;
  padding: 20px 20px 10px;
  text-align: center;
}
/deep/.fm-grid {
  align-items: flex-start;
}
/deep/.fm-grid-item__text {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.fm-grid-item__content {
  align-items: stretch;
}
.fm-icon {
  position: absolute;
  top: -5px;
  right: -16px;
  font-size: 30px;
}
.fm-icon-add {
  color: #347df6;
}
.fm-icon-delete {
  color: #f32111;
}
.app-img-container {
  overflow: hidden;
  text-align: center;
  margin: 0 auto;
}
.app-img-content {
  width: 70px;
  height: 70px;
}
</style>
