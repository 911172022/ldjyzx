<template>
  <div class="search-details">
    <ul class="list" v-infinite-scroll="load" style="overflow: auto">
      <el-card
        class="list-item"
        v-for="(item, index) in tableData"
        :key="index"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="title">{{ item.title }}</div>
            <p>起始号：{{ item.startEndNum }}</p>
            <p>年度：{{ item.year }}</p>
            <p>保管期限：{{ item.storageTime }}</p>
            <p>盒号：{{ item.boxNum }}</p>
          </el-col>
          <el-col :span="12">
            <p>文件路径：档案管理 \ 预归档管理 \ 案卷管理 \ 会计文件</p>
          </el-col>
        </el-row>
      </el-card>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [
        {
          title: "关于2017年1-12月事业在职人员工资的发放表",
          num: "", //全宗号
          year: "2000",
          storageTime: "永久",
          boxNum: "1",
          startEndNum: "094-129室",
        },
        {
          title: "关于2017年1-12月事业离退休人员离退休费的发放表",
          num: "", //全宗号
          year: "1999",
          storageTime: "长期",
          boxNum: "2",
          startEndNum: "130-178室",
        },
      ],
    };
  },
  methods: {
    load() {
      let a = 0;
      console.log(a++);
    },
  },
};
</script>
<style lang="scss">
.search-details {
  padding: 10px;
  .list {
    // height: 300px;
    padding: 0;
    margin: 0;
    list-style: none;
    .list-item {
      margin: 10px;
      .title {
        color: #409eff;
        font-weight: bold;
      }
    }
  }
}
</style>