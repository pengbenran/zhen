var apimg = getApp().globalData.apimg;
//获取应用实例
var api = getApp().globalData.api;
var app = getApp()
Page({
  data: {
    "headsimg": [apimg+"/images/quzhifu/biankuang.png"],
    "mentimg": [apimg+"/images/quzhifu/ren.png"],
    "payimg": [apimg+"/images/quzhifu/dizhi.png"],
    "yes": [apimg+"/images/quzhifu/shang.png"],
    "indimg": [apimg+"/images/quzhifu/8.png"],
    lineimg: apimg + "/image/group/04.jpg",
    homeimg: apimg + "/image/group/17.png",
    weappimg: apimg + "/image/group/8.png",
    "box2img": ["../images/quzhifu/tu1.png"],
    "charimg": ["vivo X20双摄头智能大屏手机前置2000万像素"],
    "numbimg": ["20只/盒"],
    "modemoney": ["0.00"],
    orderid:"",
    "bao": [apimg+"/images/quzhifu/bao.png"],
    currentTab: 0,
    total_fee:""
  },

  
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    
    var parms = {}
    var gainedpoint = options.gainedpoint
    var facevalue = options.facevalue
    var pay = JSON.parse(options.pay);                  
    var bean = JSON.parse(options.pay);
    var list = bean.googitem;
    bean.orderAmount = bean.orderAmount - facevalue - pay.shippingAmount
    if (bean.orderAmount<0){
      bean.orderAmount=0.01
    }
    var totalPrice = list[0].price * list[0].num 
    var that = this
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {

    }
    parms.memberId = memberId
    wx.request({
      url: api + '/api/address/defutaddress',
      data: {
        parms: parms
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫zhihu的这个数组中
        that.setData({
          memberAddressDO: res.data.memberAddressDO
          //res代表success函数的事件对，data是固定的
        })
      }
    })
    this.setData({
     orderid: options.orderid,
      totalPrice: totalPrice,
      Goods: bean,
      list: list,
      gainedpoint: gainedpoint,
      total_fee:bean.orderAmount,
      shipAddr: options.shipAddr,
      shipMobile: options.shipMobile,
      shipName: options.shipName,
    })
  },
  // 首页跳转
  zhuye: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  }, 
  payoff: function (options) {
    var that = this
    var parms={}
    // var body = that.data.list[0].name
    var total_fee = that.data.total_fee*100
    // parms.body = body
    parms.orderid = that.data.orderid
    parms.total_fee = total_fee
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: api + "/api/pay/prepay",
            data: {
              code:res.code,
              parms:parms
            },
            method: 'GET',
            success: function (res) {
              that.setData({
                total_fee: total_fee
              })
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

fail(e){
  var parms = {}
  var order = {}
  var code = 500
  var orderId = this.data.orderid
  order.orderId = orderId
  parms.order = order
  parms.code = code
  
  parms=JSON.stringify(parms)
  wx.request({
    url: api + "/api/order/passOrder",
    data: {
      parms: parms
    },
    method: 'PUT',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {

    }
  })
},
  /* 支付   */
  pay: function (param) {
    var parms={}
    var order={}
  var code = 200
  var orderId=this.data.orderid
  order.orderId = orderId
  parms.order=order
  parms.code = code
  parms.gainedpoint = Number(this.data.gainedpoint)
  parms.paymoney = this.data.total_fee/100
  parms = JSON.stringify(parms)
  var that = this 
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
        wx.switchTab({
          url: '../index/index',
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            wx.request({
              url: api + "/api/order/passOrder",
              data: {
                parms: parms
              },
              method: 'PUT',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                    
              }
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
        // 失败接口
        wx.reLaunch({
          url: '../index/index',
        })
        that.fail()

      },
      complete: function () {
        // complete   
        console.log("pay complete")
      }
    })
  },
  onShareAppMessage: function () {
    withShareTicket: true
  },
  //地址管理跳转
  admin: function (e) {
    wx.navigateTo({
      url: '../myaddress/myaddress',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }

})
