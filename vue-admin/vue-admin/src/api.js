import axios from 'axios'

// export default axios.create({
//   baseURL: 'https://lianghj.top:8888/api/private/v1/'
// })
axios.create()
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 配置axios的请求拦截器
axios.interceptors.request.use(config => {
  // 为请求头的Authorization属性token
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

export default axios