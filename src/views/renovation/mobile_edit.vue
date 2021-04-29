<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="card-container">
          <div slot="header" class="clearfix" style="padding: 0">
            <div>组件列表</div>
            <span style="color:#bbb;font-size: 12px">点击组件，添加至页面</span>
          </div>
          <div >
            <el-row :gutter="15">
              <el-col :span="12" >
                <el-card shadow="hover" @click.native="addModel('course')" class="model-btn" >
                  <div>课程里表</div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover"  @click.native="addModel('course')" class="model-btn">
                  课程列表
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-card shadow="hover" class="model-btn">
                  课程列表
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" class="model-btn">
                  课程列表
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card :body-style="{padding:'0'}" class="card-container">
          <div class="center-box-top-img"></div>
          <div
            v-for="(item,index) in list"
            :key="item.id"
            :class="{'model-item': true, 'model-item-edit': item.isEdit }"
            @click="addClass(item)">
            <div v-if="item.isEdit" class="model-item-icon">
              <i :class="{'el-icon-top': true, 'i-disabled': !index }" @click="index ? handlePrev(item,index) : null "></i>
              <i :class="{'el-icon-bottom': true, 'i-disabled': index===list.length-1 }" @click="index===list.length-1 ?  null :  handleNext(item,index) "></i>
              <i :class="{'el-icon-delete': true, 'i-disabled': !index }" @click="handleDel(index) "></i>
            </div>
            <div style="height: 100px; width: 100%; border: 1px solid black">{{item.id}}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    name: 'mobile_edit',
    data(){
      return {
          list:[]
      }
    },
    methods:{
      addModel(type){
        console.log(111)
        if(type === 'course'){
          this.list.push({isEdit: false,id: Date.now()})
        }
      },
      addClass(item){
        this.list.forEach(item=>item.isEdit=false)
        item.isEdit=true
      },
      handlePrev(item,index){
        this.list.splice(index,1)
        this.list.splice(index-1,0,item)
      },
      handleNext(item,index){
        this.list.splice(index,1)
        this.list.splice(index+1,0,item)
      },
      handleDel(index){
        this.list.splice(index,1)
      }
    }
  }
</script>

<style scoped>
.app-container{
  background-color: #eee;
}
  .el-row{
    margin-bottom: 15px;
  }
  .card-container {
    height: 80vh;
    overflow: inherit;
  }

  .model-btn {
    cursor: pointer;
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
  .model-item-icon{
    position: absolute;
    right: 0;
    margin-right: -24px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 75%;
    padding: 2px;
    font-size: 18px;
    color: #409EFF;
    background-color: white;
    border: 2px dotted #1f2d3d;
    border-left: none;
    z-index: 1000;
  }
  .i-disabled {
    color: #bbb;
    cursor: no-drop;
  }
</style>
