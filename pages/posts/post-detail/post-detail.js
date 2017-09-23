var postsData = require("../../../data/data.js")
var app = getApp();
Page({
    data: {
        postId: "",
        isPlay: false
    },
    onLoad(option) {
        var globalData = app.globalData;
        var postId = option.id;
        this.data.postId = postId;
        var postData = postsData.postlist[postId];
        // console.log(postData);
        this.setData({
            postData: postData
        });
        // wx.setStorageSync("key","fbyx")
        var postsCollected = wx.getStorageSync("posts_collected");
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync("posts_collected", postsCollected);
        }
        if (globalData.g_isPlay && globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlay: true
            })
        }
        var __this__ = this;
        wx.onBackgroundAudioPlay(function () {
            __this__.setData({
                isPlay: true
            })
            app.globalData.g_isPlay = true;
            app.globalData.g_currentMusicPostId = __this__.data.postId
        })
        wx.onBackgroundAudioPause(function () {
            __this__.setData({
                isPlay: false
            })
            app.globalData.g_isPlay = false;
            app.globalData.g_currentMusicPostId = null;
        })
        wx.onBackgroundAudioStop(function () {
            __this__.setData({
                isPlay: false
            })
            app.globalData.g_isPlay = false;
            app.globalData.g_currentMusicPostId = null;
        })
    },
    onCollection(event) {
        //    var game=wx.getStorageSync("key");
        var postsCollected = wx.getStorageSync("posts_collected");
        var postCollected = postsCollected[this.data.postId];
        postCollected = !postCollected;
        postsCollected[this.data.postId] = postCollected;
        //更新缓存
        wx.setStorageSync("posts_collected", postsCollected);
        //更新数据
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "已收藏" : "取消收藏"
        })

    },
    onShareTap(event) {
        // wx.removeStorageSync("key");
        //缓存上限10MB
        // wx.clearStorageSync();
        var itemList = [
            "分享到微信",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel
                // res.tapIndex
                // console.log(res.tapIndex);
                wx.showModal({
                    title: "用户分享到了" + itemList[res.tapIndex],
                    content: "暂时无法分享"
                })
            }
        })
    },
    onMusicTap(event) {
        var isPlay = this.data.isPlay;
        if (isPlay) {
            wx.pauseBackgroundAudio()
            this.setData({
                isPlay: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postsData.postlist[this.data.postId].music.url,
                title: postsData.postlist[this.data.postId].music.title,
                coverImgUrl: postsData.postlist[this.data.postId].music.coverImg
            })
            this.setData({
                isPlay: true
            })
        }

    }
})