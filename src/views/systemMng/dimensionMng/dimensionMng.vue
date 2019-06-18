<template>
  <div class="dimensionMng">
        <common-bread :aryBread="aryBread"></common-bread>
        <div class="contentField">
            <div class="dimListField">
                <el-tree 
                    ref="dimData"
                    :data="dimData" 
                    class="dimTree" 
                    :props="dimTreeProps"
                    node-key="id"
                    :highlight-current="true"
                    :default-expanded-keys="[currentDim.id]"
                     @node-click="showDimInfo">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span class="operField">
                            <span class="iconfont icon-jiahao" @click.stop="addDimTree(node)"></span>
                            <span class="iconfont icon-bianji" v-if="data.id!=='1'" @click.stop="editDimTree(node)"></span>
                            <span class="iconfont icon-iconfonttubiao" v-if="data.id!=='1'" @click.stop="delDimTree(node)"></span>
                        </span>
                    </span>
                </el-tree>
            </div>
            <div class="dimInfoField">
                <div class="dimInfoContent">
                    <div class="welcomePage" v-if="this.currentDim.id=='1'">
                        <div class="blankImg">
                            <div class="welText">欢迎进入维度管理</div>
                        </div>
                        
                    </div>
                    <el-form class="dimForm" v-if="this.currentDim.id!=='1'" ref="dimForm" :rules="dimFormRule" label-width="90px"  :model="dimForm" >
                        <div class="sTitle">
                            基本信息
                        </div>
                        <el-form-item label="名称：" prop="dimName">
                            <el-input v-model="dimForm.dimName" :disabled="isEdit"></el-input>
                        </el-form-item>
                        <el-form-item label="是否可见：" >
                            <el-radio-group v-model="dimForm.isVisual">
                                <el-radio :label="0" :disabled="isEdit">否</el-radio>
                                <el-radio :label="1" :disabled="isEdit">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="描述：" prop="dimDesc">
                            <el-input type="textarea" :rows="3" v-model="dimForm.dimDesc" :disabled="isEdit"></el-input>
                        </el-form-item>
                        <div class="sTitle">
                            条件列表
                        </div>
                        <div v-for="(item,index) in dimForm.filterArray"
                             :key="index"
                             class="fieldItem"
                             >
                            <el-form-item label="维度模型：" prop="tn">
                                <el-input 
                                    v-model="item.tnText"
                                    placeholder="请选择维度模型" 
                                    :suffix-icon="item.isShowSelect?'el-icon-arrow-down':'el-icon-arrow-right'"
                                    readonly="readonly"
                                    @click.native="isEdit?'':showFilterTree(index)"
                                    :disabled="isEdit"
                                   >
                                </el-input>
                                <div class="flowTree"  v-if="item.isShowSelect"   @mouseleave.stop="item.isShowSelect= false">
                                    <el-tree
                                        empty-text="暂无数据"
                                        :expand-on-click-node="false"
                                        :data="dimModelData"
                                        :props="dimTreeModelProps"
                                        :default-expand-all="true"
                                        class="dimModelTree"
                                         @node-click="dimModelNodeClick"
                                    >
                                    </el-tree>
                                </div>
                                <div class="aliasField">别名：{{item.alias}}</div>
                                <el-button  v-if="!isEdit" class="removeField" type="primary" @click="deleteField(index)">删除维度条件</el-button>
                            </el-form-item>
                            <el-form-item label="查询语句：">
                                <div class="fieldBox" prop="content">
                                    <p v-for="attr in item.aryAttr"
                                        :key="attr.dbFiledname">
                                        <span v-if="attr.propertyFiledType==1">{{attr.dbFiledname}}-文本型-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==2">{{attr.dbFiledname}}-字符型-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==3">{{attr.dbFiledname}}-数值型-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==4">{{attr.dbFiledname}}-字典型（单选）-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==5">{{attr.dbFiledname}}-字典项（多选）-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==6">{{attr.dbFiledname}}-图片型-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==7">{{attr.dbFiledname}}-时间型-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==8">{{attr.dbFiledname}}-坐标型-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==9">{{attr.dbFiledname}}-维度-{{attr.propertyTitle}}</span>
                                        <span v-if="attr.propertyFiledType==10">{{attr.dbFiledname}}-挂载-{{attr.propertyTitle}}</span>
                                    </p>
                                </div>
                                <el-input type="textarea" :rows="3" v-model="item.content" :disabled="isEdit"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label=" " v-if="!isEdit">
                            <div class="addBtn" @click="addField"><span class="iconfont icon-jiahao"></span>&nbsp;&nbsp;添加</div>
                        </el-form-item>
                        <el-form-item class="subField" v-if="!isEdit">
                            <el-button type="info" @click="cancle()">取消</el-button>   
                             <el-button type="primary" @click="saveDimInfo()">确认</el-button>
                        </el-form-item>
                        
                    </el-form>
                </div>
                 <common-footer></common-footer>
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
  name:'dimensionMng',
  data(){
      var checkName = (rule, value, callback) => {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        if(!reg.test(value)){
            callback(new Error('名称中不可输入特殊字符'));
        }else{
            callback();
        }
    };
      return{
            aryBread:[
                {name:'系统设置',url:'/systemHome'},
                {name:'维度管理',url:''},
            ],
            currentDim:{id:'1'},
            dimData:[],
            dimTreeProps: {
                children: 'children',
                label: 'text'
            },
            dimForm:{
                dimPid:'',
                dimName:'',
                isVisual:1,
                dimDesc:'',
                filterArray:[{
                    tn:'',
                    tnText:'',
                    alias:'',
                    content:'',
                    isShowSelect:false,
                    aryAttr:[],
                }]
            },
            dimFormRule:{
                dimName:[
                    { required: true, message: '名称不可为空', trigger: 'blur' },
                    { max:10, message: '名称最多为10个字符', trigger: 'blur' },
                    { validator: checkName, trigger: 'blur' }
                ],
                dimDesc:[
                    { max:20, message: '描述最多为200个字符', trigger: 'blur' }
                ],
            },
            isShowSelect:false,
            dimModelData:[],
            dimTreeModelProps: {
                children: 'children',
                label: 'text'
            },
            currentFilter:-1,
            isEdit:false,
      }
  },
    watch:{
    },
    components: {
        commonBread,
        commonFooter
    },
    created(){
        this.getDimTree('1');
    },
    mounted() {   
        this.getDimModel();
    },
    methods:{
        getDimTree:function(id){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/diminfo/list','',function(pres){
                that.dimData=[]; 
                that.dimData.push(pres.results);       
                setTimeout(function(){
                    that.selectDimTree(id);
                },100)
            })
        },
        selectDimTree:function(id){
            var that = this;
            if(id){
                that.currentDim = {id:id}
                that.$refs['dimData'].setCurrentKey(id);
            }else{
                that.currentDim = {id:'1'}
                that.$refs['dimData'].setCurrentKey('1');
            }
        },
        getDimModel:function(){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/class/queryDataByClassTag/dim','',function(pres){
                that.dimModelData = [pres.results];
            });
        },
        toTreeData:function(data,parent_id){
            var tree = [];
            var temp;
            for (var i = 0; i < data.length; i++) {
                if (data[i].parentnodeid == parent_id) {
                    var obj = data[i];
                    temp = this.toTreeData(data, data[i].id);
                    if (temp.length > 0) {
                    obj.children = temp;
                    }
                    tree.push(obj);
                }
            }
            return tree;
        },
        dimModelNodeClick:function(obj,node,self){
            var that = this;
            if(obj.attributes.classname=='ResObject'){
                that.$message({
                    type: 'warning',
                    message: '不可选择根节点'
                });
                return false;
            }

            var isHave  = false;
            $.each(that.dimForm.filterArray,function(i){
                if(that.currentFilter!==i){
                    if(that.dimForm.filterArray[i].tn == obj.attributes.classname){
                        isHave = true;
                    }
                }
            });
            if(isHave){
                that.$message({
                    type: 'warning',
                    message: '条件列表中维度模型不可重复'
                });
                return false;
            }
            if(that.dimForm.filterArray[that.currentFilter].tn !== obj.attributes.classname){
                that.dimForm.filterArray[that.currentFilter].tn = obj.attributes.classname;
                 that.dimForm.filterArray[that.currentFilter].tnText = obj.text;
                that.dimForm.filterArray[that.currentFilter].alias = 't'+new Date().getTime();
                that.dimForm.filterArray[that.currentFilter].content = '';
                that.getFieldAttr(obj.attributes.classname,that.currentFilter);
            }

        },
        // 获取维度模型的属性
        getFieldAttr:function(classname,index){
            var that = this;
            if(classname!==null&&classname!==''){
                apiClient.get('ssiteapi/platform/asset/property/listByClassName/'+classname,'',function(pres){
                    that.dimForm.filterArray[index].aryAttr = pres.results.selfList;
                })
            }
        },
        getDimInfo:function(classname,index){
            var that = this;
            if(classname==null||classname==''){
                that.dimForm.filterArray[index].tnText = '';
            }else{
                apiClient.get('ssiteapi/platform/asset/class/queryDataByClassName/'+classname,'',function(pres){   
                    that.dimForm.filterArray[index].tnText = pres.results.classcnname;
                })
            }
            
        },
        showFilterTree:function(index){
            var that = this;
            that.dimForm.filterArray[index].isShowSelect = !that.dimForm.filterArray[index].isShowSelect;
            that.currentFilter = index;
        },
        
        getNodeText:function(ary,text,index){
            var have = false;
            $.each(ary,function(i){
                if(ary[i].data.text==text){
                    have = true;
                }
            });
            if(have){
                index++;
                return this.getNodeText(ary,text.substring(0,4)+index,index);
            }else{
                return text;
            }
        },
        // 编辑维度树
        editDimTree:function(node){
            var that = this;
            that.isEdit = false;
            that.currentDim = node.data;
            that.$refs['dimData'].setCurrentKey(node.data.id);
            if(node.data.id.indexOf('new')>-1){
                that.dimForm = {
                    dimId:node.data.id,
                    dimPid:node.parent.data.id,
                    dimName:node.data.text,
                    isVisual:1,
                    dimDesc:'',
                    filterArray:[{
                        tn:'',
                        alias:'',
                        content:'',
                        isShowSelect:false,
                        aryAttr:[],
                    }]
                };
            }else{
                that.getDimInfoById(node.data.id);
            }
        },
        // 删除维度树
        delDimTree:function(node){
            var that = this;
            // 有子节点的节点不能删
            if(node.childNodes&&node.childNodes.length>0){
                that.$message({
                    type: 'warning',
                    message: '该节点有子节点，不支持删除'
                });
                return false;
            }
            that.$confirm('确定删除该维度节点，删除后不可恢复?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 假的节点
                if((node.data.id+'').indexOf('new')>-1){
                    that.$refs['dimData'].remove(node.data.id);
                    that.selectDimTree('init');
                }else{
                     apiClient.linkApi('ssiteapi/platform/asset/diminfo/remove/'+node.data.id,'delete',{},function(pres){
                        that.getDimTree();
                     });
                }
                
            })
        },
        deleteField:function(index){
            if(this.dimForm.filterArray.length>1){
                this.dimForm.filterArray.splice(index,1);
            }else{
                this.$message({
                    type: 'warning',
                    message: '条件列表不能为空!'
                });
            }
        },
        addField:function(){
            var objField = {
                tn:'',
                alias:'',
                content:'',
                isShowSelect:false,
            }
            this.dimForm.filterArray.push(objField);
        },
        // 增加维度树节点
        addDimTree:function(node){
            var that = this;
            var nodeText = '';
            if(node.childNodes.length==0){
                nodeText = '新建维度'
            }else{
                nodeText = this.getNodeText(node.childNodes,'新建维度',1);
            }
            
            var newNode = {
                "id":'new'+new Date().getTime(),
                "state":"open",
                "text":nodeText,
            };
            that.$refs['dimData'].append(newNode,node);
            setTimeout(function(){
                that.currentDim = newNode,
                that.$refs['dimData'].setCurrentKey(newNode.id); 	
                that.$refs['dimData'].getNode(node.data.id).expanded = true;
                that.dimForm = {
                    dimId:'new'+new Date().getTime(),
                    dimPid:node.data.id,
                    dimName:nodeText,
                    isVisual:1,
                    dimDesc:'',
                    filterArray:[{
                        tn:'',
                        alias:'',
                        content:'',
                        isShowSelect:false,
                        aryAttr:[],
                    }]
                };
                that.isEdit = false;
            },100)
        },
        showDimInfo:function(obj,node,self){
            var that = this;
            that.isEdit = true;
            that.currentDim = obj;
            if(obj.id.indexOf('new')>-1){
                that.dimForm = {
                    dimPid:obj.id,
                    dimName:obj.text,
                    isVisual:1,
                    dimDesc:'',
                    filterArray:[{
                        tn:'',
                        alias:'',
                        content:'',
                        isShowSelect:false,
                        aryAttr:[],
                    }]
                };
            }else{
                that.getDimInfoById(obj.id);
            }
            
        },
        getDimInfoById:function(id){
            var that = this;
            apiClient.get('ssiteapi/platform/asset/diminfo/getDataById/'+id,'',function(pres){
                var obj = pres.results;
                that.dimForm.dimId = obj.dimId;
                that.dimForm.dimName = obj.dimName;
                that.dimForm.dimDesc = obj.dimDesc;
                that.dimForm.dimPid = obj.dimPid;
                that.dimForm.isVisual = obj.isVisual;

                var ary = JSON.parse(obj.filterArray);
                var aryFilter = [];
                $.each(ary,function(i){
                    aryFilter.push({
                        tn:ary[i].tn,
                        alias:ary[i].alias,
                        content:ary[i].content,
                        isShowSelect:false,
                        aryAttr:[],
                        tnText:'',
                    })
                    that.getFieldAttr(ary[i].tn,i);
                    that.getDimInfo(ary[i].tn,i);
                })
                that.dimForm.filterArray = aryFilter;
            })
        },
        // 保存维度信息
        saveDimInfo:function(){
            var that = this;
            that.$refs['dimForm'].validate((valid) => {
                if(valid){ 
                    var nowFilter = that.dimForm.filterArray;
                    var aryFilter = [];
                    var isOk = false;
                    $.each(nowFilter,function(i){
                        if(nowFilter[i].tn!==''&&nowFilter[i].content!==''){
                            isOk = true;
                        }
                        aryFilter.push({
                            tn:nowFilter[i].tn,
                            alias:nowFilter[i].alias,
                            content:nowFilter[i].content,
                        })
                    });
                    if(!isOk){
                        this.$message.error('条件列表中至少有一项要信息完整');
                        return false;
                    }
                    if(that.currentDim.id.indexOf('new')>-1){
                        that.addDimInfo(aryFilter);
                    }else{
                        that.editDimInfo(aryFilter);
                    }
                }else{
                    return false;
                }
            })
        },
        // 保存维度
        addDimInfo:function(aryFilter){
            var that = this;
            var param = {
                dimDesc:that.dimForm.dimDesc,
                dimName:that.dimForm.dimName,
                dimPid:that.dimForm.dimPid,
                isVisual:that.dimForm.isVisual,
                filterArray:JSON.stringify(aryFilter),
            };
            apiClient.linkApi('ssiteapi/platform/asset/diminfo/insert','put',param,function(pres){
                if(pres.status==200){
                    that.getDimTree(pres.results.dimId);
                     that.isEdit = true;
                }else if(pres.status==5006){
                    that.$message.error('该维度名称已存在');
                }
               
            });
        },
        // 修改维度
        editDimInfo:function(aryFilter){
            var that = this;
            var param = {
                dimId:that.dimForm.dimId,
                dimDesc:that.dimForm.dimDesc,
                dimName:that.dimForm.dimName,
                dimPid:that.dimForm.dimPid,
                isVisual:that.dimForm.isVisual,
                filterArray:JSON.stringify(aryFilter),
            };
            apiClient.linkApi('ssiteapi/platform/asset/diminfo/update','post',param,function(pres){
                if(pres.status==200){
                    that.getDimTree(that.dimForm.dimId);
                    that.isEdit = true;
                }else if(pres.status==5006){
                    that.$message.error('该维度名称已存在');
                }
            });
        },
        // 取消
        cancle:function(){
            var that = this;
            that.$refs['dimData'].setCurrentKey('1');
            that.currentDim={id:'1'};
        },
        dimTnBlur:function(event){
            var that = this;
            that.dimForm.filterArray[0].isShowSelect = false;
        }
    },
    filters: {
    }
}
</script>
<style scoped>
.dimensionMng{
    width: 100%;
    height: 100%;
    background: #efefef;
    padding: 10px 10px 0px 10px;
    border-top: solid 1px #e6e6e6;
}  
.dimListField{
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
.dimInfoField{
    width: calc(100% - 310px);
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px 
        rgba(16, 129, 250, 0.1);
    border-radius: 2px;
    display: inline-block;
    float: right;    
}
.dimInfoContent{
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
    padding: 10px 100px;
}
.contentField{
    width: 100%;
    padding: 10px 0px 0px 0px;
    height: calc(100% - 40px);;
}
.custom-tree-node{
    width: 100%;
}
.operField{
    display: none;
    position: absolute;
    right: 0px;
    color: #666!important;
}
.operField .iconfont{
    margin-right:12px;
    color:#666666;
}
.operField .iconfont:hover{
    color: #1081fa;
}
.sTitle{
    width: 100%;
    border-bottom: 1px solid #d2d2d2;
    font-weight: 600;
    height: 50px;
    text-indent: 10px;
    color: #333333;
    line-height: 50px;
    margin-bottom: 20px;
    font-size: 14px;
}
.dimForm .el-input{
    width: 50%;
} 
.flowTree{
    position: absolute;
    overflow: auto;
    z-index: 100;
    width: 50%;
    height: 150px;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    margin-top:5px;
    background: #ffffff;
    z-index: 1;
}
.aliasField{
    position: absolute;
    left: 50%;
    top: 0px;
    margin-left: 20px;
    color: #cdcccc;
}
.fieldBox span{
    display: inline-block;
    color: #828282;
}
.addBtn{
    width: 100%;
    height: 36px;
	border-radius: 2px;
    border: solid 1px #d2d2d2;
    text-align: center;
    line-height: 36px;
    color: #777474;
    cursor: pointer;
}
.addBtn:hover{
    color: #1081fa;
    border: 1px solid #1081fa;
}
.removeField{
    position: absolute;
    right: 5px;
    width: 130px;
    background: #1081fa;
}
.subField{
    text-align:right;
    padding-right: 5px;
}
.welcomePage{
    height: 100%;
    -webkit-display:flex;
    display:flex;
    -webkit-align-items:center;
    align-items:center;
    -webkit-justify-content:center;
    justify-content:center;
}
.blankImg{
    width: 266px;
    height: 170px;
    background: url("../../../assets/image/dimBlank.png") no-repeat;
    position: relative;
}
.welText{
    width: 100%;
    height: 30px;
    line-height: 30px;
    position: absolute;
    bottom: 0px;
    text-align: center;
    font-size: 16px;
    color: #666;
}
.fieldItem{
    margin-bottom: 20px;
}
</style>
<style>
.dimTree .el-tree-node__content{
    height: 40px!important;
    display:block!important;
    line-height: 40px!important;
    position: relative!important;
    color: #666666!important;
    font-size: 14px!important;
}
.dimTree .el-tree-node__content:hover{
    background-color: #eaf1fb!important;
    height: 40px!important;
    color: #1081fa!important;
}
.dimTree .el-tree-node__content:hover .operField{
    display: inline;
}
.dimTree.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: #eaf1fb!important;
    height: 40px!important;
    color: #1081fa!important;
}
.dimTree.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .operField{
    display: inline-block;
}

</style>