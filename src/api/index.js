import request from '@/utils/request'

// 用户登录
export const userLogin = (data) =>request.post('login',data)

// 首页数据
export const index = () => request.get('/Index/index')

// 订单详情信息
export const detail = (params) => request.get('/order/detail',{params})

// 陪护师列表
export const company = () => request.get('/h5/companion')

// 创建订单
export const createOrder = (data) =>request.post('/createOrder',data)

// 订单列表
export const getOrder = (params) =>request.get('/order/list',{params})