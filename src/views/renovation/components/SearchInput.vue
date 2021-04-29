<template>
  <div style="padding: 10px;font-size: 16px;color: #666">
    <div style="background-color: #feeeee; text-align: center; line-height: 40px; border: 1px solid #eee">
      <i class="el-icon-search" ></i> <span>{{value.value}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'search-input',
    props: {
      value: Object
    }
  }
</script>

<style scoped>

</style>
