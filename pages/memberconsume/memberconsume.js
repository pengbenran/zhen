// pages/memberconsume/memberconsume.js
var apimg = getApp().globalData.apimg;
//获取应用实例
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: api + '/api/distribe/expense',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        memberId: options.memberId
      },
      success: function (res) {
        that.setData({
          expense: res.data.expense
        })
      }
    })
  },
})