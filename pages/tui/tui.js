// pages/tui/tui.js
var app = getApp()
var api = getApp().globalData.api;

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    
   
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this//不要漏了这句，很重要
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var parms = {}
    var order = {}
    order.memberId = memberId
      order.statuss = [9, 11, 12]
      parms.order = order
    wx.request({
      url: api + '/api/order/orderList',
      data: {
        parms: parms
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var orderList = res.data.orderList
        // for (var i = 0; i < orderList.length; i++) {
        //   orderList[i]["createTime"] = util.formatTime(new Date(orderList[i]["createTime"]))
        // }
        that.setData({
          orderList: res.data.orderList,
          orderList: orderList,
          //res代表success函数的事件对，data是固定的
        })
      },
    })
  },


  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },






  all: function (e) {
    var that = this//不要漏了这句，很重要
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var parms = {}
    var order = {}
    order.memberId = memberId
    order.statuss = [9, 11, 12]
    parms.order = order
    wx.request({
      url: api + '/api/order/orderList',
      data: {
        parms: parms
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var orderList = res.data.orderList
        // for (var i = 0; i < orderList.length; i++) {
        //   orderList[i]["createTime"] = util.formatTime(new Date(orderList[i]["createTime"]))
        // }
        that.setData({
          orderList: res.data.orderList,
          orderList: orderList,
          //res代表success函数的事件对，data是固定的
        })
      },
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },





  clickTab2: function (e) {
    var that = this//不要漏了这句，很重要
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var parms = {}
    var order = {}
    order.memberId = memberId
    order.statuss = [10, 13, 14]
    parms.order = order
    wx.request({
      url: api + '/api/order/orderList',
      data: {
        parms: parms
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var orderList = res.data.orderList
        // for (var i = 0; i < orderList.length; i++) {
        //   orderList[i]["createTime"] = util.formatTime(new Date(orderList[i]["createTime"]))
        // }
        that.setData({
          orderList: res.data.orderList,
          orderList: orderList,
          //res代表success函数的事件对，data是固定的
        })
      },
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})