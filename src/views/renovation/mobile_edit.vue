<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="card-container">
          <div slot="header" class="clearfix" style="padding: 0">
            <div>组件列表</div>
            <span style="color:#bbb;font-size: 12px">点击组件，添加至页面</span>
          </div>
          <div>
            <el-row :gutter="15">
              <el-col :span="12" v-for="item in btnList" :key="item.type">
                <el-card shadow="hover" @click.native="addModel(item.type)" class="model-btn">
                  <i :class="item.icon"></i><span>{{item.content}}</span>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{padding:'0'}" class="card-container">
          <div class="center-box-top-img"></div>
          <div
            v-for="(item,index) in list"
            :key="item.id"
            :class="{'model-item': true, 'model-item-edit': item.isEdit }"
            @click="addClass(item)">
            <div v-if="item.isEdit" class="model-item-icon">
              <i :class="{'el-icon-top': true, 'i-disabled': !index }"
                 @click="index ? handlePrev(item,index) : null "></i>
              <i :class="{'el-icon-bottom': true, 'i-disabled': index===list.length-1 }"
                 @click="index===list.length-1 ?  null :  handleNext(item,index) "></i>
              <i class="el-icon-delete" @click="handleDel(index) "></i>
            </div>
            <component :is="item.type" :value="item.data.value"></component>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :offset="4">
        <el-card>
          xxx
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import SearchInput from './components/SearchInput'

  export default {
    name: 'mobile_edit',
    data () {
      return {
        list: [],
        btnList: [
          {
            type: 'course',
            icon: 'el-icon-s-order',
            content: '课程列表'
          },
          {
            type: 'search',
            icon: 'el-icon-search',
            content: '搜索框'
          },
          {
            type: 'swiper',
            icon: 'el-icon-s-help',
            content: '轮播图'
          },
          {
            type: 'icon',
            icon: 'el-icon-menu',
            content: '图标分类'
          },
          {
            type: 'sale',
            icon: 'el-icon-s-finance',
            content: '优惠券'
          },
          {
            type: 'group',
            icon: 'el-icon-s-order',
            content: '限时拼团'
          },
          {
            type: 'img',
            icon: 'el-icon-picture',
            content: '图片广告'
          }
        ]
      }
    },
    methods: {
      addModel (type) {
        console.log(111)
        if (type === 'course') {
          this.list.push({
            isEdit: false,
            id: Date.now(),
            type: 'SearchInput',
            data: {
              value: undefined
            }
          })
        }
      },
      addClass (item) {
        this.list.forEach(item => item.isEdit = false)
        item.isEdit = true
      },
      handlePrev (item, index) {
        this.list.splice(index, 1)
        this.list.splice(index - 1, 0, item)
      },
      handleNext (item, index) {
        this.list.splice(index, 1)
        this.list.splice(index + 1, 0, item)
      },
      handleDel (index) {
        this.list.splice(index, 1)
      }
    },
    components: {
      SearchInput
    }
  }
</script>

<style scoped>
  .app-container {
    background-color: #eee;
  }

  .el-col {
    margin-bottom: 15px;
  }

  .card-container {
    height: 80vh;
    overflow: inherit;
  }

  .model-btn {
    display: flex;
    align-items: center;
    color: green;
    font-size: 24px;
    cursor: pointer;
  }

  .model-btn span {
    font-size: 14px;
    color: #222;
    margin-left: 5px;
  }

  .center-box-top-img {
    height: 20px;
    background-color: #3A71A8;
  }

  .model-item {
    position: relative;
    cursor: pointer;
  }

  .model-item-edit {
    padding: 5px 0;
    border: 2px dotted #1f2d3d;
    margin-bottom: 10px;
  }

  .model-item-icon {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    /*height: 75%;*/
    height: 70px;
    padding: 5px 2px;
    margin-right: -25px;
    margin-top: -2px;
    font-size: 18px;
    color: #409EFF;
    background-color: white;
    border: 2px dotted #1f2d3d;
    border-left: none;
    /*z-index: 1000;*/
  }

  .i-disabled {
    color: #bbb;
    cursor: no-drop;
  }
</style>
