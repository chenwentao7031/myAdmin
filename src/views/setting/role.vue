<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="角色KEY" min-width="150px">
        <template slot-scope="{row}">
          <span>{{row.key}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色描述" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleCheck(row)">
            查看权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog  :visible.sync="dialogFormVisible" >
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="150px" style="margin-left:50px;">
        <el-form-item label="角色名称">
          <div>超级管理员</div>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree :data="data" :props="defaultProps" ></el-tree>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree :data="data" :props="defaultProps"></el-tree>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { getRoles, } from '@/api/role'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'role',
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
        temp: {
         routes:[]
        },
        dialogFormVisible: false,
        downloadLoading: false,
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getRoles().then(response => {
          this.list = response.data
          this.total = response.data.length
          console.log(response)
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      resetTemp() {
        this.temp = {
          routes: []
        }
      },
      handleCheck(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            if(this.temp.length){
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
