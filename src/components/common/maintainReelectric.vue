<template>
    <div class="bigBox">      
        <el-dialog
        class="powerDialog"
        :visible.sync="show"
        width="729px"   
        title="送电申请处理"
        :before-close="beforeClose"
        >
            <div class="classTop">
                <ul class="windowLeft">
                    <li>
                        <span>工单ID：</span>
                        <span>{{arrayPower.id||'--'}}</span>
                    </li>
                    <li>
                        <span>申请单位：</span>
                        <span>{{arrayPower.maintainClassGroup||'--'}}</span>
                    </li>
                    <li>
                        <span>工作地点：</span>
                        <span>{{arrayPower.maintainSection||'--'}}</span>
                    </li>
                    <li>
                        <span>工作内容：</span>
                        <span>{{arrayPower.maintainRemarks||'--'}}</span>
                    </li>
                </ul>
                <ul class="windowRight">
                    <li>
                        <span>负责人：</span>
                        <span>{{(arrayPower.personLiable||'--').split('(')[0]}}</span>
                    </li>
                    <li>
                        <span>调度员：</span>
                        <span>{{arrayPower.dispatcherAccount||'--'}}</span>
                    </li>
                    <li>
                        <span>申请时间：</span>
                        <span>{{arrayPower.applyTime|dateFormat}}</span>
                    </li>
                    <li>
                        <span>断电分路：</span>
                        <span class="redCont">{{arrayPower.powerbreak||'--'}}</span>
                    </li>
                </ul>
            </div>                 
            <div class="classBottom">                                                                          
                <el-form :label-position="labelPosition" ref="formLabelAlign" :model="formLabelAlign" style="padding-left:80px" :rules="object">
                        <el-form-item label="工作地点:" prop="blackoutSectionName" class="lineDividing">
                            <span class="powerBreakOf">{{formLabelAlign.maintainSection}}</span>
                        </el-form-item> 
                        <el-form-item label="断电分路:" prop="blackoutSectionName" class="lineDividing">
                            <span class="powerBreakOf redCont">{{formLabelAlign.powerbreak}}</span>
                        </el-form-item> 
                        <el-form-item label="送电时间:" prop="powerTime" required>
                        <el-date-picker v-model="troubleForm.powerTime" :clearable="false" type="datetime" prefix-icon="el-icon-date" placeholder="选择报修日期"></el-date-picker>
                    </el-form-item>
                </el-form>
            </div>                   
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="closeDialog" class="cancelPowerOff">取 消</el-button>
                <el-button type="primary" @click="reelectricPower" class="cancelPowerOpen">确认送电</el-button>
            </span>
        </el-dialog>
    </div>
   
</template>

<script>
import UtilService from '@/publicJs/UtilService'
import apiClient from '@/publicJs/apiClient.js' 
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
      return {
          tempReason:'',
          labelPosition: 'right',
          formLabelAlign: {
               blackoutSectionName:'',
               powerTime:'',
               powerTime:[
                  {required: true, message: "请输入时间", trigger: "blur"}
               ]
        },
        troubleForm:{
              powerTime:new Date(),
          },
       
        arrayPower:{
            accidentCause:'',
            disposeitemid:'',
            informDepartmentName:'',
            blackoutSectionName:'',
            informTime:'',
            receiveClassElement:'',
            dispatchPerson:'',
            blackoutSectionName:'',    
            powerTime:new Date(),
            blackoutId:''
        },
        object:{},
        taskId:''
      };
    },
   
    watch: {
        show:function(val){
            var that = this;
            if(val==true){
                if(that.processid !== ''){
                    this.findPowerId();
                }
            }
        },
    },
     computed:{
        show:function(){
            this.troubleForm.powerTime = new Date();
            return this.isShow;
        }
    },
    methods: {
        //送电提交
        reelectricPower:function(){
          
            var that=this;
            var objUser =  JSON.parse(localStorage.getItem('userInfo'));
            var id = that.processid
            apiClient.get('ssiteapi/platform/maintain/api/getLastCirculationLogById/'+id,{},function(pres){
                if(pres.status == 200){
                    if(
                        pres.results.operateID == 3||
                        pres.results.operateID == 7||
                        pres.results.operateID == 8||
                        pres.results.operateID == 9
                    ){
                        that.$emit('finishWarns',pres.results)
                    }else {
                        that.$refs['formLabelAlign'].validate((valid) => {
                            if(valid){
                                var param={
                                    processId:that.processid,
                                    operateID: 7,
                                    resultValue: 1,
                                    processor: that.arrayPower.personLiable,
                                    recoveryTime: that.troubleForm.powerTime,
                                    dispatcherAccount:objUser.username,
                                    blackoutId:that.arrayPower.blackoutId,
                                    taskid:that.taskId,
                                };
                                that.$emit('close',{});
                                
                                // that.closeDialog()
                                apiClient.linkApi('ssiteapi/platform/maintain/api/processItem','post',param,function(pres){
                                    if(pres.status==200&&pres.results==true){
                                        that.closeDialog();
                                        that.$message({
                                            type: 'success',
                                            message: '送电成功!'
                                        });
                                        eventBus.$emit('getAgain',{});
                                    }else{
                                        that.$message({
                                            type: 'warning',
                                            message: '操作失败!'
                                        })
                                    }
                                })
                            }else {
                                return false
                            }
                        })
                    }
                }
            })
        },
        findPowerId:function(){
          var that=this;
          var dictionaryArr = JSON.parse(localStorage.getItem('dictionaryArr'));
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
          var that = this;
            this.$emit('close',{});
            if(that.$route.path == '/schedule/maintain' || that.$route.path == '/schedule/maintainInfo'||that.$route.path == '/schedule/interruptRecord'){
                eventBus.$emit('getAgain',{});
            }
    },
    beforeClose(){
        this.closeDialog()
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

.btnbtn{
    position: fixed;
    top: 5%;
    left: 0%;
    height:100%;
    
}
.el-dialog__body{
    padding: 10px !important;
    
}
.el-dialog__footer{
    padding: 30px;
    border-top: none;
}
.powerBreakOf{
    padding-left: 20px;
}
.classTop{
    width: 100%;
    height: 100%;
    display: flex;
   
}

.lineDividing{
    margin-top: 20px;
    padding-left: 10px;
}

.btnPower:hover{
     background: #1081fa;
     color: #fff;
}

</style>
