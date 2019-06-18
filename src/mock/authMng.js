const Mock = require('mockjs');
export var listWithPage =  {
  exception:null,
    status:200,
    results:{
      end: 10,
      pageNum: 1,
      pageSize: 10,
      start: 1,
      startIndex: 0,
      totalPage: 10,
      totalRecord: 66,
      list:List,
    }
};

export var getRole =  {
  exception:null,
  status:200,
  results:[
    {
      acountCount: 0,
      createTime: 1554892870148,
      id: "f7771d3613874b8cb5d0c85cde0ce4f6",
      roleDesc: "生成计划办审核",
      roleName: "externalaudit",
      roleNameZh: "外协审核",
    }
  ]
}

export var purchaseList =  {
    exception:null,
    status:200,
    results:{
      end: 10,
      pageNum: 1,
      pageSize: 10,
      start: 1,
      startIndex: 0,
      totalPage: 10,
      totalRecord: 66,
      list:purchase,
    }
};

export var getItemId = {
    exception:null,
    status:200,
    results:"GX20190418000001"
}