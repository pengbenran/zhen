var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    "meimg": [apimg +"/images/huiyuan/hui09.png"],
    "text1": ["享受9.5折优惠"],
    "text2": ["这里是文案这里"],
    "text3": ["享受9.5折优惠"],
    "vip": ["会员制度"],
    "context1": ["这里是文案这里是文案这里是文案"],
    "context2": ["这里是文案这里是文案这里是文案"],
    "context3": ["这里是文案这里是文案这里是文案"],
    "context4": ["这里是文案这里是文案这里是文案"],
  },
  onShareAppMessage: function () {

    withShareTicket: true

  },
  // 刷新
  onPullDownRefresh() {

    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    this.onLoad();
  },
 
  onLoad:function(){

 try {
    var memberId = wx.getStorageSync('memberId')
    if (memberId) {
      memberId: memberId
    }
  } catch (e) {
  } 
  var parms = {}
  parms.memberId = memberId
    var that = this
    wx.request({
      url: api+'/api/member/getMemberLvInfo',//上线的话必须是https，没有appId的本地请求貌似不受影响  
      data: {
        parms: parms
      },
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          memberInfo: res.data.memberInfo
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () {
        // complete  
      }
    });

  }
})