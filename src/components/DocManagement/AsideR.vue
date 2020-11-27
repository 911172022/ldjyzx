<template>
  <div class="asideR">
    <el-tabs v-model="activeName2" class="asideRTabs" @tab-click="handleClick">
      <template v-if="tabsName.DirectoryName">
        <el-tab-pane label="目录属性" name="a">
          <table class="isTable">
            <tr>
              <th class="thColor">属性名</th>
              <th class="thColor">属性值</th>
            </tr>
            <tr v-for="(item, index) in ProjectBaseAttr" :key="index">
              <td
                class="bgTd"
                v-if="item.AttrName === '模板'"
                @click="TemplateHandle('Project')"
                style="cursor: pointer"
              >
                {{ item.AttrName }}
                <i class="el-icon-edit" />
              </td>
              <td class="bgTd" v-else>{{ item.AttrName }}</td>
              <td>{{ item.AttrValue }}</td>
            </tr>
          </table>
        </el-tab-pane>
      </template>
      <template v-if="tabsName.AttrDataCount">
        <el-tab-pane label="目录_附加属性" name="b">
          <table class="isTable">
            <tr>
              <th class="thColor">属性名</th>
              <th class="thColor">属性值</th>
            </tr>
            <tr v-for="(item, index) in ProjectAttrData" :key="index">
              <td
                class="bgTd"
                @click="openEditAttributes(item, 'Project')"
                :style="{
                  cursor: item.CanEdit === 'True' ? 'pointer' : 'unset',
                }"
              >
                {{ item.AttrName }}
                <i class="el-icon-edit" v-if="item.CanEdit === 'True'" />
              </td>
              <template v-if="editAttributesData.AttrName !== item.AttrName">
                <td>
                  <span>{{ item.AttrValue }}</span>
                </td>
              </template>
              <template v-else-if="editAttributesData.DataType === 0">
                <td>
                  <span>{{ item.AttrValue }}</span>
                </td>
              </template>
              <!-- 选择日期 -->
              <template v-else-if="editAttributesData.DataType === 5">
                <td>
                  <el-date-picker
                    v-model="editAttributesText"
                    type="date"
                    placeholder="选择日期"
                    @change="EditAttributesHandle(item, 'Project')"
                    @blur="cancelHandle"
                  ></el-date-picker>
                </td>
              </template>
              <!-- 其他 -->
              <template v-else>
                <td>
                  <el-input
                    v-model.trim="editAttributesText"
                    @change="EditAttributesHandle(item, 'Project')"
                    @keyup.esc.native="cancelHandle"
                    @blur="cancelHandle"
                    v-focus
                  />
                </td>
              </template>
            </tr>
          </table>
        </el-tab-pane>
      </template>
      <template v-if="tabsName.fileName">
        <el-tab-pane label="文档属性" name="c">
          <table class="isTable">
            <tr>
              <th class="thColor">属性名</th>
              <th class="thColor">属性值</th>
            </tr>
            <tr v-for="(item, index) in DocBaseAttr" :key="index">
              <td
                class="bgTd"
                v-if="item.AttrName === '文件名'"
                style="cursor: pointer"
              >
                <uploadFiles3
                  projectKeyword
                  :autoUpload="false"
                  ref="upload"
                  :multiple="false"
                  @handleChange="selectedFile"
                >
                  {{ item.AttrName }}
                  <i class="el-icon-edit"></i>
                </uploadFiles3>
              </td>
              <td
                class="bgTd"
                v-else-if="item.AttrName === '模板'"
                @click="TemplateHandle('Doc')"
                style="cursor: pointer"
              >
                {{ item.AttrName }}
                <i class="el-icon-edit" />
              </td>
              <td class="bgTd" v-else>{{ item.AttrName }}</td>
              <td>{{ item.AttrValue }}</td>
            </tr>
          </table>
        </el-tab-pane>
      </template>
      <template v-if="tabsName.AttrDataCount2">
        <el-tab-pane label="文档_附加属性" name="d">
          <table class="isTable">
            <tr>
              <th class="thColor">属性名</th>
              <th class="thColor">属性值</th>
            </tr>
            <tr v-for="(item, index) in DocAttrData" :key="index">
              <td
                class="bgTd"
                @click="openEditAttributes(item, 'Doc')"
                :style="{
                  cursor: item.CanEdit === 'True' ? 'pointer' : 'unset',
                }"
              >
                {{ item.AttrName }}
                <i class="el-icon-edit" v-if="item.CanEdit === 'True'" />
              </td>
              <template v-if="editAttributesData.AttrName !== item.AttrName">
                <td>
                  <span>{{ item.AttrValue }}</span>
                </td>
              </template>
              <template v-else-if="editAttributesData.DataType === 0">
                <td>
                  <span>{{ item.AttrValue }}</span>
                </td>
              </template>
              <!-- 选择日期 -->
              <template v-else-if="editAttributesData.DataType === 5">
                <td>
                  <el-date-picker
                    v-model="editAttributesText"
                    type="date"
                    placeholder="选择日期"
                    @change="EditAttributesHandle(item, 'Doc')"
                    @blur="cancelHandle"
                  ></el-date-picker>
                </td>
              </template>
              <!-- 其他 -->
              <template v-else>
                <td v-if="editAttributesData.ShowData.length !== 0">
                  <el-select
                    v-model="editAttributesText"
                    @change="
                      () => {
                        EditAttributesHandle(item, 'Doc');
                      }
                    "
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in editAttributesData.ShowData"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </td>
                <td v-else>
                  <el-input
                    v-model.trim="editAttributesText"
                    @change="EditAttributesHandle(item, 'Doc')"
                    @keyup.esc.native="cancelHandle"
                    @blur="cancelHandle"
                    v-focus
                  />
                </td>
              </template>
            </tr>
          </table>
        </el-tab-pane>
      </template>
      <template v-if="tabsName.O_filename">
        <el-tab-pane label="文件预览" name="e" v-loading="loading">
          <!-- <template v-if="isPreview">
            <img :src="PreviewImg" alt style="max-width: 100%;" />
            </template>
            <template v-else-if="isPreview === false">
            <iframe :src="PreviewDoc" width="100%" height="99%" frameborder="0" />
            <div id="iframeMask" ref="iframeMask" />
            </template>
            <template v-else>
            <div style="text-align: center;">
                <img src="../../assets/PreviewError.png" alt style="max-width: 100%;" />
                <p>文件暂不支持预览，请直接下载查看</p>
            </div>
                    </template>-->
          <!-- 2020.4.27-2 -->
          <div v-if="!previewAble" style="text-align: center; margin-top: 20px">
            <p>{{ filePreviewTip }}</p>
          </div>
        </el-tab-pane>
      </template>
      <template v-if="tabsName.O_WorkFlowno || tabsName.O_WorkFlowno2">
        <el-tab-pane label="流程" name="f">
          <Process />
        </el-tab-pane>
      </template>
      <template v-if="tabsName.isAdmin">
        <el-tab-pane label="权限列表" name="g">
          <div class="isBtn">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="openPermissionList('Permission')"
              >增加</el-button
            >
            <el-button
              size="small"
              type="primary"
              icon="el-icon-delete"
              @click="openRemoveUser"
              >删除</el-button
            >
            <el-button
              size="small"
              type="primary"
              icon="el-icon-refresh"
              @click="editData"
              >保存</el-button
            >
          </div>
          <h3 style="margin-top: 10px">
            <i class="el-icon-tickets" style="color: #ffbc40"></i> 目录权限
          </h3>
          <el-table
            :data="RightList"
            ref="singleTable"
            style="width: 100%"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              prop="UserName"
              label="用户/用户组"
              width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="AcceObj"
              label="权限所在目录"
              min-width="180"
            />
            <el-table-column label="所有" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.PFull"
                  @change="directoryCheckedAll(scope.$index, scope.row.PFull)"
                />
              </template>
            </el-table-column>
            <el-table-column label="创建" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.PCreate"
                  @change="
                    directoryCheckedCreate(scope.$index, scope.row.PCreate)
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="读" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.PRead"
                  @change="directoryCheckedRead(scope.$index, scope.row.PRead)"
                />
              </template>
            </el-table-column>
            <el-table-column label="写" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.PWrite"
                  @change="
                    directoryCheckedWrite(scope.$index, scope.row.PWrite)
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="删除" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.PDelete"
                  @change="
                    directoryCheckedDelete(scope.$index, scope.row.PDelete)
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="控制" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.PCntrl"
                  @change="
                    directoryCheckedControl(scope.$index, scope.row.PCntrl)
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="无" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.PNone"
                  @change="
                    directoryCheckedCancel(scope.$index, scope.row.PNone)
                  "
                />
              </template>
            </el-table-column>
          </el-table>
          <h3>
            <i class="el-icon-tickets" style="color: #ffbc40"></i> 文档权限
          </h3>
          <el-table
            :data="RightList"
            ref="singleTable2"
            style="width: 100%"
            highlight-current-row
            @current-change="handleCurrentChange2"
          >
            <el-table-column
              prop="UserName"
              label="用户/用户组"
              width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="AcceObj"
              label="权限所在目录"
              min-width="180"
            />
            <el-table-column label="所有" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DFull"
                  @change="fileCheckedAll(scope.$index, scope.row.DFull)"
                />
              </template>
            </el-table-column>
            <el-table-column label="创建" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DCreate"
                  @change="fileCheckedCreate(scope.$index, scope.row.DCreate)"
                />
              </template>
            </el-table-column>
            <el-table-column label="读" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DRead"
                  @change="fileCheckedRead(scope.$index, scope.row.DRead)"
                />
              </template>
            </el-table-column>
            <el-table-column label="写" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DWrite"
                  @change="fileCheckedWrite(scope.$index, scope.row.DWrite)"
                />
              </template>
            </el-table-column>
            <el-table-column label="删除" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DDelete"
                  @change="fileCheckedDelete(scope.$index, scope.row.DDelete)"
                />
              </template>
            </el-table-column>
            <el-table-column label="读文件" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DFRead"
                  @change="fileCheckedReadFile(scope.$index, scope.row.DFRead)"
                />
              </template>
            </el-table-column>
            <el-table-column label="写文件" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DFWrite"
                  @change="
                    fileCheckedWriteFile(scope.$index, scope.row.DFWrite)
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="控制" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DCntrl"
                  @change="fileCheckedControl(scope.$index, scope.row.DCntrl)"
                />
              </template> </el-table-column
            >s
            <el-table-column label="无" width="100" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.DNone"
                  @change="fileCheckedCancel(scope.$index, scope.row.DNone)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </template>
      <!-- 2020.4.20-1 -->
      <template v-if="bos3dModelShow">
        <el-tab-pane label="模型预览" name="h">{{ projectModel }}</el-tab-pane>
      </template>
    </el-tabs>
    <el-dialog title="删除" :visible.sync="removedialogVisible" width="30%">
      <span>是否删除: {{ UserName }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UserApi from "../../api/services/project";
import UserApi3 from "../../api/services/doc";
import { mapGetters } from "vuex";
import { BASE_URL /* VIEW_DOC */ } from "../../const";

export default {
  data() {
    return {
      loading: false,
      // 删除弹窗
      removedialogVisible: false,
      removeData: {},
      UserName: "",
      PermissionData: {
        switch: false,
      },
      editAttributesData: {},
      editAttributesText: "",
      // // 上傳文件名
      // ServerFullFileName: "",
      // 模板
      TemplateData: {
        switch: false,
      },
      // 权限名称
      RightListName: null,
      RightList: [],
      // 文件预览
      // PreviewDoc: "",
      // PreviewImg: "",
      // isPreview: null,
      // UploadFiles: [], //  上传文件列表
      // 该文件可不可以预览
      // 2020.4.27-2
      previewAble: false,
      filePreviewTip: "",
    };
  },
  computed: {
    ...mapGetters("doc", [
      "ProjectKeyWord",
      "ProjectBaseAttr",
      "ProjectAttrData",
      "DocKeyword",
      "DocBaseAttr",
      "DocAttrData",
      "tabsName",
      "activeName",
      "Keyword",
      // 模拟点击右边的预览
      "GotoPreview",
      // 是否开启模型预览
      "bos3dModelShow",
      // 模型名字
      "projectModel",
    ]),
    // 2020.4.15-3
    changePreviewTab() {
      return this.$store.state.doc.GoToPreview;
    },
    activeName2: {
      get() {
        return this.activeName;
      },
      set(e) {
        this.$store.commit("doc/CHANGE_ACTIVENAME", e);
      },
    },
  },
  methods: {
    /* --------------------------------------------------------------- */
    /**
         *  上传文件用的
         * ...state.fileList[i],
            keyword: res.data[0].Keyword,
            O_filename: res.data[0].O_filename,
            serverInfo: res.data[0],
         */
    selectedFile(fileList) {
      if (fileList.length === 1) {
        let file = fileList[0];
        let filename = "";
        let count = 0;
        for (let i in this.DocBaseAttr) {
          if (this.DocBaseAttr[i].AttrCode === "O_itemname") {
            filename = this.DocBaseAttr[i].AttrValue;
            count++;
          }
          if (this.DocBaseAttr[i].AttrCode === "O_itemdesc") {
            if (this.DocBaseAttr[i].AttrValue != "") {
              filename = filename + "__" + this.DocBaseAttr[i].AttrValue;
            }
            count++;
          }
          if (count >= 2) {
            break;
          }
        }
        // filename = filename.split('.')[0]
        if (file.name.split(".").length > 1) {
          filename = filename + "." + file.name.split(".").pop();
        }
        this.$store.dispatch({
          type: "upload/specifyUploadInfo",
          file: {
            ...file,
            docKeyword: this.DocKeyword,
            filename,
            projectKeyword: this.ProjectKeyWord,
          },
        });
      }
    },
    /* --------------------------------------------------------------- */
    // reFiles() {},
    // 切换分页
    handleClick(tab) {
      let vm = this;
      if (tab.name === "a") {
        vm.$store.dispatch("doc/getProjectBaseAttr", vm.ProjectKeyWord);
        this.$store.commit("menu/ISTABLE", true);
        this.$store.commit("AdjustMenuWidth/AM_WIDTH", "");
      } else if (tab.name === "b") {
        vm.$store.dispatch("doc/getProjectAttrData", vm.ProjectKeyWord);
        this.$store.commit("menu/ISTABLE", true);
        this.$store.commit("AdjustMenuWidth/AM_WIDTH", "");
      } else if (tab.name === "c") {
        vm.$store.dispatch("doc/getDocBaseAttr", vm.DocKeyword);
        this.$store.commit("menu/ISTABLE", true);
        this.$store.commit("AdjustMenuWidth/AM_WIDTH", "");
      } else if (tab.name === "d") {
        vm.$store.dispatch("doc/getDocAttrData", vm.DocKeyword);
        this.$store.commit("menu/ISTABLE", true);
        this.$store.commit("AdjustMenuWidth/AM_WIDTH", "");
      } else if (tab.name === "f") {
        vm.$store.dispatch("workflow/getWorkFlow", vm.Keyword);
        this.$store.commit("menu/ISTABLE", true);
        this.$store.commit("AdjustMenuWidth/AM_WIDTH", "");
      } else if (tab.name === "g") {
        if (vm.Keyword === vm.ProjectKeyWord) {
          vm.RightListName = "Project";
          this.$store.commit("menu/ISTABLE", true);
          UserApi.getProjectRightList(vm.ProjectKeyWord).then((res) => {
            let arr = [...res.data];
            arr.pop();
            vm.RightList = arr;
            this.$store.commit("AdjustMenuWidth/AM_WIDTH", "g");
          });
        } else if (vm.Keyword === vm.DocKeyword) {
          vm.RightListName = "Doc";
          this.$store.commit("menu/ISTABLE", true);
          UserApi3.getDocRightList(vm.DocKeyword).then((res) => {
            let arr = [...res.data];
            arr.pop();
            vm.RightList = arr;
            this.$store.commit("AdjustMenuWidth/AM_WIDTH", "g");
          });
        }
      } else if (tab.name === "e") {
        if (vm.Keyword === vm.DocKeyword) {
          this.loading = true;
          // 隐藏右边的
          this.$store.commit("home/ASIDER_HIDE_CONTROL");
          this.PreviewHandle();
        }
      }
      // 2020.4.20-1
      // 上边那个是普通的文件预览，这个是模型预览
      else if (tab.name === "h") {
        this.ModelPreviewHandle();
      }
    },
    // 文件预览
    async PreviewHandle() {
      const res = await UserApi3.previewDoc(this.DocKeyword);
      // 2020.4.27-2
      if (res.success) {
        if (res.data[0].filetype === "common") {
          this.previewAble = true;
        } else {
          this.previewAble = false;
          this.filePreviewTip = "文件暂不支持预览，请直接下载查看";
        }
        if (!res.data[0].filename) {
          // this.isPreview = null;
          this._$isLoading();
          return;
        }
        let arr = res.data[0].filename.split(".");
        let str = arr.pop().toUpperCase();
        if (str === "PDF" || str === "TXT") {
          this.$store.commit("menu/GET_NAVURL", "");
          this.$store.commit("menu/ISPREVIEW", false);
          this.$store.commit("menu/ISTABLE", false);
          this.$store.commit(
            "menu/GET_PREVIEWDOC_URL",
            `${BASE_URL}/${res.data[0].path}`
          );
          // this.isPreview = false;
          // this.PreviewDoc = `${BASE_URL}/${res.data[0].path}`;
        } else if (
          str === "PNG" ||
          str === "JPG" ||
          str === "JPEG" ||
          str === "JPGE"
        ) {
          // this.isPreview = true;
          // this.PreviewImg = `${BASE_URL}/${res.data[0].path}`;
          this.$store.commit("menu/GET_NAVURL", "");
          this.$store.commit("menu/ISPREVIEW", "IMAGE");
          this.$store.commit("menu/ISTABLE", false);
          this.$store.commit(
            "menu/GET_PREVIEWIMG_URL",
            `${BASE_URL}/${res.data[0].path}`
          );
        } else if (
          str === "DOC" ||
          str === "DOCX" ||
          str === "XLSX" ||
          str === "XLS" ||
          str === "PPTX" ||
          str === "PPT"
        ) {
          this.$store.commit("menu/GET_NAVURL", "");
          this.$store.commit("menu/ISPREVIEW", false);
          this.$store.commit("menu/ISTABLE", false);
          this.$store.commit(
            "menu/GET_PREVIEWDOC_URL",
            `${BASE_URL}/${res.data[0].path}`
          );
          // this.isPreview = false;
        } else if (
          str === "MP4" ||
          str === "WMV" ||
          str === "AVI" ||
          str === "MOV"
        ) {
          let RefDocKeyword = "";
          const res2 = await UserApi3.fileDownload(
            this.DocKeyword,
            RefDocKeyword
          );
          this.$store.commit("menu/GET_NAVURL", "");
          this.$store.commit("menu/ISPREVIEW", "VIDEO");
          this.$store.commit("menu/ISTABLE", false);
          this.$store.commit(
            "menu/GET_PREVIEWVIDEO_URL",
            `${BASE_URL}/${res2.data[0].path}`
          );
        } else {
          this.$store.commit("menu/ISPREVIEW", null);
          // this.isPreview = null;
          this._$isLoading();
          return;
        }
        this.$store.commit("AdjustMenuWidth/AM_WIDTH", "e");
        // if (this.PreviewImg) {
        //   this._$isLoading()
        // }
        this._$isLoading();
      } else {
        this.previewAble = false;
        this.filePreviewTip = res.message;
        // this.isPreview = null;
        this._$isLoading();
      }
    },
    // 2020.4.20-1
    // 转到模型预览
    async ModelPreviewHandle() {
      let { modelKey, projectKey } = {
        modelKey: "M1539156846180",
        projectKey: "test",
      };
      if (modelKey && projectKey) {
        this.$store.commit("menu/ISPREVIEW", "MODEL");
        this.$store.commit("menu/ISTABLE", false);
      }
    },
    _$isLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    // 开启删除弹窗
    openRemoveUser() {
      let vm = this;
      if (vm.removeData) {
        let { UserName } = vm.removeData;
        if (UserName) {
          vm.UserName = UserName;
          vm.removedialogVisible = true;
        }
      } else {
        vm.$message({ message: "请选择用户", type: "error" });
      }
    },
    // 删除权限列表 - 用户
    removeUser() {
      let vm = this,
        { UserName } = vm.removeData,
        arr = [...vm.RightList];
      let index = arr.findIndex((item) => item.UserName === UserName);
      if (index !== -1) arr.splice(index, 1);
      vm.RightList = arr;
      vm.UserName = "";
      vm.removeData = {};
      vm.removedialogVisible = false;
    },
    // 保存权限列表
    async editData() {
      let vm = this,
        res = null,
        Keyword = "",
        AttrJson = [];
      vm.RightList.forEach((item) => {
        AttrJson.push({
          ObjectKeyword: item.ObjectKeyWord,
          PFull: item.PFull,
          PCreate: item.PCreate,
          PRead: item.PRead,
          PWrite: item.PWrite,
          PDelete: item.PDelete,
          PCntrl: item.PCntrl,
          PNone: item.PNone,
          DFull: item.DFull,
          DCreate: item.DCreate,
          DRead: item.DRead,
          DWrite: item.DWrite,
          DDelete: item.DDelete,
          DFRead: item.DFRead,
          DFWrite: item.DFWrite,
          DCntrl: item.DCntrl,
          DNone: item.DNone,
        });
      });
      if (vm.RightListName === "Doc") {
        Keyword = vm.DocKeyword;
        res = await UserApi3.setDocRightList(Keyword, AttrJson);
      } else if (vm.RightListName === "Project") {
        Keyword = vm.ProjectKeyWord;
        res = await UserApi.setProjectRightList(Keyword, AttrJson);
      }
      if (res.success) {
        vm.$message({ message: "设置成功", type: "success" });
        this.handleClick({ name: "g" });
      } else {
        vm.$message({ message: "设置失敗", type: "error" });
      }
    },
    // 选择目录权限 用户
    handleCurrentChange(val) {
      this.removeData = val;
      this.$refs.singleTable2.setCurrentRow(val);
    },
    // 选择文档权限 用户
    handleCurrentChange2(val) {
      this.removeData = val;
      this.$refs.singleTable.setCurrentRow(val);
    },
    // 開啟編輯 附加属性
    openEditAttributes(e, type) {
      if (e.CanEdit === "False") return;
      this.editAttributesData = e;
      // 添加用戶 0
      if (e.DataType === 0) {
        this.openPermissionList(type);
      }
    },
    // 開啟用户弹窗
    openPermissionList(e) {
      let arr = [],
        editArr = [],
        { AttrValue } = this.editAttributesData;
      if (AttrValue) {
        arr = AttrValue.split(",");
        for (let i = 0; i < arr.length; i++) {
          editArr.push({
            text: arr[i],
          });
        }
        this.PermissionData.editUserData = editArr;
      }
      this.PermissionData.status = e;
      this.PermissionData.switch = true;
    },
    // 关闭用户弹窗
    rePData(e) {
      this.PermissionData.switch = e;
      this.PermissionData.editUserData = undefined;
    },
    // 用户选择
    async reUser(e) {
      let vm = this;
      if (e[0] !== "Permission") {
        let Keyword = "",
          AttrJson = [],
          res = null;
        AttrJson.push({
          name: this.editAttributesData.AttrCode,
          value: e[1],
          attrtype: "attrData",
        });
        if (e[0] === "Doc") {
          Keyword = vm.DocKeyword;
          res = await UserApi3.updateDocAttr(Keyword, AttrJson);
        } else if (e[0] === "Project") {
          Keyword = vm.ProjectKeyWord;
          res = await UserApi.updateProjectAttr(Keyword, AttrJson);
        }
        if (res.success) {
          vm.$message({ message: "修改完成", type: "success" });
          if (e[0] === "Doc") this.handleClick({ name: "d" });
          else if (e[0] === "Project") this.handleClick({ name: "b" });
        } else {
          vm.$message({ message: "修改失敗", type: "error" });
        }
      } else {
        let a = e[1].split(",");
        let b = e[2].split(",");
        let arr = [...vm.RightList];
        for (let i = 0; i < a.length; i++) {
          let index = arr.findIndex((item) => item.ObjectKeyWord === b[i]);
          if (index === -1) {
            arr.push({
              IsUser: true,
              UserName: a[i],
              ObjectKeyWord: b[i],
              PFull: false,
              PCreate: false,
              PRead: true,
              PWrite: true,
              PDelete: false,
              PCntrl: false,
              PNone: false,
              DFull: false,
              DCreate: false,
              DRead: true,
              DWrite: true,
              DDelete: false,
              DFRead: true,
              DFWrite: false,
              DCntrl: false,
              DNone: false,
              AcceObj: "",
              Enable: true,
              Visible: true,
            });
          } else {
            vm.$message({ message: "有重复用户", type: "error" });
            return;
          }
        }
        this.RightList = arr;
      }
      this.cancelHandle();
    },
    async EditAttributesHandle(e, type) {
      let editText = this.editAttributesText;
      if (e.DataType === 5) {
        editText = String(this.editAttributesText).slice(0, 24);
      }
      let vm = this,
        Keyword = "",
        AttrJson = [],
        res = null;
      AttrJson.push({
        name: e.AttrCode,
        value: editText,
        attrtype: "attrData",
      });
      if (type === "Doc") {
        Keyword = vm.DocKeyword;
        res = await UserApi3.updateDocAttr(Keyword, AttrJson);
      } else if (type === "Project") {
        Keyword = vm.ProjectKeyWord;
        res = await UserApi.updateProjectAttr(Keyword, AttrJson);
      }
      if (res.success) {
        vm.$message({ message: "修改完成", type: "success" });
        if (type === "Doc") vm.handleClick({ name: "d" });
        else if (type === "Project") vm.handleClick({ name: "b" });
      } else {
        vm.$message({ message: "修改失敗", type: "error" });
      }
      vm.cancelHandle();
    },
    cancelHandle() {
      this.editAttributesText = "";
      this.editAttributesData = {};
    },
    // 目录权限
    directoryCheckedAll(index, row) {
      if (row === true) {
        let item = this.RightList[index];
        item.PFull = true;
        item.PCreate = true;
        item.PRead = true;
        item.PWrite = true;
        item.PDelete = true;
        item.PCntrl = true;
        item.PNone = false;
      }
    },
    directoryCheckedCreate(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.PCreate = true;
        item.PRead = true;
        item.PWrite = true;
        item.PNone = false;
      } else {
        item.PFull = false;
      }
    },
    directoryCheckedRead(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.PRead = true;
        item.PNone = false;
      } else {
        item.PFull = false;
        item.PCreate = false;
        item.PRead = false;
        item.PWrite = false;
        item.PDelete = false;
        item.PCntrl = false;
        item.PNone = true;
      }
    },
    directoryCheckedWrite(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.PRead = true;
        item.PWrite = true;
        item.PNone = false;
      } else {
        item.PFull = false;
      }
    },
    directoryCheckedDelete(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.PRead = true;
        item.PWrite = true;
        item.PDelete = true;
        item.PNone = false;
      } else {
        item.PFull = false;
      }
    },
    directoryCheckedControl(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.PRead = true;
        item.PCntrl = true;
        item.PNone = false;
      } else {
        item.PFull = false;
      }
    },
    directoryCheckedCancel(index, row) {
      if (row === true) {
        let item = this.RightList[index];
        item.PFull = false;
        item.PCreate = false;
        item.PRead = false;
        item.PWrite = false;
        item.PDelete = false;
        item.PCntrl = false;
        item.PNone = true;
      }
    },
    // 文档权限
    fileCheckedAll(index, row) {
      if (row === true) {
        let item = this.RightList[index];
        item.DFull = true;
        item.DCreate = true;
        item.DRead = true;
        item.DWrite = true;
        item.DDelete = true;
        item.DFRead = true;
        item.DFWrite = true;
        item.DCntrl = true;
        item.DNone = false;
      }
    },
    fileCheckedCreate(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.DCreate = true;
        item.DRead = true;
        item.DWrite = true;
        item.DNone = false;
      } else {
        item.DFull = false;
      }
    },
    fileCheckedRead(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.DRead = true;
        item.DNone = false;
      } else {
        item.DFull = false;
        item.DCreate = false;
        item.DRead = false;
        item.DWrite = false;
        item.DDelete = false;
        item.DFRead = false;
        item.DFWrite = false;
        item.DCntrl = false;
        item.DNone = true;
      }
    },
    fileCheckedWrite(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.DRead = true;
        item.DWrite = true;
        item.DNone = false;
      } else {
        item.DFull = false;
      }
    },
    fileCheckedDelete(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.DRead = true;
        item.DWrite = true;
        item.DDelete = true;
        item.DFRead = true;
        item.DFWrite = true;
        item.DNone = false;
      } else {
        item.DFull = false;
      }
    },
    fileCheckedReadFile(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.DRead = true;
        item.DFRead = true;
        item.DNone = false;
      } else {
        item.DFull = false;
      }
    },
    fileCheckedWriteFile(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.DRead = true;
        item.DWrite = true;
        item.DFRead = true;
        item.DFWrite = true;
        item.DNone = false;
      } else {
        item.DFull = false;
      }
    },
    fileCheckedControl(index, row) {
      let item = this.RightList[index];
      if (row === true) {
        item.DRead = true;
        item.DCntrl = true;
        item.DNone = false;
      } else {
        item.DFull = false;
      }
    },
    fileCheckedCancel(index, row) {
      if (row === true) {
        let item = this.RightList[index];
        item.DFull = false;
        item.DCreate = false;
        item.DRead = false;
        item.DWrite = false;
        item.DDelete = false;
        item.DFRead = false;
        item.DFWrite = false;
        item.DCntrl = false;
        item.DNone = true;
      }
    },
    // 模板选择
    TemplateHandle(e) {
      this.TemplateData.dialogTitle = "";
      this.TemplateData.type = e;
      this.TemplateData.switch = true;
    },
    // 关闭模板弹窗
    reTData(e) {
      this.TemplateData.switch = e;
      this.TemplateData.type = "";
    },
    async reTemplate(e) {
      let vm = this,
        projectKeyword = "",
        docKeyword = "",
        docAttrJson = [],
        res = null;
      docAttrJson.push({
        name: "tempDefnId",
        value: e.defkeyid,
        attrtype: "",
      });
      if (e.type) {
        if (e.type === "Doc") {
          docKeyword = vm.DocKeyword;
          res = await UserApi3.updateDocAttr(docKeyword, docAttrJson);
        } else if (e.type === "Project") {
          projectKeyword = vm.ProjectKeyWord;
          res = await UserApi.updateProjectAttr(projectKeyword, docAttrJson);
        }
        if (res.success) {
          vm.$message({ message: "修改完成", type: "success" });
          if (e.type === "Doc") this.handleClick({ name: "c" });
          else if (e.type === "Project") this.handleClick({ name: "a" });
        } else {
          vm.$message({ message: "修改失敗", type: "error" });
        }
      }
    },
  },
  watch: {
    // 2020.4.15-3
    changePreviewTab() {
      if (this.tabsName.O_filename) {
        this.activeName2 = "e";
        this.handleClick({ name: "e" });
      }
    },
  },
};
</script>
<style lang="scss">
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
