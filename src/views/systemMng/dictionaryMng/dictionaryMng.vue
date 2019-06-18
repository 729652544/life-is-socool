<template>
  <div class="dictionaryMng">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
            <div class="dicListField">
                <div class="addBtnField">
                    <div class="addBtn" plain @click="showAddDic"><span class="iconfont icon-jiahao"></span>&nbsp;&nbsp;添加</div>
                </div>
                <div class="leftContentField">
                    <ul class="dicListUl">
                        <li v-for="item in aryDic"
                            :key="item.dicId"
                            :class="item.dicId==dicInfoForm.dicId?'active':''"
                            @click="checkPerDic(item)">
                            <span class="text" :title="item.dicName">{{item.dicName}}</span>
                            <span class="dicOpers fr">
                                <span class="iconfont icon-bianji" v-if="!(item.dicSortValue==0)" @click.stop="clickEditDic(item)"></span>
                                <span class="iconfont icon-iconfonttubiao" v-if="!(item.dicSortValue==0)"  @click.stop="clickDelDic(item.dicId)"></span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="rightContent">
                <div class="dicInfoBox">
                    <div class="dicLeft">
                        <el-form class="dicInfoForm" ref="dicInfoForm" :rules="dicInfoFormRule" label-width="35%"  :model="dicInfoForm" >
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="字典名称：" prop="dicName"  >
                                        <el-input v-model="dicInfoForm.dicName" :disabled="isDisable" ref="dicName"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="英文名称：" prop="dicCode">
                                        <el-input v-model="dicInfoForm.dicCode"  :disabled="isDisable"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="序号：" prop="dicSortValue" >
                                        <el-input v-model="dicInfoForm.dicSortValue" :disabled="isDisable"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="描述：" prop="dicDesc" >
                                        <el-input v-model="dicInfoForm.dicDesc" :disabled="isDisable"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div class="formSubField" v-show="!isDisable">
                                <el-button type="primary" class="btn110" @click="dicSubBtn">确认</el-button>
                            </div>
                        </el-form>
                    </div>
                    <div class="dicRight" v-show="dicInfoForm.dicSortValue!==0&&(!isDisable)">
                         <el-button type="primary"  class="btn110" @click="clickAddItemBtn">新增值定义</el-button>    
                    </div>
                    <transition name="slide-fade">
                        <div class="itemInfo" v-show="showItemInfo">    
                            <el-form class="itemForm" ref="itemForm" :rules="itemFormRule" label-width="35%"  :model="itemForm" >
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="值：" prop="itemValue"  >
                                            <el-input v-model="itemForm.itemValue"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="序号：" prop="itemSortValue"  >
                                            <el-input v-model="itemForm.itemSortValue"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                         <el-form-item label="标识：" prop="itemCode"  >
                                            <el-input v-model="itemForm.itemCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                    </el-col>
                                </el-row>
                                <div class="formSubField">
                                    <el-button class="btn110" @click="cancleItemBtn">取消</el-button>
                                    <el-button type="primary" class="btn110" @click="subItemBtn">确认</el-button>
                                </div>
                            </el-form>
                        </div>
                    </transition>
                </div>
                <div class="valueInfoBox">
                    <div class="itemOper">
                        <div class="fr">
                            <div class="searchBox">
                                <span class="el-icon-search iconSearch" @click="getItemInfoById()"></span>
                                <el-input v-model="searchText" placeholder="请输入值" class="zAcountName" type="text" @keyup.enter.native="getItemInfoById()">
                                </el-input>
                            </div>
                            <!-- <div class="searchResBox">
                                    <el-input v-model="searchText" placeholder="请输入搜索内容" class="input-with-select "    @keyup.enter.native="getItemInfoById()">
                                        <span slot="append" class="searchBtn el-icon-search" @click="getItemInfoById()"></span>
                                    </el-input>
                            </div> -->
                        </div>
                    </div>
                    <div class="tableData">
                        <el-table  
                            :data="itemTableData"  
                            style="width: 100%"  
                            height="100%"
                         
                            header-row-class-name="sHeader">  
                            <el-table-column width="50"></el-table-column>
                           <el-table-column
                                prop="itemSortValue"
                                label="序号"
                                :align="'left'"
                                :show-overflow-tooltip="showTooltip"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="itemId"
                                label="ID"
                                :align="'left'"
                                :show-overflow-tooltip="showTooltip"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="itemValue"
                                label="值"
                                :align="'left'"
                                :show-overflow-tooltip="showTooltip"
                                >
                            </el-table-column>
                            <el-table-column
                                prop="itemCode"
                                label="标识"
                                :align="'left'"
                                :show-overflow-tooltip="showTooltip"
                                >
                            </el-table-column>
                            <el-table-column
                                prop=""
                                label="操作"
                                :align="'left'"
                                :show-overflow-tooltip="showTooltip"
                                >
                                <template slot-scope="scope">
                                    <span class="operIcon iconfont "  v-show="dicInfoForm.dicSortValue!==0&&(!isDisable)" @click="clickEditItem(scope.row)">编辑</span>
                                    <span class="operIcon iconfont"  v-show="dicInfoForm.dicSortValue!==0&&(!isDisable)" @click="deleteItem(scope.row)">删除</span>
                                </template>
                            </el-table-column>
                        </el-table> 
                        <el-pagination
                            class="sPage"
                            v-if="totalItem>10"
                            @current-change="handleCurrentChange"
                            :current-page.sync="pageNow"
                            :page-size="pageSize"
                            :prev-text="'〈  上一页'" 
                            :next-text="'下一页  〉'"
                            layout="prev, pager, next"
                            :total="totalItem">
                        </el-pagination>
                    </div>
                </div>
            </div>
            
        </div>
       
  </div>
