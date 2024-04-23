/*
 * @Author: gao_pf
 * @Date: 2021-09-08 10:41:31
 * @LastEditTime: 2021-11-09 11:23:42
 * @LastEditors: gao_pf
 * @Description:
 */
import { circle } from '@turf/turf';
import { isExternal } from './validate';

/**
 *
 * @param {Array} iconList
 * name
 * url
 * @returns [Promise]
 */
export function addIconToMap(map, iconList) {
  return Promise.all(
    iconList.map(icon => {
      return new Promise((resolve, reject) => {
        const name = icon.name;
        if (map.hasImage(name)) {
          resolve(true);
          return;
        }
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        // 判断图片是否 外链地址 或者 base64图片
        if (isExternal(icon.url) || icon.url.startsWith('data:image')) {
          image.src = icon.url;
        } else {
          image.src = require('@/' + icon.url + '.png');
        }
        image.onload = () => {
          try {
            map.addImage(name, image);
            resolve(true);
          } catch (err) {
            console.log(err);
            reject(err);
          }
        };
      });
    }),
  );
}
/**
 * 给定一个点，画一个圆
 */
export function createCircleGeoJson(center, radius, units = 'kilometers') {
  return {
    type: 'FeatureCollection',
    features: [circle(center, radius, { units })],
  };
}
