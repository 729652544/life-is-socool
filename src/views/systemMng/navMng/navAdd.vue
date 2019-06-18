<template>
    <div class="navAdd">
        <common-bread :aryBread="aryBread" ></common-bread>
        <div class="formContent">
            <!-- <div class="menuField">
                <ul class="faultWorkList">
                    <li>导航页</li>
                    <li>工单号：</li>
                </ul>
            </div> -->
            <el-form :model="addForm" ref="addForm" label-width="180px" :rules="addFormRule">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="导航ID" prop="resourceId">
                            <el-input v-model="addForm.resourceId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="导航名称" prop="name">
                            <el-input v-model="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="导航父ID" prop="resourcePid">
                            <el-input v-model="addForm.resourcePid" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="导航URL" prop="url">
                            <el-input v-model="addForm.url"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    
                    <el-col :span="12">
                        <el-form-item label="排序" prop="sort">
                            <el-input v-model="addForm.sort"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="导航图标" prop="icon">
                            <el-input v-model="addForm.icon"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="页面参数" prop="pageParams">
                            <el-input v-model="addForm.pageParams"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="导航类型" prop="resourceType">
                            <el-radio-group v-model="addForm.resourceType">
                                <el-radio :label="'1'">PC</el-radio>
                                <el-radio :label="'0'">APP</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" v-show='addForm.resourceType=="1"'>
                        <el-form-item label="子页面URL配置">
                            <div v-for="(item,ind) in addForm.pcChildPage" :key="ind" class="tResonBox">
                                <span class="reasonText" :title="item">{{item}}</span>
                                <span class="iconfont icon-guanbianniu" @click="reasonClick(item)"></span>
                            </div>
                            <el-input
                                type="textarea"
                                maxlength="100"
                                :rows="3"
                                v-model="tempReason"
                                placeholder="以分号分隔，例如：车行线网抽；"
                                ref="tempReason"
                            ></el-input>
                            <div
                                class="wordCal"
                            >{{tempReason.length}}/100 &nbsp;您还可以输入{{100-tempReason.length}}个字</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-show='addForm.resourceType=="0"'>
                        <el-form-item label="页面ID(APP)">
                            <el-input v-model="addForm.appPageId"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8" v-show='addForm.resourceType=="0"'>
                        <el-form-item label="是否可见">
                            <el-switch v-model="delivery.isShow"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show='addForm.resourceType=="1"'>
                        <el-form-item label="是否可操作">
                            <el-switch v-model="delivery.isDisable"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="ConfirmBtn">
                    <el-button @click="cancleAdd" type="info">取消</el-button>
                    <el-button @click="confirmAddNav" type="primary">保存</el-button>
                </el-row>
            </el-form>
        </div>
        <common-footer></common-footer>
    </div>
</template>

