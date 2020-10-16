<!--
    方圆 创建发文弹窗
-->
<template>
    <div class="creatFile">
        <el-form :model="fileForm" ref="fileForm">
            <el-form-item label="函件编码" prop="detail">
                <el-col :span="6">
                    <el-input v-model="fileForm.num" readonly />
                    <div class="fileLine">项目号</div>
                </el-col>
                <el-col :span="1" class="fileLine">—</el-col>
                <el-col :span="6">
                    <el-select v-model="fileForm.unit">
                        <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <div class="fileLine">发文单位</div>
                </el-col>
                <el-col :span="2" class="flexR">
                    <div>—</div>
                    <div>S</div>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="fileForm.serialNum" />
                    <div class="fileLine">函件流水号</div>
                </el-col>
            </el-form-item>
            <el-form-item label="函件主题" prop="theme">
                <el-input v-model="fileForm.theme" style="width: 87.6%;" />
            </el-form-item>
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item label="是否发文" prop="isSend">
                        <el-select v-model="fileForm.isSend">
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文件形式" prop="fileType">
                        <el-select v-model="fileForm.fileType">
                            <el-option label="EM_电子可修改版" value="EM_电子可修改版"></el-option>
                            <el-option label="P_打印件" value="P_打印件"></el-option>
                            <el-option label="O_原件" value="O_原件"></el-option>
                            <el-option label="C_拷贝盘" value="C_拷贝盘"></el-option>
                            <el-option label="E_电子版(.pdf)" value="E_电子版(.pdf)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发放途径" prop="way">
                        <el-select v-model="fileForm.way">
                            <el-option label="邮寄" value="邮寄"></el-option>
                            <el-option label="当面递交" value="当面递交"></el-option>
                            <el-option label="邮件" value="邮件"></el-option>
                            <el-option label="内部OA" value="内部OA"></el-option>
                            <el-option label="共享盘" value="共享盘"></el-option>
                            <el-option label="业主共享平台" value="业主共享平台"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发送版本" prop="version">
                        <el-select v-model="fileForm.version">
                            <el-option label="中文" value="中文"></el-option>
                            <el-option label="英文" value="英文"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否保密" prop="isSecrecy">
                        <el-select v-model="fileForm.isSecrecy">
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="回复时间" class="date" prop="date">
                        <el-date-picker type="date" placeholder="选择时间" v-model="fileForm.date"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提交目的" prop="purpose">
                        <el-select v-model="fileForm.purpose">
                            <el-option label="1_按需求提交" value="1_按需求提交"></el-option>
                            <el-option label="2_审查" value="2_审查"></el-option>
                            <el-option label="3_告知" value="3_告知"></el-option>
                            <el-option label="4_采购" value="4_采购"></el-option>
                            <el-option label="5_供应商" value="5_供应商"></el-option>
                            <el-option label="6_交工资料" value="6_交工资料"></el-option>
                            <el-option label="7_批准" value="7_批准"></el-option>
                            <el-option label="8_预制" value="8_预制"></el-option>
                            <el-option label="9_施工" value="9_施工"></el-option>
                            <el-option label="10_提交" value="10_提交"></el-option>
                            <el-option label="11_其它" value="11_其它"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item></el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="增加意见" prop="idea">
                <el-input type="textarea" v-model="fileForm.idea" style="width: 87.6%" />
            </el-form-item>
            <!-- <el-form-item label="附件" class="uploadItem" prop="file">
        <div class="uploadFileBox">
          <ul v-if="file">
            <li class="el-upload-list__item is-ready" v-for="(item,index) in file" :key="index">
              <a class="el-upload-list__item-name">
                <img :src="item.src" alt />
                {{item.name}}
            </a>-->
            <!-- <i class="el-icon-close" @click="handleRemove(index)"></i> -->
            <!-- </li>
          </ul>
        </div>
        <div class="fileUpload">
          <UploadFiles :uploadArr="UploadFiles" :autoUpload="autoUpload" @reData="reFiles" />
        </div>
            </el-form-item>-->
            <!-- 重写的上传模块 -->
            <div class="attachementList">
                <span>附件列表</span>
                <!-- <UploadFiles :uploadArr='uploadArr' :autoUpload='autoUpload' @fileDataChange='fileDataChange' @uploadCompleted='uploadCompleted'/> -->
                <uploadFiles2
                    :autoUpload="autoUpload"
                    :rawFileList.sync="fileList"
                    @uploadCompleted="uploadCompleted"
                    :ProjectKeyWord='ProjectKeyWord'
                ></uploadFiles2>
            </div>
            <div class="showListDiv">
                <div v-for="file in fileList" :key="file.uid">
                    <div>{{ file.name }}</div>
                    <div @click="removeFile(file)">
                        <i class="el-icon-close"></i>
                    </div>
                </div>
            </div>
        </el-form>
        <span slot="footer" class="footerBtn">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit('fileForm')">确定</el-button>
        </span>
    </div>
</template>
<script>
import docAPI from "./api/services/doc";
import proAPI from "../../api/services/project";
import { mapGetters } from "vuex";

