<script setup lang='js' name='Detail'>
import { useRoute,useRouter } from 'vue-router';
import StateBar from '@/components/StateBar.vue';
import {reactive,ref,computed} from 'vue'
import {detail} from '@/api/index'
import Counter from '@/components/Counter.vue';
import Qrcode from 'qrcode'
const router = useRouter()
const route = useRoute()
const payImg = ref('')
// 状态枚举
const stateList = {
  '待支付':10,
  '待服务':20,
  '已完成':30,
  '已取消':40
}
// 预约信息
const bookingInfo = ref({
  service_name:'预约服务',
  hospital_name:'就诊医院',
  starttime:'期望就诊时间',
  'client.name':'就诊人',
  'client.mobile':'就诊人电话',
  receiveAddress:'接送地址',
  demand:'其他需求'
})

// 订单信息
const orderInfo = ref({
  tel:'联系电话',
  order_start_time:'下单时间',
  price:'应付金额',
  out_trade_no:'订单编号',
})

const detailData = reactive({})
// 计算倒计时
const second = computed(() => {
  return detailData.order_start_time ? detailData.order_start_time + 7200000 - Date.now():0
})
// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取详情数据
const getDetail =async() => {
  const res = await detail({oid:route.query.oid})
  Object.assign(detailData,res.data.data) 
  
 console.log(detailData);
}
getDetail()
// 弹窗显示隐藏
const showPay = ref(false)

// 支付
const pay = () => {
  Qrcode.toDataURL(detailData.code_url).then(url=>{
    payImg.value = url
  })
  showPay.value = true
}
// 关闭支付弹窗
const close = () => {
  showPay.value = false
  router.push('/order')
}

const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    if (key === "order_start_time") {
      return formatTimestamp(detailData[key]);
    }
    return detailData[key];
  }
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, detailData);
  return arr;
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
</script>
<template>
  <header>
      <div class="head">
        <van-icon name="arrow-left" size="30" @click="goBack"/>
        <h3>订单详情</h3>
      </div>
  </header>
  <StateBar :item="stateList[detailData.trade_state]"/>
  <!-- 待支付 -->
  <div 
  class="await" 
  v-if="detailData.trade_state==='待支付'"
  >
      <h3>订单等待支付</h3>
      <p>请在<Counter :second="second" />内完成支付，超时订单自动取消</p>
      <van-button @click="pay" class="btn" type="success" >立即支付(0.5元)</van-button>
  </div>
  <!-- 待服务 -->
  <div class="await" v-if="detailData.trade_state==='待服务'">
    <h3>正在为您安排服务专员.....</h3>
      <p>请保持手机畅通，稍后由服务员于您联系</p>
  </div>

   <!-- 待服务 -->
   <div class="await" v-if="detailData.trade_state==='已完成'">
    <h3>服务已完成</h3>
      <p>感谢您的使用，如有售后问题请联系客服</p>
  </div>

   <!-- 已取消 -->
   <div class="await" v-if="detailData.trade_state==='已取消'">
    <h3>订单已取消</h3>
      <p>期待下次为您服务，如需帮助可咨询客服</p>
  </div>
  <!-- 预约信息 -->
  <van-cell-group class="group">

    <van-cell title="预约信息" class="group-title" >
      <template #title>
      <h3>预约信息</h3>
    </template>
    </van-cell>
    <van-cell v-for="(item,key) in bookingInfo"  :title="item" :value="formatData(key)" />
  </van-cell-group>

  <!-- 订单信息 -->
  <van-cell-group class="group">
    <van-cell title="订单信息" class="group-title" >
      <template #title>
      <h3>订单信息</h3>
    </template>
    </van-cell>
    <van-cell v-for="(item,key) in orderInfo"  :title="item" :value="formatData(key)" />
</van-cell-group>

  <!-- 支付弹窗 -->
  <van-dialog 
  :showConfirmButton="false" 
  class="payDialog" 
  v-model:show="showPay" >
      <div class="pay-head">
        <van-icon name="cross" class="close" @click="close"/>
        <p class="title">微信支付</p>
      </div>   
    <van-image class="payimg" width="150" :src="payImg" />
    <div style="text-align: center; margin-bottom: 10px">请用本人微信扫描二维码支付</div>
  </van-dialog>
</template>

<style scoped >
.head{
  padding: 10px;
  display: flex;
  h3{
    width: calc(100% - 40px);
    text-align: center
  }
}
.await{
  padding: 20px 15px;
  color: #676a69;
  p{
    line-height: 30px;
  }
  .btn{
    margin: 10px 15%;
    width: 70%;
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
.group{
  padding: 10px 8px;
  margin-bottom: 10px;
  .group-title{
    line-height: 25px;
    border-left: 4px solid #c32721;
    font-size: 18px;
    font-weight: 900;
  }
 
}
</style>