<script>
import commonFooter from "@/components/common/commonFooter";
import commonBread from "@/components/common/commonBread";
import apiClient from '@/publicJs/apiClient.js' 
import Vue from 'vue'
export default {
    name:'navAdd',
    data(){
        var validateSort = (rule, value, callback) => {
            // var val = value.trim();
            if (/^-?\d*\.?\d*$/.test(value)) {
                callback()
            }else {
                callback(new Error('请输入数字'));
            }
      };
        return{
            aryBread: [
                { name: "系统设置 ", url: "/systemHome" },
                { name: "导航管理", url: "/systemHome/navMng" },
                { name: "新增导航", url: ""}
            ],
            addForm:{
                resourceType:'1',
                pcChildPage:[],
                resourcePid:'',
            },
            addFormRule:{
                url:[
                    {required:true,message:'请输入导航URL',trigger:'blur'},
                ],
                name:[
                    {required:true,message:'请输入导航名称',trigger:'blur'},
                ],
                resourceId:[
                    {required:true,message:'请输入导航ID',trigger:'blur'},
                ],
                resourceType:[
                    {required:true,message:'选择导航类型',trigger:'blur'},
                ],
                sort:[
                    { message:'', trigger:'blur' },
                    { validator:validateSort}
                ]
                
            },
            delivery:{
                isDisable:false,
                isShow:false
            },
            tempReason: "",
        }
    },
    components:{
        commonBread,
        commonFooter
    },
    created(){
        var that = this;
        that.getNavInfo();
        if(that.$route.params.type == 'create'){
            that.addForm.resourcePid = that.$route.params.id;
            // that.addForm.resourceType = that.$route.params.type?'1':"0";
        }
    },
    methods:{
        getNavInfo(){
            var that = this;
            apiClient.get('ssiteapi/authm/premission/get/'+that.$route.params.id,{},function(pres){
                if(pres.status == 200){
                    if (that.$route.params.type == 'edit'){
                        that.addForm = pres.results;
                        that.addForm.pcChildPage = pres.results.pcChildPage.split(',')||'';
                    }
                }
            })
        },
        // 点击删除原因
        reasonClick: function(item) {
            var that = this;
            var preAry = that.addForm.pcChildPage;
            preAry.splice($.inArray(item, preAry), 1);
        },
        //提交表单
        confirmAddNav(){
            var that = this;
            var param = {
                resourceId: that.addForm.resourceId,
                name: that.addForm.name,
                resourcePid: that.addForm.resourcePid,
                url: that.addForm.url,
                icon: that.addForm.icon,
                resourceType: that.addForm.resourceType,
                pcChildPage: that.addForm.resourceType == '0'?that.tempReason:'',
                appPageId: that.addForm.resourceType == '1'?that.addForm.appPageId:'',
                pageParams: that.addForm.pageParams,
                sort: that.addForm.sort-0,
                operations:that.addForm.resourceType == 0?["0"]:["1"]
            }
            that.$refs['addForm'].validate( valid => {
                if(valid){
                    if(that.$route.params.type == 'create'){
                        apiClient.linkApi('ssiteapi/authm/premission/insertPremission','put',param,function(pres){
                            if(pres.status == 200){
                                that.$message({
                                    type:'success',
                                    message:'新增成功'
                                })
                                that.$router.go(-1);
                            }
                        })
                    }else if(that.$route.params.type == 'edit'){
                        param.id = that.$route.params.id;
                        apiClient.post('ssiteapi/authm/premission/update',param,function(pres){
                            if(pres.status == 200&&pres.results == true){
                                that.$message({
                                    type:'success',
                                    message:'修改成功'
                                })
                                that.$router.go(-1);
                            }else {
                                that.$message({
                                    type:'error',
                                    message:'修改失败'
                                })
                            }
                        })
                    }
                            
                }
            })
            
        },
        //取消，返回上一页
        cancleAdd(){
            var that = this;
            that.$router.go(-1);
        }
    },
    watch: {
        tempReason: function(val) {
            var lastLetter = val.split("")[val.length - 1];
            var a = val
                .split(";")
                .join("")
                .trim();
            var b = val
                .split("；")
                .join("")
                .trim();
            if (a !== "" && b !== "") {
                if (lastLetter === ";") {
                this.addForm.pcChildPage.push(val.split(";").join(""));
                this.tempReason = "";
                } else if (lastLetter === "；") {
                this.addForm.pcChildPage.push(val.split("；").join(""));
                this.tempReason = "";
                }
            }
        }
    },
}
</script>

<style scoped lang='scss'>
.navAdd{
    width: 100%;
    height: 100%;
    position: relative;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    .formContent{
        width: 100%;
        margin-top: 10px;
        padding-top: 20px;
        background: #fff;
        height: calc(100% - 90px);
        overflow: auto;
        .el-form{
            width: 85%;
            margin: 0 auto;
            .tResonBox {
                min-width: 100px;
                padding: 0px 10px;
                height: 34px;
                line-height: 34px;
                display: inline-block;
                text-align: center;
                color: #ffffff;
                float: left;
                background: #1081fa;
                position: relative;
                border-radius: 2px;
                margin-right: 10px;
                margin-bottom: 15px;
                .reasonText {
                    word-break: keep-all;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100px;
                    display: inline-block;
                }
                .iconfont {
                    position: absolute;
                    display: inline-block;
                    font-size: 20px;
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    top: -19px;
                    right: -8px;
                    color: #faa622;
                }
            }
            .ConfirmBtn{
                text-align: center;
            }
        }
            
            
    }
    
}
</style>
