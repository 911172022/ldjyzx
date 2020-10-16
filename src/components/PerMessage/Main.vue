<template>
  <div class="PMmainContainer">
    <!-- 标题,功能 -->
    <el-row class="mainTitle PMmainTitle">
      <!-- <el-col :span="24">
        <h1><i class="el-icon-s-claim" style="color: #FFBC40;"></i> 消息列表</h1>
      </el-col>-->
      <el-col :span="24">
        <div class="PMmainMultifunctional">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="MessagelistHandle('打开')"
          >打开</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-delete"
            @click="MessagelistHandle('删除')"
          >删除</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="MessagelistHandle('回复')"
          >回复</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-document-add"
            @click="MessagelistHandle('创建新消息')"
          >创建新消息</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-s-promotion"
            @click="MessagelistHandle('转发')"
          >转发</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-collection-tag"
            @click="MessagelistHandle('设为已读')"
            :disabled="isRead"
          >设为已读</el-button>
        </div>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table
      ref="messageList"
      :data="messageList"
      class="mainTable PMmainTable"
      :height="tableHeight"
      highlight-current-row
      @row-click="handleCurrentChange"
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'date', order: 'descending'}"
      @cell-dblclick="MessagelistHandle('打开')"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        prop="Sender"
        label="发送者"
        max-width="20%"
        min-width="130"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        prop="Title"
        label="标题"
        sortable
        max-width="20%"
        min-width="250"
        show-overflow-tooltip
      />
      <el-table-column prop="SendDatetime" label="发送时间" sortable max-width="20%" min-width="200" />
      <el-table-column
        prop="Workflow_DESC"
        label="所属流程"
        sortable
        max-width="20%"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="SignificantType"
        label="重要程度"
        sortable
        max-width="20%"
        min-width="200"
      />
      <el-table-column prop="DelayDay" label="延迟天数" sortable max-width="20%" min-width="200" />
    </el-table>
    <!-- 弹窗 -->
    <el-dialog
      :title="dialogTitle"
      class="PMmainDialog"
      :visible.sync="dialogFormVisible"
      width="90%"
      :before-close="handleClose"
    >
      <el-form :model="PMmainForm" label-position="left" :label-width="formLabelWidth">
        <el-form-item label="标题:" prop="Title">
          <el-input v-model="PMmainForm.Title" :readonly="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="发送方:" prop="Sender">
          <el-input v-model="PMmainForm.Sender" readonly />
        </el-form-item>
        <el-form-item label="接收方:" prop="RecUsers">
          <el-input class="inputStyle" v-model="PMmainForm.RecUsers" readonly />
          <el-button class="buttonStyle" type="primary" @click="permissionListHanlde('RecUsers')">选择</el-button>
        </el-form-item>
        <el-form-item label="抄送:" prop="CCUsers">
          <el-input class="inputStyle" v-model="PMmainForm.CCUsers" readonly />
          <el-button class="buttonStyle" type="primary" @click="permissionListHanlde('CCUsers')">选择</el-button>
        </el-form-item>
        <el-form-item class="Attachment" label="附件:">
          <div style="display: flex; align-items: center;">
            <div class="inputStyle">
              <div class="Attachment-div">
                <span
                  class="Attachment-span"
                  v-for="(item, index) in PMmainForm.AttachmentData"
                  :key="index"
                >
                  <el-checkbox v-model="item.checked">
                    <span class="Attachment-icon hideText">{{ item.Attachment }}</span>
                  </el-checkbox>
                </span>
              </div>
            </div>
            <el-button class="buttonStyle" type="primary" @click="openPermissionList2">选择文件</el-button>
          </div>
        </el-form-item>
        <el-form-item label="内容:" prop="Content">
          <el-input type="textarea" v-model="PMmainForm.Content" rows="6" :readonly="isEdit"></el-input>
        </el-form-item>
      </el-form>
      <div class="PMmainDialogBottom">
        <el-button size="small" :disabled="send_btn" @click="sendMessage">发送</el-button>
        <el-button size="small" :disabled="reply_btn" @click="MessagelistHandle('回复')">回复</el-button>
        <el-button size="small" :disabled="new_btn" @click="MessagelistHandle('创建新消息')">创建新消息</el-button>
        <el-button size="small" :disabled="forward_btn" @click="MessagelistHandle('转发')">转发</el-button>
        <el-button size="small" @click="saveDraft">保存草稿</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 -->
    <div class="width-25" >
      <el-dialog title="删除" :visible.sync="dialogDeleteVisible" width="90%">
      <el-row>
        <el-col :span="8">
          <i class="el-icon-warning iconStyle"></i>
        </el-col>
        <el-col :span="16">
          <p>是否要删除選中的消息:</p>
          <p>標題: {{ MessageDeleteTitle }}</p>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelHandle">取消</el-button>
        <el-button type="danger" size="small" @click="deleteMessage">确定</el-button>
      </span>
    </el-dialog>
    </div>
    <!-- 二级弹窗 - 增加用户/用户组 -->
    <PermissionList :dialogObj="PermissionData" @reData="rePData" @reUser="reUser(arguments)" />
    <!-- 二级弹窗 - 选择目录或文档 -->
    <SelectAttachment :dialogObj="PermissionData2" @reData="reData2" @Attached="Attached" />
    <!-- 分页 -->
    <pagination :pagination="pagination" @changepage="pageNum2" />
  </div>
