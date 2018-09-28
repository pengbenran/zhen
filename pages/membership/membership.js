// pages/membership/membership.js
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
    var memberId = wx.getStorageSync('memberId')
   that.setData({
     ivId:options.lvId,
     memberId: memberId,
   })
  },
  btnform:function(e){
    var that=this;
    console.log(e.detail.value)
    if (e.detail.value.username==""){
      wx.showToast({
        title: '姓名为空',
        icon:'loading'
      })
    }
    else if (e.detail.value.tel == "" || e.detail.value.tel.length != 11){
      wx.showToast({
        title: '号码格式错误',
        icon: 'loading'
      })
    }else{
      wx.showLoading({
        title: '请稍等',
      })
      var parms = {}
      parms.memberId = that.data.memberId
      parms.name = e.detail.value.username
      parms.mobile = e.detail.value.tel
      parms.lvid = that.data.ivId
      wx.request({
      url: api +'/api/distribe/submitDistribeApply',
      data:{
        params: JSON.stringify(parms)
      },
      method:"POST",
      header: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code==0){
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
            duration:2000,
          })
          setTimeout(function(){
            wx.switchTab({
              url: '../my/my',
            })
          },2000)
        
        }
      }
    })
    }
   
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