<template>
	<div class="main">
		<fm-nav-bar title="报警处理" left-arrow @click-left="$router.replace('/BZList')">
		</fm-nav-bar>
		<!-- 底部按钮-->
		<fm-tabbar v-model="actives" style="height: 70px" :fixed="true">
			<div class="bottom">
				<fm-button type="primary" size="large" plain style="border-radius: 40px" @click="cancel">取消</fm-button>
			</div>
			<div class="bottom">
				<fm-button type="primary" size="large" style="border-radius: 40px" is-link @click="formCheck">提交
				</fm-button>
			</div>
		</fm-tabbar>
		<div class="list">
			<div class="content">
				<div class="title">报警内容</div>
				<div class="card">
					<fm-cell-group inset>
						<fm-cell>
							<template #title>
								<div class="row">
									<div class="iconBlue"></div>
									<div class="cardText">报警位置</div>
								</div>
								<div class="info">{{ loc }}</div>
							</template>
						</fm-cell>
						<fm-cell>
							<template #title>
								<div class="row">
									<div class="iconBlue"></div>
									<div class="cardText">报警描述</div>
								</div>
								<div class="info">{{ des }}</div>
							</template>
						</fm-cell>
						<fm-cell>
							<template #title>
								<div class="row">
									<div class="iconBlue"></div>
									<div class="cardText">报警起止时间</div>
								</div>
								<div class="info">{{ beginTime }}{{ endTime }}</div>
							</template>
						</fm-cell>
					</fm-cell-group>
				</div>
				<div class="title">报警处理</div>
				<div class="card">
					<div class="subtitle">处理方式</div>
					<fm-grid :column-num="2" :center="true" :gutter="15">
						<div class="row" v-for="(item, index) in selection" :key="index" :title="index">
							<fm-button v-if="active == index" class="button" plain color="#2D7EFF"
								@click="onclick(index, item.value)">
								{{ item.name }}
							</fm-button>
							<fm-button v-else class="button" color="#68737F" plain @click="onclick(index, item)">
								{{ item.name }}
							</fm-button>
						</div>
					</fm-grid>
				</div>
				<!-- 直接处理 -->
				<transition name="fm-fade">
					<div v-if="active == 0">
						<div class="title">处理后照片</div>
						<div class="imgPicker">
							<fm-uploader v-model="fileList" :preview-full-image="false" :after-read="afterRead"
								:before-delete="beforeDelete" />
						</div>
						<div class="title">报警处理</div>
						<div class="card">
							<fm-field v-model="inputedDeal" rows="4" autosize type="textarea" maxlength="50"
								placeholder="请输入备注信息" show-word-limit />
						</div>
					</div>
				</transition>
				<!-- 转为维修工单 -->
				<transition name="fm-fade">
					<div v-if="active == 1" class="card">
						<fm-popup class="www" :visible.sync="nameShow" position="bottom" :style="{ height: '50%' }">
							<fm-cascader v-model="cascaderValue" title="处理人员" :options="personList"
								@close="nameShow = false" @finish="onFinish" @change="onNameChange" />
						</fm-popup>

						<fm-cell-group style="width: 87%" inset>
							<fm-cell>
								<template #title>
									<div class="row">
										<div class="iconBlue"></div>
										<div class="cardText" @click="showNamePopup">处理人员:</div>
										<div style="color: red">*</div>
									</div>
									<div class="info" @click="showNamePopup">
										{{ filedValue == '' ? '请选处理人' : filedValue }}
									</div>
								</template>
							</fm-cell>
							<fm-cell>
								<template #title>
									<div class="row">
										<div class="iconBlue"></div>
										<div class="cardText">计划开始时间</div>
									</div>
									<div class="info" @click="startDataShowPopup()">
										{{ startDate == '' ? '请选择时间' : startDate }}
									</div>
									<fm-popup class="www" :visible.sync="startDataShow" position="bottom"
										:style="{ height: '40%' }">
										<fm-datetime-picker v-model="startDate" type="datetime" title="选择年月日"
											:formatter="formatter" :min-date="minDate" @confirm="onStartDataConfirm"
											@cancel="onDataCancel" :max-date="maxDate" />
									</fm-popup>
								</template>
							</fm-cell>
							<fm-cell>
								<template #title>
									<div class="row">
										<div class="iconBlue"></div>
										<div class="cardText">计划结束时间</div>
									</div>
									<div class="info" @click="endDataShowPopup()">
										{{ endDate == '' ? '请选择时间' : endDate }}
									</div>
									<fm-popup class="www" :visible.sync="endDataShow" position="bottom"
										:style="{ height: '40%' }">
										<fm-datetime-picker v-model="endDate" type="datetime" title="选择年月日"
											:formatter="formatter" :min-date="minDate" @confirm="onEndDataConfirm"
											@cancel="onDataCancel" :max-date="maxDate" />
									</fm-popup>
								</template>
							</fm-cell>
						</fm-cell-group>
					</div>
				</transition>
				<!-- 转为调度工单 -->
				<transition name="fm-fade">
					<div v-if="active == 2" class="card">
						<div class="title">报警处理</div>
						<div class="card">
							<fm-field v-model="inputedTrans" rows="4" autosize type="textarea" maxlength="50"
								placeholder="请输入备注信息" show-word-limit />
						</div>
						<div class="tip">注：将该报警事件转交调度管理系统处理！</div>
					</div>
				</transition>
				<!-- 关闭报警 -->
				<transition name="fm-fade">
					<div v-if="active == 3">
						<div class="warning">该报警事件鉴定为系统误报！</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>
