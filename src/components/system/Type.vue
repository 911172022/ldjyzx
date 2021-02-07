<template>
  <div>
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane label="分类管理" name="1">
        <div class="btn-box">
          <el-button type="primary" @click="openDialog('add')" size="small"
            >新建分类</el-button
          >
          <el-button type="primary" @click="openDialog('update')" size="small"
            >编辑分类</el-button
          >
          <el-button type="primary" @click="OpenDeleteHandle" size="small"
            >删除分类</el-button
          >
          <el-button type="primary" @click="setCode" size="small"
            >设置档号</el-button
          >
          <el-button type="primary" @click="handleAdd" size="small"
            >编辑自定义字段</el-button
          >
        </div>
        <div class="copyModule">
          <div style="overflow: hidden" class="flex-row">
            <div class="UG-tree">
              <el-tree
                highlight-current
                class="UG-tree-filter Common-Tree-Icon"
                :data="treeData"
                :props="props"
                v-loading="treeLoading"
                @node-click="treeClick"
                node-key="categoryId"
                :default-expanded-keys="[1]"
                :render-content="renderContent"
                @node-contextmenu="contextMenuClickTest"
              ></el-tree>
            </div>
            <div class="UG-table" style="flex: 1">
              <div class="top">
                <div class="table-title">固定字段</div>
                <el-table
                  stripe
                  v-loading="tableLoading"
                  :data="mainList"
                  :height="tableHeightLocal - 270"
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column
                    prop="label"
                    label="标签名"
                  ></el-table-column>
                  <el-table-column
                    prop="fieldName"
                    label="字段名"
                  ></el-table-column>
                </el-table>
              </div>
              <div class="bottom">
                <div class="table-title">自定义字段</div>
                <el-table
                  stripe
                  v-loading="tableLoading"
                  :data="listForm.otherList"
                  :height="tableHeightLocal - 270"
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column
                    prop="label"
                    label="标签名"
                  ></el-table-column>
                  <el-table-column
                    prop="fieldName"
                    label="字段名"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="分类号管理" name="2">
        <el-select
          placeholder="请选择档案类型"
          style="width: 200px; margin-bottom: 5px"
          v-model="archType"
          clearable
          @change="archTypeChange"
          @clear="clear"
          size="small"
        >
          <el-option
            v-for="(item, index) in archTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-table
          :height="tableHeightLocal + 100"
          border
          v-loading="loading"
          :data="tableData"
          stripe
          v-if="activeName == '2'"
        >
          <el-table-column prop="archTypeName" label="档案类型">
          </el-table-column>
          <el-table-column prop="categoryNumber" label="分类号">
          </el-table-column>
          <el-table-column prop="categoryNumberName" label="分类号名称">
          </el-table-column>
          <el-table-column prop="name" label="档案分类"> </el-table-column>
          <el-table-column width="250px">
            <template slot-scope="scope">
              <el-button
                @click="addTypeNum(scope.row)"
                type="primary"
                size="small"
                >添加</el-button
              >
              <el-button
                @click="editTypeNum(scope.row)"
                type="primary"
                size="small"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="deleteTypeNum(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :pagination="pagination"
          @changepage="handlePageChange"
          @sizeChange="handleSizeChange"
          :current-page.sync="pageNum"
        />
      </el-tab-pane>
    </el-tabs>

    <div
      v-if="menuVisible"
      class="rightMenu"
      ref="rightMenu"
      :style="styleObject"
    >
      <ul class="rightMenu-ul">
        <li
          v-for="(item, index) in MenuListFilter"
          :key="index"
          class="rightMenu-li"
          :class="item.State === 'Enabled' ? '' : 'RM-disabled'"
          @click="getMenuRight(item)"
        >
          {{ item.Name }}
        </li>
      </ul>
    </div>

    <!-- 新建分类弹窗 -->
    <el-dialog
      width="40%"
      class="width-25"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      :before-close="resetForm"
      append-to-body
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item>
          <el-checkbox v-model="checked">是否设为一级分类</el-checkbox>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model.trim="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="!isUpdate" label="档案类别" prop="archType">
          <el-select v-model="form.archType" placeholder="请选择">
            <el-option
              v-for="item in archTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isUpdate" label="顺序" prop="orderNum">
          <el-input
            v-model.number="form.orderNum"
            placeholder="请输入"
            autocomplete="off"
          />
          <div>提示:数字顺序从1开始,数字越小排名越前</div>
        </el-form-item>
        <!--  <el-form-item label="分类名称" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!isUpdate"
          type="primary"
          @click="NewType('form', 'add')"
          >提交</el-button
        >
        <el-button v-else type="primary" @click="NewType('form', 'update')"
          >提交</el-button
        >
        <el-button @click="resetForm">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增自定义属性弹窗 -->
    <el-dialog
      width="60%"
      title="自定义属性"
      :visible.sync="typeAttrVisible"
      :before-close="cancel"
      append-to-body
    >
      <el-form :model="listForm" ref="listForm">
        <el-table :data="listForm.otherList" border>
          <el-table-column prop="label" label="标签名">
            <template slot-scope="scope">
              <el-form-item
                :prop="'otherList.' + scope.$index + '.label'"
                v-if="scope.row.edit"
                :rules="rules.label"
              >
                <el-input v-model="scope.row.label" placeholder="请输入" />
              </el-form-item>
              <span v-else>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldName" label="字段名">
            <template slot-scope="scope">
              <el-form-item
                :prop="'otherList.' + scope.$index + '.fieldName'"
                v-if="scope.row.edit"
                :rules="rules.fieldName"
              >
                <el-input v-model="scope.row.fieldName" placeholder="请输入" />
              </el-form-item>
              <span v-else>{{ scope.row.fieldName }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="type" label="字段类型">
            <template slot-scope="scope">
              <el-form-item
                :prop="'otherList.' + scope.$index + '.type'"
                v-if="scope.row.edit"
                :rules="rules.type"
              >
                <el-input
                  v-model="scope.row.type"
                  readonly
                  placeholder="请输入"
                />
              </el-form-item>
              <span v-else>{{ scope.row.type }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="editAttrList(scope)">编辑</el-button>
              <el-button type="danger" @click="deleteAttrList(scope, 1)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <el-button type="text" style="margin-top: 10px" @click="addAttrList"
        >添加数据
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTypeAttr">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增类别号弹窗 -->
    <el-dialog
      width="50%"
      title="类别号"
      :visible.sync="typeNumVisible"
      :before-close="cancel"
      append-to-body
    >
      <el-form :model="form2" ref="form2">
        <el-form-item label="类别号">
          <el-input v-model="form2.categoryNumber" />
        </el-form-item>
        <el-form-item label="类别名称">
          <el-input v-model="form2.categoryNumberName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 设置档号弹窗 -->
    <el-dialog
      width="50%"
      title="档号设置"
      :visible.sync="visible"
      :before-close="cancel"
      append-to-body
    >
      <el-form :model="form3" ref="form3">
        <el-table :data="form3.list" border>
          <el-table-column
            type="index"
            label="序号"
            width="60"
          ></el-table-column>
          <el-table-column prop="label" label="标签名">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit">
                <el-select v-model="scope.row.label" @change="changeNo">
                  <el-option
                    v-for="(item, index) in noList"
                    :key="index"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <span v-else>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="editAttrList(scope)">编辑</el-button>
              <el-button type="danger" @click="deleteAttrList(scope, 2)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <el-button type="text" style="margin-top: 10px" @click="addAttrList2"
        >添加数据
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setArchNo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SystemApi from "../../api/services2/system";

export default {
  data() {
    return {
      form2: {
        categoryNumberId: "",
        categoryId: "",
        categoryNumberName: "",
        categoryNumber: "",
      },
      activeName: "1",

      searchValue: "",
      dialogTitle: "",
      departmentId: "",

      checked: false,
      loading: false,
      treeLoading: false,
      tableLoading: false,
      visible: false,
      isTreeClick: false, //点击了目录树才显示这个按钮

      treeData: [],
      props: {
        children: "list",
        label: "name",
      },
      // 固定字段列表
      mainList: [],
      // 因为提交时要做校验
      listForm: {
        // 额外字段列表
        otherList: [],
      },

      isUpdate: false,

      innerVisible: false,
      typeAttrVisible: false,
      typeNumVisible: false,

      form: {
        name: "",
        type: "",
        orderNum: "1",
        archType: "",
      },
      form3: {
        list: [],
      },
      archTypeOptions: [
        {
          label: "未归",
          value: 0,
        },
        {
          label: "案卷",
          value: 1,
        },
        {
          label: "归档",
          value: 2,
        },
        {
          label: "资料",
          value: 3,
        },
      ],
      typeOptions: [
        {
          label: "目录",
          value: "0",
        },
        {
          label: "档案类别",
          value: "1",
        },
      ],
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        archType: [
          { required: true, message: "请选择档案类别", trigger: "change" },
        ],
        label: [{ required: true, message: "请输入标签名", trigger: "blur" }],
        fieldName: [
          { required: true, message: "请输入字段名", trigger: "blur" },
        ],
        type: [{ required: true, message: "请输入字段类型", trigger: "blur" }],
      },

      tableData: [],
      archType: null,
      pageNum: 1,
      pagination: {
        total: 0,
        pageSize: 20,
      },
      typeNumType: "",
      // 档号类别字段
      noList: [],
      menuVisible: false,
      styleObject: {
        top: 0,
        left: 0,
        opacity: 0,
        position: "fixed",
      },
    };
  },
  computed: {
    ...mapGetters("doc", ["tableHeightLocal"]),
  },
  mounted() {
    this.getTypeTreeList();
    this.getTypeNumList();
  },
  methods: {
    getMenuRight(e) {
      switch (e.Name) {
        case "新建分类":
          this.openDialog("add");
          break;
        case "删除分类":
          this.OpenDeleteHandle();
          break;
        case "编辑分类":
          this.openDialog("update");
          break;
        case "设置档号":
          this.setCode();
          break;
        case "编辑自定义字段":
          this.handleAdd();
          break;
        default:
          break;
      }
    },
    // 取消右键
    foo() {
      // 取消鼠标监听事件
      let vm = this;
      vm.menuVisible = false;
      vm.styleObject.opacity = 0;
      vm.styleObject.top = 0;
      vm.styleObject.left = 0;
      document.removeEventListener("mousedown", vm.foo);
    },
    // 右键功能
    contextMenuClickTest(MouseEvent, object, Node) {
      let vm = this;
      this.menuVisible = false;
      this.menuVisible = true;
      this.treeClick(object);
      this.MenuListFilter = [
        {
          Name: "新建分类",
          State: "Enabled",
          categoryId: object.categoryId,
        },
        {
          Name: "删除分类",
          State: "Enabled",
          categoryId: object.categoryId,
        },
        {
          Name: "编辑分类",
          State: "Enabled",
          categoryId: object.categoryId,
        },
        {
          Name: "设置档号",
          State: "Enabled",
          categoryId: object.categoryId,
        },
        {
          Name: "编辑自定义字段",
          State: "Enabled",
          categoryId: object.categoryId,
        },
      ];
      vm.len = this.MenuListFilter.length * 33;
      vm.styleObject.opacity = 1;

      // 窗口高度
      let windowHeight = document.body.clientHeight;
      // 窗口宽度
      // let windowWidth = document.body.clientWidth

      if (this.MenuListFilter.length === 1) {
        vm.styleObject.top = MouseEvent.clientY - 80 + "px";
        vm.styleObject.left = MouseEvent.clientX + 30 + "px";
      } else {
        // 要注意视窗高度和鼠标点击的y是否能完全容纳menu
        if (windowHeight - MouseEvent.clientY > this.len) {
          this.styleObject.top = MouseEvent.clientY + "px";
        } else {
          this.styleObject.top =
            MouseEvent.clientY -
            (this.len - (windowHeight - MouseEvent.clientY)) +
            "px";
        }

        vm.styleObject.left = MouseEvent.clientX + 30 + "px";
      }
      document.addEventListener("click", vm.foo);
    },
    changeNo(e) {
      this.form3.list.forEach((item) => {
        this.noList.forEach((item2) => {
          if (item.label == item2.label) {
            item.fieldName = item2.fieldName;
          }
        });
      });
    },
    // 类别档号显示
    getArchNo() {
      let data = {
        categoryId: this.departmentId,
      };
      SystemApi.getArchNo(data).then((res) => {
        if (res.code === 200) {
          this.form3.list = res.data;
        }
      });
    },
    // 档号设置
    setArchNo() {
      let data = {
        categoryId: this.departmentId,
        archNoOptionDTO: this.form3.list,
      };
      SystemApi.setArchNo(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("档号设置成功");
          this.cancel();
        }
      });
    },
    // 档号类别字段显示
    archNoList() {
      let data = {
        categoryId: this.departmentId,
      };
      SystemApi.archNoList(data).then((res) => {
        if (res.code === 200) {
          this.noList = res.data;
        }
      });
    },
    setCode() {
      this.visible = true;
      this.archNoList();
      this.getArchNo();
    },
    clear() {
      this.archType = "";
      this.getTypeNumList();
    },
    archTypeChange(e) {
      this.getTypeNumList();
    },
    submit() {
      if (this.typeNumType == "添加") {
        let data = {
          categoryId: this.form2.categoryId,
          categoryNumber: this.form2.categoryNumber,
          categoryNumberName: this.form2.categoryNumberName,
        };
        SystemApi.addTypeNum(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("新增类别号成功");
            this.form2 = {};
            this.cancel();
            this.getTypeNumList();
          }
        });
      }
      if (this.typeNumType == "修改") {
        let data = {
          categoryNumberId: this.form2.categoryNumberId,
          categoryNumber: this.form2.categoryNumber,
          categoryNumberName: this.form2.categoryNumberName,
        };
        SystemApi.editTypeNum(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("修改类别号成功");
            this.form2 = {};
            this.cancel();
            this.getTypeNumList();
          }
        });
      }
    },
    // 新增类别号
    addTypeNum(e) {
      this.typeNumType = "添加";
      this.typeNumVisible = true;
      this.form2.categoryId = e.categoryId;
    },
    editTypeNum(e) {
      this.typeNumType = "修改";
      if (e.categoryNumberName || e.categoryNumber) {
        this.typeNumVisible = true;
        this.form2.categoryNumberId = e.categoryNumberId;
        this.form2.categoryNumberName = e.categoryNumberName;
        this.form2.categoryNumber = e.categoryNumber;
      } else {
        this.$message.error("请先添加分类号和分类名称");
      }
    },
    // 删除类别号
    deleteTypeNum(e) {
      let data = {
        categoryNumberId: e.categoryNumberId,
      };
      SystemApi.deleteTypeNum(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("删除类别号成功");
          this.getTypeNumList();
        }
      });
    },
    // 每页显示数量改变
    handleSizeChange(e) {
      console.log(e);
      this.pagination.pageSize = e;
      this.getTypeNumList();
    },
    // 页码改变
    handlePageChange(e) {
      this.pageNum = e;
      this.getTypeNumList();
    },
    // 查看类别号
    getTypeNumList() {
      let data = {
        archType: this.archType,
        pageSize: this.pagination.pageSize,
        pageNum: this.pageNum,
      };
      this.loading = true;
      SystemApi.getTypeNumList(data).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      });
    },
    cancel() {
      this.typeAttrVisible = false;
      this.typeNumVisible = false;
      this.visible = false;
    },
    editAttrList(e) {
      this.$set(e.row, "edit", true);
    },
    // 新增类别属性
    addTypeAttr() {
      this.$refs.listForm.validate((valid) => {
        if (valid) {
          let data = {
            categoryId: this.departmentId,
            otherList: this.listForm.otherList,
          };
          SystemApi.updateTypeProperty(data).then((res) => {
            console.log(res);
            if (res.code === 200) {
              this.$message.success("新增类别属性成功");
              this.cancel();
            }
          });
        }
      });
    },
    addAttrList() {
      this.listForm.otherList.push({
        label: "",
        fieldName: "",
        type: "textField",
        edit: true,
      });
    },
    addAttrList2() {
      this.form3.list.push({
        label: "",
        fieldName: "",
        edit: true,
      });
    },
    deleteAttrList(e, type) {
      if (type == 1) {
        this.listForm.otherList.splice(e.$index, 1);
      }
      if (type == 2) {
        this.form3.list.splice(e.$index, 1);
      }
    },
    resetForm() {
      this.$refs["form"].resetFields();
      this.innerVisible = false;
    },
    // 点击树状分类获取分类列表
    treeClick(e) {
      this.form.archType = e.archType;
      this.departmentId = e.categoryId;
      if (e.type) {
        // this.isTreeClick = true;
        this.getTypeAttr();
      }
    },
    // 查看类型下的属性
    getTypeProperty() {
      this.tableLoading = true;
      let data = {
        name: "",
        parentId: this.departmentId,
      };
      SystemApi.getTypeProperty(data).then((res) => {
        if (res.code === 200) {
          this.mainList = res.data;
        }
        this.tableLoading = false;
      });
    },
    // 获取分类树列表
    getTypeTreeList() {
      this.treeLoading = true;
      SystemApi.getTypeTreeList().then((res) => {
        if (res.code === 200) {
          this.treeData = res.data.map((item) => {
            let archType = this.filterArchType(item.archType);
            return {
              categoryId: item.categoryId,
              name: `${item.name}(${archType})`,
              list: item.list,
            };
          });
          this.treeLoading = false;
        } else {
          this.treeLoading = false;
        }
      });
    },
    // 新建分类
    NewType(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.checked) {
            this.departmentId = "";
          }
          if (type == "add") {
            let data = {
              parentId: this.departmentId,
              name: this.form.name,
              archType: this.form.archType,
              orderNum: this.form.orderNum,
              type: 1,
            };
            SystemApi.addType(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("新增分类成功");
                this.$refs[formName].resetFields();
                this.innerVisible = false;
                this.getTypeTreeList();
              } else {
                this.$message.success("新增分类失败,", res.message);
              }
            });
          } else {
            let data = {
              name: this.form.name,
              categoryId: this.departmentId,
            };
            SystemApi.updateType(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("修改分类成功");
                this.$refs[formName].resetFields();
                this.innerVisible = false;
                this.getTypeTreeList();
              } else {
                this.$message.success("修改分类失败,", res.message);
              }
            });
          }
        }
      });
    },
    // 删除分类
    OpenDeleteHandle(e) {
      let vm = this;
      if (!vm.departmentId) return vm.prompt("請选择分类", "error");
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          categoryId: vm.departmentId,
        };
        SystemApi.deleteType(data).then((res) => {
          if (res.code === 200) {
            vm.$message.success("删除成功");
            vm.getTypeTreeList();
          } else {
            vm.$message.error("删除失败,", res.message);
          }
        });
      });
    },
    // 新增自定义分类属性
    handleAdd(e) {
      this.typeAttrVisible = true;
      if (this.listForm.otherList === null) {
        this.listForm.otherList = [];
      }
    },
    // 修改分类信息
    openDialog(e) {
      this.innerVisible = true;
      if (e == "add") {
        this.dialogTitle = "新建分类";
        this.isUpdate = false;
      } else {
        this.dialogTitle = "编辑分类";
        this.isUpdate = true;
      }
    },
    // 提示
    prompt(message, type) {
      this.$message({ message, type });
    },
    filterArchType(e) {
      switch (e) {
        case 0:
          return (e = "未归");
        case 1:
          return (e = "案卷");
        case 2:
          return (e = "归档");
        case 3:
          return (e = "资料");
        case 4:
          return (e = "卷内");
        default:
          break;
      }
    },
    // 查看类别属性
    getTypeAttr() {
      this.tableLoading = true;
      let data = {
        categoryId: this.departmentId,
      };
      SystemApi.getTypeAttr(data).then((res) => {
        if (res.code === 200) {
          this.mainList = res.data.mainList;
          this.listForm.otherList = res.data.otherList;
        }
        this.tableLoading = false;
      });
    },
    renderContent(h, { node }) {
      let style = `padding-left: 5px;`;
      return (
        <span class="tree_row">
          <span></span>
          <span style={style}>{node.label}</span>
        </span>
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-box {
  padding-bottom: 10px;
  > button {
    margin: 0 10px;
  }
}

.UG-search {
  background-color: #f2f1f6;
  padding: 10px 20px 5px;
  border-radius: 7px 7px 0 0;
}
.UG-tree {
  border: 2px solid #f2f1f6;
  .UG-tree-filter {
    width: 250px;
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}
.UG-table {
  width: 100%;
  border: 2px solid #f2f1f6;
  .table-title {
    font-size: 16px;
    padding: 5px;
    border-bottom: 1px solid #f2f1f6;
    display: flex;
    justify-content: space-between;
  }
}
.transferBtn {
  i {
    display: block;
    margin-bottom: 10px;
    font-size: 40px;
  }
}
</style>

<style scoped>
.btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 10px;
}
.btn-wrapper .MainBtn {
  margin-bottom: 20px;
}
.btn-wrapper .MainBtn:nth-child(-n + 2) i {
  font-size: 40px;
}
</style>