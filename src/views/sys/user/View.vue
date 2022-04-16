<template>
  <a-modal
    v-model:visible="visible" :destroyOnClose="true" :height="600" title="查看" :width="750" :footer="null"
  >
    <a-descriptions bordered>
      <a-descriptions-item label="用户名">{{ data.username }}</a-descriptions-item>
      <a-descriptions-item label="姓名">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item label="手机号">{{ data.mobile }}</a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ data.email }}</a-descriptions-item>
      <a-descriptions-item label="状态">
        <a-typography-text :type="getDictColor('user-status',data.status)">{{getDictTitle('user-status',data.status)}}</a-typography-text>
      </a-descriptions-item>
      <a-descriptions-item label="备注"> {{ data.remarks }} </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script>
  import { ref } from 'vue';
  import { defHttp } from '../../../utils/http/axios';
  import {getDictColor, getDictTitle} from "../../../store/modules/dict";

  export default {
    name: 'Sview',
    setup() {
      const visible = ref(false);
      const data = ref({});
      const open = function (userId) {
        visible.value = true;
        defHttp.get({ url: `/sys/user/query/${userId}` }).then((result) => {
          data.value = result;
        });
      };
      return {
        visible,
        open,
        data,
        getDictColor,
        getDictTitle
      };
    },
  };
</script>
