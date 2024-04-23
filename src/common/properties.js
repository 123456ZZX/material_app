/**
 * 设施详情字段
 */
import { getInfoByName } from './mapUtil.js'
export const showProperties2 = new Proxy({},{
    get:function(target,propKey,receiver) {
        return getInfoByName(propKey);
    },
    set:function() {
        console.warn('程序员的开发原则之一，不能修改通用导出对象!');
    }
})
export const url = {
    // yhDeviceValve
    '排水管线':'/yhsw-map/yhDeviceDrainpipe/details',
    '污水管':'/yhsw-map/yhDeviceDrainpipe/details',
    '供水管':'/yhsw-map/yhDeviceSupplypipe/details',
    '雨水口':'/yhsw-map/yhDeviceComb/details',
    '排水检查井':'/yhsw-map/yhDeviceManhole/details',
    '排放口':'/yhsw-map/yhDeviceOutfall/details',
    '阀门（井）':'/yhsw-map/yhDeviceValve/details',
    '消火栓':'/yhsw-map/yhDeviceFirehydrant/details',
    '排水泵站':'/yhsw-map/yhDeviceDrainpump/details',
    '供水泵站':'/yhsw-map/yhDeviceSupplypump/details',
    '污水厂':'/yhsw-map/yhSewagePlant/details',
    '自来水厂':'/yhsw-map/yhWaterWork/details',
    '用户':'/yhsw-map/yhUserInfo/details',
    '供水调节建筑物':'/yhsw-map/yhSupplyReg/details',
    '雨水调蓄池':'/yhsw-map/yhStormRt/details',
}