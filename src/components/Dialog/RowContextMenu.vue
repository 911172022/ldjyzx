<template>
    <el-dialog
        :title="dialogObj.dialogTitle"
        :visible.sync="dialogObj.switch"
        :class="'width-' + parseInt(dialogWidth)"
        width="90%"
        :before-close="dialogClose"
    >
        <!-- 启动流程 -->
        <template v-if="isStatus === 1">
            <div class="FixedHeight">
                <el-scrollbar>
                    <el-tree
                        :data="processData"
                        :props="processProps"
                        @node-click="handleNodeClick"
                    ></el-tree>
                </el-scrollbar>
            </div>
            <span slot="footer">
                <el-button size="small" @click="dialogClose">取消</el-button>
                <el-button type="primary" size="small" @click="startProcess">确定</el-button>
            </span>
        </template>
        <!-- 属性编辑 -->
        <template v-else-if="isStatus === 2">
            <el-dialog
                class="dialogInnerModule width-50"
                title="模板选择"
                :visible.sync="innerVisible"
                append-to-body
                width='90%'
            >
                <div style="margin-bottom: 10px;text-align: right;">
                    <span>提示:</span>
                    <img
                        :src="TemplateDocIcon"
                        width="15px"
                        style="vertical-align: text-bottom;"
                        alt
                    />
                    <span style="padding-left: 5px;">文档模版使用</span>
                    <img
                        :src="TemplateProIcon"
                        width="15px"
                        style="vertical-align: text-bottom;"
                        alt
                    />
                    <span style="padding-left: 5px;">目录模版使用</span>
                </div>
                <el-scrollbar>
                    <el-tree
                        :load="loadNode"
                        ref="TemplateList"
                        lazy
                        :props="props"
                        class="Common-Tree-Icon"
                        @node-click="handleNodeClick2"
                        highlight-current
                        node-key="text"
                        :default-expanded-keys="DefaultNode"
                    >
                        <template slot-scope="{ node }">
                            <span>
                                <img
                                    :src="TemplateIconChange(node.isLeaf)"
                                    width="20px"
                                    style="vertical-align: text-bottom;"
                                />
                                <span style="padding-left: 5px;">{{ node.label }}</span>
                            </span>
                        </template>
                    </el-tree>
                </el-scrollbar>
                <span slot="footer">
                    <el-button size="small" @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" size="small" @click="TemplateHandle">确 定</el-button>
                </span>
            </el-dialog>
            <el-form :model="editFileForm" ref="editFileForm" label-position="left">
                <el-form-item label="名称:" prop="doccode" :label-width="formLabelWidth">
                    <el-input v-model="editFileForm.doccode" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="描述:" prop="docdesc" :label-width="formLabelWidth">
                    <el-input v-model="editFileForm.docdesc" placeholder="请输入描述"></el-input>
                </el-form-item>
                <el-form-item label="模板:" prop="defname" :label-width="formLabelWidth">
                    <el-input v-model="editFileForm.defname" class="inputStyle" readonly></el-input>
                    <el-button type="primary" @click="openTemplate" class="buttonStyle">选择</el-button>
                </el-form-item>
                <el-form-item label="描述:" prop="defdesc" :label-width="formLabelWidth">
                    <el-input v-model="editFileForm.defdesc" readonly></el-input>
                </el-form-item>
                <el-form-item
                    label="文件名:"
                    prop="filename"
                    :label-width="formLabelWidth"
                    class="dialogUpload"
                >
                    <el-input v-model="editFileForm.filename" class="inputStyle" readonly disabled></el-input>
                    <!-- <el-upload
                        ref="upload"
                        action="#"
                        :http-request="httpRequest"
                        :show-file-list="false"
                        :on-success="onSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-error="onError"
                    >
                        <el-button type="primary" class="buttonStyle">选择</el-button>
                    </el-upload> -->
                    <uploadFiles3 
						:projectKeyword='dialogObj.projectId' 
						:autoUpload='false'
                        :rawFileList.sync='rawFileList'
                        :multiple='false'
						ref="upload"
					>
						<el-button
							size="small"
							type="primary"
						>选择</el-button>
					</uploadFiles3>
                </el-form-item>
                <el-form-item label="文件大小:" prop="filesize" :label-width="formLabelWidth">
                    <el-input v-model="editFileForm.filesize" readonly></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="resetForm('editFileForm')">取消</el-button>
                <el-button type="primary" size="small" @click="updateDocAttr">确定</el-button>
                <!-- <el-button type="primary" size="small" @click="dialogClose">应用</el-button> -->
            </span>
        </template>
        <!-- 删除 -->
        <template v-else-if="isStatus === 3">
            <el-row>
                <el-col :span="8">
                    <i class="el-icon-warning iconStyle"></i>
                </el-col>
                <el-col :span="16">
                    <p>是否要删除选中的文档？</p>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelHandle">取消</el-button>
                <el-button type="danger" size="small" @click="delProject(true)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import UserApi from "../../api/services/doc";
