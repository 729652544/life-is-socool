<template>
    <div class='materialEdit'>
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="materialContent">
            <div class="materialTop">
                <el-form :model="numberValidateForm" ref='numberValidateForm' :rules="numberValidateFormRule" label-width="100px" class="demo-ruleForm">
                    <el-form-item
                        label="套件名称"
                        prop="assemblyName"
                    >
                        <el-input type="text" placeholder="请输入名称" v-model="numberValidateForm.assemblyName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="规格型号"
                        prop="assemblyType"
                    >
                        <el-input type="text" placeholder="请输入规格型号" v-model="numberValidateForm.assemblyType" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="排序"
                        prop="sort"
                    >
                        <el-input type="text" value="0" v-model="numberValidateForm.sort" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="标签"
                        class="labelBox"
                        :required="true"
                    >
                        <p class="labBox">
                            <span class='labs' v-for='(item,index) in labArr' :key='index'>
                                <b>{{item}}</b>
                                <i @click='delLab(index)' class="iconfont icon-guanbi2"></i>
                            </span>
                            <input class="labIpt" v-model='labs' :placeholder="placeHolder" type="text">
                        </p>
                    </el-form-item>
                </el-form>
                <div class="line"></div>
            </div>
            <div class="materialBottom">
                <el-form>
                    <el-form-item
                        label="套件构成"
                        :required="true"
                    >
                    </el-form-item>
                </el-form>
                <div class="materialBox">
                    <div v-for='(item,index) in materialInfo' @click='editMaterial(index)' :key='index' class='materials'>
                        <p class="materielName"><span class="sqare"></span>{{item.materielName}} <span class="iconfont icon-shanchu1" @click.stop="delMaterial(index)"></span> </p>
                        <div class="asdf">
                            <p>编码：<span>{{item.materielCode}}</span> </p>
                            <p>规格：<span>{{item.materielSpec}}</span> </p>
                            <p>数量：<span>{{item.materielNum}}</span> </p>
                        </div>
                    </div>
                    <div class="materials" @click="addMaterial">
                        <span class="acrossLine"></span>
                        <span class="verticalLine"></span>
                    </div>
                    
                </div>
                <div class="materialBtn">
                    <el-button @click="Go" type="info">取消</el-button>
                    <el-button @click='addSuite' type="primary">确认</el-button>
                </div>
            </div>
        </div>
        <div class="logo">
            <common-footer></common-footer>
        </div>
        <div v-show='flag' class="dialogShade">
            <div class="materialDialog">
                <div class="dialogTitle">
                    <p>配料选择</p><span @click='closeDialog' class="iconfont icon-guanbi2"></span>
                </div>
                <div class="partsList">
                    <span class="partCla" v-show='listShow'>请选择配件</span>
                    <div v-show='!listShow'>
                        <div class="showList">
                            <div class="listLeft">
                                <span>物料名称：</span>
                                <span>{{listName}}</span>
                            </div>
                            <div class="listRight">
                                <span>数量：</span>
                                <span class="listNum">
                                    <button @click="delNum">-</button>
                                    <input
                                    v-model="materialNum" class="num">
                                    <button @click="addNum">+</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialogContent">
                    <div class="contentLeft">
                        <el-tree
                        :data="data1"
                        :props="defaultProps"
                        accordion
                        node-key='id'
                        @node-click="treeClick"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[2]"
                        highlight-current
                       >
                        </el-tree>

                    </div>
                    <div class="contentRight">
                        <div class="tableField">
                                <el-table
                                @row-click='rowClick'
                                :data="tableData"
                                height="100%"
                                :border="true"
                                row-class-name="sRow cp"
                                style="width: 100%">
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="no"
                                    width="80"
                                    label="序号">
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="materielcode"
                                    label="物料编码">
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="materielname"
                                    label="物料名称">
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="materielspec"
                                    label="规格型号">
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    align="left"
                                    prop="materielunit"
                                    label="计量单位">
                                </el-table-column>
                            </el-table>
                            <el-pagination
                                v-show="total>10?true:false"
                                class="sPage" @current-change="handleCurrentChange"
                                :current-page.sync="pageNum" :page-size="pageSize"
                                :prev-text="'上一页'" :next-text="'下一页'"
                                layout="prev, pager, next"
                                :total="total">
                            </el-pagination>
                        </div>
                        
                        
                    </div>
                </div>
                <div class="addParts">
                    <el-button type="info" @click='closeDialog'>取消</el-button>
                    <el-button type="primary" @click="confirmDialog">确认</el-button>
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
import $ from 'jquery'
export default {
    
    name:'materialEdit',
    data(){
        var checkSort = (rule, value, callback) => {
            if(value&&value.length>0){
                if (!Number.isInteger(value-0)) {
                    callback(new Error('请输入数字值'));
                }else{
                    if (value < 0||value >9999) {
                        callback(new Error('排序范围为0-9999'));
                    } else {
                        callback();
                    }
                }  
            }else{
                callback();
            }
        };
        return {
            
            numberValidateForm: {
                sort: 0,
                assemblyName:'',
                assemblyType:'',
                assemblyTags:this.labArr
            },
            data:[],
            flag:false,
            data1: [],
            defaultProps: {
                children: 'children',
                label: 'text'
            },
            tableData:[],
            total:0,
            pageNum:1,
            pageSize:10,
            className:'',
            listShow:true,
            listName:'',
            materialNum:1,
            materialInfo:[],
            middleData:{},
            materialData:{},
            stat:'',
            ind:0,
            labArr:[],
            labs:"",
            numberValidateFormRule:{
                assemblyName:[
                     { required: true, message: '套件名称不能为空'},
                     { max:20, message: '类名最多为20个字符'},
                ],
                assemblyType:[
                    { max:20, message: '类名最多为20个字符'},
                ],
                sort:[
                    { validator: checkSort}
                ]
            },
        }
        
    },
    methods:{
        addMaterial(){
            var that = this
            that.stat = '新建';
            that.flag = true;
            that.middleData = {};
            that.listShow = true;
            apiClient.get('ssiteapi/platform/activity/assembly/gettree',{},function(pres){
                if(pres.status == 200){
                    that.className = pres.results.attributes.classname;
                    that.data1 = [];
                    that.data1.push(pres.results);
                    apiClient.get('ssiteapi/platform/activity/assembly/getByType/'+that.className+'/'+that.pageNum+'/'+that.pageSize,{},function(pres){
                        if(pres.status == 200){
                            that.tableData = pres.results.list;
                            that.total = pres.results.totalRecord;
                        }
                    })
                }
            })
        },
        treeClick(obj){
            var that = this;
            that.pageNum = 1;
            that.className = obj.attributes.classname;
            apiClient.get('ssiteapi/platform/activity/assembly/getByType/'+that.className+'/'+that.pageNum+'/'+that.pageSize,{},function(pres){
                if(pres.status == 200){
                    that.tableData = pres.results.list;
                    that.total = pres.results.totalRecord;
                }
            })
        },
        closeDialog(){
            this.data1 = [];
            this.flag = false;
        },
        confirmDialog(){
            var that = this;
            that.middleData
            if(!that.listShow){
                var isHave = false;
                that.flag = false;
                that.materialInfo.forEach(function(item,index){
                        if(item.materielId == that.middleData.materielId){
                            that.materialInfo[index].materielNum = parseInt(that.materialInfo[index].materielNum)+parseInt(that.materialNum);
                            isHave = true;
                        }
                })
                if(!isHave){
                    if(that.stat == '新建'&&that.middleData.materielId){
                        that.middleData.materielNum = that.materialNum;
                        that.materialInfo.push(that.middleData);
                    }else if (that.stat == '编辑'){
                        var data = that.ind;
                        that.materialInfo[data].materielNum =  that.materialNum;
                        that.materialInfo[data].materielId = that.middleData.materielId;
                        that.materialInfo[data].materielName = that.middleData.materielName;
                        that.materialInfo[data].materielCode = that.middleData.materielCode;
                        that.materialInfo[data].materielSpec = that.middleData.materielSpec;
                        that.materialInfo[data].materielType = that.middleData.materielType;
                        that.materialInfo[data].materielUnit = that.middleData.materielUnit;
                    }
                }else{
                    if(that.stat == '新建'){
                        that.middleData.materielNum = that.materialNum;
                    }else if(that.stat == '编辑'){
                        that.middleData.materielNum = that.materialNum;
                    }
                }
            }else {
                that.$message({
                    type:'warning',
                    message:'您还没有选择物料哦'
                })
            }
            
        },
        handleCurrentChange(val){
            var that = this;
            that.pageNum = val;
            apiClient.get('ssiteapi/platform/activity/assembly/getByType/'+that.className+'/'+that.pageNum+'/'+that.pageSize,{},function(pres){
                if(pres.status == 200){
                    that.tableData = pres.results.list;
                    that.total = pres.results.totalRecord;
                }
            })
        },
        rowClick(data){
            var that = this;
            var obj = {};
            that.materialNum = 1;
            obj.materielId = data.res_id;
            obj.materielName = data.materielname;
            obj.materielCode = data.materielcode;
            obj.materielSpec = data.materielspec;
            obj.materielType = that.className;
            obj.materielUnit = data.materielunit;
            obj.classname = data.classname;
            that.middleData = obj;
            that.middleData.materielNum = that.materialNum;
            that.listShow = false;
            that.listName = data.materielname;
        },
        addNum(){
            var that = this;
            that.materialNum = that.materialNum-0;
            that.materialNum++;
            
        },
        delNum(){
             this.materialNum = this.materialNum-0;
            if(this.materialNum>1){
                this.materialNum--;
            }
        },
        editMaterial(data){
            var that =this
            that.stat = '编辑';
            that.ind = data;
            that.middleData = that.materialInfo[data];
            that.materialNum = that.materialInfo[data].materielNum;
            that.listName = that.materialInfo[data].materielName;
            that.flag = true;
            that.listShow = false;

            apiClient.get('ssiteapi/platform/activity/assembly/gettree',{},function(pres){
                if(pres.status == 200){
                    that.className = pres.results.attributes.classname;
                    that.data1 = [];
                    that.data1.push(pres.results);
                    apiClient.get('ssiteapi/platform/activity/assembly/getByType/'+that.className+'/'+that.pageNum+'/'+that.pageSize,{},function(pres){
                        if(pres.status == 200){
                            that.tableData = pres.results.list;
                            that.total = pres.results.totalRecord;
                        }
                    })
                }
            })
        },
        delLab(ind){
            this.labArr.splice(ind,1)
        },
        addSuite(){
            var that = this
             that.$refs['numberValidateForm'].validate((valid) => { 
                if (valid) {
                    var str = ''
                    that.numberValidateForm.assemblyItems = that.materialInfo
                    that.labArr.forEach(function(item){
                        str+=','+item;
                    })
                    that.numberValidateForm.assemblyTags = str.slice(1)
                    if(that.numberValidateForm.assemblyTags == ''){
                        that.$message({
                        type: 'warning',
                        message: '请填写标签!'
                    });
                    }else if(that.numberValidateForm.assemblyItems.length<1){
                        that.$message({
                            type: 'warning',
                            message: '请选择套件构成!'
                        });
                    }else if(that.$route.params.type == 'addMaterial'){
                        apiClient.linkApi('ssiteapi/platform/activity/assembly/insert','put',that.numberValidateForm,function(pres){
                            if(pres.status == 200){
                                that.$message({
                                    type: 'success',
                                    message: '添加成功',
                                });
                                that.$router.go(-1)
                            }else if(pres.status == 5004){
                                that.$message({
                                    type: 'warning',
                                    message: pres.exception,
                                });
                            }
                        })
                    }else if(that.$route.params.type == 'editMaterial'){
                        apiClient.post('ssiteapi/platform/activity/assembly/update',that.numberValidateForm,function(pres){
                            if(pres.status == 200){
                                that.$message({
                                    type: 'success',
                                    message: '修改成功',
                                });
                                that.$router.go(-1);
                            }
                        })
                    }
                }else{
                    return false;
                }
            });
            
            
        },
        delMaterial(val){
            this.$confirm('确定删除当前物料模型，删除后不可恢复?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.materialInfo.splice(val,1);
                })
        },
        Go(){
            this.$router.go(-1);
        }
    },
    watch:{
        labs(val){
            var that = this
            var labFlag = true;
            var lastLetter = val.split('')[val.length-1];
            if(lastLetter===','){
                that.labArr.forEach(function(item,index){
                    if(item == val.split(',')[0]){
                        labFlag = false;
                        that.$message({
                            type:'warning',
                            message:'标签名不能重复，请删除重新输入'
                        })
                    }
                })
                if(labFlag == true){
                    // console.log(val.split(',')[0].trim().length)
                    if(val.split(',')[0].trim().length==0){
                        that.labs = '';
                        that.$message({
                            type:'warning',
                            message:'不能输入空标签！！！'
                        })
                    }else{
                        that.labArr.push(val.split(',')[0]);
                        that.labs = '';
                    }
                    
                }
            }else if(lastLetter==='，'){
                that.labArr.forEach(function(item,index){
                    if(item == val.split('，')[0]){
                        labFlag = false
                        that.$message({
                            type:'warning',
                            message:'标签名不能重复，请删除重新输入'
                        })
                    }
                })
                if(labFlag == true){
                    // console.log(val.split('，')[0])
                    if(val.split('，')[0].trim().length==0){
                        that.labs = '';
                        that.$message({
                            type:'warning',
                            message:'不能输入空标签！！！'
                        })
                    }else{
                        that.labArr.push(val.split('，')[0]);
                        that.labs = '';
                    }
                    
                }
            }
        },
        materialNum:function(val){
            var strVal = val+'';
            var num = 0;
            if(strVal.length==1){
                num = strVal.replace(/[^1-9]/g,'')-0;
            }else{
                num = strVal.replace(/\D/g,'')-0;
            }
            if(num>0&&num<9999){
                this.materialNum = num;
            }else {
                if(num<1){
                    this.materialNum = 1;
                }else if(num >9999) {
                    this.materialNum = 9999;
                }
            }
           
        }
        
    },
    computed:{
        aryBread(){
            var ary = [
                {name:'系统设置',url:'/systemHome'},
                {name:'套件管理',url:'/systemHome/materialSuiteMng/materialSuiteInfo'},
            ];
            if(this.$route.params.type=='addMaterial'){
                ary.push({name:'套件添加',url:'/systemHome/materialSuiteMng/materialEdit/addMaterial'});
            }else{
                ary.push({name:'套件编辑',url:'/systemHome/materialSuiteMng/materialEdit/editMaterial'});
            }
            return ary;
        },
        placeHolder(){
            var that = this
            var str = '请添加标签，多个标签以‘，’隔开'
            if(that.labArr.length > 0){
                str = '';
            }
            return str;
        }
    },
    mounted(){
        if(this.$route.params.type == 'editMaterial'){
            var data = JSON.parse(window.sessionStorage.getItem('suiteData'));
            this.numberValidateForm = data;
            this.materialInfo = data.assemblyItems;
            this.labArr = data.assemblyTags.split(',');
           
        }
    },
    components:{
        commonBread,
        commonFooter
    }
}
</script>

