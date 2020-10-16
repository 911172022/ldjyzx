<template>
  <div class="file-detail">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="1">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="fileForm" ref="fileForm" label-width="100px">
              <el-form-item label="案卷题名">
                <el-input size="mini" v-model="fileForm.title" />
              </el-form-item>
              <el-form-item label="并列题名">
                <el-input size="mini" />
              </el-form-item>
              <el-form-item label="副题名">
                <el-input size="mini" />
              </el-form-item>
              <el-row :gutter="40">
                <el-col :span="12">
                  <el-form-item label="分类号">
                    <el-input size="mini" />
                  </el-form-item>
                  <el-form-item label="主题词">
                    <el-input size="mini" />
                  </el-form-item>
                  <el-form-item label="页数">
                    <el-input size="mini" v-model="fileForm.pageNum" />
                  </el-form-item>
                  <el-form-item label="录入人">
                    <el-input size="mini" />
                  </el-form-item>
                  <el-form-item label="录入时间" class="date" prop="date">
                    <el-date-picker
                      size="mini"
                      type="date"
                      placeholder="选择时间"
                      v-model="fileForm.date"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="文本项">
                    <el-select v-model="fileForm.textType" size="mini">
                    </el-select>
                  </el-form-item>
                  <el-form-item label="载体类型">
                    <el-select v-model="fileForm.boxType" size="mini">
                    </el-select>
                  </el-form-item>
                  <el-form-item label="类别">
                    <el-select v-model="fileForm.type" size="mini"> </el-select>
                  </el-form-item>
                  <el-form-item label="编制单位">
                    <el-input size="mini" v-model="fileForm.unit" />
                  </el-form-item>
                  <el-form-item label="电子文件">
                    <el-input size="mini" placeholder="文件0份" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="案卷时间" class="date" prop="date">
                    <el-date-picker
                      size="mini"
                      @change="dateChange"
                      type="daterange"
                      placeholder="选择时间"
                      v-model="fileForm.daterange"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="密级">
                    <el-select v-model="fileForm.miji" size="mini">
                      <el-option value="一般" label="一般"></el-option>
                      <el-option value="紧急" label="紧急"></el-option>
                      <el-option value="保密" label="保密"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="案卷类型" prop="fileType">
                    <el-select size="mini" v-model="fileForm.fileType">
                      <el-option label="文书案卷" value="文书案卷"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="全宗号">
                    <el-input size="mini" />
                  </el-form-item>
                  <el-form-item label="保管期限">
                    <el-select size="mini" v-model="fileForm.keepDate">
                      <el-option label="永久" value="永久"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目录号">
                    <el-input size="mini" v-model="fileForm.num" />
                  </el-form-item>
                  <el-form-item label="案卷号">
                    <el-input size="mini" v-model="fileForm.anjuanNum" />
                  </el-form-item>
                  <el-form-item label="份数">
                    <el-input size="mini" v-model="fileForm.fileNum" />
                  </el-form-item>
                  <el-form-item label="编制部门">
                    <el-input size="mini" v-model="fileForm.department" />
                  </el-form-item>
                  <el-form-item label="附注">
                    <el-input size="mini" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="备考表说明">
                <el-input size="mini" type="textarea" :rows="6" />
              </el-form-item>
            </el-form>
            <el-button type="primary">保存</el-button>
          </el-col>
          <el-col :span="12">
            <iframe
              src="http://gyy.fdx360.com/static/sealApplication/1695BE4C97704D0F81C2D21A7FE2D532.pdf"
              frameborder="0"
              style="width: 100%; height: 100vh"
            ></iframe>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="卷内信息" name="2">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column type="selection" width="50"> </el-table-column>
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column
                prop="num"
                label="文件编号"
                width="100"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="title"
                label="题名"
                width="320"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column prop="unit" label="单位" show-overflow-tooltip>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="tableClick(scope.row)"
                    type="text"
                    size="small"
                    >查看</el-button
                  >
                  <el-button type="text" size="small">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
            <Pagination
              :pagination="pagination"
              @changepage="pageNum2"
              :current-page.sync="currentPage"
            />
          </el-col>
          <el-col :span="12">
            <iframe
              src="http://gyy.fdx360.com/static/sealApplication/1695BE4C97704D0F81C2D21A7FE2D532.pdf"
              frameborder="0"
              style="width: 100%; height: 100vh"
            ></iframe>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="电子文件" name="3">
        <div class="tab-top">
          <el-button type="primary" size="small">上传</el-button>
        </div>
        <iframe
          src="http://gyy.fdx360.com/static/sealApplication/1695BE4C97704D0F81C2D21A7FE2D532.pdf"
          frameborder="0"
          style="width: 100%; height: 100vh"
        ></iframe>
      </el-tab-pane>
      <el-tab-pane label="档案日志" name="4">
        <el-steps direction="vertical">
          <el-step
            status="finish"
            title="2020-10-14"
            description="邹粤修改了基本信息"
          ></el-step>
          <el-step
            status="finish"
            title="2020-10-14"
            description="邹粤修改了基本信息"
          ></el-step>
          <el-step
            status="process"
            title="2020-10-14"
            description="邹粤修改了基本信息"
          ></el-step>
        </el-steps>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from "../components/Pagination/index.vue";
export default {
  components: { Pagination },
  data() {
    return {
      // 原型代码
      pagination: {
        pageSize: 1,
        total: 100,
        pageSizes: [10, 20, 30, 50],
      },
      currentPage: 1,
      fileForm: {
        boxType: "",
        textType: "",
        type: "",
        miji: "",
        keepDate: "永久",
        daterange: "",
        pageNum: "10",
        num: "QZ",
        anjuanNum: "004",
        fileNum: "1",
        unit: "广州市教育装备中心",
        department: "",
        serialNum: "",
        date: new Date(),
        fileType: "文书案卷",
        title: "广州市教育装备中心1985-2015年档案利用实例",
      },
      activeName: "1",
      tableData: [
        {
          num: "004",
          title: "广州市教育装备中心1985-2015年档案利用实例",
          unit: "广州市教育装备中心",
        },
        {
          num: "101",
          title: "广州市教育装备中心1985-2015年大事记",
          unit: "广州市教育装备中心",
        },
        {
          num: "008",
          title: "广州市教育装备中心1985-2015年全宗指南",
          unit: "广州市教育装备中心",
        },
      ],
    };
  },
  methods: {
    pageNum2(e) {},
    tableClick(e) {},
    handleClick(tab, event) {
      console.log(tab, event);
    },
    dateChange(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss">
.file-detail {
  .tab-top {
    margin-bottom: 10px;
  }
}
</style>
<style>
.file-detail .el-step.is-vertical {
  min-height: 100px;
}
.file-detail .el-form-item {
  margin-bottom: 0;
}
</style>