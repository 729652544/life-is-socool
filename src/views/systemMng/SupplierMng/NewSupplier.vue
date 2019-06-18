<template>
    <div class="createExCoor">
        <common-bread class="topBread" :aryBread="aryBread" ></common-bread>
        <div class="formfield">
            <div class="top">
                <div class="recordContent">
                    <p class="formHeader">
                        <span>创建供应商:</span>
                    </p>
                    <el-form class="recordForm" :rules="rules" ref="recordForm" label-width="30%"  :model="recordForm" >
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="供应商编码：" prop="supplierNum" >
                                    <el-input v-model="recordForm.supplierNum" placeholder="请输入供应商编码"></el-input>
                                </el-form-item>       
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="供应商名称：" prop="supplierName">
                                   <el-input v-model="recordForm.supplierName" placeholder="请输入供应商名称"></el-input>
                                </el-form-item>       
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="供应商简称：" prop="supplierAbb">
                                    <el-input v-model="recordForm.supplierAbb" placeholder="请输入供应商简称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">  
                                <el-form-item label="地区名称：" prop="areaName">
                                    <el-input v-model="recordForm.areaName" placeholder="请输入地区名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="发展日期：" prop="deveDate">
                                    <el-date-picker v-model="recordForm.deveDate" :clearable="false" type="datetime" prefix-icon="el-icon-date" placeholder="请输入发展日期"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">  
                                <el-form-item label="联系人：" prop="contacts">
                                    <el-input v-model="recordForm.contacts" placeholder="请输入联系人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系电话：" prop="phoneNum">
                                    <el-input v-model="recordForm.phoneNum" placeholder="请输入联系电话"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">  
                                <el-form-item label="分管部门名称：" prop="depName">
                                    <el-input v-model="recordForm.depName" placeholder="请输入分管部门名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">  
                                <el-form-item label="专营业务员名称：" prop="ProOperaName">
                                    <el-input v-model="recordForm.ProOperaName" placeholder="请输入专营业务员名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label-width="15%" label="备注：" prop="remarks">
                                    <el-input v-model="recordForm.remarks"  type="textarea" maxlength="100" :rows="3" placeholder="请填写备注" ></el-input>
                                    <div class="wordCal">{{recordForm.remarks.length}}/100 &nbsp;您还可以输入{{100-recordForm.remarks.length}}个字</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="formSubField">
                <el-button type="info" class="btn110" @click="backPrePage()">取消</el-button>
                <el-button type="primary" class="btn110" @click="subplanForm()">确认</el-button>  
            </div>
        </div>     
    </div>  
</template>
<script>
import $ from "jquery";
import apiClient from "@/publicJs/apiClient.js";
import UtilService from '@/publicJs/UtilService';
import commonFooter from "@/components/common/commonFooter";
import commonBread from "@/components/common/commonBread";
import Vue from "vue";


