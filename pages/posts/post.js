var postData=require('../../data/data.js')
Page({
    data: {
        
    },
    onLoad: function (option) {
        
        this.setData({post_key:postData.postlist});
    },
    showDetail(event) {
        // wx.navigateTo()
        var postId=event.currentTarget.dataset.postid;
        wx.navigateTo({
            url:"post-detail/post-detail?id="+postId
        })
    }
    // onReady: function () {
    //     console.log(2);
    // },
    // onShow: function () {
    //     console.log(3);
    // },
    // onHide() {
    //     console.log(4);
    // },
    // onUnload() {
    //     console.log(5);
    // }
})