</template>
<script>

import apiClient from '@/publicJs/apiClient.js'
import commonBread from '@/components/common/commonBread'
import commonFooter from '@/components/common/commonFooter'
import UtilService from '@/publicJs/UtilService'

export default {
  name:'dictionaryMng',
  data(){
      var checkSort = (rule, value, callback) => {
            if(value&&value.length>0){
                if (!Number.isInteger(value-0)) {
                    callback(new Error('请输入数字值'));
                }else{
                    if (value < 1||value >99) {
                        callback(new Error('范围为1-99'));
                    } else {
                        callback();
                    }
                }  
            }else{
                callback();
            }
        };
      var checkCode = (rule, value, callback) => {
            var reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
            if(!reg.test(value)){
                callback(new Error('请输入字母或数字且以字母开头'));
            }else{
                callback();
            }
       };
      return{
          aryBread:[
              {name:'系统设置',url:'/systemHome'},
              {name:'字典管理',url:''},
          ],
          aryDic:[],
          isDisable:false,

          dicInfoForm:{
              dicName:'',
              dicCode:'',
              dicSortValue:'',
              dicDesc:'',
          },
          dicInfoFormRule:{
                dicName:[
                    { required: true, message: '请输入字典名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '字典名称长度在 1 到 10 个字符之间', trigger: 'blur' }
                ],
                dicCode:[
                    { required: true, message: '请输入英文名称', trigger: 'blur' },
                    { validator: checkCode, trigger: 'blur' }
                ],
                dicSortValue:[
                    { required: true, message: '请输入序号', trigger: 'blur' },
                    { validator: checkSort, trigger: 'blur' }
                ],
                dicDesc:[]
          },
          showItemInfo:false,
          itemForm:{
              itemId:'',
              itemName:'',
              itemValue:'',
              itemSortValue:'',
              itemCode:'',
          },
          itemFormRule:{
              itemValue:[
                   { required: true, message: '请输入值', trigger: 'blur' },
              ],
              itemSortValue:[
                  { required: true, message: '请输入序号', trigger: 'blur' },
                  { validator: checkSort, trigger: 'blur' }
              ]
          },
          searchText:'',
          showTooltip:true,
          itemTableData:[],
          totalItem:0,
          pageNow:1,
          pageSize:10,
      }
  },
  watch:{

  },
  components: {
    commonBread,
    commonFooter
  },
  mounted() {
      this.getDicList('init');
  },
  methods:{
    //   点击编辑字典
      clickEditDic:function(obj){
          var that = this;
          that.dicInfoForm.dicName = obj.dicName;
          that.dicInfoForm.dicId = obj.dicId;
          that.dicInfoForm.dicCode = obj.dicCode;
          that.dicInfoForm.dicSortValue = obj.dicSortValue;
          that.dicInfoForm.dicDesc = obj.dicDesc;
          that.isDisable = false;
          that.showItemInfo = false;
          that.getItemInfoById(obj.dicId);
          that.$refs['dicInfoForm'].clearValidate();
      },
    //   选中字典
      checkPerDic:function(obj){
          var that = this;
          that.dicInfoForm.dicName = obj.dicName;
          that.dicInfoForm.dicId = obj.dicId;
          that.dicInfoForm.dicCode = obj.dicCode;
          that.dicInfoForm.dicSortValue = obj.dicSortValue;
          that.dicInfoForm.dicDesc = obj.dicDesc;
          that.showItemInfo = false;
          that.isDisable = true;
          that.pageNow = 1;
          that.getItemInfoById(obj.dicId);
          that.$refs['dicInfoForm'].clearValidate();
      },
    //   点击删除字典
      clickDelDic:function(id){
          var that = this;
          that.$confirm('确定要删除此字典吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                apiClient.linkApi('ssiteapi/platform/asset/dict/removeType/'+id,'DELETE',{},function(pres){
                    that.getDicList('init');
                });
            });
      },
    //   增加
      showAddDic:function(){
            var that = this;
            var haveDefault = false;
            var vObj = {};
            that.aryDic.forEach(function(item,index){
                if((item.dicId+'').indexOf('new')>-1){
                    haveDefault = true;
                    vObj = item;
                    return false;
                }
            });
           if(!haveDefault){
               var vDicId = 'new'+new Date().getTime();
                vObj = {
                    dicId:vDicId,
                    dicName:'未命名',
                    dicCode:'',
                    dicSortValue:null,
                    dicDesc:'',
                }
                that.aryDic.push(vObj);
           }
            setTimeout(function(){
                    that.checkPerDic(vObj);
                    that.isDisable = false;
                    that.$refs.dicName.focus();    
            },200);
      },
      triggerAddDic:function(){
          var that = this;
          if(that.addDicText==''){
              that.addDicText = '未命名';
              that.showAddInput = false;
              return false;
          }
          if(that.addDicText.length>10){
              that.$message({
                type: 'error',
                message: '字典名称长度不可超过10个字符!'
            });
            that.$refs.addDicInput.focus();
            return false;
          }
          var obj = {
              dicName:that.addDicText,
          }
          apiClient.linkApi('ssiteapi/platform/asset/dict/insertType','put',obj,function(pres){
             if(pres.status==200){
                that.getDicList();
                that.addDicText = '未命名';
                that.showAddInput = false;
             }else if(pres.status==5004){
                 that.$message({
                    type: 'error',
                    message: '字典名称不可重复!'
                });
                that.$refs.addDicInput.focus();
             }
              
          });
      },
    //   查看字典列表
      getDicList:function(type){
          var that = this;
          apiClient.get('ssiteapi/platform/asset/dict/listType',{},function(pres){
            that.aryDic = pres.results;
            if(type=='init'){
                that.checkPerDic(that.aryDic[0]);
            }
          });
      },
      getItemInfoById:function(id){
          var that = this;
          var dicId = '';
          if(id){
              dicId = id;
          }else{
              dicId = that.dicInfoForm.dicId;
          }
          if(!((dicId+'').indexOf('new')>-1)){
                var param = {
                    dicId:dicId,
                    pageNum:that.pageNow,
                    pageSize:that.pageSize,
                }
                if(that.searchText.length>0){
                    param.filter = that.searchText;
                }
                apiClient.post('ssiteapi/platform/asset/dict/listItemByDictIdWithPage',param,function(pres){
                        if(pres.results.list.length>0){
                            that.itemTableData = pres.results.list;
                            that.totalItem = pres.results.totalRecord;
                        }else{
                            that.itemTableData = [];
                            that.totalItem  = 0;
                        }
                });
          }else{
             
                that.itemTableData = [];
                that.totalItem  = 0;
          }
          
      },
      dicSubBtn(){
            var that = this;
            that.$refs['dicInfoForm'].validate((valid) => {
                if(valid){
                    if((that.dicInfoForm.dicId+'').indexOf('new')>-1){
                        that.addDic();
                    }else{
                        that.editDic();
                    }
                }
            })
            
      },
    //   增加字典
      addDic(){
            var that = this;
            var param = {
                "dicCode": that.dicInfoForm.dicCode,
                "dicName": that.dicInfoForm.dicName,
                "dicSortValue":that.dicInfoForm.dicSortValue,
                "dicDesc":that.dicInfoForm.dicDesc,
            }
            apiClient.linkApi('ssiteapi/platform/asset/dict/insertType','put',param,function(pres){
                if(pres.status==200){
                    that.dicInfoForm.dicId=pres.results.id;
                    that.getDicList();
                    that.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    that.isDisable = true;
                }else if(pres.status==5004){
                    that.$message({
                        type: 'error',
                        message: '字典名称不可重复!'
                    });
                }
            });
      },
    //   编辑字典
      editDic(){
           var that = this;
            var param = {
                "dicId":that.dicInfoForm.dicId,
                "dicCode": that.dicInfoForm.dicCode,
                "dicName": that.dicInfoForm.dicName,
                "dicSortValue":that.dicInfoForm.dicSortValue,
                "dicDesc":that.dicInfoForm.dicDesc,
            }
            apiClient.linkApi('ssiteapi/platform/asset/dict/updateType','POST',param,function(pres){
                if(pres.status==200){
                    that.getDicList();
                    that.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    that.isDisable = true;
                }else if(pres.status==5004){
                    that.$message({
                        type: 'error',
                        message: '字典名称不可重复!'
                    });
                }
            });
      },
    //   点击新增值定义
      clickAddItemBtn(){
            var that = this;
            if((that.dicInfoForm.dicId+'').indexOf('new')>-1){
                that.$message({
                    type: 'error',
                    message: '请先设置字典信息!'
                });
            }else{
                that.itemForm.itemId = '';
                that.itemForm.itemName = '';
                that.itemForm.itemValue = '';
                that.itemForm.itemSortValue = '';
                that.itemForm.itemCode = ''
                that.showItemInfo = true;
            }
            that.$refs['itemForm'].clearValidate();
      },
      cancleItemBtn(){
          var that = this;
          that.showItemInfo = false;
      },
      subItemBtn(){
            var that = this;
            that.$refs['itemForm'].validate((valid) => {
                if(valid){
                    if(that.itemForm.itemId==''){
                        that.addItem()
                    }else{
                        that.editItem();
                    }
                }
            })
            
      },
      handleCurrentChange(val){
          this.pageNow = val;
          this.getItemInfoById();
      },
    //   增加字典项
      addItem(){
            var that = this;
            var param = {
                "dicId": that.dicInfoForm.dicId,
                "itemName":that.itemForm.itemValue,
                "itemValue": that.itemForm.itemValue,
                "itemSortValue": that.itemForm.itemSortValue,
                "itemCode":that.itemForm.itemCode,
            };
            apiClient.linkApi('ssiteapi/platform/asset/dict/insertItem','put',param,function(pres){
                if(pres.status==200){
                    that.$message({
                        type: 'success',
                        message: '增加成功!'
                    });
                    that.showItemInfo = false;
                    that.getItemInfoById();
                }else if(pres.status==5006){
                    that.$message({
                        type: 'error',
                        message: pres.exception
                    });
                }
            })
      },
    //   修改字典项
      editItem(){
            var that = this;
            var param = {
                "dicId": that.dicInfoForm.dicId,
                "itemId":that.itemForm.itemId,
                "itemName":that.itemForm.itemValue,
                "itemValue": that.itemForm.itemValue,
                "itemSortValue": that.itemForm.itemSortValue,
                "itemCode":that.itemForm.itemCode,
            };
            apiClient.linkApi('ssiteapi/platform/asset/dict/updateItem','post',param,function(pres){
                if(pres.status==200){
                    that.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    that.showItemInfo = false;
                    that.getItemInfoById();
                }else if(pres.status==5006){
                    that.$message({
                        type: 'error',
                        message: pres.exception
                    });
                }
            })
      },
    //   编辑子项
      clickEditItem(row){
          var that = this;
          that.showItemInfo = true;
          that.itemForm.itemId = row.itemId;
          that.itemForm.itemName = row.itemName;
          that.itemForm.itemValue = row.itemValue;
          that.itemForm.itemCode = row.itemCode;
          that.itemForm.itemSortValue = row.itemSortValue;
          that.$refs['itemForm'].clearValidate();
      },
    //   删除子项
      deleteItem(row){
            var that = this;
            that.$confirm('确定要删除该子项吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                 apiClient.linkApi('ssiteapi/platform/asset/dict/removeItem/'+row.itemId,'DELETE',{},function(pres){
                     that.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                     that.getItemInfoById();
                 });
            });
           
      }
  },
  filters: {
  }
}
</script>
<style scoped>
.dictionaryMng{
    width: 100%;
    height: 100%;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    border-top: solid 1px #e6e6e6;
}  
.dicListField{
    width: 300px;
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px 
        rgba(16, 129, 250, 0.1);
    border-radius: 2px;
    margin: 0px 10px 0px 0px;
    display: inline-block;
    float: left;
    overflow: auto;
}
.dicInfoField{
    width: calc(80.4% - 10px);
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px 
        rgba(16, 129, 250, 0.1);
    border-radius: 2px;
    display: inline-block;
    float: right;    
}
.dicInfoContent{
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
}
.contentField{
    width: 100%;
    padding: 10px 0px 0px 0px;
    height: calc(100% - 40px);
}
.addBtn{
    width: 100%;
    height: 36px;
    border-radius: 2px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid #d2d2d2;
    color: #aaaaaa;
}
.addBtn:hover{
    border: solid 1px #828282;
    color: #828282;
}
.addBtnField{
    width: 100%;
    padding: 10px;
}
.addBtn .iconfont{
    font-size: 14px;
}
.dicListUl>li{
    color: #666;
    width: 100%;
    height: 40px;
    cursor: pointer;
    line-height: 40px;
    padding: 0px 10px;
    font-size: 14px;
    padding-right: 105px;
    position: relative;
    display: inline-block;
}
.dicListUl>li .text{
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    float: left;
    width: 100%;
    padding-left: 5px;
}
.dicListUl .active{
    background: #eaf1fb;
    color: #1081fa;
}
.dicListUl .active .dicOpers{
    display: block;
}
.dicListUl>li:hover{
   background: #eaf1fb;
   color: #1081fa;
}
.dicListUl>li:hover .dicOpers{
    display: block;
}
.dicOpers{
    display: none;
    position: absolute;
    right: 5px;
}
.dicOpers .iconfont{
    margin-right: 30px;
}
.dicOpers .iconfont:hover{
    color: #1081fa;
}
.addBtnField{
    width: 100%;
    padding: 10px;
}
.dicForm{
    width: 50%;
    margin: 0 auto;
    padding-top: 90px;
}
.valueOper{
    position: absolute;
    right: -55px;
    top: 0;
}
.valueOper .iconfont{
    cursor: pointer;
    font-size: 20px;
}
.valueOper .iconfont:nth-child(1){
    color: #1081fa;
}
.valueOper .iconfont:nth-child(2){
    color: #ff0000;
}
.inlineInput{
    display: inherit;
    margin-bottom: 20px;
    position: relative;
}
.formSubField{
    text-align: center;
}
.leftContentField{
    height: calc(100% - 60px);
    overflow: auto;
}


