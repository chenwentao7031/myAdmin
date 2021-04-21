<template>
  <div class="app-container">
    <el-row :gutter="30">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div slot="header" >
            <span>可用余额（元）</span>
            <el-button style="float: right;" type="primary" @click="handleCash">申请提现</el-button>
          </div>
         <span style="font-size: 30px"><b>20.00</b></span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>累计收入（元）</span>
          </div>
          <span style="font-size: 30px"><b>20.00</b></span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>待结算金额（元）</span>
          </div>
          <span style="font-size: 30px"><b>20.00</b></span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>冻结金额（元）</span>
          </div>
          <span style="font-size: 30px"><b>20.00</b></span>
        </el-card>
      </el-col>
    </el-row>

    <el-table
      :key="1"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="交易时间" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.created_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="提款账号" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户人" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现金额" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status  ? '提现成功' : '未提现' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryList.page" :limit.sync="queryList.limit" @pagination="getList" />

    <el-dialog title="提现" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课程价格">
          <el-input-number v-model="temp.price"  :min="0"></el-input-number> </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.account" placeholder="请选择" clearable  class="filter-item">
            <el-option v-for="item in accountList" :key="item" :label="item" :value="item" />
          </el-select>
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
  import { fetchAssets, Cashout} from '@/api/pay'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'assets',
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
          price: 0,
          account: ''
        },
        accountList:[]
      }
    },
    created() {
      this.getList()
    },
    filters:{
      statusFilter(status){
        const statusMap = ['danger','success']
      },
    },
    methods:{
      getList(){
        this.listLoading = true
        fetchAssets(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.accountList = response.data.items.map(item=>item.account)
          console.log(response)
          // Just to simulate the time of the request
          this.listLoading = false
        })
      },
      handleCash(){
        this.temp= {
          price: 0,
          account: ''
        }
        this.dialogFormVisible = true
      },
      cashSubmit(){
        this.$message.success('提现成功')
        this.dialogFormVisible = false
      }
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
