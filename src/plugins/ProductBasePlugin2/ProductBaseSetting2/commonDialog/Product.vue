<!--
 * @Author: CiFong
 * @Date: 2020-04-30 15:46:08
 * @LastEditors: CiFong
 * @LastEditTime: 2020-08-24 15:00:22
 * @Description: 创建、修改产品弹窗
 -->
<template>
  <div>
    <el-dialog
      :title="dialogObj.title"
      :visible.sync="dialogObj.switch"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="40%"
    >
      <!-- 二级弹窗 - 选择附件 -->
      <SelectAttachment :dialogObj="attachmentData" @reData="reData2" @Attached="attached" />
      <!-- 二级弹窗 - 超链接" -->
      <el-dialog width="30%" title="添加超链接" :visible.sync="innerVisible" append-to-body>
        <el-form
          :model="HyperlinkForm"
          ref="HyperlinkForm"
          :label-position="labelPosition"
          :label-width="labelWidth"
        >
          <el-form-item label="名称:" prop="name">
            <el-input v-model="HyperlinkForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="网址:" prop="hyperlinkAddr">
            <el-input v-model="HyperlinkForm.hyperlinkAddr" placeholder="请输入网址"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" @click="innerVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="addHyperlink">确 定</el-button>
        </span>
      </el-dialog>
      <el-form
        v-loading="formLoading"
        :element-loading-text="loadingText"
        :model="productForm"
        ref="productForm"
        :rules="formRules"
        :label-position="labelPosition"
        :label-width="labelWidth"
      >
        <el-form-item label="产品名称:" prop="title">
          <el-input v-model="productForm.title" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="产品介绍:" prop="intro">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 4 }"
            placeholder="请输入内容"
            v-model="productForm.intro"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品种类:" prop="productTypeId">
          <el-select v-model="productForm.productTypeId" placeholder="请选择">
            <el-option
              v-for="item in productType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业种类:" prop="industryId">
          <el-select v-model="productForm.industryId" placeholder="请选择">
            <el-option
              v-for="item in industry"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业种类:" prop="specialityId">
          <el-select v-model="productForm.specialityId" placeholder="请选择">
            <el-option
              v-for="item in speciality"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌种类:" prop="brandId">
          <el-select v-model="productForm.brandId" placeholder="请选择">
            <el-option
              v-for="item in brand"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户种类:" prop="consumerTypeId">
          <el-select v-model="productForm.consumerTypeId" placeholder="请选择">
            <el-option
              v-for="item in consumerType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="超链接:" prop="Hyperlinks">
          <el-button size="small" type="primary" @click="openHyperlink">选择文件</el-button>
          <el-table
            v-if="productForm.Hyperlinks.length !== 0"
            :data="productForm.Hyperlinks"
            style="width: 100%"
          >
            <el-table-column prop="name" label="文件名" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm
                  title="确定删除吗？"
                  class="delete-button"
                  @onConfirm="delhandleClick(scope.row, scope.$index, 'Hyperlinks')"
                >
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="资料与案例:" prop="Accessories">
          <el-button size="small" type="primary" @click="handleAddAttachment('Accessories')"
            >选择文件</el-button
          >
          <el-table
            v-if="productForm.Accessories.length !== 0"
            :data="productForm.Accessories"
            style="width: 100%"
          >
            <el-table-column prop="name" label="文件名" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm
                  title="确定删除吗？"
                  class="delete-button"
                  @onConfirm="delhandleClick(scope.row, scope.$index, 'Accessories')"
                >
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="产品图:">
          <el-upload
            action="#"
            ref="upload"
            :http-request="httpRequest"
            :on-remove="handleRemove"
            :file-list="productForm.fileList"
            list-type="picture"
            :auto-upload="false"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过97kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('productForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import productApi from "../../../../api/ProductBase2/product";
import accessoryApi from "../../../../api/ProductBase2/accessory";
import hyperlinkApi from "../../../../api/ProductBase2/hyperlink";
import { mapGetters } from "vuex";
import SelectAttachment from "../../../../components/Dialog/SelectAttachment";

export default {
  name: "ProductDialog",
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: () => ({
        switch: false,
        title: "产品",
        status: ""
      })
    }
  },
  data() {
    return {
      // 产品表单样式
      labelWidth: "120px",
      labelPosition: "right",
      loadingText: "加载中...",
      formLoading: false,
      // 二级弹窗 - 选择附件
      attachmentData: {
        switch: false
      },
      innerVisible: false,
      HyperlinkForm: {
        name: "",
        hyperlinkAddr: ""
      },
      // 产品表单
      productForm: {
        title: "",
        intro: "",
        id: "",
        productTypeId: "",
        industryId: "",
        specialityId: "",
        brandId: "",
        consumerTypeId: "",
        Hyperlinks: [],
        Accessories: [], // 资料
        fileList: [
          // {
          //   name: '',
          //   url: ''
          // }
        ]
      },
      delAccessoriesData: [],
      delHyperlinksData: [],
      attachmentStatus: "",
      // 产品表单正则
      formRules: {
        title: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        intro: [{ required: true, message: "请输入产品介绍", trigger: "blur" }],
        productTypeId: [{ required: true, message: "请选择产品种类", trigger: "change" }],
        industryId: [{ required: true, message: "请选择行业种类", trigger: "change" }],
        specialityId: [{ required: true, message: "请选择专业种类", trigger: "change" }],
        brandId: [{ required: true, message: "请选择品牌种类", trigger: "change" }],
        consumerTypeId: [{ required: true, message: "请选择客户种类", trigger: "change" }]
      },
      // 上传附件
      fileName: "",
      ServerFullFileName: "",
      isUploaded: false
    };
  },
  components: {
    SelectAttachment
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getAllTypeList();
          if (newValue.status === "edit") {
            this.formLoading = true;
            this.setProductData();
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters("productLibrary2", [
      "productType",
      "industry",
      "speciality",
      "brand",
      "consumerType"
    ])
  },
  methods: {
    async addHyperlink() {
      this.productForm.Hyperlinks.push({
        name: this.HyperlinkForm.name,
        hyperlinkAddr: this.HyperlinkForm.hyperlinkAddr
      });
      this.innerVisible = false;
    },
    openHyperlink() {
      this.innerVisible = true;
      this.HyperlinkForm.name = "";
      this.HyperlinkForm.hyperlinkAddr = "";
    },
    async setProductData() {
      this.formLoading = false;
      await this.getProductIcon();
      this.$nextTick(() => {
        this.productForm.title = this.dialogObj.data.title;
        this.productForm.intro = this.dialogObj.data.intro;
        this.productForm.id = this.dialogObj.data.id;
        this.productForm.productTypeId = this.dialogObj.data.productTypeId;
        this.productForm.industryId = this.dialogObj.data.industryId;
        this.productForm.specialityId = this.dialogObj.data.specialityId;
        this.productForm.brandId = this.dialogObj.data.brandId;
        this.productForm.consumerTypeId = this.dialogObj.data.consumerTypeId;
        this.productForm.Accessories = this.dialogObj.data.Accessories.map(item => item);
        this.productForm.Hyperlinks = this.dialogObj.data.Hyperlinks.map(item => item);
      });
    },
    async getProductIcon() {
      this.productForm.fileList = [];
      try {
        let id = this.dialogObj.data.id;
        const imgUrl = await productApi.findProductIconByFile(id);
        if (imgUrl.type !== "image/png") return Promise.resolve(false);
        this.productForm.fileList.push({
          name: this.dialogObj.data.title,
          url: window.URL.createObjectURL(imgUrl)
        });
        return Promise.resolve(true);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async httpRequest(file) {
      try {
        let id = this.productForm.id;
        await productApi.updateProductIcon(id, file.file);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleChange(file, fileList) {
      const isLt2M = file.size <= 1024 * 1024 * 2;
      let type = file.raw.type || file.type;
      let isIMG = true;
      if (["image/jpeg", "image/png"].indexOf(type) === -1) {
        isIMG = false;
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2M!");
      }
      if (!isIMG || !isLt2M) {
        fileList.splice(-1, 1);
      }
      return isIMG && isLt2M;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前产品头像限制 1 个文件`);
    },
    // 开启附件弹窗
    handleAddAttachment(status) {
      this.attachmentStatus = status;
      this.attachmentData.switch = true;
    },
    // 选择附件弹窗 - 返回值
    reData2(e) {
      this.attachmentData.switch = e;
    },
    // 选择附件弹窗 - 返回值
    attached(e) {
      let { attachmentStatus } = this;
      e.forEach(item => {
        this.productForm[attachmentStatus].push({
          name: item.O_filename,
          Keyword: item.Keyword
        });
      });
    },
    // 删除附件
    async delhandleClick(row, index, status) {
      this.productForm[status].splice(index, 1);
      if (row.id) {
        if (status === "Accessories") this.delAccessoriesData.push({ id: row.id });
        else if (status === "Hyperlinks") this.delHyperlinksData.push({ id: row.id });
      }
    },
    async delAccessoriesHandle() {
      let data = this.delAccessoriesData;
      for (let i in data) {
        try {
          await accessoryApi.delAccessory(data[i]);
        } catch (error) {
          return Promise.reject(error);
        }
      }
      return Promise.resolve(true);
    },
    async delHyperlinksHandle() {
      let data = this.delHyperlinksData;
      for (let i in data) {
        try {
          await hyperlinkApi.delHyperlink(data[i]);
        } catch (error) {
          return Promise.reject(error);
        }
      }
      return Promise.resolve(true);
    },
    // 获取下拉一级产品种类
    async getAllTypeList() {
      // 获取产品分类
      this.$store.dispatch("productLibrary2/getProductTypeList");
      // 获取行业分类
      this.$store.dispatch("productLibrary2/getIndustryList");
      // 获取专业分类
      this.$store.dispatch("productLibrary2/getSpecialityList");
      // 获取品牌分类
      this.$store.dispatch("productLibrary2/getBrandList");
      // 获取客户分类
      this.$store.dispatch("productLibrary2/getConsumerTypeList");
    },
    // 弹窗 - 确定
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogObj.status === "add") this.addProduct();
          else if (this.dialogObj.status === "edit") this.editProduct();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加产品
    async addProduct() {
      let data = {
        title: this.productForm.title,
        intro: this.productForm.intro,
        productTypeId: this.productForm.productTypeId,
        industryId: this.productForm.industryId,
        specialityId: this.productForm.specialityId,
        brandId: this.productForm.brandId,
        consumerTypeId: this.productForm.consumerTypeId
      };
      try {
        const { id } = await productApi.addProduct(data);
        this.productForm.id = id;
        if (this.productForm.Accessories.length > 0) {
          await this.addAccessory();
        }
        if (this.productForm.Hyperlinks.length > 0) {
          await this.addHyperlinks();
        }
        await this.submitUpload();
        this.openMessage("添加产品成功", "success");
        this.resetForm("productForm");
        this.$emit("reData", true);
      } catch (error) {
        this.openMessage("添加产品失败", "error");
        return Promise.reject(error);
      }
    },
    async addHyperlinks() {
      let { Hyperlinks } = this.productForm;
      for (let i in Hyperlinks) {
        if (Hyperlinks[i].id) continue;
        const { id } = await hyperlinkApi.addHyperlink(Hyperlinks[i]);
        try {
          let obj = {
            hyperlinkId: id,
            productId: this.productForm.id
          };
          await hyperlinkApi.addHyperlinkToProduct(obj);
        } catch (error) {
          return Promise.reject(error);
        }
      }
      return Promise.resolve(true);
    },
    // 编辑产品
    async editProduct() {
      try {
        let data = {
          id: this.productForm.id,
          title: this.productForm.title,
          intro: this.productForm.intro,
          productTypeId: this.productForm.productTypeId,
          industryId: this.productForm.industryId,
          specialityId: this.productForm.specialityId,
          brandId: this.productForm.brandId,
          consumerTypeId: this.productForm.consumerTypeId
        };
        await productApi.editProduct(data);
        if (this.productForm.Accessories.length > 0) {
          await this.addAccessory();
        }
        if (this.productForm.Hyperlinks.length > 0) {
          await this.addHyperlinks();
        }
        if (this.delAccessoriesData.length > 0) {
          await this.delAccessoriesHandle();
        }
        if (this.delHyperlinksData.length > 0) {
          await this.delHyperlinksHandle();
        }
        await this.submitUpload();
        this.openMessage("编辑产品成功", "success");
        this.resetForm("productForm");
        this.$emit("reData", true);
      } catch (error) {
        this.openMessage("编辑产品失败", "error");
      }
    },
    async addAccessory() {
      let { Accessories } = this.productForm;
      for (let i in Accessories) {
        if (Accessories[i].id) continue;
        try {
          let data = {
            name: Accessories[i].name,
            key: Accessories[i].Keyword
          };
          const { id } = await accessoryApi.addAccessory(data);
          try {
            let data2 = {
              accessoryId: id,
              productId: this.productForm.id
            };
            await accessoryApi.addAccessoryToProduct(data2);
          } catch (error) {
            return Promise.reject(error);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
      return Promise.resolve(true);
    },
    // 重置表单、回传父组件开关弹窗
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.productForm.fileList = [];
      this.delAccessoriesData = [];
      this.delHyperlinksData = [];
      this.$emit("reSwitch", false);
    },
    // esc、弹窗上方x、取消按钮 触发
    handleClose() {
      this.formLoading = false;
      this.resetForm("productForm");
    },
    openMessage(message, type) {
      this.$message({ message, type });
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
