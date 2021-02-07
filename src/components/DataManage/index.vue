<template>
  <div>
    <div class="flex-row">
      <el-select
        v-model="form.archType"
        @change="selectChange"
        placeholder="请选择档案类型"
      >
        <el-option
          v-for="(item, index) in archTypeOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="form.type" style="margin: 0 10px">
        <el-option
          v-for="(item, index) in typeOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="form.warehousingStatus"
        placeholder="请选择导入数据存放的库"
      >
        <el-option label="正式库" value="1">正式库</el-option>
        <el-option label="临时库" value="0">临时库</el-option>
      </el-select>
      <el-button :disabled="isTrue" type="primary" @click="exportExcel"
        >导出模板</el-button
      >
      <el-upload
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :disabled="isTrue"
        :http-request="httpRequest"
      >
        <el-button :disabled="isTrue" type="primary">数据导入</el-button>
      </el-upload>
      <el-upload
        class="upload-demo"
        action="#"
        :show-file-list="false"
        :disabled="isTrue"
        :http-request="httpRequest2"
      >
        <el-button :disabled="isTrue" type="primary">导入附件信息</el-button>
      </el-upload>
    </div>
    <el-table
      border
      v-loading="loading"
      :height="tableHeightLocal + 100"
      :data="tableList"
      highlight-current-row
      stripe
    >
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :prop="item.fieldName"
        :label="item.label"
        show-overflow-tooltip
        max-width="5%"
        min-width="130"
      ></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import DataApi from "@/api/services2/data";
import SystemApi from "@/api/services2/system";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tableHead: [],
      fileList: [],
      tableList: [],
      form: {
        warehousingStatus: "",
        type: "",
        archType: "",
      },
      archTypeOptions: [
        {
          label: "未归",
          value: "0",
        },
        {
          label: "案卷",
          value: "1",
        },
        {
          label: "归档",
          value: "2",
        },
        {
          label: "资料",
          value: "3",
        },
      ],
      typeOptions: [],
      isTrue: true,
      loading: false,
    };
  },
  watch: {
    "form.type": {
      handler(newValue) {
        if (newValue) {
          this.isTrue = false;
        } else {
          this.isTrue = true;
        }
      },
    },
    fileList: {
      handler(newValue) {
        console.log(newValue);
        if (newValue) {
        }
      },
    },
  },
  methods: {
    // 导出模板
    exportExcel() {
      let data = {
        categoryId: this.form.type,
      };
      DataApi.exportExcelModel(data).then((res) => {
        const a = document.createElement("a");
        a.setAttribute("target", "_blank");
        a.setAttribute("href", res.data);
        a.setAttribute("download", "数据导出");
        a.click();
      });
    },
    selectChange(e) {
      this.type = "";
      this.getList();
    },
    httpRequest(e) {
      if (!this.form.warehousingStatus) {
        this.$message.error("请选择导入数据存放的库");
        return false;
      }
      let data = {
        file: e.file,
        categoryId: this.form.type,
        warehousingStatus: this.form.warehousingStatus,
      };
      DataApi.importExcel(data).then((res) => {
        this.$message.success("数据导入成功");
      });
    },
    httpRequest2(e) {
      let data = {
        file: e.file,
        categoryId: this.form.type,
      };
      DataApi.importExcel2(data).then((res) => {
        this.$message.success("导入附件信息成功");
      });
    },
    // 获取分类
    getList() {
      let data = {
        archType: this.form.archType,
        categoryId: this.form.type,
      };
      SystemApi.getSimpleList(data).then((res) => {
        this.typeOptions = res.data;
      });
    },
  },
  mounted() {
    // this.getList();
  },
  computed: {
    ...mapGetters("doc", ["tableHeightLocal"]),
  },
};
</script>

<style scoped>
.upload-demo {
  margin-left: 10px;
}
</style>