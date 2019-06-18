<template>
    <div class="versionUpload">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="versionContent">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="versionForm">
                <el-form-item label="版本号" prop="name">
                    <el-input v-model="form.name" placeholder="版本号必须且只包括数字和‘.’例如：1.1.0"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                    <el-input type="textarea" v-model="form.describe"></el-input>
                </el-form-item>
                <el-form-item label="附件">
                    <input type="file" ref="upInput">
                    <p></p>
                </el-form-item>
                <!-- <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :before-upload="beforeAvatarUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :on-error='error'
                    multiple
                    :limit="1"
                    accept='file'
                    :on-success='success'
                    :on-exceed="handleExceed">
                    <el-button size="small" type="primary" class="upLoad">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload> -->
                <el-form-item class="submit">
                    <el-button type="primary" @click="saveFilePath">立即上传</el-button>
                </el-form-item>
            </el-form>
        </div>
        <common-footer></common-footer>
    </div>
</template>

<script>
import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
export default {
    name:'versionUpload',
    data(){
        var validateMemo = (rule, value, callback) => {
           var testRule = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){1,3}$/; 
           if(!testRule.test(this.form.name)){
                if (value === '') {
                    callback(new Error('请输入版本号'));
                } else {
                    callback(new Error('版本格式不正确'));
                }
           }else{
                callback();
           }
        
        };
        return {
            aryBread:[
                {name:'系统设置',url:'/systemHome'},
                {name:'版本上传',url:'/systemHome/versionUpload/versionUpload'},
            ],
            form:{
                name:'',
                luggage:'',
                describe:'',
            },
            rules:{
                name:[
                    { required: true, message: '请输入版本号', trigger: 'blur' },
                    { validator:validateMemo,trigger:'blur'}
                ],
                // describe:[
                //     { required: true, message: '描述', trigger: 'blur' }
                // ]
            }
        }
    },
    methods:{
        saveFilePath:function(){
            var that = this;
            this.$refs['form'].validate((valid)=>{
                if(valid){
                    var formData = new FormData();
                    var file = that.$refs.upInput.files[0];
                    // var filePath=event.currentTarget.files[0].name;
                    if(file){
                        
                        formData.append('multipartFile ',file); 
                        formData.append('apkVersion',that.form.name);
                        formData.append('desc ',that.form.describe);
                        var loading = that.$loading({
                            lock: true,
                            text: '上传中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(255,255, 255, 0.6)'
                        });
                        apiClient.uploadApk('ssiteapi/platform/manager/api/uploadApk',formData,function(pres){
                            if(pres.status==200){
                                that.$message({
                                    type:'success',
                                    message:'上传成功'
                                })
                                setTimeout(() => {
                                    that.$router.go(0);
                                }, 1000);
                            }else{
                                that.$message({
                                    type:'error',
                                    message:'上传失败'
                                })
                            }
                            loading.close();
                        });
                    }else {
                        that.$message ({
                            type: 'error',
                            message: '请选择文件',
                        })
                    }
                }
            })
            
            
        },
        
    },
    components:{
        commonBread,
        commonFooter
    }
}
</script>

<style scoped>
.versionUpload {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px 10px 0 10px;
    margin-top: 0;
    background: #efefef;
}
.versionContent {
    width: 100%;
    height: calc(100% - 90px);
    margin-top: 10px;
    overflow-y: auto;
    background: #fff;
}
.versionForm{
    position: relative;
    width: 40%;
    height: 60%;
    top: 15%;
    left: 30%;
}
.upload-demo {
    text-align: right;
}
.submit{
    text-align: right;
}
</style>
