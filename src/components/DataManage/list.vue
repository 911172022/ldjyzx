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
      <el-select
        v-model="type"
        style="margin-left: 10px"
        @change="typeChange"
        placeholder="请选择分类"
      >
        <el-option
          v-for="(item, index) in typeOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <div class="flex-row">
      <el-input
        style="margin-right: 10px"
        size="small"
        v-model="formInline.searchContent"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        @keyup.enter.native="SearchHandle"
      />
      <el-button size="small" type="primary" @click="searchVisible = true"
        >高级搜索</el-button
      >
      <el-button size="small" type="primary" @click="SearchHandle"
        >查询</el-button
      >
      <el-button size="small" type="primary" @click="resetSearch"
        >清除搜索条件</el-button
      >
      <el-button type="primary" size="small">数据汇总</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableList"
      border
      :height="tableHeightLocal"
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="print(scope.row)"
            >查看</el-button
          >
          <el-button type="danger" size="mini" @click="del(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :pagination="pagination"
      @changepage="pageNum2"
      @sizeChange="changeSize"
      :current-page.sync="currentPage"
    />

    <!-- 高级搜索弹窗 -->
    <el-dialog title="高级搜索" :visible.sync="searchVisible" width="55%">
      <FileForm
        :formList="DocListHead"
        categoryId="15"
        @cancel="fileFormCancel"
        @submitFileForm="submitHighSearch"
      ></FileForm>
    </el-dialog>
  </div>
</template>

<script>
import SystemApi from "@/api/services2/system";

export default {
  data() {
    return {
      DocListHead: [
        { label: "文件题名", fieldName: "title", isMain: 1 },
        { label: "档案号", fieldName: "archNo", isMain: 1 },
        { label: "分类号", fieldName: "categoryNo", isMain: 1 },
        { label: "成文单位", fieldName: "writtenUnit", isMain: 1 },
        { label: "文件编号", fieldName: "fileNo", isMain: 1 },
        { label: "文件时间", fieldName: "fileTime", isMain: 1 },
        { label: "保管期限", fieldName: "storageTime", isMain: 1 },
        { label: "页数", fieldName: "numberOfPages", isMain: 1 },
        { label: "密级", fieldName: "secretLevel", isMain: 1 },
        { label: "文件流水号", fieldName: "serialNumber", isMain: 1 },
        { label: "文件类型", fieldName: "fileType", isMain: 1 },
        { label: "编制单位", fieldName: "bzdw", isMain: 0 },
        { label: "兽人地址", fieldName: "test66", isMain: 0 },
        { label: "测试", fieldName: "abc", isMain: 0 },
        { label: "测试", fieldName: "sss", isMain: 0 },
        { label: "著录人", fieldName: "creatorName", isMain: 1 },
        { label: "著录时间", fieldName: "createTime", isMain: 1 },
      ],
      // 搜索框数据
      formInline: {
        searchContent: "",
      },
      searchVisible: false,
      loading: false,
      tableList: [
        {
          name: "重复数据1",
        },
        {
          name: "重复数据2",
        },
        {
          name: "重复数据3",
        },
      ],
      archType: "",
      type: "",
      pagination: {
        pageSize: 20,
        total: 0,
      },
      currentPage: 1,
      typeOptions: [],
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
    };
  },
  methods: {
    fileFormCancel(e) {
      this.searchVisible = e;
    },
    submitHighSearch(form) {
      this.fileFormCancel();
    },
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
    resetSearch() {},
    SearchHandle() {},
    print(e) {},
    del(e) {},
    pageNum2(e) {
      this.currentPage = e;
      this.getList();
    },
    changeSize(e) {
      this.pagination.pageSize = e;
      this.getList();
    },
    getList() {},
  },
  mounted() {
    this.getSimpleList();
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 270;
      return height;
    },
  },
};
</script>

<style>
</style>