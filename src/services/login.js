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
  //登录
  login:'POST login',
  auth:'GET ssiteapi/authm/premission/getPremissionByToken',
}