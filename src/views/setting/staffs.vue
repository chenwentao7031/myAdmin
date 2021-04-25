<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" icon="el-icon-edit" type="primary"  @click="handleCreate">
        添加员工
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
      <el-table-column label="用户" min-width="150px">
        <template slot-scope="{row}">
          <span>{{row.user.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="100px" align="center">
        <template slot-scope="{row}">
          <span v-for="role in row.roles" :key="role.id">{{role.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            配置权限
          </el-button>
          <el-button  type="danger" size="mini" @click="handleModifyStatus(row,0)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="关键词" v-if="dialogStatus==='create'">
         <el-input></el-input>
        </el-form-item>
        <el-form-item label="角色" v-if="dialogStatus !== 'create'">
          <el-checkbox-group v-model="checklist">
            <el-checkbox label="超级管理员"></el-checkbox>
            <el-checkbox label="运营"></el-checkbox>
          </el-checkbox-group>
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
  </div>
</template>

<script>
  import { fetchStaff } from '@/api/staff'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'staffs',
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
        temp: {},
        checklist:[],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '配置权限',
          create: '添加员工'
        },
        downloadLoading: false,
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
        fetchStaff().then(response => {
          this.list = response.data.items
          this.total = response.data.total
          console.log(response)
          // Just to simulate the time of the request
          this.listLoading = false
        })
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

        this.temp = {
          type: 'course',
          price: 0,
          p_num: 0,
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
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
