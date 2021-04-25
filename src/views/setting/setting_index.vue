<template>
  <el-card shadow="never">
    <div slot="header" class="clearfix">
      <span>店铺设置</span>
    </div>
    <div>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="店铺名称">
         <div style="display: flex;border-bottom: 1px solid #eee; justify-content: space-between;padding: 0 40px 0 20px">
           <div>王小二的店铺</div>
           <el-button type="text">设置</el-button>
         </div>
        </el-form-item>
        <el-form-item label="店铺地址"  >
          <div style="display: flex;border-bottom: 1px solid #eee; justify-content: space-between;padding: 0 40px 0 20px">
            <div>https://appkIpg1do32080.h5.xxxxx.com</div>
            <el-button type="text">复制地址</el-button>
          </div>
        </el-form-item>
        <el-form-item label="店铺管理员">
          <div style="display: flex;border-bottom: 1px solid #eee; justify-content: space-between;padding: 0 40px 0 20px">
            <div>156****2873</div>
          </div>
        </el-form-item>
        <el-form-item label="店铺appid">
          <div style="display: flex;border-bottom: 1px solid #eee; justify-content: space-between;padding: 0 40px 0 20px">
            <div>appkIpg1do32080</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: 'setting_index',
    data(){
      return {
        temp: {}
      }
    }
  }
</script>

<style scoped>

</style>
