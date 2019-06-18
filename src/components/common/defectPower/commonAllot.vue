<template>
    <el-dialog title="工作分配" :visible.sync='show' class="allotDialog" width="729px" :before-close='closeAllot'>
        <el-form :model='formData' :rules="formDataRule" ref="formData" label-width="150px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="工单号:" prop="flawNo"><span>{{formData.flawNo}}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="缺陷类型:">
                        <span>{{filterType(formData.flawType)}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="缺陷地点:">
                        <span>{{formData.flawCnLoca}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上报来源:">
                        <!-- <span>{{formData.flawSource}}</span> -->
                        <span v-if="formData.flawSource == 1">厂站</span>
                        <span v-if="formData.flawSource == 2">巡检组</span>
                        <span v-if="formData.flawSource == 3">监控中心</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="上报时间:">
                        <span>{{formData.reportTime|dateFormat}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上报单位:">
                        <span>{{formData.reportDept}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="上报人名:">
                        <span>{{formData.reportMan}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="缺陷描述:">
                        <span>{{formData.flawDetail}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="截止日期" prop="endTime" v-show="userInfo.roleName == 'tsmanager'">
                        <el-date-picker
                            type="datetime"
                            v-model="formData.endTime"
                            prefix-icon="el-icon-date"
                            placeholder="选择截止日期"
                            :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="任务归类" prop="taskClassify">
                        <el-radio-group v-model="formData.taskClassify" @change="classifyChange">
                            <el-radio :label="1">检修组解决</el-radio>
                            <el-radio :label="2">厂商处理</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="指派班组" prop="assignType"  :required="formData.taskClassify==1" v-show="formData.taskClassify==1">
                        <el-radio-group v-model="formData.assignType" @change="changeAssignType">
                            <el-radio :label="1">按组分配</el-radio>
                            <el-radio :label="2">按人员分配</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="检修班组" prop="assignGroupNO"  :required="formData.assignType==1&&formData.taskClassify==1" v-show="formData.assignType==1&&formData.taskClassify==1">
                        <el-select v-model="formData.assignGroupNO" placeholder="请选择检修班组">
                            <el-option v-for="(item,ind) in appointGroup" :key="ind" :label="item.roleName" :value="item.roleId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="负责人" prop="principalAccount" :required="formData.assignType==2&&formData.taskClassify==1" v-show="formData.assignType==2&&formData.taskClassify==1">
                        <el-select v-model="formData.principalAccount" placeholder="请选择负责人" @change="changePrincipal">
                            <el-option-group
                                v-for="group in aryFunctionary"
                                :key="group.roleId"
                                :label="group.roleName">
                                <el-option v-for="(item,ind) in group.userArray" :key="ind" :label="item.accountName" :value="item.userName"></el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item> 
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="配合人员" prop="supportAccount" :required="formData.assignType==2&&formData.taskClassify==1" v-show="formData.assignType==2&&formData.taskClassify==1">
                        <el-select v-model="formData.supportAccount" @change="changeSupper" multiple collapse-tags placeholder="请选择配合人员">
                            <el-option-group
                                v-for="group in aryCooperating"
                                :key="group.roleId"
                                :label="group.roleName">
                                <el-option v-for="(item2,ind) in group.userArray" :key="ind" :label="item2.accountName" :disabled="item2.disabled" :value="item2.userName"></el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item> 
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <p style="textAlign:center;">
                        <el-button type="info" @click="closeAllot">取消</el-button>
                        <el-button type="primary" @click="doAllot">确定</el-button>
                    </p>
                </el-col>
            </el-row> 
        </el-form>
    </el-dialog>
</template>

<script>
import apiClient from '@/publicJs/apiClient.js'
import UtilService from '@/publicJs/UtilService'
import Vue from 'vue'
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false,
        },
        orderId:{
            type:String,
            default:''
        }
    },
    data(){
        var assignGroupNOFN = (rule, value, callback)=>{
            if(this.formData.assignType==1&&this.formData.taskClassify==1&&!value){
                callback(new Error(rule.message))
            }
            else{
                callback()
            }
        }
        var principalAccountFN = (rule, value, callback)=>{
            if(this.formData.assignType==2&&this.formData.taskClassify==1&&!value){
                callback(new Error(rule.message))
            }
            else{
                callback()
            }
        }
         var supportAccountFN = (rule, value, callback)=>{
            if(this.formData.assignType==2&&this.formData.taskClassify==1&&value.length<=0){
                callback(new Error(rule.message))
            }
            else{
                callback();
            }
        }
        var assignTypeFn = (rule,value,callback) => {
            callback()
        }
        return{
            appointGroup:[],
            formData:{},
            formDataRule:{
                endTime:[
                    { required: true,message:'请选择截止时间', trigger:'blur'}
                ],
                taskClassify:[
                    { required: true,message:'请选择任务归类', trigger:'blur'}
                ],
                assignGroupNO:[
                    { message:'请选择检修班组', trigger:'blur',validator:assignGroupNOFN}
                ],
                principalAccount:[
                    { message:'请选择负责人', trigger:'blur',validator:principalAccountFN}
                ],
                supportAccount:[
                    { message:'请选择配合人员', trigger:'blur',validator:supportAccountFN}
                ],
                assignType:[
                    { message:'请选择指派班组', trigger:'blur', validator:assignTypeFn}
                ]
            },
            flowobj:{},
            aryFunctionary:[],
            aryCooperating:[],
            userInfo:{},
            defTpAry:[],
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
        }
    },
    computed:{
        show(){
            var that = this;
            if(that.orderId){
                //打开弹框，先查详情
                that.getOrderInfo();
                //查询指派班组，负责人信息
                that.getGroupInfo();
                //查询当前账号角色
                that.getRole();
                //配合人默认为空 清空配合人
                that.aryCooperating = [];
                //查processNo
                that.getProcessNo();
                //查缺陷类型
                that.getDefTyDic();
            }
            return this.isShow;
        }
    },
    watch:{
        show(val){
        }
    },
    filters:{
        dateFormat: function (value) {
          if(value!==''&&value!==0){
            return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
          }else {
            return '暂无'
          }
        },
    },
    methods:{
        //过滤缺陷类型字
        filterType(val){
            var that = this;
            var str = '';
            that.defTpAry.forEach(function(item,ind){
                if(item.itemId == val){
                    str = item.itemName;
                }
            })
            if(str == ''){
                str = '--';
            }
            return str;
        },
        //获取缺陷类型字典
        getDefTyDic(){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/dict/listItemByDictId/89',{},function(pres){
                if(pres.status == 200){
                    that.defTpAry = pres.results;
                }
            })
        },
         //根据负责人禁用配合人
        changePrincipal(val){
        var that = this;
            that.aryCooperating = that.aryFunctionary;
            that.aryCooperating.forEach(function(item,ind){
                item.userArray.forEach(function(item2,ind2){
                    if(item2.userName == val){
                        Vue.set(that.aryCooperating[ind].userArray[ind2],'disabled',true);
                    }else {
                        Vue.set(that.aryCooperating[ind].userArray[ind2],'disabled',false);
                    }
                })
            })
        },
        //查详情接口
        getOrderInfo(){
            var that = this;
            apiClient.get('ssiteapi/platform/substation/flaw/api/detail/'+that.orderId,{},function(pres){
                if(pres.status == 200){
                    var obj = {
                        principalAccount:'',
                        supportName:[],
                        supportAccount:[],
                        assignType:'',
                        assignGroupNO:'',
                        assignGroupName:'',
                    }
                    that.formData = Object.assign(obj,pres.results.itemData);
                    that.flowobj = pres.results;
                }
            })
        },
        getProcessNo(){
            var that = this;
            apiClient.get('ssiteapi/platform/substation/flaw/listProcessRecord/'+that.orderId,{},function(pres){
                if(pres.status == 200){
                    that.formData.flawProcessNo = pres.results.length>0?pres.results[pres.results.length-1].flawProcessNo:1;
                    
                }
            })
        },
        
        //查班组/负责人接口
        getGroupInfo(){
            var that = this;
            apiClient.get('ssiteapi/authm/role/getRoleAccount/overhaul',{},function(pres){
                if(pres.status == 200){
                    that.appointGroup = pres.results;
                    that.aryFunctionary = pres.results;
                    that.aryFunctionary.forEach(function(item,ind){
                        item.userArray.forEach(function(item2,ind2){
                            that.aryFunctionary[ind].userArray[ind2].disabled = false;
                        })
                    })
                }
            })
        },
        doAllot(){
            var that = this;
            that.formData;
            that.$refs['formData'].validate((valid,val)=>{
                if(valid){
                    //判断是按组还是按人员
                    if(that.formData.assignType == 1){
                    //根据指派班组英文名拿到中文名

                        that.formData.supportName = [];   
                        that.formData.supportAccount = [];  
                        that.formData.principalAccount = '';
                        that.formData.principalName = '';  

                        that.appointGroup.forEach(function(item,ind){
                            if(item.roleId == that.formData.assignGroupNO){
                                that.formData.assignGroupName = item.roleName;
                            }
                        })
                    }else if (that.formData.assignType == 2){
                        that.formData.assignGroupName = '';
                         that.formData.assignGroupNO = '';
                        //根据负责人英文拿到中文名
                        that.aryFunctionary.forEach(function(item,ind){
                            item.userArray.forEach(function(item2,ind2){
                                //负责人
                                if(item2.userName == that.formData.principalAccount){
                                    that.formData.principalName = item2.accountName;
                                }
                                //配合人员
                                that.formData.supportAccount.forEach(function(item3,ind3){
                                    if(item2.userName == that.formData.supportAccount[ind3]){
                                        that.formData.supportName.push(item2.accountName);
                                    }
                                })
                            })
                        })
                        that.formData.supportName = that.formData.supportName.toLocaleString();
                        that.formData.supportAccount = that.formData.supportAccount.toLocaleString();
                    }
                    //工单状态为待归类，先归类工单，在确定是否分配
                    if(that.formData.flawStatus == 1){
                        var obj1 = {
                            processId:that.formData.processId,
                            operateID:1,
                            resultValue:1,
                            processor:that.userInfo.username,
                            processorRole:that.userInfo.roleName,
                            taskid:that.flowobj.taskId,
                            taskClassify:that.formData.taskClassify,
                            processPerson:JSON.parse(localStorage.getItem('userInfo')).acountName,
                            processAccount:JSON.parse(localStorage.getItem('userInfo')).username,
                            flawProcessNo:that.formData.flawProcessNo?that.formData.flawProcessNo:1,
                            flawNo:that.formData.flawNo
                        }
                        //先归类工单
                        apiClient.post('ssiteapi/platform/substation/flaw/api/processItemTask',obj1,function(pres){
                            if(pres.status == 200){
                                //判断工单是否需要检修组解决。如果是，拿到负责人/班组
                                if(that.formData.taskClassify == 1){
                                    //查详情拿到新的taskid
                                    apiClient.get('ssiteapi/platform/substation/flaw/api/detail/'+that.orderId,{},function(pres){
                                        if(pres.status == 200){
                                            // that.formData = pres.results.itemData;
                                            that.flowobj = pres.results;
                                            var obj2 = {
                                                operateID:2,
                                                resultValue:that.formData.taskClassify == 1 ? 1 : 3,
                                                processId:that.formData.processId,
                                                processor:that.userInfo.username,
                                                taskid:that.flowobj.taskId,
                                                assignType:that.formData.assignType,
                                                taskClassify:that.formData.taskClassify,
                                                deadline:that.formData.endTime.getTime(),//截止日期
                                                assignGroupNO:that.formData.assignGroupNO,
                                                assignGroupName:that.formData.assignGroupName,
                                                principalAccount:that.formData.principalAccount,
                                                principalName:that.formData.principalName,
                                                supportAccount:that.formData.supportAccount,
                                                supportName:that.formData.supportName,
                                                processPerson:JSON.parse(localStorage.getItem('userInfo')).acountName,
                                                processAccount:JSON.parse(localStorage.getItem('userInfo')).username,
                                                flawProcessNo:that.formData.flawProcessNo?that.formData.flawProcessNo:1,
                                                flawNo:that.formData.flawNo
                                            }
                                            apiClient.post('ssiteapi/platform/substation/flaw/api/processItemTask',obj2,function(pres){
                                                if(pres.status == 200 && pres.results == true){
                                                    that.$message({
                                                        type:'success',
                                                        message:'分配成功'
                                                    })
                                                    that.$emit('close',{});
                                                }
                                            })
                                        }
                                    })
                                //如果是厂商解决
                                }else if(that.formData.taskClassify == 2){
                                    that.$message({
                                        type:'success',
                                        message:'分配成功'
                                    });
                                    that.$emit('close',{});
                                }
                            }
                        })
                        //工单为待分配，直接进行分配
                    }else if(that.formData.flawStatus == 2){
                        var obj = {
                            operateID:2,
                            resultValue:that.formData.taskClassify ==  1 ? 1 : 3 ,
                            processId:that.formData.processId,
                            processor:that.userInfo.username,
                            taskid:that.flowobj.taskId,
                            assignType:that.formData.assignType,
                            taskClassify:that.formData.taskClassify,
                            deadline:that.formData.endTime.getTime(),//截止日期,
                            assignGroupNO:that.formData.assignGroupNO,
                            assignGroupName:that.formData.assignGroupName,
                            principalAccount:that.formData.principalAccount,
                            principalName:that.formData.principalName,
                            supportAccount:that.formData.supportAccount,
                            supportName:that.formData.supportName,
                            processPerson:JSON.parse(localStorage.getItem('userInfo')).acountName,
                            processAccount:JSON.parse(localStorage.getItem('userInfo')).username,
                            flawProcessNo:that.formData.flawProcessNo?that.formData.flawProcessNo:1,
                            flawNo:that.formData.flawNo
                        }
                        apiClient.post('ssiteapi/platform/substation/flaw/api/processItemTask',obj,function(pres){
                            if(pres.status == 200 && pres.results == true){
                                that.$message({
                                    type:'success',
                                    message:'分配成功'
                                });
                                that.$emit('close',{});
                            }
                        })
                    }
                }
            })
                    
            
        },
        changeAssignType(val){
            var that = this;
            if(val == '1'){
                that.aryCooperating = [];      
                 var obj = {
                        supportName:[],
                        supportAccount:[],
                        principalAccount:'', 
                        principalName:''
                    }
                that.formData = Object.assign(that.formData,obj)  
            }
            else if (val == '2'){
                that.formData.assignGroupNO = '';
            }
        },
        changeSupper(val){
            var that = this;
            if(val&&val.length>5){
                that.$message({
                type:'warning',
                message:'配合人员最多选择5个'
                })
                that.formData.supportAccount = val.slice(0,5);
            }
        },
        closeAllot(){
            this.$emit('close',{})
        },
        classifyChange(val){
            var that = this;
            if(val == '2'){
                // that.formData.assignType = '';
                // that.formData.assignGroupNO = '';
                // that.formData.principalAccount = '';
                // that.formData.supportAccount = [];
            }  
        },
        getRole(){
            var that = this;
            that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if(that.userInfo.roles.length>0){
                that.userInfo.roles.forEach(function(item,ind){
                    if(item.roleName == 'tsmanager'){
                        that.userInfo.roleName = 'tsmanager'
                    }
                })
            }
        },
    }
}
</script>

<style>

</style>
