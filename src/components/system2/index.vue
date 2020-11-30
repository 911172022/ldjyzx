<template>
  <div class="search-container">
    <div class="nav-menu">
      <div class="nav-menu-item" @click="collection">
        <i class="el-icon-star-off"></i>
        收藏
      </div>
      <div class="nav-menu-item" @click="logout">
        <i class="el-icon-switch-button"></i>
        退出
      </div>
    </div>
    <div class="search-box">
      <el-checkbox v-model="checked" class="checkAll"
        >是否进行全文检索</el-checkbox
      >
      <el-button type="text" @click="advancedSearch"
        >高级检索
        <i :class="isAdvanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </el-button>
      <div class="search-input-box">
        <el-input
          v-model="searchValue"
          placeholder="请输入关键字进行搜索"
          @keyup.enter.native="search"
        >
          <el-button type="primary" slot="append" @click="search"
            >搜索</el-button
          >
        </el-input>
        <!-- <el-input
          v-model="searchValue"
          placeholder="可按关键字模糊搜索,多个关键字用','隔开;展开高级搜索可使用更多搜索条件"
          @keyup.enter.native="search"
        >
          <el-button type="primary" slot="append" @click="search"
            >搜索</el-button
          >
        </el-input> -->
      </div>
      <div v-if="showAll">
        <div class="table-list" v-show="!isAdvanced">
          <div v-if="hasData">
            <el-table
              :height="tableHeightLocal"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              stripe
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column type="index" width="55"> </el-table-column>
              <el-table-column prop="archNo" label="档案号" min-width="120">
              </el-table-column>
              <el-table-column
                prop="title"
                label="文件题名"
                min-width="500"
                show-overflow-tooltip
              >
              </el-table-column>
              <!-- <el-table-column prop="year" min-width="100" label="年度">
              </el-table-column> -->
              <el-table-column>
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    @click="check(scope.row)"
                    size="mini"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              :pagination="pagination"
              @changepage="pageNum2"
              :current-page.sync="currentPage"
            />
          </div>
          <div v-else-if="!hasData" class="search-nothing">
            <span>非常抱歉,找不到和您查询相关的内容或信息</span>
            <p>您可进行下列操作</p>
            <p>1.检查所检索的字词是否为档案的属性</p>
            <p>2.检查批量搜索的多个搜索项之间是否用","隔开</p>
            <p>3.如果关键字模糊搜索没有结果,请尝试高级搜索</p>
          </div>
        </div>
        <!-- 高级检索 -->
        <transition name="el-fade-in-linear">
          <div v-show="isAdvanced" :class="['search-condition', 'file-detail']">
            <div class="select-choose">
              <el-select
                v-model="dataType"
                size="small"
                placeholder="请选择数据管理类型"
              >
                <el-option
                  v-for="item in dataTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-date-picker
                size="small"
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
              <el-select
                @change="fieldChange"
                v-model="fieldType"
                multiple
                collapse-tags
                size="small"
                placeholder="请选择字段"
              >
                <el-option
                  v-for="item in fieldTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="search-tips">
              <i class="el-icon-info"></i>
              <span
                >支持模糊以及批量搜索,多个关键字之间用","隔开,可选择多个搜索条件组合查询,最多可同时设置5个搜索条件</span
              >
            </div>
            <!-- <el-scrollbar> -->
            <el-form
              class="search-detail"
              :model="form"
              ref="form"
              label-width="100px"
            >
              <el-form-item label="案卷题名">
                <el-input size="mini" v-model="form.title" />
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
                    <el-input size="mini" v-model="form.pageNum" />
                  </el-form-item>
                  <el-form-item label="录入人">
                    <el-input size="mini" />
                  </el-form-item>
                  <el-form-item label="录入时间" class="date" prop="date">
                    <el-date-picker
                      size="mini"
                      type="date"
                      placeholder="选择时间"
                      v-model="form.date"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="文本项">
                    <el-select v-model="form.textType" size="mini"> </el-select>
                  </el-form-item>
                  <el-form-item label="载体类型">
                    <el-select v-model="form.boxType" size="mini"> </el-select>
                  </el-form-item>
                  <el-form-item label="类别">
                    <el-select v-model="form.type" size="mini"> </el-select>
                  </el-form-item>
                  <el-form-item label="编制单位">
                    <el-input size="mini" v-model="form.unit" />
                  </el-form-item>
                  <el-form-item label="电子文件">
                    <el-input size="mini" placeholder="文件0份" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="案卷时间" class="date" prop="date">
                    <el-date-picker
                      size="mini"
                      type="daterange"
                      placeholder="选择时间"
                      v-model="form.daterange"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="密级">
                    <el-select v-model="form.miji" size="mini">
                      <el-option value="一般" label="一般"></el-option>
                      <el-option value="紧急" label="紧急"></el-option>
                      <el-option value="保密" label="保密"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="案卷类型" prop="fileType">
                    <el-select size="mini" v-model="form.fileType">
                      <el-option label="文书案卷" value="文书案卷"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="全宗号">
                    <el-input size="mini" />
                  </el-form-item>
                  <el-form-item label="保管期限">
                    <el-select size="mini" v-model="form.keepDate">
                      <el-option label="永久" value="永久"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="目录号">
                    <el-input size="mini" v-model="form.num" />
                  </el-form-item>
                  <el-form-item label="案卷号">
                    <el-input size="mini" v-model="form.anjuanNum" />
                  </el-form-item>
                  <el-form-item label="份数">
                    <el-input size="mini" v-model="form.fileNum" />
                  </el-form-item>
                  <el-form-item label="编制部门">
                    <el-input size="mini" v-model="form.department" />
                  </el-form-item>
                  <el-form-item label="附注">
                    <el-input size="mini" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="备考表说明">
                <el-input size="mini" type="textarea" :rows="6" />
              </el-form-item>
              <el-form-item style="margin-top: 20px">
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
            <!-- </el-scrollbar> -->
          </div>
        </transition>
      </div>
    </div>
    <!-- 档案详情 -->
    <el-drawer
      title="档案详情"
      :visible.sync="fileDetailShow"
      size="90%"
      append-to-body
    >
      <FileDetail
        isSearch
        v-if="fileDetailShow"
        :dataInfo="dataObject"
        @cancel="fileFormCancel"
        @submit="submitFileDetail"
      ></FileDetail>
    </el-drawer>
  </div>
