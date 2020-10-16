<template>
<div>
	<div class="mainContainer">
		<el-form class="mainSearch" :inline="true" :model="formInline">
			<el-form-item>
				<el-input v-model="ProjectShowPath" style="width: 100%;" size="small" />
			</el-form-item>
			<el-form-item>
				<el-input v-model="formInline.user" placeholder="搜一搜，找得更快" prefix-icon="el-icon-search" size="small" @keyup.enter.native="SearchHandle" />
			</el-form-item>
			<el-form-item>
				<el-button size="small" type="primary" @click="SearchHandle">查询</el-button>
			</el-form-item>
		</el-form>
		<!--标题,功能-->
		<el-row class="mainTitle DOCmainTitle">
			<el-col :xl="10" :lg="6" :md="6">
				<div style="display:inline-block;" v-show="box"></div>
				<el-button size="small" type="primary" v-show="getDocumentShow" @click="getDocument">收文</el-button>
				<el-button size="small" type="primary" v-show="sendDocumentShow" @click="sendDocument">发文</el-button>
			</el-col>
			<el-col :xl="14" :lg="18" :md="18" class='btn-wrapper'>
				<div style="text-align: right;" class="FunctionMenu">
					<!-- 2020.4.16-2-2 -->
					<PluginButton />
					<!--华西项目-->
					<!-- <el-button size="small" type="primary" @click="openWorkTime">填报工时</el-button>
							<el-button
							size="small"
							type="primary"
							@click="ProjectSetUp"
							style="margin-right: 10px;"
							>项目立项</el-button> -->
									<!--方圆项目-->
									<!-- <el-button
							size="small"
							type="primary"
							@click="FyProjectSetUp"
							style="margin-right: 10px;"
							>项目立项</el-button> -->
					<!-- <UploadFiles :uploadArr="UploadFiles" :autoUpload="true" @reData="reFiles" /> -->
					<!-- <uploadFiles2 :autoUpload="true" :ProjectKeyWord='ProjectKeyWord' ref='upload'/> -->
					<uploadFiles3 
						:projectKeyword='ProjectKeyWord' 
						:autoUpload='true' 
						ref="upload"
					>
						<el-button
							size="small"
							type="primary"
							icon="el-icon-upload2"
						>上传</el-button>
					</uploadFiles3>
					<el-button size="small" type="primary" icon="el-icon-download" @click="onDefWorkflow">流程定义</el-button>
					<el-button size="small" type="primary" icon="el-icon-download" @click="fileDownload">下载</el-button>
					<el-button size="small" type="primary" icon="el-icon-view" @click="PreviewHandle()">预览</el-button>
				</div>
			</el-col>
		</el-row>
		<!--列表-->
		<!-- @dragover="fileDragover" @drop="fileDrop" -->
		<div v-show="isTable" v-if='refreshList' id='uploadDrop' style="overflow: hidden; flex: 1">
			<div v-if="dragStatus" class="drag-tip" :style="dragMaskStyle">
				<i class="el-icon-plus"></i>
				<p v-if="!dragEnterDiv">请将文件拖拽至此处</p>
				<p v-else>放开上传</p>
			</div>
			<el-table :data="DocList" @cell-dblclick='tableDoubleClick' ref="DocList" class="mainTable" :height="tableHeightLocal" border row-key="Keyword" :load="tableLoad" lazy highlight-current-row :tree-props="treeprops" @select="tableSelect" @row-click="handleCurrentChange"
					@selection-change="handleSelectionChange" @row-contextmenu="contextMenuClick" :default-sort="{prop: 'date', order: 'descending'}">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="名称" max-width="25%" min-width="250" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<span class="table-icon">
							<img :src="scope.row.src" width="20" height="20" alt />
							{{ scope.row.Title }}
						</span>
					</template>
				</el-table-column>
				<el-table-column max-width="15%" min-width="150" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<!-- <el-button @click="fileDownloadTable(scope.row.Keyword)" size="mini">下载</el-button> -->
						<el-button @click="fileDownloadTable(scope.row.Keyword)" size="mini">打开</el-button>
						<el-button size='mini' @click="PreviewHandle(scope.row.Keyword)">预览</el-button>
					</template>
				</el-table-column>
				<el-table-column  label="状态" max-width="5%" min-width="60">
					<template slot-scope="scope">
						<div class="file-status" :style="{ cursor: realFileStatus(scope.row) === '锁定' ? 'pointer': 'unset'}" @click="unlockFile(scope.row)">
							<img :title="realFileStatus(scope.row)" :alt='realFileStatus(scope.row)' style="height: 16px; width: 16px;" :src="statusIcon(realFileStatus(scope.row))" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="Creater" label="创建者" sortable max-width="7.5%" min-width="150" show-overflow-tooltip />
				<el-table-column prop="O_credatetime" label="创建时间" sortable max-width="7.5%" min-width="150" show-overflow-tooltip />
				<el-table-column prop="Updater" label="更新者" sortable max-width="7.5%" min-width="150" show-overflow-tooltip />
				<el-table-column prop="O_updatetime" label="更新时间" sortable max-width="7.5%" min-width="150" show-overflow-tooltip />
				<el-table-column prop="O_size" label="文件大小" sortable max-width="5%" min-width="110" />
				<el-table-column prop="O_filename" label="文件名" sortable max-width="7.5%" min-width="150" show-overflow-tooltip />
				<el-table-column prop="O_version" label="版本" sortable max-width="5%" min-width="110" />
				<el-table-column prop="O_outpath" label="输出路径" sortable max-width="7.5%" min-width="150" show-overflow-tooltip />
				<el-table-column prop="O_flocktime" label="锁定时间" sortable max-width="7.5%" min-width="150" show-overflow-tooltip />
				<el-table-column prop="O_conode" label="计算机" sortable max-width="7.5%" min-width="150" show-overflow-tooltip />
			</el-table>
		</div>
		<div v-if='!isTable' id='previewWrapper'>
			<!-- 2020-5-22 退出预览按钮 -->
			<el-button class='exit-preview-btn' type='warning' round @click='exitPreview'>退出预览</el-button>
			<div style='position: relative; height: 100%;'>
				<template v-if="isPreview === 'IMAGE'">
					<img :src="PreviewImgURL" alt class='preview-img'/>
				</template>
				<template v-else-if="isPreview === false">
					<iframe scrolling='auto' :src="PreviewDocURL" width="100%" :height="screenHeight - 140" frameborder="0" />
					<div id="iframeMask" ref="iframeMask" />
				</template>
				<template v-else-if="isPreview === 'VIDEO'">
					<video :src="PreviewVideoURL" width="100%" controls style='max-height: 600px;' autoplay="autoplay">
						<!-- <source :src="PreviewVideoURL" type="video/mp4"> -->
						您的浏览器不支持 HTML5 video 标签。
					</video>
				</template>
				<!-- 2020.4.20-1 bos模型预览窗口 -->
				<template v-else-if='isPreview === "MODEL"'>
					<Bos3d :projectKey='projectKey' :modelKey='modelKey' />
				</template>
				<template v-else>
					<div style="text-align: center;">
						<img src="../../assets/PreviewError.png" alt style="max-width: 100%;" />
						<p>文件暂不支持预览，请直接下载查看</p>
					</div>
				</template>
				<div class='arrow-wrapper'>
					<div><span @click='previewPrevious' class='el-icon-arrow-left left-arrow'></span></div>
					<div><span  @click='previewNext' class='el-icon-arrow-right right-arrow'></span></div>
				</div>
			</div>
		</div>
		<!-- 右键功能 -->
		<div v-show="menuVisible" class="rightMenu" ref="rightMenu" :style="styleObject">
			<ul class="rightMenu-ul">
				<li v-for="(item, index) in MenuListFilter" :key="index" class="rightMenu-li" :class="item.State === 'Enabled'? '': 'RM-disabled'" @click="openRight(item)">{{ item.Name }}</li>
			</ul>
		</div>
		<!-- 右键菜单 -->
		<RowContextMenu :dialogObj="rightData" @reData="reData(arguments)" />
		<!-- 分页 -->
		<pagination :pagination="pagination" @changepage="pageNum2" :current-page.sync='currentPage'/>
		<!-- 二级弹窗 - 增加用户/用户组 -->
		<PermissionList :dialogObj="PermissionData" @reData="rePData" @reUser="reUser(arguments)" />
		<!-- 选择会签专业 -->
		<ChooseProfession :dialogObj="ChooseProfessionData" @reData="reChooseProfession" />
		<!-- 项目立项 -->
		<!-- <ProjectSetUp :dialogObj="ProjectSetUpData" @reData="reProjectSetUp" /> -->
		<!-- 填报工时 -->
		<!-- <WorkTime :dialogObj="WorkTimeData" @reData="reWorkTime" /> -->
		<!-- 收文 -->
		<GetDocument :dialogObj="GetDocumentData" @reData="reGetDocument" />
		<!-- 发文 -->
		<SendDocument :dialogObj="SendDocumentData" @reData="reSendDocument" />
		<!-- 流程定义 // QGY -->
		<DefWorkflowMain :dialogObj="DefWorkflowData" @reData="reDefWorkflow" />
		<!--方圆 Start-->
		<!-- 项目立项 方圆-->
		<!-- <FyProjectSetUp :dialogObj="FyProjectSetUpData" @reData="reFyProjectSetUp" /> -->
		<!--方圆 End-->

		<uploadFiles3
            projectKeyword
            :autoUpload="false"
            :multiple="false"
            @handleChange="replaceFile"
		>
			<div ref="replaceFile"></div>
        </uploadFiles3>

		<!-- 方圆鹤洞项目流程弹窗 -->
        <FYHDDistribute :docKeyword='DocKeyword' :projectKeyword='ProjectKeyWord' @closeDialog='closeFYHDDialog' :processId='FYHDProcessId' :showDialog='FYHDShowDialog' :editForm='{}' />
	</div>
