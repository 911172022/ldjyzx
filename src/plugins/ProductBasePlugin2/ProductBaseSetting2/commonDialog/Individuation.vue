<!--
 * @Author: CiFong
 * @Date: 2020-04-30 14:00:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-08-24 15:02:30
 * @Description: 创建、修改个别化弹窗
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
      <el-form
        v-loading="formLoading"
        :element-loading-text="loadingText"
        :model="individuationForm"
        ref="individuationForm"
        :rules="formRules"
        :label-position="labelPosition"
        :label-width="labelWidth"
      >
        <el-form-item label="标题:" prop="title">
          <el-input v-model.trim="individuationForm.title" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="产品经理:" prop="productManager">
          <el-input v-model.trim="individuationForm.productManager" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="所属部门:" prop="department">
          <el-input v-model.trim="individuationForm.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="联系电话:" prop="tel">
          <el-input v-model.trim="individuationForm.tel" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="推荐指数:" prop="recommendRate">
          <el-rate
            v-model="individuationForm.recommendRate"
            :allow-half="true"
            style="height: 40px;line-height: 40px;"
          />
        </el-form-item>
        <el-form-item label="软件价格:" prop="ProductPrice">
          <el-input-number
            v-model="individuationForm.ProductPrice"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="产品特性:" prop="character">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            placeholder="请输入内容"
            v-model="individuationForm.character"
          ></el-input>
        </el-form-item>
        <el-form-item label="竞品分析:" prop="ProductComparison">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            placeholder="请输入内容"
            v-model="individuationForm.ProductComparison"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品图:">
          <el-upload
            action="#"
            ref="upload"
            :http-request="httpRequest"
            :on-remove="handleRemove"
            :file-list="individuationForm.fileList"
            list-type="picture"
            :auto-upload="false"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :limit="6"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过97kb</div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="案例:" prop="CaseAttachment">
          <el-button size="small" type="primary" @click="handleAddAttachment('CaseAttachment')"
            >选择文件</el-button
          >
          <el-table
            v-if="individuationForm.CaseAttachment.length !== 0"
            :data="individuationForm.CaseAttachment"
            style="width: 100%"
          >
            <el-table-column prop="Attachment" label="文件名" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm
                  title="这是一段内容确定删除吗？"
                  class="delete-button"
                  @onConfirm="delhandleClick(scope.row, 'CaseAttachment')"
                >
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="资料:" prop="AdditionalDocument">
          <el-button size="small" type="primary" @click="handleAddAttachment('AdditionalDocument')"
            >选择文件</el-button
          >
          <el-table
            v-if="individuationForm.AdditionalDocument.length !== 0"
            :data="individuationForm.AdditionalDocument"
            style="width: 100%"
          >
            <el-table-column prop="Attachment" label="文件名" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm
                  title="这是一段内容确定删除吗？"
                  class="delete-button"
                  @onConfirm="delhandleClick(scope.row, 'AdditionalDocument')"
                >
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="resetForm('individuationForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('individuationForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import productIndividualityApi from "../../../../api/ProductBase2/productIndividuality";
import SelectAttachment from "../../../../components/Dialog/SelectAttachment";

