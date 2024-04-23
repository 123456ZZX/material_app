/*
 * @Description:
 * @Author: ye_xf
 * @Date: 2022-05-25 09:33:39
 * @LastEditTime: 2022-05-25 09:34:44
 * @LastEditors: ye_xf
 * @Reference:
 */

import request from '@/utils/request'

export function getFileList(data) {
    return request({
        url: "/sys-storage/file",
        method: "post",
        data
    })
}