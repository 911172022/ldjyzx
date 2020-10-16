<!--
 * @Author: CiFong
 * @Date: 2020-04-29 20:52:19
 * @LastEditors: CiFong
 * @LastEditTime: 2020-04-30 17:33:31
 * @Description: 请输入
 -->
<template>
  <div id="Product">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-container>
        <el-main>
          <ProductBasePlugin />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from '@/components/Home/Header.vue'
import ProductBasePlugin from '../plugins/ProductBasePlugin'

export default {
  components: {
    Header,
    ProductBasePlugin
  }
}
</script>
<style lang="scss" scoped>
#Product {
  width: 100%;
  height: 100%;
  line-height: normal;
  position: relative;
  overflow-y: hidden;
  .el-container {
    background-color: #f5f6fa;
    height: 100%;
    .el-header {
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 999;
      padding: 0;
      box-sizing: content-box;
    }
    .el-container {
      height: calc(100% - 60px);
      margin-top: 60px;
      .el-aside {
        padding: 15px;
        background-color: #fff;
      }
      .el-aside#left {
        overflow: inherit;
        padding-right: 0;
        border-right: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .el-col-22 {
          width: calc(100% - 40px);
        }
        .el-col-1 {
          width: 20px;
          #resize {
            display: block;
            font-size: 16px;
            width: 10px;
            cursor: w-resize;
            padding-top: 380px;
          }
        }
      }
      .el-main {
        background-color: #fff;
        margin: 15px;
        border-right: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .el-aside#right {
        padding-left: 0;
        border-left: 1px solid #ebeef5;
        box-shadow: -2px 0 12px 0 rgba(0, 0, 0, 0.1);
        .el-row.right_position {
          position: static;
        }
        .el-col-22 {
          width: calc(100% - 40px);
        }
        .el-col-1 {
          width: 20px;
          #resize2 {
            display: block;
            font-size: 16px;
            width: 10px;
            cursor: w-resize;
            padding-top: 380px;
          }
        }
      }
    }
  }
}
</style>
