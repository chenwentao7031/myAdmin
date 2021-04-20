<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never">
      <div class="details-card">
        <div class="card-left">
          <img :src="mediaList[0].cover" alt="">
         <div>
          <div>
            {{mediaList[0].title}}
          </div>
           <div class="card-left-content">
             {{mediaList[0].content}}
           </div>
           <div style="margin: 10px 0;color: red;">
             ￥ {{mediaList[0].price}}
           </div>
           <div>
             <el-button-group>
               <el-button type="warning" @click="mediaList[0].status = mediaList[0].status? 0:1">{{mediaList[0].status ? '连载中' : '已完结'}}</el-button>
               <el-button @click="mediaList[0].isend = mediaList[0].isend? 0:1">{{mediaList[0].isend ? '连载中' : '已完结'}}</el-button>
             </el-button-group>
           </div>
         </div>
        </div>
        <span>{{temp.isend ? '连载中' : '已完结'}}</span>
      </div>
    </el-card>

    <div class="filter-container">
      <div>
        <el-button class="filter-item" icon="el-icon-edit" type="primary"  @click="handleCreate">
          新增目录
        </el-button>
      </div>
      <div>
        <el-select v-model="listQuery.importance" placeholder="商品状态" clearable style="width: 90px;margin-right: 10px;" class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button class="filter-item"  type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="mediaList"
      border
      fit
      ref="dragTable"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column  width="40" type="index"></el-table-column>
      <el-table-column label="单品内容" min-width="150px">
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
      <el-table-column label="订阅量" width="100px" align="center">
        <template slot-scope="{row}">
          <span >{{row.sub_count}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" >
            编辑
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="订阅量" width="100px" align="center">
        <template>
          <span ><i class="el-icon-rank" style="font-weight: bold;font-size: 32px;cursor: pointer"></i> </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="选择课程" :visible.sync="dialogFormVisible" width="70%">
      <div class="dialog-search">
        <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        &nbsp;&nbsp;
        <el-button class="filter-item"  type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
      <div style="clear: both"></div>
      <el-tabs v-model="activeName"  style="margin-top:15px;" type="border-card" tab-position="left">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <keep-alive>
            <el-table ref="dataForm" :data="mediaList" border fit highlight-current-row style="width: 100%">
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

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
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
  import { fetchList, createVideo, updateVideo, deleteVideo } from '@/api/video'
  import RichText from './components/RichText'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Sortable from 'sortablejs'

  export default {
    name: 'column_dertails',
    data(){
      return {
        checkboxGroup: [0,1],
        isend:[0],
        tabMapOptions: [
          { label: '图文', key: 'media' },
          { label: '音频', key: 'audio' },
          { label: '视频', key: 'video' }
        ],
        activeName: 'media',
        tableKey: 0,
        total: 0,
        listLoading: true,
        listQuery:{
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        mediaList: [],
        importanceOptions: ['已上架', '已下架'],
        temp: {
          id: undefined,
          cover: '',
          content: '',
          created_time: '',
          price: 0,
          status: 0,
          sub_count: 0,
          t_price: 0,
          title: '',
          try: '',
          isend: 0,
          updated_time: ''
        },
        sortable: null,
        oldList: [],
        newList: [],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑视频',
          create: '新增视频'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          title: [{ required: true, message: 'title is required', trigger: 'change' }],
          content: [{ required: true, message: 'content is required', trigger: 'change' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    watch: {
      activeName(val) {
        this.getList()
      }
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
          this.mediaList = response.data.items
          this.total = response.data.total
          this.oldList = this.mediaList.map(v => v.id)
          this.newList = this.oldList.slice()
          console.log(response)
          // Just to simulate the time of the request
          this.$nextTick(() => {
            this.setSort()
          })
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
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
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      setSort() {
        const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const targetRow = this.mediaList.splice(evt.oldIndex, 1)[0]
            this.mediaList.splice(evt.newIndex, 0, targetRow)

            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      },
      // sortByID(order) {
      //   if (order === 'ascending') {
      //     this.listQuery.sort = '+id'
      //   } else {
      //     this.listQuery.sort = '-id'
      //   }
      //   this.handleFilter()
      // },
      resetTemp() {
        this.temp = {
          id: undefined,
          cover: '',
          content: '',
          created_time: '',
          price: 0,
          status: 0,
          sub_count: 0,
          t_price: 0,
          title: '',
          try: '',
          updated_time: '',
          isend: 0
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
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
        this.mediaList.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
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
    components: { Pagination, RichText },
  }
</script>

<style scoped>
  .filter-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
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
  .dialog-search {
    float: right;
  }
  .details-card {
    display: flex;
    justify-content: space-between;
  }
  .details-card > span {
    width: 120px;
    text-align: right;
    color: #aaa;
  }
  .card-left {
    display: flex;
  }
  .card-left img{
    margin-right: 20px;
  }
  .card-left-content {
    margin: 10px 0;
    color: #aaa;
  }
</style>
