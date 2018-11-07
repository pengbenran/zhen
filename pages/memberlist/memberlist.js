// pages/memberlist/memberlist.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
const request = require('../../utils/request.js')
Page({
  data: {
    memberDOList:[],
    hasmember:false
  },
  onLoad: function (options) {
    var that = this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
      memberId: memberId,
    })
    let data={}
    data.memberId=that.data.memberId
    request.moregets('/api/distribe/memberDistribeList',data).then(function(res){
      if (res.code == 0) {
        if (res.subTwoMembers.length == 0 && res.subOneMembers.length==0) {
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
          subOneMembers: res.subOneMembers,
          subTwoMembers: res.subTwoMembers
        })
      }
    })
  },
  jumpconsume:function(e){
    wx.navigateTo({
      url: '../memberconsume/memberconsume?memberId='+e.currentTarget.dataset.memberid+'&lvtype='+e.currentTarget.dataset.type,
    })
  }

  
})