<template>
    <div class="cSelect">
         <el-select v-model="itemData.value" :placeholder="'请选择'+itemData.name">
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
    name:'cSelect',
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
      };
    },
    components: {

    },
    created(){
        this.getItemInfoById();
    },
    methods:{
       getItemInfoById:function(){
          var that = this;
          apiClient.get('ssiteapi/platform/asset/dict/listItemByDictId/'+that.itemData.dicId,{},function(pres){
              that.options = pres.results;
              var value = that.itemData.value;
            //   Vue.set(that.itemData, 'value', 0)  
              setTimeout(function(){
                  if(value!==null&&value!==''){
                       Vue.set(that.itemData, 'value', value-0)  
                  }
              },300)
             
          });
      }
    }   
}
</script>
<style scoped>
</style>