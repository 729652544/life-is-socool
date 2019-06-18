<template>
    <div class="commonSelect">
        <div v-if="type=='group'" class="mySelect" @click="open($event)">
            <p class="title">{{title}}</p>
            <p class="opt"><span>{{options||'全部'}}</span> <i v-show="!options" class="iconfont icon-xiala1"></i></p>
            <ul :class="openSelectBool?'openSelect':'closeSelect'" ref='selectHideBar'>
                <li @click="clearAllBtn" :class="clearAll?'clearAll':'keep'">清除所有</li>
                <li v-for="(item,ind) in aryOper" :key="ind">
                    <input :id="item.name" :checked='currentOper.indexOf(item.id)>-1' @click="groupChange(item,ind)" type="checkbox">
                    <label :for="item.name">{{item.name}}</label>
                </li>
            </ul>
        </div>
        <div v-else-if="type=='single'" class="mySelect" @click="open($event)">
            <p class="title">{{title}}</p>
            <p class="opt"><span>{{options||aryOper[0].name}}</span><i class="iconfont icon-xiala1"></i></p>
            <ul :class="openSelectBool?'openSelect':'closeSelect'" ref='selectHideBar'>
                <li class="handLi" v-for="(item,ind) in aryOper" :key='ind' @click="singleChange(item,ind)">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        },
        aryOper:{
            type:Array,
            default:[
                {
                    id:'',
                    name:'无数据'
                }
            ]
        },
        currentOper:{
            type:Array|String,
            default:[]
        },
        openSelectBool:{
            type:Boolean,
            default:false
        },
        type:{
            type:String,
            default:'group'
        }
    },
    data(){
        return {
            options:'',
            clearAll:true,
        }
    },
    methods :{
        clearAllBtn(){
            // this.currentOper = [];
            this.options = '';
            this.clearAll = true;
            this.$emit('clearArr')
        },
        singleChange(item,index){
            this.options = item.name;
            this.$emit('getDataInfo',item.id)
        },
        groupChange(item,index){
            var that = this;
            var ind = that.currentOper.indexOf(item.id);
            var str = that.aryOper[index].name;
            var ary = that.options.split(';')
            var a = '';
            if(ind>-1){
                var sss = ary.indexOf(str);
                ary.splice(sss,1);
                that.options = ary.join(';');
                a = that.options.split(';').length;
                that.currentOper.splice(sss,1);
            }else {
                that.currentOper.push(item.id);
                that.options+=that.aryOper[index].name+';';
                a = that.options.split(';').length;
            }
            if(a>2){
                that.clearAll = false;
            }else {
                that.clearAll = true;
            }
            this.$emit('getDataInfo');
            document.addEventListener('click',that.hideSelect,false);
        },
        open(event){
            var that = this;
            event || (event = window.event);
            event.stopPropagation? event.stopPropagation() : (event.cancelBubble = true);
            if(that.openSelectBool){
                if(that.$refs.selectHideBar&&!that.$refs.selectHideBar.contains(event.target)){
                    document.removeEventListener('click',that.hideSelect,false);
                }
            }else {
                document.addEventListener('click',that.hideSelect,false);
            }
            this.$emit('showOptions',1)
        },
        hideSelect(e){
            var that = this;
            if(that.$refs.selectHideBar&&!that.$refs.selectHideBar.contains(e.target)){
                this.$emit('showOptions',2)
            }
        }
    }
}
</script>

<style>
    .commonSelect {
        display: inline-block;
        min-width: 30px;
    }
    .mySelect {
        position: relative;
    }
    .mySelect .opt{
        max-width: 80px;
        width: 65px;
        overflow : hidden;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 13px;
        cursor: pointer;
        color:#666;
        padding-right: 10px;
        padding-left: 5px;
        float: left;
        box-shadow: #1081fa;
    }
    .opt:hover {
        color:#1081fa;
    }
    .mySelect .title {
        float: left;
        font-size: 14px;
        cursor: pointer;
        color:#333;
    }
     .mySelect ul {
         min-width: 110px;
         position: absolute;
         top: 50px;
         left:0px;
         z-index: 999;
         background: #fff;
         padding: 6px 0;
         border:1px solid #e4e7ed;
         max-height: 150px;
         overflow-y: auto;
     }
     .mySelect ul li {
         line-height: 34px;
         padding: 0 10px;
         color:#666;
         font-size: 14px;
     }
     .mySelect ul li label,.mySelect ul li input {
         cursor: pointer;
         font-size: 14px;
     }
     .mySelect ul li:hover {
         background: #eaf1fb;
         color:#1081fa
     }
     .closeSelect {
         display: none;
         transition: display .3s;

     }
     .openSelect{
         display: block;
         transition: display .3s;
     }
     .clearAll {
         display:none;
     }
     .keep {
         color:#1081fa!important;
         cursor: pointer;
     }
     .handLi {
         cursor: pointer;
     }
</style>