</div>
</template>

<script>
import UserApi from "../../api/services/workflow";
import UserApi3 from "../../api/services/doc";
import UserApi4 from "../../api/services/dbsource";
import {
	VersionIcon
} from "../../util/VersionIcon";
import PermissionList from "../Dialog/PermissionList-PM2";
import {
	mapGetters
} from "vuex";
import {
	BASE_URL,
	// VIEW_DOC
} from "../../const";
import {
	File_Download , windowDownloadFile, setDragEventListener, makeDialog
} from '@/util/Common'
import { statusIcon } from '../../util/AddTypeIcon'
// import {connectionWebSocket} from '@/util/WebSocket'
import { PluginsList } from "../../const.js";


export default {
	data() {
		return {
			// 发文收文按钮控制
			box: true,
			getDocumentShow: false,
			sendDocumentShow: false,
			GetDocumentData: {
				switch: false
			},
			SendDocumentData: {
				switch: false
			},
			// table的树形子节点控制（element-ui table）
			treeprops: {
				hasChildren: "HasAttachFiles"
			},
			// id: "",
			// 搜索框数据
			formInline: {
				user: "",
				region: ""
			},
			// table 多选数据
			multipleSelection: [],
			// 左侧选单 - 右键
			menuVisible: false,
			// 右键菜单样式
			styleObject: {
				top: 0,
				left: 0,
				opacity: 0
			},
			// 右键菜单控制
			rightData: {
				switch: false
			},
			// 用了新的upload组件之后这些都废弃
			// UploadFiles: [], //  上传文件列表
			// uploadVisible: false,
			// colors: [{
			// 		color: "#409eff",
			// 		percentage: 0
			// 	},
			// 	{
			// 		color: "#6f7ad3",
			// 		percentage: 100
			// 	}
			// ],
			// uploadSelection: [], // 上传checkbox
			// 开始上传中
			// Uploading: false,
			DocKeyword: "",
			// 二级弹窗 - 增加用户/用户组
			PermissionData: {
				switch: false
			},
			// 返回流程
			reProcessData: {},
			// 右键替换文件
			isReplaceFile: false,
			// 上傳文件
			// beforeFile: null,
			MenuList: [],
			len: 0,
			maps: new Map(),
			pid: "",
			// QGY start
			DefWorkflowData: {
				switch: false
			},
			// QGY end
			// ZY start
			ChooseProfessionData: {
				switch: false,
				docKeyWord: []
			},
			ProjectSetUpData: {
				switch: false
			},
			FyProjectSetUpData: {
				switch: false
			},
			WorkTimeData: {
				switch: false
			},
			// ZY end
			// 当前正在预览的文件，为预览上一个预览下一个准备
			previewKeyword: '',
			// 用来设置iframe高度
			screenHeight: 700,

			
            // 6.15 方圆鹤洞项目流程预留
            // 显示方圆鹤洞定制流程开关
            FYHDShowDialog: false,
            // 用户选择的流程 id
			FYHDProcessId: '',
			
			// 文档列表当前页数
			currentPage: 1,

			// 文件拖拽
			dragStatus: false,
			dragEnterDiv: false,

			// 表格高度
			tableHeightLocal: 600,

		};
	},
	components: {
		PermissionList
	},
	computed: {
		...mapGetters("doc", [
			"DocList",
			"pagination",
			"ProjectKeyWord",
			"ProjectShowPath",
			// 2020.4.20-1
			"projectKey",
			"modelKey",
			// 用于刷新
			'refreshList',
			"DocBaseAttr",
		]),
		...mapGetters("PerMessage", ["AttachmentDocData"]),
		...mapGetters("menu", [
			"tableHeight",
			"isPreview",
			"isTable",
			"PreviewImgURL",
			"PreviewDocURL",
			"Type",
			'PreviewVideoURL'
		]),
		// 过滤掉启动流程
        MenuListFilter() {
            // 如果是方圆的插件，过滤掉启动流程
            if (PluginsList.indexOf('FYPlugin') != -1) {
                return this.MenuList.filter(i => i.Id != 'MS_StartProcess' && i.Name != '启动流程')
            }
            return this.MenuList
		},
		// 拖拽上传的mask
		dragMaskStyle() {
			if (this.dragEnterDiv) {
				return {
					opacity: 1
				}
			} else {
				return {
					opacity: 0.3
				}
			}
		},
		statusIcon() {
			return statusIcon
		},
		// 真正的文件状态
		realFileStatus() {
			return function (i) {
				if (i.O_dmsstatus_DESC === '检出') {
					if (i.FLocker != this.$store.state.userData.userkeyword) {
						return '锁定'
					}
				}
				return i.O_dmsstatus_DESC
			}
		}
	},
	destroyed() {
		// 移除拖拽监听
		this.setDrag(false)
		// 移除onresize
		window.onresize = null
	},
	mounted(){
		this.$nextTick(() => {
			this.setDrag(true)
		})		
		// connectionWebSocket();
		
		// 监听屏幕大小，来刷新iframe的高度
		this.screenHeight = document.body.clientHeight;
		window.onresize = () => {
			return (() => {
				this.screenHeight = document.body.clientHeight;
				// 重设table的高度
				this.tableHeightLocal = document.getElementById('uploadDrop').clientHeight
			})()
		}
		if (!this.refreshList) {
			setTimeout(() => {
					this.$store.commit('doc/SET_REFRESH_LIST')
				}, 20)
		}
	},
	watch: {
		// 拖拽事件监听
		isTable(v) {
            console.log("v")
			this.$nextTick(() => {
				this.setDrag(v)
			})
			if (v) {
				this.$nextTick(() => {
					this.tableHeightLocal = document.getElementById('uploadDrop').clientHeight
				})
			}
		},

		// 个人消息附件跳转过来
		AttachmentDocData: {
			handler(newValue) {
				if (newValue) {
					setTimeout(() => {
						this.handleCurrentChange(newValue);
					}, 200);
				}
			}
		},
		Type: {
			handler(newValue) {
				if (newValue == "HX_SendDocument") {
					console.log("发文");
					this.sendDocumentShow = true;
					this.getDocumentShow = false;
				} else if (newValue == "HX_CreateCompany") {
					console.log("收文");
					this.getDocumentShow = true;
					this.sendDocumentShow = false;
				} else {
					this.sendDocumentShow = false;
					this.getDocumentShow = false;
				}
			}
		},
		refreshList(newValue, oldValue) {
			this.$nextTick(() => {
				this.setDrag(newValue)
			})
			if (newValue) {
				this.$nextTick(() => {
					this.tableHeightLocal = document.getElementById('uploadDrop').clientHeight
				})
			}
			if (!newValue && oldValue) {
				setTimeout(() => {
					this.$store.commit('doc/SET_REFRESH_LIST')
				}, 20)
			}
		}
	},
	methods: {
		/* ------------------------------------------------------------ */
		// 搞文件状态的
		// 用户点击文件状态为锁定的文档
		async unlockFile(i) {
			console.log(i)
			if (this.realFileStatus(i) != '锁定') {
				return
			}

			let res = await makeDialog({
				title: '提示',
				content: `该文件正在被 “${ i.FLocker }” 在 “${ '模拟xx机器' }” 机器上编辑，是否需要放弃编辑？`,
				operation: [
					{
						text: '确认',
						value: true
					},
					{
						text: '取消',
						value: false
					}
				]
			})

			if (res.success) {
				if (res.result) {
					this.$store.dispatch({
						type: 'doc/setDocStatus',
						docKeyword: i.Keyword,
						status: '检入'
					})
				}
			}
			
		},
		/* ------------------------------------------------------------ */
		// 设置拖拽事件监听
		setDrag(v) {
			setDragEventListener(v, document.body,
			// 拖拽进入
			() => {
				this.dragStatus = true
			},
			// 拖拽退出
			() => {
				this.dragStatus = false
			},
			() => {
				this.dragStatus = false
			})

			let uploadDrop = document.getElementById('uploadDrop')

			setDragEventListener(v, uploadDrop, 
			() => {
				console.log('in enter')
				this.dragEnterDiv = true
			},
			() => {
				this.dragEnterDiv = false
			}, 
			(e) => {
				this.dragEnterDiv = false
				this.dragStatus = false
				// this.rawFileList = e.dataTransfer.files
				let fileList = []
				for(let i = 0; i < e.dataTransfer.files.length; i ++) {
					fileList.push(e.dataTransfer.files[i])
				}

				// 将fileList 格式化成像选取文件一样的
				fileList = fileList.map(i => {
					return {
						raw: i,
						size: i.size,
						name: i.name,
					}
				})
				this.$refs.upload.handleChange('', fileList)
			})
		},
		/* ------------------------------------------------------------ */
		// 行的双击事件
		tableDoubleClick(row) {
			this.fileDownloadTable(row.Keyword)
		},
		/* ------------------------------------------------------------ */
		//  ZY start  弹窗
		getDocument() {
			this.GetDocumentData.switch = true;
		},
		reGetDocument(e) {
			this.GetDocumentData.switch = e;
		},
		sendDocument() {
			this.SendDocumentData.switch = true;
		},
		reSendDocument(e) {
			this.SendDocumentData.switch = e;
		},
		openChooseProfession() {
			this.ChooseProfessionData.switch = true;
		},
		reChooseProfession(e) {
			this.ChooseProfessionData.switch = e;
		},
		ProjectSetUp() {
			this.ProjectSetUpData.switch = true;
		},
		reProjectSetUp(e) {
			this.ProjectSetUpData.switch = e;
		},
		FyProjectSetUp() {
			this.FyProjectSetUpData.switch = true;
		},
		reFyProjectSetUp(e) {
			this.FyProjectSetUpData.switch = e;
		},
		openWorkTime() {
			this.WorkTimeData.switch = true;
		},
		reWorkTime(e) {
			this.WorkTimeData.switch = e;
		},
		//  ZY end
		//QGY start
		onDefWorkflow() {
			this.DefWorkflowData.switch = true;
		},
		// 流程定义返回
		reDefWorkflow(e) {
			this.DefWorkflowData.switch = e;
		},
		//QGY end
		async PreviewHandle(docKeyword) {
			let vm = this;
			// 隐藏右边的
			this.$store.commit('home/ASIDER_HIDE_CONTROL')
			// 预览上一个预览下一个准备
			this.previewKeyword = docKeyword || this.DocKeyword
			console.log(this.previewKeyword)
			if (this.previewKeyword) {
				const res = await UserApi3.previewDoc(this.previewKeyword);
				if (res.success) {
					if (!res.data[0].filename) return vm._$ErrorMessage();
					let arr = res.data[0].filename.split(".");
					let str = arr.pop().toUpperCase();
					if (str === "PNG" || str === "JPG" || str === 'JPEG' || str === "JPGE") {
						// this.$store.commit("menu/GET_NAVURL", "");
						// this.$store.commit("menu/ISPREVIEW", true);
						// this.$store.commit("menu/ISTABLE", false);
						// this.$store.commit(
						//   "menu/GET_PREVIEWIMG_URL",
						//   `${BASE_URL}/${res.data[0].path}`
						// );
						// window.open(`${BASE_URL}/${res.data[0].path}`, "_blank");
						// 2020.4.15-3
						//  转到文件预览
						vm.$store.commit("doc/GO_TO_PREVIEW");
					} else if (
						str === "DOC" ||
						str === "DOCX" ||
						str === "XLSX" ||
						str === "XLS" ||
						str === "PPTX" ||
						str === "PPT" ||
						str === "PDF" ||
						str === "TXT" ||
						str === 'MP4'
					) {
						// this.$store.commit("menu/GET_NAVURL", "");
						// this.$store.commit("menu/ISPREVIEW", false);
						// this.$store.commit("menu/ISTABLE", false);
						// this.$store.commit(
						//   "menu/GET_PREVIEWDOC_URL",
						//   `${BASE_URL}/${res.data[0].path}`
						// );
						// await vm._$fileDownload()
						// window.open(`${BASE_URL}/${res.data[0].path}`, "_blank");
						// 2020.4.1-3
						// 不要重新打开一个窗口来预览
						// 模拟点击了文件预览(AsideR.vue)
						vm.$store.commit("doc/GO_TO_PREVIEW");
					} else return vm._$ErrorMessage();
				} else return vm.$message.error(res.msg);
			} else return vm.$message.error("请选择文件");
		},
		// async _$fileDownload() {
		// 	let RefDocKeyword = "";
		// 	const res = await UserApi3.fileDownload(this.DocKeyword, RefDocKeyword);
		// 	if (res.success) {
		// 		let webHttp = `${VIEW_DOC}${BASE_URL}/${res.data[0].path}`;
		// 		window.open(`${webHttp}`, "_blank");
		// 	} else {
		// 		this.$message.error(res.msg);
		// 	}
		// },
		_$ErrorMessage() {
			this.$message.error("文件暂不支持预览，请直接下载查看");
		},
		// reFiles() {
		// 	// let { pid } = this;
		// 	//
		// 	// // console.log(this.maps)
		// 	// const { tree, treeNode, resolve } = this.maps.get(pid);
		// 	// this.$set(this.$refs.DocList.store.states.lazyTreeNodeMap, pid, []);
		// 	// // console.log(this.$refs.DocList.store.states.lazyTreeNodeMap)
		// 	// this.tableLoad(tree, treeNode, resolve);
		// 	let page = 1,
		// 		{
		// 			ProjectKeyWord
		// 		} = this;
		// 	const filterJson = "",
		// 		limit = 50;
		// 	this.$store.dispatch("doc/getDocList", {
		// 		ProjectKeyWord,
		// 		filterJson,
		// 		page,
		// 		limit
		// 	});
		// },
		async tableLoad(tree, treeNode, resolve) {
			let rdata = [],
				imgUrl = "",
				arr = [];
			this.pid = tree.Keyword;
			this.maps.set(this.pid, {
				tree,
				treeNode,
				resolve
			});
			const res = await UserApi3.getAttachFiles(tree.Keyword);
			if (res.success && res.data[0].VersionList) {
				// 参考
				arr = res.data[0].RefDocList;
				if (arr.length > 0) {
					arr.forEach(item => {
						imgUrl = VersionIcon(item.DocInfo[0].O_version, "RefDocList");
						rdata.push({
							Title: item.DocInfo[0].Title,
							O_dmsstatus_DESC: item.DocInfo[0].O_dmsstatus_DESC,
							Creater: item.DocInfo[0].Creater,
							O_credatetime: item.DocInfo[0].O_credatetime,
							Updater: item.DocInfo[0].Updater,
							O_updatetime: item.DocInfo[0].O_updatetime,
							O_size: item.DocInfo[0].O_size,
							O_filename: item.DocInfo[0].O_filename,
							O_version: item.DocInfo[0].O_version,
							O_outpath: item.DocInfo[0].O_outpath,
							O_flocktime: item.DocInfo[0].O_flocktime,
							O_conode: item.DocInfo[0].O_conode,
							src: imgUrl,
							Keyword: item.DocInfo[0].Keyword,
							HasAttachFiles: false
						});
					});
				}
				// 版本
				arr = res.data[0].VersionList;
				arr.forEach(item => {
					imgUrl = VersionIcon(item.DocInfo[0].O_version, "VersionList");
					rdata.push({
						Title: item.DocInfo[0].Title,
						O_dmsstatus_DESC: item.DocInfo[0].O_dmsstatus_DESC,
						Creater: item.DocInfo[0].Creater,
						O_credatetime: item.DocInfo[0].O_credatetime,
						Updater: item.DocInfo[0].Updater,
						O_updatetime: item.DocInfo[0].O_updatetime,
						O_size: item.DocInfo[0].O_size,
						O_filename: item.DocInfo[0].O_filename,
						O_version: item.DocInfo[0].O_version,
						O_outpath: item.DocInfo[0].O_outpath,
						O_flocktime: item.DocInfo[0].O_flocktime,
						O_conode: item.DocInfo[0].O_conode,
						src: imgUrl,
						Keyword: item.DocInfo[0].Keyword,
						HasAttachFiles: false
					});
				});
			}
			resolve(rdata);
		},
		// 搜索
		async SearchHandle() {
			let vm = this,
				{
					ProjectKeyWord
				} = vm,
				filterJson = [],
				page = 1,
				limit = 50;
			filterJson.push({
				name: "o_itemname",
				value: `(o_itemname LIKE '%${this.formInline.user}%' or o_itemdesc LIKE '%${this.formInline.user}%' )`
			}, {
				name: "searchAttr",
				value: "true"
			}, {
				name: "filterstr",
				value: this.formInline.user
			});
			filterJson = JSON.stringify(filterJson);
			this.$store.dispatch("doc/getDocList", {
				ProjectKeyWord,
				filterJson,
				page,
				limit
			});
		},
		// 下载
		async fileDownload() {
			// 如果要做批量下载，选中的文档在this.ChooseProfessionData.docKeyWord里

			// 批量下载
			let choose = this.ChooseProfessionData.docKeyWord.map(i => i.Keyword)
			if (choose.length <= 0) {
				this.$message.error('请选择文件')
			}
			choose.forEach(async i => {
				const res = await UserApi3.fileDownload(i, '');
				if (res.success) {
					var prePath = res.data[0].prePath;
					var fileName = res.data[0].filename;
					var para = res.data[0].para;
					// 2020.4.21-4
					File_Download(`${ BASE_URL }/${ prePath }${ encodeURIComponent( fileName ) }?p=${ para }`, fileName)
				} else {
					this.$message.error(res.msg);
				}
			})
		},
		// 表格内的下载
		async fileDownloadTable(docKeyword) {
			const res = await UserApi3.fileDownload(docKeyword,'');
			if (res.success) {
				var prePath = res.data[0].prePath;
                var fileName = res.data[0].filename;
                var para = res.data[0].para;
                                
                //组装文件下载路径
                var url = BASE_URL + '/' + prePath + encodeURIComponent(fileName) + "?p=" + para;

				windowDownloadFile(url, docKeyword);
			} else {
				this.$message.error({
					message: `下载文件失败：${ res.msg }`
				})
			}
		},
		// 開啟添加用戶彈窗
		openPermissionList() {
			this.PermissionData.switch = true;
		},
		// 添加用戶彈窗 返回
		rePData(e) {
			this.PermissionData.switch = e;
		},
		async reUser(e) {
			let vm = this;
			if (e[2] !== undefined) {
				let DocList = vm.DocKeyword,
					WfKeyword = vm.reProcessData.o_code,
					userlist = e[2];
				const res = await UserApi.startNewWorkFlow(
					DocList,
					WfKeyword,
					userlist
				);
				if (res.success) {
					const filterJson = "",
						page = 1,
						limit = 50;
					let {
						ProjectKeyWord
					} = vm;
					vm.$store.dispatch("doc/getDocList", {
						ProjectKeyWord,
						filterJson,
						page,
						limit
					});
				}
			}
		},
		tableSelect(val, row) {
			let vm = this;
			vm.DocKeyword = "";
			if (row !== null) {
				vm.DocKeyword = row.Keyword;
			}
		},
		// 点击列表
		handleCurrentChange(val) {
			let vm = this
			if (val) {
				vm.$refs.DocList.clearSelection();
				vm.DocKeyword = val.Keyword;
				this.$nextTick(() => {
					vm.$refs.DocList.toggleRowSelection(val);
				});
				vm.$store.dispatch("doc/getDocBaseAttr", val.Keyword);
				// if (val.Keyword === vm.DocKeyword) return
			}
		},
		// 多选列表
		handleSelectionChange(val) {
			let vm = this
			this.multipleSelection = val;
			this.ChooseProfessionData.docKeyWord = val;
			// 2020.4.15-4
			if (val.length > 0) {
				vm.$store.dispatch("doc/getDocBaseAttr", val[val.length - 1].Keyword);
			}
			// 2020.4.27-2

		},
		// 替换文件式的上传文件
		replaceFile(fileList) {
			if (fileList.length === 1) {
                let file = fileList[0]
                let filename = ''
                for(let i in this.DocBaseAttr) {
                    if (this.DocBaseAttr[i].AttrCode === "O_filename") {
                        filename = this.DocBaseAttr[i].AttrValue
                        break
                    }
                }
                filename = filename.split('.')[0]
                if (file.name.split('.').length > 1) {
                    filename = filename + '.' + file.name.split('.').pop()
                }
                this.$store.dispatch({
                    type: 'upload/specifyUploadInfo',
                    file: {
                        ...file,
                        docKeyword: this.DocKeyword,
                        filename,
                        projectKeyword: this.ProjectKeyWord
                    }
                })
            }
		},
		// 右键列表
		openRight(e) {
			let vm = this,
				arr = [];
			if (e.Id === "MS_DeleteDoc") {
				this.multipleSelection.forEach(item => {
					arr.push(item.Keyword);
				});
				vm.rightData.DocKeyword = arr;
			} else if (e.Id === "MS_ReplaceDoc") {
				// this.isReplaceFile = true;
				// this.$nextTick(() => {
				// 	document.getElementById("ReplaceFile").click();
				// });
				this.$refs.replaceFile.click()
				return;
			} else if (e.Id === "MS_PreviewDoc") {
				this.PreviewHandle();
				return;
			} else if (e.Id === "MS_CopyDoc" || e.Id === "MS_MoveDoc") {
				const CopyIds = vm.multipleSelection
				const isCopy = e.Id === "MS_CopyDoc" ? false : true
				const messageType = e.Id === "MS_CopyDoc" ? 'Copy' : 'Move'
				this.$store.commit('CopyPaste/SAVE_COPY', {
					CopyIds,
					isCopy,
					messageType
				})
				return;
			} else {
				vm.rightData.DocKeyword = vm.DocKeyword;
			}

			// 方圆鹤洞项目 表单分发
			if(e.Id.indexOf('FY') != -1) {
				this.openFYHDDialog(e)
				return
			}

			vm.rightData.switch = true;
			vm.rightData.Id = e.Id;
			vm.rightData.dialogTitle = e.Name;
			this.rightData.projectId = this.ProjectKeyWord
		},
		reData(e) {
			if (e[1].o_code !== undefined && e[1].text == "专业成品校审流程") {
				this.reProcessData = e[1];
				this.openChooseProfession();
			} else if (e[1].o_code !== undefined) {
				this.reProcessData = e[1];
				this.openPermissionList();
			} else {
				const filterJson = "",
					page = 1,
					limit = 50;
				let {
					ProjectKeyWord
				} = this;
				this.$store.dispatch("doc/getDocList", {
					ProjectKeyWord,
					filterJson,
					page,
					limit
				});
			}
			this.rightData.switch = e[0];
		},
		// 左侧选单 - 右键
		contextMenuClick(row, column, event) {
			// 取消事件的默认动作
			event.preventDefault();
			let vm = this;
			if (vm.multipleSelection.length === 0) {
				vm.$refs.DocList.clearSelection();
				vm.$refs.DocList.toggleRowSelection(row);
			} else {
				let index = vm.multipleSelection.findIndex(
					item => item.Keyword === row.Keyword
				);
				if (index === -1) {
					vm.$refs.DocList.clearSelection();
					vm.$refs.DocList.toggleRowSelection(row);
				}
			}
			vm.DocKeyword = row.Keyword;
			vm.menuVisible = false;
			vm.menuVisible = true;
			let ProjectList = row.Keyword,
				Position = "LVDoc",
				TvPosition = "1";
			// vm.$store.dispatch('dbsource/getMenuList', { ProjectList, Position, TvPosition })
			UserApi4.getMenuList(ProjectList, Position, TvPosition).then(res => {
				vm.MenuList = res.data;
				vm.len = res.data.length * 33;
				vm.styleObject.opacity = 1;
				// getBoundingClientRect 獲取視窗寬高
				if (event.clientY > vm.$el.getBoundingClientRect().height / 1.1) {
					vm.styleObject.top = event.clientY - vm.len - 10 + "px";
				} else if (
					event.clientY >
					vm.$el.getBoundingClientRect().height / 1.3
				) {
					vm.styleObject.top = event.clientY - vm.len + 100 + "px";
				} else {
					vm.styleObject.top = event.clientY - 10 + "px";
				}
				vm.styleObject.left = event.clientX + 30 + "px";
				// console.log(vm.styleObject.left)
				// console.log(vm.styleObject.top)
			});
			document.addEventListener("click", vm.foo);
		},
		// 左侧选单 - 取消右键
		foo() {
			// 取消鼠标监听事件
			let vm = this;
			vm.menuVisible = false;
			vm.styleObject.opacity = 0;
			vm.styleObject.top = 0;
			vm.styleObject.left = 0;
			document.removeEventListener("click", vm.foo);
		},
		// 分页
		pageNum2(e) {
			let page = e,
				{
					ProjectKeyWord
				} = this;
			const filterJson = "",
				limit = 50;
			this.$store.dispatch("doc/getDocList", {
				ProjectKeyWord,
				filterJson,
				page,
				limit
			});
		},
		// 预览上一个
		async previewPrevious() {
			let list = this.DocList.map(item => item.Keyword)
			// 找出当前DocKeyword的位置
			let index = list.indexOf(this.previewKeyword)
			if (index == 0) {
				this.$message({
					message: '正在预览第一个',
					type: 'warning'
				})
			} else {
				for (let i = index - 1; i >= 0; i --) {
					// 只预览能预览的文件
					// 上一个的Keyword
					let keyword = list[i]
					// 预览上一个预览下一个应该不影响当前选中的选项，只更改Main的preview和右边
					let res = await UserApi3.previewDoc(keyword);
					if (res.success) {
						if (res.data[0].filetype === 'common') {
							this.previewKeyword = keyword
							this.handleCurrentChange(this.DocList[i])
							this.$store.commit("doc/GO_TO_PREVIEW");
							return
						} else {
							continue
						}
					} else {
						continue
					}
				}
				this.$message({
					message: '没有可预览文件',
					type: 'warning'
				})
			}
		},
		// 预览下一个
		async previewNext() {
			let list = this.DocList.map(item => item.Keyword)
			// 找出当前DocKeyword的位置
			let index = list.indexOf(this.previewKeyword)
			if (index == list.length - 1) {
				this.$message({
					message: '正在预览最后一个',
					type: 'warning'
				})
			} else {
				for (let i = index + 1; i < list.length; i ++) {
					// 只预览能预览的文件
					// 上一个的Keyword
					let keyword = list[i]
					// 预览上一个预览下一个应该不影响当前选中的选项，只更改Main的preview和右边
					let res = await UserApi3.previewDoc(keyword);
					if (res.success) {
						if (res.data[0].filetype === 'common') {
							this.previewKeyword = keyword
							this.handleCurrentChange(this.DocList[i])
							this.$store.commit("doc/GO_TO_PREVIEW");
							return
						} else {
							continue
						}
					} else {
						continue
					}
				}
				this.$message({
					message: '没有可预览文件',
					type: 'warning'
				})
			}
		},
		// 退出预览
		exitPreview() {
			this.$store.commit("menu/ISTABLE", true);
			this.$store.commit('doc/CHANGE_ACTIVENAME', 'c');
			this.$store.commit('home/ASIDER_SHOW_CONTROL')
		},


		/* ----------------------------------------------------------------------------------- */
        // 关闭方圆鹤洞项目的dialog
        closeFYHDDialog(mode) {
			if (mode === 'refresh') {
				this.currentPage = 1
				this.$store.dispatch({
					type: 'doc/getDocList',
					ProjectKeyWord: this.ProjectKeyWord,
					filterJson: '',
					page: 1,
					limit: 50,
				})
			}
            this.FYHDShowDialog = false
        },
        // 选择了启动流程后，打开方圆鹤洞项目的流程
        openFYHDDialog(e) {
			// 6.15 方圆鹤洞项目预留流程位置
			
			let FYProcessList = [
				// 设计变更管理
				'FY_NewDesignChange',
				// 付款通知单
				'PaymentNotice',
				// 鹤洞业务审批
				'HDBusinessApproval',
				// 用章使用审批
				'UseSealApproval',
				// 费用报销单
				'ExpenseReimbursement',
				// 合同审批表
				'ContractApproval',
				// 发文审批表
				'IssueApproval',
				// 通用审批流程
				'FY_NewTransaction',
			]
			if (FYProcessList.indexOf(e.Id) != -1) {
				this.FYHDProcessId = e.Id
				this.FYHDShowDialog = true
			}
        }
	},
};
</script>

