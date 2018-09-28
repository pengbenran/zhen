var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var pay=""
var OrderId=""
var bean=""

Page({
  data: {
    productId:'',
    price:'',
    isKaituan:true,
    isAddr:true,
    "payimg": [apimg+"/images/quzhifu/dizhi.png"],
    imgpay:apimg+"/images/quzhifu/ren.png",
    head:apimg+"/images/quzhifu/biankuang.png",
    myaddress: "1",
    "yes": [apimg+"/images/quzhifu/shang.png"],
    "ind": [apimg+"/images/quzhifu/8.png"],
    "h1": ["手机专卖商城"],
    // "spcart": ["../images/quzhifu/tu1.png"],
    "price": ["998.00"],
    "bao": [apimg+"/images/quzhifu/bao.png"],
    "baotext": ["正品保障"],
    "text": ["配送方式"],
    "text2": ["普通快递￥0.00"],
    "price": ["998.00"],
    "waytext": ["可用积分812积分抵用8.12元"],
    "youhui":["优惠"],
    "nothave": ["暂无可用"],
    "coreimg": [apimg+"/images/quzhifu/8.png"],
    "modemoney": ["0.00"],
    "total": ["6800.00"],
    memberAddressDO:"",
    
     switchData: [ 
      {
        id: 1,
        color: '#26b4fe',
        isOn: false
      }
    ],
  //   gooditem:gooditem
  },
  
  onLoad: function (options) {
    var that = this
    if (options.price == undefined || options.pic == undefined || options.goodsId == undefined || options.Type == undefined){
      that.setData({
        price: wx.getStorageSync('price'),
        pic: wx.getStorageSync('pic'),
        goodsId: wx.getStorageSync('goodsId'),
        Type: wx.getStorageSync('Type')
      })
    }else{
      that.setData({
        price: Number(options.price).toFixed(2),
        pic: options.pic,
        goodsId: options.goodsId,
        Type:options.Type
      })
    }
    var totalPrice = that.data.price * that.data.pic
    that.setData({
      memberId: wx.getStorageSync('memberId'),
      indexdata: wx.getStorageSync('indexdata'), 
      totalPrice: Number(totalPrice).toFixed(2),
    })
    if (that.data.Type == 'K') {
      // 开团
      if(options.collagePersons==undefined){
        that.setData({
          collagePersons: wx.getStorageSync('collagePersons')
        })
      }
      else{
        that.setData({
          collagePersons: options.collagePersons
        })
      }
    }
    else if (that.data.Type == 'C') {
      // 参团
      if (options.memberCollageId == undefined) {
        that.setData({
          memberCollageId: wx.getStorageSync('memberCollageId')
        })
      }
      else {
        that.setData({
          memberCollageId: options.memberCollageId
        })
      }
      that.setData({
        isKaituan: false
      })
    }
    else if(that.data.Type="KJ"){
      // 砍价
      if (options.cutId == undefined) {
        that.setData({
          cutId: wx.getStorageSync('cutId')
        })
      }
      else {
        that.setData({
          cutId: options.cutId
        })
      }
    }
    else{
      // 限时活动
      if (options.limitId == undefined) {
        that.setData({
          limitId: wx.getStorageSync('limitId'),
          finalAmount: wx.getStorageSync('finalAmount')
        })
      }
      else {
        that.setData({
          limitId: options.limitId,
          finalAmount: Number(options.price).toFixed(2)
        })
      }
    }
    if (wx.getStorageSync('addr') == '') {
      let addParms = {}
      addParms.memberId = that.data.memberId
      wx.request({
        url: api + '/api/address/defutaddress',
        data: {
          parms: addParms
        },
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // wx.setStorageSync('addr', res.data.memberAddressDO);
          if (res.data.code == 1) {
            that.setData({
              isAddr: false
            })
          }
          else {  
            that.setData({
              addr: res.data.memberAddressDO
            })
          }

        }
      })
    }
    else {
      that.setData({
        addr: wx.getStorageSync('addr')
      })
    }
    var goodsParms = {}
    goodsParms.goodsId = that.data.goodsId
    wx.request({
      url: api + '/api/Goods/getGoods',
      // url: 'http://192.168.2.144/api/index/getGoods/166993'
      data: {
        parms: goodsParms
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        console.log(res.data.Goods)
        that.setData({
          Goods: res.data.Goods
        })
      },
    })
    wx.request({
      url: api + '/api/Goods/getProduct',
      data: {
        parms: goodsParms
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        that.setData({
          productId: res.data.product.productId
        })
      }
    })
  },

  clickd: function (e) {
    this.setData({
      clickd: e.detail.value
    })
  },
  kanjia:function(){
    var that = this
    if (that.data.addr == undefined) {
      wx.showToast({
        title: '请添加地址',
      })
    }
    else {
      var bean = {}
      var goodObj = {}
      wx.showLoading({
        title: '请稍等',
      })
      bean.image = that.data.Goods.thumbnail
      bean.memberId = that.data.memberId
      bean.gainedpoint = that.data.Goods.point
      bean.orderAmount = that.data.totalPrice
      bean.weight = that.data.Goods.weight
      bean.shippingAmount = 0
      bean.goodsAmount = that.data.totalPrice
      bean.cutId = that.data.cutId
      bean.googitem = []
      goodObj.price = that.data.Goods.price
      goodObj.name = that.data.Goods.name
      goodObj.num = that.data.pic * 1
      goodObj.cart = 0
      goodObj.goodsId = that.data.Goods.goodsId
      goodObj.catId = that.data.Goods.catId
      goodObj.image = that.data.Goods.thumbnail
      goodObj.goodsAmount = that.data.totalPrice
      goodObj.memberCollageId = that.data.memberCollageId
      goodObj.productId = that.data.productId
      bean.googitem[0] = goodObj
      // var googitem = that.data.list; 
      bean.province = that.data.province
      bean.city = that.data.addr.city
      bean.addr = that.data.addr.addr
      bean.region = that.data.addr.region
      bean.shipMobile = that.data.addr.mobile
      bean.shipName = that.data.addr.name
      bean.addrId = that.data.addr.addrId
      bean.clickd = that.data.clickd
      bean = JSON.stringify(bean)
      wx.request({
        url: api + '/api/order/save',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          order: bean
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '订单提交成功',
              icon: 'success',
              duration: 2000
            })
            wx.hideLoading()
            var parms = {}
            that.setData({
              order: res.data.order
            })
            parms.orderid = res.data.order.orderId
            parms.sn = that.data.order.sn
            parms.total_fee = that.data.order.orderAmount * 100
            wx.login({
              success: function (res) {
                if (res.code) {
                  //发起网络请求
                  wx.request({
                    url: api + "/api/pay/prepay",
                    data: {
                      code: res.code,
                      parms: parms,       
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
                        // util.sendMsg(pay.package, orderId, payordertime, ordername, that.data.order.orderAmount)
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                          })
                          var orderparms = {}
                          var order = {}
                          order.orderId = that.data.order.orderId
                          orderparms.order = order
                          orderparms.code = 200
                          orderparms.gainedpoint = Number(that.data.order.gainedpoint)
                          orderparms.paymoney = that.data.order.orderAmount
                          wx.request({
                            url: api + "/api/order/passOrder",
                            data: {
                              parms: JSON.stringify(orderparms)
                            },
                            method: 'PUT',
                            header: {
                              'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                              if (res.data.code == 0) {
                                wx.showToast({
                                  title: '订单成功',
                                  icon: 'success',
                                  duration: 2000
                                })
                                wx.switchTab({
                                  url: '../index/index',
                                })
                              }
                            }
                          })
                        },
                        fail: function (res) {
                          // fail   
                          wx.showToast({
                            title: '未支付',
                            icon: 'success',
                            duration: 2000
                          })

                        },
                        complete: function () {

                        }
                      })
                    },
                    fail: function () {

                    },
                    complete: function () {

                    }
                  })

                } else {

                }
              }
            });
          }
        }
      })
    }
  },
  xianshi:function(){
    var that = this
    if (that.data.addr == undefined) {
      wx.showToast({
        title: '请添加地址',
      })
    }
    else {
      var bean = {}
      var goodObj = {}
      wx.showLoading({
        title: '请稍等',
      })
      bean.image = that.data.Goods.thumbnail
      bean.memberId = that.data.memberId
      bean.gainedpoint=that.data.Goods.point
      bean.orderAmount = that.data.finalAmount
      bean.weight = that.data.Goods.weight
      bean.shippingAmount = 0
      bean.goodsAmount = that.data.finalAmount
      bean.limitId = that.data.limitId
      bean.googitem = []
      goodObj.price = that.data.Goods.price
      goodObj.name = that.data.Goods.name
      goodObj.num = that.data.pic * 1
      goodObj.cart = 0
      goodObj.goodsId = that.data.Goods.goodsId
      goodObj.catId = that.data.Goods.catId
      goodObj.image = that.data.Goods.thumbnail
      goodObj.goodsAmount = that.data.totalPrice
      goodObj.memberCollageId = that.data.memberCollageId
      goodObj.productId = that.data.productId
      bean.googitem[0] = goodObj
      // var googitem = that.data.list; 
      bean.province = that.data.province
      bean.city = that.data.addr.city
      bean.addr = that.data.addr.addr
      bean.region = that.data.addr.region
      bean.shipMobile = that.data.addr.mobile
      bean.shipName = that.data.addr.name
      bean.addrId = that.data.addr.addrId
      bean.clickd = that.data.clickd
      bean = JSON.stringify(bean)
      wx.request({
        url: api + '/api/order/save',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          order: bean
        },
        success: function (res) {
          if(res.data.code==0){
            wx.showToast({
              title: '订单提交成功',
              icon: 'success',
              duration: 2000
            })
            wx.hideLoading()
            var parms = {}
            that.setData({
              order: res.data.order
            })
            parms.orderid = res.data.order.orderId
            parms.sn = that.data.order.sn
            parms.total_fee = that.data.order.orderAmount * 100
            wx.login({
              success: function (res) {
                if (res.code) {
                  //发起网络请求
                  wx.request({
                    url: api + "/api/pay/prepay",
                    data: {
                      code: res.code,
                      parms: parms,
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
                          var orderparms = {}
                          var order = {}
                          order.orderId = that.data.order.orderId
                          orderparms.order = order
                          orderparms.code = 200
                          orderparms.gainedpoint = Number(that.data.order.gainedpoint)
                          orderparms.paymoney = that.data.order.orderAmount
                          wx.request({
                            url: api + "/api/order/passOrder",
                            data: {
                              parms: JSON.stringify(orderparms)
                            },
                            method: 'PUT',
                            header: {
                              'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                              if (res.data.code == 0) {
                                wx.showToast({
                                  title: '订单成功',
                                  icon: 'success',
                                  duration: 2000
                                })
                                wx.switchTab({
                                  url: '../index/index',
                                })
                              }
                            }
                          })
                        },
                        fail: function (res) {
                          // fail   
                          wx.showToast({
                            title: '未支付',
                            icon: 'success',
                            duration: 2000
                          })

                        },
                        complete: function () {

                        }
                      })
                    },
                    fail: function () {

                    },
                    complete: function () {

                    }
                  })

                } else {

                }
              }
            });
          }  
        }
      })
    }
  },
  cantuan:function(){
    var that = this
    if (that.data.addr == undefined) {
      wx.showToast({
        title: '请添加地址',
      })
    }
     else{
      var bean = {}
      var goodObj = {}
      wx.showLoading({
        title: '请稍等',
      })
      wx.request({
        url: api + '/api/collage/judgeIsCollaged',
        data: {
          memberCollageId: that.data.memberCollageId
        },
        success: function (res) {
            if(res.code==1){
              wx.showToast({
                title: '手慢了，已成团',
              })
              setTimeout(function(){
                wx.switchTab({
                  url: '../active/active',
                })
              },1000)          
            }
            else{
              bean.image = that.data.Goods.thumbnail
              bean.memberId = that.data.memberId
              bean.orderAmount = that.data.totalPrice
              bean.weight = that.data.Goods.weight
              bean.shippingAmount = 0
              bean.goodsAmount = that.data.totalPrice
              bean.googitem = []
              goodObj.price = that.data.Goods.price
              goodObj.name = that.data.Goods.name
              goodObj.num = that.data.pic * 1
              goodObj.cart = 0
              goodObj.goodsId = that.data.Goods.goodsId
              goodObj.catId = that.data.Goods.catId
              goodObj.image = that.data.Goods.thumbnail
              goodObj.goodsAmount = that.data.totalPrice
              goodObj.memberCollageId = that.data.memberCollageId
              goodObj.productId = that.data.productId
              bean.googitem[0] = goodObj
              // var googitem = that.data.list; 
              bean.province = that.data.province
              bean.city = that.data.addr.city
              bean.addr = that.data.addr.addr
              bean.region = that.data.addr.region
              bean.shipMobile = that.data.addr.mobile
              bean.shipName = that.data.addr.name
              bean.addrId = that.data.addr.addrId
              bean.clickd = that.data.clickd
              bean = JSON.stringify(bean)
              wx.request({
                url: api + '/api/order/save',
                method: 'POST',
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                  order: bean
                },
                success: function (res) {
                  wx.hideLoading()
                  var parms = {}
                  that.setData({
                    order: res.data.order
                  })
                  parms.orderid = res.data.order.orderId
                  parms.sn = that.data.order.sn
                  parms.total_fee = that.data.totalPrice * 100
                  wx.login({
                    success: function (res) {
                      if (res.code) {
                        //发起网络请求
                        wx.request({
                          url: api + "/api/pay/prepay",
                          data: {
                            code: res.code,
                            parms: parms,
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
                                let cantuanparams = {}
                                cantuanparams.orderId = that.data.order.orderId

                                wx.request({
                                  url: api + "/api/order/collagepayreturn",
                                  data: {
                                    parms: JSON.stringify(cantuanparams)
                                  },
                                  method: 'PUT',
                                  header: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                  },
                                  success: function (res) {
                                    if (res.data.code == 0) {
                                      let cantuanorderparams = {}
                                      cantuanorderparams.goodsId = that.data.goodsId
                                      cantuanorderparams.price = that.data.price
                                      cantuanorderparams.sn = that.data.order.sn
                                      cantuanorderparams.amounts = that.data.totalPrice * 100
                                      cantuanorderparams.amount = that.data.totalPrice
                                      cantuanorderparams.memberId = that.data.memberId
                                      cantuanorderparams.memberCollageId = that.data.memberCollageId
                                      cantuanorderparams.productId = that.data.productId
                                      cantuanorderparams.num = that.data.pic * 1
                                      cantuanorderparams.orderId = that.data.order.orderId
                                      wx.request({
                                        url: api + '/api/collage/joinCollage',
                                        data: {
                                          params: cantuanorderparams
                                        },
                                        header: {
                                          'Content-Type': 'application/json'
                                        },
                                        success: function (res) {
                                          //util.sendMsg(pay.package, that.data.order.orderId, payordertime, ordername, that.data.order.orderAmount)
                                          console.log(res.data)
                                          wx.showToast({
                                            title: '参团成功',
                                            icon: 'success',
                                            duration: 2000
                                          })
                                          var parmss = {}
                                          parmss.price = res.data.price
                                          parmss.activityPrice = res.data.activityPrice
                                          parmss.goodsId = res.data.goodsId
                                          parmss.goodsName = res.data.goodsName
                                          parmss.memberCollageId = res.data.memberCollageId
                                          parmss.img = res.data.img
                                          parmss.shortPerson = res.data.shortPerson
                                          if (res.data.shortPerson == 0) {
                                            parmss.iscollage = 1
                                          }
                                          else {
                                            parmss.iscollage = 2
                                          }
                                          parmss = JSON.stringify(parmss)
                                          wx.navigateTo({
                                            url: '../cantuan/cantuan?shops= ' + parmss,
                                          })
                                        }
                                      })
                                    }
                                  }
                                })
                              },
                              fail: function (res) {
                                // fail   
                                wx.showToast({
                                  title: '登录失败',
                                  icon: 'success',
                                  duration: 2000
                                })

                              },
                              complete: function () {

                              }
                            })
                          },
                          fail: function () {

                          },
                          complete: function () {

                          }
                        })

                      } else {

                      }
                    }
                  });
                }
              })
            }
        }
      })
     }
  },
  kaituan: function () {
// 获取订单
    var that = this
    if (that.data.addr == undefined) {
      wx.showToast({
        title: '请添加地址',
      })
    }
    else {
    var bean = {}
    var goodObj={}
    wx.showLoading({
      title: '请稍等',
    })
    bean.image = that.data.Goods.thumbnail
    bean.memberId = that.data.memberId
    bean.orderAmount = that.data.totalPrice
    bean.weight = that.data.Goods.weight
    bean.shippingAmount = 0
    bean.goodsAmount = that.data.totalPrice
    bean.googitem = []
    goodObj.price = that.data.Goods.price
    goodObj.name = that.data.Goods.name
    goodObj.num = that.data.pic*1
    goodObj.cart = 0
    goodObj.goodsId = that.data.Goods.goodsId
    goodObj.catId = that.data.Goods.catId
      goodObj.image = that.data.Goods.thumbnail
    goodObj.goodsAmount = that.data.totalPrice
    goodObj.collagePersons = that.data.collagePersons
    goodObj.productId = that.data.productId
    bean.googitem[0] = goodObj
    // var googitem = that.data.list; 
    bean.province = that.data.province
    bean.city = that.data.addr.city
    bean.addr = that.data.addr.addr
    bean.region = that.data.addr.region
    bean.shipMobile = that.data.addr.mobile
    bean.shipName = that.data.addr.name
    bean.addrId = that.data.addr.addrId
    bean.clickd = that.data.clickd
    bean = JSON.stringify(bean)
    console.log(bean)
    // if (that.data.addr == {}) {
    //   that.data.addr == ""
    // }
    // if (that.data.region == undefined) {
    //   wx.showToast({
    //     title: '请添加地址',
    //   })
    //   return;
    wx.request({
      url: api + '/api/order/save',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        order: bean
      },
      success: function (res) {
        wx.hideLoading()
        var parms = {}
        that.setData({
          order:res.data.order
        })
        parms.orderid = res.data.order.orderId
        parms.sn = that.data.order.sn
        parms.total_fee = that.data.totalPrice*100
        wx.login({
          success: function (res) {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: api + "/api/pay/prepay",
                data: {
                  code: res.code,
                  parms: parms,
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
                      var orderparams = {}
                      orderparams.goodsId = that.data.goodsId
                      orderparams.price = that.data.price
                      orderparams.sn = that.data.order.sn
                      orderparams.amounts = that.data.totalPrice * 100
                      orderparams.amount = that.data.totalPrice
                      orderparams.memberId = that.data.memberId
                      orderparams.collagePersons = that.data.collagePersons
                      orderparams.productId = that.data.productId
                      orderparams.num = that.data.pic*1
                      orderparams.orderId = that.data.order.orderId
                      wx.request({
                        url: api + '/api/collage/openCollage',
                        data: {
                          "params": orderparams
                        },
                        header: {
                          'Content-Type': 'application/json'
                        },
                        success: function (res) {
                          var kaituanrest=res.data
                          wx.request({
                            url: api + "/api/order/collagepayreturn",
                            data: {
                              parms: JSON.stringify(orderparams)
                            },
                            method: 'PUT',
                            header: {
                              'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                              if(res.data.code==0){
                                wx.showToast({
                                  title: '开团成功',
                                  icon: 'success',
                                  duration: 2000
                                })
                                var parmss = {}
                                parmss.price = kaituanrest.price
                                parmss.activityPrice = kaituanrest.activityPrice
                                parmss.goodsId = kaituanrest.goodsId
                                parmss.goodsName = kaituanrest.goodsName
                                parmss.memberCollageId = kaituanrest.memberCollageId
                                parmss.img = kaituanrest.img
                                parmss.shortPerson = kaituanrest.shortPerson
                                if (kaituanrest.shortPerson == 0) {
                                  parmss.iscollage = 1
                                }
                                else {
                                  parmss.iscollage = 2
                                }
                                parmss = JSON.stringify(parmss)
                                wx.navigateTo({
                                  url: '../cantuan/cantuan?shops= ' + parmss,
                                })

                              }
                            }
                          })
                        
                        }
                      });
                    },
                    fail: function (res) {
                      // fail   
                      wx.showToast({
                        title: '支付失败',
                        icon: 'success',
                        duration: 2000
                      })

                    },
                    complete: function () {
                      // complete   
                      console.log("pay complete")
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

            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        });
      }
    })
    }
  },
  addr:function(){
    wx.getStorage({
      key: 'infofrominput',
      success: function (res) {
        _this.setData({
          infofromstorage: res.data,
        })
      }
    })
  },
  onShareAppMessage: function () {
    withShareTicket: true
  },
  //开关
  tapSwitch: function (event) {
    var index = event.currentTarget.id - 1;
    this.data.switchData[index].isOn = !this.data.switchData[index].isOn
    this.setData({
      switchData: this.data.switchData
    });
  },


  // 运费计算

// 优惠跳转js
  // youhui: function (e) {
  //   wx.navigateTo({
  //     url: '../youhuijuan/youhuijuan',
  //     success: function (res) {
  //       // success
  //     },
  //     fail: function () {
  //       // fail
  //     },
  //     complete: function () {
  //       // complete
  //     }
  //   })
  // },
  //地址管理跳转
  admin: function (e) {
    var that = this
    wx.setStorageSync('price', that.data.price);
    wx.setStorageSync('pic', that.data.pic);
    wx.setStorageSync('goodsId', that.data.goodsId);
    wx.setStorageSync('collagePersons', that.data.collagePersons);
    wx.setStorageSync('memberCollageId', that.data.memberCollageId);
    wx.setStorageSync('limitId', that.data.limitId);
    wx.setStorageSync('Type', that.data.Type);
    wx.setStorageSync('finalAmount', that.data.finalAmount);
    wx.setStorageSync('cutId', that.data.cutId);
    wx.navigateTo({
      url: '../myaddressP/myaddressP',
    })
  }

})