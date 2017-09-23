var app = getApp();
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult:{},
        containerShow: true,
        seachPannelShow: false
    },
    onLoad() {
        var base = "?start=0&count=3";
        var inTheatersUrl = "/v2/movie/in_theaters" + base;
        var comingSoonUrl = "/v2/movie/coming_soon" + base;
        var top250Url = "/v2/movie/top250" + base;
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣TOP250");
    },
    getMovieListData(url, setkey, categoryTitle) {
        var __this__ = this;
        wx.request({
            url: app.globalData.doubanBase + url,
            data: {},
            method: 'GET',
            header: {
                "Content-Type": "json"
            },
            success: function (res) {
                console.log(res);
                __this__.processDoubanData(res.data, setkey, categoryTitle);
            },
            fail: function () {
                console.log("请求失败")
            }
        })
    },
    processDoubanData(data, setkey, categoryTitle) {
        var movies = [];
        for (var i in data.subjects) {
            var subject = data.subjects[i];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            };
            movies.push(temp);
        }
        var readyData = {};
        readyData[setkey] = {
            categoryTitle: categoryTitle,
            movies: movies
        };
        this.setData(readyData)
    },
    showMore(event) {
        var category = event.currentTarget.dataset.category
        wx.navigateTo({
            url: "more-movies/more-movies?category=" + category
        })
    },
    onBindFocus(event) {
        this.setData({
            containerShow: false,
            seachPannelShow: true
        })
    },
    onBindChange(event) {
        var text=event.detail.value;
        var searchUrl="/v2/movie/search?q="+text;
        // console.log(searchUrl);
        this.getMovieListData(searchUrl,"searchResult","");

    },
    cancelSearch(event){
        this.setData({
            containerShow: true,
            seachPannelShow: false,
            searchResult:{}
        })
        event.detail={value:1};
    },
    ShowMovieDetail(event){
         var movieId = event.currentTarget.dataset.movieid
        wx.navigateTo({
            url: "movie-detail/movie-detail?movieId=" + movieId
        })
    }
})