// pages/morepoint/morepoint.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bcg: apimg + "/image/zhifubcg.jpg",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: api + '/api/member/pointRecharge',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if(res.data.code==0){
          that.setData({
            pointRechargeList: res.data.pointRechargeList
          })
        }
      }
    })
  },
  pointrecharge:function(e){
    let payParms = {}
    var sn = Date.parse(new Date())
    payParms.orderid = Date.parse(new Date())
    payParms.total_fee = e.currentTarget.dataset.money * 100
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
                  var parms = {}
                  parms.memberId = wx.getStorageSync('memberId')
                  parms.id = e.currentTarget.dataset.id
                  wx.request({
                    url: api + '/api/member/memberRecharge',
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
                          title: '充值成功',
                          icon:'success'
                        })
                        setTimeout(function(){
                          wx.switchTab({
                            url:'../my/my'
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