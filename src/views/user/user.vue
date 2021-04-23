<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-dropdown @command="changeRole">
          <el-button size="small" type="danger">
            设置黑名单<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">禁止评论</el-dropdown-item>
            <el-dropdown-item command="1">禁止访问</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-input v-model="listQuery.title" placeholder="标题" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button class="filter-item"  type="primary" size="small" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
    </div>

    <el-table
      @selection-change="handleSelectionChange"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      ref="dataForm"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="用户" min-width="150px" align="center">
        <template slot-scope="{row}">
          <div class="media-content">
            <img :src="row.user.avatar" alt="">
            <div>{{row.user.username}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="消费总额" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.total_consume}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleDetails(row)">
            详情
          </el-button>
          <el-button  size="mini" type="success" @click="handleModifyStatus(row,1)" style="margin-right: 10px">
            联系用户
          </el-button>
          <el-dropdown @command="changeRoleOne($event,row)">
            <el-button size="mini" type="danger">
              设置黑名单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">禁止评论</el-dropdown-item>
              <el-dropdown-item command="1">禁止访问</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="用户详情" :visible.sync="dialogFormVisible" width="80%">
      <el-row style="margin: 20px 0 40px">
        <el-col :span="6">ID：{{temp.user_id}}</el-col>
        <el-col :span="6">用户名：{{temp.user.username}}</el-col>
        <el-col :span="6">昵称：{{temp.user.nickname}}</el-col>
        <el-col :span="6">手机号：{{temp.user.phone}}</el-col>
      </el-row>
      <el-row style="margin: 10px 0 20px">
        <el-col :span="6">锁定：{{temp.user.no_access ? '是':'否'}}</el-col>
        <el-col :span="6">会员：{{temp.user.user_level}}</el-col>
        <el-col :span="6">会员到期时间：{{temp.user.user_level_expire}}</el-col>
        <el-col :span="6">注册时间：{{temp.user.created_time}}</el-col>
      </el-row>

      <el-tabs v-model="activeName"  style="margin-top:15px;" >
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <keep-alive>
            <el-table
              height="300px"
              :data="modalList"
              border fit highlight-current-row
              style="width: 100%">
              <template v-if="activeName === 'course'">
                <el-table-column  label="课程标题" >
                  <template slot-scope="{row}">
                    <div>{{row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="购买价格">
                  <template slot-scope="{row}">
                    <span>{{row.price}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="购买时间">
                  <template slot-scope="{row}">
                    <span>{{row.created_time}}</span>
                  </template>
                </el-table-column>
              </template>
              <template v-if="activeName === 'column'">
                <el-table-column  label="专栏标题" >
                  <template slot-scope="{row}">
                    <div>{{row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="购买价格">
                  <template slot-scope="{row}">
                    <span>{{row.price}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="购买时间">
                  <template slot-scope="{row}">
                    <span>{{row.created_time}}</span>
                  </template>
                </el-table-column>
              </template>
              <template v-if="activeName === 'order'">
                <el-table-column  label="ID" >
                  <template slot-scope="{row}">
                    <div>{{row.id}}</div>
                  </template>
                </el-table-column>
                <el-table-column  label="订单号" >
                  <template slot-scope="{row}">
                    <div>{{row.no}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="购买价格">
                  <template slot-scope="{row}">
                    <span>{{row.price}}</span>
                  </template>
                </el-table-column>
                <el-table-column  label="状态" >
                  <template slot-scope="{row}">
                    <div>{{row.status === 'fail' ? '失败' : '成功'}}</div>
                  </template>
                </el-table-column>
                <el-table-column  label="商品" >
                <template slot-scope="{row}">
                  <div>{{row.title}}</div>
                </template>
              </el-table-column>
                <el-table-column label="购买时间">
                  <template slot-scope="{row}">
                    <span>{{row.created_time}}</span>
                  </template>
                </el-table-column>
              </template>
              <template v-if="activeName === 'history'">
                <el-table-column  label="课程标题" >
                  <template slot-scope="{row}">
                    <div>{{row.title}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="课程类型">
                  <template slot-scope="{row}">
                    <span>{{row.type}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="学习时长">
                  <template slot-scope="{row}">
                    <span>{{row.total_time}}</span>
                  </template>
                </el-table-column>
              </template>
              <template v-if="activeName === 'comments'">
                <el-table-column  label="评论内容" >
                  <template slot-scope="{row}">
                    <div>{{row.content}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="评论时间">
                  <template slot-scope="{row}">
                    <span>{{row.created_time}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="课程标题">
                  <template slot-scope="{row}">
                    <span>{{row.title}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="类型">
                  <template slot-scope="{row}">
                    <span>{{row.type}}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>

      <pagination v-show="modalTotal>0" :total="modalTotal" :page.sync="modalPage" :limit.sync="modalLimit" @pagination="getCourse" />
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, fetchUserDetail, fetchUserCourse, fetchUserColumn, fetchUserOrder,fetchUserHistory,fetchUserComment,changeCommentStatus,changeAccessStatus,fetchRole } from '@/api/user'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'myuser',
    data(){
      return {
        tableKey: 0,
        total: 0,
        listLoading: true,
        listQuery:{
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        list: [],
        temp: {
          user:{}
        },
        tabMapOptions: [
          { label: '课程订阅', key: 'course' },
          { label: '专栏订阅', key: 'column' },
          { label: '订单记录', key: 'order' },
          { label: '观看历史', key: 'history' },
          { label: '用户评论', key: 'comments' }
        ],
        modalList: [],
        modalPage:0,
        modalTotal:10,
        modalLimit: 20,
        activeName: 'course',
        importanceOptions: ['已上架', '已下架'],
        dialogFormVisible: false,
        downloadLoading: false,
        changeList: []
      }
    },
    watch: {
      activeName(val) {
        console.log('val',val)
        switch (val) {
          case 'course':
            this.getCourse()
          case 'column':
            fetchUserColumn().then(res=>{
              this.modalList = res.data.items
              this.modalTotal = res.data.total
              console.log('column',res)
            })
            break
          case 'order':
            fetchUserOrder().then(res=>{
              console.log('order:',res)
              this.modalList = res.data.items
              this.modalTotal = res.data.total

            })
            break
          case 'history':
            fetchUserHistory().then(res=>{
              this.modalList = res.data.items
              this.modalTotal = res.data.total
              console.log('history',res)
            })
            break
          case 'comments':
            fetchUserComment().then(res=>{
              this.modalList = res.data.items
              this.modalTotal = res.data.total
              console.log('comments',res)
            })
            break
          default:
            break
        }
      }
    },
    created() {
      this.getList()
    },
    filters: {
      statusFilter(status) {
        const statusMap = ['success', 'danger']
        return statusMap[status]
      },
      statusTextFilter(status) {
        const statusMap = ['已上架','已下架']
        return statusMap[status]
      },
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          console.log(response)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      changeRole(command){
        if(!this.changeList.length){
          this.$message.error('请选择用户')
          return
        }
        if(command === '0'){
          this.$confirm('是否禁止该用户评论', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.$refs.dataForm.clearSelection()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else if(command === '1'){
          this.$confirm('是否禁止该用户访问' , '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.$refs.dataForm.clearSelection()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      changeRoleOne(command, row){
        console.log(row,command)
        this.changeList = [row.user_id]
        this.changeRole(command)
      },
      handleSelectionChange(val){
        console.log(val)
       this.changeList = val.map(item=>{
         return item.user_id
       })
      },
      getCourse(){
        fetchUserCourse().then(res=>{
          this.modalList = res.data.items
          this.modalTotal = res.data.total
        })
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleDetails(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogFormVisible = true
        this.getCourse()
      },
    },
    components: { Pagination }
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
    line-height: 50px;
  }
  .media-content> img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 50%;
  }
</style>
