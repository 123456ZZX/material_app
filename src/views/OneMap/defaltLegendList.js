import { legendListImport } from './legendList.js'
let legendListOneArray = []
legendListImport.forEach((item) => {
  legendListOneArray.push(...item.options)
})
console.log('所有图例汇集在一个数组中', JSON.parse(JSON.stringify(legendListOneArray)))
export const defaltLegendList = legendListOneArray
