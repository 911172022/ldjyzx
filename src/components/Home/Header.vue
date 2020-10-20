<template>
  <div>
    <el-row class="header">
      <el-col class="UserPanel" :span="24">
        <div class="user-wrapper">
          <div>
            <!-- <el-avatar
                            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                            style="vertical-align: middle;margin-right: 10px;"
                        ></el-avatar> -->
          </div>
          <el-dropdown trigger="click">
            <div
              class="el-dropdown-link"
              style="display: flex; align-items: center"
            >
              <div>{{ sysUserName }}</div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="PersonalCenter">
                <i class="el-icon-user-solid"></i> 个人中心
              </el-dropdown-item>
              <el-dropdown-item @click.native="openRecycle">
                <i class="el-icon-delete"></i> 回收站
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout"
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <!-- 个人中心 -->
    <el-dialog
      title="个人中心"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
      :before-close="handleClose"
      append-to-body
    >
      <!-- 剪裁组件弹窗 -->
      <el-dialog
        title="剪裁组件"
        :visible.sync="cropperModel"
        width="800px"
        :modal="false"
      >
        <Cropper
          :img-file="file"
          ref="vueCropper"
          :fixedNumber="fixedNumber"
          @upload="upload"
        />
      </el-dialog>
      <el-form
        :model="userForm"
        ref="userForm"
        :rules="rules"
        label-position="top"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="24" style="text-align: center">
            <div>
              <el-avatar
                :size="120"
                :src="avatarSrc"
                @error="errorHandler"
                style="border: 1px #fafafa solid"
              >
                <img class="img" src="../../assets/imgerror.png" />
              </el-avatar>
              <el-upload
                action="#"
                list-type="picture"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleCrop"
              >
                <el-button
                  type="primary"
                  icon="el-icon-camera"
                  circle
                  style="position: absolute; top: 90px; left: 55%; padding: 8px"
                />
              </el-upload>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="userForm.O_username" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="旧密码" prop="OldPassword">
              <el-input
                v-model="userForm.OldPassword"
                placeholder="请输入旧密码"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="Phone">
              <el-input v-model.number="userForm.Phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新密码" prop="NewPassword">
              <el-input
                v-model="userForm.NewPassword"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱">
              <el-input v-model="userForm.O_email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="NewPassword2">
              <el-input
                v-model="userForm.NewPassword2"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('userForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 回收站弹窗 -->
    <el-dialog
      id="RecycleBinDialog"
      title="回收站"
      :visible.sync="RecycleBinVisible"
      width="90%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <el-table
        v-loading="loadingRecycleBin"
        ref="recycleData"
        :data="recycleData"
        border
        height="400"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="Name" label="名称" />
        <el-table-column prop="OriginalPosition" label="原位置" />
        <el-table-column prop="DelDate" label="删除日期" />
        <el-table-column prop="Size" label="大小" />
        <el-table-column prop="Type" label="类型" />
        <el-table-column prop="Deleter" label="删除者" />
      </el-table>
      <el-row slot="footer" class="recycle-footer">
        <el-col :span="24" style="text-align: left">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="类型" class="form-item-small">
              <el-select
                :disabled="loadingRecycleBin"
                v-model="formInline.type"
                @change="selectTypeChange"
                placeholder="全部"
              >
                <el-option label="全部" value="0"></el-option>
                <el-option label="目录" value="1"></el-option>
                <el-option label="文档" value="2"></el-option>
                <el-option label="流程" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间" class="form-item-small">
              <el-select
                :disabled="loadingRecycleBin"
                v-model="formInline.time"
                @change="selectTimeChange"
                placeholder="全部"
              >
                <el-option label="全部" value="0"></el-option>
                <el-option label="一天之内" value="1"></el-option>
                <el-option label="一周之内" value="2"></el-option>
                <el-option label="一月之内" value="3"></el-option>
                <el-option label="一年之内" value="4"></el-option>
                <el-option label="选择时间" value="5" divided></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="删除者"> -->
            <!-- <el-select v-model="formInline.region" @change="selectUserChange" placeholder="全部">    
                          <el-option label="全部" value="0"></el-option>
                          <el-option label="选择人员" value="1"></el-option>
                          <el-option :label="userName" :value="userName"></el-option>
                        </el-select>
                        </el-form-item>-->
            <el-date-picker
              style="margin-bottom: 20px"
              :disabled="loadingRecycleBin"
              @change="selectedTimeChange"
              v-if="datePickerShow"
              v-model="timeSelected"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholde="结束日期"
              align="right"
            ></el-date-picker>
          </el-form>
        </el-col>
        <el-col :span="24">
          <div class="dropmenu">
            <div>删除者</div>
            <div>
              <el-dropdown el-dropdown split-button @command="selectUserChange">
                {{ selectedUser }}
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0" :disabled="loadingRecycleBin"
                    >全部</el-dropdown-item
                  >
                  <el-dropdown-item command="1" :disabled="loadingRecycleBin"
                    >选择人员</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <el-button @click="returnData">还原</el-button>
          <el-button @click="deleteData">删除</el-button>
          <el-button @click="deleteAllData" :disabled="loadingRecycleBin"
            >清空回收站</el-button
          >
          <el-button
            type="primary"
            @click="getRecycleList"
            :disabled="loadingRecycleBin"
            >刷新</el-button
          >
        </el-col>
      </el-row>
      <pagination
        :pagination="pagination"
        @changepage="pageNum2"
        :current-page.sync="currentPage"
      />
    </el-dialog>
    <PermissionList
      :dialogObj="PermissionData"
      @reData="rePData"
      @reUser="reUser(arguments)"
    />
  </div>
</template>
<script>
import UserApi from "../../api/services/user";
import UserApi2 from "../../api/services/file";
import recycleApi from "../../api/services/recycle";
import { isTelephoneValid } from "../../util/Regular";
import Cropper from "../Cropper";
import PermissionList from "../Dialog/PermissionList-PM2";
import { mapGetters } from "vuex";
import { TimeChange } from "../../util/Time";

export default {
  data() {
    return {
      userName: "",
      sysName: "艾三维协同系统",
      sysUserName: "账号管理",
      sysUserAvatar: "",
      dialogVisible: false, // 个人中心弹窗
      // 个人中心
      userForm: {
        O_username: "",
        O_userdesc: "",
        O_email: "",
        Phone: "",
        UserType: "",
        UserFlags: "",
        OldPassword: "",
        NewPassword: "",
        NewPassword2: "",
      },
      rules: {
        Phone: [
          { required: false, message: "请输入电话", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value) {
                setTimeout(() => {
                  if (isTelephoneValid(value)) {
                    callback();
                  } else {
                    callback(new Error("手机号码格式不正确"));
                  }
                }, 250);
              } else {
                callback();
              }
            },
          },
        ],
        O_email: [
          {
            required: false,
            message: "请输入电子邮箱",
            trigger: "blur",
          },
          { type: "email", message: "格式不对", trigger: "blur" },
        ],
        OldPassword: [
          {
            required: false,
            message: "请输入旧密码",
            trigger: "blur",
          },
          { min: 5, max: 25, message: "长度在 5 到 25个字符" },
          {
            pattern: /^(\w){5,25}$/,
            message: "只能输入5-25个字母、数字、下划线",
          },
        ],
        NewPassword: [
          {
            required: false,
            message: "请输入新密码",
            trigger: "blur",
          },
          { min: 5, max: 25, message: "长度在 5 到 25个字符" },
          {
            pattern: /^(\w){5,25}$/,
            message: "只能输入5-25个字母、数字、下划线",
          },
        ],
        NewPassword2: [
          {
            required: false,
            message: "请输入新密码",
            trigger: "blur",
          },
          { min: 5, max: 25, message: "长度在 5 到 25个字符" },
          {
            pattern: /^(\w){5,25}$/,
            message: "只能输入5-25个字母、数字、下划线",
          },
          {
            validator: (rule, value, callback) => {
              if (this.userForm.NewPassword) {
                if (value !== this.userForm.NewPassword) {
                  callback(new Error("两次输入密码不一致!"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
          },
        ],
      },
      file: "", // 当前被选择的图片文件
      imageUrl: "", // 单图情况框内图片链接
      uploadList: [], // 上传图片列表
      cropperModel: false, // 剪裁组件弹窗
      fixedNumber: [1, 1],
      avatarSrc: "",
      errorHandler: true,
      ServerFullFileName: "",
      // 回收站
      RecycleBinVisible: false,
      recycleData: [],
      formInline: {
        type: "0",
        time: "0",
        region: "0",
      },
      keyArr: [],
      userKeyword: "",
      PermissionData: {
        switch: false,
      },
      pagination: {
        pageSize: 0,
        total: 0,
      },
      page: 1,
      loadingRecycleBin: false,
      currentPage: 1,
      timeSelected: "",
      // 放computed检测不到
      datePickerShow: "",
      // 选择删除者
      selectedUser: "全部",
    };
  },
  components: {
    Cropper,
    PermissionList,
  },
  mounted() {
    let username =
      localStorage.getItem("username") || sessionStorage.getItem("username");
    this.sysUserName = username || this.sysUserName;
  },
  updated() {
    if (this.$refs.vueCropper) {
      this.$refs.vueCropper.Update();
    }
  },
  computed: {
    ...mapGetters(["UserKeyword"]),
    activeIndex() {
      return this.$store.state.headerActiveIndex;
    },
  },
  methods: {
    pageNum2(e) {
      this.page = e;
      this.getRecycleList();
    },
    rePData(e) {
      this.PermissionData.switch = e;
    },
    async reUser(e) {
      this.userName = e[1];
      this.userKeyword = e[2];
      // 增加提示选择的删除者是谁
      this.selectedUser = e[1];
      this.getRecycleList();
    },
    // 还原数据
    returnData() {
      let keyWordList = [];
      this.keyArr.forEach((item) => {
        keyWordList.push(item.KeyWord);
      });
      recycleApi.onRecycle(keyWordList.toString()).then((res) => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "还原成功",
          });
          this.$store.commit("project/REFRESH_TREE", true);
          this.getRecycleList();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    // 删除数据
    deleteData() {
      let keyWordList = [];
      this.keyArr.forEach((item) => {
        keyWordList.push(item.KeyWord);
      });
      this.$confirm("此操作将永久删除选中的文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          recycleApi.deleteFile(keyWordList.toString()).then((res) => {
            if (res.success) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.getRecycleList();
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    // 清空数据
    deleteAllData() {
      let Type = this.formInline.type,
        Empty = true;
      this.$confirm("此操作将永久清空回收站, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          recycleApi.emptyTrash(Type, Empty).then((res) => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "清空回收站成功",
              });
              this.getRecycleList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消清空回收站",
          });
        });
    },
    // 类型筛选
    selectTypeChange(val) {
      // 重置页数
      this.currentPage = 1;
      this.formInline.type = val;
      this.getRecycleList();
    },
    // 时间筛选
    selectTimeChange(val) {
      // 重置页数
      this.currentPage = 1;
      this.formInline.time = val;
      if (val != 5) {
        this.datePickerShow = false;
        this.getRecycleList();
      } else {
        this.datePickerShow = true;
      }
    },
    selectedTimeChange() {
      this.getRecycleList();
    },
    // 用户筛选
    selectUserChange(val) {
      // 重置页数
      this.currentPage = 1;
      this.formInline.region = val;
      if (val == 1) {
        this.PermissionData.switch = true;
      } else {
        // 删除者提示
        this.selectedUser = "全部";
        this.userKeyword = "";
        this.getRecycleList();
      }
    },
    // 打开回收站弹窗
    openRecycle() {
      this.getRecycleList();
      this.RecycleBinVisible = true;
    },
    // 获取回收站数据
    getRecycleList() {
      if (this.loadingRecycleBin) {
        return;
      }
      let page = this.page,
        limit = 20,
        timeSelect = this.formInline.time,
        fileType = this.formInline.type,
        fileDeleter = this.formInline.region,
        startDate = "",
        endDate = "",
        delUseKeyWord = this.userKeyword;

      if (timeSelect == 5) {
        startDate = TimeChange(this.timeSelected[0]);
        endDate = TimeChange(this.timeSelected[1]);
      }
      // 打开加载
      this.loadingRecycleBin = true;
      recycleApi
        .getRecycleList(
          page,
          limit,
          timeSelect,
          fileType,
          fileDeleter,
          startDate,
          endDate,
          delUseKeyWord
        )
        .then((res) => {
          this.loadingRecycleBin = false;
          if (res.success) {
            this.pagination.pageSize = limit;
            this.pagination.total = res.total;
            this.recycleData = res.data;
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        })
        .catch(() => {
          this.loadingRecycleBin = false;
        });
    },
    handleClose() {
      this.dialogVisible = false;
      this.cropperModel = false;
      this.errorHandler = true;
      this.RecycleBinVisible = false;
      this.userForm = {
        O_username: "",
        O_userdesc: "",
        O_email: "",
        Phone: "",
        UserType: "",
        UserFlags: "",
        OldPassword: "",
        NewPassword: "",
        NewPassword2: "",
      };
    },
    async editPersonalCenter() {
      let { OldPassword } = this.userForm,
        { NewPassword } = this.userForm;
      if (OldPassword !== "" || NewPassword !== "") {
        const res = await UserApi.setUserPassword(OldPassword, NewPassword);
        if (!res.success) {
          this.$message({ message: res.msg, type: "error" });
          return;
        }
      }
      let { UserKeyword } = this,
        UserCode = this.userForm.O_username,
        UserDesc = this.userForm.O_userdesc,
        UserEmail = this.userForm.O_email,
        UserType = this.userForm.UserType,
        UserStatus = this.userForm.UserStatus,
        Phone = this.userForm.Phone;
      const res2 = await UserApi.saveUserInfo(
        UserKeyword,
        UserCode,
        UserDesc,
        UserEmail,
        UserType,
        UserStatus,
        Phone
      );
      if (res2.success) {
        this.$message({ message: "修改成功", type: "success" });
        this.dialogVisible = false;
        this.handleClose();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editPersonalCenter();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 开启个人中心
    async PersonalCenter() {
      this.dialogVisible = true;
      // let { UserKeyword } = this;
      // const res = await UserApi.getUserInfo(UserKeyword);
      // if (res.success) {
      //     this.userForm.O_username = res.data[0].O_username;
      //     this.userForm.O_userdesc = res.data[0].O_userdesc;
      //     this.userForm.O_email = res.data[0].O_email;
      //     this.userForm.UserType = res.data[0].UserType;
      //     this.userForm.UserStatus = res.data[0].UserFlags;
      //     if (res.data[0].Phone)
      //         this.userForm.Phone = Number(res.data[0].Phone);
      //     let FileName = `${res.data[0].O_username}.jpg`;
      //     this.avatarSrc = `BMP/${FileName}?timestamp=${Date.now()}`;
      //     if (this.avatarSrc) {
      //         this.errorHandler = false;
      //     }
      // }
    },
    // 点击弹出剪裁框
    handleCrop(file) {
      this.cropperModel = true;
      this.file = file;
    },
    // 剪裁框保存
    upload(data) {
      this.avatarSrc = data;
      this.beforeAvatarUpload();
    },
    async beforeAvatarUpload() {
      let { file } = this;
      if (file.name) {
        let fileSize = file.size,
          ModifyDate = TimeChange(file.raw.lastModifiedDate),
          ServerFileName = `BMP/${this.userForm.O_username}.jpg`;
        let ObjectKeyword = "",
          CreateDate = "";
        const res = await UserApi2.beforeUploadFile(
          ObjectKeyword,
          ServerFileName,
          CreateDate,
          ModifyDate,
          fileSize
        );
        if (res.success) {
          this.ServerFullFileName = res.data[0].ServerFullFileName;
          this.httpRequest();
        }
      }
    },
    async httpRequest() {
      if (this.ServerFullFileName) {
        let { ServerFullFileName } = this,
          { file } = this;
        let Files = file.raw;
        const res = await UserApi2.uploadFile(ServerFullFileName, Files);
        if (res.success) this.onSuccess();
      }
    },
    // 用户表单 - 上传文件成功
    async onSuccess() {
      let DocKeyword = "";
      let { ServerFullFileName } = this;
      const res = await UserApi2.afterUploadFile(
        DocKeyword,
        ServerFullFileName
      );
      if (res.success) {
        this.cropperModel = false;
        this.$message({ message: "上传成功", type: "success" });
      }
    },
    // 用户表单 - 上传文件失败
    onError() {
      this.$message.error("上传失败");
    },
    handleSelectionChange(val) {
      let vm = this;
      if (val) {
        vm.keyArr = val;
      }
    },
    handleSelect(key) {
      switch (key) {
        case "1": // 文档管理
          this.$router.push({ name: "DocManagement" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
        case "2": // 个人消息
          this.$router.push({ name: "PerMessage" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
        case "3": // 流程工作台
          this.$router.push({ name: "ProWorkbench" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
        case "4": // 个人工作台
          this.$router.push({ name: "PerWorkbench" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
        case "5": // 逻辑目录
          this.$router.push({ name: "LogicalDirectory" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
        case "6": // 文档查询
          this.$router.push({ name: "DocSelect" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
        case "7": // 导航页
          this.$router.push({ name: "Navigation" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
        case "8": // 产品库
          this.$router.push({ name: "Product" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
        case "9": // 产品库2
          this.$router.push({ name: "ProductSecond" });
          this.$store.commit("menu/GET_NAVURL", "");
          break;
      }
      // 重置流程
      this.$store.commit("workflow/CLEAR_WORKFLOW");
    },
    //退出登录
    logout: function () {
      var vm = this;
      vm.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          vm.$store.commit("REMOVE_USER");
          vm.$notify.closeAll();
          // 将跳转放到mutation中
        })
        .catch(() => {});
    },
    //CDMS退出跳转回到广建EPC登录界面  2020.4.14 郭晓富修改
    // 这个方法放到插件里
    // jumpToGJEPCLoginPage(){
    //           let jumpUrl = 'http://jhcdms.f3322.net:8098?logtype=logout';
    //           console.log(jumpUrl);
    //
    //           //window.location.href = 'http://jhcdms.f3322.net:8090/#/home/Doc-Management';
    //           window.location.href = jumpUrl;
    // }
  },
};
</script>
<style lang="scss">
.UserPanel {
  text-align: right;
  .el-dropdown-link {
    cursor: pointer;
  }
  .el-button--text:focus,
  .el-button--text:hover {
    color: #ffbc40;
  }
}
</style>
<style lang="scss">
@import "@/scss/_variables";
.header {
  height: 60px;
  line-height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .el-menu {
    background-color: $main-color-light;
    .el-menu-item i {
      color: #fff;
    }
    .el-menu-item.is-active {
      border-bottom: 0;
      color: #fff;
      background-color: #2b76fd;
    }
  }
  .el-menu--horizontal {
    border-bottom: 0;
    .el-menu-item {
      border-bottom: 0;
    }
    .el-menu-item:not(.is-disabled):hover,
    .el-menu-item:not(.is-disabled):focus {
      background-color: #2b76fd;
      color: #fff;
    }
  }
  .el-menu.el-menu--horizontal {
    border-bottom: 0;
  }
  .header-logo {
    padding: 0 15px;
    img {
      object-fit: scale-down;
      width: 100%;
      height: 100%;
      max-height: 45px;
      vertical-align: middle;
      @media screen and (min-width: 1919px) {
        width: 300px;
      }
    }
  }
}
.recycle-footer {
  .el-form-item__content {
    width: 120px;
  }
}
.dropmenu {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #606266;
}
.dropmenu > div {
  margin-right: 20px;
}
#RecycleBinDialog .el-dialog {
  max-width: 900px;
}
@media screen and (max-width: 1400px) {
  .el-menu {
    .el-menu-item {
      padding: 0 15px;
    }
  }
}
@media screen and (max-width: 1300px) {
  .el-menu {
    .el-menu-item {
      padding: 0 5px;
    }
  }
}
.nav-wrapper {
  max-height: 60px;
  overflow: hidden;
}
.nav-wrapper:hover {
  overflow: inherit;
}
.user-wrapper {
  display: flex;
  max-height: 60px;
  margin-right: 20px;
}
.UserPanel {
  display: flex;
  justify-content: flex-end;
}
</style>
