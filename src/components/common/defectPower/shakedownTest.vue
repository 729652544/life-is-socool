<template>
    <div>
        <el-dialog title="调试" :visible="show" :before-close='closeShakedown' width="600px">
            <div>
                <el-form label-width="150px" :model="formData" :rules="formDataRule" ref="formDataRule">
                    <!-- <el-form-item label="工单号"></el-form-item>
                    <el-form-item label="缺陷类型"></el-form-item>
                    <el-form-item label="缺陷地点"></el-form-item>
                    <el-form-item label="上报来源"></el-form-item>
                    <el-form-item label="上报时间"></el-form-item>
                    <el-form-item label="上报单位"></el-form-item>
                    <el-form-item label="上报人名"></el-form-item>
                    <el-form-item label="缺陷描述"></el-form-item>
                    <el-form-item label="缺陷描述"></el-form-item> -->
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工单号:" prop="flawNo">
                                <span>{{formData.flawNo}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="缺陷类型:">
                                <span v-if="formData.flawType == '1273'">硬件设备</span>
                                <span v-if="formData.flawType == '1274'">软件设备</span>
                                <span v-if="formData.flawType == '1275'">其他设备</span>
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
                                <span>{{formData.flawSource}}</span>
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
                                <span>{{formData.flawDetail}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item prop="processStatus" label="是否通过调试:">
                                <el-radio v-model="formData.processStatus" label="2">通过</el-radio>
                                <el-radio v-model="formData.processStatus" label="1">不通过</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>   
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注:" prop="debugMemo" :required="formData.processStatus=='1'">
                                <el-input type="textarea" v-model="formData.debugMemo"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <p class="decisiveBtn">
                    <el-button @click="closeShakedown" type="info">取消</el-button>
                    <el-button type="primary" @click="doShakedownTest">确认</el-button>
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
        var validateMemo = (rule, value, callback) => {
            if(this.formData.processStatus=='1'){
                if(value){
                    var val = value.trim();
                    var len = value.trim().length;
                    if (val === '') {
                        callback(new Error('请输入备注'));
                    } else {
                        callback()
                    }
                }else {
                    callback(new Error('请输入备注'))
                }
            }else {
                callback()
            }
                
        
        };
        return{
            formData:{
                processStatus:'2',
                debugMemo:''
            },
            flowobj:{},
            formDataRule:{
                processStatus:[
                    { required:true, message: "请选择调试结论", trigger: "blur"},
                ],
                debugMemo:[
                    { message: "请输入不通过原因", trigger: "blur"},
                    { validator: validateMemo, trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
        show(){
            var that = this;
            if(that.orderId){
                that.getOrderInfo();
            }
            return this.isShow;
        }
    },
    watch:{
        show(val){
        }
    },
    methods:{
        closeShakedown(){
            this.$emit('close',{})
        },
        doShakedownTest(){
            var that = this;
            that.$refs['formDataRule'].validate(valid=>{
                if(valid){
                    var obj = {
                        processId:that.flowobj.processId,
                        processPerson:JSON.parse(localStorage.getItem('userInfo')).acountName,
                        processAccount:JSON.parse(localStorage.getItem('userInfo')).username,
                        processStatus:that.formData.processStatus,
                        debugMemo:that.formData.debugMemo,
                        flawProcessNo:that.formData.flawProcessNo
                    }
                    apiClient.post('ssiteapi/platform/substation/flaw/api/debugItemTaskProcess',obj,function(pres){
                        if(pres.status == 200){
                            that.$message({
                                type:'success',
                                message:'操作成功'
                            })
                            that.$emit('close',{});
                        }else {
                            that.$message({
                                type:'warning',
                                message:'操作失败'
                            })
                            that.$emit('close',{});
                        }
                    })
                }
            })
                    
        },
        //查详情接口
        getOrderInfo(){
            var that = this;
            apiClient.get('ssiteapi/platform/substation/flaw/api/detail/'+that.orderId,{},function(pres){
                if(pres.status == 200){
                    that.formData = pres.results.itemData;
                    that.flowobj = pres.results;
                }
            })
        },
    }
}
</script>

<style scoped>

.decisiveBtn {
    text-align: center;
}

</style>
