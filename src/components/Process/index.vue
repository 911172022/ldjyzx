<template>
    <div class="process">
        <el-breadcrumb class="process_breadcrumb" separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbData" :key="item.value">
                <span
                    class="process-title"
                    :class="{'active': isShow === item.value}"
                    @click="changeProcess(item.value)"
                >{{ item.title }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div v-if="isShow === 'opinion'">
            <!-- <h3><i class="el-icon-user-solid" style="color: #FFBC40;"></i> 校审意见</h3> -->
            <el-row class="opinion">
                <el-col :span="24">
                    <el-button
                        v-for="btnitem in this.ProcessBtns"
                        :key="btnitem.KeyWord"
                        size="small"
                        type="primary"
                        :disabled="btnitem.Disabled"
                        @click="CheckHandle(btnitem.KeyWord)"
                    >{{btnitem.Desc}}</el-button>
                    <template v-if="this.bAuditDropdown">
                        <el-dropdown class="opinion-dropdown" @command="onAuditMenuCkeck">
                            <el-button size="small" type="primary">
                                添加意见
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{value:'输入意见'}">输入意见</el-dropdown-item>
                                <el-dropdown-item
                                    v-for="oaitem in this.OptionalAudits"
                                    :key="oaitem.text"
                                    :command="{value:oaitem.text}"
                                >{{ oaitem.text }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <el-button
                        v-for="(btnitem) in this.ProcessRightBtns"
                        :key="btnitem.KeyWord"
                        size="small"
                        type="warning"
                        :disabled="btnitem.Disabled"
                        @click="CheckHandle(btnitem.KeyWord)"
                    >{{btnitem.Desc}}</el-button>
                </el-col>
            </el-row>
            <el-table class="asideRTable opinionData" :data="opinionData" border height="640">
                <el-table-column label="校审意见" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span
                            class="opinion_span"
                            @click="showModiAuditDialog(scope.row, scope)"
                        >{{ scope.row.AuditContent | nameFilters }}</span>
                        <!-- 这里 -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <template v-else-if="isShow === 'property'">
            <!-- 方圆项目不显示这些项 -->
            <template v-if="!showFY">
                <h3>
                    <i class="el-icon-tickets" style="color: #FFBC40;"></i> 流程基本信息
                </h3>
                <el-form :model="ProcessAttributes" label-width="60px" label-position="left">
                    <el-form-item label="代码:">
                        <el-input v-model="ProcessAttributes.DefWorkFlowCode" readonly />
                    </el-form-item>
                    <el-form-item label="描述:">
                        <el-input v-model="ProcessAttributes.DefWorkFlowDesc" readonly />
                    </el-form-item>
                </el-form>
            </template>

            <h3>
                <i class="el-icon-document" style="color: #FFBC40;"></i> 处于流程下的文档列表
            </h3>
            <el-table
                :data="ProcessAttributesList"
                class="asideRTable"
                height="500"
                @row-contextmenu="contextMenuClick2"
                @row-dblclick="doubleClickFile"
            >
                <el-table-column prop="code" label="代码" show-overflow-tooltip />
                <el-table-column prop="desc" label="描述" show-overflow-tooltip />
                <el-table-column prop="o_filename" label="文件名" show-overflow-tooltip />
                <el-table-column prop="formatSize" label="大小" show-overflow-tooltip />
            </el-table>
        </template>
        <template v-else-if="isShow === 'Process'">
            <el-table class="asideRTable" :data="ProcessStatus" border height="600">
                <el-table-column prop="WorkState" label="工作状态" show-overflow-tooltip />
                <el-table-column prop="UserName" label="处理人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.UserName">{{ scope.row.UserName | nameFilters }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="FinishDate" label="提交时间" show-overflow-tooltip />
            </el-table>
            <!-- 右键功能 -->
            <div v-show="menuVisible" class="rightMenuBlack" :style="styleObject">
                <ul class="rightMenu-ul">
                    <li class="rightMenu-li" @click="openPermissionList">添加人员</li>
                    <li class="rightMenu-li" @click="deleteDialog = true">删除人员</li>
                </ul>
            </div>
        </template>
        <template v-else-if="isShow === 'history'">
            <el-table :data="ProcessHistory" class="asideRTable">
                <el-table-column prop="UserName" label="用户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.UserName | nameFilters }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="WorkState" label="操作" show-overflow-tooltip />
                <el-table-column prop="SendDate" label="时间" show-overflow-tooltip />
            </el-table>
        </template>
        <!-- 填写意见弹窗 -->
        <el-dialog
            title="填写意见"
            :visible.sync="dialogVisible2"
            :before-close="cancelHanlde"
            width="90%"
        >
            <el-form
                ref="opinionReviseFrom"
                :model="opinionReviseFrom"
                label-position="top"
                label-width="80px"
            >
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="意见:">
                            <el-input
                                type="textarea"
                                v-model="opinionReviseFrom.desc"
                                rows="10"
                                :disabled="auditDisabled"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="修改意见:">
                            <el-input
                                type="textarea"
                                v-model="opinionReviseFrom.deDesc"
                                rows="10"
                                :disabled="deAuditDisabled"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelHanlde">取 消</el-button>
                <el-button type="primary" size="small" @click="opinionReviseHandle">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 流程 - 删除人员 - 弹窗 -->
        <el-dialog title="删除" :visible.sync="deleteDialog" width="30%">
            <el-row>
                <el-col :span="12">
                    <i class="el-icon-warning iconStyle"></i>
                </el-col>
                <el-col :span="12">
                    <p>请确认是否要删除:</p>
                    <p>{{ userDetail.UserName }}</p>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="deleteDialog = false">取 消</el-button>
                <el-button type="primary" size="small" @click="deleteHandle">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗 - 增加用户/用户组 -->
        <PermissionList :dialogObj="PermissionData" @reData="rePData" @reUser="reUser(arguments)" />

        <!-- 2020.4.21-3 -->
        <!-- 创建设计阶段并选择参与专业 -->
        <CreateAndSelectMajors
            :SelectMajorsData="SelectMajorsData"
            :CollatorData="CollatorData"
            :AllotMajorsData="AllotMajorsData"
        />
        <!-- <el-dialog title="创建设计阶段并选择参与专业" :visible.sync="SelectMajorsData.switch" width="25%">
        <SelectMajors :dialogObj="SelectMajorsData" @reData="reSelectMajors" />
        </el-dialog>-->
        <!-- 选择校核人员弹窗 -->
        <!-- <ChooseCollator :dialogObj="CollatorData" @reData="reCollator" /> -->
        <!-- 选择分发专业 -->
        <!-- <AllotMajors :dialogObj="AllotMajorsData" @reData="reAllotMajors" /> -->

        <!-- 右键功能 -->
        <div v-show="menuVisible2" class="rightMenu" ref="rightMenu" :style="styleObject2">
            <ul class="rightMenu-ul">
                <li class="rightMenu-li Enabled" @click="getDocLocation">转到源目录</li>
            </ul>
        </div>
        <ReplySendDocument :dialogObj="replyDialog" @reData="reReplyData" />


        <!-- 预览窗口 -->
        <preview-pannel
            :docKeyword='previewDocKeyword'
            :previewTrigger.sync='previewTrigger'
        >
        </preview-pannel>
    </div>
</template>
<script>
import PermissionList from "../Dialog/PermissionList-PM2";
import { mapGetters } from "vuex";
import WorkflowApi from "../../api/services/workflow";
import UserApi from "../../api/services/project";
import { filterName } from "@/util/Common";
import { PluginsList } from "@/const";
// import DocApi from '../../api/services/doc'
import previewPannel from '@/plugins/common/previewPannel.vue'


export default {
    data() {
        return {
            isShow: "opinion",
            breadcrumbData: [
                {
                    value: "opinion",
                    title: "校审意见"
                },
                {
                    value: "property",
                    title: "属性"
                },
                {
                    value: "Process",
                    title: "流程"
                },
                {
                    value: "history",
                    title: "历史"
                }
            ],
            isOpinion: "Check",
            // 校审 - 结束时按钮
            disabled: false,
            // 添加意见
            dropdown: true,
            // 右键开启
            menuVisible: false,
            styleObject: {
                top: 0,
                opacity: 0
            },
            // 存点击右键的资料
            userDetail: {},
            // 删除人员弹窗
            deleteDialog: false,
            // 修改意见弹窗
            dialogVisible2: false,
            opinionReviseFrom: {
                desc: "",
                deDesc: ""
            },
            // 弹窗 - 增加用户/用户组
            PermissionData: {
                switch: false
            },

            // 判斷新 NewProcAudit 舊 ProcAudit
            AuditType: "",
            WorkStateKeyword: "",
            CheckerKeyword: "",
            CheckDate: "",
            AuditRight: "",
            auditDisabled: false,
            deAuditDisabled: false,
            wsbKeyword: "",
            // ZY start
            SelectMajorsData: {
                switch: false,
                keyword: ""
            },
            AllotMajorsData: {
                switch: false,
                keyword: ""
            },
            CollatorData: {
                switch: false,
                keyword: "",
                FuncName: ""
            },
            // ZY end
            // 用于跳转到源文件
            DocKeyword: "",
            menuVisible2: false,
            styleObject2: {
                top: 0,
                left: 0,
                width: '140px',
                position: 'fixed'
            },
            // 收文回复弹窗
            replyDialog: {
                switch: false,
                title: "回复收文"
            },

            // 控制预览面板
            previewTrigger: false,
            // 要预览的项目
            previewDocKeyword: ''
        };
    },
    components: {
        PermissionList,
        previewPannel
    },
    computed: {
        ...mapGetters("workflow", [
            "opinionData",
            "ProcessAttributes",
            "ProcessStatus",
            "ProcessHistory",
            "ProcessAttributesList",
            "Keyword",
            "ProcessBtns",
            "bAuditDropdown",
            "OptionalAudits",
            "ProcessRightBtns",
            "WorkflowKeyword"
        ]),
        // 方圆插件显示
        showFY() {
            return PluginsList.indexOf("FYPlugin") != -1;
        }
    },

    filters: {
        // 校审意见底下的列表，过滤掉用户名字的前边的英文
        nameFilters(v) {
            return filterName(v);
        }
    },

    methods: {
        // //ZY start
        // reSelectMajors(e) {
        //   this.SelectMajorsData.switch = e;
        // },
        // reCollator(e) {
        //   this.CollatorData.switch = e;
        // },
        // reAllotMajors(e) {
        //   this.AllotMajorsData.switch = e;
        // },
        // // ZY end
        // 校审意见 - 修改已有的校审人意见
        showModiAuditDialog(e, sc) {
            console.log(e, sc, "showModiAuditDialog");
            if (!e.UserName && !e.ProcAudit) return;
            let vm = this,
                AuditContent = "";
            vm.AuditType = "ProcAudit";
            //如果是设计人填写修改意见，就把所有意见列出到意见栏
            if (e.AuditRight === "2") {
                //AuditContent = "所有意见";
                let sdata = sc.store.states.data;
                let newArr = [];
                let data = sdata.filter(item => item.ProcAudit);
                for (let i = 0; i < data.length; i++) {
                    let arr = data[i].AuditContent.split("\n");
                    arr.pop();
                    arr.push("");
                    newArr = [...newArr, ...arr];
                }
                AuditContent = newArr.join("\n");
            } else {
                AuditContent = e.ProcAudit;
            }
            this.WorkStateKeyword = e.KeyWord;
            this.CheckerKeyword = e.UserKeyword;
            this.CheckDate = e.ProcTime;
            this.AuditRight = e.AuditRight;
            this.opinionReviseFrom.desc = AuditContent;
            this.opinionReviseFrom.deDesc = e.DeProcAudit;
            this.setAuditDialogDefault();
            this.dialogVisible2 = true;
        },
        // 下拉點選
        async onAuditMenuCkeck(status) {
            if (status.value) {
                if (status.value === "输入意见") {
                    this.AuditType = "NewProcAudit";
                    this.AuditRight = "";
                    this.WorkStateKeyword = "";
                    this.setAuditDialogDefault();
                    this.dialogVisible2 = true;
                } else {
                    //console.log("status:"+status.value);
                    const res = await WorkflowApi.addWorkflowAudit(
                        this.WorkflowKeyword,
                        status.value
                    );
                    if (res.success) {
                        this.$store.dispatch(
                            "workflow/getWorkFlow",
                            this.WorkflowKeyword
                        );
                        // this.deleteDialog = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            }
        },
        setAuditDialogDefault() {
            //如果是新建审核人意见，就不需要访问服务器获取权限
            if (this.AuditType === "NewProcAudit") {
                //隐藏设计人修改意见栏
                this.auditDisabled = false;
                this.deAuditDisabled = true;
            }
            //如果是修改审核人意见
            //else if (AuditType === "ProcAudit" && AuditRight==="1")
            else if (this.AuditRight === "1") {
                //隐藏设计人修改意见栏
                this.auditDisabled = false;
                this.deAuditDisabled = true;
            }
            //如果是设计人填写修改意见
            //else if (AuditType === "DeProcAudit" && AuditRight === "2") {
            else if (this.AuditRight === "2") {
                this.auditDisabled = true;
                this.deAuditDisabled = false;
            } else {
                //if (AuditType === "ReadOnly") {
                this.auditDisabled = true;
                this.deAuditDisabled = true;
            }
        },
        // 校审意见按钮
        async CheckHandle(status) {
            console.log("流程操作keyword：", status);

            let userlist = "",
                httpMethod = "";
            this.wsbKeyword = status;
            if (this.wsbKeyword === "MS_DeleteWf")
                httpMethod = "deleteWorkFlow";
            // 删除流程
            else if (this.wsbKeyword === "MS_RetractWf")
                httpMethod = "revokeWorkFlow";
            // 撤回流程
            else if (this.wsbKeyword === "MS_RetractWf")
                httpMethod = "rebackWorkFlow";
            // 撤销提交
            else return this.gotoNextWfState(userlist);

            const res = await WorkflowApi[httpMethod](this.WorkflowKeyword);
            if (res.success) {
                this.$message({ message: "修改成功", type: "success" });
                this.$store.dispatch(
                    "workflow/getWorkFlow",
                    this.WorkflowKeyword
                );
                this.$store.commit("workflow/REFRESH_TRIGGER", true);
            } else {
                this.$message.error(res.msg);
            }
        },
        // 弹窗 - 增加用户/用户组 回传
        rePData(e) {
            this.PermissionData.switch = e;
        },
        async reUser(e) {
            if (e[0] === "selectUser") {
                let UserList = e[2],
                    WorkStateKeyword = this.userDetail.WorkStateKeyword,
                    ObjectKeyword = this.Keyword;
                const res = await WorkflowApi.addWorkUser(
                    ObjectKeyword,
                    WorkStateKeyword,
                    UserList
                );
                if (res.success) {
                    if (res.data[0].errmsg) {
                        this.$message({
                            message: res.data[0].errmsg,
                            type: "success"
                        });
                    } else {
                        this.$store.dispatch(
                            "workflow/getWorkFlow",
                            this.WorkflowKeyword
                        );
                    }
                }
            } else {
                this.gotoNextWfState(e[2]);
            }
        },
        async gotoNextWfState(userlist) {
            const res = await WorkflowApi.gotoNextWfState(
                this.WorkflowKeyword,
                this.wsbKeyword,
                userlist
            );

            if (res.success) {
                // 收文流程摁了回复，弹出弹窗
                if (res.data[0].FuncName === "responderSendDocument") {
                    this.replyDialog.wfKeyword = res.data[0].WfKeyword;
                    this.replyDialog.switch = true;
                }

                if (res.data[0].state === "Pass") {
                    this.$message({ message: "修改成功", type: "success" });
                    this.$store.dispatch(
                        "workflow/getWorkFlow",
                        res.data[0].WorkFlowKeyword
                    );
                } else if (res.data[0].FuncName === "selectProfession") {
                    // 创建设计阶段并选择参与专业
                    this.SelectMajorsData.switch = true;
                    this.SelectMajorsData.keyword = res.data[0].projectKeyword;
                } else if (
                    res.data[0].FuncName === "selectUserEx" ||
                    res.data[0].FuncName === "selectUserApprov"
                ) {
                    // 选择校审人员弹窗
                    this.CollatorData.switch = true;
                    this.CollatorData.FuncName = res.data[0].FuncName;
                    this.CollatorData.keyword = res.data[0].WfKeyword;
                } else if (
                    res.data[0].FuncName === "receiveDocSelectProfession"
                ) {
                    // 选择分发专业弹窗
                    this.AllotMajorsData.startAtWfBtn = true;
                    this.AllotMajorsData.keyword = res.data[0].WfKeyword;
                    this.AllotMajorsData.switch = true;
                }
            } else {
                // 撤回流程的
                if (this.wsbKeyword === "MS_RebackWf") {
                    this.$store.commit("workflow/REFRESH_TRIGGER", true);
                    return;
                }
                if (res.data[0].state === "selectUser") {
                    this.PermissionData.switch = true;
                }
            }
            // 刷新流程列表
            this.$store.commit("workflow/REFRESH_TRIGGER", true);
            this.$store.dispatch("workflow/getWorkFlow", this.WorkflowKeyword);
        },
        // 回复收文弹窗
        reReplyData(e) {
            this.replyDialog.switch = e;
        },
        // 修改意见弹窗 - 确认
        async opinionReviseHandle() {
            // WorkStateKeyword 添加意見
            if (this.WorkStateKeyword) {
                let { WorkStateKeyword, CheckerKeyword, CheckDate } = this,
                    ProcAudit = this.opinionReviseFrom.desc,
                    DeProcAudit = this.opinionReviseFrom.deDesc;
                // WorkStateKeyword, CheckerKeyword, CheckDate, ProcAudit, DeProcAudit
                const res = await WorkflowApi.modiWorkflowAudit(
                    WorkStateKeyword,
                    CheckerKeyword,
                    CheckDate,
                    ProcAudit,
                    DeProcAudit
                );
                if (res.success) {
                    // this.deleteDialog = false
                    this.$store.dispatch(
                        "workflow/getWorkFlow",
                        this.WorkflowKeyword
                    );
                } else {
                    this.$message.error(res.msg);
                }
            } else {
                let { WorkflowKeyword } = this,
                    ProcAudit = this.opinionReviseFrom.desc;
                const res = await WorkflowApi.addWorkflowAudit(
                    WorkflowKeyword,
                    ProcAudit
                );
                if (res.success) {
                    // this.deleteDialog = false
                    this.$store.dispatch(
                        "workflow/getWorkFlow",
                        WorkflowKeyword
                    );
                    // 刷新流程列表
                    this.$store.commit("workflow/REFRESH_TRIGGER", true);
                } else {
                    this.$message.error(res.msg);
                }
            }
            this.cancelHanlde();
        },
        cancelHanlde() {
            this.opinionReviseFrom.desc = "";
            this.opinionReviseFrom.deDesc = "";
            this.dialogVisible2 = false;
        },
        // 传值到弹窗 - 增加用户/用户组
        async openPermissionList() {
            let UserList = "",
                WorkStateKeyword = this.userDetail.WorkStateKeyword,
                ObjectKeyword = this.Keyword;
            const res = await WorkflowApi.addWorkUser(
                ObjectKeyword,
                WorkStateKeyword,
                UserList
            );
            if (!res.success) {
                this.PermissionData.switch = true;
                this.PermissionData.status = res.data[0].state;
            }
            // 刷新流程列表
            this.$store.commit("workflow/REFRESH_TRIGGER", true);
        },

        // 右键
        contextMenuClick(row, column, event) {
            let vm = this;
            vm.userDetail = {};
            vm.userDetail = row;
            event.preventDefault();
            vm.menuVisible = false;
            vm.menuVisible = true;
            vm.styleObject.opacity = 1;
            vm.styleObject.top = event.clientY - 150 + "px";
            vm.styleObject.right =
                window.innerWidth - event.clientX - 200 + "px";
            document.addEventListener("click", vm.foo);
        },
        // 取消右键
        foo() {
            // 取消鼠标监听事件
            this.menuVisible = false;
            this.styleObject.opacity = 0;
            document.removeEventListener("click", this.foo);
        },
        // 流程 - 删除人员
        async deleteHandle() {
            let { WorkStateKeyword, UserKeyword } = this.userDetail;
            const res = await WorkflowApi.deleteWorkUser(
                this.WorkflowKeyword,
                WorkStateKeyword,
                UserKeyword
            );
            if (res.success) {
                this.deleteDialog = false;
                this.$store.dispatch(
                    "workflow/getWorkFlow",
                    this.WorkflowKeyword
                );
            } else {
                this.$message.error(res.msg);
            }
        },
        changeProcess(e) {
            this.isShow = e;
        },
        // 转到源文件的右键
        // 右键
        contextMenuClick2(row, column, event) {
            console.log(event)
            this.rightDoc = row;
            let vm = this;
            event.preventDefault();
            vm.menuVisible2 = false;
            vm.menuVisible2 = true;
            vm.styleObject2.top = event.clientY + "px";
            // vm.styleObject2.right =
            //     window.innerWidth - event.clientX - 200 + "px";
            vm.styleObject2.left = event.clientX + 'px'
            document.addEventListener("click", vm.foo2);
        },
        // 双击文档
        async doubleClickFile(row, /*column, event*/) {
            this.rightDoc = row;
            if (this.rightDoc.attrType === 'Project') {
                this.$message({
                    message: `该文档类型为文件夹，不支持预览`
                })
            } else {
                // let res = await DocApi.previewDoc(this.rightDoc.attrKeyword)
                // if (!res.success) {
                //     this.$message({
                //         message: `获取文档预览链接失败：${ res.msg }`
                //     })
                //     return
                // }
                // // 处理res里的信息，格式化
                // res = res.data[0]
                // let suffix = res.filename.split(".").pop().toUpperCase();
                // if (['PNG', "JPG", "JPGE"].indexOf(suffix) != -1) {
				// 	res.previewType = 'image'
				// } else if (['DOC', "DOCX", "XLSX", "XLS", "PPTX", "PPT", "PDF", "TXT", "PDF"].indexOf(suffix) != -1) {
                //     res.previewType = 'doc'
                // } else if (['MP4', 'WMV', 'AVI', "MOV"].indexOf(suffix) != -1) {
                //     let res2 = await DocApi.fileDownload(this.rightDoc.attrKeyword, '')
                //     if (!res2.success) {
                //         this.$message({
                //             message: `获取文件链接错误：${ res.msg }`
                //         })
                //     }
                //     res.
                //     res.previewType = 'video'
                // } else {
                //     this.$message({
                //         message: `${ res.filename } 该格式不支持预览！`
                //     })
                // }
            
                // this.previewItem = res
                // this.previewShow = true
                this.previewDocKeyword = this.rightDoc.attrKeyword
                this.previewTrigger = true
            }
            // event.preventDefault();
            // this.getDocLocation();
            // 开启预览
            // this.previewShow = true
        },
        // 取消右键
        foo2() {
            // 取消鼠标监听事件
            this.menuVisible2 = false;
            document.removeEventListener("click", this.foo2);
        },
        // 跳转
        async getDocLocation() {
            // 获取 ProjectKeyWord
            let IgnoreShortCut = "false";

            let keyword = this.rightDoc.attrKeyword;
            if (this.rightDoc.attrType != "Project") {
                const res = await UserApi.getProjectPath(
                    keyword,
                    IgnoreShortCut
                ).catch(err => {
                    this.$message({
                        message: `获取文档路径失败：${err.msg}`
                    });
                });
                if (res.success) {
                    keyword = res.data[0].ProjectKeyword;
                } else {
                    return;
                }
            }
            //  储存位置
            await UserApi.saveLastProject(keyword);
            this.$router.push({ name: "DocManagement" });
        },
    }
};
</script>
<style lang="scss" scoped>
.process {
    margin-top: 15px;
    position: relative;
    .process_breadcrumb {
        margin-bottom: 20px;
        .process-title {
            color: #333;
            padding: 0;
            cursor: pointer;
            transition: padding 0.2s;
        }
        .process-title.active {
            color: #528ffd;
        }
        .process-title:hover {
            color: #528ffd;
        }
    }
    h3 {
        font-size: 1.1em;
    }
    .opinion {
        padding-bottom: 10px;
        .el-button {
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .opinion-dropdown {
            margin: 0 10px;
        }
    }
    .opinionData {
        white-space: pre-line;
        .opinion_span {
            white-space: pre-line;
            display: block;
            cursor: pointer;
        }
    }
    .ProcessData {
        width: 100%;
    }
    .rightMenuBlack {
        position: absolute;
        top: 163px;
        // left: 37px;
        z-index: 2131;
        display: block;
        opacity: 1;
        .rightMenu-ul {
            position: relative;
            z-index: 100;
            min-width: 150px;
            border: none;
            padding: 5px 0 10px;
            margin: 0;
            list-style: none;
        }
        .rightMenu-li {
            height: 32px;
            border-bottom: 1px dotted #8e8e8e;
            line-height: 34px;
            font-size: 14px;
            color: #fff;
            padding: 0 10px;
            list-style: none;
            cursor: pointer;
            position: relative;
        }
        .rightMenu-li:last-child {
            border-bottom: 0;
        }
        .rightMenu-li:hover {
            background: #528ffd;
            color: #fff;
        }
        .RM-disabled {
            // pointer-events: none;
            // color: rgb(187, 187, 187);
        }
    }
    .rightMenuBlack::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 99%;
        height: 100%;
        background-color: rgba(60, 60, 60, 0.8);
        z-index: -1;
        -webkit-box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 5px 2px;
        box-shadow: rgba(0, 0, 0, 0.4) 2px 2px 7px 0px;
        border: 1px solid #9a9a9a;
        -webkit-backdrop-filter: blur(1px) brightness(110%);
        backdrop-filter: blur(1px) brightness(110%);
        border-radius: 5px;
    }
}
</style>

<style lang="scss">
.process {
    .el-dialog {
        max-width: 600px;
    }
    .asideRTable {
        .cell.el-tooltip {
            white-space: normal;
        }
    }
}
</style>