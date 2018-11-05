// pages/dynamic/dynamic.js
const request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tuijian_list:[],
    hasMore: true,
    offset:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          tuijian_list: [],
          ImageWidth: (res.screenWidth * 0.95 - 56) / 3 + 'px',
        })
      }
    })
    that.getcomposeList(0, 3)
  },

  getcomposeList: function (offset, limit) {
    let params = {};
    let data = {};
    let that = this;
    params.offset = offset;
    params.limit = limit;
    params.memberId = wx.getStorageSync('memberId')
    data.params = JSON.stringify(params)
    request.moregets('/api/bbs/myDynamic', data).then(function (res) {
      console.log(res)
      var timestamp = (new Date()).valueOf();
      for (var i in res.rows) {
        let leaveTime = timestamp - res.rows[i].posttime
        res.rows.focus = false
        if (leaveTime > 1000 * 3600 * 24) {
          res.rows[i].posttime = Math.floor(leaveTime / (1000 * 3600 * 24)) + "天前"
        }
        else if (leaveTime > (1000 * 3600) && leaveTime < (1000 * 3600 * 24)) {
          res.rows[i].posttime = Math.floor(leaveTime / (1000 * 3600)) + '小时前'
        }
        else if (leaveTime > (1000 * 60) && leaveTime < (1000 * 3600)) {
          res.rows[i].posttime = Math.floor(leaveTime / (1000 * 60)) + '分钟前'
        }
        else {
          res.rows[i].posttime = "刚刚"
        }
      }
      let composeList = []
      composeList = that.data.tuijian_list.concat(res.rows)
      if (res.rows.length < limit) {
        that.setData({
          hasMore: false
        })
      }
      else {
        that.setData({
          hasMore: true
        })
      }
      that.setData({
        tuijian_list: composeList
      })
      wx.hideLoading();
    })
  },
  pulldown:function () {
    var that = this;
    // 显示加载图标
    console.log(that.data.hasMore)
    if (that.data.hasMore) {
      wx.showLoading({
        title: '玩命加载中',
      })
      that.setData({
        offset: that.data.offset + 1
      })
      that.getcomposeList(that.data.offset, 3)
    } else {

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