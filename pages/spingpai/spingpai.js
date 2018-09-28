var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
//index.js
Page({
  data: {
    brand: [
      {
        pic: apimg+"/images/pingpai/zu7.png",
      }, {
        pic: apimg+"/images/pingpai/zu8.png",
      }, {
        pic: apimg+"/images/pingpai/zu2.png",
      }, {
        pic: apimg+"/images/pingpai/zu6.png",
      }, {
        pic: apimg+"/images/pingpai/zu3.png"
      }
    ],
    brand1: [
      {
        pic: apimg+"/images/pingpai/zu4.png",
      }, {
        pic: apimg+"/images/pingpai/zu1.png",
      }, {
        pic: apimg+"/images/pingpai/zu9.png",
      }, {
        pic: apimg+"/images/pingpai/zu5.png",
      }, {
        pic: apimg+"/images/pingpai/zu10.png"
      }
    ],
    hide:"true"
    
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: api + "/api/brand/getSearchList",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code != 1) {
          that.setData({
            random: res.data.random,
            brandList: res.data.brandList,
            code: res.data.code
          });
        }
        
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  serarchkey: function (e) {
    this.setData({
      serarchkey: e.detail.value
    })
  },
  taps: function () {
    var that = this;
    wx.request({
      url: api + "/api/brand/randomList",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          random: res.data.random,
          code:res.data.code
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  sou:function(e){
    var that = this;
    var parms = {}
    var hide = that.data.hide
    parms.name = that.data.serarchkey
    wx.request({
      url: api + '/api/brand/SearchList',
      data: {
        parms: parms
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == "1") {
          hide = false
          that.setData({
            code: res.data.code,
            hide: hide,

          });
        } else{
          hide = true
          that.setData({
            random: res.data.random,
            code: res.data.code,
            hide: hide,

          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  onShareAppMessage: function () {

    return {

      title: '微鑫云小程序',

      desc: '最具吸引力的人气小程序',

      path: '/page/user?id=123'

    }

  },
//手机分类跳转js
  phonefenlei: function (e) {
    var that = this
    var brandId = e.currentTarget.id
    wx.navigateTo({
      url: '../phonefenlei/phonefenlei?brandId=' +brandId,
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