export default {
    props: {
        dialogObj: {
            type: Object,
            required: true,
            default: function() {
                return {
                    switch: false
                };
            }
        }
    },
    computed: {
        ...mapGetters("doc", ["List", "ProjectKeyWord"]),
        // ...mapGetters("doc", ["ProjectKeyWord"]),

    },
    data() {
        return {
            // autoUpload: false,
            options: [],
            fileForm: {
                num: "",
                unit: "",
                serialNum: "",
                isSend: "是",
                isSecrecy: "是",
                purpose: "1_按需求提交",
                date: new Date(),
                idea: "",
                fileType: "EM_电子可修改版",
                way: "邮寄",
                version: "中文"
            },
            file: [],
            UploadFiles: [],
            pid: "",

            // 上传
            autoUpload: false,
            uploadArr: [],
            fileList: []
        };
    },
    methods: {
        // 启动流程
        start(keyword, doclist) {
            let docKeyword = keyword,
                DocList = doclist;
            docAPI.documentStartWorkFlow(docKeyword, DocList).then(res => {
                if (res.success) {
                    this.$message({
                        type: "success",
                        message: "启动成功"
                    });
                    this.cancel();
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                    this.cancel();
                }
            });
        },
        dialogClose() {
            this.$emit("reData", false);
        },
        cancel() {
            this.dialogClose();
            this.$refs["fileForm"].resetFields();
            this.file = [];
            this.autoUpload = false;
        },
        // 提交表单数据
        submit(formName) {
            this.$refs[formName].validate(valid => {
                let date = String(this.fileForm.date).slice(0, 24);
                if (valid) {
                    let ProjectKeyWord = this.dialogObj.projectId;
                    let attrJSON = [
                        { name: "RootProject", value: this.fileForm.num },
                        { name: "Company", value: this.fileForm.unit },
                        { name: "Number", value: this.fileForm.serialNum },
                        { name: "Title", value: this.fileForm.theme },
                        { name: "If", value: this.fileForm.isSend },
                        { name: "ReplyDate", value: date },
                        { name: "Language", value: this.fileForm.version },
                        { name: "Mif", value: this.fileForm.isSecrecy },
                        { name: "Route", value: this.fileForm.way },
                        { name: "File", value: this.fileForm.fileType },
                        { name: "SendObj", value: this.fileForm.purpose },
                        { name: "Note", value: this.fileForm.idea }
                    ];
                    let docAttrJson = JSON.stringify(attrJSON);
                    docAPI
                        .sendDocument(ProjectKeyWord, docAttrJson)
                        .then(res => {
                            if (res.success) {
                                this.$message({
                                    message: "添加成功",
                                    type: "success"
                                });
                                console.log(res.data[0].ProjectKeyword)
                                this.$store.commit(
                                    "doc/PTYPE",
                                    res.data[0].ProjectKeyword
                                );
                                this.getProjectPath(res.data[0].ProjectKeyword);
                                this.start(
                                    res.data[0].DocKeyword,
                                    res.data[0].DocList
                                );
                                this.autoUpload = true;
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: "warning"
                                });
                            }
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        // handleRemove(index) {
        //     this.$confirm("确认删除该文件", "确认删除", {
        //         distinguishCancelAndClose: true,
        //         confirmButtonText: "确认",
        //         cancelButtonText: "取消"
        //     })
        //         .then(() => {
        //             this.fileForm.file.splice(index, 1);
        //             this.$message({
        //                 type: "success",
        //                 message: "删除成功"
        //             });
        //         })
        //         .catch(() => {
        //             this.$message({
        //                 type: "info",
        //                 message: "取消删除"
        //             });
        //         });
        // },
        // 移除上传队列的某个文件
        removeFile(file) {
            let uid = file.uid;
            let cursor = this.fileList.map(i => i.uid).indexOf(uid);
            if (cursor != -1) {
                this.fileList.splice(cursor, 1);
            }
        },
        // 上传完成
        uploadCompleted() {
            console.log('上传完成')
        },
        getSendDocumentDefault() {
            let ProjectKeyword = this.dialogObj.projectId;
            docAPI.getSendDocumentDefault(ProjectKeyword).then(res => {
                if (res.success) {
                    this.fileForm.num = res.data[0].RootProjectCode;
                    this.fileForm.serialNum = res.data[0].DocNumber;
                    this.options = res.data[0].CompanyList;
                    this.fileForm.unit = Object.keys(this.options)[0];
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            });
        },
        // 开启位置
        async getProjectPath(projectKeyword) {
            //  储存位置
            await proAPI.saveLastProject(projectKeyword);
            this.$store.commit("project/REFRESH_TREE", true);
        },
        reFiles() {
            let { pid } = this;
            this.$set(this.$refs.DocList.store.states.lazyTreeNodeMap, pid, []);
        }
    },
    watch: {
        dialogObj: {
            handler(newValue) {
                if (newValue.switch) {
                    this.getSendDocumentDefault();
                } else {
                    return;
                }
            },
            immediate: true,
            deep: true
        },
        List: {
            handler(newValue) {
                if (newValue) {
                    this.file = newValue;
                }
            }
        }
    }
};
</script>
<style lang="scss" scope>
.creatFile {
    .flexR {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .el-form-item__label {
        width: 100px;
    }
    .date {
        .el-input__prefix {
            display: none;
        }
        .el-input--prefix .el-input__inner {
            padding-left: 15px;
        }
    }
    .uploadFileBox {
        display: inline-block;
        padding: 5px 15px;
        width: 61%;
        min-height: 110px;
        height: 100%;
        margin-right: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        li {
            line-height: 20px;
        }
        img {
            width: 4%;
            vertical-align: middle;
        }
    }
    .uploadItem {
        .el-form-item__content {
            display: flex;
            .uploadFileBox {
                flex: 7.5;
            }
            .fileUpload {
                flex: 1;
            }
        }
    }
    .fileUpload {
        display: inline-block;
        vertical-align: top;
    }
    .fileLine {
        text-align: center;
    }
}
</style>
