var app = getApp();

// import util from '/util/util.js';
var util = require('../../../util/util.js')
Page({
    data: {
        movies: {},
        totalCount: 0,
        isEmpty: true
    },
    onLoad(query) {
        var category = query.category;
        console.log(category);
        var dataUrl = "";
        this.data.category = category;
        switch (category) {
            case "正在热映":
                this.data.url = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                this.data.url = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣TOP250":
                this.data.url = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        util.getMovieData(this.data.url, this.setMovieData)
    },
    onReachBottom(event) {
        var nextUrl = this.data.url + "?start=" + this.data.totalCount + "&count=20";
        util.getMovieData(nextUrl, this.setMovieData);
        wx.showNavigationBarLoading();
    },
    setMovieData(resData) {
        var movies = [];
        for (var i in resData.subjects) {
            var subject = resData.subjects[i];
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
        var totalMovies = [];
        //加载新数据，把新数据与旧数据合并
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies: totalMovies
        })
        this.data.totalCount += 20;
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
    },
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        var refreshUrl = this.data.url + "?start=0&count=20";
        this.data.isEmpty = true;
        util.getMovieData(refreshUrl, this.setMovieData)
    },
    onReady() {
        wx.setNavigationBarTitle({
            title: this.data.category
        })
    },
    ShowMovieDetail(event) {
        var movieId = event.currentTarget.dataset.movieid
        wx.navigateTo({
            url: "../movie-detail/movie-detail?movieId=" + movieId
        })
    }
})