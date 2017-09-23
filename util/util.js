function getMovieData(url, callBack) {
    wx.request({
        url: url,
        data: {},
        method: 'GET',
        header: {
            "Content-Type": "json"
        },
        success: function (res) {
            callBack(res.data);
        },
        fail: function () {
            console.log("请求失败")
        }
    })
}
function convertToCastString(casts){
   var castsjoin = "";
    for(var idx in casts){
      castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0,castsjoin.length-2);
}
function convertToCastInfos(casts){
  var castsArray = []
   for (var idx in casts){
     var cast = {
       img: casts[idx].avatars?casts[idx].avatars.large:"",
       name: casts[idx].name
     }
     castsArray.push(cast);
   }
   return castsArray;
}
module.exports = {
    getMovieData: getMovieData,
    convertToCastString:convertToCastString,
    convertToCastInfos:convertToCastInfos
}