<script>
import {
	Dialog,
	Toast,
} from 'fawkes-mobile-lib'
import request from '@/utils/request'
import { pick } from 'lodash'
import storage from '@/utils/storage'
export default {
	components: {
		request,
		[Dialog.name]: Dialog,
		[Toast.name]: Toast,
	},
	mounted() {
		this.loc = this.$route.query.loc
		this.des = this.$route.query.des
		this.beginTime = this.$route.query.beginTime
		this.endTime = this.$route.query.endTime
		this.tappedObjects = this.$route.query.tappedObjects
		this.liveData = this.$route.query.liveData

	},
	data() {
		return {
			selectIndexList: [],
			//页面传参
			loc: '',
			des: '',
			beginTime: '',
			endTime: '',
			tappedObjects: {},
			liveData: {},
			//组件控制
			active: 0,
			actives: 0,
			cascaderValue: '',
			options: [],
			nameShow: false,
			nameColumns: [],
			personList: [],
			startDataShow: false,
			endDataShow: false,
			selection: [
				{
					name: '直接处理',
					value: '直接处理',
				},
				{
					name: '转为维修工单',
					value: '转为维修工单',
				},
				{
					name: '转为调度工单',
					value: '转为调度工单',
				},
				{
					name: '关闭报警',
					value: '关闭报警',
				},
			],
			filedValue: '',
			persons: [],
			fileList: [],
			minDate: new Date(2020, 0, 1),
			maxDate: new Date(2025, 10, 1),
			fileUpLoaded: 'uploading',
			//表单数据
			handler: '',
			id: '',
			selectedName: '',
			startDate: '',
			endDate: '',
			inputedDeal: '',
			inputedTrans: '',
			file: [],
			fileSize: 0,
			url: '',
			uid: '',
			fileData: [],
		}
	},
	methods: {
		//获取部门数据
		getPerson() {
			request({
				url: '/sys-user/orgs/tree',
				method: 'get',
				params: {
					portalId: '1302785644422082562',
					isAll: false,
				},
			})
				.then((res) => {
					this.reDealData(res.data, this.personList)
					console.log(this.personList)
					console.log(res.data)
				})
				.finally(() => { })
		},
		//获取人员数据
		getList(picker) {
			request({
				url: '/sys-user/users/page',
				method: 'get',
				params: {
					orgNo: picker.value,
					pageSize: 10,
					pageNo: 1,
					accountStatus: 1,
				},
			})
				.then((res) => {
					res.data.list.forEach((item) => {
						this.persons.push({
							text: item.userFullname,
							value: item.id,
						})
					})

					this.dealPersonData(picker, this.persons)
				})
				.finally(() => { })
		},
		//处理公司列表数据
		reDealData(data, result) {
			data.forEach((element, index) => {
				if (element.hasOwnProperty('children')) {
					result.push({
						text: element.content.name,
						value: element.content.orgNo,
						children: [],
					})
					this.reDealData(element.children, result[index].children)
				} else {
					result.push({
						text: element.content.name,
						value: element.content.orgNo,
						children: [],
					})
				}
			})
		},
		//处理人员数据 暂时硬编码 后续可优化
		dealPersonData(picker, personsList) {
			let pickerList = []
			picker?.selectedOptions?.forEach((item) => {
				pickerList.push(item.text)
			})
			this.personList.forEach((oneItem, oneIndex) => {
				if (oneItem.text === pickerList[0]) {
					oneItem.children.forEach((twoItem, twoIndex) => {
						if (twoItem.text === pickerList[1]) {
							twoItem.children.forEach((threeItem, threeIndex) => {
								if (threeItem.text === pickerList[2]) {
									this.personList[oneIndex].children[twoIndex].children[threeIndex].children =
										personsList
								}
							})
						}
					})
				}
			})
			console.log(this.personList);

		},
		formatter(type, val) {
			if (type === 'year') {
				return `${val}年`
			} else if (type === 'month') {
				return `${val}月`
			} else if (type === 'day') {
				return `${val}日`
			} else if (type === 'hour') {
				return `${val}时`
			} else if (type === 'minute') {
				return `${val}分`
			}
			return val
		},
		//文件上传
		uploadFile(file) {
			const data = new FormData()
			data.append('file', file)
			request({
				url: '/sys-storage/upload',
				method: 'post',
				data: data,
			}).then((res) => {
				this.fileData = res.data
				if (!res.status) {
					this.fileUpLoaded = 'failed'
				} else {
					this.fileUpLoaded = 'done'
				}
			}).finally(() => {
				file.status = this.fileUpLoaded;
				this.fileUpLoaded == 'done' ?
					file.message = '上传成功' :
					this.fileUpLoaded == 'failed' ?
						file.message = '上传失败' :
						file.message = '上传中...';
			})
		},
		//表单上传
		upload() {
			request({
				url: '/xasw-pump/pump/alarm-record/handle',
				method: 'put',
				data: {
					"alarmRecord": {
						"beginTime": this.liveData.alarmRecord.beginTime,
						"deviceName": this.liveData.alarmRecord.deviceName,
						"duration": this.liveData.alarmRecord.duration,
						"endTime": this.liveData.alarmRecord.endTime,
						"equipmentId": this.liveData.alarmRecord.equipmentId,
						"event": this.liveData.alarmRecord.event,
						"id": this.liveData.alarmRecord.id,
						"level": this.liveData.alarmRecord.level,
						"msgNo": this.liveData.alarmRecord.msgNo,
						"portalId": this.liveData.alarmRecord.portalId,
						"pumpId": this.liveData.alarmRecord.pumpId,
						"pumpName": this.liveData.alarmRecord.pumpName,
						"state": this.liveData.alarmRecord.state,
						"tenantId": this.liveData.alarmRecord.tenantId,
						"type": this.liveData.alarmRecord.type,
					},
					"beginTime":
						this.active == 1 ?
							this.startDate :
							'',
					"dealImgDTOList":
						this.active == 0 ?
							[
								{
									"fileId": this.fileData.fileToken,
									"fileSize": this.fileData.size,
									"fileType": this.fileData.extName,
									"fileUrl": '172.20.79.61/' + this.fileData.objectName,
									"name": this.fileData.fileName,
									"uid": "",
									"url": ""
								}
							] : null,
					"describe": this.liveData.alarmRecord.event,
					"endTime":
						this.active == 1 ?
							this.endDate :
							'',
					"handleDescribe": this.active == 0 ? this.inputedDeal : this.inputedTrans,
					"handler":
						this.active == 1 ?
							this.handler : null,
					"method":
						this.active == 0 ?
							'2' :
							this.active == 1 ?
								'3' :
								this.active == 2 ?
									'4' :
									'5'
					,
					"pumpId": this.tappedObjects.id,
					"userId": storage.get('userId'),
					"id": this.liveData.alarmRecord.id
				}
			}).then((res) => {
				console.log(res)
				if (res.status) {
					Toast.clear()
					Toast.info('上传成功')
				} else {
					Toast.error('上传失败');
				}
			}).finally(() => {
				setTimeout(() => {
					this.$router.replace('/BZList')
				}, 1000)
			})
		},
		//切换工单
		onclick(index) {
			this.active = index
			this.file = []
		},
		//文件上传回调
		afterRead(file) {
			console.log(file)
			this.fileUpLoaded = 'uploading'
			this.uploadFile(file.file)
			// 此时可以自行将文件上传至服务器
		},
		//文件删除回调
		beforeDelete(file) {
			this.fileList.pop(file)
		},
		//人员选择完成回调
		onFinish({ selectedOptions }) {
			this.nameShow = !this.nameShow
			this.filedValue = selectedOptions.map((option) => {
				this.handler = option.text
				this.id = option.value
				return option.text
			}).join('/')
		},
		//人员选择回调
		async onNameChange(picker) {
			console.log(picker)
			if (picker.tabIndex !== 2) return
			await this.getList(picker)
		},
		formCheck() {
			if (this.active == 0) {
				this.fileList.length == 0 ?
					Toast.warning('未选择图片') :
					this.onSubmitShow()
			} else if (this.active == 1) {
				this.handler == '' ?
					Toast.warning('未选择处理人员') :
					this.onSubmitShow()
			} else {
				this.onSubmitShow()
			}
		},
		cancel() {
			Dialog.confirm({
				title: '提示',
				message: '您确定要退出，什么都不提交吗',
			})
				.then(() => {
					this.$router.replace('/BZList')
				})
				.catch(() => {
					// on cancel
				});
		},
		onNameCancel() {
			this.nameShow = !this.nameShow
		},
		showNamePopup() {
			this.personList = []
			this.getPerson()
			this.nameShow = !this.nameShow
		},
		//确认上传
		onSubmitShow() {
			Dialog.confirm({
				title: this.active != '3' ? '确认上传' : '确认关闭',
				message: this.active != '3' ? '您确定要上传该报警信息吗' : '您确定要将本次报警上传为误报吗',
			})
				.then(() => {
					Toast.loading({
						message: '上传中...',
						forbidClick: true,
						duration: 0
					})
					this.upload()
					// on confirm
				})
				.catch(() => {
					// on cancel
				});
		},
		startDataShowPopup() {
			this.startDataShow = !this.startDataShow
		},
		endDataShowPopup() {
			this.endDataShow = !this.endDataShow
		},
		onDataCancel() {
			this.startDataShow = false
			this.endDataShow = false
		},
		onStartDataConfirm() {
			this.startDate = this.$dayjs(this.startDate).format('YYYY-MM-DD HH:mm:ss')
			this.startDataShow = !this.startDataShow
		},
		onEndDataConfirm() {
			this.endDate = this.$dayjs(this.endDate).format('YYYY-MM-DD HH:mm:ss')
			this.endDataShow = !this.endDataShow
		},
	},
}
</script>
<style lang="less" scoped>
.main {
	background-color: #f5f7f9 !important;
	width: 100%;
	height: 100%;
}

