<template>
  <div>
    <div>
      <tinymce :value="value" @input="$emit('input',$event)" :height="400" :width="600"/>
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
      value: ''
    }

  }
</script>

<style scoped>
</style>

