<template>
  <div class="pageCss">
    <div class="myNavCss">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <div class="card">
              <div class="left">
                <i class="el-icon-files" />
              </div>
              <div class="right">
                <div class="top">档案总数</div>
                <div class="bottom"><span class="number">7824</span> 件</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div class="card">
              <div class="left">
                <i class="el-icon-files" />
              </div>
              <div class="right">
                <div class="top">我的任务</div>
                <div class="bottom"><span class="number">8</span> 个</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="card-title">档案入库趋势</span>
          </div>
          <div class="boxall" style="margin: 0.375rem">
            <div
              ref="echartLine"
              :style="{ width: '100%', height: '20.2rem' }"
            ></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="card-title">档案分类统计</span>
          </div>
          <div class="boxall" style="margin: 0.375rem">
            <div
              ref="companyPolyline"
              :style="{ width: '100%', height: '20.2rem' }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--项目饼图-->
    <el-row :gutter="20" style="margin: 30px 0">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="card-title">电子文件利用统计</span>
          </div>
          <div
            ref="projectPie"
            :style="{ width: '100%', height: '18rem' }"
          ></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="card-title">案卷占比</span>
            <el-radio-group
              v-model="rukuRadio"
              size="small"
              style="float: right"
            >
              <el-radio-button type="mini" label="未入库"></el-radio-button>
              <el-radio-button type="mini" label="已入库"></el-radio-button>
            </el-radio-group>
          </div>
          <div
            ref="projectPie2"
            :style="{ width: '100%', height: '17rem' }"
          ></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="card-title">各保管期限案卷数量</span>
          </div>
          <div class="boxall" style="margin: 0.375rem">
            <div
              ref="departmentIncExp"
              :style="{ width: '100%', height: '21.4rem' }"
            ></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span>通知公告</span>
          </div>
          <ul class="report">
            <li>
              <div class="top">
                <div class="title">关于五一劳动节放假通知</div>
                <div class="time">2020-04-29</div>
              </div>
              <div class="bottom">
                <div class="desc">五一放假三天</div>
              </div>
            </li>
            <li>
              <div class="top">
                <div class="title">关于国庆中秋放假通知</div>
                <div class="time">2020-09-29</div>
              </div>
              <div class="bottom">
                <div class="desc">放假八天</div>
              </div>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "pc-kanban",
  data() {
    return {
      rukuRadio: null,
      isYellow: false,
      quarter: "",
      year: "",
      month: "",

      select_quarter: [
        { text: "第一季度", value: 1 },
        { text: "第二季度", value: 2 },
        { text: "第三季度", value: 3 },
        { text: "第四季度", value: 4 },
      ],
      select_month: [
        { text: "1月", value: 1 },
        { text: "2月", value: 2 },
        { text: "3月", value: 3 },
        { text: "4月", value: 4 },
        { text: "5月", value: 5 },
        { text: "6月", value: 6 },
        { text: "7月", value: 7 },
        { text: "8月", value: 8 },
        { text: "9月", value: 9 },
        { text: "10月", value: 10 },
        { text: "11月", value: 11 },
        { text: "12月", value: 12 },
      ],
    };
  },
  methods: {
    drawProjectPie2(data) {
      let myChart = this.$echarts.init(this.$refs.projectPie2);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        series: [
          {
            name: "案卷占比",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "55%"],
            avoidLabelOverlap: false,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "20",
                },
              },
            },
            data: [
              {
                name: "类型一",
                value: 10,
              },
              {
                name: "类型二",
                value: 20,
              },
              {
                name: "类型三",
                value: 10,
              },
              {
                name: "类型四",
                value: 20,
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
    },

    drawProjectPie(data) {
      let myChart = this.$echarts.init(this.$refs.projectPie);
      let option = {
        title: {
          text: "电子文件利用统计",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        series: [
          {
            name: "电子文件利用统计",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "55%"],
            avoidLabelOverlap: false,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "20",
                },
              },
            },
            data: [
              {
                name: "下载",
                value: 10,
              },
              {
                name: "预览",
                value: 20,
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
    },
    drawDepartmentHistogram(soucreData) {
      let myChart = this.$echarts.init(this.$refs.departmentIncExp);
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: `各保管期限案卷数量<br>{b}: {c}`,
        },
        grid: {
          top: "50px",
          left: "120px",
          right: "15px",
          bottom: "25%",
        },
        xAxis: [
          {
            type: "category",
            data: ["永久", "短期", "长期", "10年", "30年"],
            verticalAlign: "middle",
            axisLabel: {
              show: true,
            },
          },
        ],
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [10, 60, 30, 40, 20],
            type: "bar",
            itemStyle: {
              color: "#409EFF",
            },
            barMaxWidth: "30%",
          },
        ],
      };
      myChart.setOption(option);
    },
    drawCompanyPolyline(name, data) {
      let myChart = this.$echarts.init(this.$refs.companyPolyline);
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: `档案分类统计<br>{b}: {c}`,
        },
        xAxis: {
          data: ["预归档档案", "未归档档案", "归档档案", "审核中档案"],
          verticalAlign: "middle",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [10, 20, 30, 40],
            type: "bar",
            itemStyle: {
              color: "#409EFF",
            },
            barMaxWidth: "30%",
          },
        ],
        // grid: {
        //   top: "70px",
        //   left: "100px",
        //   right: "15px",
        //   bottom: "50px",
        // },
      };
      myChart.setOption(option);
    },
    drawEchartline(name, data) {
      let myChart = this.$echarts.init(this.$refs.echartLine);
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: `档案入库趋势<br>{b}: {c}`,
        },
        xAxis: {
          data: ["10-15", "10-16", "10-17", "10-18", "10-19", "10-20", "10-21"],
          verticalAlign: "middle",
        },
        yAxis: {
          type: "value",
          name: "单位:件",
        },
        series: [
          {
            data: [50, 80, 70, 90, 60, 40, 70],
            type: "line",
            smooth: true,
          },
        ],
        // grid: {
        //   top: "70px",
        //   left: "100px",
        //   right: "15px",
        //   bottom: "50px",
        // },
      };
      myChart.setOption(option);
    },
  },
  mounted() {
    this.drawProjectPie();
    this.drawProjectPie2();
    this.drawDepartmentHistogram();
    this.drawCompanyPolyline();
    this.drawEchartline();
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  justify-content: space-between;
  .el-icon-files {
    line-height: 1.5;
    color: #2d8cf0;
    font-size: 30px;
  }
  .top {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  .bottom {
    text-align: right;
    font-weight: bold;
    .number {
      font-size: 18px;
    }
  }
}

.report {
  height: 22.1rem;
  overflow: auto;
  li {
    margin: 5px 0;
    border-bottom: 1px dashed #aaa;
  }
  .top {
    display: flex;
    justify-content: space-between;
    transition: 0.5s all;
    line-height: 1.5;
    &:hover {
      background-color: #ddd;
    }
    .title {
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }
    .time {
      font-size: 12px;
      color: #bbb;
    }
  }
  .bottom {
    margin: 5px 0;
    .desc {
      text-indent: 2em;
      font-size: 14px;
    }
  }
}
.pageCss {
  width: 100%;
  overflow: hidden !important;
  .myNavCss {
    margin-bottom: 30px;
  }
  ul {
    list-style: none;
  }
}
.font-white {
  color: #fff;
}
</style>
<style>
.pageCss .el-date-editor.el-input,
.pageCss .el-date-editor.el-input__inner,
.pageCss .el-select {
  width: auto;
}
.pageCSS .el-row {
  width: 100%;
}
</style>