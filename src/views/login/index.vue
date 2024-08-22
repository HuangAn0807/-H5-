<script setup lang='ts' name='Login'>
import {ref} from 'vue'
import { userLogin } from '@/api/index';
import { useUserStore } from '@/stores';
import {useRouter} from 'vue-router'
import { showToast } from 'vant/lib/toast';
const userStore = useUserStore()
const router = useRouter()
const form =ref({
  userName:'',
  passWord:''
}) 
const onSubmit =async () => {
  const res = await userLogin(form.value)
  if(res.data.code===10000){
    // 持久化存储token和用户信息
    userStore.setToken(res.data.data.token)
    userStore.setUser(res.data.data.userInfo)
    router.push('/home')
  }
  
}
</script>
<template>
  <div class="login">
    <h2>登录</h2>
    <van-form @click="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.userName"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{required:true,message:'请输入用户名'}]"
        />
        <van-field
          v-model="form.passWord"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{required:true,message:'请输入密码'}]"
        />
      </van-cell-group>
      <div class="submit">
        <van-button  round block type="primary" native-type="submit">登录</van-button>
      </div>
    </van-form>
</div>
</template>

<style scoped >
.login{
  width: 100%;
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  h2{
    text-align: center;
    margin-bottom: 20px;
  }
  .van-field{
    margin-bottom: 10px;
    height: 50px
  }
  .submit{
    margin-top: 20px;
    padding: 0 10%;
  }
}
</style>