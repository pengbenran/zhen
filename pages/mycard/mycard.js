var apimg = getApp().globalData.apimg;
Page({
  data: {
    "cardbg": [apimg + "/image/card/cardbg.png"],
    "ren": [apimg + "/image/card/ren.png"],
    "zan": [apimg + "/image/card/zan.png"],
    "chang": [apimg + "/image/card/chang.png"],
    boxbool:true,
    face:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.face = wx.getStorageSync('face')
    this.setData({
      face: wx.getStorageSync('face')
    })
  },
  //跳转至名片信息提交
  tocardfrom:function(){
    wx.navigateTo({
      url: '../cardfrom/cardfrom',
    })
  }

})