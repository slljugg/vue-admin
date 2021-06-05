import axios from 'axios'

// export default axios.create({
//   baseURL: 'https://lianghj.top:8888/api/private/v1/'
// })
axios.create()
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'

export default axios