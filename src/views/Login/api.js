import request from '@/utils/request'

//获取短信验证码
export function getSMSCaptcha(data) {
  return request({
    url: '/sys-auth/oauth/sms_captcha',
    params: data,
    method: 'get'
  })
}