/**
 * Created by yancan
 */
export default{
    aryAuth:[],
    // 获取所有权限点
    getAuths: function(){
      if(this.aryAuth.length>0){

      }else{
        var aryAuth = JSON.parse(localStorage.getItem('authInfo'));
        this.aryAuth = aryAuth;
      }
      return this.aryAuth;
    },
    // 设置权限点
    setAuths:function(aryAuth){
      this.aryAuth = aryAuth;
      localStorage.setItem('authInfo',JSON.stringify(aryAuth));
      return true;
    },
    //根据父id获取权限点
    getAuthsByPId:function(pId){
  
    },
    // 根据id获取对应权限点
    getAuthById:function(){

    },
    clearUser:function(){
      localStorage.removeItem('userInfo');
      localStorage.removeItem('authInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('dictionaryArr');
      localStorage.removeItem('logInId');
    }
}
