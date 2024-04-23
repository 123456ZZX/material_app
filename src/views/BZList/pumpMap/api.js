import request from '@/utils/request'
export function pumpInfoPage(params) {
    return request({
        url: `/xasw-pump/pump/pump-info/page`,
        method: "get",
        params,
    });
}
