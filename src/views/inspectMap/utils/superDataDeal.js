import * as actions from './action.js';
import axios from 'axios';
import {gisDomain} from '../settings.js'
class superDataDeal {
    constructor(){}
    async getStyleData(url){
        const res = await actions.getAction(url);
        return res.data;
    }
    async getDataWithSpatial({datasetNames,geometry}){
        let res = await axios({
            url:
              gisDomain +
              "/iserver/services/data-YuHangShuiWuWangLuoFenXi_20210602/rest/data/featureResults.rjson?returnContent=true",
            method: "post",
            data: JSON.stringify({
              getFeatureMode: "SPATIAL",
              maxFeatures:999999,
              datasetNames,
              geometry,
              spatialQueryMode: "INTERSECT",
              maxFeatures:9999
            }),
          });
        return res
    }
    async getDataWithSpatialAtt({datasetNames,geometry,sql}){
      let res = await axios({
          url:
            gisDomain +
            "/iserver/services/data-YuHangShuiWuWangLuoFenXi_20210602/rest/data/featureResults.rjson?returnContent=true",
          method: "post",
          data: JSON.stringify({
            getFeatureMode: "SPATIAL_ATTRIBUTEFILTER",
            attributeFilter:sql,
            datasetNames,
            geometry,
            spatialQueryMode: "INTERSECT",
          }),
        });
      return res
    }
    async getDataWithSql(datasetNames, sql){
      let {data} = await axios({
              method:'post',
              url:
            gisDomain +
            "/iserver/services/data-YuHangShuiWuWangLuoFenXi_20210602/rest/data/featureResults.rjson?returnContent=true",
              data:JSON.stringify({
                getFeatureMode:"SQL",
                datasetNames,
                maxFeatures:1000,
                queryParameter:{
                  attributeFilter: sql
                }
              })
            });
      return data
    }
    // 多加一个管径级别筛选
    async getDataWithSpatialAndPipeLevel({datasetNames, geom, pipeLevel, isSupply}, pagination = {page: 1, size: 1000}) {
      let geometry = JSON.parse(JSON.stringify(geom));
      let coordinates = geometry.coordinates[0].map((item) => {
        return {
          x: item[0],
          y: item[1],
        };
      });
      // this.$set(geometry, "points", coordinates);
      geometry.points = coordinates;
      geometry.type = "REGION";
      const fromIndex = (pagination.page - 1) * pagination.size;
      const toIndex = fromIndex + pagination.size - 1;
      // 判断是空间查询还是空间属性查询
      const isJustSpatial = !pipeLevel ? true : false;
      let sql = "";
      let sql_supply = "";
      // 管径级别区间左开右闭
      if (!isJustSpatial) {
        sql = `CALIBER<${pipeLevel.pipeMax ? pipeLevel.pipeMax: 9999} and CALIBER>${pipeLevel.pipeMin ? pipeLevel.pipeMin : 0}`;
        sql_supply = `KJ<${pipeLevel.pipeMax ? pipeLevel.pipeMax: 9999} and KJ>${pipeLevel.pipeMin ? pipeLevel.pipeMin : 0}`  
      }
      const data = isJustSpatial ? 
          JSON.stringify({
            getFeatureMode: "SPATIAL",
            datasetNames,
            geometry,
            spatialQueryMode: "INTERSECT"
          }) : JSON.stringify({
            attributeFilter: isSupply ? sql_supply : sql,
            getFeatureMode: "SPATIAL_ATTRIBUTEFILTER",
            datasetNames,
            geometry,
            spatialQueryMode: "INTERSECT"
          });
      let res = await axios({
        url:
          gisDomain +
          `/iserver/services/data-YuHangShuiWuWangLuoFenXi_20210602/rest/data/featureResults.rjson?returnContent=true&fromIndex=${fromIndex}&toIndex=${toIndex}`,
        method: "post",
        data: data,
      });
      // 如果要素总数量大于1000，进行批量查询
      try {
        const pages = Math.ceil(res.data.totalCount / 1000);
        if (pagination.page === 1 && pages > 1) {
          let reqList = [];
          for (let i = 2; i <= pages; i++) {
            const fromIndexParam = (i - 1) * pagination.size;
            const toIndexParam = fromIndexParam + pagination.size - 1;
            const params = isJustSpatial ? 
              JSON.stringify({
                getFeatureMode: "SPATIAL",
                datasetNames,
                geometry,
                spatialQueryMode: "INTERSECT"
              }) : JSON.stringify({
                attributeFilter: isSupply ? sql_supply : sql,
                getFeatureMode: "SPATIAL_ATTRIBUTEFILTER",
                datasetNames,
                geometry,
                spatialQueryMode: "INTERSECT"
              });
            const req = axios({
              url:
                gisDomain +
                `/iserver/services/data-YuHangShuiWuWangLuoFenXi_20210602/rest/data/featureResults.rjson?returnContent=true&fromIndex=${fromIndexParam}&toIndex=${toIndexParam}`,
              method: "post",
              data: params,

            })
            reqList.push(req);
          }
          await axios.all(reqList).then(axios.spread(function(...resList) {
            for (let i = 0; i < resList.length; i++) {
              res.data.features = res.data.features.concat(resList[i].data.features);
            }
          }))
        }
      } catch (e) {
        console.log(e);
      }
    return res
    }
}
export default superDataDeal