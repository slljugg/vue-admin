import axios from 'axios'
// 导入npogress 路由进度条
import Nporgress from 'nprogress'
import 'nprogress/nprogress.css'
// export default axios.create({
//   baseURL: 'https://lianghj.top:8888/api/private/v1/'
// })
axios.create()
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 在request拦截器中，显示进度条 Nporgress.start()

// 配置axios的请求拦截器
axios.interceptors.request.use(config => {
  Nporgress.start()
  // 为请求头的Authorization属性token
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中隐藏进度条 Nporgress.done()
axios.interceptors.response.use(config => {
  Nporgress.done()
  return config
})

export default axios