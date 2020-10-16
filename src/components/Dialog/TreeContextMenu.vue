<template>
    <!-- :width="dialogWidth" -->

    <el-dialog
        :title="dialogObj.dialogTitle"
        :visible.sync="dialogObj.switch"
        :before-close="dialogClose"
        :class="`width-${ parseInt(dialogWidth) }`"
        width="90%"
        :close-on-click-modal='false'
    >
        <!-- 模版选择 -->
        <TemplateSelection :dialogObj="TemplateData" @reData="reTData" @reTemplate="reTemplate" />
        <!-- 新建目录, 新建根目录 ,属性编辑 -->
        <template v-if="isStatus === 1">
            <el-form :model="addForm" ref="addForm" label-position="left">
                <el-form-item label="名称:" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="addForm.name" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="描述:" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="addForm.description" placeholder="请输入描述" />
                </el-form-item>
                <el-form-item label="链接:" :label-width="formLabelWidth" prop="navUrl">
                    <el-input v-model="addForm.navUrl" placeholder="请输入3D模型预览链接"></el-input>
                </el-form-item>
                <el-form-item label="模板:" :label-width="formLabelWidth" prop="defname">
                    <el-input class="inputStyle" v-model="addForm.defname" disabled />
                    <el-button class="buttonStyle" type="primary" @click="TemplateHandle">选择</el-button>
                </el-form-item>
                <el-form-item label="描述:" :label-width="formLabelWidth" prop="defdesc">
                    <el-input v-model="addForm.defdesc" disabled />
                </el-form-item>
                <el-form-item label="存储:" :label-width="formLabelWidth" prop="storage">
                    <el-select v-model="addForm.storage" style="width: 100%;">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-row>
                    <el-col :span="4" style="text-align: left;">
                        <el-checkbox v-model="addChecked">隐藏</el-checkbox>
                    </el-col>
                    <el-col :span="20">
                        <el-button size="small" @click="resetForm('addForm')">取消</el-button>
                        <el-button type="primary" size="small" @click="createProject">确定</el-button>
                        <!-- <el-button type="primary" size="small" @click="cancelHandle">应用</el-button> -->
                    </el-col>
                </el-row>
            </span>
        </template>
        <!-- 新建查询 -->
        <template v-else-if="isStatus === 3">
            <el-form :model="newSearchForm" ref="newSearchForm" label-position="left">
                <el-form-item label="名称:" :label-width="formLabelWidth">
                    <el-input v-model="newSearchForm.name" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="描述:" :label-width="formLabelWidth">
                    <el-input v-model="newSearchForm.description" placeholder="请输入描述" />
                </el-form-item>
                <el-form-item label="查询语句:" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        v-model="newSearchForm.Statement"
                        rows="4"
                        placeholder="请输入查询语句"
                    />
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="resetForm('newSearchForm')">取消</el-button>
                <el-button type="primary" size="small" @click="newGlobalOrUserProject">确定</el-button>
            </span>
        </template>
        <!-- 复制创建目录 -->
        <template v-else-if="isStatus === 4">
            <div class="copyModule flex-row">
                <div style="flex: 1; overflow: hidden;">
                    <div class="CM-title">
                        <h3>项目目录结构</h3>
                    </div>
                    <div class="CM-tree">
                        <el-tree
                            class="CM-tree-filter Common-Tree-Icon"
                            :props="props"
                            :load="loadNode"
                            lazy
                            highlight-current
                            @node-click="handleNodeClick2"
                            :render-content="renderContent"
                        ></el-tree>
                    </div>
                </div>
                <div class="btn-wrapper">
                    <div class="MainBtn">
                        <el-button
                            size="small"
                            type="primary"
                            @click="DirectoryHandle('single')"
                            :disabled="!isLoaingSingle"
                        >
                            <div>
                                <i :class="isLoaingSingle? 'el-icon-caret-right' : 'el-icon-loading'"></i>
                                <div>
                                    选择单一目录
                                </div>
                            </div>
                        </el-button>
                    </div>
                    <div class="MainBtn">
                        <el-button
                            size="small"
                            type="primary"
                            @click="DirectoryHandle('Peer')"
                            :disabled="!isLoaingPeer"
                        >
                            <div>
                                <i :class="isLoaingPeer? 'el-icon-caret-right' : 'el-icon-loading'"></i>
                                <div>
                                    选择同级目录
                                </div>
                            </div>
                        </el-button>
                    </div>
                    <div class="MainBtn">
                        <el-dropdown @command="handleCommand">
                            <el-button type="primary" size="small">
                                更多选择
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="First">选择目录及一级子目录</el-dropdown-item>
                                <el-dropdown-item command="Second">选择目录及一二级子目录</el-dropdown-item>
                                <el-dropdown-item command="All">选择目录及所有子目录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div style="flex: 1; overflow: hidden;">
                    <div class="CM-title">
                        <h3>新建目录</h3>
                    </div>
                    <div class="CM-tree">
                        <el-tree
                            class="CM-tree-filter Common-Tree-Icon"
                            :data="CopyDirectory"
                            :props="props"
                            ref="CopyDirectory"
                            node-key="deleteId"
                            default-expand-all
                            @node-contextmenu="DeleteNodeHandle"
                        >
                            <template slot-scope="{ node }">
                                <span>
                                    <img
                                        :src="TreeIconChange(node.isLeaf)"
                                        width="20px"
                                        style="vertical-align: text-bottom;"
                                    />
                                    <span style="padding-left: 5px;">{{ node.label }}</span>
                                </span>
                            </template>
                        </el-tree>
                    </div>
                </div>
            </div>

            <!-- <el-row class="copyModule">
                <el-col :span="9">
                    <div class="CM-title">
                        <h3>项目目录结构</h3>
                    </div>
                    <div class="CM-tree">
                        <el-tree
                            class="CM-tree-filter Common-Tree-Icon"
                            :props="props"
                            :load="loadNode"
                            lazy
                            highlight-current
                            @node-click="handleNodeClick2"
                            :render-content="renderContent"
                        ></el-tree>
                    </div>
                </el-col>
                <el-col :span="6" class="copyMain">
                    <div class="MainBtn">
                        <el-button
                            type="primary"
                            @click="DirectoryHandle('single')"
                            :disabled="!isLoaingSingle"
                        >
                            <i :class="isLoaingSingle? 'el-icon-caret-right' : 'el-icon-loading'"></i>选择单一目录
                        </el-button>
                    </div>
                    <div class="MainBtn">
                        <el-button
                            type="primary"
                            @click="DirectoryHandle('Peer')"
                            :disabled="!isLoaingPeer"
                        >
                            <i :class="isLoaingPeer? 'el-icon-caret-right' : 'el-icon-loading'"></i>选择同级目录
                        </el-button>
                    </div>
                    <div style="text-align: center;">
                        <el-dropdown @command="handleCommand">
                            <el-button type="primary">
                                更多选择
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="First">选择目录及一级子目录</el-dropdown-item>
                                <el-dropdown-item command="Second">选择目录及一二级子目录</el-dropdown-item>
                                <el-dropdown-item command="All">选择目录及所有子目录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-col>
                <el-col :span="9">
                    <div class="CM-title">
                        <h3>新建目录</h3>
                    </div>
                    <div class="CM-tree">
                        <el-tree
                            class="CM-tree-filter Common-Tree-Icon"
                            :data="CopyDirectory"
                            :props="props"
                            ref="CopyDirectory"
                            node-key="deleteId"
                            default-expand-all
                            @node-contextmenu="DeleteNodeHandle"
                        >
                            <template slot-scope="{ node }">
                                <span>
                                    <img
                                        :src="TreeIconChange(node.isLeaf)"
                                        width="20px"
                                        style="vertical-align: text-bottom;"
                                    />
                                    <span style="padding-left: 5px;">{{ node.label }}</span>
                                </span>
                            </template>
                        </el-tree>
                    </div>
                </el-col>
            </el-row> -->
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelHandle">取消</el-button>
                <el-button size="small" type="primary" @click="addDirectory">新建</el-button>
            </span>
        </template>
        <!-- 新建文档 -->
        <template v-else-if="isStatus === 5">
            <el-form :model="newFileForm" ref="newFileForm" label-position="left">
                <el-form-item label="名称:" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="newFileForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="描述:" prop="description" :label-width="formLabelWidth">
                    <el-input v-model="newFileForm.description" placeholder="请输入描述"></el-input>
                </el-form-item>
                <el-form-item label="模板:" prop="defname" :label-width="formLabelWidth">
                    <el-input v-model="newFileForm.defname" class="inputStyle" disabled></el-input>
                    <el-button type="primary" @click="TemplateHandle" class="buttonStyle">选择</el-button>
                </el-form-item>
                <el-form-item label="描述:" prop="defdesc" :label-width="formLabelWidth">
                    <el-input v-model="newFileForm.defdesc" disabled></el-input>
                </el-form-item>
                <el-form-item
                    label="文件名:"
                    prop="name"
                    :label-width="formLabelWidth"
                    class="dialogUpload"
                >
                    <el-input v-model="newFileForm.fileName" class="inputStyle" disabled></el-input>
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
                <el-form-item label="文件大小:" prop="fileSize" :label-width="formLabelWidth">
                    <el-input v-model="newFileForm.fileSize" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="resetForm('newFileForm')">取消</el-button>
                <el-button type="primary" size="small" @click="CreateDoc">确定</el-button>
                <!-- <el-button type="primary" size="small" @click="cancelHandle">应用</el-button> -->
            </span>
        </template>
        <!-- 批量创建文档 -->
        <template v-else-if="isStatus === 6">
            <el-form
                :model="batchFileForm"
                ref="batchFileForm"
                :inline="true"
                label-position="left"
                :label-width="formLabelWidth"
            >
                <template v-for="(item, index) in batchFileForm.domains">
                    <el-form-item
                        label="代码:"
                        :key="index"
                        :label-width="formLabelWidth"
                        :prop="'domains.' + index + '.docCode'"
                        :rules="{
                required: true, message: '代码不能为空', trigger: 'blur'}"
                    >
                        <el-input v-model="item.docCode" placeholder="请输入代码" />
                    </el-form-item>
                    <el-form-item
                        label="描述:"
                        :key="item.key"
                        :label-width="formLabelWidth"
                        :prop="'domains.' + index + '.docDesc'"
                        :rules="{
                required: true, message: '描述不能为空', trigger: 'blur'}"
                    >
                        <el-input v-model="item.docDesc" placeholder="请输入描述" />
                    </el-form-item>
                    <el-form-item :key="item.index">
                        <el-button type="primary" size="small" @click="removeDomain(item)">删除</el-button>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer">
                <el-row>
                    <el-col :span="4" style="text-align: left;">
                        <el-button type="primary" size="small" @click="addDomain">添加</el-button>
                    </el-col>
                    <el-col :span="20">
                        <el-button size="small" @click="resetForm('batchFileForm')">取消</el-button>
                        <el-button
                            type="primary"
                            size="small"
                            @click="submitForms('batchFileForm')"
                        >保存</el-button>
                    </el-col>
                </el-row>
            </span>
        </template>
        <!-- 启动流程 -->
        <template v-else-if="isStatus === 7">
            <!-- 2020.4.16-4-2 -->
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
                <el-button size="small" @click="cancelHandle">取消</el-button>
                <el-button type="primary" size="small" @click="startProcess">确定</el-button>
            </span>
        </template>
        <!-- 搜索 -->
        <template v-else-if="isStatus === 8">
            <el-form :model="searchForm" ref="searchForm" label-position="left">
                <el-form-item label="搜索:" prop="name" :label-width="formLabelWidth">
                    <el-input @keyup.enter.native='searchProject' v-model="searchForm.name" placeholder="请输入名称" />
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="resetForm('searchForm')">取消</el-button>
                <el-button type="primary" size="small" @click="searchProject">确定</el-button>
            </span>
        </template>
        <!-- 删除 -->
        <template v-else-if="isStatus === 9">
            <el-row>
                <el-col :span="8">
                    <i class="el-icon-warning iconStyle"></i>
                </el-col>
                <el-col :span="16">
                    <p>{{ delmsg }}</p>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelHandle">取消</el-button>
                <el-button type="danger" size="small" @click="delProject(true)">确定</el-button>
            </span>
        </template>
        <!-- 2020.4.16-2-1 -->
        <!-- 新建厂家信息 -->
            <!-- <template v-else-if="isStatus === 10">
        <SetFactoryMes :dialogObj="SetFactoryMesData" @reData="cancelHandle" />
            </template>-->
            <!-- 创建发文 -->
            <!-- <template v-else-if="isStatus === 11">
        <CreateFile :dialogObj="CreateFileData" @reData="cancelHandle" />
            </template>-->
            <!-- 生成提资单 -->
            <!-- <template v-else-if="isStatus === 12">
        <PayList :dialogObj="PayListData" @reData="cancelHandle" />
            </template>-->
            <!-- 创建成品 -->
            <!-- <template v-else-if="isStatus === 13">
        <SetProduct :dialogObj="SetProductData" @reData="cancelHandle" />
            </template>-->
            <!-- 创建设计阶段与选择专业 -->
            <!-- <template v-else-if="isStatus === 14">
        <SelectMajors :dialogObj="SelectMajorsData" @reData="cancelHandle" />
            </template>-->
            <!-- 创建任务 -->
            <!-- <template v-else-if="isStatus === 15">
        <SetWork :dialogObj="SetWorkData" @reData="cancelHandle" />
            </template>-->
            <!-- 方圆创建发文 -->
            <!-- <template v-else-if="isStatus === 16">
        <FyCreateFile :dialogObj="FyCreateFileData" @reData="cancelHandle" />
            </template>-->
        <!-- 个人工作台新建目录 -->
        <template v-else-if="isStatus === 21">
            <el-form
                :model="perWorkBenchNewProject"
                ref="perWorkBenchNewProject"
                label-position="left"
            >
                <el-form-item label="代码:" prop="projectCode" :label-width="formLabelWidth">
                    <el-input v-model="perWorkBenchNewProject.projectCode" placeholder="请输入代码" />
                </el-form-item>
                <el-form-item label="描述:" prop="projectCode" :label-width="formLabelWidth">
                    <el-input v-model="perWorkBenchNewProject.projectDesc" placeholder="请输入描述" />
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button size="small" @click="resetForm('perWorkBenchNewProject')">取消</el-button>
                <el-button type="primary" size="small" @click="perWorkBenchAddProject">确定</el-button>
            </span>
        </template>

        <TreeCreateMenu
            :dialogObj="dialogObj"
            @cancelHandle="cancelHandle"
            @changeDialogWidth="changeDialogWidth"
            @refreshAsideL="refreshAsideL"
        />
        <!-- 新建BOS模型 2020.4.20-1 -->
        <AddBosModelDialog
            :dialogObj="dialogObj"
            @cancelHandle="cancelHandle"
            @changeDialogWidth="changeDialogWidth"
        />
    </el-dialog>
