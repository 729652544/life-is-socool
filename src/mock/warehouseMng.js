const Mock = require('mockjs');
let List = [];
for (let i = 0; i < 10; i++) {
  List.push({
    id:i,
    date: Mock.Random.date(),
    name: Mock.Random.cname(),
    address:Mock.mock('@county(true)'),
    num: Mock.mock({"number|1-100": 1}).number,
    desc: "2222",
    tag: "公司"
  })
}

let purchase = [];
for (let i = 0; i < 10; i++) {
  purchase.push({
    "itemID": "CG2019"+Mock.mock({"number|1-100": 100}).number,
    "type": Mock.mock({"array|1": ["1702","1703","1704"]}).array,
    "businessType": Mock.mock({
      "array|1": [
        "1705",
        "1706",
        "1707"
      ]
    }).array,
    "createtime": 1541353958340,
    "supplierName": "杨州电车配件公司",
    "departID": "采购部门ID",
    "departName": "采购部门",
    "buildPersonID": "业务员",
    "buildPersonName": "张三",
    "taxrate": Mock.mock({
      "number|1-100.1-10": 1
    }).number,
    "payConditaion": "付款条件",
    "currency": "币种",
    "excrate": 1.2,
    "planToTime": 1541353958340,
    "budgetCode": "预算编码",
    "status": 1,
    "purchaseStatus":2,
    "memo":'备注'
   })
}

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