var apimg = getApp().globalData.apimg;
var app = getApp()
var Info = {}
Page({
  data: {
    indimg:"/image/8.png",
    box2:"/image/图层9.png",
    
    userInfo: {}
  },

  // 商品详情页面跳转
  swiperbind: function (e) {
    wx.navigateTo({
      url: '../group/group',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },


})