</template>

<script>
import PermissionList from "../Dialog/PermissionList-PM2";
import SelectAttachment from "../Dialog/SelectAttachment";
import UserApi from "../../api/services/message";
import { mapGetters } from "vuex";
let username =
  localStorage.getItem("username") || sessionStorage.getItem("username");
let userdesc =
  localStorage.getItem("userdesc") || sessionStorage.getItem("userdesc");

export default {
  data() {
    return {
      isEdit: true,
      // 消息列表
      multipleSelection: [],
      // 弹窗
      dialogFormVisible: false,
      // 弹窗 表单
      dialogTitle: "消息内容",
      PMmainForm: {
        Sender: "", // 發送方
        RecUsers: "", // 接收方
        RecUserList: "", // 接收方代號
        Title: "", // 標題
        Content: "", // 內容
        CCUsers: "", // 抄送方
        CCUserList: "", // 抄送方代號
        AttachmentData: [
          // {
          //   Attachment: ""
          // }
        ]
      },
      formLabelWidth: "120px",
      // 弹窗 按钮
      send_btn: true,
      reply_btn: false,
      new_btn: false,
      forward_btn: false,
      // 删除弹窗
      dialogDeleteVisible: false,
      MessageDeleteTitle: "",
      // 二级弹窗 - 增加用户/用户组
      PermissionData: {
        switch: false
      },
      // 二级弹窗 - 选择目录或文档
      PermissionData2: {
        switch: false
      },
      isRead: false
    };
  },
  filters: {
    asd(value) {
      if (value.length > 20) {
        return value.slice(0, 19) + "...";
      } else {
        return value;
      }
    }
  },
  components: {
    PermissionList,
    SelectAttachment
  },
  computed: {
    ...mapGetters("PerMessage", [
      "messageList",
      "pagination",
      "MessageType",
      "messageListId"
    ]),
    ...mapGetters("menu", ["tableHeight"])
  },
  watch: {
    // 个人消息附件跳转过来
    messageListId: {
      handler(newValue) {
        if (newValue === "_1") {
          this.isRead = false;
        } else {
          this.isRead = true;
        }
      }
    },
    messageList: {
      handler(newValue) {
        if (newValue) {
          let vm = this;
          if(newValue[0]){
            this.$nextTick(() => {
              vm.$refs["messageList"].toggleRowSelection(newValue[0]);
              vm.$store.dispatch("PerMessage/getMessage", newValue[0].Keyword);
            });
          }
        }
      }
    }
  },
  methods: {
    // 点击Message列表
    handleCurrentChange(val) {
      let vm = this;
      if (val !== null) {
        vm.$refs.messageList.clearSelection();
        vm.$refs.messageList.toggleRowSelection(val);
        vm.MessageDeleteTitle = val.Title;
        vm.$store.dispatch("PerMessage/getMessage", val.Keyword);
      }
    },
    // 多选Message列表
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 點擊 Message 按鈕
    MessagelistHandle(e) {
      if (e !== "创建新消息") {
        let arr = this.multipleSelection;
        if (arr.length === 0) {
          this.$message({ message: "請點選消息", type: "error" });
          return;
        } else {
          if (e === "删除") {
            this.dialogDeleteVisible = true;
            return;
          } else if (e === "设为已读") {
            this.SetMessageRead(e);
            return;
          }
        }
      }
      this.dialogTitle = e;
      this.dialogFormVisible = true;
      switch (e) {
        case "打开":
          this.getMessage(e);
          if (!this.isRead) {
            this.SetMessageRead(e);
          }
          if (this.messageListId === "_4") {
            this.send_btn = false;
            this.reply_btn = true;
          }
          break;
        case "回复":
          this.send_btn = false;
          this.reply_btn = true;
          this.getMessage(e);
          // this.new_btn = false
          // this.forward_btn = false
          break;
        case "创建新消息":
          this.isEdit = false;
          this.send_btn = false;
          this.reply_btn = true;
          this.forward_btn = true;
          this.PMmainForm.Sender = `${username}__${userdesc}`;
          this.PMmainForm.RecUsers = "";
          this.PMmainForm.Title = "";
          this.PMmainForm.Content = "";
          this.PMmainForm.CCUsers = "";
          this.PMmainForm.AttachmentData = [];
          break;
        case "转发":
          this.send_btn = false;
          this.reply_btn = true;
          this.forward_btn = true;
          this.getMessage(e);
          break;
      }
    },
    // 保存草稿
    async saveDraft() {
      let { multipleSelection } = this,
        arr = [],
        MessageKeyword = "",
        RecUserlist = this.PMmainForm.RecUserList,
        CCUserlist = this.PMmainForm.CCUserList,
        Title = this.PMmainForm.Title,
        Content = this.PMmainForm.Content,
        Attalist = "",
        arr2 = [];
      if (multipleSelection.length !== 0) {
        arr = multipleSelection.map(item => item.Keyword);
        MessageKeyword = arr[0];
      }
      this.PMmainForm.AttachmentData.forEach(item => {
        if (item.checked) {
          let Keyword = item.AttaKeyword || item.Keyword;
          arr2.push(Keyword);
        }
      });
      Attalist = arr2.join(",");
      const res = await UserApi.saveDraftMessage(
        MessageKeyword,
        RecUserlist,
        CCUserlist,
        Title,
        Content,
        Attalist
      );
      if (res.success) {
        this.$message({ message: "保存成功", type: "success" });
        this.handleClose();
      } else {
        this.$message({ message: res.msg, type: "error" });
      }
    },
    // 刪除 Message
    async deleteMessage() {
      let { multipleSelection } = this;
      let arr = multipleSelection.map(item => item.Keyword);
      for (let i in arr) {
        const res = await UserApi.deleteMessage(arr[i]);
        if (res.success) {
          this.$message({ message: "刪除成功", type: "success" });
        } else {
          this.$message({ message: "刪除失败", type: "error" });
          return;
        }
      }
      let MessageType = this.MessageType,
        page = 1;
      this.$store.dispatch("PerMessage/getMessageList", { MessageType, page });
      this.cancelHandle();
    },
    // 发送 Message
    async sendMessage() {
      let RecUserlist = this.PMmainForm.RecUserList,
        CCUserlist = this.PMmainForm.CCUserList,
        Title = this.PMmainForm.Title,
        Content = this.PMmainForm.Content,
        Attalist = "",
        arr = [];
      this.PMmainForm.AttachmentData.forEach(item => {
        if (item.checked) {
          let Keyword = item.AttaKeyword || item.Keyword;
          arr.push(Keyword);
        }
      });
      Attalist = arr.join(",");
      const res = await UserApi.sendMessage(
        RecUserlist,
        CCUserlist,
        Title,
        Content,
        Attalist
      );
      if (res.success) {
        let MessageType = this.MessageType,
          page = 1;
        this.$store.dispatch("PerMessage/getMessageList", {
          MessageType,
          page
        });
        this.handleClose();
      } else {
        this.$message({ message: res.msg, type: "error" });
      }
    },
    // 已读 Message
    async SetMessageRead(e) {
      let { multipleSelection } = this;
      let arr = multipleSelection.map(item => item.Keyword);
      for (let i in arr) {
        const res = await UserApi.SetMessageRead(arr[i]);
        if (res.success) {
          if (e === "设为已读") {
            this.$message({ message: e, type: "success" });
            this.$store.commit("project/REFRESH_TREE", true);
          }
        } else {
          this.$message({ message: res.msg, type: "error" });
          return;
        }
      }
      if (e === "设为已读") {
        let MessageType = this.MessageType,
          page = 1;
        this.$store.dispatch("PerMessage/getMessageList", {
          MessageType,
          page
        });
      }
    },
    // 獲取 Message
    async getMessage(e) {
      let { multipleSelection } = this;
      let arr = multipleSelection.map(item => item.Keyword);
      const res2 = await UserApi.getMessage(arr[0]);
      if (e === "打开") {
        this.PMmainForm.Title = res2.data[0].Title;
        this.PMmainForm.Sender = res2.data[0].Sender;
        this.PMmainForm.RecUsers = res2.data[0].Sender;
        this.PMmainForm.RecUserList = res2.data[0].SenderKeyword;
        this.PMmainForm.CCUsers = res2.data[0].CCUsers;
        this.PMmainForm.Content = res2.data[0].Content;
        let arr = [...res2.data];
        arr.shift();
        this.PMmainForm.AttachmentData = [];
        arr.filter(i => ["Proj", 'Doc'].includes(i.AttaType)).forEach(item => {
          this.PMmainForm.AttachmentData.push({
            Attachment: item.Attachment,
            AttaKeyword: item.AttaKeyword,
            AttaType: item.AttaType,
            FileSize: item.FileSize,
            checked: true
          });
        });
      } else if (e === "回复") {
        this.isEdit = false;
        // 發送方Sender 為該帳號
        // 接收方RecUsers 為發送方,第一個接收方不能移除
        this.PMmainForm.Sender = `${username}__${userdesc}`;
        this.PMmainForm.RecUsers = res2.data[0].Sender;
        this.PMmainForm.RecUserList = res2.data[0].SenderKeyword;
        this.PMmainForm.Title = `${e}:${res2.data[0].Title}`;
        let arr = [...res2.data];
        arr.shift();
        this.PMmainForm.AttachmentData = [];
        // 要过滤掉一些
        arr.filter(i => ["Proj", 'Doc'].includes(i.AttaType)).forEach(item => {
          this.PMmainForm.AttachmentData.push({
            Attachment: item.Attachment,
            AttaKeyword: item.AttaKeyword,
            AttaType: item.AttaType,
            FileSize: item.FileSize,
            checked: true
          });
        });
        this.PMmainForm.Content = `-----------原始消息------------
发送者:${res2.data[0].Sender}
发送时间:${res2.data[0].SendDate}
接收者:${res2.data[0].RecUsers}
抄送: ${res2.data[0].CCUsers}
主题:${res2.data[0].Title}
${res2.data[0].Content}`;
      } else if (e === "转发") {
        this.isEdit = false;
        // 發送方Sender 為該帳號
        // 接收方RecUsers 一开始为空
        this.PMmainForm.Sender = `${username}__${userdesc}`;
        this.PMmainForm.RecUsers = "";
        this.PMmainForm.RecUserList = "";
        this.PMmainForm.Title = `${e}:${res2.data[0].Title}`;
        console.log(res2)
        let arr = [...res2.data];
        arr.shift();
        this.PMmainForm.AttachmentData = [];

        arr.filter(i => ["Proj", 'Doc'].includes(i.AttaType)).forEach(item => {
          this.PMmainForm.AttachmentData.push({
            Attachment: item.Attachment,
            AttaKeyword: item.AttaKeyword,
            AttaType: item.AttaType,
            FileSize: item.FileSize,
            checked: true
          });
        });
        this.PMmainForm.Content = `-----------原始消息------------
发送者:${res2.data[0].Sender}
发送时间:${res2.data[0].SendDate}
接收者:${res2.data[0].RecUsers}
抄送: ${res2.data[0].CCUsers}
主题:${res2.data[0].Title}

${res2.data[0].Content}`;
      }
      this.dialogFormVisible = true;
    },
    // 选择按钮 - 接收方、抄送方
    permissionListHanlde(e) {
      let arr = [];
      if (e === "CCUsers") {
        let { CCUsers } = this.PMmainForm,
          { CCUserList } = this.PMmainForm;
        if (CCUsers !== "") this.mergeList(e, CCUsers, CCUserList);
        else this.openPermissionList(e, arr);
      } else if (e === "RecUsers") {
        let { RecUsers } = this.PMmainForm,
          { RecUserList } = this.PMmainForm;
        if (RecUsers !== "") this.mergeList(e, RecUsers, RecUserList);
        else this.openPermissionList(e, arr);
      }
    },
    // 合併 名字 代號
    mergeList(status, Users, UserList) {
      // 名字用;
      // 代號用,
      let editArr = [];
      let isUsers = Users.split(";");
      let isUserList = UserList.split(",");
      for (let i = 0; i < isUsers.length; i++) {
        editArr.push({
          text: isUsers[i],
          id: isUserList[i]
        });
      }
      this.openPermissionList(status, editArr);
    },
    // 添加用戶 - 开启弹窗
    openPermissionList(status, Arr) {
      let vm = this;
      vm.PermissionData.buttonTitle = vm.buttonTitle;
      vm.PermissionData.editUserData = Arr;
      vm.PermissionData.status = status;
      vm.PermissionData.switch = true;
    },
    // 添加用戶 - 返回值
    rePData(e) {
      this.PermissionData.switch = e;
      this.PermissionData.editUserData = undefined;
    },
    // 添加用戶 - 返回值
    reUser(e) {
      let vm = this;
      if (e[0] === "CCUsers") {
        vm.PMmainForm.CCUsers = "";
        vm.PMmainForm.CCUserList = "";
        vm.PMmainForm.CCUsers = e[1];
        vm.PMmainForm.CCUserList = e[2];
      } else if (e[0] === "RecUsers") {
        vm.PMmainForm.RecUsers = "";
        vm.PMmainForm.RecUserList = "";
        vm.PMmainForm.RecUsers = e[1];
        vm.PMmainForm.RecUserList = e[2];
      }
    },
    // 选择目录或文档 - 开启弹窗
    openPermissionList2() {
      this.PermissionData2.switch = true;
    },
    // 选择目录或文档 - 返回值
    reData2(e) {
      this.PermissionData2.switch = e;
    },
    // 选择目录或文档 - 返回值
    Attached(e) {
      e.forEach(item => {
        this.PMmainForm.AttachmentData.push({
          ...item,
          Attachment: item.Title,
          checked: true
        });
      });
    },
    // 刪除彈窗 - 關閉
    cancelHandle() {
      this.dialogDeleteVisible = false;
    },
    // 关闭弹窗
    handleClose() {
      this.isEdit = true;
      (this.PMmainForm = {
        Sender: "",
        RecUsers: "",
        RecUserList: "",
        Title: "",
        Content: "",
        CCUsers: "",
        CCUserList: "",
        AttachmentData: []
      }),
        (this.send_btn = true);
      this.reply_btn = false;
      this.new_btn = false;
      this.forward_btn = false;
      this.dialogFormVisible = false;
    },
    // 分页
    pageNum2(e) {
      let page = e;
      let { MessageType } = this;
      this.$store.dispatch("PerMessage/getMessageList", { MessageType, page });
    }
  }
};
</script>

<style lang='scss' scoped>
.PMmainContainer{
  display: flex;
  flex-direction: column;
  height: 50%;
}
</style>
<style>
.PMmainDialog .el-dialog {
  max-width: 700px;
}
</style>