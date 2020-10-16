<template>
    <!-- <div class="asideR"> -->
    <div id="PerMessageBottom">
        <div id="PerMessageMessage">
            <div class="title">消息信息</div>
            <el-form label-position="left" label-width="80px" :model="Message">
                <el-form-item label="发送方:">
                    <el-input v-model="Message.Sender" readonly />
                </el-form-item>
                <el-form-item label="接收方:">
                    <el-input v-model="Message.RecUsers" readonly />
                </el-form-item>
                <el-form-item label="标题:">
                    <el-input v-model="Message.Title" readonly />
                </el-form-item>
                <template v-if="Attachment.length > 0">
                    <el-form-item label="附件:">
                        <div class="Attachment">
                            <div
                                class="Attachment-icon"
                                v-for="(item, index) in Attachment"
                                :key="index"
                                @click="getDocLocation(item)"
                            >
                                <el-tooltip
                                    effect="dark"
                                    :content="item.Attachment"
                                    placement="top-start"
                                >
                                    <el-row>
                                        <el-col :span="14" class="hideText">
                                            <span>{{ item.Attachment }}</span>
                                        </el-col>
                                        <el-col
                                            :span="10"
                                            class="hideText"
                                            style="text-align: right;"
                                        >
                                            <span>{{ item.FileSize }}</span>
                                        </el-col>
                                    </el-row>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-form-item>
                </template>
                <el-form-item label="内容:">
                    <el-input type="textarea" v-model="Message.Content" rows="10" readonly />
                </el-form-item>
            </el-form>
        </div>
        <div id="PerMessageProcess" v-if="Process === 'true'">
            <div class="title">流程</div>
            <div class="process">
                <template v-if="Process === 'true'">
                    <Process />
                </template>
                <template v-else>
                    <div class="no-process-tip">暂无流程</div>
                </template>
            </div>
        </div>
        <!-- <el-tabs v-model="activeName2" class="asideRTabs" @tab-click="handleClick">
      <el-tab-pane label="消息信息" name="a">
        <el-form label-position="left" label-width="80px" :model="Message">
          <el-form-item label="发送方:">
            <el-input v-model="Message.Sender" readonly />
          </el-form-item>
          <el-form-item label="接收方:">
            <el-input v-model="Message.RecUsers" readonly />
          </el-form-item>
          <el-form-item label="标题:">
            <el-input v-model="Message.Title" readonly />
          </el-form-item>
          <template v-if="Attachment.length > 0">
          <el-form-item label="附件:">
            <div class="Attachment">
              <div
                class="Attachment-icon"
                v-for="(item, index) in Attachment"
                :key="index"
                @click="getDocLocation(item)">
                <el-tooltip effect="dark" :content="item.Attachment" placement="top-start">
                <el-row>
                  <el-col :span="14" class="hideText"><span>{{ item.Attachment }}</span></el-col>
                  <el-col :span="10" class="hideText" style="text-align: right;"><span>{{ item.FileSize }}</span></el-col>
                </el-row>
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
          </template>
          <el-form-item label="内容:">
            <el-input type="textarea" v-model="Message.Content" rows="10" readonly />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <template v-if="Process === 'true'">
      <el-tab-pane label="流程" name="b">
        <Process />
      </el-tab-pane>
      </template>
        </el-tabs>-->
    </div>
</template>
<script>
import UserApi from "../../api/services/project";
import UserApi2 from "../../api/services/doc";
import { mapGetters } from "vuex";
export default {
    data() {
        return {};
    },
    computed: {
        ...mapGetters("PerMessage", [
            "Message",
            "MessageKeyword",
            "Attachment",
            "Process",
            "activeName",
            "WorkFlowKeyword"
        ]),
        activeName2: {
            get() {
                return this.activeName;
            },
            set(e) {
                this.$store.commit("PerMessage/CHANGE_ACTIVENAME", e);
            }
        }
    },
    watch: {
        WorkFlowKeyword(v) {
            if (v) {
                this.handleClick({ name: "b" });
            }
        }
    },
    mounted() {
        // 进入个人消息模块时清空数据
        this.$store.commit("PerMessage/CLEAR_MESSAGE");
    },
    methods: {
        async getDocLocation(e) {
            console.log(e);
            // 获取 ProjectKeyWord
            let Keyword = e.AttaKeyword,
                IgnoreShortCut = "false";
            let ProjectKeyWord = e.AttaKeyword;
            if (e.AttaType === "Doc") {
                const res = await UserApi.getProjectPath(
                    Keyword,
                    IgnoreShortCut
                );
                ProjectKeyWord = res.data[0].ProjectKeyword;
            }
            //  储存位置
            let res = await UserApi.saveLastProject(ProjectKeyWord);
            if (!res.success) {
                this.$message({
                    message: `存储位置错误：${res.msg}`
                });
                return;
            }

            this.$router.push({ name: "DocManagement" });
            this.$store.commit('project/REFRESH_TREE')

            //  获取列表
            const filterJson = "",
                page = 1,
                limit = 50;
            const res3 = await UserApi2.getDocList(
                ProjectKeyWord,
                filterJson,
                page,
                limit
            );
            if (res3.success) {
                let KeywordList = res3.data.filter(
                    item => item.Keyword === Keyword
                );
                this.$store.commit(
                    "PerMessage/ATTACHMENT_MOVE_DOC",
                    KeywordList[0]
                );
            }
        },
        handleClick(tab) {
            if (tab.name === "b") {
                this.$store.dispatch(
                    "workflow/getWorkFlow",
                    this.WorkFlowKeyword
                );
            }
        }
    }
};
</script>

<style lang='scss' scoped>
#PerMessageBottom {
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;
    flex: 1;
    .title {
        font-size: 0.1.1em;
        padding: 10px;
        font-weight: blod;
        letter-spacing: 1px;
        border-bottom: solid 2px rgba(0, 0, 0, 0.1);
        margin-bottom: 5px;
    }
    .no-process-tip {
        text-align: center;
        margin-top: 10px;
    }
}
#PerMessageBottom > div + div {
    margin-left: 20px;
}
#PerMessageBottom > div {
    border: solid 1px rgba(0, 0, 0, 0.1);
    flex: 1;
    overflow: hidden;
    padding: 0 5px;
}
#PerMessageProcess > .process {
    padding: 0 10px;
    height: 100%;
    overflow: auto;
}
</style>

<style lang='scss'>
#PerMessageMessage {
    form {
        height: 100%;
        overflow: auto;
        padding: 10px;
    }
    form > div:last-child {
        margin-bottom: 70px;
    }
}
#PerMessageProcess > .process {
    .asideRTable {
        margin-bottom: 70px;
        border: 1px solid #ebeef5;
        height: auto !important;
    }
    .el-table__body-wrapper {
        height: auto !important;
    }
}
</style>
