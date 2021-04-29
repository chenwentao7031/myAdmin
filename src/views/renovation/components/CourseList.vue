<template>
  <el-card shadow="never" style="border-top: 5px solid #eee">
    <div slot="header" class="clearfix">
      <span>{{value.title}}</span>
      <el-link
        type="info"
        style="float: right;"
        :underline="false"
        v-show="value.more"
        :href="value.moreURL.url">查看全部</el-link>
    </div>
    <el-row>
      <template v-if="value.tempList.length" >
        <el-col :span="value.column ? 12:24" v-for="index in value.tempList" :class="value.column ? 'course-item-two' : 'course-item-one'">
            <img src="" style="width: 130px;height: 65px;margin-right: 10px">
            <div class="course-info">
              <div style="font-size: 16px;">xxxxx{{value.column}}</div>
              <div style="font-size: 12px;color: #aaa">财力谢谢谢谢</div>
              <div style="color: red"><span style="margin-right: 3px">$50</span><span>$55</span></div>
            </div>
        </el-col>
      </template>
      <template v-else>
        <div class="none-item">【列表模块】请点击关联数据</div>
      </template>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: 'course-list',
    props: {
      value: Object,
    }
  }
</script>

<style scoped>
  .none-item {
    height: 50px;
    background-color: #eee;
    text-align: center;
    line-height: 50px;
    color: #bbb;
    border: 1px solid #bbb;
  }
  .course-item-one {
    display: flex;
  }
  .el-col{
    margin-bottom: 10px;
  }
  .course-info {
    line-height: 18px;
  }
</style>
