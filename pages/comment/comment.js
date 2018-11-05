// pages/comment/comment.js
const request = require('../../utils/request.js')
Page({
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data={}
    let that=this
    data.memberId = wx.getStorageSync('memberId')
    request.moregets('/api/bbs/getSelfCompose',data).then(function(res){
      that.setData({
        result:res.result
      })
    })  
  },
  jumpdetail:function(e){
    wx.navigateTo({
      url: '../seedetail/seedetail?postid=' + e.currentTarget.dataset.composeid,
    })
  },
  onShareAppMessage: function () {

  }
})