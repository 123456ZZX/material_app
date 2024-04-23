<template>
	<div class="main">
		<img :src="require('@/assets/img/blueBg.png')" class="main-bg" />
		<fm-nav-bar title="厂站列表" left-arrow @click-left="$router.replace('/index')">
			<template #right>
				<div class="actionSlots">
					<img class="actions" src="@/assets/img/BZList/mapIcon.png" />
				</div>
				<div class="actionText" @click="$router.replace('/BZList/pumpMap')">地图</div>
			</template>
		</fm-nav-bar>
		<div class="content">
			<img :src="bgSrc" class="bgImg"
				:class="selectedTab == '全部' ? 'left' : selectedTab == '供水' ? 'middle1' : selectedTab == '雨水'? 'middle2' : 'right'" />
			<fm-tabs v-model="selectedTab" @tab-click="changeType" line-width="60px">
				<fm-tab name="全部" :label="all"></fm-tab>
				<fm-tab name="供水" :label="supplyWater"></fm-tab>
				<fm-tab name="雨水" :label="rain"></fm-tab>
				<fm-tab name="污水" :label="dirtWater"></fm-tab>
			</fm-tabs>
			<div class="main-container">
				<div>
					<template v-if="AllList.length==0 && !loading">
						<div class="no-data-img">
							<fm-image fit="cover" :src="require('@/assets/img/no-data-img.png')" />
						</div>
						<div class="no-data-text">
							<div class="no-data-text-descripe">暂无数据</div>
						</div>
					</template>
					<div v-for="(item, index) in AllList" :key="index" @click="goDetail(AllList[index])">
						<transition name="fm-slide-right">
							<div v-if="item.pumpType==selectedTab">
								<WaterCard :title="item.pumpName"
								:location="item.address" :StationType="item.pumpType" />
							</div>
						</transition>
						<transition name="fm-slide-right">
							<WaterCard v-if="selectedTab=='全部'" :title="item.pumpName"
								:location="item.address" :StationType="item.pumpType" />
						</transition>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import {
	NavBar,
	Search,
	Toast,
	Cell,
	CellGroup,
	PullRefresh,
	List,
	Sidebar,
	SidebarItem,
	SwipeCell,
	Button,
	NoticeBar,
	Icon,
	Dialog,
} from 'fawkes-mobile-lib'
import WaterCard from './waterCard.vue'
import request from '@/utils/request'
import rhumbDistance from '@turf/rhumb-distance'
export default {
	components: {
		[NavBar.name]: NavBar,
		[Search.name]: Search,
		[Toast.name]: Toast,
		[Cell.name]: Cell,
		[CellGroup.name]: CellGroup,
		[PullRefresh.name]: PullRefresh,
		[List.name]: List,
		[Sidebar.name]: Sidebar,
		[SidebarItem.name]: SidebarItem,
		[SwipeCell.name]: SwipeCell,
		[Button.name]: Button,
		[NoticeBar.name]: NoticeBar,
		[Icon.name]: Icon,
		[Dialog.name]: Dialog,
		WaterCard
	},
	mounted() {
		Toast.loading({
			message: '加载中...',
			forbidClick: true,
			duration: 0
		})
		this.onRefresh()
	},
	onLoad() {
		this.getData()
	},
	methods: {
		// 获取列表数据
		getData() {
			request({
				url: '/xasw-pump/pump/app/list',
				method: 'get',
				pumpType: '供水',
			}).then((res) => {
				this.AllList = []
				this.AllList = this.AllList.concat(res.data)
				this.AllList.forEach(element => {
					element.pumpType == '供水' ?
						this.GsList = this.GsList.concat(element) :
						element.pumpType == '污水' ?
							this.WsList = this.WsList.concat(element) :
							this.RnList = this.RnList.concat(element)
				});
			}).finally(() => {
				Toast.clear()
				this.loading = false
			})
		},
		// tab切换回调
		changeType(name, title) {
			Toast.loading({
				message: '加载中...',
				forbidClick: true,
				duration: 0
			})
			this.selectedTab = name
			this.onRefresh()
		},
		// 页面加载/下拉刷新
		onRefresh() {
			this.pageReset()
			this.loading = true
			this.finished = false
			this.getData()
		},
		onClear() {
			// 复用刷新接口
			// this.searchParams.reimburseName = ''
			this.onRefresh()
		},
		// 重置列表page,list值
		pageReset() {
			this.pageNum = 1
		},
		// 列表加载更多
		onLoad() {
			// this.pageNum = this.pageNum + 1
			// this.getList()
		},
		// 跳转详情页
		goDetail(tappedObject) {
			this.AllList != '' ?
				this.$router.push({
					path: '/BZList/BZdetail',
					query: {
						GsData: this.GsList,
						WsData: this.WsData,
						RnData: this.RnData,
						tappedObject: tappedObject,
					}
				}) :
				console.log('列表是空的')
			// yuanchu.hikVideoPlayer.preview({
			// 	url: "rtsp://183.134.221.24:554/openUrl/e2Xm7ja",
			// 	playbackUrl: "rtsp://183.134.221.24:554/openUrl/e2Xm7ja"
			// })
		}
	},
	data() {
		return {
			selectedTab: '全部',
			all: '全部',
			supplyWater: '供水',
			rain: '雨水',
			dirtWater: '污水',
			GsList: [],
			WsList: [],
			RnList: [],
			AllList: [],
			refreshing: false, // 下拉刷新是否处于加载中状态，下拉时组件会自动设置true
			loading: false, // 列表加载更多时控制加载状态，加载时组件会自动设置为true，加载完成后需手动设置为false
			finished: false, // 列表加载更多时控制加载状态，全部加载完成时需设置为true
		}
	},

	computed: {
		bgSrc() {
			let src = ''
			switch (this.selectedTab) {
				case '全部':
					src = require('@/assets/img/BZList/LeftTab.png')
					break;

				case '供水':
					src = require('@/assets/img/BZList/middleTab1.png')
					break;

				case '雨水':
					src = require('@/assets/img/BZList/middleTab2.png')
					break;
				case '污水':
					src = require('@/assets/img/BZList/RightTab.png')
					break;
				default:
					src = require('@/assets/img/BZList/LeftTab.png')
					break;
			}
			return src
		},
		text() {
			return this.currentRate.toFixed(0) + '%'
		},
	},
}
</script>

