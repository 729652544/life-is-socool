<template>
    <div class="cSelectDouble">
         <el-select v-model="nowData.val" :placeholder="'请输入'+itemData.name" multiple @change="valueChange">
            <el-option
            v-for="item in options"
            :key="item.itemId"
            :label="item.itemName"
            :value="item.itemId">
            </el-option>
        </el-select>
    </div>
</template>
<script>
import Vue from 'vue' 
import apiClient from '@/publicJs/apiClient.js'
export default {
    name:'cSelectDouble',
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
        }
    },
    watch:{
    },
    data(){
      return {
        options: [],
        nowData:{val:[]},
      };
    },
    watch:{
    },
    components: {

    },
    mounted(){
        this.getItemInfoById();
    },
    methods:{
       getItemInfoById:function(){
          var that = this;
          apiClient.get('ssiteapi/platform/asset/dict/listItemByDictId/'+that.itemData.dicId,{},function(pres){
              that.options = pres.results;

              var valueArr = that.itemData.value == ''?'':that.itemData.value.split(',');
              valueArr.forEach(function(item,index){
                  valueArr[index] = Number(item);
              })
            //   Vue.set(that.itemData, 'value', 0)  
              setTimeout(function(){
                  if(valueArr!==null&&valueArr.length>0){
                       Vue.set(that.nowData,'val',valueArr)
                  }
              },300)
          });
      },
      valueChange:function(value){
         this.itemData.value = value.join(',');
      }
    }   
}
</script>
<style scoped>
</style>