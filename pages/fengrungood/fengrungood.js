// pages/fengrungood/fengrungood.js
var apimg = getApp().globalData.apimg;
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
    var that=this
    wx.request({
      url: api + '/api/distribe/goodsList',
      headers: {
        'Content-Type': 'application/json'
      },
      success:function(res){
        console.log(res.data)
        if(res.data.code==0){
          that.setData({
            goodsList: res.data.goodsList
          })
        }
      } 
    })
  },
  jumpdetail:function(e){
    wx.navigateTo({
      url: '../group/group?goodid='+e.currentTarget.dataset.goodsid,
    })
  }
})