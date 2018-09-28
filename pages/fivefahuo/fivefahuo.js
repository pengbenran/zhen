var apimg = getApp().globalData.apimg;
var app = getApp()
const util = require('../../utils/util.js')
var api = getApp().globalData.api;
var Info = {}
Page({
  data: {
    boximg:apimg+"/images/quzhifu/shang.png",
    trueimg:apimg+"/image/quxiaoyemian/zu28.png",
    delimg:apimg+"/image/quxiaoyemian/zu28.png",
    currentTab: 0,
    tabPageHeight: 800,
    zhuan:"",
    cat:"",
    showModalStatus: false,
 
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
  },
  onLoad: function (options) {
    var that=this
    try {
      var memberId = wx.getStorageSync('memberId')
      var indexdata = wx.getStorageSync('indexdata')
      if (memberId) {
        that.setData({
          memberId: memberId,
          indexdata: indexdata
        })   
      }
    } catch (e) {
    }
    var currentTarget = options.currentTarget
    if(currentTarget==0){
      this.setData({
        currentTab: 0
      })
      that.getOrderdetail(0)
    }
    else if (currentTarget=="1"){
      this.setData({
        currentTab: 1
      })
      let stauts = 1;
      let cat = "待付款"
      that.orderRequest(0, 0, 0, stauts, cat)
    }
    else if (currentTarget == "2") {
      this.setData({
        currentTab: 2
      })
      let stauts = 2;
      let cat = "待发货"
      var statuss = "2,1"
      that.orderRequest(statuss, 2, 0, stauts, cat)
    }
    else if (currentTarget == "3") {
      this.setData({
        currentTab: 3
      })
      let stauts = 3;
      let cat = "已发货"
      that.orderRequest(3, 2, 1, stauts, cat) 
    }
    else if (currentTarget == "4") {
      this.setData({
        currentTab: 4
      })
      let stauts = 4;
      let cat = "已完成"
      that.orderRequest("3,4", 2, 2, stauts, cat) 
    }
  },
  changTab:function(e){
    var that=this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    if(e.target.id==0){
      that.getOrderdetail(0)
    }
    else if(e.target.id==1){
      let stauts=1;
      let cat="待付款"
      that.orderRequest(0,0,0,stauts,cat)
    }
    else if (e.target.id == 2){   
      let stauts = 2;
      let cat = "待发货" 
      var statuss = "2,1"
      that.orderRequest(statuss,2,0, stauts, cat)
    }
    else if (e.target.id == 3){
      let stauts = 3;
      let cat = "已发货" 
      that.orderRequest(3,2,1, stauts, cat) 
    }
    else{
      let stauts = 4;
      let cat = "已完成"
      that.orderRequest("3,4",2,2,stauts, cat) 
    }
  },
  orderRequest: function (statuss, payStatus, shipStatus, status,cat){
    var that=this
    let parms = {}
    let order = {} 
    order.statuss = statuss//状态
    order.payStatus = payStatus
    order.shipStatus = shipStatus
    order.memberId = that.data.memberId
    parms.order = order
    wx.request({
      url: api + '/api/order/orderList',
      data: {
        parms: parms
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var orderList = res.data.orderList
        for (var i = 0; i < orderList.length; i++) {
          orderList[i]["createTime"] = util.formatTime(new Date(orderList[i]["createTime"]))
        }
        that.setData({
          orderList: orderList,
          status: status,
          cat: cat
        })
      },
    })
  },
  getOrderdetail: function(orderStatus){
    var that = this//不要漏了这句，很重要
    // 全部订单
    if(orderStatus=="0"){
      var parms = {}
      let status=100
      parms.memberId = that.data.memberId
      wx.request({
        url: api + '/api/order/apiSelectOrderList',
        data: {
          parms: parms
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (status == 100) {
            status = "确认付款"
          }
          var orderList = res.data.orderList
          for (var i = 0; i < orderList.length; i++) {
            orderList[i]["createTime"] = util.formatTime(new Date(orderList[i]["createTime"]))
          }
          that.setData({
            status: status,
            orderList: orderList,
            //res代表success函数的事件对，data是固定的
          })
        },
      })
    }
  },
  
  //物流页面跳转js
  wuliu: function (e) {
    wx.navigateTo({
      url: '../wuliu/wuliu',
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
  }, 
  onShareAppMessage: function () {


    withShareTicket: true

  },
  // 商品详情页面跳转
  swiperbind: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../group/group?goodid='+e.currentTarget.dataset.goodsid,
    })
  },
  /**
       * 页面上拉触底事件的处理函数
       */
  
  //点击切换

// 支付


  payoff: function (e) {
    
    var value = e.target.dataset.value
    var orderList = this.data.orderList
    var orderId = e.target.dataset.orderid
    var status = 4
    var parms = {}
    var order = {}
    var that = this
    if (value == "确认收货") {
      wx.showModal({
        title: '提示',
        content: '是否确认收货',
        success: function (res) {
          if (res.confirm) {


            order.shipStatus = 2
            order.orderId=orderId
            parms.order = order
            parms = JSON.stringify(parms)
            wx.request({
              url: api + '/api/order/synthesize',
              data: {
                parms: parms
              },
              method: "PUT",
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 1500
                })
                that.data.orderList.splice(e.currentTarget.dataset.index, 1)
                that.setData({
                  orderList: that.data.orderList
                })
              },

            })

            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })  
 return;
    }
    if (value == "查看订单") {
      var orderId = e.target.dataset.orderid
      wx.redirectTo({
        url: '../listgruop/listgruop?orderId=' + orderId,
      })
      return;
    }
    if(value=="申请退款"){
      wx.showModal({
        title: '提示',
        content: '是否确认退款',
        success: function (res) {
          if (res.confirm) {
            var dd = {}
             dd.orderId = e.target.dataset.orderid
             dd.goodssn = e.target.dataset.goodssn
             dd.sn = e.target.dataset.sn
             var dd = JSON.stringify(dd)
          wx.navigateTo({
            url: '../tuikuan/tuikuan?dd=' + dd,
          })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })  
      return;
    }
    if (value=="确认付款"){
    var that = this
    var total = e.target.id
    var orderid = e.target.dataset.orderid
    var sn=e.target.dataset.sn
    var parms = {}
    // var body = that.data.list[0].name
     var total_fee = total * 100
    // parms.body = body
    parms.orderid = orderid
    parms.total_fee = total_fee
    parms.sn=sn
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: api + "/api/pay/prepay",
            data: {
              code: res.code,
              parms: parms
            },
            method: 'GET',
            success: function (res) {
              that.setData({
                total_fee: total_fee,
                orderId: orderid
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
  }
  },
  fail(e) {
    var parms = {}
    var order = {}
    var code = 500
    var orderId = this.data.orderId
    order.orderId = orderId
    parms.order = order
    parms.code = code
    
    parms = JSON.stringify(parms)
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
    var parms = {}
    var order = {}
    var code = 200
    var orderId = this.data.orderId
    order.orderId = orderId
    parms.order = order
    parms.code = code
    parms.paymoney = this.data.total_fee / 100
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
        wx.navigateBack({
          // 回退前 delta(默认为1) 页面  ,4为首页 
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
                that.onLoad() 

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
        that.fail()

      },
      complete: function () {
        // complete   
        console.log("pay complete")
      }
    })
  },









// 
tuihuo:function(e){
  wx.showModal({
    title: '提示',
    content: '是否确认退货',
    success: function (res) {
      if (res.confirm) {
        var dd = {}
        dd.orderId = e.target.dataset.orderid
        dd.goodssn = e.target.dataset.goodssn
        dd.sn = e.target.dataset.sn
        var dd = JSON.stringify(dd)
        wx.navigateTo({
          url: '../tuihuo/tuihuo?dd=' + dd,
        })
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })  
},









quxiao:function(e){
  var zhuan = e.target.dataset.value
  var orderList = this.data.orderList
  if (zhuan == "取消订单") {
    var orderId = e.target.dataset.orderid
    var status = 6
    var parms = {}
    var order = {}
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      success: function (res) {
        if (res.confirm) {
          order.orderId = orderId
          order.status = 6
          order.payStatus = 0
          order.shipStatus = 0
          parms.order = order
          parms = JSON.stringify(parms)
          wx.request({
            url: api + '/api/order/synthesize',
            data: {
              parms: parms
            },
            method: "PUT",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1500
              })
              that.data.orderList.splice(e.currentTarget.dataset.index, 1)
              that.setData({
                orderList: that.data.orderList
              })
            },

          })

          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })  
  }
if(zhuan=="查看物流"){
  var orderId = e.target.dataset.orderid
  var image = e.target.dataset.image
  wx.redirectTo({
    url: '../wuliu/wuliu?orderId=' + orderId + "&image=" + image,
  })
  return
}
if(zhuan=="查看订单"){
  var orderId = e.target.dataset.orderid
  wx.redirectTo({
    url: '../listgruop/listgruop?orderId=' + orderId,
  })
  return;
}
  if (zhuan == "删除订单") {
    var orderId = e.target.dataset.orderid
    var parms = {}
    var order = {}
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除订单',
      success: function (res) {
        if (res.confirm) {
          order.orderId = orderId
          order.status = 7
          parms.order = order
          parms = JSON.stringify(parms)
          wx.request({
            url: api + '/api/order/synthesize',
            data: {
              parms: parms
            },
            method: "PUT",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1500
              })
              that.data.orderList.splice(e.currentTarget.dataset.index, 1)
              that.setData({
                orderList: that.data.orderList
              })

            },

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })  
  }
},

  // 模态框js
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })
      //关闭  
      if (currentStatu == "close") {
        this.quxiao(e)
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    //弹出取消成功  
    if (currentStatu == "close1") {
      this.setData(
        {
          showModalStatus: false,

        },
        // 添加取消成功的消息提示框
        wx.showToast({
          title: "取消成功",
          icon: "success",
          durantion: 2000
        })
      );
    }
  },
  // 
  onPullDownRefresh: function () {
    this.onLoad()
  },

//删除模态框
  powerDrawer4: function (e) {
    var currentStatu4 = e.target.dataset.value
    this.util4(currentStatu4)
  },
  util4: function (currentStatu4) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu4 == "close4") {
        this.setData(
          {
            showModalStatus4: false
          }
        );
      }
    }.bind(this), 200)
    // 显示  
    if (currentStatu4== "open4") {
      this.setData(
        {
          showModalStatus4: true
        }
      );
    }
    //弹出取消成功  
    if (currentStatu4 == "close5") {
      this.setData(
        {
          showModalStatus4: false,

        },
        // 添加取消成功的消息提示框
        wx.showToast({
          title: "已删除",
          icon: "success",
          durantion: 2000
        })
      );
    }
  }



})