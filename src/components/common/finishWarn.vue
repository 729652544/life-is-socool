<template>
    <div class="finishWarn">
        <el-dialog
        class="powerDialog"
        title="操作提示"
        :visible.sync="show"
        width="450px"
        :before-close="closeDialog"
        top='16%'
        >
            <div class="content">
                <p>此<span>{{taskName}}</span>已于<span>{{dataObj.createtime|dateFormat}}</span>处理完毕</p>
                <!-- <p>此<span>{{taskName}}</span>已被<span class="executor">{{dataObj.processor}}</span>于<span>{{dataObj.createtime|dateFormat}}</span>处理完毕</p> -->
                <div class="closeDialogBox">
                    <el-button type='primary' @click='closeDialog'>确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import apiClient from '@/publicJs/apiClient.js' 
import UtilService from '@/publicJs/UtilService'
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false,
        },
        dataObj:{
            type:Object,
            default:{}
        }
    },
    data(){
        return {
            
        }
    },
    computed:{
        show(){
            return this.isShow
        },
        taskName(){
            if(this.dataObj.taskName=='确认送电'){
                return "送电申请"
            }else {
                return "断电申请"
            }
            
        }
    },
    watch:{
    },
    methods:{
        closeDialog(){
            this.$emit('close',{})
        }
    },filters: {
        //时间格式化
        dateFormat: function (value) {
          if(value!==''&&value!==0){
            return UtilService.formatDuring(value, 'yyyy-MM-dd  HH:mm:ss');
          }else {
            return '暂无'
          }
        },
        
    }
}
</script>

<style scoped>
.executor {
    color:#1081fa;
    text-decoration: underline;
}
.closeDialogBox {
    padding-left: 345px;
}
.content {
    line-height: 60px;
    padding-left: 10px;
}
</style>
