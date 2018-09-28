// pages/putforward/putforward.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
      balance: options.balance,
      cardno: options.cardno.slice(-4),
      depositBank: options.depositBank,
      memberId: memberId,
    })
  },
  allforward:function(){
    var that=this;
    that.setData({
      inputValue: that.data.balance
    })
  },
  bindKeyInput:function(e){
    var that=this;
    that.setData({
      inputValue: e.detail.value
    })
  },
  putforwardbtn:function(){
    var that=this;
    if (that.data.balance*1 <that.data.inputValue*1) {
      wx.showToast({
        title: '账号余额不足',
        icon: "none"
      })
    }
    else{
      var parms = {}
      parms.memberId = that.data.memberId
      parms.amount = that.data.inputValue
      wx.request({
        url: api + '/api/distribe/withdraw',
        data: {
          params: JSON.stringify(parms)
        },
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data.code==0){
            wx.showToast({
              title: '提现申请成功',
            })
            that.setData({
              balance: that.data.balance-that.data.inputValue,
              inputValue:'',
            })
            setTimeout(function(){
              wx.navigateTo({
                url: '../micromember/micromember',
              })
            },1000)
           
          }
          else{
            wx.showToast({
              title: '提现申请失败',
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '../micromember/micromember',
              })
            }, 1000)
          }
        }
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