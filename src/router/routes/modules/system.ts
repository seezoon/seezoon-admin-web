import type {AppRouteModule} from '/@/router/types';

import {LAYOUT} from '/@/router/constant';

const sys: AppRouteModule = {
  path: '/sys',
  name: 'Sys',
  component: LAYOUT,
  redirect: '/sys/user',
  meta: {
    orderNo: 10,
    icon: 'ant-design:setting-twotone',
    title: '系统设置',
  },
  children: [
    {
      path: 'user',
      name: 'SysUser',
      component: () => import('/@/views/sys/user/index.vue'),
      meta: {
        icon:'ant-design:user-outlined',
        title: '用户管理',
      },
    },
  ],
};

export default sys;
