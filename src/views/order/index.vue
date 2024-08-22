<script setup lang='js' name='Order'>
import {ref,onMounted,provide} from 'vue'
import {getOrder} from '@/api/index'
import Counter from '@/components/Counter.vue'
import { useRouter,useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
const active = ref(route.query.active?route.query.active:'')


const orderList = ref([])

  const colorLiat = {
    '待支付':'#ffa200',
    '待服务':'#1ad6fd',
    '已完成':'#21c521'
  }
  onMounted(() => {
    getorderList(active.value)
  })

 const change = (value) => {
  active.value = value
 }
 provide('active',change)
  //获取订单列表.value
  const getorderList = async(state) => {
    const res =await getOrder({state})
    orderList.value = res.data.data
    orderList.value.forEach((item) => {
      item.timer = item.order_start_time + 7200000 -Date.now()
    })    
  }
  //点击tab重新获取数据
  const onClickTab = async (item) => {
    getorderList(item.name)
  }
  // 查看订单详情
  const goDetail = (id) => {
    router.push(`/detail?oid=${id}`)
  }
</script>
<template>
    <header class="header"> 
      <p>我的订单</p>
    </header>
    <van-tabs v-model:active="active" @click-tab="onClickTab">
    <van-tab title="全部" name=""/>
    <van-tab title="待支付" name="1"/>
    <van-tab title="待服务" name="2"/>
    <van-tab title="已完成" name="3"/>
    <van-tab title="已取消" name="4"/>
    </van-tabs>
    <main>
        <van-row 
        @click="goDetail(item.out_trade_no)" 
        v-for="item in orderList" 
        :key="item.out_trade_no" 
        class="row">
          <van-col span="5">
              <van-image  width="50" height="50" radius="5" :src="item.serviceImg"/>
          </van-col>
          <van-col span="14">
            <h3>{{ item.service_name }}</h3>
            <p class="text1">{{ item.hospital_name}}</p>
            <p class="text2">{{ item.starttime }}</p>
          </van-col>
          <van-col span="5" :style="{color:colorLiat[item.trade_state]}">
            <div style="margin-bottom: 10px;">{{ item.trade_state }}</div>
            <Counter :second="item.timer" v-if="item.trade_state==='待支付'"/>
          </van-col>
        </van-row>
    </main>
    <footer>
        <p>没有更多内容了</p>
    </footer>
</template>

<style lang="less" scoped >
.header{
  padding: 10px 0;
  p{
    font-size: 18px;
    text-align: center;
  }
}
main{
  .row{
  padding: 10px ;
  margin: 10px;
  height: 80px;
  background-color: #fff;
  .van-image{
   padding-top: 10px;
  }
  .text1,.text2{
    color: #b5b8be;
  }
  .text1{
    font-size: 16px;
    line-height: 30px;
  }
}
}
footer{
  padding-bottom: 80px;
  p{
    margin-top: 20px;
    text-align: center;
    color: #b5b8be;
    font-size: 18px
  }
}

  
</style>