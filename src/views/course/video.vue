<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <el-button class="filter-item" icon="el-icon-edit" type="primary"  @click="handleCreate">
          新增视频
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
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频内容" min-width="150px" align="center">
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
          <span>{{row.sub_count}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status==0" size="mini" type="success" @click="handleModifyStatus(row,1)">
            上架
          </el-button>
          <el-button v-if="row.status==1" size="mini" @click="handleModifyStatus(row,0)">
            下架
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" fullscreen>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="封面" >
          <UploadSingle
            action="https://jsonplaceholder.typicode.com/posts/"
            :imgUrl="temp.cover"
            :success="uploadCover"
          ></UploadSingle>
        </el-form-item>
        <el-form-item label="课程介绍" prop="content">
          <rich-text v-model="temp.content"></rich-text>
        </el-form-item>
        <el-form-item label="课程内容" prop="content">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
            :file-list="temp.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程价格">
          <el-input-number v-model="temp.sub_count"  :min="0"></el-input-number> </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="temp.status">
            <el-radio :label="0">下架</el-radio>
            <el-radio :label="1">上架</el-radio>
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
  </div>
</template>

<script>
  import { fetchList, createVideo, updateVideo, deleteVideo } from '@/api/video'
  import RichText from './components/RichText'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import UploadSingle from '@/components/Upload/SingleImage4'

  export default {
    name: 'video',
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
          updated_time: '',
          fileList: [
            {
              name: 'food2.jpeg',
              url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
            }],
        },

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
          console.log(response)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      uploadCover(res,file){
        console.log(res,file)
        this.temp.cover = URL.createObjectURL(file.raw)
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
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
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
          fileList: [
            {
              name: 'food2.jpeg',
              url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
            }],
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
        this.list.splice(index, 1)
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
    components: { Pagination, RichText, UploadSingle },
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
