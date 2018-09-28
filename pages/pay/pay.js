var apimg = getApp().globalData.apimg;
// pages/index/test0501.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShareAppMessage: function () {


    withShareTicket: true

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {

          //发起网络请求
          wx.request({
            url: "http://192.168.2.144/api/pay/prepay?code=" + res.code + "",
            //  url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx5d7e1d6603be483f&secret=2af57742e76a7b8a62a779292eb67463&js_code=" + res.code + "& grant_type=authorization_code",
            data: { },
            method: 'GET',
            success: function (res) {
              console.log(res)
              console.log(res)
              var pay = res.data
              //发起支付   
              var timeStamp = pay.timeStamp;
              console.log("timeStamp:" + timeStamp)
              var packages = pay.package;
              console.log("package:" + packages)
              var paySign = pay.paySign;
              console.log("paySign:" + paySign)
              var nonceStr = pay.nonceStr;
              console.log("nonceStr:" + nonceStr)
              var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
              that.pay(param) 
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  /* 支付   */
  pay: function (param) {
    console.log("支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        // success   
        console.log("支付")
        console.log(res)
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面   
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function () {
            // fail   
          },
          complete: function () {
            // complete   
          }
        })
      },
      fail: function (res) {
        // fail   
        console.log("支付失败")
        console.log(res)
      },
      complete: function () {
        // complete   
        console.log("pay complete")
      }
    })
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