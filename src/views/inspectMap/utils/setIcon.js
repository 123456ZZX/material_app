async function addImgToMap(map){
    return Promise.allSettled(
     require.context('@/assets/img/legend/',false,/\.png/)
        .keys().map(key=> key.replace('./','').replace('.png',''))
        .map(img =>{
            new Promise ((resolve,reject)=>{
            const i = require("@/assets/img/legend/"+img + '.png')
            const image = new Image();
            image.crossOrigin = 'Anonymous'
            image.src = i
            image.onload = () =>{
                try {
                    if(!map.hasImage(img)){
                      map.addImage(img,image);
                    }
                    resolve();
                }catch(err){
                    console.log(err)
                    reject();
                }
            }
        })
    })
  )
}
export default addImgToMap