</template>
<script>
import { loginOut } from "@/api/Login";
import ArchivesApi from "@/api/services2/archives";
import ArchivesApi2 from "@/api/services2/archives2";
import ArchivesApi3 from "@/api/services2/archives3";
export default {
  data() {
    return {
      dataObject: {},
      fileDetailShow: false,
      pagination: {
        pageSize: 1,
        total: 30,
      },
      currentPage: 1,
      isAdvanced: false, //判断是否点击高级检索
      checked: false, // 判断是否选择了全文检索
      date: "",
      searchValue: "",
      dataType: "",
      type: "",
      fieldType: [],
      fieldTypeOptions: [
        { value: 0, label: "姓名" },
        { value: 1, label: "性别" },
      ],
      dataTypeOptions: [
        {
          value: 1,
          label: "卷内管理",
        },
        {
          value: 2,
          label: "资料管理",
        },
        {
          value: 3,
          label: "案卷管理",
        },
        {
          value: 4,
          label: "归档管理",
        },
      ],
      typeOptions: [
        {
          value: 0,
          label: "已提交",
        },
        {
          value: 1,
          label: "已退回",
        },
        {
          value: 2,
          label: "已审核",
        },
        {
          value: 3,
          label: "已入库",
        },
      ],
      form: {
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
      hasData: false,
      tableData: [
        {
          archId: "0262cb49ef5-6f85-4077-9c4d-09a0ef96fd2f",
          title: "关于招工工作的报告",
          archNo: "1979-永久-0001",
        },
        {
          archId: "02686941d49-72f8-409a-8cf0-62a572dca0ee",
          title: "请批准到省农、林场招、调广州市上山下乡知青的报告",
          archNo: "1979-永久-0002",
        },
        {
          archId: "0266659188b-e40e-45af-ba6a-1b5ec39977dd",
          title: "广州市劳动局革命委员会文件",
          archNo: "1979-永久-0003",
        },
        {
          archId: "026a16898ac-c79c-46e2-b3ff-27cf4e152075",
          title: "关于下达集团所有制单位招工的通知",
          archNo: "1979-永久-0004",
        },
        {
          archId: "026f097b51a-84de-4e8b-a5eb-093b16691620",
          title: "对几个单位招收下乡知青问题的通知",
          archNo: "1979-短期-0005",
        },
        {
          archId: "026601f239a-924b-4677-9473-5a0a15d6b67f",
          title: "关于在你县招工问题的复函",
          archNo: "1979-短期-0006",
        },
        {
          archId: "026cf4da1b3-ae2e-41d4-baf1-1550dd1a60db",
          title: "关于招工问题的通知",
          archNo: "1979-短期-0007",
        },
        {
          archId: "026db21ca58-4525-400a-a9b6-76488c2492be",
          title: "关于“长临工”转为固定工的上报数字",
          archNo: "1979-短期-0008",
        },
        {
          archId: "026a56e9ea1-0d65-4868-b7ee-5087d7e8469f",
          title: "关于一九七九年毕业留城学生当前能否推荐招工的问题的通知",
          archNo: "1979-短期-0009",
        },
        {
          archId: "0264812eafa-4a05-4d8a-9752-d7f9e02251c7",
          title: "转发省劳动局粤劳配(1979)855号文的通知",
          archNo: "1979-短期-0010",
        },
        {
          archId: "026edbaa700-32b2-47e6-8862-8319a300c6c2",
          title: "复从化县关于就地安置已婚知青报告的函",
          archNo: "1979-短期-0011",
        },
        {
          archId: "026194eb2e9-2d3d-471d-b089-1aba5771d56f",
          title: "关于招收广州市上山下乡知识青年的通知",
          archNo: "1979-短期-0012",
        },
        {
          archId: "026721bd6ab-c99b-4ef3-a878-fb4905be4b57",
          title:
            "转发广东省劳动局《关于一九七九年全民所有制单位招工工作若干问题的通知》的通知",
          archNo: "1979-短期-0013",
        },
        {
          archId: "02689cbeca7-c7ac-466b-8862-d3c485227693",
          title:
            "转发国家劳动总局《关于使用退休、退职人员的待遇问题的通知》的通知",
          archNo: "1979-短期-0014",
        },
        {
          archId: "026f125082b-a2a8-4682-b94a-98aa2e7497d9",
          title: "关于请求解决待业青年承包麓湖土方工程两个突出问题的报告",
          archNo: "1979-短期-0015",
        },
        {
          archId: "026d1ecde89-dac5-4e57-a9a6-88b31fc9ec36",
          title: "广东温泉宾馆五十八名指标的招工安排",
          archNo: "1979-短期-0016",
        },
        {
          archId: "02697d0cb8e-13c1-4a41-ad66-767bb3628094",
          title:
            "转发国家劳动总局《关于贯彻执行中发（1979）43号文件中若干问题的意见的通知》",
          archNo: "1979-短期-0017",
        },
        {
          archId: "026c24d92a0-6a3f-46fa-a9d5-519cc058eea7",
          title: "关于补报优先招调“三种人”申请表的通知",
          archNo: "1979-短期-0018",
        },
        {
          archId: "0263f0649a3-9161-4a32-be0c-13a8837d6b6c",
          title: "关于下乡知识青年回城做计划外临时工问题的请示报告",
          archNo: "1979-短期-0019",
        },
        {
          archId: "026b4aa858a-2482-4312-a3ed-c26f2e9b399f",
          title: "下达市服务局三百二十名招工指标",
          archNo: "1979-短期-0020",
        },
        {
          archId: "026e21c7018-1417-4550-bfcb-0f8cc2b5ba4d",
          title: "关于下达中央、省局全民所有制单位招工安排的通知",
          archNo: "1979-短期-0021",
        },
        {
          archId: "02698436d74-1beb-4c24-944e-539419d48c90",
          title: "关于招工工作的报告",
          archNo: "1979-短期-0022",
        },
        {
          archId: "0268b5d960f-bc2b-4a24-b056-6b78b1696d75",
          title: "关于增加专职武装干部专项指标的通知",
          archNo: "1979-短期-0023",
        },
        {
          archId: "02669729da0-4f0e-4357-a0cc-2b104faebe9b",
          title: "请批准招收两名农民工为农场工人的报告",
          archNo: "1979-短期-0024",
        },
        {
          archId: "026ae887e04-a58e-493e-8017-491d95edb9e3",
          title: "关于下达市银行系统新增劳动力指标的通知",
          archNo: "1979-短期-0025",
        },
        {
          archId: "026be5b394e-c2e3-4d50-a6f7-05178482908d",
          title: "关于下达财政、旅游劳动力指标的通知",
          archNo: "1979-短期-0026",
        },
        {
          archId: "02616446ab6-3cb6-4f18-bafc-c71321477abc",
          title: "关于第一军医大学安置征地农民的请示报告",
          archNo: "1979-短期-0027",
        },
        {
          archId: "0266ca8cf93-ccc0-4692-bde4-c9f36ae26c32",
          title: "关于发回《优先招调“三种人”申请表》给归口单位办理招调工的通知",
          archNo: "1979-短期-0028",
        },
        {
          archId: "0268541361b-2460-4bb0-84c6-5169f572b280",
          title: "关于改进化工有毒有害作业劳动制度扩大试点增加劳动指标的通知",
          archNo: "1979-短期-0029",
        },
        {
          archId: "02640682743-d8cb-42d7-a7f6-19a39e106b7d",
          title: "关于房管局五和水泥厂招工入户问题的函",
          archNo: "1979-短期-0030",
        },
      ],
      tableData2: [
        {
          archId: "0262cb49ef5-6f85-4077-9c4d-09a0ef96fd2f",
          title: "关于招工工作的报告",
          archNo: "1979-永久-0001",
        },
        {
          archId: "02686941d49-72f8-409a-8cf0-62a572dca0ee",
          title: "请批准到省农、林场招、调广州市上山下乡知青的报告",
          archNo: "1979-永久-0002",
        },
        {
          archId: "0266659188b-e40e-45af-ba6a-1b5ec39977dd",
          title: "广州市劳动局革命委员会文件",
          archNo: "1979-永久-0003",
        },
        {
          archId: "026a16898ac-c79c-46e2-b3ff-27cf4e152075",
          title: "关于下达集团所有制单位招工的通知",
          archNo: "1979-永久-0004",
        },
        {
          archId: "026f097b51a-84de-4e8b-a5eb-093b16691620",
          title: "对几个单位招收下乡知青问题的通知",
          archNo: "1979-短期-0005",
        },
        {
          archId: "026601f239a-924b-4677-9473-5a0a15d6b67f",
          title: "关于在你县招工问题的复函",
          archNo: "1979-短期-0006",
        },
        {
          archId: "026cf4da1b3-ae2e-41d4-baf1-1550dd1a60db",
          title: "关于招工问题的通知",
          archNo: "1979-短期-0007",
        },
        {
          archId: "026db21ca58-4525-400a-a9b6-76488c2492be",
          title: "关于“长临工”转为固定工的上报数字",
          archNo: "1979-短期-0008",
        },
        {
          archId: "026a56e9ea1-0d65-4868-b7ee-5087d7e8469f",
          title: "关于一九七九年毕业留城学生当前能否推荐招工的问题的通知",
          archNo: "1979-短期-0009",
        },
        {
          archId: "0264812eafa-4a05-4d8a-9752-d7f9e02251c7",
          title: "转发省劳动局粤劳配(1979)855号文的通知",
          archNo: "1979-短期-0010",
        },
        {
          archId: "026edbaa700-32b2-47e6-8862-8319a300c6c2",
          title: "复从化县关于就地安置已婚知青报告的函",
          archNo: "1979-短期-0011",
        },
        {
          archId: "026194eb2e9-2d3d-471d-b089-1aba5771d56f",
          title: "关于招收广州市上山下乡知识青年的通知",
          archNo: "1979-短期-0012",
        },
        {
          archId: "026721bd6ab-c99b-4ef3-a878-fb4905be4b57",
          title:
            "转发广东省劳动局《关于一九七九年全民所有制单位招工工作若干问题的通知》的通知",
          archNo: "1979-短期-0013",
        },
        {
          archId: "02689cbeca7-c7ac-466b-8862-d3c485227693",
          title:
            "转发国家劳动总局《关于使用退休、退职人员的待遇问题的通知》的通知",
          archNo: "1979-短期-0014",
        },
        {
          archId: "026f125082b-a2a8-4682-b94a-98aa2e7497d9",
          title: "关于请求解决待业青年承包麓湖土方工程两个突出问题的报告",
          archNo: "1979-短期-0015",
        },
        {
          archId: "026d1ecde89-dac5-4e57-a9a6-88b31fc9ec36",
          title: "广东温泉宾馆五十八名指标的招工安排",
          archNo: "1979-短期-0016",
        },
        {
          archId: "02697d0cb8e-13c1-4a41-ad66-767bb3628094",
          title:
            "转发国家劳动总局《关于贯彻执行中发（1979）43号文件中若干问题的意见的通知》",
          archNo: "1979-短期-0017",
        },
        {
          archId: "026c24d92a0-6a3f-46fa-a9d5-519cc058eea7",
          title: "关于补报优先招调“三种人”申请表的通知",
          archNo: "1979-短期-0018",
        },
        {
          archId: "0263f0649a3-9161-4a32-be0c-13a8837d6b6c",
          title: "关于下乡知识青年回城做计划外临时工问题的请示报告",
          archNo: "1979-短期-0019",
        },
        {
          archId: "026b4aa858a-2482-4312-a3ed-c26f2e9b399f",
          title: "下达市服务局三百二十名招工指标",
          archNo: "1979-短期-0020",
        },
        {
          archId: "026e21c7018-1417-4550-bfcb-0f8cc2b5ba4d",
          title: "关于下达中央、省局全民所有制单位招工安排的通知",
          archNo: "1979-短期-0021",
        },
        {
          archId: "02698436d74-1beb-4c24-944e-539419d48c90",
          title: "关于招工工作的报告",
          archNo: "1979-短期-0022",
        },
        {
          archId: "0268b5d960f-bc2b-4a24-b056-6b78b1696d75",
          title: "关于增加专职武装干部专项指标的通知",
          archNo: "1979-短期-0023",
        },
        {
          archId: "02669729da0-4f0e-4357-a0cc-2b104faebe9b",
          title: "请批准招收两名农民工为农场工人的报告",
          archNo: "1979-短期-0024",
        },
        {
          archId: "026ae887e04-a58e-493e-8017-491d95edb9e3",
          title: "关于下达市银行系统新增劳动力指标的通知",
          archNo: "1979-短期-0025",
        },
        {
          archId: "026be5b394e-c2e3-4d50-a6f7-05178482908d",
          title: "关于下达财政、旅游劳动力指标的通知",
          archNo: "1979-短期-0026",
        },
        {
          archId: "02616446ab6-3cb6-4f18-bafc-c71321477abc",
          title: "关于第一军医大学安置征地农民的请示报告",
          archNo: "1979-短期-0027",
        },
        {
          archId: "0266ca8cf93-ccc0-4692-bde4-c9f36ae26c32",
          title: "关于发回《优先招调“三种人”申请表》给归口单位办理招调工的通知",
          archNo: "1979-短期-0028",
        },
        {
          archId: "0268541361b-2460-4bb0-84c6-5169f572b280",
          title: "关于改进化工有毒有害作业劳动制度扩大试点增加劳动指标的通知",
          archNo: "1979-短期-0029",
        },
        {
          archId: "02640682743-d8cb-42d7-a7f6-19a39e106b7d",
          title: "关于房管局五和水泥厂招工入户问题的函",
          archNo: "1979-短期-0030",
        },
      ],
      showAll: false,
    };
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 310;
      return height;
    },
  },
  methods: {
    fileFormCancel(e) {
      this.fileDetailShow = e;
    },
    // 保存档案详情
    submitFileDetail(form) {
      let data = {
        archId: this.archId,
        data: form,
      };
      let vm = this;
      switch (vm.menuType) {
        case 0:
          // 未归
          ArchivesApi.updateArch(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("提交成功");
              this.updateList();
            }
          });
          break;
        case "案卷正式":
          ArchivesApi2.updateArch3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "案卷临时":
          ArchivesApi2.updateArch3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "归档正式":
          ArchivesApi2.updateArch4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "归档临时":
          ArchivesApi2.updateArch4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核案卷":
          // 审核
          ArchivesApi3.updateArch4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核文件":
          ArchivesApi3.updateArch4(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        case "审核资料":
          ArchivesApi3.updateArch3(data).then((res) => {
            if (res.code === 200) {
              this.formList = res.data;
            }
          });
          break;
        default:
          break;
      }
    },
    check(e) {
      this.dataObject = {
        categoryId: 26,
        archId: e.archId,
      };
      this.getFileDetail(this.dataObject);
      this.fileDetailShow = true;
    },
    getFileDetail(data) {
      this.$store.dispatch("doc/getArchInfo2", data);
    },
    pageNum2(e) {},
    fieldChange(e) {
      console.log(e);
    },
    dateChange() {},
    advancedSearch() {
      this.isAdvanced = !this.isAdvanced;
      this.showAll = true;
      this.hasData = true;
    },
    search() {
      let arr = [];
      if (this.searchValue) {
        console.log(1)
        this.tableData.forEach((item) => {
          if (item.title.indexOf(this.searchValue) !== -1) {
            arr.push(item);
            this.hasData = true;
            this.showAll = true;
          } else {
            this.hasData = false;
            this.showAll = true;
          }
        });
        this.tableData = arr;
      } else {
        this.tableData = this.tableData2;
        console.log(0)
        this.hasData = true;
        this.showAll = true;
      }
    },
    collection() {
      const { href } = this.$router.resolve({
        name: "collection",
      });
      window.open(href, "_blank");
    },
    logout() {
      var vm = this;
      vm.$confirm("确认退出吗?", "提示", {}).then(() => {
        loginOut().then((res) => {
          if (res.code === 200) {
            this.$message.success("退出成功");
            this.$store.commit("SET_TOKEN", "");
            localStorage.removeItem("LOGIN");
            this.$router.push("/");
          }
        });
      });
    },
  },
};
</script>
<style lang="scss">
.search-container {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/login/background.png");
  .nav-menu {
    display: flex;
    float: right;
    .nav-menu-item {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      padding: 10px;
      &:hover {
        color: #409eff;
      }
    }
  }
  .search-box {
    width: 1200px;
    margin: 0 auto;
    padding-top: 50px;
    position: relative;
    left: 0;
    top: 0;
    .checkAll {
      margin-right: 15px;
      transition: all 0.5s;
      &:hover {
        color: #409eff;
      }
    }
    .search-input-box {
      display: flex;
      justify-content: space-between;
      button {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
    .table-list {
      position: absolute;
      width: 1200px;
      height: calc(100vh - 250px);
      background-color: #fff;
      .search-nothing {
        width: 400px;
        margin: 0 auto;
        padding-top: 20%;
        span {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
    .search-condition {
      width: 1160px;
      height: calc(100vh - 250px);
      overflow: auto;
      position: absolute;
      z-index: 10;
      background-color: #f0f0f0;
      padding: 20px;
      transition: all 0.5s;
      .select-choose {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 20px;
        justify-content: space-between;
        border-bottom: 1px dashed #409eff;
        .el-select:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
      .search-tips {
        margin: 5px;
        height: 20px;
        padding: 5px;
        color: #409eff;
        background-color: #d9ecff;
        border-radius: 5px;
      }
      .search-detail {
        width: 100%;
      }
    }
  }
}
.fade-enter-active {
  animation: heightShow 0.5s;
}

.fade-leave-active {
  animation: heightShow 0.5s reverse;
}

@keyframes heightShow {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
<style>
.select-choose .el-date-editor.el-input,
.select-choose .el-date-editor.el-input__inner,
.select-choose .el-select {
  width: auto;
}
.file-detail .el-form-item {
  margin-bottom: 0;
}
</style>