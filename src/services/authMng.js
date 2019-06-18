export default{
  setUrl:function(name,data){
    let spliceUrl = this[''+name+''].split('$param');
    let newUrl = spliceUrl[0];
    if(data.length>0){
      data.map((item,index)=>{
        if(spliceUrl[index+1]){
          newUrl = newUrl + item + spliceUrl[index+1];
        }
        else {
          newUrl = newUrl + item;
        }
      })
    }
    return newUrl;
  },
  // 部门树
  departTree:'POST ssiteapi/authm/dept/getDept',
  // 部门列表
  departList:'POST ssiteapi/authm/dept/listAcount',
  // 修改的数据请求
  departUpdate:'POST ssiteapi/authm/dept/update',
  //创建的数据请求
  departInsert:'PUT sy_i_platform/interface/rest/depart/insert',
  // 删除
  departDelete: 'DELETE ssiteapi/authm/dept/delete/$param',



  //修改禁止状态
  userUpdate: 'POST ssiteapi/authm/acount/update',
  //创建用户的数据请求
  userInsert:'PUT ssiteapi/authm/acount/insert',
  // 点击编辑用户ID
  userGetById: 'GET ssiteapi/authm/acount/getById/$param',
  //根据部门查询该部门下有多少账号
  userListAcountCount:'POST ssiteapi/authm/dept/listAcountCount',
  // 批量删除
  userDelete:'POST ssiteapi/authm/acount/delete',



  //查询所属角色
  roleGetName:'POST ssiteapi/authm/role/getRole',
  //创建角色
  roleInsert:'PUT ssiteapi/authm/role/insert',
  // 点击编辑用户ID
  roleGetById: 'GET ssiteapi/authm/role/getById/$param',
  // 修改
  roleUpdate:'POST ssiteapi/authm/role/update',
  // 删除jiaose
  roleDelete: 'DELETE ssiteapi/authm/role/delete/$param',
  // 查询有多少成员
  roleListAcountCount:'POST ssiteapi/authm/role/listAcountCount',
  //查询具体的成员
  roleListAcount:'POST ssiteapi/authm/role/listAcount',
  //移除成员
  roleDelAcount:'POST ssiteapi/authm/role/delAcount',



  //查询所有的权限点
  preGetAll: 'GET ssiteapi/authm/premission/getAllPremission/$param',
  newpreGetAll: 'GET sy_i_platform/interface/rest/role/treeList',
  // 获取权限点
  preGetByRid: 'GET ssiteapi/authm/premission/getPremissionByRid/$param',
  //权限点绑定
  preForRole:'PUT ssiteapi/authm/premission/addPremissionForRole',
}
