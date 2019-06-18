<template>
    <div class="cPicture">
        <div class="uploadField" @click="openSelectFileDialog" v-if="itemData.value==''||itemData.value==null">
          <span class="iconfont icon-jiahao"></span>&nbsp;&nbsp;添加图片
        </div>
        <div class="imgList" v-else>
          <img :src="imgBath+itemData.value" class="imgShow" />
          <span class="imgName">{{itemData.value.split('/').reverse()[0].substring(13)}}</span>
          <div class="okTag">
              <span class="iconfont icon-duigou"></span>
          </div>
          <div class="errorTag" @click="clearImg">
              <span class="iconfont icon-guanbi1"></span>
          </div>
        </div>
        <input type="file" class="fileObj" :id="'uploadFile'+now" ref="upInput" @change="saveFilePath"/>
    </div>
</template>
<script>
import Vue from 'vue' 
import apiClient from '@/publicJs/apiClient.js'
import Constants from '@/publicJs/Constants.js'

export default {
    name:'cPicture',
    props:{
        itemData:{
            type:Object,
            default:function(){
                return {
                    name: "属性名称",
                    type: "属性类型",
                    IsRequired: 0,
                    value:''
                }
            },
        },
    },
    watch:{
    },
    data(){
      return {
        now:new Date().getTime(),
        imgBath:Constants.imgUrl,
      };
    },
    components: {

    },
    created(){
        
    },
    methods:{
      openSelectFileDialog(data){
        var that = this;
        that.$refs.upInput.click();
         console.log('click'+that.itemData.name);
      },
      saveFilePath:function(){
        var that = this;
        // var file =$('#uploadFile'+that.now)[0].files[0];
        var file = that.$refs.upInput.files[0];
        var filePath=event.currentTarget.files[0].name;
        console.log(filePath);
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)){
          that.$message({
              type: 'error',
              message: '请选择图片',
          });
          return false;
        }
        if(file.size>10*1024*1024){
          that.$message({
              type: 'error',
              message: '图片大小不可超过10M',
          });
          return false;
        }
        var loading = that.$loading({
            lock: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255,255, 255, 0.6)'
        });
        apiClient.uploadFile('ssiteapi/platform/asset/info/uploadImg',file,function(pres){
          if(pres.status==200){
              console.log(pres.results+'----'+that.itemData.name);
              that.itemData.value = JSON.parse(pres.results).filePath;
          }
          loading.close();
        });
        
      },
      clearImg:function(){
        var that = this;
        var params = {
          imgUrl:that.itemData.value,
        }
        apiClient.linkApi('ssiteapi/platform/asset/info/removeImg','DELETE',params,function(pres){
            if(pres.status==200){
                that.itemData.value = '';
                that.$refs.upInput.value = '';
            } 
        });
      }
    }   
}
</script>
<style scoped>
.cPicture{
    width: 100%;
    height: 100px;
    border-radius: 2px;
    border: 1px dashed #d9d9d9;
    position: relative;
}
.cPicture:hover .errorTag{
  display: inline-block;
}
.cPicture:hover .okTag{
  display: none;
}
.fileObj{
    display: none;
}
.uploadField{
  line-height: 100px;
  text-align: center;
  cursor: pointer;
  color: #8c939d;
}
.uploadField:hover{
  color: #1081fa;
}
.imgShow{
    width: 90px;
    height: 90px;
    margin: 5px;
    display: inline-block;
    border-radius: 5px;
    float: left;
}
.imgName{
  display: inline-block;
  width: auto;
  line-height: 100px;
  padding-left: 20px;
}
.okTag{
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0px;
    border-radius: 2px;
    right: 0px;
    border-width: 15px 15px 15px 15px;
    border-style: solid;
    border-color: #11db62 #11db62 transparent transparent;
}
.okTag .iconfont{
    position: relative;
    top: -24px;
    right: 0px;
    color: #ffffff;
}
.errorTag{
  position: absolute;
  top: 0px;
  right: 0px;
  line-height: 30px;
  width: 30px;
  text-align: center;
  display: none;
  cursor: pointer;
}
.errorTag:hover{
  color: #1081fa;
}
</style>