.rightContent{
    width: calc(100% - 310px);
    height: 100%;
    display: inline-block;
    float: right;
    position: relative;
    overflow: auto;
}
.dicInfoBox{
    width: 100%;
    height: 210px;
    background: #ffffff;
    -webkit-box-shadow: 0px 0px 9px 0px rgba(16, 129, 250, 0.1);
    box-shadow: 0px 0px 9px 0px rgba(16, 129, 250, 0.1);
    border-radius: 2px;
    display: inline-block;
    padding: 10px;
    margin-bottom: 5px;
}
.valueInfoBox{
    width: 100%;
    height: 630px;
    box-shadow: 0px 0px 9px 0px 
        rgba(16, 129, 250, 0.1);
    border-radius: 2px;
     background: #ffffff;
}
.dicLeft{
    width: 80%;
    display: inline-block;
    float: left;
    height: 100%;
}
.dicRight{
    width: 20%;
    display: inline-block;
    float: left;
    height: 100%;
    border-left: 1px solid #cccccc;
    -webkit-display:flex;
    display:flex;
    -webkit-align-items:center;
    align-items:center;
    -webkit-justify-content:center;
    justify-content:center;
}
.dicInfoForm{
    width: 700px;
    margin-top:20px;
}
.dicInfoForm .formSubField{
    text-align: right;
    padding-right: 5px;
    margin-top: 0;
}

