var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
const util = require('../../utils/util.js')
const request = require('../../utils/request.js')
var pay = ""
var OrderId = ""
var bean = ""

Page({
  data: {
    select: false,
    isAddr: true,
    payimg: apimg + "/images/quzhifu/dizhi.png",
    imgpay: apimg + "/images/quzhifu/ren.png",
    head: apimg + "/images/quzhifu/biankuang.png",
    yes: apimg + "/images/quzhifu/shang.png",
    ind: apimg + "/images/quzhifu/8.png",
    bao: [apimg + "/images/quzhifu/bao.png"],
    coreimg: apimg + "/images/quzhifu/8.png",
    memberAddressDO: "",
    ordername:''
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
      if (that.data.goodsAmount - that.data.point_price <= 0) {
        that.setData({
          orderAmount: 0.01
        })
      } else {
        that.setData({
          orderAmount: that.data.orderAmount - that.data.point_price
        })
      }
    } else {
      select= false
      that.setData({
        select: false,
        orderAmount: that.data.goodsAmount
      })
    }
  },


  onLoad: function (options) {
    var that=this
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
        }
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    var point = wx.getStorageSync('point')
    var indexdata = wx.getStorageSync('indexdata')
    var point_price = Number(point / indexdata.pointCash).toFixed(2)
    // 判断是否是从购物车结算
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
    // 判断是否使用了优惠劵
   if(options.pars!=undefined){
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
      let parms={}
      addParms.memberId = that.data.memberId
      parms.parms = addParms
      request.moregets('/api/address/defutaddress', parms).then(function (res) {
        if (res.code == 1) {
          that.setData({
            isAddr: false
          })
        }
        else {
          that.setData({
            addr: res.memberAddressDO
          })
        }
      })
    }
    else {
      that.setData({
        addr: wx.getStorageSync('addr')
      })
    }
    // 根据是否是购物车提交
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
      console.log(that.data.gooditem)  
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
        let goodparms = {}
        let parms={}
        goodparms.goodsId = that.data.goodlist[0].goodsId
        parms.parms=goodparms
        request.moregets('/api/Goods/getGoods', parms).then(function (res) {
          res.Goods.num = that.data.goodlist[0].pic
          res.Goods.image = res.Goods.thumbnail
          res.Goods.price = that.data.goodlist[0].price
          goodArr.push(res.Goods)
          let ordermount = Number(that.data.goodlist[0].pic * res.Goods.price - that.data.facevalue - that.data.redamount).toFixed(2)
          if (ordermount <= 0) {
            ordermount = 0.01
          }
          that.setData({
            list: goodArr,
            goodsAmount: Number(that.data.goodlist[0].pic * res.Goods.price).toFixed(2),
            orderAmount: ordermount
          })
          wx.hideLoading()
        })
      }
  },
  clickd: function (e) {
    this.setData({
      clickd: e.detail.value
    })
  }, 
  saveOrder: function (orderParms){
    var that=this
    console.log(that.data.list[0])
    request.morepost('/api/order/save', orderParms).then(function (res) {
      wx.hideLoading()
      if (res.code == 0) {
        wx.showToast({
          title: '订单提交成功',
          icon: 'success',
          duration: 2000
        })
        var parms = {}
        that.setData({
          order: res.order
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

            }
          })
        }
        else if (that.data.pars == 2) {
          wx.request({
            url: api + '/api/redPacket/RedusedState',
            data: {
              memberRedpacketId: that.data.memberredpacketid
            },
            header: {
              'Content-Type': 'json'
            },
            success: function (res) {

            }
          })
        }
        var orderId = res.orderId
        var ordername = ''
        for (var i = 0; i < res.order.item.length; i++) {
          if (res.order.item.length == 1) {
            ordername = res.order.item[i].name
          }
          else {
            ordername = res.order.item[i].name + '...'
          }
        }
        that.setData({
          ordername: ordername
        })
        var payorderamount = res.order.orderAmount
        var payordertime = util.formatTime(new Date(res.order.createTime))
        parms.orderid = orderId
        parms.sn = that.data.order.sn
        parms.total_fee = payorderamount * 100
        let payorderParm = {}
        payorderParm.code = that.data.code;
        payorderParm.parms = parms;
        return request.moregets('/api/pay/prepay', payorderParm)
      }
    }).then(function (res) {
      var pay = res
      wx.requestPayment({
        timeStamp: pay.timeStamp,
        nonceStr: pay.nonceStr,
        package: pay.package,
        signType: pay.signType,
        paySign: pay.paySign,
        success: function (res) {
          // 消息推送
          util.sendMsg(pay.package, that.data.order.orderId, util.formatTime(new Date(that.data.order.createTime)), that.data.ordername, that.data.order.orderAmount)
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          let orderparms = {}
          let order = {}
          let parms = {}
          order.orderId = that.data.order.orderId
          orderparms.order = order
          orderparms.code = 200
          orderparms.gainedpoint = Number(that.data.order.gainedpoint)
          orderparms.paymoney = that.data.order.orderAmount
          parms.parms = JSON.stringify(orderparms)
          request.moreput('/api/order/passOrder', parms).then(function (res) {
            if (res.code == 0) {
              if (wx.getStorageSync('isAgent') != null) {
                let fenrunParm = {}
                let params = {}
                fenrunParm.memberId = that.data.memberId
                fenrunParm.distribeId = wx.getStorageSync('isAgent')
                fenrunParm.monetary = that.data.order.orderAmount
                if (that.data.cart == 1){
                  fenrunParm.shareMoney=that.data.weight  
                  params.params = JSON.stringify(fenrunParm)
                  return request.morepost('/api/distribe/shareProfit', params)      
                }
               else{
                  fenrunParm.shareMoney = that.data.goodlist[0].shareMoney * that.data.goodlist[0].pic
                  params.params = JSON.stringify(fenrunParm)
                  return request.morepost('/api/distribe/shareProfit', params)
               }               
              }else{
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
          }).then(function (res) {
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
          })
        }
      })
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
      let bean = {}
      let goodObj = {}
      let orderParms = {}
      wx.showLoading({
        title: '请稍等',
      })
      // 判断是否使用积分抵扣
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

      if (that.data.cart==0){
      //  判断是否使用积分   
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
        orderParms.order=bean
        that.saveOrder(orderParms)
      }
      else{
        // 购物车提交订单
        bean.weight = that.data.weight
        bean.gainedpoint = that.data.gainedpoint
        bean.memberId = that.data.memberId
        bean.goodsAmount = that.data.goodsAmount
        bean.shippingAmount = 0
        bean.googitem = that.data.list
        bean = JSON.stringify(bean)
        orderParms.order = bean
        that.saveOrder(orderParms)
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