<style lang="less" scoped>
.main {
	background-color: #055ffc !important;
	height: 100%;

	.main-bg {
		position: absolute;
		width: 100%;
	}

	.content {
		margin-top: 40px;
		position: relative;
		background: #d4e8fc;
		height: calc(100% - 46px);
		width: 100%;
		border-top-left-radius: 24px;
		border-top-right-radius: 24px;

		.bgImg {
			position: absolute;
			height: 100px;
			z-index: 1;
			top: -20px;
		}

		.middle1 {
			left: 177px;
		}

		.middle2 {
			right: 177px;
		}

		.right {
			right: 0;
		}
	}
}

// 顶部标题背景色
/deep/.fm-nav-bar__content {
	background-color: transparent;
}

//导航栏右侧按钮
.actions {
	width: 28px;
	height: 28px;
}

.actionText {
	color: #FFFFFF;
	font-size: 28px;
}

/deep/.fm-hairline--bottom::after {
	border-bottom-width: 0;
}

/deep/.fm-nav-bar__title {
	color: #FFFFFF !important;
}

// tab切换栏
// 更改背景色
/deep/.fm-tabs__nav--line {
	background-color: #d4e8fc;
	display: flex;
	align-items: flex-end;
	border-top-left-radius: 24px;
	border-top-right-radius: 24px;
}

/deep/.fm-nav-bar {
	background: transparent;
}

/deep/ .fm-nav-bar .fm-icon {
	color: #FFFFFF !important;
}

// 每个tab高度变低
/deep/.fm-tab {
	line-height: 72px;
	// height: 80%;
	// border-radius: 20px 20px 0px 0px;
	// // background-image: linear-gradient(40deg, #99cc33, #ff6666, #336699, #ff0033);
	// background-image: linear-gradient(180deg, #d0e7ff, #d3e8fe, #dbebff, #ecf4ff);
}

// 取消选中横条
/deep/.fm-tabs__line {
	width: 0 !important;
}

// 选中效果
/deep/.fm-tab--active {
	// 梯形样式
	// height: 0;
	// width: 100px;
	// border-width: 0 20px 90px 20px;
	// border-style: none solid solid;
	// border-color: transparent transparent rgb(141, 247, 155);

	// height: 100%;
	font-size: 32px;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #191919;
}

// 选中tab的文字样式
/deep/.fm-tab--active .fm-tab__text--ellipsis {
	// margin-top: 90px;
	z-index: 1;
}

// select选择框
.selectStyle {
	display: flex;
	justify-content: space-between;
	width: 690px;
	margin: 24px auto 12px;
}

.main-container {
	height: calc(100% - 208px);
	overflow: auto;
	background-color: #d4e8fc;
}

/* 暂无数据begin */
.no-data-img {
	margin: 200px 95px 0 95px;
}

.no-data-text {
	display: flex;
	align-items: center;
	justify-content: center;
}

.no-data-text-descripe {
	font-size: 32px;
	font-weight: 400;
	color: #999999;
}

/* 暂无数据end */
/* 解决下拉时，数据和全部加载的提示文案超出列表元素不显示的问题 */
/deep/ .fm-pull-refresh {
	overflow: visible;
}

.task-container /deep/ .fm-nav-bar__content {
	height: 88px;
}

.task-container /deep/ .fm-nav-bar__title {
	font-size: 36px;
	color: #FFFFFF !important;
	font-weight: 600;
}

.task-container /deep/ .fm-nav-bar .fm-icon {
	color: #027aff !important;
}

.task-container /deep/ .fm-nav-bar__arrow {
	font-size: 48px;
}

.fm-sidebar {
	width: 100%;
	padding-left: 30px;
	padding-right: 30px;
	border-bottom: 2px solid #ebedf0;
}

.actionSlots {
	display: flex;
	flex-direction: row;
	margin-right: 10px;
}

.fm-cell::after {
	border: none;
}

.fm-cell-group {
	margin-top: 24px;
}

/deep/ .fm-swipe-cell__right {
	display: flex;
	align-items: center;
}

/deep/ .fm-button--square {
	border-radius: 50%;
	width: 106px;
	height: 106px;
	padding: 0;
	margin-right: 20px;
}

.bottom {
	position: fixed;
	bottom: 24px;
	right: 44px;
	background-color: #027aff;
	width: 102px;
	height: 102px;
	line-height: 102px;
	border-radius: 50%;
	color: #fff;
	z-index: 1000;
	text-align: center;
}
</style>