/* 动画效果 */
.slide-fade-enter-active {
    transition: all 0.5s ease;
}
.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(405px);
}
.itemInfo{
    height: 210px;
    background: #ffffff;
    position: absolute;
    left: 10px;
    right: 10px;
    top: 0px;
    bottom: 0px;
    margin: 0 auto;
    -webkit-box-shadow: 0px 0px 9px 0px rgba(16, 129, 250, 0.1);
    box-shadow: 0px 0px 9px 0px rgba(16, 129, 250, 0.1);
    border: 1px solid #cccccc;
}
.itemForm{
    width: 700px;
    margin: 0 auto;
    margin-top: 30px;
}
.itemOper{
    width: 100%;
    height: 60px;
    padding: 0px 10px;
    line-height: 60px;
}
.searchResBox .searchBtn{
    width: 100%;
    height: 100%;
    display: inline-block;
    cursor: pointer;
}
.tableData{
    height: calc(100% - 100px);
    max-height: 580px;
}
.operIcon{
    margin-right: 10px;
    cursor: pointer;
    color:#1081fa;
    font-size: 12px;
}
.operIcon:hover{
    color: #1081fa;
}
.searchResBox  {
    width:360px!important;
}
.searchBox {
    position: relative;
    width: 330px;
}
.searchBox  input {
    border: 1px solid #d2d2d2;
}
.searchBox  input:hover {
    border: 1px solid #aaaaaa;
}
.iconSearch {
    position: absolute;
    right: 10px;
    top: 23px;
    z-index: 1;
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #909399;
}
</style>