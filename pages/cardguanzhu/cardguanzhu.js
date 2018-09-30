var apimg = getApp().globalData.apimg;
Page({

  data: {
    likebool: true,
    weiimg: apimg + "/image/card/weixin.png",
    face: '',
  },


  onLoad: function (options) {
    this.setData({
      face: wx.getStorageSync('face')
    })
  },


})