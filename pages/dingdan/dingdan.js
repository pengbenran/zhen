var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
const util = require('../../utils/util.js')
var pay = ""
var OrderId = ""
var bean = ""

Page({
  data: {
    select: false,
    isAddr: true,
    "payimg": [apimg + "/images/quzhifu/dizhi.png"],
    imgpay: apimg + "/images/quzhifu/ren.png",
    head: apimg + "/images/quzhifu/biankuang.png",
    myaddress: "1",
    "dizhi": ["湖南省长沙市天心区时代公寓A座1111公寓A座1111"],

    "yes": [apimg + "/images/quzhifu/shang.png"],
    "ind": [apimg + "/images/quzhifu/8.png"],
    "h1": ["手机专卖商城"],
    "chater": ["vivo X20双摄头智能大屏手机前置2000万像素"],
    "numbtext": ["红色/4G+128GB"],
    "price": ["998.00"],
    "bao": [apimg + "/images/quzhifu/bao.png"],
    "baotext": ["正平保障"],
    "text": ["配送方式"],
    "text2": ["普通快递￥0.00"],
    "price": ["998.00"],
    "waytext": ["可用积分812积分抵用8.12元"],
    "youhui": ["优惠"],
    "nothave": ["暂无可用"],
    "coreimg": [apimg + "/images/quzhifu/8.png"],
    "waymoney": ["998.00"],
    "modemoney": ["0.00"],
    "total": ["6800.00"],
    "tijiao": ["提交订单"],
    memberAddressDO: "",

    switchData: [
      {
        id: 1,
        color: '#26b4fe',
        isOn: false
      }
    ],
    //   gooditem:gooditem
  },

  select: function (e) {
    var that = this
    var defAddr = e.target.id
    var select = that.data.select
    if (defAddr == "false" || defAddr =="") {
      select= true
      that.setData({
        select : true
      })
    } else {
      select= false
      that.setData({
        select: false
      })
    }
  },


  onLoad: function (options) {
    var that=this
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    var point = wx.getStorageSync('point')
    var indexdata = wx.getStorageSync('indexdata')
    var point_price = Number(point / indexdata.pointCash).toFixed(2)
    if (options.cart==undefined){
      that.setData({
        cart: wx.getStorageSync('cart')
      })  
    }
    else{
      that.setData({
       cart: options.cart       
      }) 
    }
   if(options.pars!=undefined){
    //  说明用了优惠劵
     if (options.pars==1){
       that.setData({
         pars: options.pars,
         memberVoucherId: options.memberVoucherId,
         facevalue: options.facevalue,
         select: wx.getStorageSync('select'),
         redamount: 0,
       })
     }
     else if(options.pars==2){
       console.log(options.redamount)
       that.setData({
         pars: options.pars,
         memberredpacketid: options.memberredpacketid,
         redamount: options.redamount*1,
         select: wx.getStorageSync('select'),
         facevalue: 0,
       })
     } 
   }
   else{
     that.setData({
       pars: 0,
       memberVoucherId: 0,
       facevalue: 0,
       redamount:0,
       memberredpacketid:0,
     })
   }
    if (that.data.pars == 1 && options.pars == undefined){
     that.setData({
       facevalue: wx.getStorageSync('facevalue'),
       memberVoucherId: wx.getStorageSync('memberVoucherId') 
     })
   }
    else if (that.data.pars == 2 && options.pars == undefined){
      that.setData({
        redamount: wx.getStorageSync('redamount'),
        memberredpacketid: wx.getStorageSync('memberredpacketid') 
      })
   }
    that.setData({
      memberId: wx.getStorageSync('memberId'),
      indexdata: indexdata,
      point: point,
      point_price: point_price,
    })
    // 加载地址
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
    if(that.data.cart==1){
      wx.hideLoading()
      if (options.gooditem==undefined){
        var gooditem = wx.getStorageSync('gooditem');
        that.setData({
          gooditem: wx.getStorageSync('gooditem'),
          select: wx.getStorageSync('select')
        })
      }
      else{
        var gooditem = JSON.parse(options.gooditem);
        that.setData({
          gooditem: gooditem
        })    
      }  
      var orderamount = Number(gooditem.goodsAmount - that.data.facevalue - that.data.redamount).toFixed(2)
      if (orderamount <= 0) {
        orderamount = 0.01
      }
      that.setData({
        goodsAmount: Number(gooditem.goodsAmount).toFixed(2),
        list:gooditem.googitem,
        weight: gooditem.weight,
        orderAmount: orderamount,
        gainedpoint: gooditem.gainedpoint
      })
      
    }
    else{
      if (options.goodlist == undefined) {
        var goodlist = wx.getStorageSync('goodlist');
        that.setData({
          goodlist: wx.getStorageSync('goodlist'),
          select: wx.getStorageSync('select')
        })
      }
      else {
        var goodlist = JSON.parse(options.goodlist);
        that.setData({
          goodlist: goodlist
        })
      }
        var goodArr = [];
        var goodparms = {}
        goodparms.goodsId = that.data.goodlist[0].goodsId
        wx.request({
          url: api + '/api/Goods/getGoods',
          // url: 'http://192.168.2.144/api/index/getGoods/166993'
          data: {
            parms: goodparms
          },
          header: {
            'Content-Type': 'json'
          },
          success: function (res) {
            res.data.Goods.num = that.data.goodlist[0].pic
            res.data.Goods.image = res.data.Goods.thumbnail
            goodArr.push(res.data.Goods) 
            let ordermount = Number(that.data.goodlist[0].pic * res.data.Goods.price - that.data.facevalue - that.data.redamount).toFixed(2)
            if(ordermount<=0){
              ordermount=0.01
            }
            that.setData({
              list: goodArr,
              goodsAmount:  Number(that.data.goodlist[0].pic * res.data.Goods.price).toFixed(2),
              orderAmount: ordermount
            })
       console.log(that.data.list)
            wx.hideLoading()
          }
        })
      }
  },
  clickd: function (e) {
    this.setData({
      clickd: e.detail.value
    })
  }, 
  toast: function () {
    var that = this
    if (that.data.addr == undefined) {
      wx.showToast({
        title: '请添加地址',
      })
    }
    else {
      if (that.data.cart==0){
      var bean = {}
      var goodObj = {}
      wx.showLoading({
        title: '请稍等',
      })
      //  判断是否使用积分
      if(that.data.select==true){
        if (that.data.goodsAmount - that.data.point_price<=0){
          bean.orderAmount =0.01
          bean.consumepoint = parseInt((that.data.goodsAmount-0.01)*indexdata.pointCash)
        }else{
          bean.orderAmount = that.data.orderAmount - that.data.point_price
          bean.consumepoint = that.data.point
        }      
      }
      else{
        bean.orderAmount = that.data.orderAmount 
        bean.consumepoint =0
        }
        bean.memberId = that.data.memberId
        bean.image = that.data.list[0].image
        bean.weight = that.data.list[0].weight * that.data.list[0].num
        bean.shippingAmount = 0
        bean.googitem = []
        goodObj.price = that.data.list[0].price
        goodObj.name = that.data.list[0].name
        goodObj.num = that.data.list[0].num * 1
        goodObj.cart = that.data.cart
        goodObj.goodsId = that.data.list[0].goodsId
        goodObj.catId = that.data.list[0].catId
        goodObj.image = that.data.list[0].image
        goodObj.goodsAmount = that.data.list[0].price * that.data.list[0].num
        goodObj.productId = that.data.goodlist[0].productId
        bean.googitem[0] = goodObj
        bean.point = that.data.point
        bean.gainedpoint = that.data.list[0].point
        bean.province = that.data.addr.province
        bean.city = that.data.addr.city
        bean.addr = that.data.addr.addr
        bean.region = that.data.addr.region
        bean.shipMobile = that.data.addr.mobile
        bean.shipName = that.data.addr.name
        bean.addrId = that.data.addr.addrId
        bean.clickd = that.data.clickd
        bean.goodsAmount = that.data.list[0].price * that.data.list[0].num
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
          if(res.data.code==0){
            wx.showToast({
              title: '订单提交成功',
              icon: 'success',
              duration: 2000
            })
            var parms = {}
            that.setData({
              order: res.data.order
            })
            if(that.data.pars==1){
              wx.request({
                url: api + '/api/vocher/usedState',
                data: {
                  memberVoucherId:that.data.memberVoucherId
                },
                header: {
                  'Content-Type': 'json'
                },
                success: function (res) {
                 console.log(res.data)
                }
              })
            }
            else if(that.data.pars==2){
              wx.request({
                url: api + '/api/redPacket/RedusedState',
                data: {
                  memberRedpacketId: that.data.memberredpacketid
                },
                header: {
                  'Content-Type': 'json'
                },
                success: function (res) {
                  console.log(res.data)
                }
              })
            }
            var orderId = res.data.order.orderId
            var ordername =''
            for(var i=0;i<res.data.order.item.length;i++){
              if(res.data.order.item.length==1){
                ordername = res.data.order.item[i].name 
              }
              else{
                ordername = res.data.order.item[i].name + '...'
              }
            }
            var payorderamount = res.data.order.orderAmount
            var payordertime = util.formatTime(new Date(res.data.order.createTime))
            parms.orderid = orderId
            parms.sn=that.data.order.sn
            parms.total_fee = payorderamount* 100
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
                          // 消息推送
                          util.sendMsg(pay.package, orderId, payordertime, ordername, that.data.order.orderAmount)
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                          })
                          var orderparms = {}
                          var order={}
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
                                if(res.data.code==0){
                                 
                                  if (wx.getStorageSync('isAgent')!=null){
                                    let fenrunParm = {}
                                    fenrunParm.memberId = that.data.memberId
                                    fenrunParm.distribeId = wx.getStorageSync('isAgent')
                                    fenrunParm.monetary = that.data.order.orderAmount
                                    fenrunParm.shareMoney = that.data.list[0].fenrunAmount
                                    wx.request({
                                      url: api + "/api/distribe/shareProfit",
                                      method: "POST",
                                      data: {
                                        params: JSON.stringify(fenrunParm)
                                      },
                                      header: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                      },
                                      method: "POST",
                                      success: function (res) {
                                        console.log(res.data)
                                        if (res.data.code == 0) {

                    
                                        }
                                      }
                                    })
                                  }
                                  wx.showToast({
                                    title: '订单成功',
                                    icon: 'success',
                                    duration: 2000
                                  })
                                  setTimeout(function () {
                                    wx.switchTab({
                                      url: '../index/index',
                                    })
                                  }, 1000)
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
      else{
        // 购物车提交订单
        var bean = {}
        var goodObj = {}
        wx.showLoading({
          title: '请稍等',
        })
        //  判断是否使用积分
        if (that.data.select == true) {
          if (that.data.goodsAmount - that.data.point_price <= 0) {
            bean.orderAmount = 0.01
            bean.consumepoint = parseInt((that.data.goodsAmount - 0.01) * indexdata.pointCash)
          } else {
            bean.orderAmount = that.data.orderAmount - that.data.point_price
            bean.consumepoint = that.data.point
          }
        }
        else {
          bean.orderAmount = that.data.orderAmount
          bean.consumepoint = 0
        }
        bean.weight = that.data.weight
        bean.gainedpoint = that.data.gainedpoint
        bean.memberId = that.data.memberId
        bean.goodsAmount = that.data.goodsAmount
        bean.shippingAmount = 0
        bean.googitem = that.data.list
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
            if (res.data.code == 0) {
              wx.showToast({
                title: '订单提交成功',
                icon: 'success',
                duration: 2000
              })
              var parms = {}
              that.setData({
                order: res.data.order
              })
              if (that.data.pars == 1) {
                wx.request({
                  url: api + '/api/vocher/usedState',
                  data: {
                    memberVoucherId: that.data.memberVoucherId
                  },
                  header: {
                    'Content-Type': 'json'
                  },
                  success: function (res) {
                    console.log(res.data)
                  }
                })
              }
              parms.orderid = res.data.order.orderId
              parms.sn = that.data.order.sn
              parms.total_fee = res.data.order.orderAmount * 100
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
  },
  addr: function () {
    wx.getStorage({
      key: 'infofrominput',
      success: function (res) {
        _this.setData({
          infofromstorage: res.data,
        })
      }
    })
  },
  //开关
  tapSwitch: function (event) {
    var index = event.currentTarget.id - 1;
    this.data.switchData[index].isOn = !this.data.switchData[index].isOn
    this.setData({
      switchData: this.data.switchData
    });
  },
  //地址管理跳转
  admin: function (e) {
    var that=this
    wx.setStorageSync('cart', that.data.cart);
    wx.setStorageSync('gooditem', that.data.gooditem);
    wx.setStorageSync('goodlist', that.data.goodlist);
    wx.setStorageSync('select', that.data.select);
    wx.setStorageSync('orderAmount', that.data.orderAmount);
    wx.setStorageSync('pars', that.data.pars);
    wx.navigateTo({
      url: '../myaddresstwo/myaddresstwo',
    })
  },
  hongbao:function(e){
    var that = this
    wx.setStorageSync('cart', that.data.cart);
    wx.setStorageSync('gooditem', that.data.gooditem);
    wx.setStorageSync('goodlist', that.data.goodlist);
    wx.setStorageSync('select', that.data.select);
    wx.setStorageSync('orderAmount', that.data.orderAmount);
    wx.setStorageSync('pars', that.data.pars);
    wx.setStorageSync('facevalue', that.data.facevalue);
    wx.navigateTo({
      url: '../voucher/voucher?type=1',
    })
  },

  youhui: function (e) {
    var that = this
    wx.setStorageSync('cart', that.data.cart);
    wx.setStorageSync('gooditem', that.data.gooditem);
    wx.setStorageSync('goodlist', that.data.goodlist);
    wx.setStorageSync('select', that.data.select);
    wx.setStorageSync('orderAmount', that.data.orderAmount);
    wx.setStorageSync('pars', that.data.pars);
    wx.setStorageSync('redamount', that.data.redamount);
    var parms = {}
    var goodsIds = []
    console.log(that.data.list)
    for (let i = 0; i < that.data.list.length; i++) {
      goodsIds.push(that.data.list[i].goodsId)
    }
    var goodsAmount = that.data.goodsAmount
    parms.orderAmount = goodsAmount
    parms.goodsIds = goodsIds
    parms = JSON.stringify(parms)
    wx.navigateTo({
      url: '../voucher/voucher?parms=' + parms,
    })
  }

})