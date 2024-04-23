// export const gisDomain = "http://10.10.1.153:8001/gis"
import gis from '@/common/config'
export const gisDomain=gis.gisDomain
export const mapUrlHeader = process.env.NODE_ENV === 'development' ? 'http://zhps.hzyhwater.com:8001/sai' : 'http://zhps.hzyhwater.com:8001/sai'
// export const gisDomain = "http://gisct.hdec.com:8001";