export default {
  name: "IndividuationDialog",
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: () => ({
        switch: false,
        title: "个别化"
      })
    }
  },
  data() {
    return {
      // 个别化表单样式
      labelWidth: "120px",
      labelPosition: "right",
      formLoading: false,
      loadingText: "加载中...",
      // 二级弹窗 - 选择附件
      attachmentData: {
        switch: false
      },
      // 个别化表单
      individuationForm: {
        title: "", // 个别化标题
        id: "", // 修改时获取产品 ID
        productManager: "", // 产品经理
        department: "", // 所属部门
        tel: "", // 联系电话
        recommendRate: 0, // 推荐指数
        ProductPrice: "", // 软件价格
        character: "", // 产品特性
        ProductComparison: "", // 竞品分析
        CaseAttachment: [], // 案例
        AdditionalDocument: [], // 资料
        productId: "",
        fileList: [
          // {
          //   name: '',
          //   url: ''
          // }
        ]
      },
      delFileList: [],
      // 个别化附件状态: CaseAttachment、AdditionalDocument
      attachmentStatus: "",
      formRules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        productManager: [{ required: true, message: "请输入名称", trigger: "blur" }],
        department: [{ required: true, message: "请输入部门", trigger: "blur" }],
        tel: [{ required: true, message: "请输入电话", trigger: "blur" }],
        ProductPrice: [
          { required: true, message: "请输入软件价格", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (Number(value) > 9999999999) {
                  callback(new Error("已超过价格最大值"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ],
        character: [{ required: true, message: "请输入产品特性", trigger: "blur" }],
        ProductComparison: [{ required: true, message: "请输入竞品分析", trigger: "blur" }]
      }
    };
  },
  components: {
    SelectAttachment
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          if (newValue.status === "edit") {
            this.formLoading = true;
            this.setIndividuationDetail(newValue.data);
          } else if (newValue.status === "add") {
            this.individuationForm.productId = newValue.data.id;
          }
        }
      },
      deep: true
    }
  },
  methods: {
    async httpRequest(file) {
      try {
        let pid = Number(
          this.individuationForm.id
            .toString()
            .split("_")
            .pop()
        );
        await productIndividualityApi.addProductIndividualityByPic(pid, file.file);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      if (file.id) {
        this.delFileList.push({ id: file.id });
      }
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
      this.$message.warning(`当前产品头像限制 6 个文件`);
    },
    // 删除附件
    async delhandleClick(row, status) {
      let index = this.individuationForm[status].findIndex(item => item.Keyword === row.Keyword);
      if (index !== -1) {
        this.individuationForm[status].splice(index, 1);
      }
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
        this.individuationForm[attachmentStatus].push({
          ...item,
          Attachment: item.Title
        });
      });
    },
    // 获取个别化详情
    async setIndividuationDetail(data) {
      this.formLoading = false;
      await this.getProductIcon();
      this.$nextTick(() => {
        this.individuationForm.title = data.title;
        this.individuationForm.id = data.id;
        this.individuationForm.productManager = data.productManager;
        this.individuationForm.department = data.department;
        this.individuationForm.tel = data.tel;
        this.individuationForm.ProductPrice = data.price;
        this.individuationForm.recommendRate = parseFloat(data.recommendRate);
        this.individuationForm.character = data.character;
        this.individuationForm.ProductComparison = data.compatibleProducts;
        this.individuationForm.productId = data.productId;
      });
    },
    async getProductIcon() {
      this.individuationForm.fileList = [];
      try {
        // 个别化ID 获取 图片数组, 在循环请求图片
        let pid = Number(this.dialogObj.data.id.split("_").pop());
        const imgArr = await productIndividualityApi.findProductIndividualityByPid(pid);
        for (let i in imgArr) {
          try {
            const imgUrl = await productIndividualityApi.findProductIndividualityByPic(imgArr[i]);
            if (imgUrl.type !== "image/png") return Promise.resolve(false);
            this.individuationForm.fileList.push({
              name: imgArr[i],
              id: imgArr[i],
              url: window.URL.createObjectURL(imgUrl)
            });
          } catch (error) {
            return Promise.reject(error);
          }
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 弹窗 - 确定
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogObj.status === "add") this.addIndividuation();
          else if (this.dialogObj.status === "edit") this.editIndividuation();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加个别化
    async addIndividuation() {
      // let CaseAttachment = this.individuationForm.CaseAttachment.map(item => item.Keyword).join(
      //   ","
      // );
      // let AdditionalDocument = this.individuationForm.AdditionalDocument.map(
      //   item => item.Keyword
      // ).join(",");
      let data = {
        productId: this.individuationForm.productId,
        title: this.individuationForm.title,
        productManager: this.individuationForm.productManager,
        department: this.individuationForm.department,
        tel: this.individuationForm.tel,
        price: this.individuationForm.ProductPrice,
        recommendRate: this.individuationForm.recommendRate,
        character: this.individuationForm.character,
        compatibleProducts: this.individuationForm.ProductComparison
      };
      try {
        const res = await productIndividualityApi.addproductIndividuality(data);
        this.individuationForm.id = res.id;
        await this.submitUpload();
        this.openMessage("添加行业种类成功", "success");
        this.resetForm("individuationForm");
        this.$emit("reData", true);
      } catch (error) {
        this.openMessage("添加行业种类失败", "error");
      }
    },
    // 编辑个别化
    async editIndividuation() {
      // let CaseAttachment = this.individuationForm.CaseAttachment.map(item => item.Keyword).join(
      //   ","
      // );
      // let AdditionalDocument = this.individuationForm.AdditionalDocument.map(
      //   item => item.Keyword
      // ).join(",");
      let data = {
        id: Number(this.individuationForm.id.split("_").pop()),
        title: this.individuationForm.title,
        productManager: this.individuationForm.productManager,
        updateTime: new Date().toUTCString(), //
        department: this.individuationForm.department,
        tel: this.individuationForm.tel,
        price: this.individuationForm.ProductPrice,
        recommendRate: this.individuationForm.recommendRate,
        character: this.individuationForm.character,
        compatibleProducts: this.individuationForm.ProductComparison,
        productId: this.individuationForm.productId
      };
      try {
        // 这接口不能修改行业一级、二级 要后端改
        await productIndividualityApi.editproductIndividuality(data);
        await this.submitUpload();
        if (this.delFileList.length > 0) await this.deldProductIndividualityByPic();
        this.openMessage("编辑个别化成功", "success");
        this.resetForm("individuationForm");
        this.$emit("reData", true);
      } catch (error) {
        this.openMessage("编辑个别化失败", "error");
      }
    },
    async deldProductIndividualityByPic() {
      for (let i in this.delFileList) {
        try {
          await productIndividualityApi.deldProductIndividualityByPic(this.delFileList[i].id);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    },
    // 重置表单、回传父组件开关弹窗
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.individuationForm.fileList = [];
      this.delFileList = [];
      this.$emit("reSwitch", false);
    },
    // esc、弹窗上方x、取消按钮 触发
    handleClose() {
      this.resetForm("individuationForm");
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
