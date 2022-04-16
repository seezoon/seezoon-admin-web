<template>
    <a-form ref="searchForm" :label-col="{span: 6}" :wrapper-col="{span:16}" labelAlign="left"
            :model="searchForm">
      <a-row>
        <a-col :span="4">
          <a-form-item label="用户名" name="username">
            <a-input v-model:value="searchForm.username" placeholder=""/>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="姓名" name="name">
            <a-input v-model:value="searchForm.name" placeholder=""/>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="手机号" name="mobile">
            <a-input v-model:value="searchForm.mobile" placeholder=""/>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="状态" name="status">
            <a-select v-model:value="searchForm.status" :options="getDictList('user-status')" :allowClear="true"  placeholder="请选择"/>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-space>
            <a-button type="primary" @click="query()">查询</a-button>
            <a-button @click="this.$refs.searchForm.resetFields()">重置</a-button>
            <a-button type="primary" @click="this.$refs.form.open('添加用户')">添加</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="(record) => record.userId"
      table-layout="fixed"
      @change="query"
    >
      <template #view="{ record, text }">
        <a @click="this.$refs.view.open(record.userId)">{{ text ? text : '查看' }}</a>
      </template>
      <template #photo="{ text }">
        <a-image v-if="text" :src="text" height="40px" width="40px"/>
      </template>

      <template #status="{ text }">
        <a-typography-text :type="getDictColor('user-status',text)">{{getDictTitle('user-status',text)}}</a-typography-text>
      </template>

      <template #action="{ record }">
        <a @click="this.$refs.form.open('编辑', record.userId)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="left"
          title="确定删除？"
          @confirm="this.delete(record.userId)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <s-form ref="form" @refresh="query"></s-form>
    <s-view ref="view"></s-view>
</template>
<script>
import {defHttp} from "../../../utils/http/axios";
import {getDictList,getDictTitle,getDictColor} from '../../../store/modules/dict';
import SForm from "./Form.vue";
import SView from "./View.vue";
export default {
  name: "SMain",
  components:{SForm,SView},
  setup(){
    return {getDictList,getDictTitle,getDictColor}
  },
  mounted() {
    this.query();
  },
  data() {
    return {
      searchForm: {},
      loading: false,
      dataSource: [],
      pagination: {
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条`,
      },
      columns: [
        {
          title: "用户名",
          dataIndex: "username",
          slots: {customRender: 'view'},
        },
        {
          title: "姓名",
          dataIndex: "name"
        },
        {
          title: "头像",
          dataIndex: "photo"
        },
        {
          title: "手机号",
          dataIndex: "mobile"
        },
        {
          title: "状态",
          dataIndex: "status",
          slots: {customRender: 'status'},
        },
        {
          title: "注册时间",
          dataIndex: "createTime",
          sorter: true
        },
        {
          title: '操作',
          fixed: 'right',
          width: 120,
          slots: { customRender: 'action' },
        },
      ]
    }
  },
  methods: {
    query(pagination = {...this.pagination,current:1}, filters, sorter) {
      this.loading = true;
      defHttp.post({
        url: "/sys/user/query", params: {
          ...this.searchForm,
          page: pagination.current, pageSize: pagination.pageSize,
          sortField: sorter?.field,
          sortOrder: sorter?.order,
        }
      }).then(({total, list}) => {
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.pagination.total = total;
        this.dataSource = list;
      }).finally(() => {
        this.loading = false;
      })
    },
    delete(userId) {
      defHttp.postForm({url:'/sys/user/delete',params:{userId: userId}}).then(()=>{
        this.query();
        this.$message.success('删除成功');
      });
    }
  }
}
</script>
