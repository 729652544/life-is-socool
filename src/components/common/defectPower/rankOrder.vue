<template>
    <div>
        <el-dialog title="缺陷归类" :visible="show" :before-close='closeRank' width="600px">
            <div>
                <el-form label-width="150px" :model="formData" :rules="formDataRule" ref="formDataRule">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工单号:">
                                <span>{{formData.flawNo}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="缺陷类型:">
                                <span>{{formData.flawType}}</span>
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
                                <span>{{formData.flawCnLoca}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="上报时间:">
                                <span>{{formData.reportTime}}</span>
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
                                <span>{{formData.flawCnLoca}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="任务归类" prop="taskClassify">
                                <el-radio v-model="formData.taskClassify" :label="1">检修组处理</el-radio>
                                <el-radio v-model="formData.taskClassify" :label="2">厂商配合</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <p class="decisiveBtn">
                    <el-button @click="closeRank" type="info">取消</el-button>
                    <el-button @click="rankOrder" type="primary">确认</el-button>
                </p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import apiClient from '@/publicJs/apiClient.js'
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
        return{
            formData: {},
            flowobj:{},
            formDataRule:{
                taskClassify:[
                    { required: true,message:'请选择任务归类', trigger:'blur'}
                ]
            }
        }
    },
    computed:{
        show(){
            var that = this;
            if(that.orderId){
                apiClient.get('ssiteapi/platform/substation/flaw/api/detail/'+that.orderId,{},function(pres){
                    if(pres.status == 200){
                        that.formData = pres.results.itemData;
                        that.flowobj = pres.results;
                    }
                })
            }
            return that.isShow;
        }
    },
    watch:{
        show(val){
        }
    },
    methods:{
        closeRank(){
            this.$emit('close',{})
        },
        rankOrder(){
            var that = this;
            that.$refs['formDataRule'].validate(valid=>{
                if(valid){
                    var obj = {
                        processor:JSON.parse(localStorage.getItem('userInfo')).username,
                        processorRole:JSON.parse(localStorage.getItem('userInfo')).roles[0].roleName,
                        processPerson:JSON.parse(localStorage.getItem('userInfo')).acountName,
                        processId:that.formData.processId,
                        operateID:1,
                        taskid:that.flowobj.taskId,
                        resultValue:1,
                        taskClassify:that.formData.taskClassify,
                        flawProcessNo:that.formData.flawProcessNo
                    }
                    apiClient.post('ssiteapi/platform/substation/flaw/api/processItemTask',obj,function(pres){
                        if(pres.status == 200){
                            that.$message({
                                type:'success',
                                message:'归类成功'
                            })
                            that.$emit('close',{});
                        }
                    })
                }
            })   
        }
    }
}
</script>

<style scoped>

.decisiveBtn {
    text-align: center;
}

</style>