<style lang="scss">
.rightMenu {
    position: absolute;
    top: 163px;
    left: 37px;
    z-index: 2131;
    display: block;
    opacity: 1;
    box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 7px 2px;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    border-radius: 0.3rem;
    .rightMenu-ul {
        position: relative;
        z-index: 100;
        min-width: 150px;
        border: none;
        padding: 5px 0 10px;
        margin: 0;
        list-style: none;
        .rightMenu-li {
            height: 32px;
            border-bottom: 1px dotted #ccc;
            line-height: 34px;
            font-size: 14px;
            color: #717171;
            margin: 0 10px;
            padding: 0 10px;
            list-style: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .rightMenu-li:last-child {
            border-bottom: 0;
        }
        .rightMenu-li:hover {
            background: #528ffd;
            color: #fff;
        }
        .RM-disabled {
            pointer-events: none;
            color: rgb(187, 187, 187);
        }
    }
}

#iframeMask {
    height: 100%;
    overflow: auto;
    opacity: 0;
    position: absolute;
    z-index: -1;
    background-color: rgba(0, 0, 0, 0);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>

<style lang='scss' scoped>
#uploadDrop {
	position: relative;
}
.drag-tip {
	z-index: 100;
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	border: dashed 5px black;
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	i {
		font-weight: 900;
		font-size: 100px;
		display: block;
	}
	p {
		font-size: 40px;
	}
}
.mainContainer {
    height: 100%;
    display: flex;
    flex-direction: column;
		position: relative;
}
#previewWrapper {
		background-color: white;
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: 1000;
}
.preview-img{
	height: auto;
	max-width: 100%;
	max-height: 600px;
	width: auto;
}
.arrow-wrapper{
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	div{
		height: 100%;
		width: 100px;
		position: absolute;
		pointer-events: auto;
		span {
			border-radius: 50%;
			display: block;
			background: grey;
			color: white;
			height: 30px;
			width: 30px;
			text-align: center;
			line-height: 30px;
			position: absolute;
			top: 50%;
			transform: translate(0, -50%);
		}
	}
	pointer-events: none;
	.left-arrow{
		left: 10px;
		display: none;
	}
	.right-arrow{
		right: 10px;
		display: none;
	}
}
.arrow-wrapper>div:first-child{
	left: 0;
}
.arrow-wrapper>div:first-child:hover{
	background: linear-gradient(90deg, rgba(0,0,0,0.5), transparent)

}
.arrow-wrapper>div:last-child:hover{
	background: linear-gradient(-90deg, rgba(0,0,0,0.5), transparent)
}
.arrow-wrapper>div:last-child:hover span{
	display: block
}
.arrow-wrapper>div:first-child:hover span{
	display: block
}
.arrow-wrapper>div:last-child{
	right: 0;
}

.mainContainer {
	.rightMenu {
		position: fixed !important;
	}
}
</style>

<style scoped>
.exit-preview-btn {
	position: absolute;
	z-index: 1000;
	bottom: 0;
	right: 0;
}
</style>

<style>
.file-status {
	display: flex; 
	align-items: center
}
.uploadNotify .el-notification__content p{
	text-align: left;
	word-break: break-word;
	cursor: pointer;
}
</style>