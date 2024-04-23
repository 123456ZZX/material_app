/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2021-04-23 16:34:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-30 11:27:01
 * @Description: 菜单合集
 */

import Audit from './audit'
import Cms from './cms'
import Org from './org'
import Stc from './stc'
import Sti from './sti'
import Stm from './stm'
import Std from './std'
import Ac from './ac'
import Fc from './fc'
import Pm from './pm'

const Com = {
  HOME: '首页',
  THIRDPARTY: '第三方认证',
  PRIVACY_CENTER: '隐私中心',
  PERSONAL_CENTER: '个人中心',
  MESSAGE_CENTER: '消息中心'
}

export default {
  ...Audit,
  ...Cms,
  ...Org,
  ...Stc,
  ...Sti,
  ...Stm,
  ...Std,
  ...Ac,
  ...Fc,
  ...Pm,
  ...Com
}