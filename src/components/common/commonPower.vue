<template>
    <div class="bigBox">      
        <el-dialog
            class="powerDialog"
            :visible.sync="show"
            width="729px"
            title="断电申请处理"
            :before-close="beforeClose"
            >
            <div class="classTop">
                <ul class="windowLeft">
                    <li>
                        <span>工单ID：</span>
                        <span>{{arrayPower.id}}</span>
                    </li>
                    <li>
                        <span>申请单位：</span>
                        <span>{{arrayPower.receiveRoleName}}</span>
                    </li>
                    <li>
                        <span>工作地点：</span>
                        <span>{{arrayPower.accidentSite}}</span>
                    </li>
                    <li>
                        <span>申请时间：</span>
                        <span>{{arrayPower.applytime|dateFormat}}</span>
                    </li>
                </ul>
                <ul class="windowRight">
                    <li>
                        <span>负责人：</span>
                        <span>{{(arrayPower.receiveClassElement||'--').split('(')[0]}}</span>
                    </li>
                    <li>
                        <span>调度员：</span>
                        <span>{{arrayPower.dispatchPerson}}</span>
                    </li>
                    <li>
                        <span>断电分路：</span>
                        <span class="redCont">{{arrayPower.blackoutSectionName}}</span>
                    </li> 
                </ul>
            </div>
            <div class="classBottom">                                                                          
                <el-form :label-position="labelPosition" ref='formLabelAlign' :model="formLabelAlign" :rules="formLabelAlignRule" class="lowerFrame">
                    <el-form-item label="断电分路:" required prop="blackoutSectionName" style='margin-top:30px;' class="blackoutSectionName">
                        <span class="powerBreak redCont">{{formLabelAlign.blackoutSectionName}}</span>
                    </el-form-item>             
                    <el-form-item label="断电时间：" prop="blackoutTime" required>
                        <el-date-picker v-model="formLabelAlign.blackoutTime" :clearable="false" type="datetime" prefix-icon="el-icon-date" placeholder="选择断电时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="断电核实：" prop="status" >
                            <el-radio-group v-model="formLabelAlign.status">
                                <el-radio label="1">通过</el-radio>
                                <el-radio label="2">不通过</el-radio>
                            </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注：" class="memoClass" :required="formLabelAlign.status=='2'" prop="memo">
                        <el-input type="textarea" :rows="3" v-model="formLabelAlign.memo"  ref="tempReason" size='small' placeholder="最多50个汉字" style="width:70%;" max='50' ></el-input>                                       
                    </el-form-item>
                    
                </el-form>
            </div>      
            <span slot="footer" class="dialog-footer">
                <el-button type='info' class="cancelPowerOff" @click="closeDialog">取 消</el-button>
                <el-button type="primary" class="cancelPowerOpen" @click="closePower">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import apiClient from '@/publicJs/apiClient.js' 
