var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const request = require('../../utils/request.js')
Page({
  data: {
    head: apimg + "/image/wode/zu17.png",
    address: "请选择地址",
    mobile: "绑定手机号码",
    disabled: false,
    memberLvList: [],
    isSubmit: true,
    isPass: true,
    tip: '',
    member: apimg +"/image/member.jpg",
    intro: apimg +"/image/intro.jpg"
  },
  onLoad: function (options) {
    var that = this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
      memberId: memberId,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ImageWidth: res.screenWidth + 'px',
          ImageHeight: res.screenWidth / 2.757 + 'px',
          introImageHeight: res.screenWidth / 4.167 + 'px',
          introHeight: res.screenHeight - res.screenWidth / 2.757 - res.screenWidth / 4.167 + 'px'
        })
      }
    })
    request.moregets('/api/distribe/memberLvList').then(function (res) {
      if (res.code == 0) {
        that.setData({
          memberLvList: res.memberLvList
        })
      }
    })
  },
  jupminfodetail: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../membershipdetail/membershipdetail?money=' + e.currentTarget.dataset.money + '&ivid=' + e.currentTarget.dataset.ivid,
    })
  }
})