var app = getApp();
var util = require('../../../util/util.js');
Page({
    data: {},
    onLoad(options) {
        var movieId = options.movieId; //获取id
        var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId; //拼接url
        util.getMovieData(url, this.processData) //获取电影详情数据，并用processData函数进行处理
    },
    processData(data) {
        var director = {
            avatar: "",
            name: "",
            id: ""
        }
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large

            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary.substring(0, 100) + "..."
        }
        this.setData({
            movie: movie
        })
        // console.log(data);
    },
    viewMoviePostImg(event){
        var src=event.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src],
        })
    }
})