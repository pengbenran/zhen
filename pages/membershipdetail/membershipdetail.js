// pages/membershipdetail/membershipdetail.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    ivid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
     money:options.money,
     memberId: memberId,
     ivid: options.ivid
    })
  },
  btnform:function(e){
    var that = this;
    if (e.detail.value.IDcard == "" || e.detail.value.IDcard.length!=18) {
      wx.showToast({
        title: '身份证格式错误',
        icon: 'loading'
      })
    }
    else if (e.detail.value.name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'loading'
      })
    } else if (e.detail.value.mobile == '') {
      wx.showToast({
        title: '电话不能为空',
        icon: 'loading'
      })
    }
    else if (e.detail.value.bankcard == "") {
      wx.showToast({
        title: '银行卡号为空',
        icon: 'loading'
      })
    }
    else if (e.detail.value.depositBlank == "") {
      wx.showToast({
        title: '开户银行为空',
        icon: 'loading'
      })
    } else {
      wx.showLoading({
        title: '请稍等',
      })
      var parms = {}
      parms.name = e.detail.value.name
      parms.referrer = wx.getStorageSync('isisAgent')
      parms.lvid = that.data.ivid; 
      parms.mobile = e.detail.value.mobile
      parms.memberId = that.data.memberId
      parms.midentity = e.detail.value.IDcard
      parms.cardno = e.detail.value.bankcard
      parms.depositBank = e.detail.value.depositBlank
      wx.request({
        url: api + '/api/distribe/submitDistribeApply',
        data: {
          params: JSON.stringify(parms)
        },
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
         if(res.data.code==0){
          //  订单提交成功，唤起微信支付
          let payParms={}
          var  sn = Date.parse(new Date())
           payParms.orderid = Date.parse(new Date())
           payParms.total_fee = that.data.money*100 
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
                         let orderParm={}
                         orderParm.sn = sn
                         orderParm.payMoney =that.data.money
                         orderParm.payStatus  = 0
                         orderParm.memberId = that.data.memberId
                         wx.request({
                           url: api + "/api/distribe/payOrder",
                           method:"POST",
                           data: {
                             params: JSON.stringify(orderParm)
                           },
                           header: {
                             'Content-Type': 'application/x-www-form-urlencoded'
                           },
                           method:"POST",
                           success: function (res) {
                             console.log(res.data)
                             if(res.data.code==0){
                               wx.redirectTo({
                                 url: '../micromember/micromember',
                               })
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
        }
      })
    }

  }

})