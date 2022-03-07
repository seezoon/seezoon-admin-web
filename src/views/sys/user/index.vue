<template>
  <page-wrapper contentBackground contentClass="p-4">
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
          <a-space>
            <a-button type="primary" @click="query()">查询</a-button>
            <a-button @click="this.$refs.searchForm.resetFields()">重置</a-button>
            <a-button type="primary">添加</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="(record) => record.id"
      table-layout="fixed"
      @change="query"
    >
      <template #photo="{ text }">
        <a-image v-if="text" :src="text" height="40px" width="40px"/>
      </template>

      <template #status="{ text }">
        <a-tag :color="text == 1 ? 'blue' : 'red'">
          {{ text == 1 ? '有效' : '停用' }}
        </a-tag>
      </template>
    </a-table>
  </page-wrapper>
</template>
<script>
import {PageWrapper} from '/@/components/Page';
import {defHttp} from "../../../utils/http/axios";

export default {
  name: "SysUser",
  components: {PageWrapper},
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
          dataIndex: "username"
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
        }
      ]
    }
  },
  methods: {
    query(pagination = {...this.pagination,current:1}, filters, sorter) {
      // debugger
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
    }
  }
}
</script>
