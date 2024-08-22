import { defineStore } from "pinia";
import {ref} from 'vue'
export const useUserStore = defineStore('H5user',() => {
  const token = ref('')
  const user = ref({
    name:'',
    avatar:''
  })

  const setToken = (value) => {
    token.value = value
  }
  const setUser = (obj) => {
    user.value = obj
  }

  return {token,user,setToken,setUser}
},{persist:true})