// pages/memberlist/memberlist.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberDOList:[],
    hasmember:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
      memberId: memberId,
    })
    wx.request({
      url: api + '/api/distribe/memberDistribeList',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        memberId: that.data.memberId
      },
      success: function (res) {
        //  console.log(res.data.statusNo[0].withdrawTime.split(' ')[0]
        if (res.data.code == 0) {
          if (res.data.memberList.length == 0) {
            that.setData({
              hasmember: false
            })
          }
          else {
            that.setData({
              hasmember: true
            })
          }
          that.setData({
            memberDOList: res.data.memberList,
          })
        }
      }
    })
  },
  jumpconsume:function(e){
    wx.navigateTo({
      url: '../memberconsume/memberconsume?memberId='+e.currentTarget.dataset.memberid,
    })
  }

  
})