export default {
  name: "createExCoor",
  data() {
        var checkPhone = (rule, value, callback) => {
            if(!value){  
                callback(new Error('联系电话不能为空'));       
            }else{
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/         
                if (reg.test(value)) {            
                    callback();
                } else {
                    callback(new Error('请输入正确的手机号'));
                    }        
            }      
        };
        var checkSupplierNum = (rule, value, callback) => {
            this.recordForm.supplierNum = value.trim();
            if(!value){
                 callback(new Error('供应商编码不能为空'));
            }else if(!this.recordForm.supplierNum){
                callback(new Error('供应商编码不能全为空格'));
            }else if(this.recordForm.supplierNum.length>20){
                    callback(new Error('供应商编码不能大于20个字符长度'));
            }else{
                callback()
            }
        };
        var checkSupplierName = (rule, value, callback) => {
            this.recordForm.supplierName = value.trim();
            if(!value){
                callback(new Error('供应商名称不能为空'));
            }else if(!this.recordForm.supplierName){
                    callback(new Error('供应商名称不能全为空格'));
            }else if(this.recordForm.supplierName.length>30){
                    callback(new Error('供应商名称不能大于30个字符长度'));
            }else{
                callback()
            }
        };
        var checkSupplierAbb = (rule, value, callback) => {
            this.recordForm.supplierAbb = value.trim();
            if(!value){
                callback(new Error('供应商简称不能为空'));
            }else if(!this.recordForm.supplierAbb){
                    callback(new Error('供应商简称不能全为空格'));
            }else if(this.recordForm.supplierAbb.length>20){
                    callback(new Error('供应商简称不能大于50个字符长度'));
            }else{
                callback()
            }
        };
        var checkAreaName = (rule, value, callback) => {
            this.recordForm.areaName = value.trim();
            if(!value){
                callback(new Error('地区名称不能为空'));
            }else if(!this.recordForm.areaName){
                    callback(new Error('地区名称不能全为空格'));
            }else if(this.recordForm.areaName.length>20){
                    callback(new Error('地区名称不能大于20个字符长度'));
            }else{
                callback()
            }
        };
        var checkContacts = (rule, value, callback) => {
            this.recordForm.contacts = value.trim();
            if(!value){
                callback(new Error('联系人不能为空'));
            }else if(!this.recordForm.contacts){
                    callback(new Error('联系人不能全为空格'));
            }else if(this.recordForm.contacts.length>20){
                    callback(new Error('联系人不能大于20个字符长度'));
            }else{
                callback()
            }
        };
        
    return {
      aryBread: [
        { name: "系统管理", url: "/systemHome" },
        { name: "供应商管理", url: "/systemHome/SupplierMng/SupplierList" },
        { name: "创建供应商", url: "" }
      ],
      id:'',
      params: {},
      recordForm: {
          supplierNum: '',
          supplierName: '',
          supplierAbb: '',
          areaName: '',
          deveDate: new Date(),
          contacts: '',
          phoneNum: '',
          ProOperaName: '',
          depName: '',
          remarks: '',
      },
      rules:{
        supplierNum: [
          { required: true, validator: checkSupplierNum, trigger: "blur" }
        ],
        supplierName: [
          { required: true, validator: checkSupplierName, trigger: "blur" }
        ],
        supplierAbb: [
          { required:  true, validator: checkSupplierAbb, trigger: "blur" }
        ],
        areaName: [
          { required: true, validator: checkAreaName, trigger: 'blur'  }
        ],
        deveDate: [
          { required: true, message: '发展日期不能为空', trigger: "blur" }
        ],
        contacts: [
          { required: true, validator: checkContacts, trigger: 'blur' }
        ],
        phoneNum: [
          {  required: true,validator: checkPhone, trigger: "blur" }
        ],
        // ProOperaName: [
        //   { required: true, validator: checkWorkContent, trigger: "blur" }
        // ],
        // depName: [
        //   { required: true, message: "工作时间不能为空", trigger: "blur" }
        // ],
      },
    //   pickerOptions0: {
    //       disabledDate(time) {
    //         return time.getTime() < Date.now() - 8.64e7;
    //       }
    //     },
    };
  },
  created(){
        var that = this;
        that.id = that.$route.params.id;
        if(that.id!="null"){
            that.getInfo(that.id)
        }
  },
  methods:{
      //获取详情
      getInfo(id){
          var that = this;
          apiClient.get('ssiteapi/platform/asset/info/getDataById/'+id+'/ResSupplier',{},function(pres){
                if(pres.status == 200){
                    that.params = pres.results;
                    that.recordForm.areaName = pres.results.selfBasicData.ResSupplier.AreaName.value;
                    that.recordForm.contacts = pres.results.selfBasicData.ResSupplier.Contacts.value;
                    that.recordForm.deveDate = pres.results.selfBasicData.ResSupplier.DateOfDevelopment.value;
                    that.recordForm.depName = pres.results.selfBasicData.ResSupplier.Department.value;
                    that.recordForm.supplierName = pres.results.selfBasicData.ResSupplier.NameOfSupplier.value;
                    that.recordForm.ProOperaName = pres.results.selfBasicData.ResSupplier.Salesman.value;
                    that.recordForm.supplierAbb = pres.results.selfBasicData.ResSupplier.SupplierAbbreviation.value;
                    that.recordForm.supplierNum = pres.results.selfBasicData.ResSupplier.SupplierNumber.value;
                    that.recordForm.phoneNum = pres.results.selfBasicData.ResSupplier.Telephone.value;
                    that.recordForm.remarks = pres.results.selfBasicData.ResSupplier.remarks.value;
                }
          })
      },
      //点击确认
      subplanForm(){
            var that = this;
            that.$refs["recordForm"].validate(valid => {
                if (valid) {
                    if(that.id=="null"){//新创建
                        apiClient.get('ssiteapi/platform/asset/info/getPropertyByClassName/ResSupplier',{},function(pres){//获取模型对象
                            if(pres.status == 200){
                                that.params.data = pres.results;
                                that.params.isInherit = false;
                                that.recordForm.deveDate = that.recordForm.deveDate.getTime(); 
                                that.params.data.selfBasicData.ResSupplier.AreaName.value = that.recordForm.areaName;
                                that.params.data.selfBasicData.ResSupplier.Contacts.value = that.recordForm.contacts;
                                that.params.data.selfBasicData.ResSupplier.DateOfDevelopment.value = that.recordForm.deveDate;
                                that.params.data.selfBasicData.ResSupplier.Department.value = that.recordForm.depName;
                                that.params.data.selfBasicData.ResSupplier.NameOfSupplier.value = that.recordForm.supplierName;
                                that.params.data.selfBasicData.ResSupplier.Salesman.value = that.recordForm.ProOperaName;
                                that.params.data.selfBasicData.ResSupplier.SupplierAbbreviation.value = that.recordForm.supplierAbb;
                                that.params.data.selfBasicData.ResSupplier.SupplierNumber.value = that.recordForm.supplierNum;
                                that.params.data.selfBasicData.ResSupplier.Telephone.value = that.recordForm.phoneNum;
                                that.params.data.selfBasicData.ResSupplier.remarks.value = that.recordForm.remarks.trim();
                                apiClient.linkApi('ssiteapi/platform/asset/info/insert','put',that.params,function(pres){//调用新增接口
                                    if(pres.status == 200){ 
                                        that.$router.push("/systemHome/SupplierMng/SupplierList");
                                        that.$message({
                                            type: 'success',
                                            message: '操作成功!'
                                        });
                                    }
                                })
                            };
                        });
                        
                    }else{//修改
                        if(typeof that.recordForm.deveDate != 'number'){
                            that.recordForm.deveDate = that.recordForm.deveDate.getTime(); 
                        }
                        that.params.selfBasicData.ResSupplier.AreaName.value = that.recordForm.areaName;
                        that.params.selfBasicData.ResSupplier.Contacts.value = that.recordForm.contacts;
                        that.params.selfBasicData.ResSupplier.DateOfDevelopment.value = that.recordForm.deveDate;
                        that.params.selfBasicData.ResSupplier.Department.value = that.recordForm.depName;
                        that.params.selfBasicData.ResSupplier.NameOfSupplier.value = that.recordForm.supplierName;
                        that.params.selfBasicData.ResSupplier.Salesman.value = that.recordForm.ProOperaName;
                        that.params.selfBasicData.ResSupplier.SupplierAbbreviation.value = that.recordForm.supplierAbb;
                        that.params.selfBasicData.ResSupplier.SupplierNumber.value = that.recordForm.supplierNum;
                        that.params.selfBasicData.ResSupplier.Telephone.value = that.recordForm.phoneNum;
                        that.params.selfBasicData.ResSupplier.remarks.value = that.recordForm.remarks.trim();;
                        apiClient.post('ssiteapi/platform/asset/info/update',that.params,function(pres){
                            if(pres.status == 200){
                                that.$router.push("/systemHome/SupplierMng/SupplierList");
                                that.$message({
                                    type:'success',
                                    message:'修改成功'
                                })
                            }
                        })
                    }
                } 
            });
      },
      //点击取消
      backPrePage(){
            var that = this;
            that.$router.push("/systemHome/SupplierMng/SupplierList");
      },
  },

  components: {
    commonFooter,
    commonBread
  },

  filters: {
      //时间格式化
      dateFormat: function (value) {
        if (value !== '' && value !== 0) {
          return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
        } else {
          return '暂无'
        }
      },
    }
};
</script>
<style scoped>
.createExCoor {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    background: #efefef;
    padding: 10px 10px 0px 10px;
}
.formfield{
    margin-top: 10px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    background: #fff;
}
.faultWorkList > li {
  line-height: 30px;
  display: inline;
  padding: 10px 10px;
  margin-left: 85%;
}
/* .faultWorkList > li:first-child {
  border-bottom: 2px solid #1081fa;
}
.faultWorkList > li:last-child {
  margin-left: 78%;
} */
.recordContent{
    width: 85%;
    margin: 0 auto;
    height: 100%;
}
.formHeader {
  padding-left: 1%;
  font-size: 16px;
  color: #666666;
  background: #fff;
  padding-top: 64px;
}
.recordForm .el-input {
  width:100%
}
.recordForm .el-select {
  width: 100%
}
.formSubField {
  width: 100%;
  text-align: center;
  margin-top: 40px;
  padding-bottom: 40px;
}
.wordCal {
  width: 100%;
  text-align: right;
  color: #7e7d7d;
  height: 20px;
  line-height: 20px;
}
.buttomcontent{
    width: 85%;
    margin: 0 auto;
    height: 100%;
}


</style>

