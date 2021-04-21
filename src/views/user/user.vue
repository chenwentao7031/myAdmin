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
              ref="dataForm"
              height="300px"
              :data="modalList"
              border fit highlight-current-row
              style="width: 100%">
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
        switch (val) {
          case 'course':
            this.getCourse()
          case 'column':
            fetchUserColumn().then(res=>{
              this.modalList = res.data.items
              this.modalTotal = res.data.total
            })
          case 'order':
            fetchUserOrder().then(res=>{
              this.modalList = res.data.items
              this.modalTotal = res.data.total
            })
          case 'history':
            fetchUserHistory().then(res=>{
              this.modalList = res.data.items
              this.modalTotal = res.data.total
            })
          case 'comments':
            fetchUserComment().then(res=>{
              this.modalList = res.data.items
              this.modalTotal = res.data.total
            })
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
      handleCreate() {
        this.dialogFormVisible = true
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDetails(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogFormVisible = true
        this.getCourse()
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row, index) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal) {
        return this.list.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
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
