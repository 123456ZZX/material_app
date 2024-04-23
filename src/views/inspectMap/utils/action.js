import axios from "axios";
const CancelToken = axios.CancelToken;

export function getAction(url,params){
    window.cancel && window.cancel();
    return axios({
        method:"get",
        url,
        params,
        cancelToken: new CancelToken(function (cancel) {
          window.cancel = cancel;
        })
    })
}
export function postAction(url,params,data){
    window.cancel && window.cancel();
    return axios({
        method:"post",
        url,
        params,
        data,
        cancelToken: new CancelToken(function (cancel) {
          window.cancel = cancel;
        })
    })
}
export function getPosition(){
  let geolocation = new BMap.Geolocation();
  return new Promise((resolve,reject) => {
    geolocation.getCurrentPosition(function(e) {
      if(this.getStatus() == BMAP_STATUS_SUCCESS){
        resolve([e.point.lng,e.point.lat])
      }else{
        alert(this.getStatus())
      }
    });
  })
}