<script setup lang='js' name='CreateOrder'>
import { useRouter ,useRoute} from 'vue-router';
import StateBar from '@/components/StateBar.vue';
import {company,createOrder} from '@/api/index'
import {ref,onMounted,computed} from 'vue'
import Qrconde from 'qrcode'//将地址转化为二维码图片

const router = useRouter()
const route = useRoute()

// 返回上一页
const goBack = () => {
  router.go(-1)
}
const form = ref({
  // 如果从医院进来则不需要再选择医院
  hospital_id:route.query.id?Number(route.query.id):'',
  hospital_name:route.query.name?route.query.name:'',
  demand:'',//备注
  companion_id:0,//陪护师id
  receiveAddress:'',//接送地址
  tel:'',//练习电话
  starttime:0//服务开始时间
})
// 显示医院下拉
const showHospital = ref(false)
// 显示时间
const showTime = ref(false)
// 陪诊师
const showCompany = ref(false)
const dateStr = ref('')
// 最小时间
const minDate = ref(new Date())
// 陪诊师显示
const companion_name = ref()
// 支付页面显示与隐藏
const showPay = ref(false)
const payUrl = ref()

const companyInfo = ref({
  companion:[],
  hospitals:[],
  service:{}
})

// 医院下拉列表数据
const hospitalList = computed(() =>  companyInfo.value.hospitals.map(item => {return{text:item.name,value:item.id}})
)
console.log(hospitalList.value);

// 陪诊师下拉列表数据
const companyList = computed(() => companyInfo.value.companion.map(item=>{return{text:item.name,value:item.id}}))

onMounted(async() => {
  const res =await company()
  companyInfo.value = res.data.data  
})

// 选择医院
const hospitalConfirm = (item) => {
  form.value.hospital_id= item.selectedOptions[0].value
  form.value.hospital_name= item.selectedOptions[0].text
  showHospital.value = false
}

// 选择时间
const timeConfirm =(item) => {
   dateStr.value= item.selectedValues.join('-')
  form.value.starttime = new Date(dateStr.value).getTime()
  showTime.value = false
}

// 选择陪诊师
const companyConfirm = (item) => {
  console.log(item.selectedOptions);
  
  form.value.companion_id = item.selectedOptions[0].value
  companion_name.value = item.selectedOptions[0].text
  showCompany.value = false
}
// 关闭支付
const close = () => {
  showPay.value = false
  // 跳转到订单
  router.push('/order')
} 
// 提交订单
const submitOrder = async () => {
  for(let key in form.value){
    if(!form.value[key]){
      
      return showNotify({ message: '请将每一项数据填写完整' });
    }
  }
  const res =await createOrder(form.value)
  console.log(res);
  
  if(res.data.code===10000){
    Qrconde.toDataURL(res.data.data.wx_code).then((url) => {
      payUrl.value = url
      showPay.value = true
    })
  }
  
}
</script>
<template>
    <header class="header">
      <van-icon @click="goBack" name="arrow-left"size='30' />
      <p>填写服务订单</p>
    </header>
    <StateBar item="0"/>
    <main class="main">
      <van-cell class="cell" >
          <template #title>
            <van-image class="cell-img" width="25" :src="companyInfo.service.serviceImg"/>
            <span>{{ companyInfo.service.serviceName}}</span>
          </template>
          <template #default>
            <van-icon class="icon" name="info-o" />
            <span class="content">服务内容</span>
          </template>
      </van-cell>
      <!-- 表单区域 -->
       <van-cell-group class="cell">
        <!-- 就诊医院 -->
          <van-cell  >
            <template #title>
              就诊医院
            </template>
            <template #default @click="">
              <div @click="showHospital=true">
                {{form.hospital_name || '请选择医院'}}
                <van-icon size="16" name="arrow" />
              </div>
            </template>
        </van-cell>
        <van-cell  >
            <template #title>
              就诊时间
            </template>
            <template #default >
              <div @click="showTime=true">
                {{ dateStr || '请选择就诊时间' }}
                <van-icon size="16" name="arrow" />
              </div>
            </template>
        </van-cell>

        <van-cell  >
            <template #title>
              陪诊师
            </template>
            <template #default >
              <div @click="showCompany=true">
                {{  companion_name || '请选择陪诊师' }}
                <van-icon size="16" name="arrow" />
              </div>
            </template>
        </van-cell>

        <!-- 接送地址 -->
        <van-cell center>
            <template #title>
             接送地址
            </template>
            <template #default >
              <van-field 
              input-align="right"
              v-model="form.receiveAddress"
              placeholder="请输入接送地址"/>
            </template>
        </van-cell>

          <!-- 联系电话 -->
          <van-cell center>
            <template #title>
             联系电话
            </template>
            <template #default >
              <van-field 
              input-align="right"
              v-model="form.tel"
              placeholder="请输入联系电话"/>
            </template>
        </van-cell>
       </van-cell-group>

       <!-- 备注 -->
       <van-cell-group title="服务需求" class="cell">
          <van-cell  style="height: 150px;">
            <van-field type="textarea" v-model="form.demand" placeholder="请简单描述你要就诊的科室"/>
          </van-cell>
       </van-cell-group>

       <!-- 提交订单 -->
        <van-button style="position: absolute;bottom: 0;" type="primary" @click="submitOrder" size="large">提交订单</van-button>
       <!-- 弹出层 -->
       <van-popup 
       v-model:show="showHospital" 
        :style="{ height: '30%' }"
       position="bottom">
       <van-picker
          title="医院"
          :columns="hospitalList"
          @confirm="hospitalConfirm"
          @cancel="showHospital = false"
      />
       </van-popup>
        <!-- 选择时间 -->
       <van-popup 
       v-model:show="showTime" 
        :style="{ height: '30%' }"
       position="bottom">
          <van-date-picker
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="timeConfirm"
            @cancel="showHospital = false"
          />
      </van-popup>
      <!-- 陪诊师 -->
      <van-popup 
       v-model:show="showCompany" 
        :style="{ height: '30%' }"
       position="bottom">
       <van-picker
          title="陪诊师"
          :columns="companyList"
          @confirm="companyConfirm"
          @cancel="showCompany = false"
      />
       </van-popup>
    </main>
    <!-- 支付弹窗 -->
    <van-dialog :showConfirmButton="false" class="payDialog" v-model:show="showPay" >
      <div class="pay-head">
        <van-icon name="cross" class="close" @click="close"/>
        <p class="title">微信支付</p>
      </div>
     
    <van-image class="payimg" width="150" :src="payUrl" />
  <div style="text-align: center; margin-bottom: 10px">请用本人微信扫描二维码支付</div>
    </van-dialog>
</template>

<style scoped >
.header{
  padding: 10px 5px;
  display: flex;
  line-height: 30px;
  p{
    width: calc(100% - 35px);
    text-align: center;
    font-size: 18px;
  }
}
.main{
  .van-cell{
    justify-items: center;
  }
  .cell{
    width: 95%;
    margin: 10px;
      line-height: 40px;
      .cell-img{
        margin-right: 10px;
        vertical-align: middle;
       
      }
      .content{
          margin-left: 15px;
      }
  }
}
.pay-head{
    display: flex;
    justify-content: space-between;
  }
  .close{
    margin: 10px 0 0 10px
  }
  .title{
    margin-right: 30px;
    margin-top: 10px;
    width: calc(100% - 30px);
    text-align: center;
    font-weight: 700;
  }

.payimg{
  margin-top: 10px;
  margin-left: 25%;
}
</style>