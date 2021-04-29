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
            <!--{{item.data.title}}-->
            <component :is="item.type" :value="item.data"></component>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :offset="4" v-show="activeName">
        <el-card class="card-container" :body-style="{padding:'0'}" >
          <div slot="header" class="clearfix">组件编辑</div>
          <el-form ref="form" :model="temp" label-width="80px" >
            <template v-if="activeName === 'SearchInput'">
              <el-form-item label="占位提示">
                <el-input v-model="temp.value" size="mini"></el-input>
              </el-form-item>
            </template>
            <template v-else-if="activeName=== 'CourseList'">
              <el-form-item label="类型">
                <el-radio-group v-model="temp.column">
                  <el-radio :label="0">单行</el-radio>
                  <el-radio :label="1">双行</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="标题">
                <el-input v-model="temp.title" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="更多">
                <el-radio-group v-model="temp.more">
                  <el-radio :label="true">显示</el-radio>
                  <el-radio :label="false">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="更多链接">
                <el-button size="mini">{{temp.moreURL.title}}</el-button>
              </el-form-item>
              <el-form-item label-width="0px">
                <div class="course-form-add">
                  <div @click="FormAddCourse" style="cursor: pointer"><i class="el-icon-circle-plus-outline" style="color: #409EFF;margin-right: 4px;margin-bottom: 15px"></i>关联课程
                  </div>
                  <div>最多关联10门</div>
                </div>
              </el-form-item>
              <el-form-item label-width="0px">
                <ul ref="courselistRef" class="course-form-list" >
                  <li v-for="(course, index) in temp.tempList" :key="index">
                    <!--<img src="" alt="">-->
                    <div class="course-form-list-item">
                      <div style="width: 100px;height: 50px; background-color: #888;margin-right: 5px">img</div>
                      <div>{{course.title}}</div>
                    </div>
                    <i class="el-icon-delete" @click="FormDelCourse(index)"></i>
                  </li>
                </ul>
              </el-form-item>

            </template>
            <template v-else-if="activeName === 'SwiperSlider'">
              <el-form-item label-width="0px">
                <div class="course-form-add">
                  <div @click="FormAddImg" style="cursor: pointer">
                    <i class="el-icon-circle-plus-outline" style="color: #409EFF;margin-right: 4px;margin-bottom: 15px"></i>
                    新增轮播图
                  </div>
                  <div>最多5张</div>
                </div>
              </el-form-item>
             <el-form-item label-width="0px">
               <ul style="overflow-y: auto" ref="imgRef">
                <li v-for="(item, index) in temp.tempList" :key="index" style="text-align: center">
                  <div style="height: 150px;background-color: #aaa"></div>
                  <el-select v-model="item.hrefType" placeholder="商品状态" clearable style="margin: 15px 0" >
                    <el-option label="关联课程" value="course" />
                    <el-option label="网页跳转" value="url" />
                  </el-select>
                  <div v-if="item.hrefType">
                    <div v-if="item.hrefType==='course'" ><el-button type="primary" size="mini">关联课程</el-button></div>
                    <div v-else><el-input placeholder="请输入要跳转的路径" style="width: 200px" size="mini"></el-input></div>
                  </div>
                </li>
               </ul>
             </el-form-item>
            </template>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import SearchInput from './components/SearchInput'
  import CourseList from './components/CourseList'
  import SwiperSlider from './components/SwiperSlider'
  import IconType from './components/IconType'
  import Onsale from './components/OnSale'
  import FlashGrop from './components/FlashGroup'
  import ImgAdv from './components/ImgAdv'
  import Sortable from 'sortablejs'

  export default {
    name: 'mobile_edit',
    data () {
      return {
        list: [],
        btnList: [
          {
            type: 'CourseList',
            icon: 'el-icon-s-order',
            content: '课程列表'
          },
          {
            type: 'SearchInput',
            icon: 'el-icon-search',
            content: '搜索框'
          },
          {
            type: 'SwiperSlider',
            icon: 'el-icon-s-help',
            content: '轮播图'
          },
          {
            type: 'IconType',
            icon: 'el-icon-menu',
            content: '图标分类'
          },
          {
            type: 'OnSale',
            icon: 'el-icon-s-finance',
            content: '优惠券'
          },
          {
            type: 'FlashGroup',
            icon: 'el-icon-s-order',
            content: '限时拼团'
          },
          {
            type: 'ImgAdv',
            icon: 'el-icon-picture',
            content: '图片广告'
          }
        ],
        activeName: null,
        temp: {moreURL:{}},
        sortable: null,
        oldList: [],
        newList: []
      }
    },
    watch: {
      list: {
        handler (val) {
          let obj = val.find(item => item.isEdit)
          if (obj && obj.isEdit) {
            return this.activeName = obj.type
          }
          return null
        },
        deep: true
      },
      activeName () {
        let index = this.list.findIndex(item => item.isEdit)
        this.temp = Object.assign({}, this.resetTemp(),  this.list[index].data)
        if(this.activeName === 'CourseList'){
          this.oldList = this.temp.tempList.map(v => v)
          this.newList = this.oldList.slice()
          this.$nextTick(() => {
            console.log(this.$refs)
            this.setSort(this.$refs.courselistRef)
          })
        }else if (this.activeName === 'SwiperSlider'){
          this.oldList = this.temp.tempList.map(v => v)
          this.newList = this.oldList.slice()
          this.$nextTick(() => {
            console.log(this.$refs)
            this.setSort(this.$refs.imgRef)
          })
        }
      },
      temp: {
        deep: true,
        handler (val) {
          let index = this.list.findIndex(item => item.isEdit)
          this.list[index].data = val
        }
      }
    },
    methods: {
      addModel (type) {
        let id = Date.now()
        let data = this.resetTemp(type)
        let obj = { isEdit: false, id, type, data }
        this.list.push(obj)
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
      },
      FormAddCourse(){
        if( this.temp.tempList.length < 10){
          this.temp.tempList.push({title: Date.now()})
        }
      },
      FormDelCourse(index){
        this.temp.tempList.splice(index,1)
      },
      FormAddImg(){
        if(this.temp.tempList.length <5){
          this.temp.tempList.push({url: Date.now()})
        }
      },
      resetTemp (type = this.activeName) {
        switch (type) {
          case 'CourseList':
            return { tempList: [], title: '最新列表', column: 0, more: true, moreURL: { title: '选择页面', url: '' } }
            break
          case 'SearchInput':
            return { value: '请输入搜索关键词' }
            break
          case 'SwiperSlider':
            return { tempList: [] }
            break
          case 'IconType':
            return {}
            break
          case 'Onsale':
            return {}
            break
          case 'FlashGroup':
            return {}
            break
          case 'ImgAdv':
            return {}
            break
          default:
            return {}
            break
        }
      },
      setSort(el) {

        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const targetRow =this.temp.tempList.splice(evt.oldIndex, 1)[0]
            this.temp.tempList.splice(evt.newIndex, 0, targetRow)

            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      }
    },
    components: {
      SearchInput, CourseList, SwiperSlider, Onsale,IconType, ImgAdv,FlashGrop
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
    /*overflow-y: auto;*/
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

  .course-form-add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dotted #222;
    height: 75px;
    text-align: center;
    color: #bbb;
    font-size: 14px
  }
  ul{
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .course-form-list > li{
    position: relative;
    padding: 5px 10px;
    margin-bottom: 5px;
    background-color: #eee;
  }
  .course-form-list-item {
    display: flex;
    cursor: pointer;
  }
  .course-form-list .el-icon-delete {
    position: absolute;
    right: 10px;
    bottom: 5px;
    color: #a13e0d;
    cursor: pointer;
  }

  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
</style>
