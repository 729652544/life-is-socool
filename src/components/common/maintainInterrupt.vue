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
                            <span>{{arrayPower.maintainClassGroup}}</span>
                        </li>
                        <li>
                            <span>工作地点：</span>
                            <span>{{arrayPower.maintainSection}}</span>
                        </li>
                        <li>
                            <span>申请时间：</span>
                            <span>{{arrayPower.applyTime|dateFormat}}</span>
                        </li>
                    </ul>
                    <ul class="windowRight">
                <li>
                    <span>负责人：</span>
                    <span>{{(arrayPower.personLiable||'--').split('(')[0]}}</span>
                </li>
                <li>
                    <span>断电分路：</span>
                    <span class="redCont">{{arrayPower.powerbreak}}</span>
                </li>
                <li>
                    <span>工作内容：</span>
                    <span>{{arrayPower.maintainRemarks}}</span>
                </li> 
            </ul>
            </div>
            <div class="classBottom">                                                                          
                <el-form :label-position="labelPosition" ref='formLabelAlign' :model="formLabelAlign" label-width="93px" :rules="formLabelAlignRule" class="lowerFrame">
                    <el-form-item label="工作地点:" prop="blackoutSectionName" style='margin-top:30px;' class="blackoutSectionName">
                        <span class="powerBreak">{{formLabelAlign.maintainSection}}</span>
                    </el-form-item>   
                    <el-form-item label="断电分路:" prop="blackoutSectionName" class="blackoutSectionName">
                        <span class="powerBreak redCont">{{formLabelAlign.powerbreak}}</span>
                    </el-form-item>             
                    <el-form-item label="断电时间:" required>
                        <el-date-picker v-model="formLabelAlign.blackoutTime" :clearable="false" type="datetime" prefix-icon="el-icon-date" placeholder="选择断电时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="断电核实:" prop="status" >
                            <el-radio-group v-model="formLabelAlign.status">
                                <el-radio label="1">通过</el-radio>
                                <el-radio label="2">不通过</el-radio>
                            </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注:" class="memoClass" :required="formLabelAlign.status=='2'" prop="memo">
                        <el-input type="textarea" :rows="3" v-model="formLabelAlign.memo"  ref="tempReason" size='small' style="width:70%;" max='50' ></el-input>                                       
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
            blackoutTime:[ {required: true, message: "请输入时间", trigger: "blur"}],
            status:[{validator: validatevalidateStatus,required: true, message: "请先进行断电核实", trigger: "blur"}],
            memo:[{ validator: validateMemo, trigger: 'blur' }],

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
        taskId:''
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
        closePower:function(){
            var that=this;
            var objUser =  JSON.parse(localStorage.getItem('userInfo'));
            var id = that.processid;
            if(that.formLabelAlign.status == '1'){
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
                                processId:that.processid,
                                operateID: 4,
                                resultValue: 1,
                                processor: that.arrayPower.personLiable,
                                dispatcherAccount:objUser.username,
                                memo: that.formLabelAlign.memo.trim(),
                                blackoutId:that.arrayPower.blackoutId,
                                blackoutTime:that.formLabelAlign.blackoutTime.getTime(),
                                taskid: that.taskId,
                            };
                            apiClient.linkApi('ssiteapi/platform/maintain/api/processItem','post',param,function(pres){
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
                                        processId:that.processid,
                                        operateID: 5,
                                        resultValue: 2,
                                        processor: that.arrayPower.personLiable,
                                        dispatcherAccount:objUser.username,
                                        memo: that.formLabelAlign.memo.trim(),
                                        taskid: that.taskId,
                                        blackoutId:that.arrayPower.blackoutId,
                                        
                                    };
                                    apiClient.linkApi('ssiteapi/platform/maintain/api/processItem','post',param,function(pres){
                                        if(pres.status==200&&pres.results==true){
                                            that.closeDialog();
                                            eventBus.$emit('getAgain',{});
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
          var dictionaryArr = JSON.parse(localStorage.getItem('dictionaryArr'));
          that.formLabelAlign.status = '';
          that.formLabelAlign.memo = '';
          var obj={
              processId:that.processid
          };
          apiClient.post('ssiteapi/platform/maintain/api/getDetailById',obj,function(pres){
            that.arrayPower=pres.results.itemData;
            that.taskId = pres.results.taskId;
            var arr = [],str = '';
            if(that.arrayPower.powerbreak !== ""){
                arr = that.arrayPower.powerbreak.split(';')
                arr.forEach(function(item,ind){
                    var a;
                    dictionaryArr.forEach(function(item2,ind2){
                        if(item2.itemId == item){
                            a = item2.itemName;
                        }
                    })
                    str += ','+a;
                })
                that.arrayPower.powerbreak = str.slice(1);
            }
            
            that.formLabelAlign.maintainSection=pres.results.itemData.maintainSection;
            that.formLabelAlign.powerbreak = pres.results.itemData.powerbreak;
          })
          
       },
       
        closeDialog:function(){
            var that = this
            this.$emit('close',{});
            if(that.$route.path == '/schedule/maintain' || that.$route.path == '/schedule/maintainInfo'||that.$route.path == '/schedule/interruptRecord') {
                eventBus.$emit('getAgain',{});
            }
        },
        beforeClose:function(){
            this.closeDialog();
        },
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
