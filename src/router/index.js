import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import mainPage from '@/views/mainPage'

//系统设置模块
// import systemLeft from '@/views/systemMng/systemLeft'
//权限模块的
import roleManagement from "@/views/systemMng/authorityMng/roleMgt/roleManagement";
import orgStructure from "@/views/systemMng/authorityMng/orgStructure/orgStructure";
import userManagement from "@/views/systemMng/authorityMng/userMgt/userManagement";
//个人模块

import perInfo from "@/views/systemMng/perManagement/perInfo";
import modefiyPassword from "@/views/systemMng/perManagement/modefiyPassword";

//字典管理
import dictionaryMng from '@/views/systemMng/dictionaryMng/dictionaryMng'
// 模型管理
import modelMng from '@/views/systemMng/modelMng/modelMng'
import modelAttr from '@/views/systemMng/modelMng/modelAttr'
import modelInfo from '@/views/systemMng/modelMng/modelInfo'
import attrInfo from '@/views/systemMng/modelMng/attrInfo'
// 维度管理
import dimensionMng from '@/views/systemMng/dimensionMng/dimensionMng'
import resourceMng from '@/views/systemMng/resourceMng/resourceMng'
import resourceInfo from '@/views/systemMng/resourceMng/resourceInfo'
import resourceText from '@/views/systemMng/resourceMng/resourceText'
//物料套件管理
import materialSuiteInfo from '@/views/systemMng/materialSuiteMng/materialSuiteInfo'
import materialEdit from '@/views/systemMng/materialSuiteMng/materialEdit'
import versionUpload from '@/views/systemMng/versionUpload/versionUpload'
//导航管理

import navMng from '@/views/systemMng/navMng/navMng'
import navAdd from '@/views/systemMng/navMng/navAdd'
import navInfo from '@/views/systemMng/navMng/navInfo'

//车载巡检
import countReport from '@/views/vehicle/countReport'
import insAssetNum from '@/views/vehicle/insAssetNum'
import routintInsprctionList from '@/views/vehicle/routintInsprctionList'
import routintInsprctionInfo from '@/views/vehicle/routintInsprctionInfo'


//供应商管理
import SupplierList from '@/views/systemMng/SupplierMng/SupplierList'
import NewSupplier from '@/views/systemMng/SupplierMng/NewSupplier'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: 'mainPage',
          name: 'mainPage',
          component: mainPage,
        },
      ]
    },
    {
      path: '/vehicle',
      name: 'vehicle',
      component: home,
      children: [
        {
          path: 'routintInsprctionList',
          name: 'routintInsprctionList',
          component: routintInsprctionList,
        },
        {
          path: 'routintInsprctionInfo',
          name: 'routintInsprctionInfo',
          component: routintInsprctionInfo,
        },
        {
          path: 'insAssetNum/:params',
          name: 'insAssetNum',
          component: insAssetNum,
        },
        {
          path: 'countReport',
          name: 'countReport',
          component: countReport,
        }

      ]
    }, 
    {
      path: '/systemHome',
      name: 'systemHome',
      component: home,
      children: [
        //   {
        //   path: '',
        //   name: 'systemLeft',
        //   component: systemLeft,
        // },
        {
          path: 'roleManagement',
          name: 'roleManagement',
          component: roleManagement,
        }, {
          path: '',
          name: 'orgStructure',
          component: orgStructure,
        }, {
          path: 'userManagement',
          name: 'userManagement',
          component: userManagement,
        },
        {
          path: 'perInfo',
          name: 'perInfo',
          component: perInfo,
        },
        {
          path: 'modefiyPassword',
          name: 'modefiyPassword',
          component: modefiyPassword,
        },
        {
          path: 'dictionaryMng',
          name: 'dictionaryMng',
          component: dictionaryMng,
        }, {
          path: 'modelMng/:type',
          name: 'modelMng',
          component: modelMng,
        }, {
          path: 'modelAttr/:type/:classname',
          name: 'modelAttr',
          component: modelAttr,
        }, {
          path: 'modelInfo/:type/:oper/:id',
          name: 'modelInfo',
          component: modelInfo,
        }, {
          path: 'attrInfo/:type/:oper/:classname/:column',
          name: 'attrInfo',
          component: attrInfo,
        }, {
          path: 'dimensionMng',
          name: 'dimensionMng',
          component: dimensionMng,
        }, {
          path: 'dimensionMng',
          name: 'dimensionMng',
          component: dimensionMng,
        }, {
          path: 'resourceMng/:type/:id',
          name: 'resourceMng',
          component: resourceMng,
        }, {
          path: 'resourceInfo/:classname/:resid/:type/:viewType/:viewId',
          name: 'resourceInfo',
          component: resourceInfo,
        }, {
          path: 'resourceText/:classname/:resid/:viewType/:viewId',
          name: 'resourceText',
          component: resourceText,
        }, {
          path: 'materialSuiteMng/materialSuiteInfo',
          name: 'materialSuiteInfo',
          component: materialSuiteInfo,
        }, {
          path: 'materialSuiteMng/materialEdit/:type',
          name: 'materialEdit',
          component: materialEdit,
        }, {
          path: 'versionUpload/versionUpload/',
          name: 'versionUpload',
          component: versionUpload,
        },
        {
          path: 'SupplierMng/NewSupplier/:id',
          name: 'NewSupplier',
          component: NewSupplier,
        }, {
          path: 'SupplierMng/SupplierList',
          name: 'SupplierList',
          component: SupplierList,
        },
        {
          path: 'navMng',
          name: 'navMng',
          component: navMng,
        },
        {
          path: 'navAdd/:id/:type',
          name: 'navAdd',
          component: navAdd,
        },
        {
          path: 'navInfo',
          name: 'navInfo',
          component: navInfo,
        }
      ]
    },
    {
      path: '/mainPage',
      name: 'mainPage',
      component: mainPage,
    },
  ]
})