// import UserApi2 from "../../api/services/file";
import UserApi3 from "../../api/services/workflow";
import UserApi4 from "../../api/services/project";
// import { TimeChange } from "../../util/Time";
import { Doc_TemplateIconChange } from "@/util/Common";
import { mapGetters } from "vuex";
import { TemplateDocIcon, TemplateProIcon } from "../../const";

export default {
    props: {
        dialogObj: {
            type: Object,
            required: true,
            default: function () {
                return {
                    switch: false,
                    dialogTitle: "提示",
                };
            },
        },
    },
    data() {
        return {
            TemplateDocIcon,
            TemplateProIcon,
            formLabelWidth: "100px",
            innerVisible: false,
            dialogWidth: "25%",
            // 顯示區塊
            isStatus: null,
            // 啟動流程
            processData: [],
            processProps: {
                label: "text",
            },
            NodeData: {},
            // 編輯文档
            editFileForm: {
                doccode: "",
                docdesc: "",
                defname: "",
                defdesc: "",
                defkeyid: "",
                filename: "",
                filesize: 0,
            },
            // 上传的
            rawFileList: [],
            // msg
            // delmsg: "",
            // 上傳文件名
            // ServerFullFileName: "",
            // 上傳文件
            // isFile: {},
            // 默认展开的节点
            DefaultNode: ["所有模板"],
            // 模板
            props: {
                label: "text",
                isLeaf: "leaf",
            },
            nodeKeyword: "Root",
            TreeNodeData: {},
        };
    },
    watch: {
        rawFileList(v) {
            if (v.length > 0) {
                this.editFileForm.filename = v[0].name
                this.editFileForm.filesize = v[0].size
            }

        },
        dialogObj: {
            handler(newValue) {
                console.log(newValue)
                if (!newValue.switch) return;
                const id = newValue.Id;
                switch (id) {
                    // 启动流程
                    case "MS_StartProcess":
                        this.isStatus = 1;
                        this.StartNewWorkFlow();
                        break;
                    // 属性编辑
                    case "MS_ModiDocAttr":
                        this.isStatus = 2;
                        this.getDocAttr();
                        break;
                    // 预览文件
                    // case 'MS_PreviewDoc':
                    //   this.isStatus = 4
                    // break
                    // 替换文件
                    // case 'MS_ReplaceDoc':
                    //   this.isStatus = 4
                    // break
                    // 删除
                    case "MS_DeleteDoc":
                        this.delProject(false);
                        this.isStatus = 3;
                        break;
                    default:
                        this.cancelHandle();
                }
                if (
                    newValue.index === 6 ||
                    newValue.index === 1 ||
                    newValue.index === 2
                ) {
                    this.dialogWidth = "20%";
                } else {
                    this.dialogWidth = "25%";
                }
            },
            deep: true,
        },
    },
    computed: {
        ...mapGetters("doc", ["ProjectKeyWord"]),
    },
    methods: {
        // 切换目录树图标
        TemplateIconChange(isleaf) {
            return Doc_TemplateIconChange(isleaf);
        },
        async openTemplate() {
            let node = "Root";
            await UserApi4.getTempDefList(node);
            this.innerVisible = true;
        },
        async loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([{ text: "所有模板" }]);
            }
            if (node.data.fullpath !== undefined) {
                this.nodeKeyword = node.data.fullpath;
            }
            const res = await UserApi4.getTempDefList(this.nodeKeyword);
            const rdata = [];
            res.data.forEach((item) => {
                rdata.push({
                    text: item.text,
                    leaf: item.leaf,
                    fullpath: item.id,
                });
            });
            resolve(rdata);
        },
        TemplateHandle() {
            let str = this.TreeNodeData.text;
            let arr = str.split("__");
            this.editFileForm.defname = arr[0];
            this.editFileForm.defdesc = arr[1];
            this.editFileForm.defkeyid = this.TreeNodeData.fullpath;
            this.innerVisible = false;
        },
        // async beforeAvatarUpload(file) {
        //     if (file.name) {
        //         this.isFile = file;
        //         let fileSize = file.size,
        //             ModifyDate = TimeChange(file.lastModifiedDate),
        //             ServerFileName = file.name,
        //             ObjectKeyword = this.dialogObj.DocKeyword,
        //             CreateDate = "";
        //         const res = await UserApi2.beforeUploadFile(
        //             ObjectKeyword,
        //             ServerFileName,
        //             CreateDate,
        //             ModifyDate,
        //             fileSize
        //         );
        //         this.ServerFullFileName = res.data[0].ServerFullFileName;
        //     }
        // },
        // async httpRequest(e) {
        //     let { ServerFullFileName } = this;
        //     if (ServerFullFileName) {
        //         let Files = e.file;
        //         await UserApi2.uploadFile(ServerFullFileName, Files);
        //     }
        // },
        // // 用户表单 - 上传文件成功
        // async onSuccess() {
        //     let vm = this,
        //         { DocKeyword } = vm.dialogObj,
        //         { ServerFullFileName } = vm;
        //     await UserApi2.afterUploadFile(DocKeyword, ServerFullFileName);
        //     vm.editFileForm.filename = vm.isFile.name;
        //     vm.editFileForm.filesize = vm.isFile.size;
        //     vm.$message({ message: "上传成功", type: "success" });
        // },
        // // 用户表单 - 上传文件失败
        // onError() {
        //     this.$message.error("上传失败");
        // },
        // 編輯文檔 - 獲取
        async getDocAttr() {
            let action = "ModiDoc",
                { DocKeyword } = this.dialogObj;
            const res = await UserApi.getDocAttr(action, DocKeyword);
            if (res.success) {
                this.editFileForm = res.data[0];
            }
        },
        // 編輯文檔 - 確定
        async updateDocAttr() {
            let vm = this,
                docKeyword = vm.dialogObj.DocKeyword,
                docAttrJson = [];
            docAttrJson.push(
                { name: "docCode", value: vm.editFileForm.doccode },
                { name: "docDesc", value: vm.editFileForm.docdesc },
                { name: "tempDefnId", value: vm.editFileForm.defkeyid }
            );
            const res = await UserApi.updateDocAttr(docKeyword, docAttrJson);
            if (res.success) {
                vm.$message({ message: "修改完成", type: "success" });
                // 上传文件
                let fileList = this.rawFileList
                if (fileList.length === 1) {
                    let file = fileList[0]
                    let filename = ''
                    filename = this.editFileForm.doccode
                    if (vm.editFileForm.docdesc) {
                        filename = filename + '__' + this.editFileForm.docdesc
                    }
                    if (file.name.split('.').length > 1) {
                        filename = filename + '.' + file.name.split('.').pop()
                    }
                    this.$store.dispatch({
                        type: 'upload/specifyUploadInfo',
                        file: {
                            ...file,
                            docKeyword: docKeyword,
                            filename,
                            projectKeyword: this.dialogObj.projectId
                        }
                    })
                }
                this.rawFileList = []
                vm.resetForm("editFileForm");
            } else {
                vm.$message({ message: res.message, type: "error" });
            }
        },
        // 啟動流程
        async StartNewWorkFlow() {
            this.processData = [];
            let DocList = this.dialogObj.DocKeyword,
                WfKeyword = "",
                userlist = "";
            const res = await UserApi3.startNewWorkFlow(
                DocList,
                WfKeyword,
                userlist
            );
            res.data[0].dwfList.forEach((item) => {
                this.processData.push(item);
            });
        },
        // 刪除文檔
        async delProject(e) {
            let vm = this,
                sureDel = e,
                ProjectKeyword = vm.ProjectKeyWord,
                { DocKeyword } = vm.dialogObj,
                isSuccess = true,
                msg = "";
            if (sureDel) {
                for (let i = 0; i < DocKeyword.length; i++) {
                    if (!isSuccess) return;
                    const res = await UserApi.deleteDoc(
                        ProjectKeyword,
                        DocKeyword[i],
                        sureDel
                    );
                    if (res.success) isSuccess = true;
                    else {
                        (isSuccess = false), (msg = res.message);
                    }
                }
                if (isSuccess)
                    vm.$message({ message: "刪除成功息", type: "success" });
                else {
                    vm.$message({ message: msg, type: "error" });
                }
                (isSuccess = true), (msg = "");
                vm.cancelHandle();
            }
        },
        // tree 点击节点
        handleNodeClick2(data) {
            this.TreeNodeData = data;
        },
        handleNodeClick(data) {
            this.NodeData = data;
        },
        // 啟動流程 - 確認
        async startProcess() {
            let DocList = this.dialogObj.DocKeyword,
                WfKeyword = this.NodeData.o_code,
                userlist = "";
            const res = await UserApi3.startNewWorkFlow(
                DocList,
                WfKeyword,
                userlist
            );
            if (res.success) {
                this.cancelHandle();
            }
        },
        // 关闭弹窗
        dialogClose() {
            this.cancelHandle();
        },
        // 用户弹窗 - 取消按钮
        cancelHandle() {
            let vm = this;
            vm.dialogObj.Id = "";
            vm.dialogObj.projectId = "";
            // vm.delmsg = "";
            vm.$emit("reData", false, this.NodeData);
            vm.NodeData = {};
        },
        // 重置表單
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.cancelHandle();
        },
        // tree 搜索节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
    },
};
</script>
<style lang="scss">
.dialogInnerModule {
    .el-dialog {
        width: 30%;
        .el-dialog__body {
            height: 300px;
        }
    }
}
.copyModule {
    .CM-title {
        background-color: #f2f1f6;
        padding: 10px 15px 5px;
        border-radius: 7px 7px 0 0;
        h3 {
            margin: 0;
        }
    }
    .CM-tree {
        border: 2px solid #f2f1f6;
    }
    .copyMain {
        margin-top: 12%;
        .MainBtn {
            text-align: center;
            margin-bottom: 20px;
            .el-button {
                width: 60%;
                padding: 12px;
                i {
                    display: block;
                    margin-bottom: 10px;
                    font-size: 40px;
                }
            }
        }
    }
}
.dialogUpload {
    .el-form-item__content {
        div:nth-child(2) {
            display: inline-block;
        }
    }
}
</style>
<style lang="scss">
.inputStyle {
    width: calc(100% - 80px);
    margin-right: 10px;
}
.buttonStyle {
    display: inline-block;
}
</style>
