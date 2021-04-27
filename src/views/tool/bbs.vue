<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button class="filter-item" icon="el-icon-edit" type="primary"  @click="handleCreate">
          新增社区
        </el-button>
      </div>
      <!--<div>-->
        <!--<el-select v-model="listQuery.importance" placeholder="商品状态" clearable style="width: 90px;margin-right: 10px;" class="filter-item">-->
          <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
        <!--</el-select>-->
        <!--<el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
        <!--<el-button class="filter-item"  type="primary" icon="el-icon-search" @click="handleFilter">-->
          <!--搜索-->
        <!--</el-button>-->
      <!--</div>-->
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
      <el-table-column label="社区" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="管理员" width="100px" align="center">
        <template slot-scope="{row}">
          <span v-for="item in row.bbs_managers" :key="item.username">{{item.username}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleManager(row)">
            管理
          </el-button>
          <el-button v-if="row.status==0" size="mini" type="success" @click="handleModifyStatus(row,1)" style="margin-right: 10px">
            显示
          </el-button>
          <el-button v-if="row.status==1" size="mini" type="danger" @click="handleModifyStatus(row,0)" style="margin-right: 10px">
            隐藏
          </el-button>
          <el-dropdown @command="changeRole($event,row,$index)">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">编辑</el-dropdown-item>
              <el-dropdown-item command="1">修改管理员</el-dropdown-item>
              <el-dropdown-item command="2">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="社区标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">隐藏</el-radio>
            <el-radio :label="0">显示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择课程" :visible.sync="dialogPvVisible">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="changelist"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="用户" min-width="150px" >
          <template slot-scope="{row}">
            <div><img :src="" alt="">{{row.title}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">
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
  import { fetchPostComment, fetchPostList, fetchList, createBbs, updateBbs, deleteBbs, deletePost, deletePostComment } from '@/api/bbs'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'bbs',
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
        importanceOptions: ['显示', '隐藏'],
        temp: {
          bbs_managers: [{}],
          status: 1
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        rules: {
          title: [{ required: true, message: 'title is required', trigger: 'change' }],
          content: [{ required: true, message: 'content is required', trigger: 'change' }]
        },
        downloadLoading: false,
        changeList: []
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
        const statusMap = ['显示','隐藏']
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
      handleManager(row){
        this.$router.push(`bbs_post?id=${row.id}`)
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      },
      handleSelectionChange(val){
        console.log(val)
        this.changeList = val.map(item=>{
          return item.user_id
        })
      },
      resetTemp() {
        this.temp = {
          bbs_managers: [{}],
          status: 1
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createBbs(this.temp).then(() => {
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateBbs(tempData).then(() => {
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
      changeRole(comm,row,index){
        if(comm === '0'){
          this.handleUpdate(row)
        }
        else if(comm === '1'){

        }
        else if(comm === '2'){
          this.handleDelete(row,index)
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
