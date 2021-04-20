<template>
  <div>
    <div>
      <tinymce @input="onchange" :height="400" :width="600"/>
    </div>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'RichText',
    components: { Tinymce },
    props:{
      content: String,
      onchange: Function
    }

  }
</script>

<style scoped>
</style>