import UtilService from '@/publicJs/UtilService'
import eventBus from '@/publicJs/eventBus.js'
  export default {
    props:{
        processid:{
            type:String,
            default:'',
        },
        isShow:{
            type:Boolean,
            default:false,
        }
    },
    data() {
       var validateMemo = (rule, value, callback) => {
           if(this.formLabelAlign.status=='2'){
               var val = value.trim();
               var len = value.trim().length;
                if (val === '') {
                    callback(new Error('请输入备注'));
                } else if(len>50){
                    callback(new Error('字符长度不得超过50'));
                }else {
                    callback()
                }
           }else{
                callback();
           }
        
      };
      var validatevalidateStatus = (rule, value, callback) => {
           if(this.formLabelAlign.status==''){
                callback(new Error('请先进行断电核实'));
           }else{
                callback();
           }
        
      };
      return {
        tempReason:'',
        labelPosition: 'right',
        formLabelAlign: {
            blackoutSectionName:'',
            blackoutTime:new Date(),
            status:'',
            memo:'',
        },
        formLabelAlignRule:{
            blackoutSectionName:[
                {required: true, message: "请输入地点", trigger: "blur"}
            ],
            blackoutTime:[ {required: true, message: "请输入时间", trigger: "blur"}],
            status:[{validator: validatevalidateStatus,required: true, message: "请先进行断电核实", trigger: "blur"}],
            memo:[
                { message: "请输入备注", trigger: "blur"},
                { validator: validateMemo, trigger: 'blur' }],

        },
        arrayPower:{
            informDepartmentName:'',
            informTime:'',
            receiveClassElement:'',
            dispatchPerson:'',
            blackoutSectionName:'',
            disposeitemid:'',
            receiveRoleName:'',
            accidentSite:'',
            accidentSiteMemo:''
        },
      };
    },
    
    watch: {
        show:function(val){
            if(val==true){
                this.findPowerId();
                if(this.$refs['formLabelAlign']){
                    this.$refs['formLabelAlign'].clearValidate();
                }
            }
        },
    },
    computed:{
        show:function(){
            this.formLabelAlign.blackoutTime = new Date();
            return this.isShow;
        }
    },
    methods: {
        //断电提交
        closePower:function(id){
            var that=this;
            var objUser =  JSON.parse(localStorage.getItem('userInfo'));
            var id = that.processid;
            if(that.formLabelAlign.status == '1'){
                //判断工单有没有被处理过
                apiClient.get('ssiteapi/platform/maintain/api/getLastCirculationLogById/'+id,{},function(pres){
                    if(pres.status == 200){
                        if(
                            pres.results.operateID == 4||
                            pres.results.operateID == 5||
                            pres.results.operateID == 3||
                            pres.results.operateID == 6||
                            pres.results.operateID == 7||
                            pres.results.operateID == 8||
                            pres.results.operateID == 9
                        ){
                            that.$emit('finishWarns',pres.results)
                        }else {
                            var param={
                                processid:that.arrayPower.processid,
                                currentTaskid: that.arrayPower.currentTaskid,
                                operateID: 4,
                                username: objUser.username,
                                taskName: "完成断电",
                                resultValue: 1,
                                memo: that.formLabelAlign.memo.trim(),
                                form: {
                                    blackoutid: that.arrayPower.blackoutid,
                                    blackoutTime: that.formLabelAlign.blackoutTime.getTime(),
                                    initStatus: that.arrayPower.initStatus,
                                    powerTime:that.arrayPower.powerTime,
                                }
                            };
                            apiClient.linkApi('ssiteapi/platform/activity/api/aciupdate','post',param,function(pres){
                                if(pres.status==200&&pres.results==true){  
                                    that.$message({
                                        type: 'success',
                                        message: '断电成功!'
                                    });        
                                    that.closeDialog();  
                                    eventBus.$emit('getAgain',{});             
                                }else{
                                    that.$message({
                                        type: 'warning',
                                        message: '申请失败，点击取消关闭页面!'
                                    });
                                }
                            })
                        }
                    }
                })
                            
            }else{
                that.$refs['formLabelAlign'].validate((valid) => {
                    apiClient.get('ssiteapi/platform/maintain/api/getLastCirculationLogById/'+id,{},function(pres){
                        if(pres.status == 200){
                            if(
                            pres.results.operateID == 4||
                            pres.results.operateID == 5||
                            pres.results.operateID == 3||
                            pres.results.operateID == 6||
                            pres.results.operateID == 7||
                            pres.results.operateID == 8||
                            pres.results.operateID == 9){
                                that.$emit('finishWarns',pres.results)
                            }else {
                                if(valid) {
                                    var param={
                                        processid:that.arrayPower.processid,
                                        currentTaskid: that.arrayPower.currentTaskid,
                                        operateID: 5,
                                        username: objUser.username,
                                        taskName: "驳回断电",
                                        resultValue: 2,
                                        memo: that.formLabelAlign.memo.trim(),
                                        form: {
                                            
                                        }
                                    };
                                    apiClient.linkApi('ssiteapi/platform/activity/api/aciupdate','post',param,function(pres){
                                        if(pres.status==200&&pres.results==true){
                                            eventBus.$emit('getAgain',{});
                                            that.closeDialog();
                                            that.$message({
                                                type: 'success',
                                                message: '操作成功!'
                                            });
                                        }else{
                                            that.$message({
                                                type: 'warning',
                                                message: '申请失败，点击取消关闭页面!'
                                            });
                                        }
                                    })
                                }else {
                                    return false
                                }
                            }
                        }
                    })     
                })
            } 
        },
      findPowerId:function(){
          var that=this;
          
          that.formLabelAlign.status = '';
          that.formLabelAlign.memo = '';
          var obj={
              processid:that.processid
          };
          apiClient.post('ssiteapi/platform/activity/api/qItemCurDetail',obj,function(pres){
            that.arrayPower=pres.results;     
            that.formLabelAlign.blackoutSectionName = pres.results.blackoutSectionName;
            that.formLabelAlign.blackoutTime = new Date();
            
          })
          
       },
        closeDialog:function(){
            var that = this;
            this.$emit('close',{});
            if(this.$route.name == 'scheduleRecord'||this.$route.name == 'scheduleMap'||this.$route.name == 'scheduleTo'){
                eventBus.$emit('getAgain',{})
            }
        },
        beforeClose:function(done){
            this.closeDialog();
        }
      },
     
    filters: {
        //时间格式化
        dateFormat: function (value) {
          if(value!==null&&value!==0){
            return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
          }else {
            return '--'
          }
        },
        timeFormat:function(value){
            if(value==''||value==undefined||value==0){
                return '--';
            }else{
                return Math.ceil((value-0)/(60*1000))+'分钟'; 
            }
            
        }
    }
      
      
  };
</script>
<style >
.applicationOfPower{
    line-height: 20px;
}
.el-dialog__body{
    padding: 10px !important;
}
.el-dialog__footer{
    padding: 30px;
}
.classTop{
    width: 100%;
    height: 100%;
    display: flex;
    border-bottom: 1px solid #d2d2d2;
}
.windowLeft,.windowRight{
    flex-basis: 50%;
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    align-items: left;
   
}
.windowLeft>li,.windowRight>li{
    float: left;
    margin-left: 85px;
    margin-top: 10px;
    color: #999999;
    font-size: 12px;
}
.windowLeft li,.windowRight li{
    line-height: 30px
}
.windowLeft>li:last-child{
    padding-bottom: 20px;
}


.applicationOfPower{
    display: block;
    padding: 10px 10px;
    line-height: 20px;
    border-bottom: 1px solid #d2d2d2;
}
.btnPower{
    font-size: 14px;
    background: #1081fa;
    line-height: 10px;
    color:#fff;
}
.btnPower:hover{
    background: #1081fa;
    color: #fff;
}
.lowerFrame{
    padding-left: 83px;
}
.cancelPowerOff{
    margin-left: 48%;
}
.memoClass label {
    width: 66px!important;
    text-align: right;
}
</style>
