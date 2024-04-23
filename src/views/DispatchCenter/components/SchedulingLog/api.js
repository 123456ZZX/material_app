import request from '@/utils/request'

// 调度日志
export function getTableData(params) {
    return request({
        url: "/xasw-dispatch/dispatchingLog/page",
        method: "get",
        params,
    })
}

//报警记录
export function getTableAlarm(params) {
    return request({
        url: '/xasw-warn-config/warnRecord/pipe/page',
        method: 'post',
        data: params
    })
}
//调度指令分页
export function getTableCommand(params) {
    return request({
        url: '/xasw-dispatch/dispatchingCommand/page2',
        method: 'get',
        params: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    });
}
//调度明细-水厂
export function getTableWater(params) {
    return request({
        url: "/xasw-pump/pump/digitalHydration/supply",
        method: "get",
        params,
    })
}
//调度明细-泵站
export function getTablePump(params) {
    return request({
      url: "/xasw-pump/pump/digitalHydration/pump",
      method: "get",
      params,
    })
  }
  //调度明细-管网
  export function getTablePipe(params) {
    return request({
      url: "/xasw-pipe-operation/pipeNetwork",
      method: "post",
      params,
    })
  }