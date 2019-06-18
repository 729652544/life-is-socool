import { login,auth,listItemByDictId3,listItemByDictId89 } from '@/mock/login.js';
import { listWithPage,getRole,purchaseList,getItemId } from '@/mock/warehouseMng.js';


// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  //登录
  'login': login,
  'GET ssiteapi/authm/premission/getPremissionByToken': auth,
  'GET ssiteapi/platform/asset/dict/listItemByDictId/3':listItemByDictId3,
  'GET ssiteapi/platform/asset/dict/listItemByDictId/89':listItemByDictId89,

  //库房管理
  'POST ssiteapi/platform/substation/entryStation/listWithPage': listWithPage,
  'POST ssiteapi/authm/role/getRole': getRole,
  "POST ssiteapi/platform/item/purchase/list":purchaseList,
  'GET ssiteapi/platform/item/itembatch/getItemBatchNO/CG':getItemId,
};
export default{
  getProxy: function(data) {
    return proxy[data];
  }
}