.tip {
	margin-left: 35px;
	font-size: 28px;
	color: #2d7eff;
	margin-top: 50px;
}

.warning {
	font-size: 28px;
	text-align: center;
	color: red;
	margin-top: 50px;
}

.subtitle {
	font-size: 30px;
	font-weight: 600;
	color: #555555;
	margin-left: 10px;
}

.www {
	z-index: 9999;
}

.imgPicker {
	width: 90%;
	padding: 10px;
	background-color: white;
	border-radius: 15px;
	margin-top: 30px;
	margin-left: 10px;
	margin-right: 10px;
	padding-top: 20px;
	padding-bottom: 10px;
}

.list {
	padding: auto;
	overflow-y: scroll;
	overflow-x: hidden;
	height: 85%;
}

.card {
	width: 90%;
	padding: 10px;
	background-color: white;
	border-radius: 15px;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 20px;
	padding-bottom: 20px;
	padding-top: 20px;
}

.content {
	width: 100%;
	margin: 10px;
}

.title {
	margin: 15px;
	font-size: 32px;
	font-weight: 600;
	color: #333333;
}

.button {
	border-radius: 50px;
	width: 260px;
	height: 75px;
	margin-top: 30px;
	margin-right: 10px;
}

.bottom {
	width: 49%;
	display: flex;
	flex-direction: row;
	padding: 20px;
	margin-bottom: 20px;
}

.info {
	color: #333333;
	font-size: 29px;
	margin-left: 40px;
	margin-top: 10px;
}

.popButton {
	width: 300px;
	height: 200px;
}

.row {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.center {
	display: flex;
	justify-content: center;
	align-items: center;
}

.cardText {
	font-size: 29px;
	color: #555555;
	margin-left: 10px;
	margin-right: 10px;
}

.iconBlue {
	display: flex;
	margin-right: 10px;
	width: 12px;
	height: 12px;
	border-radius: 100px;
	background-color: #2d7eff;
}

.iconRed {
	display: flex;
	margin-right: 10px;
	width: 12px;
	height: 12px;
	border-radius: 100px;
	background-color: red;
}

/deep/.fm-nav-bar__content {
	background-color: transparent;
}
</style>
  