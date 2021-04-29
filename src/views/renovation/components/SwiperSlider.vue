<template>
  <div>
    <template v-if="!value.tempList.length">
      <div style="height: 48px;border: 1px solid #bbb;background-color: #eee;text-align: center;line-height: 50px;color: #aaa">
        【轮播图模块】请点击关联数据
      </div>
    </template>
    <template v-else>
        <el-carousel height="150px">
          <el-carousel-item v-for="(item, index) in value.tempList" :key="index" style="background-color: #bbb">
            <h3 class="small">{{ index }}</h3>
          </el-carousel-item>
        </el-carousel>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'swiper-slider',
    props: { value: Object }
  }
</script>

<style scoped>

</style>
