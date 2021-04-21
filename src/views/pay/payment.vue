<template>
  <div class="app-container">
    <div class="filter-container">
        <el-button class="filter-item" icon="el-icon-edit" type="primary"  @click="handleCreate">
          新增收款账号
        </el-button>
    </div>

    <el-table
      :key="1"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="账户" min-width="100px" >
        <template slot-scope="{row}">
          <span>{{row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户人" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleDetails(row)">
            编辑
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryList.page" :limit.sync="queryList.limit" @pagination="getList" />

    <el-dialog title="提现" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="账号">
          <el-input v-model="temp.account"  :min="0"></el-input>
        </el-form-item>

        <el-form-item label="省市区">
          <div style="display: flex">
            <el-select v-model="temp.province" placeholder="省" clearable style="margin-right: 10px">
              <el-option label="省" value="省" />
            </el-select>
            <el-select v-model="temp.city" placeholder="市" clearable style="margin-right: 10px">
              <el-option label="市" value="市" />
            </el-select>
            <el-select v-model="temp.area" placeholder="区" clearable >
              <el-option label="区" value="区" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="temp.path" ></el-input>
        </el-form-item>
        <el-form-item label="所属银行">
          <el-select v-model="temp.bank" placeholder="请选择" clearable >
            <el-option v-for="item in accountList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="temp.name"  :min="0"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="cashSubmit">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchPayments, Cashout} from '@/api/pay'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'payment',
    data(){
      return {
        total:0,
        queryList:{
          limit: 20,
          page:1,
        },
        list:[],
        dialogFormVisible: false,
        temp:{
          account: '',
          area: '',
          bank: '',
          city: '',
          path: '',
          province: '',
          name: '',
          status: ''
        },
        accountList:[
          '中国银行',
          '建设银行',
          '农行',
          '工商银行',
          '邮政银行',
          '交通银行'
        ]
      }
    },
    created() {
      this.getList()
    },
    methods:{
      getList(){
        this.listLoading = true
        fetchPayments(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          console.log(response)
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      cashSubmit(){
        this.$message.success('提现成功')
        this.dialogFormVisible = false
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
      resetTemp(){
        this.temp={
          account: '',
          area: '',
          bank: '',
          city: '',
          path: '',
          province: '',
          name: '',
          status: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogFormVisible = true
      },
    },
    components:{ Pagination }
  }
</script>

<style scoped>
  .top-card {
    display: flex;
    justify-content: space-between;
  }
</style>
