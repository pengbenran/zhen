//app.js
let { WeToast } = require('addone/wetoast.js')
//注册小程序，接收一个Object参数
App({
  WeToast,
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

  },
  globalData: {
    userInfo: null,
    apimg: "https://shop.guqinet.com/html/images/guqinzhen",//图片地址
    //api: "https://www.guqinjiujiang.xyz:8444/guqinzhen",
    // api: "http://192.168.2.131/mall",
    //api: "http://192.168.2.208/mall",
     api: "http://192.168.2.111/mall",
    //api: "https://www.guqinjiujiang.xyz:8444/guqinzhen",
    //api: "http://192.168.2.131/mall",
   //api: "http://192.168.2.208/mall",
    // api:"https://www.guqinjiujiang.xyz:8444/zjbjp",
    // api:"http://119.29.62.45:8080/mall",
  } 
}) 