<template>
  <div>
    <div class="flex-row">
      <el-select
        v-model="archType"
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
      <el-select v-model="type" style="margin-left: 10px" @change="typeChange">
        <el-option
          v-for="(item, index) in typeOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button :disabled="isTrue" type="primary">导出模板</el-button>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :disabled="isTrue"
        :before-upload="beforeUpload"
      >
        <el-button :disabled="isTrue" type="primary">导入</el-button>
      </el-upload>
    </div>
    <el-table
      border
      v-loading="loading"
      :height="tableHeightLocal"
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
import SystemApi from "@/api/services2/system";
export default {
  data() {
    return {
      tableHead: [],
      fileList: [],
      tableList: [],
      type: "",
      archType: "",
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
    type: {
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
    selectChange(e) {
      this.type = "";
      this.getSimpleList();
    },
    typeChange(e) {
      this.getSimpleList();
    },
    beforeUpload(e) {
      this.loading = true;
      setTimeout(() => {
        this.tableHead = [
          { label: "文件题名", fieldName: "title", isMain: 1 },
          { label: "档案号", fieldName: "archNo", isMain: 1 },
          { label: "分类号", fieldName: "categoryNo", isMain: 1 },
          { label: "保管期限", fieldName: "storageTime", isMain: 1 },
          { label: "文件流水号", fieldName: "serialNumber", isMain: 1 },
        ];
        this.tableList = [
          {
            archId: null,
            title: "测试文件题名",
            archNo: "W1-永久-0004",
            categoryNo: "W1",
            archType: null,
            storageTime: "永久",
            serialNumber: "0004",
            status: "数据导入错误",
          },
          {
            archId: "10",
            title: "广州市人民政府建设",
            archNo: "W1-永久-0007",
            categoryNo: "W1",
            storageTime: "永久",
            serialNumber: "0007",
            status: "数据导入错误",
          },
          {
            archId: "0150f237b4e-259a-442a-ba7e-b3444a808791",
            title: "湖南1",
            archNo: "W1-永久-45646",
            storageTime: "永久",
            categoryNo: "W1",
            serialNumber: "45646",
            status: "数据导入错误",
          },
          {
            archId: "0154f982527-76c1-4da6-976c-60cf4b20d54d",
            title: "真实数据文件",
            archNo: "W2-永久-0006",
            storageTime: "永久",
            categoryNo: "W2",
            serialNumber: "0006",
            status: "数据导入错误",
          },
        ];
        this.loading = false;
      }, 2000);
    },
    getSimpleList() {
      let data = {
        archType: this.archType,
        type: this.type,
      };
      SystemApi.getSimpleList(data).then((res) => {
        if (res.code === 200) {
          this.typeOptions = res.data;
        }
      });
    },
  },
  mounted() {
    this.getSimpleList();
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 170;
      return height;
    },
  },
};
</script>

<style scoped>
.upload-demo {
  margin-left: 10px;
}
</style>