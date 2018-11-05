// pages/quan/quan.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const util = require('../../utils/util.js')
const request = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pingtuandetail:{},
    paly: apimg + "/image/gotuan/wen.png",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var pingtuandetail = JSON.parse(options.shops)
    let params = {}
    let param={}
    param.goodsId = pingtuandetail.goodsId
    param.memberCollageId = pingtuandetail.memberCollageId
    params.params=param
    request.moregets('/api/collage/collageSucceed', params).then(function (res) {
      that.setData({
        windowHeight: wx.getStorageSync('windowHeight'),
        collageSucceed: res.collageSucceed,
        pingtuandetail: pingtuandetail,
        memberId: wx.getStorageSync('memberId')
      });
    })
  },

  //拼团跳转  
  gotuan: function () {
    wx.switchTab({
      url: '../active/active',
    })
  },
  onShareAppMessage: function () {
    var that = this
    var fenxiangpingtuan={}
    fenxiangpingtuan = that.data.pingtuandetail
    fenxiangpingtuan.memberId = that.data.memberId
    fenxiangpingtuan=JSON.stringify(fenxiangpingtuan)
    return {
      path: '/pages/join/join?fenxiangpingtuan=' + fenxiangpingtuan,
    }
  },  
})