</template>
<script>
import UserApi from "../../api/services/project";
import UserApi2 from "../../api/services/doc";
import UserApi3 from "../../api/services/workflow";
import UserApi4 from "../../api/services/file";
import { TimeChange } from "../../util/Time";
import { Doc_TreeIconChange } from "@/util/Common";
import TemplateSelection from "../Dialog/TemplateSelection";

export default {
    props: {
        dialogObj: {
            type: Object,
            required: true,
            default: function() {
                return {
                    switch: false,
                    dialogTitle: "提示"
                };
            }
        }
    },
    data() {
        return {
            // 新建目录
            addForm: {
                name: "",
                description: "",
                defname: "",
                defdesc: "",
                defkeyid: "",
                storage: "",
                navUrl: ""
            },
            options: [],
            addChecked: false,
            // 新建查询
            newSearchForm: {
                name: "",
                description: "",
                Statement: ""
            },
            // 新建文档
            newFileForm: {
                name: "",
                description: "",
                defname: "",
                defdesc: "",
                defkeyid: "",
                fileName: "",
                fileSize: ""
            },
            // 新建文档 - 用于上传文件
            projectId: "",
            // 新建文档 - 上傳文件名
            ServerFullFileName: "",
            // 批量创建文档
            batchFileForm: {
                domains: [
                    {
                        docCode: "",
                        docDesc: "",
                        key: Date.now(),
                        index: new Date().getTime() + 1000
                    }
                ]
            },
            // 搜索
            searchForm: {
                name: ""
            },
            isLoaingSingle: true,
            isLoaingPeer: true,
            formLabelWidth: "100px",
            dialogWidth: "25%",

            // 配置选项
            props: {
                label: "text",
                children: "children"
            },
            // 啟動流程
            processData: [],
            processProps: {
                label: "text"
            },
            // 模板
            TemplateData: {
                switch: false
            },
            // 顯示區塊
            isStatus: null,
            // msg
            delmsg: "",
            StateName: null,
            NodeData: null,

            // 复制创建目录
            CopyDirectory: [],
            CopyObj: {},
            maps: new Map(),
            pid: "",
            Projects: [],
            command: "",
            deleteNum: 1,

            // // ZY start
            // SetFactoryMesData: {
            //   switch: false,
            //   projectId: ""
            // },
            // CreateFileData: {
            //   switch: false,
            //   projectId: ""
            // },
            // PayListData: {
            //   switch: false,
            //   projectId: "",
            //   title: ""
            // },
            // SetProductData: {
            //   switch: false,
            //   projectId: ""
            // },
            // SelectMajorsData: {
            //   switch: false,
            //   keyword: ""
            // },
            // SetWorkData: {
            //   switch: false,
            //   projectId: ""
            // },
            // FyCreateFileData: {
            //   switch: false,
            //   projectId: ""
            // },
            // // ZY end
            createObj: {
                switch: false,
                dialogTitle: "提示"
            },

            /* ------------------------------------------------------  */
            // 个人工作台新建目录
            perWorkBenchNewProject: {
                projectCode: "",
                projectDesc: ""
            },
            /* ------------------------------------------------------  */
            // 上传文件
            rawFileList: []
        };
    },
    components: {
        TemplateSelection
    },
    watch: {
        rawFileList(v) {
            if (v.length > 0) {
                this.newFileForm.fileName = v[0].name
                this.newFileForm.fileSize = v[0].size
            }
        },
        dialogObj: {
            // 2020.4.16-2-1
            async handler(newValue) {
                if (!newValue.switch) return;
                const id = newValue.Id;
                const CopyDirectory = newValue.contextMenuObj;
                if (id === "MS_CreateNewProject") {
                    if (newValue.from === "perWorkbench") {
                        this.dialogWidth = "50%";
                        this.isStatus = 21;
                    } else {
                        this.dialogWidth = "50%";
                        this.isStatus = 1;
                        this.addForm.name = "新建文件夹";
                        this.addForm.storage = newValue.options[0].storagetext;
                        newValue.options.forEach(item => {
                            this.options.push({
                                value: item.storagename,
                                label: item.storagetext
                            });
                        });
                    }
                } else if (id === "MS_CreateNewRootProject") {
                    this.dialogWidth = "50%";
                    this.isStatus = 1;
                    this.addForm.name = "新建文件夹";
                    this.dialogObj.projectId = "";
                    this.addForm.storage = newValue.options[0].storagetext;
                    newValue.options.forEach(item => {
                        this.options.push({
                            value: item.storagename,
                            label: item.storagetext
                        });
                    });
                } else if (id === "MS_CreateNewRootProjec_2") {
                    // 2020.5.11
                    // 在逻辑目录那里新建不成功，原因是status = 1 的模板里确认那里调用的接口是错的
                    // 要判断是从哪里来的，从个人工作台来的话要用另一个新建根目录的模板
                    if (newValue.from === "perWorkbench") {
                        this.dialogWidth = "50%";
                        this.isStatus = 21;
                    } else {
                        this.dialogWidth = "50%";
                        this.isStatus = 1;
                        this.addForm.name = "新建文件夹";
                        this.addForm.storage = newValue.options[0].storagetext;
                        newValue.options.forEach(item => {
                            this.options.push({
                                value: item.storagename,
                                label: item.storagetext
                            });
                        });
                    }
                } else if (
                    id === "MS_CreateGlobSearch" ||
                    id === "MS_CreateGlobSearch_2"
                ) {
                    this.isStatus = 3;
                } else if (id === "MS_CreateProjByDef") {
                    this.dialogWidth = "80%";
                    this.CopyDirectory.push({ ...CopyDirectory });
                    this.CopyDirectory[0].deleteId = 0;
                    this.isStatus = 4;
                } else if (id === "MS_CreateNewDoc") {
                    this.projectId = newValue.projectId;
                    this.newFileForm.name = "新建文档";
                    this.isStatus = 5;
                } else if (id === "MS_BatchCreateDoc") {
                    this.isStatus = 6;
                } else if (id === "MS_ModiProjAttr") {
                    this.dialogWidth = "50%";
                    this.isStatus = 1;
                    this.addForm.name = newValue.editForm.projname;
                    this.addForm.description = newValue.editForm.projdesc;
                    this.addForm.defname = newValue.editForm.defname;
                    this.addForm.defdesc = newValue.editForm.defdesc;
                    this.addForm.navUrl = newValue.editForm.navUrl;
                    newValue.options.forEach(item => {
                        this.options.push({
                            value: item.storagename,
                            label: item.storagetext
                        });
                        if (newValue.editForm.storage == item.storagetext) {
                            this.addForm.storage = item.storagetext;
                        }
                    });
                    this.addChecked = newValue.isHide;
                } else if (id === "MS_StartProjectFlow") {
                    this.isStatus = 7;
                    this.StartNewWorkFlow();
                } else if (id === "MS_SearchProj") {
                    this.isStatus = 8;
                } else if (id === "MS_DeleteProject") {
                    this.delProject(false);
                    this.isStatus = 9;
                } else if (id === "MS_MdsqlGlobaloruserProject") {
                    // 设置查询条件的三个参数
                    // newSearchForm: {
                    //   name: "",
                    //   description: "",
                    //   Statement: ""
                    // },
                    // 查询条件的属性
                    const res = await UserApi.getGlobalOrUserProject(
                        newValue.projectId
                    );
                    if (res.success) {
                        this.newSearchForm.name = res.data[0].Code;
                        this.newSearchForm.description = res.data[0].Desc;
                        this.newSearchForm.Statement = res.data[0].SQLString;
                        this.newSearchForm.Keyword = res.data[0].Keyword;
                        // 编辑查询条件
                        this.isStatus = 3;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error"
                        });
                    }
                } else if (id.indexOf("_") != -1) {
                    this.isStatus = null;
                } else {
                    this.cancelHandle();
                }

                //
                // switch (id) {
                //   // 新建目录
                //   case "MS_CreateNewProject":
                //     this.isStatus = 1;
                //     this.addForm.name = "新建文件夹";
                //     this.addForm.storage = newValue.options[0].storagetext;
                //     newValue.options.forEach(item => {
                //       this.options.push({
                //         value: item.storagename,
                //         label: item.storagetext
                //       });
                //     });
                //     break;
                //   // 新建根目录
                //   case "MS_CreateNewRootProject":
                //     this.isStatus = 1;
                //     this.addForm.name = "新建文件夹";
                //     this.dialogObj.projectId = "";
                //     this.addForm.storage = newValue.options[0].storagetext;
                //     newValue.options.forEach(item => {
                //       this.options.push({
                //         value: item.storagename,
                //         label: item.storagetext
                //       });
                //     });
                //     break;
                //   // 新建根目录
                //   case "MS_CreateNewRootProjec_2":
                //     this.isStatus = 1;
                //     this.addForm.name = "新建文件夹";
                //     this.addForm.storage = newValue.options[0].storagetext;
                //     newValue.options.forEach(item => {
                //       this.options.push({
                //         value: item.storagename,
                //         label: item.storagetext
                //       });
                //     });
                //     break;
                //   // 新建查询
                //   case "MS_CreateGlobSearch":
                //     this.isStatus = 3;
                //     break;
                //   // 复制创建目录
                //   case "MS_CreateProjByDef":
                //     this.dialogWidth = "60%";
                //     this.CopyDirectory.push({ ...CopyDirectory });
                //     this.CopyDirectory[0].deleteId = 0;
                //     this.isStatus = 4;
                //     break;
                //   // 新建文档
                //   case "MS_CreateNewDoc":
                //     this.projectId = newValue.projectId;
                //     this.newFileForm.name = "新建文档";
                //     this.isStatus = 5;
                //     break;
                //   // 批量创建文档
                //   case "MS_BatchCreateDoc":
                //     this.isStatus = 6;
                //     break;
                //   // 属性编辑
                //   case "MS_ModiProjAttr":
                //     this.isStatus = 1;
                //     this.addForm.name = newValue.editForm.projname;
                //     this.addForm.description = newValue.editForm.projdesc;
                //     this.addForm.defname = newValue.editForm.defname;
                //     this.addForm.defdesc = newValue.editForm.defdesc;
                //     this.addForm.navUrl = newValue.editForm.navUrl;
                //     newValue.options.forEach(item => {
                //       this.options.push({
                //         value: item.storagename,
                //         label: item.storagetext
                //       });
                //       if (newValue.editForm.storage == item.storagetext) {
                //         this.addForm.storage = item.storagetext;
                //       }
                //     });
                //     this.addChecked = newValue.isHide;
                //     break;
                //   // 启动流程
                //   case "MS_StartProjectFlow":
                //     this.isStatus = 7;
                //     this.StartNewWorkFlow();
                //     break;
                //   // 搜索...
                //   case "MS_SearchProj":
                //     this.isStatus = 8;
                //     break;
                //   // 删除
                //   case "MS_DeleteProject":
                //     this.delProject(false);
                //     this.isStatus = 9;
                //     break;
                //   case "HX_SelectProfession":
                //   case "HX_CreateCompany":
                //   case "HX_SendDocument":
                //   case "HX_ExchangeDocUpEdition":
                //   case "HX_ExcangeDoc":
                //   case "HX_CreateProdect":
                //   case "HX_CreateWorkTask":
                //   case "FY_SendDocument":
                //   case "FY_CreateCompany":
                //     this.testObj = newValue
                //     break;
                //   // 创建设计阶段与选择专业...
                //   case "HX_SelectProfession":
                //     this.isStatus = 14;
                //     this.dialogWidth = "25%";
                //     this.SelectMajorsData.switch = true;
                //     this.SelectMajorsData.startAtWfBtn = false;
                //     this.SelectMajorsData.keyword = newValue.projectId;
                //     break;
                //   // 新建厂家信息
                //   case "HX_CreateCompany":
                //     this.isStatus = 10;
                //     this.dialogWidth = "60%";
                //     this.SetFactoryMesData.switch = true;
                //     this.SetFactoryMesData.projectId = newValue.projectId;
                //     break;
                //   // 创建发文
                //   case "HX_SendDocument":
                //     console.log("HX")
                //     this.isStatus = 11;
                //     this.dialogWidth = "45%";
                //     this.CreateFileData.switch = true;
                //     this.CreateFileData.projectId = newValue.projectId;
                //     break;
                //   // 生成提资单
                //   case "HX_ExchangeDocUpEdition":
                //   case "HX_ExcangeDoc":
                //     this.dialogWidth = "40%";
                //     this.isStatus = 12;
                //     this.PayListData.title = newValue.dialogTitle;
                //     this.PayListData.switch = true;
                //     this.PayListData.projectId = newValue.projectId;
                //     break;
                //   // 创建成品单
                //   case "HX_CreateProdect":
                //     this.isStatus = 13;
                //     this.dialogWidth = "25%";
                //     this.SetProductData.switch = true;
                //     this.SetProductData.projectId = newValue.projectId;
                //     break;
                //   // 创建任务
                //   case "HX_CreateWorkTask":
                //     this.isStatus = 15;
                //     this.dialogWidth = "25%";
                //     this.SetWorkData.switch = true;
                //     this.SetWorkData.projectId = newValue.projectId;
                //     this.SetWorkData.text = "HX_CreateWorkTask";
                //     break;
                //      // 方圆创建发文
                //   case "FY_SendDocument":
                //     console.log("FY")
                //     this.isStatus = 16;
                //     this.dialogWidth = "45%";
                //     this.FyCreateFileData.switch = true;
                //     this.FyCreateFileData.projectId = newValue.projectId;
                //     break;
                //     // 方圆新建厂家信息
                //   case "FY_CreateCompany":
                //     this.isStatus = 10;
                //     this.dialogWidth = "60%";
                //     this.SetFactoryMesData.switch = true;
                //     this.SetFactoryMesData.projectId = newValue.projectId;
                //     break;
                //   default:
                //     // this.cancelHandle();
                //     console.log('123123')
                // }
            },
            deep: true
        }
    },
    methods: {
        // 改变dialog大小
        changeDialogWidth(val) {
            this.dialogWidth = val;
        },
        // 刷新asideL
        refreshAsideL(v) {
            this.$emit("refreshAsideL", v);
        },
        // 模板选择
        TemplateHandle() {
            this.TemplateData.type = this.isStatus === 1 ? "Project" : "Doc";
            this.TemplateData.switch = true;
        },
        // 关闭模板弹窗
        reTData(e) {
            this.TemplateData.switch = e;
            this.TemplateData.type = "";
        },
        async reTemplate(e) {
            let vm = this;
            if (vm.isStatus === 1) {
                vm.addForm.defname = e.defname;
                vm.addForm.defdesc = e.defdesc;
                vm.addForm.defkeyid = e.defkeyid;
            } else if (vm.isStatus === 5) {
                vm.newFileForm.defname = e.defname;
                vm.newFileForm.defdesc = e.defdesc;
                vm.newFileForm.defkeyid = e.defkeyid;
            }
        },
        // 复制创建目录 - 载入左侧 tree
        async loadNode(node, resolve) {
            let nodeKeyword = "Root";
            if (node.data !== undefined) {
                nodeKeyword = node.data.projectId;
            }
            const ProjectType = "1";
            const res = await UserApi.getProjectList(nodeKeyword, ProjectType);
            const rdata = [];
            this.pid = nodeKeyword;
            this.maps.set(this.pid, res.data);
            res.data.forEach(item => {
                rdata.push({
                    text: item.text,
                    leaf: item.leaf,
                    projectId: item.Keyword,
                    fullpath: item.id,
                    icon: Doc_TreeIconChange(item.leaf) // 切换目录树图标
                });
            });
            resolve(rdata);
        },
        // 目录树内容自定义渲染方式
        // renderContent(h, { node, data, store }) {
        // 原代码中store未使用
        renderContent(h, { node, data }) {
            return (
                <span>
                    <img
                        src={data.icon}
                        width="20px"
                        style="vertical-align: text-bottom;"
                    />
                    <span style="padding-left: 5px;">{node.label}</span>
                </span>
            );
        },
        // 切换目录树图标
        TreeIconChange(isleaf) {
            return Doc_TreeIconChange(isleaf);
        },
        // 复制创建目录 - 点击获取左侧 treedata
        async handleNodeClick2(data) {
            this.CopyObj = data;
        },
        // 复制创建目录 - 点击更多选择
        handleCommand(command) {
            this.command = command;
            this.DirectoryHandle("Multi");
        },
        // 复制创建目录 - 判断是否重复
        async DirectoryHandle(e) {
            let vm = this,
                len = Object.keys(vm.CopyObj).length,
                isdelete = false;
            if (e === "single") vm.isLoaingSingle = false;
            else if (e === "Peer") vm.isLoaingPeer = false;
            if (len > 0) {
                if (vm.CopyDirectory[0].children) {
                    let index = vm.CopyDirectory[0].children.findIndex(
                        res => res.projectId === vm.CopyObj.projectId
                    );
                    if (index !== -1) {
                        vm.$confirm("此操作将覆盖目录, 是否继续?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                            .then(() => {
                                isdelete = true;
                                vm.copeChildNode(e, isdelete, index);
                            })
                            .catch(() => {
                                return;
                            });
                    } else {
                        vm.copeChildNode(e);
                    }
                } else {
                    vm.$set(vm.CopyDirectory[0], "children", []);
                    vm.copeChildNode(e);
                }
            } else {
                vm.$message({ message: "请添加目录", type: "error" });
                vm._$closeLoading();
                return;
            }
        },
        // 复制创建目录 - 添加目录
        async copeChildNode(LevelDirectory, isdelete = false, index) {
            let vm = this;
            if (LevelDirectory === "single") {
                if (isdelete) vm.CopyDirectory[0].children.splice(index, 1);
                vm.CopyDirectory[0].children.push({
                    text: vm.CopyObj.text,
                    leaf: vm.CopyObj.leaf,
                    projectId: vm.CopyObj.projectId,
                    fullpath: vm.CopyObj.fullpath,
                    deleteId: vm.deleteNum++
                });
            } else if (LevelDirectory === "Peer") {
                let arr = vm.CopyObj.fullpath.split("_"),
                    pid = "";
                if (arr.length > 1) {
                    arr.pop();
                    pid = arr.join("");
                } else pid = "Root";
                let value = [...vm.maps.get(pid)],
                    children = [...vm.CopyDirectory[0].children],
                    childrenLen = children.length,
                    valueLen = value.length;
                for (let i = 0; i < childrenLen; i++) {
                    for (let j = 0; j < valueLen; j++) {
                        if (children[i].projectId === value[j].Keyword) {
                            vm.$refs.CopyDirectory.remove(children[i].deleteId);
                        }
                    }
                }
                if (value.length > 0) {
                    for (let k = 0; k < value.length; k++) {
                        vm.CopyDirectory[0].children.push({
                            text: value[k].text,
                            leaf: value[k].leaf,
                            projectId: value[k].Keyword,
                            fullpath: value[k].id,
                            deleteId: vm.deleteNum++
                        });
                    }
                }
            } else if (LevelDirectory === "Multi") {
                if (isdelete) vm.CopyDirectory[0].children.splice(index, 1);
                let node = vm.CopyObj.projectId,
                    Level = 1,
                    peer = false;
                if (vm.command === "First") Level = 1;
                else if (vm.command === "Second") Level = 2;
                else if (vm.command === "All") Level = 4;
                const res = await UserApi.getProjectListWithLevel(
                    node,
                    Level,
                    peer
                );
                if (res.success) {
                    // 子节点
                    vm.CopyDirectory[0].children.push({
                        text: vm.CopyObj.text,
                        leaf: vm.CopyObj.leaf,
                        projectId: vm.CopyObj.projectId,
                        fullpath: vm.CopyObj.fullpath,
                        deleteId: vm.deleteNum++
                    });
                    let arr = res.data,
                        childrenLevel1 = vm.CopyDirectory[0].children,
                        len = childrenLevel1.length - 1;
                    if (childrenLevel1) {
                        vm.$set(childrenLevel1[len], "children", []);
                    }
                    for (let L1 = 0; L1 < arr.length; L1++) {
                        childrenLevel1[len].children.push({
                            text: arr[L1].text,
                            leaf: arr[L1].leaf,
                            projectId: arr[L1].Keyword,
                            fullpath: arr[L1].id,
                            deleteId: vm.deleteNum++
                        });
                        let arr2 = arr[L1].children;
                        if (arr2) {
                            if (childrenLevel1[len]) {
                                vm.$set(
                                    childrenLevel1[len].children[L1],
                                    "children",
                                    []
                                );
                            }
                            let childrenLevel2 =
                                childrenLevel1[len].children[L1];
                            for (let L2 = 0; L2 < arr2.length; L2++) {
                                if (arr2.length > 0) {
                                    childrenLevel2.children.push({
                                        text: arr2[L2].text,
                                        leaf: arr2[L2].leaf,
                                        projectId: arr2[L2].Keyword,
                                        fullpath: arr2[L2].id,
                                        deleteId: vm.deleteNum++
                                    });
                                    let arr3 = arr2[L2].children;
                                    if (arr3) {
                                        if (childrenLevel1[len]) {
                                            vm.$set(
                                                childrenLevel2.children[L2],
                                                "children",
                                                []
                                            );
                                        }
                                        let childrenLevel3 =
                                            childrenLevel2.children[L2];
                                        for (let f = 0; f < arr3.length; f++) {
                                            if (arr3.length > 0) {
                                                childrenLevel3.children.push({
                                                    text: arr3[f].text,
                                                    leaf: arr3[f].leaf,
                                                    projectId: arr3[f].Keyword,
                                                    fullpath: arr3[f].id,
                                                    deleteId: vm.deleteNum++
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            vm._$closeLoading();
        },
        // 复制创建目录 - 新建
        async addDirectory() {
            let vm = this,
                { Projects } = vm,
                childrenLevel1 = vm.CopyDirectory[0].children;
            if (!childrenLevel1 || childrenLevel1.length === 0) {
                vm.$message({ message: "请添加目录", type: "error" });
                return;
            }
            Projects.push({
                id: vm.CopyDirectory[0].fullpath,
                text: vm.CopyDirectory[0].text,
                parentId: "Root"
            });
            // 一级
            for (let L1 = 0; L1 < childrenLevel1.length; L1++) {
                Projects.push({
                    id: childrenLevel1[L1].projectId,
                    text: childrenLevel1[L1].text,
                    parentId: vm.CopyDirectory[0].fullpath
                });
                // 二级
                let childrenLevel2 = childrenLevel1[L1].children;
                if (childrenLevel2) {
                    if (childrenLevel2.length > 0) {
                        for (let L2 = 0; L2 < childrenLevel2.length; L2++) {
                            Projects.push({
                                id: childrenLevel2[L2].projectId,
                                text: childrenLevel2[L2].text,
                                parentId: childrenLevel1[L1].projectId
                            });
                            // 三级
                            let childrenLevel3 = childrenLevel2[L2].children;
                            if (childrenLevel3) {
                                if (childrenLevel3.length > 0) {
                                    for (
                                        let L3 = 0;
                                        L3 < childrenLevel3.length;
                                        L3++
                                    ) {
                                        Projects.push({
                                            id: childrenLevel3[L3].projectId,
                                            text: childrenLevel3[L3].text,
                                            parentId:
                                                childrenLevel2[L2].projectId
                                        });
                                        // 四级
                                        let childrenLevel4 =
                                            childrenLevel3[L3].children;
                                        if (childrenLevel4) {
                                            if (childrenLevel4.length > 0) {
                                                for (
                                                    let L4 = 0;
                                                    L4 < childrenLevel4.length;
                                                    L4++
                                                ) {
                                                    Projects.push({
                                                        id:
                                                            childrenLevel4[L4]
                                                                .projectId,
                                                        text:
                                                            childrenLevel4[L4]
                                                                .text,
                                                        parentId:
                                                            childrenLevel3[L3]
                                                                .projectId
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const res = await UserApi.createProjectByDef(Projects);
            if (res.success) {
                this.cancelHandle();
            } else {
                this.$message({ message: res.msg, type: "error" });
            }
        },
        // 复制创建目录 - 删除子节点
        DeleteNodeHandle(MouseEvent, object) {
            if (object.deleteId !== 0) {
                this.$refs.CopyDirectory.remove(object.deleteId);
            } else {
                this.$message({ message: "不能删除该目录", type: "error" });
            }
        },
        // 复制创建目录 - 关闭 loading
        _$closeLoading() {
            setTimeout(() => {
                this.isLoaingSingle = true;
                this.isLoaingPeer = true;
            }, 250);
        },
        // 啟動流程
        async StartNewWorkFlow() {
            this.processData = [];
            let DocList = this.dialogObj.projectId,
                WfKeyword = "",
                userlist = "";
            const res = await UserApi3.startNewWorkFlow(
                DocList,
                WfKeyword,
                userlist
            );
            res.data[0].dwfList.forEach(item => {
                this.processData.push(item);
            });
        },
        // 启动流程 - 确认 
        async startProcess() {
            console.log(this.dialogObj)
            let DocList = this.dialogObj.projectId,
                WfKeyword = this.NodeData.o_code,
                userlist = "";
            const res = await UserApi3.startNewWorkFlow(
                DocList,
                WfKeyword,
                userlist
            );
            console.log(res)
            if (res.success) {
                this.StateName = "start";
                this.cancelHandle();
            }
        },
        async searchProject() {
            const ProjectKeyWord = this.dialogObj.projectId,
                page = 1,
                limit = 50;
            let filterJson = [];
            filterJson.push({
                name: "o_itemname",
                value: `(o_itemname LIKE '%${this.searchForm.name}%' or o_itemdesc LIKE '%${this.searchForm.name}%' )`
            });
            filterJson = JSON.stringify(filterJson);
            this.$store.dispatch("doc/getDocList", {
                ProjectKeyWord,
                filterJson,
                page,
                limit
            });
            this.resetForm("searchForm");
        },
        async newGlobalOrUserProject() {
            // 如果是编辑查询条件
            if (this.dialogObj.Id === "MS_MdsqlGlobaloruserProject") {
                const res = await UserApi.updateGlobalOrUserProject(
                    this.dialogObj.projectId,
                    this.newSearchForm.name,
                    this.newSearchForm.description,
                    this.newSearchForm.Statement
                );

                if (res.success) {
                    this.$message({
                        message: "编辑查询条件成功",
                        type: "success"
                    });
                } else {
                    this.$message({
                        message: res.msg,
                        type: "error"
                    });
                }
                this.$emit("reData", false, "edit", this.newSearchForm.name);
                this.resetForm("newSearchForm");
                return;
            }

            // 新建查询条件
            let projectKeyword = this.dialogObj.projectId,
                projectCode = this.newSearchForm.name,
                projectDesc = this.newSearchForm.description,
                projectType = "6",
                SQLString = this.newSearchForm.Statement;
            // 如果是根目录过来的话，需要设projectKeyword 为 Root
            if (this.dialogObj.Id === "MS_CreateGlobSearch_2") {
                projectKeyword = "Root";
            }
            const res = await UserApi.newGlobalOrUserProject(
                projectKeyword,
                projectCode,
                projectDesc,
                projectType,
                SQLString
            );
            if (!res.success) {
                this.$message({ message: res.msg, type: "error" });
            } else {
                this.$message({ message: "新建查询成功", type: "success" });
                this.StateName = "add";
                this.NodeData = {};
                this.NodeData.fullpath = res.data[0].id;
                this.NodeData.text = res.data[0].text;
                this.resetForm("newSearchForm");
            }
        },
        async createProject() {
            let projectKeyword = "Root",
                projectAttrJson = [];
            if (this.dialogObj.projectId) {
                projectKeyword = this.dialogObj.projectId;
            }
            if (this.addForm.storage === "GJEPCStorage__文件存储") {
                this.addForm.storage = "GJEPCStorage";
            }
            projectAttrJson.push(
                { name: "projectName", value: this.addForm.name },
                { name: "projectDesc", value: this.addForm.description },
                { name: "tempDefnId", value: this.addForm.defkeyid },
                { name: "storageName", value: this.addForm.storage },
                { name: "isHide", value: this.addChecked },
                { name: "isRoot", value: true },
                { name: "navUrl", value: this.addForm.navUrl }
            );
            if (
                this.dialogObj.Id === "MS_CreateNewProject" ||
                this.dialogObj.Id === "MS_CreateNewRootProject" ||
                this.dialogObj.Id === "MS_CreateNewRootProjec_2"
            ) {
                let res = {};
                // 判断是不是逻辑目录过来的
                if (this.dialogObj.isLogicalDirectory) {
                    // 创建逻辑目录根目录用这个接口
                    res = await UserApi.newGlobalOrUserProject(
                        projectKeyword,
                        // projectCode
                        this.addForm.name,
                        // projectDesc
                        this.addForm.description,
                        // projectType
                        4,
                        ""
                    );
                } else {
                    res = await UserApi.createProject(
                        projectKeyword,
                        projectAttrJson
                    );
                }
                // 要判断res是否成功
                if (res.success) {
                    this.StateName = "add";
                    this.NodeData = {};
                    this.NodeData.fullpath = res.data[0].id;
                    this.NodeData.text = res.data[0].text;
                } else {
                    this.$message({
                        message: res.msg,
                        type: "error"
                    });
                }
            } else if (this.dialogObj.Id === "MS_ModiProjAttr") {
                await UserApi.updateProjectAttr(
                    projectKeyword,
                    projectAttrJson
                );
                this.StateName = "edit";
                if (this.addForm.description !== "") {
                    let str = `__${this.addForm.description}`;
                    this.NodeData = this.addForm.name + str;
                } else {
                    this.NodeData = this.addForm.name;
                }
            }
            this.resetForm("addForm");
        },
        // 刪除目錄
        async delProject(e) {
            let sureDel = e,
                ProjectKeyword = this.dialogObj.projectId;
            const res = await UserApi.delProject(ProjectKeyword, sureDel);
            if (res.success) {
                if (res.data[0].state === "delSuccess") {
                    this.$message({ message: "刪除成功息", type: "success" });
                    this.StateName = "del";
                    this.cancelHandle();
                } else if (res.data[0].state === "seleSureDel") {
                    this.delmsg = res.msg;
                }
            } else {
                this.$message({ message: res.msg, type: "error" });
                this.cancelHandle();
            }
        },
        // tree 点击节点， 启动流程之后，点击哪一个流程
        handleNodeClick(data) {
            this.NodeData = data;
        },
        // 关闭弹窗
        dialogClose() {
            this.cancelHandle();
        },
        // 用户弹窗 - 取消按钮 
        // 启动流程， 这里会把 StateName 传出去，让父组件来进行下一步操作
        cancelHandle(refresh) {
            let vm = this;
            vm.dialogObj.Id = "";
            vm.dialogObj.options = [];
            vm.dialogObj.projectId = "";
            vm.delmsg = "";
            vm.options = [];
            (vm.CopyDirectory = []), (vm.CopyObj = {}), (vm.pid = "");
            vm.Projects = [];
            vm.command = "";
            vm.ServerFullFileName = "";
            vm.$emit("reData", false, vm.StateName, vm.NodeData);
            vm.StateName = null;
            vm.NodeData = null;
            vm.dialogWidth = "25%";

            if (refresh) {
                this.refreshAsideL()
            }
        },
        // 重置表單
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.cancelHandle();
            // newSearchForm resetFields 不起作用，手动清空
            if (formName === "newSearchForm") {
                this.newSearchForm.Statement = "";
                this.newSearchForm.description = "";
                this.newSearchForm.name = "";
            }
        },
        // 批量创建文档按钮 - 添加
        addDomain() {
            this.batchFileForm.domains.push({
                name: "",
                value: "",
                key: Date.now(),
                index: new Date().getTime() + 1000
            });
        },
        // 批量创建文档按钮 - 删除
        removeDomain(item) {
            var index = this.batchFileForm.domains.indexOf(item);
            if (index !== -1) {
                this.batchFileForm.domains.splice(index, 1);
            }
        },
        async batchCreateDoc() {
            let vm = this,
                { domains } = vm.batchFileForm,
                docAttrJson = [],
                num = 0;
            const projectKeyword = vm.dialogObj.projectId;
            for (let i = 0; i < domains.length; i++) {
                docAttrJson.push(
                    { name: "docCode", value: domains[i].docCode },
                    { name: "docDesc", value: domains[i].docDesc },
                    { name: "tempDefnId", value: "" }
                );
                const res = await UserApi2.beforeCreateDoc(
                    projectKeyword,
                    domains[i].docCode
                );
                if (res.success) {
                    const res2 = await UserApi2.createDoc(
                        projectKeyword,
                        docAttrJson
                    );
                    if (res2.success) num += 1;
                } else {
                    return vm.$message({ message: res.msg, type: "error" });
                }
            }
            if (num === domains.length) {
                vm.$message({ message: "添加成功", type: "success" });
                const ProjectKeyWord = this.dialogObj.projectId,
                    filterJson = "",
                    page = 1,
                    limit = 50;
                vm.$store.dispatch("doc/getDocList", {
                    ProjectKeyWord,
                    filterJson,
                    page,
                    limit
                });
                vm.resetForm("batchFileForm");
            }
        },
        // 批量创建文档按钮 - 保存
        submitForms(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.batchCreateDoc();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        // 新建文档
        async CreateDoc() {
            const projectKeyword = this.dialogObj.projectId;
            let docAttrJson = [];
            docAttrJson.push(
                { name: "docCode", value: this.newFileForm.name },
                { name: "docDesc", value: this.newFileForm.description },
                { name: "tempDefnId", value: this.newFileForm.defkeyid }
            );
            const res = await UserApi2.createDoc(projectKeyword, docAttrJson);
            if (res.success) {
                let fileList = this.rawFileList
                // if (this.ServerFullFileName) {
                //     await UserApi4.afterUploadFile(
                //         res.data[0].Keyword,
                //         this.ServerFullFileName
                //     );
                // }
                if (fileList.length === 1) {
                    let file = fileList[0]
                    let filename = ''
                    filename = res.data[0].Title
                    if (file.name.split('.').length > 1) {
                        filename = filename + '.' + file.name.split('.').pop()
                    }
                    this.$store.dispatch({
                        type: 'upload/specifyUploadInfo',
                        file: {
                            ...file,
                            docKeyword: res.data[0].Keyword,
                            filename,
                            projectKeyword: this.dialogObj.projectId
                        }
                    })
                }
                const ProjectKeyWord = this.dialogObj.projectId,
                    filterJson = "",
                    page = 1,
                    limit = 50;
                this.$store.dispatch("doc/getDocList", {
                    ProjectKeyWord,
                    filterJson,
                    page,
                    limit
                });
                this.resetForm("newFileForm");
            }
        },
        // 新建文档 - 上传文件
        async beforeAvatarUpload(file) {
            if (file.name) {
                let fileSize = file.size,
                    ModifyDate = TimeChange(file.lastModifiedDate),
                    ServerFileName = file.name,
                    ObjectKeyword = this.projectId,
                    CreateDate = "";
                const res = await UserApi4.beforeUploadFile(
                    ObjectKeyword,
                    ServerFileName,
                    CreateDate,
                    ModifyDate,
                    fileSize
                );
                this.ServerFullFileName = res.data[0].ServerFullFileName;
            }
        },
        // 新建文档 - 上传文件
        async httpRequest(e) {
            let { ServerFullFileName } = this;
            if (ServerFullFileName) {
                let Files = e.file;
                const res = await UserApi4.uploadFile3(
                    ServerFullFileName,
                    Files
                );
                if (res.success) {
                    this.newFileForm.fileName = e.file.name;
                    this.newFileForm.fileSize = e.file.size;
                } else {
                    this.$message.error("该文件已存在其他文档");
                }
            }
        },
        // 新建文档 - 上传文件成功
        async onSuccess() {
            let DocKeyword = "",
                { ServerFullFileName } = this;
            const res = await UserApi4.afterUploadFile(
                DocKeyword,
                ServerFullFileName
            );
            if (res.success) {
                this.$message({ message: "上传成功", type: "success" });
            }
        },
        // 新建文档 - 上传文件失败
        onError() {
            this.$message.error("上传失败");
        },

        // 个人工作台新建目录
        perWorkBenchAddProject() {
            let projectKeyword = this.dialogObj.projectId
                    ? this.dialogObj.projectId
                    : "Root",
                projectCode = this.perWorkBenchNewProject.projectCode,
                projectDesc = this.perWorkBenchNewProject.projectDesc,
                projectType = 5,
                SQLString = "";
            UserApi.newGlobalOrUserProject(
                projectKeyword,
                projectCode,
                projectDesc,
                projectType,
                SQLString
            )
                .then((/* res */) => {
                    this.perWorkBenchNewProject = {
                        projectCode: "",
                        projectDesc: ""
                    };
                    this.$emit("refreshTree");
                    this.cancelHandle();
                })
                .catch(err => {
                    this.$message({
                        message: `创建目录失败${err.msg}`
                    });
                });
        }
    }
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
        .CM-tree-filter {
            height: 500px;
            overflow-y: scroll;
        }
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
    .el-tree {
        display: inline-block;
        min-width: 100%;
        max-width: 100%;
        overflow-x: auto;
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
.width-25 .el-dialog {
    max-width: 400px;
}
.width-50 .el-dialog {
    max-width: 600px;
}
.width-60 .el-dialog {
    max-width: 800px;
}
.width-45 .el-dialog {
    max-width: 500px;
}
.width-35 .el-dialog {
    max-width: 450px;
}
.width-80 .el-dialog {
    max-width: 900px;
}
.width-70 .el-dialog {
    max-width: 850px;
}
</style>

<style scoped>
.flex-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.btn-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 10px;
}
.btn-wrapper .MainBtn{
    margin-bottom: 20px;
}
.btn-wrapper .MainBtn:nth-child(-n + 2) i{
    font-size: 40px;
}
</style>