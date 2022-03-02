import type {AppRouteModule} from '/@/router/types';

import {LAYOUT} from '/@/router/constant';
import {t} from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/sys',
  name: 'Sys',
  component: LAYOUT,
  redirect: '/sys/user',
  meta: {
    orderNo: 10,
    icon: 'ant-design:setting-twotone',
    title: t('系统设置'),
  },
  children: [
    {
      path: 'user',
      name: 'SysUser',
      component: () => import('/@/views/sys/user/index.vue'),
      meta: {
        // affix: true,
        title: t('用户管理'),
      },
    },
  ],
};

export default dashboard;
