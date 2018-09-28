var api = getApp().globalData.api;

Page({


  data: {
    face:'',
    address:''
  },

  onLoad: function (options) {
    this.setData({
      face: wx.getStorageSync('face')
    })
  },
  //定位获取所在地
  bindaddress:function(){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          address:res.address
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
 
})