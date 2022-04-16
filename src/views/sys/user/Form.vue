<template>
  <a-modal
    v-model:visible="visible"
    :width="750" :height="600"
    :confirm-loading="confirmLoading"
    :destroyOnClose="true"
    :maskClosable="false"
    :title="title"
    okText="保存"
    @ok="save()">
    <a-form ref="form" :label-col="{span: 6}" :wrapper-col="{span:16}"  :model="data">
      <a-input v-model:value="data.userId" type="hidden" />
      <a-row>
        <a-col :md="12" :xs="24">
          <a-form-item
            :rules="[
              { required: true, message: '登录名不能为空', whitespace: true },
              { min: 1, max: 50, message: '登录名长度1-50' },
              { validator: checkUsername, trigger: 'blur' },
            ]"  label="登录名" name="username">
            <a-input v-model:value="data.username" :maxlength="50" placeholder="请输入登录名字符或者数字"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item
            :rules="[
                { required: true, message: '姓名不能为空', whitespace: true },
                { min: 1, max: 50, message: '姓名长度1-50' },
              ]" label="姓名" name="name">
            <a-input v-model:value="data.name" :maxlength="50" autocomplete="off" placeholder="请输入姓名"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12" :xs="24">
          <a-form-item :rules="passwordRules" label="密码" name="password">
            <a-input-password v-model:value="data.password" :maxlength="50" allow-clear autocomplete="new-password" placeholder="请输入密码"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item
            :rules="[
                {required: true,type: 'number',message: '状态不能为空',whitespace: true},
              ]" label="状态" name="status">
            <a-radio-group v-model:value="data.status" name="status" :options="getDictList('user-status',false)" :allowClear="true"  placeholder="请选择" ></a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12" :xs="24">
          <a-form-item
            :rules="[
              { len: 11, message: '手机号长度为11位' },
            ]" label="手机" name="mobile">
            <a-input v-model:value="data.mobile" :maxlength="11" placeholder="请输入11位手机号"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item
            :rules="[{ type: 'email', message: '请输入合法邮箱' }]" label="邮箱" name="email">
            <a-input v-model:value="data.email" :maxlength="50" placeholder="请输入合法邮箱" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :sapn="24">
          <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" label="备注" name="remarks">
            <a-textarea v-model:value="data.remarks" :auto-size="{ minRows: 3, maxRows: 5 }" :maxlength="255" placeholder="备注"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
  import {defHttp} from "../../../utils/http/axios";
  import {getDictList} from "../../../store/modules/dict";

  export default {
    name: 'SForm',
    emits:['refresh'],
    setup(){
      return {getDictList}
    },
    data(){
      return {
        title:undefined,
        visible:false,
        confirmLoading:false,
        data: {},
      }
    },
    computed: {
      passwordRules() {
        let passwordRules = [];
        if (this.data.userId === undefined) {
          passwordRules.push({ required: true, message: '密码不能为空', whitespace: true });
        }
        passwordRules.push({ min: 6, max: 50, message: '密码长度6-50' });
        return passwordRules;
      },
    },
    methods: {
      open(title,userId) {
        if (userId !== undefined) {
          defHttp.get({url: `/sys/user/query/${userId}`}).then((data) => {
            console.log("data", data)
            this.data = data
          })
        } else {
          this.data = {}
        }
        this.title = title;
        this.visible = true;
      },
      checkUsername(rule, value) {
        return new Promise((resolve, reject) => {
          if (!(value && value.trim())) {
            resolve();
            return;
          }
          defHttp.postForm({url:'/sys/user/check_username', params:{userId:this.data.userId, username:value}}).then((result) => {
            result ? resolve() : reject( `${value} 已存在`);
          });
        });
      },
      save(){
        let url = this.data.userId  === undefined ? '/sys/user/save' : '/sys/user/update';
        this.$refs.form.validate().then(() => {
          this.confirmLoading = true;
          defHttp.post({ url: url, params: this.data }).then(() => {
            this.visible = false;
            this.$emit('refresh');
            this.$message.success('保存成功');
          }).catch((error) => {
            console.error(error);
          }).finally(() => {
            this.confirmLoading = false;
          });
        }).catch((error) => {
          console.log('error', error);
        });
      }
    },
  };
</script>