<style scoped>
.materialEdit {
    width: 100%;
    height: 100%;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    border-top: solid 1px #e6e6e6;
}
.materialContent {
    width: 100%;
    height: calc(100% - 90px);
    overflow-y: scroll;
    margin-top: 10px;
    padding-left:0 10%;
    background: #fff;
    border-radius: 2px 2px 0px 0px;
    box-shadow: 0px 0px 9px 0px rgba(16, 129, 250, 0.1);
}
.materialTop {
    min-height: 100px;
    padding: 50px 0 0 12%;
    position: relative;
}
.el-form-item {
    display: inline-block;
    width: 41.5%;
}
.line {
    width: 90%;
    height: 1px;
    background: #efefef;
    position: absolute;
    bottom: 0;
    left: 5%;
}
.materialBottom {
    padding-left: 13%;
}
.materialBox {
    overflow: hidden;
}
.materials{
    width: 300px;
    height: 200px;
    border-radius: 2px;
    background: #fff;
    float: left;
    margin:5px 4px;
    position: relative;
    cursor: pointer;
    border: 1px solid transparent;
    -webkit-box-shadow:0px 0px 8px 2px rgba(0,0,0, 0.08);
  box-shadow:0px 0px 8px 2px rgba(0,0,0, 0.08);
}
.materials:hover {
    border: 1px solid #1081fa;
    -webkit-box-shadow:0px 0px 8px 6px rgba(16,129,250, 0.08);
  box-shadow:0px 0px 8px 6px rgba(16,129,250, 0.08);
}
.acrossLine {
    width: 30%;
    height: 3px;
    background: #e8e8e8;
    position: absolute;
    top: 50%;
    left: 35%;
}
.verticalLine {
    height: 36%;
    width: 3px;
    background: #e8e8e8;
    position: absolute;
    top: 32%;
    left: 50%;
}
.materialBtn {
    margin: 10px 0 0 73%;
}
.dialogShade {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.2);
    z-index: 999;
    top: 0;
    left: 0;
}
.tableField {
    height: calc(100% - 50px) ;
}
@media (min-width: 1600px) {
    .materialDialog {
    width: 850px;
    height: 709px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%)
}
.dialogTitle {
    width: 100%;
    height: 46px;
    padding-left: 20px;
    border-bottom: 1px solid #e5e5e5;
    color: #333333;
    font-size: 14px;
    position: relative; 
}
.dialogTitle p{
    line-height: 46px;
}
.dialogTitle span {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(-50%,-50%)
}
.partsList {
    width: 96%;
    height: 46px;
    line-height: 46px;
    padding-left: 18px;
    margin-left: 18px;
    color: #cccccc;
    font-size: 15px;
    background: #f6f6f6;
    border: solid 1px #e8e8e8;
    margin-top: 10px;
}
.dialogContent {
    width: 100%;
    height: 450px;
    margin-top: 15px;
    padding-left: 18px;
}
.contentLeft {
    width: 286px;
    height: 450px;
    margin-right: 13px;
    float: left;
    border: solid 1px #e8e8e8;
    overflow-y: auto;
}
.contentRight {
    width: 515px;
    height: 450px;
    float: left;
    font-size: 12px;
    border: solid 1px #e8e8e8;
}
.addParts {
    width: 100%;
    margin-top: 22px;
    padding-left: 664px;
}
}
@media (max-width: 1599px){
    .materialDialog {
    width: 800px;
    height: 570px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%)
}
.dialogTitle {
    width: 100%;
    height: 46px;
    padding-left: 20px;
    border-bottom: 1px solid #e5e5e5;
    color: #333333;
    font-size: 17px;
    position: relative; 
}
.dialogTitle p{
    line-height: 46px;
}
.dialogTitle span {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(-50%,-50%)
}
.partsList {
    width: 96%;
    height: 46px;
    line-height: 46px;
    padding-left: 18px;
    margin-left: 18px;
    color: #cccccc;
    font-size: 15px;
    background: #f6f6f6;
    border: solid 1px #e8e8e8;
    margin-top: 10px;
}
.dialogContent {
    width: 100%;
    height: 360px;
    margin-top: 15px;
    padding-left: 18px;
}
.contentLeft {
    width: 240px;
    height: 360px;
    margin-right: 13px;
    float: left;
    border: solid 1px #e8e8e8;
    overflow-y: auto;
}
.contentRight {
    width: 515px;
    height: 360px;
    float: left;
    font-size: 12px;
    border: solid 1px #e8e8e8;
    overflow: hidden;
}
.addParts {
    width: 100%;
    margin-top: 10px;
    padding-left: 620px;
}

}
.el-table .cell {
    line-height: 15px!important;
}
.showList {
    display: flex;
    height: 46px;
    color:#666;
    font-size: 14px;
}
.listLeft{
    width: 77%;
}
.listLeft span:nth-child(1),.listRight span:nth-child(1){
    color:#333;
}
.listLeft span:nth-child(2),.listRight span:nth-child(2){
    color:#666;
}
.listRight{
    border-top: 1px solid transparent;
}
.listNum {
    display: inline-block;
    height: 36px;
}
.num {
    display: inline-block;
    width: 36px;
    text-align: center;
    border:none;
    outline: none;
    height: 36px;
}
.listNum button {
    border:none;
    outline: none;
    width: 36px;
    height: 36px;
    cursor: pointer;
}
.labBox {
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        width: 85.5%;
        max-height: 80px;
        padding-left: 10px;
        overflow-y: auto;
}
.labBox:hover {
    border-color:#aaaaaa ;
}
.labs {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border: solid 1px #cccccc;
    margin:1px;
    padding: 0 5px;
}
.labs b {
    font-weight: normal;
    color:#666;
}
.labBox .icon-guanbi2 {
    border-radius: 50%;
    border: 1px solid #ccc;
    color:#ccc;
}
.labIpt {
    border:none;
    outline: none;
    width: 100%;
}
.icon-shanchu1 {
    display:none;
    position: absolute;
    right: 0;
    color:#1081fa;
}
.materials:hover .icon-shanchu1 {
    display: inline;
}
.materielName {
    width: 90%;
    margin-left: 5%;
    height: 52px;
    line-height: 52px;
    position: relative;
    padding-left: 20px;
    border-bottom: 1px solid #e8e8e8;
    font-weight: bold;
    color:#333333;
    position: relative;
    font-size: 14px;
}
.asdf p{
    padding-left: 5%;
    height: 44px;
    line-height: 44px;
    color:#666666;
    font-size: 12px;
}
.asdf span{
    display: inline-block;
    width: 110px;
    margin-left: 40%;
    color:#fe9b00;
    font-size: 14px;
    text-align: right;
}
.sqare {
    width: 11px;
    height: 11px;
    margin-top: 7.5%;
    background-color: #fe9b00;
    transform:rotate(45deg);
    position: absolute;
    left: 0;
}
.demo-ruleForm {
    height: 150px;
    overflow: hidden;
}
.labelBox {
    position: absolute;
    margin-left: 7px;
}
.is-current{
    background: #000!important;
}
.partCla {
    color:#333;
}
</style>
