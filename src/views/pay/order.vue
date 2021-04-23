<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button class="filter-item" type="primary"  @click="handleDownload">
          导出选择
        </el-button>
      </div>
      <div>
        <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button class="filter-item"  type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="订单号" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="150px">
        <template slot-scope="{row}">
          <div class="media-content">
            <div>{{row.goods[0].title}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{row.type === 'default' ? '普通' : '拼团'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态"  align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="原价/实付（元）" width="150px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.total_price + '/' + row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="150px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.pay_method === 'wechat' ? '微信支付': '支付宝支付'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建/支付时间" width="150px" align="center">
        <template slot-scope="{row}">
          <div >{{ row.created_time }}</div>
          <div >{{ row.pay_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-popconfirm title="是否删除该纪录？" @onConfirm="handleDelete(row,$index)">
            <el-button slot="reference" size="mini" type="danger">
              删除
            </el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
  import { fetchOrder } from '@/api/pay'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { parseTime } from '@/utils'
  export default {
    name: 'order',
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
        importanceOptions: ['失败', '待支付','成功'],
        temp: {
          id: undefined,
          cover: '',
          content: '',
          created_time: '',
          price: 0,
          status: 0,
          sub_count: 0,
          title: '',
          updated_time: '',
          goods:[],
        },
        downloadLoading: false,
        selectionList: []
      }
    },
    created() {
      this.getList()
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          fail: 'danger',
          pendding: 'danger',
          success: 'success'
        }
        return statusMap[status]
      },
      statusTextFilter(status) {
        const statusMap = {
          fail: '失败',
          pendding: '等待支付',
          success: '成功'
        }
        return statusMap[status]
      },
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchOrder(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          console.log(response)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          cover: '',
          content: '',
          created_time: '',
          price: 0,
          status: 0,
          title: '',
          goods:[],
          updated_time: ''
        }
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
      handleSelectionChange(val){
        console.log(val)
        this.selectionList = val
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单号', '商品名称', '订单类型', '订单状态', '原价（元）','实付（元）','支付方式','创建时间','支付时间']
          const filterVal =  ['no', 'goods', 'type', 'status', 'total_price','price','pay_method','created_time','pay_time']
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
        return this.selectionList.map(v => filterVal.map(j => {
          console.log(v[j])
          if (j === 'type') {
            return v[j] === 'default' ? '普通': '拼团'
          } else if(j==='status') {
            const statusMap = {
              fail: '失败',
              pendding: '等待支付',
              success: '成功'
            }
            return statusMap[v[j]]
          }
          else if(j==='goods'){
            return v[j][0].title
          }
          else if(j==='pay_method'){
            return v[j]==='wechat' ? '微信支付':'支付宝支付'
          }else {
            return v[j]
          }
        }))
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
