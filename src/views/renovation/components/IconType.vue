<template>
  <div>
    <el-row style="background-color: white">
      <el-col :span="6" style="text-align: center;padding: 10px 0" v-for="(item,index) in value.tempList" :key="index">
        <div style="margin-bottom: 10px">
          <div style="border-radius: 50%;background-color: #4d4d4d;width: 40px; margin:0 auto"><i class="el-icon-user" style="font-size: 40px;color: white"></i></div>
        </div>
        <span>{{item.title}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'icon-type',
    props: {
      value: Object
    }
  }
</script>

<style scoped>
</style>
