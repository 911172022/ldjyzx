<template>
  <div>
    <div class="flex-row">
      <el-select
        v-model="archType"
        @change="selectChange"
        placeholder="请选择档案类型"
        style="margin-right:10px"
      >
        <el-option
          v-for="(item, index) in archTypeOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="type" placeholder="请选择分类" @change="typeChange">
        <el-option
          v-for="(item, index) in typeOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
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
        label="模板名称"
        prop="name"
        show-overflow-tooltip
        max-width="5%"
        min-width="130"
      ></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button type='danger' @click="del(scope.row)">删除</el-button>
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
      tableList: [{name:"测试模板"}],
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
      loading: false,
    };
  },
  methods: {
    edit(e) {

    },
    del(e){},
    selectChange(e) {
      this.type = "";
      this.getSimpleList();
    },
    typeChange(e) {
      this.getSimpleList();
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