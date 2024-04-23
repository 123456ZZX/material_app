let url_config = ""
let gisDomain=""
let url_h5 = ""
let white_name = ""
let white_id=""
// gisDomain = "http://gisct.hdec.com"
gisDomain = "http://zhps.hzyhwater.com:8001/gis"
url_h5 = 'http://yhswsim.hdec.com/h5/#/pages/login/login' //加载线上h5页面
white_name = "form_8A5359DE05FF7D6D"
white_id = "field116"
if(process.env.NODE_ENV === 'development'){
    // 开发环境
    url_config = 'http://localhost:8081/api/'
} else {
    url_config = 'http://yhswsim.hdec.com/api/'
}
console.log(url_config)


let VUE_APP_MAP_URL = process.env.VUE_APP_MAP_URL

let VUE_APP_MAP_REQUEST_URL = process.env.VUE_APP_MAP_REQUEST_URL

let VUE_APP_WPG_URL = process.env.VUE_APP_WPG_URL

export default {url_config,gisDomain,url_h5,white_name,white_id, VUE_APP_MAP_URL,VUE_APP_MAP_REQUEST_URL, VUE_APP_WPG_URL}