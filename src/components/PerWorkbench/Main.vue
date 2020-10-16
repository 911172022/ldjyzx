<template>
    <div class="mainContainer">
        <el-form class="mainSearch" :inline="true" :model="formInline">
            <el-form-item>
                <el-input v-model="ProjectShowPath" style="width: 100%;" size="small" />
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="formInline.user"
                    placeholder="搜一搜，找得更快"
                    prefix-icon="el-icon-search"
                    size="small"
                    @keyup.enter.native="SearchHandle"
                />
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="SearchHandle">查询</el-button>
            </el-form-item>
        </el-form>
        <!--标题,功能-->
        <el-row class="mainTitle DOCmainTitle">
            <!-- <el-col :span="10">
        <h1><i class="el-icon-s-claim" style="color: #FFBC40;"></i> 文件列表</h1>
            </el-col>-->
            <el-col :span="24">
                <div style="text-align: right;" class="FunctionMenu">
                    <!-- 2020.4.16-2-3 -->
                    <PluginButton />
                    <!-- <el-button size="small" type="primary" @click="openWorkTime">填报工时</el-button>
                        <el-button
                            size="small"
                            type="primary"
                            @click="ProjectSetUp"
                            style="margin-right: 10px;"
                    >项目立项</el-button>-->
                    <!-- <el-button
                            size="small"
                            type="primary"
                            @click="FyProjectSetUp"
                            style="margin-right: 10px;"
                    >项目立项2</el-button>-->
                    <!-- <UploadFiles :uploadArr="UploadFiles" @reData="reFiles" /> -->
                    <!-- <uploadFiles2 :autoUpload="true" :ProjectKeyWord="ProjectKeyWord" ref="upload"/> -->
                    <uploadFiles3 
						:projectKeyword='ProjectKeyWord' 
						:autoUpload='true' 
						ref="upload"
					>
						<el-button
                            style="margin-bottom: 10px"
							size="small"
							type="primary"
							icon="el-icon-upload2"
						>上传</el-button>
					</uploadFiles3>
                    <el-button
                        style="margin-bottom: 10px"
                        size="small"
                        type="primary"
                        icon="el-icon-download"
                        @click="fileDownload"
                    >下载</el-button>
                    <el-button
                        style="margin-bottom: 10px"
                        size="small"
                        type="primary"
                        icon="el-icon-view"
                        @click="PreviewHandle()"
                    >预览</el-button>
                </div>
            </el-col>
        </el-row>
        <!--列表-->
        <div v-show="isTable" id='uploadDrop' style="overflow: hidden; flex: 1">
            <div v-if="dragStatus" class="drag-tip" :style="dragMaskStyle">
				<i class="el-icon-plus"></i>
				<p v-if="!dragEnterDiv">请将文件拖拽至此处</p>
				<p v-else>放开上传</p>
			</div>
            <el-table
                :data="DocList"
                ref="DocList"
                class="mainTable"
                :height="tableHeightLocal"
                border
                row-key="Keyword"
                :load="tableLoad"
                lazy
                highlight-current-row
                :tree-props="treeprops"
                @row-click="handleCurrentChange"
                @selection-change="handleSelectionChange"
                @row-contextmenu="contextMenuClick"
                :default-sort="{prop: 'date', order: 'descending'}"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                    label="名称"
                    max-width="25%"
                    min-width="250"
                    sortable
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span class="table-icon">
                            <img :src="scope.row.src" width="20" height="20" alt />
                            {{ scope.row.Title }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column max-width="15%" min-width="150" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<el-button @click="fileDownloadTable(scope.row.Keyword)" size="mini">打开</el-button>
						<el-button size='mini' @click="PreviewHandle(scope.row.Keyword)">预览</el-button>
					</template>
                </el-table-column>
                <el-table-column
                    prop="O_dmsstatus_DESC"
                    label="状态"
                    max-width="5%"
                    min-width="60"
                >
                    <template slot-scope="scope">
						<div class="file-status" :style="{ cursor: realFileStatus(scope.row) === '锁定' ? 'pointer': 'unset'}">
							<img :title="realFileStatus(scope.row)" :alt='realFileStatus(scope.row)' style="height: 16px; width: 16px;" :src="statusIcon(realFileStatus(scope.row))" />
						</div>
					</template>
                </el-table-column>
                <el-table-column
                    prop="Creater"
                    label="创建者"
                    sortable
                    max-width="7.5%"
                    min-width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="O_credatetime"
                    label="创建时间"
                    sortable
                    max-width="7.5%"
                    min-width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="Updater"
                    label="更新者"
                    sortable
                    max-width="7.5%"
                    min-width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="O_updatetime"
                    label="更新时间"
                    sortable
                    max-width="7.5%"
                    min-width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="O_size"
                    label="文件大小"
                    sortable
                    max-width="5%"
                    min-width="110"
                />
                <el-table-column
                    prop="O_filename"
                    label="文件名"
                    sortable
                    max-width="7.5%"
                    min-width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="O_version"
                    label="版本"
                    sortable
                    max-width="5%"
                    min-width="110"
                />
                <el-table-column
                    prop="O_outpath"
                    label="输出路径"
                    sortable
                    max-width="7.5%"
                    min-width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="O_flocktime"
                    label="锁定时间"
                    sortable
                    max-width="7.5%"
                    min-width="150"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="O_conode"
                    label="计算机"
                    sortable
                    max-width="7.5%"
                    min-width="150"
                    show-overflow-tooltip
                />
            </el-table>
        </div>
        <!-- 预览 -->
        <div v-if="!isTable" id="previewWrapper">
            <!-- 2020-5-22 退出预览按钮 -->
            <el-button class="exit-preview-btn" type="warning" round @click="exitPreview">退出预览</el-button>
            <div style="position: relative; height: 100%;">
                <template v-if="previewType === 'IMAGE'">
                    <img :src="previewUrl" alt class="preview-img" />
                </template>
                <template v-else-if="previewType === 'DOC'">
                    <iframe
                        scrolling="auto"
                        :src="previewUrl"
                        width="100%"
                        :height="screenHeight - 140"
                        frameborder="0"
                    />
                    <div id="iframeMask" ref="iframeMask" />
                </template>
                <template v-else-if="previewType === 'VIDEO'">
                    <video
                        :src="previewUrl"
                        width="100%"
                        controls
                        style="max-height: 600px;"
                        autoplay="autoplay"
                    >
                        您的浏览器不支持 HTML5 video 标签。
                    </video>
                </template>

                <!-- <template v-else-if="previewType === 'MODEL'">
                    <Bos3d :projectKey="projectKey" :modelKey="modelKey" />
                </template> -->
                <template v-else>
                    <div style="text-align: center;">
                        <img src="../../assets/PreviewError.png" alt style="max-width: 100%;" />
                        <p>文件暂不支持预览，请直接下载查看</p>
                    </div>
                </template>
                <!-- <div class="arrow-wrapper">
                    <div>
                        <span @click="previewPrevious" class="el-icon-arrow-left left-arrow"></span>
                    </div>
                    <div>
                        <span @click="previewNext" class="el-icon-arrow-right right-arrow"></span>
                    </div>
                </div> -->
            </div>
        </div>

        <!-- 右键功能 -->
        <div v-show="menuVisible" class="rightMenu" ref="rightMenu" :style="styleObject">
            <ul class="rightMenu-ul">
                <li
                    v-for="(item, index) in MenuList"
                    :key="index"
                    class="rightMenu-li"
                    :class="item.State === 'Enabled'? '': 'RM-disabled'"
                    @click="openRight(item)"
                >{{ item.Name }}</li>
            </ul>
        </div>
        <!-- 右键菜单 -->
        <RowContextMenu :dialogObj="rightData" @reData="reData(arguments)" />
        <!-- 分页 -->
        <pagination :pagination="pagination" @changepage="pageNum2" />
        <!-- 二级弹窗 - 增加用户/用户组 -->
        <PermissionList :dialogObj="PermissionData" @reData="rePData" @reUser="reUser(arguments)" />
        <!-- 选择会签专业 -->
        <!-- <ChooseProfession :dialogObj="ChooseProfessionData" @reData="reChooseProfession" /> -->
        <!-- 项目立项 华西-->
        <!-- <ProjectSetUp :dialogObj="ProjectSetUpData" @reData="reProjectSetUp" /> -->
        <!-- 填报工时 -->
        <!-- <WorkTime :dialogObj="WorkTimeData" @reData="reWorkTime" /> -->
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
    </div>
</template>

<script>
import UserApi from "../../api/services/workflow";
import UserApi3 from "../../api/services/doc";
import UserApi4 from "../../api/services/dbsource";
import { VersionIcon } from "../../util/VersionIcon";
import PermissionList from "../Dialog/PermissionList-PM2";
import { mapGetters } from "vuex";
import { BASE_URL } from "../../const";
import ProjectApi from "../../api/services/project";
import { statusIcon } from '../../util/AddTypeIcon'
import {
	checkFileType, File_Download, windowDownloadFile, setDragEventListener
} from '@/util/Common'

export default {
    data() {
        return {
            treeprops: {
                hasChildren: "HasAttachFiles"
            },
            // id: "",
            // 搜索
            formInline: {
                user: "",
                region: ""
            },
            multipleSelection: [],
            // 左侧选单 - 右键
            menuVisible: false,
            styleObject: {
                top: 0,
                left: 0,
                opacity: 0
            },
            rightData: {
                switch: false
            },
            // UploadFiles: [], //  上传文件列表
            // uploadVisible: false,
            // colors: [
            //     { color: "#409eff", percentage: 0 },
            //     { color: "#6f7ad3", percentage: 100 }
            // ],
            // uploadSelection: [], // 上传checkbox
            // // 开始上传中
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

            // // 上傳文件
            // beforeFile: null,

            MenuList: [],
            len: 0,

            maps: new Map(),
            pid: "",

            // ZY start
            ChooseProfessionData: {
                switch: false,
                docKeyWord: []
            },
            ProjectSetUpData: {
                switch: false
            },
            WorkTimeData: {
                switch: false
            },
            // ZY end
            // fy start
            FyProjectSetUpData: {
                switch: false
            },
            // fy end

            // 预览控制
            // isTable: true,
            previewKeyword: '',
            previewUrl: '',
            // 用来设置iframe高度
            screenHeight: 700,
            

            // 文件拖拽
            dragStatus: false,
            dragEnterDiv: false,
            // 表格高度
            tableHeightLocal: 600
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
            "DocBaseAttr",
        ]),
        ...mapGetters("PerMessage", ["AttachmentDocData"]),
        ...mapGetters("menu", ["tableHeight"]),
        isTable: {
            get() {
                return this.$store.getters['PerMessage/isTable']
            },
            set(v) {
                this.$store.commit("PerMessage/SET_IS_TABLE", v)
            } 
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
    watch: {
        // 个人消息附件跳转过来
        AttachmentDocData: {
            handler(newValue) {
                setTimeout(() => {
                    this.handleCurrentChange(newValue);
                }, 2000);
            }
        },
        // 拖拽事件监听
		isTable(v) {
			this.$nextTick(() => {
				this.setDrag(v)
			})
			if (v) {
				this.$nextTick(() => {
					this.tableHeightLocal = document.getElementById('uploadDrop').clientHeight
				})
			}
		},
    },
    mounted(){
        this.$nextTick(() => {
            this.setDrag(true)
            setTimeout(() => {
                this.tableHeightLocal = document.getElementById('uploadDrop').clientHeight
            }, 10)
		})

		// 监听屏幕大小，来刷新iframe的高度
		this.screenHeight = document.body.clientHeight;
		window.onresize = () => {
			return (() => {
                this.screenHeight = document.body.clientHeight;
                // 重设table的高度
				this.tableHeightLocal = document.getElementById('uploadDrop').clientHeight
			})()
		}

	},
    methods: {
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
        //  ZY start
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
        async PreviewHandle(docKeyword) {
            let vm = this;
			// 隐藏右边的
			this.$store.commit('home/ASIDER_HIDE_CONTROL')
			// 预览上一个预览下一个准备
			this.previewKeyword = docKeyword || this.DocKeyword
			console.log(this.previewKeyword)
			if (this.previewKeyword) {
                const res = await UserApi3.previewDoc(this.previewKeyword);
                console.log(res)
				if (res.success) {
					if (!res.data[0].filename) return vm._$ErrorMessage();
                    
                    this.previewType = checkFileType(res.data[0].filename)
                    console.log(this.previewType)
                    if (this.previewType === 'IMAGE') {
                        this.previewUrl = res.data[0].fullFilePath
                        this.isTable = false
                    } else if (this.previewType === 'DOC') {
                        this.previewUrl = res.data[0].fullFilePath
                        this.isTable = false
                    } else if (this.previewType === 'VIDEO') {
                        let videoRes = await UserApi3.fileDownload(this.previewKeyword)
                        if (videoRes.success) {
                            let path = `${ BASE_URL }/${ videoRes.data[0].prePath }${ encodeURIComponent(videoRes.data[0].filename) }?p=${ videoRes.data[0].para }`
                            console.log(videoRes)
                            this.previewUrl = path
                            this.isTable = false
                        } else {
                            this.$message.error({
                                message: `获取文件预览链接失败：${ videoRes.msg }`
                            })
                        }
                        
                    }
                    
                    

				} else return vm.$message.error(res.msg);
			} else return vm.$message.error("请选择文件");

    



            // if (this.DocKeyword) {
            //     UserApi3.previewDoc(this.DocKeyword).then(res => {
            //         if (res.success) {
            //             let arr = res.data[0].filename.split(".");
            //             let str = arr.pop();
            //             if (str === "pdf" || str === "png" || str === "jpg") {
            //                 window.open(
            //                     `${BASE_URL}/${res.data[0].path}`,
            //                     "_blank"
            //                 );
            //             } else if (str === "txt") {
            //                 this.$message.error("文件不存在");
            //             } else {
            //                 let RefDocKeyword = "";
            //                 UserApi3.fileDownload(
            //                     this.DocKeyword,
            //                     RefDocKeyword
            //                 ).then(res2 => {
            //                     if (res2.success) {
            //                         let webHttp = `${BASE_URL}/${res2.data[0].path}`;
            //                         window.open(
            //                             `https://view.officeapps.live.com/op/view.aspx?src=${webHttp}`,
            //                             "_blank"
            //                         );
            //                     } else {
            //                         this.$message.error(res2.msg);
            //                     }
            //                 });
            //             }
            //         } else {
            //             this.$message.error(res.msg);
            //         }
            //     });
            // } else {
            //     this.$message.error("请选择文件");
            // }
        },
        // 退出预览
		exitPreview() {
            this.isTable = true
			// this.$store.commit("menu/ISTABLE", true);
			this.$store.commit('PerMessage/CHANGE_ACTIVENAME', 'c');
			this.$store.commit('home/ASIDER_SHOW_CONTROL')
		},
        reFiles() {
            let { pid } = this;
            const { tree, treeNode, resolve } = this.maps.get(pid);
            this.$set(this.$refs.DocList.store.states.lazyTreeNodeMap, pid, []);
            this.tableLoad(tree, treeNode, resolve);
        },
        async tableLoad(tree, treeNode, resolve) {
            let rdata = [],
                imgUrl = "",
                arr = [];
            this.pid = tree.Keyword;
            this.maps.set(this.pid, { tree, treeNode, resolve });
            const res = await UserApi3.getAttachFiles(tree.Keyword);
            if (res.success && res.data[0].VersionList) {
                // 参考
                arr = res.data[0].RefDocList;
                if (arr.length > 0) {
                    arr.forEach(item => {
                        imgUrl = VersionIcon(
                            item.DocInfo[0].O_version,
                            "RefDocList"
                        );
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
                    imgUrl = VersionIcon(
                        item.DocInfo[0].O_version,
                        "VersionList"
                    );
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
                { ProjectKeyWord } = vm,
                filterJson = [],
                page = 1,
                limit = 50;
            filterJson.push(
                {
                    name: "o_itemname",
                    value: `(o_itemname LIKE '%${this.formInline.user}%' or o_itemdesc LIKE '%${this.formInline.user}%' )`
                },
                { name: "searchAttr", value: "true" },
                { name: "filterstr", value: this.formInline.user }
            );
            filterJson = JSON.stringify(filterJson);
            this.$store.dispatch("doc/getDocList", {
                ProjectKeyWord,
                filterJson,
                page,
                limit
            });
        },
        // 拖拽上传 - 拖拽
        fileDragover(e) {
            e.preventDefault();
        },
        // 拖拽上传 - 放置
        fileDrop(e) {
            e.preventDefault();
            this.UploadFiles = [];
            // // 获取到第一个上传的文件对象
            let files = [];
            e.dataTransfer.files.forEach(item => {
                files.push(item);
            });
            this.UploadFiles = files;
        },
        // // 下载
		// async fileDownload(docKeyword) {
		// 	// 如果要做批量下载，选中的文档在this.ChooseProfessionData.docKeyWord里
        //     let DocKeyword = docKeyword || this.DocKeyword
        //     console.log(DocKeyword)
		// 	let RefDocKeyword = "";
		// 	if (DocKeyword) {
		// 		const res = await UserApi3.fileDownload(DocKeyword, RefDocKeyword);
		// 		if (res.success) {
		// 			var prePath = res.data[0].prePath;
        //             var fileName = res.data[0].filename;
        //             var para = res.data[0].para;
                                
        //             //组装文件下载路径
        //             var url = BASE_URL + '/' + prePath + encodeURIComponent(fileName) + "?p=" + para;

        //             windowDownloadFile(url, DocKeyword);
		// 		} else {
		// 			this.$message.error(res.msg);
		// 		}
		// 	} else {
		// 		this.$message.error("请选择文件");
		// 	}
        // },
        // 下载
		async fileDownload() {
			// 如果要做批量下载，选中的文档在this.ChooseProfessionData.docKeyWord里

			// 批量下载
            let choose = this.ChooseProfessionData.docKeyWord.map(i => i.Keyword)
            // console.log(this.ChooseProfessionData)
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
                    let { ProjectKeyWord } = vm;
                    vm.$store.dispatch("doc/getDocList", {
                        ProjectKeyWord,
                        filterJson,
                        page,
                        limit
                    });
                }
            }
        },
        // 点击列表
        handleCurrentChange(val) {
            let vm = this;
            if (val !== null) {
                vm.$refs.DocList.clearSelection();
                vm.$refs.DocList.toggleRowSelection(val);
                // if (val.Keyword === vm.DocKeyword) return
                vm.DocKeyword = val.Keyword;
                vm.$store.dispatch("doc/getDocBaseAttr", val.Keyword);
            }
        },
        // 多选列表
        handleSelectionChange(val) {
            // this.multipleSelection = val;
            // let vm = this
			this.multipleSelection = val;
			this.ChooseProfessionData.docKeyWord = val;
			// 2020.4.15-4
			if (val.length > 0) {
				this.$store.dispatch("doc/getDocBaseAttr", val[val.length - 1].Keyword);
			}
			// 2020.4.27-2
        },
        replaceFile(fileList) {
			if (fileList.length === 1) {
                let file = fileList[0]
                let filename = this.multipleSelection[this.multipleSelection.length - 1].Title
                // let filename = ''
                // for(let i in this.DocBaseAttr) {
                //     if (this.DocBaseAttr[i].AttrCode === "O_filename") {
                //         filename = this.DocBaseAttr[i].AttrValue
                //         break
                //     }
                // }
                // filename = filename.split('.')[0]
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
            // 转到源目录
            if (e.Id === "MS_OpenShortcutProject") {
                // console.log(this.DocKeyword);
                this.getDocLocation();
            }

            if (e.Id === "MS_DeleteDoc") {
                this.multipleSelection.forEach(item => {
                    arr.push(item.Keyword);
                });
                vm.rightData.DocKeyword = arr;
            } else if (e.Id === "MS_ReplaceDoc") {
                // this.isReplaceFile = true;
                // this.$nextTick(() => {
                //     document.getElementById("ReplaceFile").click();
                // });
                this.$refs.replaceFile.click()
                return;
            } else if (e.Id === "MS_PreviewDoc") {
                this.PreviewHandle();
                return;
            } else {
                vm.rightData.DocKeyword = vm.DocKeyword;
            }
            vm.rightData.switch = true;
            vm.rightData.Id = e.Id;
            vm.rightData.dialogTitle = e.Name;
            this.rightData.projectId = this.ProjectKeyWord
        },
        reData(e) {
            if (e[1].o_code !== undefined) {
                this.reProcessData = e[1];
                this.openPermissionList();
            } else {
                const filterJson = "",
                    page = 1,
                    limit = 50;
                let { ProjectKeyWord } = this;
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
            UserApi4.getMenuList(ProjectList, Position, TvPosition).then(
                res => {
                    vm.MenuList = res.data;
                    vm.len = res.data.length * 33;
                    vm.styleObject.opacity = 1;
                    // getBoundingClientRect 獲取視窗寬高
                    if (
                        event.clientY >
                        vm.$el.getBoundingClientRect().height / 1.1
                    ) {
                        vm.styleObject.top = event.clientY - vm.len - 10 + "px";
                    } else if (
                        event.clientY >
                        vm.$el.getBoundingClientRect().height / 1.3
                    ) {
                        vm.styleObject.top =
                            event.clientY - vm.len + 100 + "px";
                    } else {
                        vm.styleObject.top = event.clientY - 10 + "px";
                    }
                    vm.styleObject.left = event.clientX + 30 + "px";
                }
            );

            // vm.styleObject.top = event.clientY + 'px'
            // vm.styleObject.left = event.clientX + 10 + 'px'
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
                { ProjectKeyWord } = this;
            const filterJson = "",
                limit = 50;
            this.$store.dispatch("doc/getDocList", {
                ProjectKeyWord,
                filterJson,
                page,
                limit
            });
        },
        // 跳转
        async getDocLocation() {
            // 获取 ProjectKeyWord
            let Keyword = this.DocKeyword,
                IgnoreShortCut = "false";
            const res = await ProjectApi.getProjectPath(
                Keyword,
                IgnoreShortCut
            );
            if (res.success) {
                const ProjectKeyWord = res.data[0].ProjectKeyword;
                //  储存位置
                await ProjectApi.saveLastProject(ProjectKeyWord);
                this.$router.push({ name: "DocManagement" });
                //  获取列表
                // const filterJson = '', page = 1, limit = 50
                // const res3 = await UserApi3.getDocList(ProjectKeyWord, filterJson, page, limit)
                // if (res3.success) {
                //   let KeywordList = res3.data.filter(item => item.Keyword === Keyword)
                //   this.$store.commit('PerMessage/ATTACHMENT_MOVE_DOC', KeywordList[0])
                // }
            }
        }
    }
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