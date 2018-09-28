// pages/listgruop/listgruop.js
var apimg = getApp().globalData.apimg;
//获取应用实例
var api = getApp().globalData.api;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "headsimg": [apimg + "/images/quzhifu/biankuang.png"],
    "mentimg": [apimg + "/images/quzhifu/ren.png"],
    "payimg": [apimg + "/images/quzhifu/dizhi.png"],
    "yes": [apimg + "/images/quzhifu/shang.png"],
    "indimg": [apimg + "/images/quzhifu/8.png"],
    "box2img": ["../images/quzhifu/tu1.png"],
    "charimg": ["vivo X20双摄头智能大屏手机前置2000万像素"],
    "numbimg": ["20只/盒"],
    "modemoney": ["0.00"],
    orderid: "",
    "bao": [apimg + "/images/quzhifu/bao.png"],
    currentTab: 0,
    total_fee: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    try {
      var indexdata = wx.getStorageSync('indexdata')
      if (indexdata) {
        that.setData({
          indexdata: indexdata
        })
      }
    } catch (e) {
    }
    var orderId = options.orderId
    var parms={}
    var that = this
    parms.orderId=options.orderId
    parms = JSON.stringify(parms)

    wx.request({
      url: api + '/api/order/orderIntRo',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'parms': parms
      },
      success: function (res) {
        that.setData({
          data: res.data
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})