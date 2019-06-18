<template>
    <div class="openDoor">
            <el-dialog title="远程开门" :visible.sync="show" width="729px" :before-close="beforeClose">
                <div class="top">
                    <el-form label-width="100px" >
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="进站类型：" >
                                    <span v-if="applicaDetails.entryStationType==1">任务进站</span>
                                    <span v-if="applicaDetails.entryStationType==2">临时进站</span>
                                </el-form-item>       
                            </el-col>
                            <el-col :span="12">  
                                <el-form-item label="关联工单：" >
                                    <span v-if="applicaDetails.entryStationType=='1'"><p @click="taskj" class="relatecls">{{applicaDetails.relationTaskNo.id1}}</p></span>
                                    <span v-if="applicaDetails.entryStationType=='2'">--</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="进站地点：" >
                                    <span>{{applicaDetails.entryStationLocalCn}}</span>
                                </el-form-item>       
                            </el-col>
                            <el-col :span="12">  
                                <el-form-item label="申请单位：" >
                                    <span>{{applicaDetails.applyDeptCn }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="申请人员：" >
                                    <span>{{applicaDetails.applyPerson}}</span>
                                </el-form-item>       
                            </el-col>
                            <el-col :span="12">  
                                <el-form-item label="随同人员：" >
                                    <span v-if="applicaDetails.supportName!=''">{{applicaDetails.supportName}}</span>
                                    <span v-if="applicaDetails.supportName==''">--</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="进站原因：" >
                                    <span>{{applicaDetails.entryStationReason}}</span>
                                </el-form-item>       
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="bottom">
                    <el-form label-width="100px"  
                    ref="applicaDetails"
                    :rules="applicaDetailsRule"
                    :model="applicaDetails" >
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="处理时间：" prop="processTime" >
                                    <el-date-picker
                                        v-model="applicaDetails.processTime"
                                        :clearable="false"
                                        type="datetime"
                                        :picker-options="pickerOptions0"
                                        prefix-icon="el-icon-date"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-form-item>      
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="审核操作：" prop="auditStatus">
                                    <el-radio-group  v-model="applicaDetails.auditStatus">
                                        <el-radio label="1" @click="applicaDetails.auditMemo='--'">同意</el-radio>
                                        <el-radio label="2" @click="applicaDetails.auditMemo=''">不同意</el-radio>
                                    </el-radio-group>
                                </el-form-item>       
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item v-if="applicaDetails.auditStatus==2" label="备注说明：" prop="auditMemo">
                                    <el-input type="textarea" v-model="applicaDetails.auditMemo" maxlength="100"></el-input>
                                    <div class="wordCal">{{applicaDetails.auditMemo.length}}/100 &nbsp;您还可以输入{{100-applicaDetails.auditMemo.length}}个字</div>
                                </el-form-item>       
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="formSubField">
                                    <el-button type="info" class="btn110" @click="Canceloper">取消</el-button>
                                    <el-button type="primary" class="btn110" @click="Confirmoper">确认</el-button>  
                                </div>
                            </el-col>    
                        </el-row>
                    </el-form>
                </div>
            </el-dialog>
        </div>
</template>
<script>
import apiClient from '@/publicJs/apiClient.js' 
import UtilService from '@/publicJs/UtilService'
import eventBus from '@/publicJs/eventBus.js'
export default {
    name:'openDoorApplication',
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
    data(){
        return{
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            dialogTableVisible: false,
            applicaDetails: {},
            applicaDetailsRule: {
                processTime:[{ required: true, message: '处理时间不能为空', trigger: "blur" }],
                auditStatus:[{ required: true, message: '审核操作不能为空', trigger: "change" }],
                auditMemo:[{ required: true, message: '备注说明不能为空', trigger: "blur" }],
            },
        }
    },
    watch: {
        show:function(val){
            if(val==true){
                this.findPowerId();
                if(this.$refs['applicaDetails']){
                    this.$refs['applicaDetails'].clearValidate();
                }
            }
        },
    },
    computed:{
        show:function(){
            return this.isShow;
        }
    },
    methods:{
        //确认开门操作
        Confirmoper(){
          var that =this;
          if(that.applicaDetails.auditStatus==0){//为了配合表单验证
              that.applicaDetails.auditStatus = null;
          }
          that.$refs["applicaDetails"].validate(valid => {
              if(valid){
                    // if(that.applicaDetails.auditStatus==1){
                    //   that.applicaDetails.auditMemo = null;
                    // }
                    if(that.applicaDetails.auditStatus==1||that.applicaDetails.auditStatus==2){
                        that.applicaDetails.processStatus = 2
                    }
                    that.applicaDetails.auditAccount = JSON.parse(localStorage.getItem("userInfo")).username;
                    that.applicaDetails.auditPerson = JSON.parse(localStorage.getItem("userInfo")).acountName;
                    that.applicaDetails.processTime = that.applicaDetails.processTime.getTime();
                    that.applicaDetails.relationTaskNo = JSON.stringify(that.applicaDetails.relationTaskNo);
                    apiClient.post('ssiteapi/platform/substation/entryStation/audit',that.applicaDetails,function(pres){
                        if(pres.status == 200 && pres.results == true){
                            that.$message({
                            type:'success',
                            message:'审批成功！'
                            })
                        }else{
                            that.$message({
                            type:'error',
                            message:'审批失败！'
                            })
                        }
                        that.beforeClose();
                    })
              }
          });
        },
        //取消开门操作
        Canceloper(){
            var that = this;
            that.beforeClose();
        },
        //关闭审批弹窗
        beforeClose:function(){
            var that = this;
            this.$emit('close',{});
            if(this.$route.name == 'inboundManagementList'||this.$route.name == 'InboundInfo'){
                eventBus.$emit('getAgain',{})
            }
        },
        //查找详情
        findPowerId:function(){
          var that=this;
          apiClient.post('ssiteapi/platform/substation/entryStation/detailById/'+that.processid,{},function(pres){
              if(pres.status==200){
                that.applicaDetails = pres.results;
                that.applicaDetails.auditMemo = '';
                that.applicaDetails.processTime = new Date();
                if(that.applicaDetails.relationTaskNo!=null){
                    that.applicaDetails.relationTaskNo = JSON.parse(that.applicaDetails.relationTaskNo);
        
                }
              }
          })
        },
        //点击关联工单号，跳转关联工单详情
        taskj:function(){
            var that=this;
            if(that.applicaDetails.relationTaskType=="flaw"){
                that.$router.push('/powerTransformation/defectInfo/'+that.applicaDetails.relationTaskNo.id2+'/'+0);
            }else{
                that.$router.push('/powerTransformation/tasksPerformedInfo/'+that.applicaDetails.relationTaskNo.id2+'/'+0) ;
            }
            that.$emit('close',{})
        },
    }
}
</script>
<style>
    .el-form-item {
        margin-bottom: 0px!important; 
    }
    .top{
        padding-bottom: 15px;
    }
    .bottom{
        padding-top: 15px;
        border-top: 1pt solid #DDDDDD;
    }
    .wordCal {
        width: 100%;
        text-align: right;
        color: #7e7d7d;
        height: 20px;
        line-height: 20px;
    }
    .formSubField {
        width: 100%;
        text-align: center;
        margin-top: 40px;
        padding-bottom: 40px;
    }
    .relatecls{
        color: #1081fa;
        cursor: pointer;
    }
</style>



