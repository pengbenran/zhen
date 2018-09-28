var apimg = getApp().globalData.apimg;
Page({
  data: {
    windowHeight: 654,
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
    "canimg": [apimg+"/image/gotuan/tu1.png"],
    "cantext": ["vivo X20 双摄像头智能大屏手机前置2000万像素"],
    "money": ["998.00"],
    "discount": ["1200.00"],
    "fenimg": [apimg+"/image/gotuan/fen.png"],
    "fenxiang":["分享"],
    "shuzi":1,
    "gimg": [apimg+"/image/gotuan/6.png"],
    "gtext": ["正品保证"],
    "gtext2": ["全场包邮"],
    "gtext3": ["24h发货"],
    "gtext4": ["返点积分"],
    "jointime": ["参团时间：2018.03.01 18:00:54"],
    "headimg": [apimg+"/image/gotuan/tou.png"],
    "dian": [apimg+"/image/gotuan/dian.png"],
    "btn": [apimg+"/image/gotuan/weixin.png"],
    "yao": ["邀请好友参团"]


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
  onLoad: function () {
    this.setData({
      windowHeight: wx.getStorageSync('windowHeight')
    });
  },
  onShareAppMessage: function () {


    withShareTicket: true

  },
  // 页面渲染完成后 调用  
  onReady: function () {
    var totalSecond = 80000 - Date.parse(new Date()) / 1000;

    var interval = setInterval(function () {
      // 秒数  
      var second = totalSecond;

      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond == 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  //cell事件处理函数  
})  