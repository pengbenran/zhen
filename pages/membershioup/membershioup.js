// pages/membershioup/membershioup.js
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
    var that=this;
    var memberId = wx.getStorageSync('memberId')
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ImageWidth: res.screenWidth + 'px',
          ImageHeight: res.screenWidth / 1.503 + 'px',
          memberId: memberId,
          name:options.name,
          face:options.face
        })
      }
    })
    wx.request({
      url: api + '/api/distribe/memberLvList',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            memberLvList: res.data.memberLvList,
            needpay: Math.abs(res.data.memberLvList[1].point - res.data.memberLvList[0].point)
          })
        }
      }
    })
  },
  membershioup:function(){
    var that=this;
    let payParms = {}
    var sn = Date.parse(new Date())
    payParms.orderid = Date.parse(new Date())
    payParms.total_fee = that.data.needpay*100
    payParms.sn = sn
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: api + "/api/pay/prepay",
            data: {
              code: res.code,
              parms: payParms,

            },
            method: 'GET',
            success: function (res) {
              var pay = res.data
              wx.requestPayment({
                timeStamp: pay.timeStamp,
                nonceStr: pay.nonceStr,
                package: pay.package,
                signType: pay.signType,
                paySign: pay.paySign,
                success: function (res) {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000
                  })
                  let orderParm = {}
                  orderParm.sn = sn
                  orderParm.payMoney = that.data.needpay
                  orderParm.payStatus = 1
                  orderParm.nowlvid = that.data.memberLvList[1].lvId
                  orderParm.memberId = that.data.memberId
                  wx.request({
                    url: api + "/api/distribe/payOrder",
                    method: "POST",
                    data: {
                      params: JSON.stringify(orderParm)
                    },
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: "POST",
                    success: function (res) {
                      console.log(res.data)
                      if (res.data.code == 0) {
                        wx.showToast({
                          title: '升级成功',
                        })
                        setTimeout(function(){
                          wx.redirectTo({
                            url: '../micromember/micromember',
                          })
                        },1000)
                       
                      }
                    }
                  })
                }

              })
            }
          })
        }
      }
    })
  }
})