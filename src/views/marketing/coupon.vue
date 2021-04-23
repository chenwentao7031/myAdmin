<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" icon="el-icon-edit" type="primary"  @click="handleCreate">
        创建优惠券
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="优惠券ID" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="面值" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用课程" >
        <template slot-scope="{row}">
          <span>{{row.value.title}}</span>
        </template>
      </el-table-column>

      <el-table-column label="使用期限" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{row.start_time}} 至 {{row.end_time}}</span>
        </template>
      </el-table-column>

      <el-table-column label="发行量" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.c_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已领取" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.received_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.used_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px" align="center">
        <template slot-scope="{row}">
          <span :style="{color: row.time_status === '领取中' ? 'red':'#888'}">
            {{ row.time_status }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button :disabled="!row.status" type="danger" size="mini" @click="handleModifyStatus(row,0)">
            下架
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类型">
          <el-select v-model="temp.type" placeholder="商品状态" clearable style="margin-right: 10px;" class="filter-item">
            <el-option label="课程" value="course" />
            <el-option label="专栏" value="column" />
            <el-option label="全部课程" value="all" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联课程" prop="title" >
          <el-button size="mini" type="primary" @click="handleRelate">关联</el-button>
          <el-card v-show="temp.value.title">
            <div><img :src="temp.value.cover" alt=""></div>
            <div>{{temp.value.title}}</div>
            <div style="color:red">￥{{temp.value.price}}</div>
          </el-card>
        </el-form-item>
        <el-form-item label="面值">
          <el-input-number v-model="temp.price"  :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="发行量">
          <el-input-number v-model="temp.c_num"  :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="拼团活动开始时间-结束时间">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="-"
            format="yyyy-MM-dd hh:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-dialog
        width="70%"
        title="选择课程"
        :visible.sync="relateVisible"
        append-to-body>
        <div class="filter" style="float: right">
          <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px; margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button class="filter-item"  type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <div style="clear: both"></div>
        <el-tabs v-model="activeName"  style="margin-top:15px;" type="border-card" tab-position="left">
          <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
            <keep-alive>
              <el-table
                :data="relateList"
                border fit highlight-current-row
                style="width: 100%;"
                height="350"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" />
                <el-table-column  label="内容" >
                  <template slot-scope="{row}">
                    <div class="media-content">
                      <img :src="row.cover" alt="">
                      <div>
                        <div>{{row.title}}</div>
                        <div>￥ {{row.price}}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <pagination v-show="relatetotal>0" :total="relatetotal" :page.sync="relatequery.page" :limit.sync="relatequery.limit" @pagination="getRelateList" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="relateVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="chooseCurse">
            确认
          </el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchCoupon } from '@/api/marketing'
  import { fetchList as fetchMedia } from '@/api/media'
  import { fetchList as fetchVideo } from '@/api/video'
  import { fetchList as fetchAudio } from '@/api/audio'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'coupon',
    data(){
      return {
        tableKey: 0,
        total: 0,
        listLoading: true,
        listQuery:{
          page: 1,
          limit: 20,
        },
        list: [],
        importanceOptions: ['已上架', '已下架'],
        temp: {
          type: 'course',
          s_num: 0,
          expire: 24,
          auto: 1,
          price: 0,
          value: {
            price: 0,
            cover: '',
            title: ''
          },
          time:''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        downloadLoading: false,
        relateVisible: false,
        activeName: 'media',
        tabMapOptions: [{
          label: '图文',
          key: 'media'
        },
          {
            label: '音频',
            key: 'audio'
          },{
            label: '视频',
            key: 'video'
          }
        ],
        relateList: [],
        relatequery:{
          page: 1,
          limit: 20,
        },
        relatetotal: 0,
        changeList:[],
        time: ''
      }
    },
    created() {
      this.getList()
    },
    watch:{
      activeName(val){
        this.getRelateList()
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchCoupon().then(response => {
          let nowTime = Date.now()
          this.list = response.data.items.map(item=>{
            let startTime = new Date(item.start_time).getTime()
            let endTime = new Date(item.end_time).getTime()
            // console.log('start_time',  startTime)
            // console.log('end_time', endTime)
            // console.log(startTime > Date.now())
            console.log(item.status)
            item.time_status = item.status ? this.getTimestatus(nowTime,startTime,endTime) : '已下架'
            return item
          })
          this.total = response.data.total
          console.log(response)
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      getTimestatus( nowTime= null,startTime=null,endTime=null ){
        if(nowTime&&endTime&&startTime){
          if(nowTime < startTime){
            return '未开始'
          }else if(nowTime > endTime){
            return '已结束'
          }else {
            return '领取中'
          }
        }
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
        row.time_status = '已下架'
      },
      resetTemp() {
        this.time=''
        this.temp = {
          type: 'course',
          price: 0,
          s_num: 0,
          expire: 24,
          auto: 1,
          value: {
            price: 0,
            cover: '',
            title: ''
          },
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.time) return false
            this.temp.start_time =  this.timeFormater(this.time[0])
            this.temp.end_time = this.timeFormater(this.time[1])
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }
        })
      },
      changeDate(a){
        console.log(a)
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        // this.temp.time = [
        //   new Date(this.temp.start_time),
        //   new Date(this.temp.end_time),
        // ]
        this.time = [
          new Date(this.temp.start_time),
          new Date(this.temp.end_time),
        ]
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      timeFormater(date){
        let y=date.getFullYear()
        let M=date.getMonth()
        let d=date.getDate()
        let h=date.getHours()
        let m=date.getMinutes()
        let s=date.getSeconds()
        return `${y}-${M}-${d} ${h}:${m}:${s}`
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            if(this.time.length){
              this.temp.start_time =  this.timeFormater(this.time[0])
              this.temp.end_time = this.timeFormater(this.time[1])
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }
        })
      },
      handleRelate(){
        this.relateVisible = true
        this.getRelateList()
      },
      getRelateList(){
        switch(this.activeName){
          case 'media':
            fetchMedia(this.relatequery).then(res=>{
              this.relateList = res.data.items
              this.relatetotal = res.data.total
              console.log('relateres:', res)
            })
            break
          case 'audio':
            fetchAudio(this.relatequery).then(res=>{
              this.relateList = res.data.items
              this.relatetotal = res.data.total
              console.log('relateres:', res)
            })
            break
          case 'video':
            fetchVideo(this.relatequery).then(res=>{
              this.relateList = res.data.items
              this.relatetotal = res.data.total
              console.log('relateres:', res)
            })
            break
          default:
            break
        }
      },
      handleFilter() {
        this.relatequery.page = 1
        this.getRelateList()
      },
      handleSelectionChange(val){
        this.changeList = val
      },
      chooseCurse(){
        if(this.changeList.length === 0){
          this.$message.error('请选择一门课程')
        }else if(this.changeList.length >1){
          this.$message.error('最多只能选择一门课程')
        }else {
          this.temp.value = this.changeList[0]
          this.relateVisible = false
        }
      }
    },
    components: { Pagination },
  }
</script>

<style scoped>
  .filter-container {
    display: flex;
    justify-content: space-between;
  }
  .media-content {
    display: flex;
    text-align: left;
  }
  .media-content> img {
    width: 100px;
    height: 50px;
    margin-right: 10px;
  }
</style>
