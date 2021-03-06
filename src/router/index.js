import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 不需要权限判断
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// 需要权限判断
export const asyncRoutes = [
  {
    path: '/course',
    component: Layout,
    redirect: '/course/media',
    alwaysShow: true, // will always show the root menu
    name: 'course',
    meta: {
      title: '课程',
      icon: 'excel',
      roles: ['admin']
    },
    children: [
      {
        path: '/media',
        component: ()=>import('@/views/course/media'),
        name: 'media',
        meta: { title: '图文' }
      },
      {
        path: '/audio',
        component: ()=>import('@/views/course/audio'),
        name: 'audio',
        meta: { title: '音频' }
      },
      {
        path: '/video',
        component: ()=>import('@/views/course/video'),
        name: 'video',
        meta: { title: '视频' }
      },
      {
        path: '/columns',
        component: ()=>import('@/views/course/columns'),
        name: 'columns',
        meta: { title: '专栏' }
      },
      {
        hidden: true,
        path: '/columns/column_details',
        component: ()=>import('@/views/course/column_details'),
        name: 'column_details',
        meta: { title: '专栏详情' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    name: 'user',
    meta: {
      title: '用户',
      icon: 'excel',
      roles: ['admin']
    },
    children: [
      {
        hidden: true,
        path: '/user/user',
        component: ()=>import('@/views/user/user'),
        name: 'myuser',
        meta: { title: '用户' }
      }
    ]
  },
  {
    path: '/pay',
    component: Layout,
    redirect: '/pay/order',
    alwaysShow: true, // will always show the root menu
    name: 'pay',
    meta: {
      title: '交易',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '/pay/order',
        name: 'order',
        component: ()=>import('@/views/pay/order'),
        meta: {
          title: '订单管理'
        },
      },
      {
        path: '/pay/assets',
        name: 'assets',
        component: ()=>import('@/views/pay/assets'),
        meta: {
          title: '资产管理'
        },
      },
      {
        path: '/pay/payment',
        name: 'payment',
        component: ()=>import('@/views/pay/payment'),
        meta: {
          title: '支付设置'
        },
      }
    ]
  },
  {
    path: '/marketing',
    name: '营销',
    component: Layout,
    redirect: '/marketing/group',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '营销',
      icon: 'lock',
      roles: ['admin', 'editor'],
    },
    children: [
      {
        path: 'group',
        name: 'group',
        component: ()=>import('@/views/marketing/group'),
        meta: {
          title: '拼团'
        }
      },
      {
        path: 'flashsale',
        name: 'flashsale',
        component: ()=>import('@/views/marketing/flashsale'),
        meta: {
          title: '秒杀'
        }
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: ()=>import('@/views/marketing/coupon'),
        meta: {
          title: '优惠券'
        }
      }
    ]
  },
  {
    path: '/renovation',
    name: 'renovation',
    component: Layout,
    redirect: '/renovation/mobile_index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '可视化',
      icon: 'el-icon-setting',
      roles: ['admin', 'editor'],
    },
    children: [
      {
        path: 'mobile_index',
        name: 'mobile_index',
        component: ()=>import('@/views/renovation/mobile_index'),
        meta: { title: '移动端' }
      },
      {
        hidden: true,
        path: 'mobile_edit',
        component: ()=>import('@/views/renovation/mobile_edit'),
        name: 'mobile_edit',
        meta: { title: '移动端装修' }
      },
      {
        path: 'pc_index',
        name: 'pc_index',
        component: ()=>import('@/views/renovation/pc_index'),
        meta: { title: 'PC端' }
      },
      {
        hidden: true,
        path: 'pc_edit',
        component: ()=>import('@/views/renovation/pc_edit'),
        name: 'mobile_edit',
        meta: { title: 'PC端装修' }
      },
    ]
  },
  {
    path: '/tool',
    name: 'tool',
    component: Layout,
    redirect: '/tool/bbs',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '工具化',
      icon: 'el-icon-setting',
      roles: ['admin', 'editor'],
    },
    children: [
      {
        path: 'bbs',
        name: 'bbs',
        component: ()=>import('@/views/tool/bbs'),
        meta: { title: '小社群' }
      },
      {
        hidden: true,
        path: 'bbs_post',
        component: ()=>import('@/views/tool/bbs_post'),
        name: 'bbs_post',
        meta: { title: '帖子列表' }
      },
      {
        path: 'question',
        name: 'question',
        component: ()=>import('@/views/tool/question'),
        meta: { title: '题库' }
      },
      {
        path: 'testpaper',
        name: 'testpaper',
        component: ()=>import('@/views/tool/testpaper'),
        meta: { title: '试卷' }
      },
      {
        path: 'book',
        name: 'book',
        component: ()=>import('@/views/tool/book'),
        meta: { title: '电子书' }
      }
    ]
  },
  {
    path: '/setting',
    name: '设置',
    component: Layout,
    redirect: '/setting/setting_index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '设置',
      icon: 'el-icon-setting',
      roles: ['admin', 'editor'],
    },
    children: [
      {
        path: 'setting_index',
        name: 'setting_index',
        component: ()=>import('@/views/setting/setting_index'),
        meta: { title: '店铺设置' }
      },{
        path: 'staffs',
        name: 'staffs',
        component: ()=>import('@/views/setting/staffs'),
        meta: { title: '员工管理' }
      },{
        path: 'role',
        name: 'role',
        component: ()=>import('@/views/setting/role'),
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  //
  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },
  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },
  //
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },
  //
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },
  //
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
