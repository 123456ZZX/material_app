/*
 * @Author: gao_m3
 * @Date: 2022-05-17 21:14:50
 * @LastEditors: ye_xf
 * @LastEditTime: 2022-05-26 15:08:36
 * @Descripttion:
 */
import request from '@/utils/request'

export function trans(data) {
    return request({
        url: '/sys-storage/file/token',
        method: 'post',
        params: { groupToken: data.groupToken },
        data: data.list
    })
}