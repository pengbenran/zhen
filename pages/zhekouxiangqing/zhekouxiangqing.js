 var apimg = getApp().globalData.apimg;
// pages/group/group.js
const util = require('../../utils/util.js')
var WxParse = require('/../../wxParse/wxParse.js');
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
var twoList = {}
Page({
  data: {
    item: {
      voteTitle: null,

      maxtime: "",
      isHiddenLoading: true,
      isHiddenToast: true,
      dataList: {},
      countDownDay: 0,
      countDownHour: 0,
      countDownMinute: 0,
      countDownSecond: 0,   


    },
    shaimg: apimg + "/image/group/5.png",
    postsimg: apimg + "/image/souc.png",
    // elesimg:apimg+"/image/group/10.png",
    elesimg: "/image/xin.png",
    sboximg: apimg + "/image/group/9.png",
    gimg: apimg + "/image/group/6.png",
    specimg: apimg + "/image/shouye/8.png",
    coming: apimg + "/images/guige/zu01.png",
    chaimg: apimg + "/images/guige/xx.png",
    xximg: apimg + "/images/guige/xx.png",
    lineimg: apimg + "/image/group/04.jpg",
    homeimg: apimg + "/image/group/17.png",
    weappimg: apimg + "/image/group/8.png",
    cartimg: apimg + "/image/group/7.png",
    name: "",
    image: "",
    posts: false,
    modemoney: "0.00",
    goodid: "",
    catId: "",
    pic: 1,
    hidden: false,
    indicatorDots: true,  //显示面板指示点
    autoplay: true,     //自动切换
    interval: 5000,    //自动切换时间间隔
    duration: 1000,    //滑动动画时长
    imgUrls: [
      apimg + "/image/group/zu04.png",
      apimg + "/image/group/zu04.png",
      apimg + "/image/group/zu04.png"
    ],
    //正品保证数据,
     "distanceimg": [apimg + "/image/group/05.png"],
  },


  //点击修改规格背景颜色
  // changColor: function (options) {
  //   var that = this
  //   var goodsId = that.data.goodid
  //   var current2 = options.currentTarget.dataset.id;
  //   var text2 = options.currentTarget.dataset.text
  //   var current1 = that.data.current
  //   var parms = {}
  //   parms.goodsId = goodsId
  //   parms.current1 = current1
  //   parms.current2 = current2
  //   this.setData({
  //     // key: e.target.dataset.id
  //     'currentItem': current2,
  //     'text2': text2

  //   })
  //   if (current2 == undefined || current1 == undefined) {
  //     return
  //   } else {
  //     wx.request({
  //       url: api + '/api/Goods/getProduct',
  //       data: {
  //         "parms": parms
  //       },
  //       header: {
  //         'Content-Type': 'json'
  //       },
  //       success: function (aa) {
  //         that.setData({
  //           productId: aa.data.product.productId,
  //           enableStore: aa.data.product.enableStore
  //         })
  //       }
  //     })
  //   }
  // },

  //点击修改规格背景颜色
  // chang: function (options) {
  //   var that = this
  //   var goodsId = that.data.goodid
  //   var current1 = options.currentTarget.dataset.id;
  //   var text1 = options.currentTarget.dataset.text
  //   var current2 = that.data.currentItem
  //   var parms = {}
  //   parms.goodsId = goodsId
  //   parms.current1 = current1
  //   parms.current2 = current2
  //   this.setData({
  //     // key: e.target.dataset.id
  //     'current': current1,
  //     'text1': text1

  //   })
  //   if (current2 == undefined || current1 == undefined) {

  //     return

  //   } else {
  //     wx.request({
  //       url: api + '/api/Goods/getProduct',
  //       data: {
  //         "parms": parms
  //       },
  //       header: {
  //         'Content-Type': 'json'
  //       },
  //       success: function (aa) {
  //         that.setData({
  //           productId: aa.data.product.productId,
  //           enableStore: aa.data.product.enableStore

  //         })
  //       }
  //     })
  //   }
  // },

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
    this.onLoad();
  },

  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ImageWidth: res.screenWidth + 'px',
          ImageHeight: res.screenWidth * 9 / 16 + 'px',
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    var xianshidetail = JSON.parse(options.xianshidetail)
    that.setData({
      xianshidetail: xianshidetail
    })
        var timestamp2 = (new Date()).valueOf();
        var leftTime = that.data.xianshidetail.endtime - timestamp2;
        if (leftTime >= 0) {
          var interval = setInterval(function () {
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            leftTime = leftTime - 1000;
            that.setData({
              countDownDay: days,
              countDownHour: hours,
              countDownMinute: minutes,
              countDownSecond: seconds,
            });
          }, 1000)
          if (leftTime <= 0) {
            clearinterval(interval)
          }
        }




    var parms = {}
    parms.goodsId = that.data.xianshidetail.goodsId
    wx.request({
      url: api + '/api/Goods/getGoods',
      // url: 'http://192.168.2.144/api/index/getGoods/166993'
      data: {
        "parms": parms
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        wx.hideLoading()
        var article = res.data.Goods.intro;
        var percount = res.data.percount
        var point = res.data.Goods.point
        WxParse.wxParse('article', 'html', article, that, 25);
        var haveSpec = res.data.Goods.haveSpec
        that.setData({
          Gallery: res.data.Gallery,
          Gooddetatil: res.data.Goods,
          tags: res.data.tags
        })
      
      },
    })

  },

  // 页面渲染完成后 调用  

  getChecked: function (e) {
    var self = this,
      haveCheckedProp = "",
      name = e.currentTarget.dataset.property,
      value = e.currentTarget.dataset.value,
      length, objLength;
    self.postData[name] = value;
    length = self.data.item.property.length;
    objLength = common.objLength(self.postData);
    for (var key in self.postData) {
      haveCheckedProp += " " + self.postData[key];
    }
    if (length == objLength) {
      self.setData({
        getCount: true,
      });
    }
    this.setData({
      postData: self.postData,
      haveCheckedProp: haveCheckedProp
    })
  },

  // 获取输入框的值
  voteTitle: function (e) {
    this.data.voteTitle = e.detail.value;
  },

  //下一步模态框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //立即购买模态框
  sModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      sModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        sModalStatus: false
      })
    }.bind(this), 200)
  },

  //下拉刷新
  onPullDownRefresh() {
    // wx.showNavigationBarLoading() 
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    this.onLoad();
  },
  //主页跳转
  zhuye: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  //主页跳转
  gochart: function (e) {
    wx.switchTab({
      url: '../cart/cart'
    })
  },
  onShareAppMessage: function () {


    withShareTicket: true

  },
  //规格下一步跳转
  next: function () {
    var that=this;
    console.log(that.data.xianshidetail)
    if(that.data.xianshidetail.perTotal==0){
  wx.navigateTo({
        url: "../dingdan2/dingdan2?pic=" + that.data.pic + '&goodsId=' + that.data.xianshidetail.goodsId + '&price=' + that.data.xianshidetail.finalAmount + '&limitId=' + that.data.xianshidetail.limitId + '&Type=Z',
      })
    }
    else{
      if (that.data.pic > that.data.xianshidetail.perTotal) {
        wx.showToast({
          title: '限购数量为' + that.data.xianshidetail.perTotal,
        })
      } else {
      wx.navigateTo({
            url: "../dingdan2/dingdan2?pic=" + that.data.pic + '&goodsId=' + that.data.xianshidetail.goodsId + '&price=' + that.data.xianshidetail.finalAmount + '&limitId=' + that.data.xianshidetail.limitId + '&Type=Z',
          })
      }
    }
    
   


    // try {
    //   var indexdata = wx.getStorageSync('indexdata')
    //   if (indexdata) {
    //     indexdata: indexdata
    //   }
    // } catch (e) {
    // }
    // var that = this
    // var aa = {};
    // var goodsList = that.data.xianshidetail
    // var gooditem = [];
    // var Goods = {};
    // var point = that.data.point
    // var text2 = that.data.text2
    // var text1 = that.data.text1
    // var perTotal = that.data.perTotal
    // var percount = that.data.percount
    // var current2 = that.data.currentItem
    // var weight = this.data.weight
    // var current1 = that.data.current
    // var haveSpec = that.data.haveSpec
    // var enableStore = that.data.enableStore
    // var num = this.data.pic
    // var productId = that.data.productId
    // var goodsAmount = goodsList.finalAmount * that.data.pic
    // var shippingAmount = this.data.modemoney
    // if (weight - indexdata.freeWeight <= 0) {
    //   shippingAmount = indexdata.freight;
    //   var orderAmount = goodsAmount + shippingAmount
    //   this.setData({
    //     shippingAmount: shippingAmount,
    //     orderAmount: orderAmount
    //   })
    // }
    // if (weight - indexdata.freeWeight > 0) {
    //   shippingAmount = indexdata.freight + Math.ceil((weight - indexdata.freeWeight) / indexdata.perFee) * indexdata.perFreight
    //   var orderAmount = (goodsAmount + shippingAmount)
    //   this.setData({
    //     shippingAmount: shippingAmount,
    //     orderAmount: orderAmount,
    //   })
    // }
    
    // try {
    //   var memberId = wx.getStorageSync('memberId')
    //   if (memberId) {
    //     memberId: memberId
    //   }
    // } catch (e) {
    // }

    // if (perTotal != 0){
    //   if (percount == perTotal){
    //     wx.showModal({
    //       title: '提示',
    //       content: '你已达到限购量',
    //       success: function (res) {
    //         if (res.confirm) {
    //           wx.switchTab({
    //             url: '../my/my',
    //           })

    //           return;
    //         } else if (res.cancel) {

    //           return;
    //         }
    //       }
    //     })
    //   } 
    //   if (num > (perTotal - percount)){
    //     wx.showModal({
    //       title: '提示',
    //       content: '你已超出你的限购量',
    //       success: function (res) {
    //         if (res.confirm) {
    //           return;
    //         } else if (res.cancel) {

    //           return;
    //         }
    //       }
    //     })
    //     return;
    //   }
    //   if (memberId == "") {
    //     wx.showModal({
    //       title: '提示',
    //       content: '你还未登陆，是否登陆',
    //       success: function (res) {
    //         if (res.confirm) {

    //           return;
    //         } else if (res.cancel) {

    //           return;
    //         }
    //       }
    //     })
    //   } else {
    //     if (haveSpec == 1) {
    //       var specvalue = text1 + text2;
    //       Goods.memberId = memberId,
    //         Goods.image = this.data.image,
    //         aa.price = goodsList.finalAmount,
    //         aa.name = this.data.name,
    //         aa.num = this.data.pic,
    //         aa.cart = 0
    //       aa.goodsId = this.data.goodid,
    //         aa.catId = this.data.catId,
    //         aa.image = this.data.image,
    //         aa.goodsAmount = goodsAmount
    //       aa.specvalue = specvalue
    //       aa.productId = productId
    //       Goods.shippingAmount = this.data.shippingAmount
    //       Goods.orderAmount = this.data.orderAmount
    //       Goods.weight = weight
    //       gooditem.push(aa)
    //       Goods.limitId = this.data.limitId
    //       Goods.point = point
    //       Goods.googitem = gooditem,
    //         Goods.goodsAmount = goodsAmount

    //     } else {
    //       Goods.memberId = memberId,
    //         Goods.image = this.data.image,
    //         Goods.point = point
    //         aa.price = goodsList.finalAmount,
    //         aa.name = this.data.name,
    //         aa.num = this.data.pic,
    //         aa.cart = 0
    //       aa.goodsId = this.data.goodid,
    //         aa.catId = this.data.catId,
    //         aa.image = this.data.image,
    //         aa.productId = productId
    //       aa.specvalue = specvalue
    //       aa.goodsAmount = goodsAmount
    //       aa.orderAmount = this.data.orderAmount
    //       Goods.shippingAmount = this.data.modemoney
    //       gooditem.push(aa)
    //       Goods.googitem = gooditem,
    //         Goods.goodsAmount = goodsAmount
    //       Goods.limitId = this.data.limitId
    //       Goods.weight = weight
    //       Goods.orderAmount = orderAmount
    //     }
    //     var gooditemString = JSON.stringify(Goods);
    //     if (enableStore == 0) {
    //       wx.showToast({
    //         title: "商品没货了！",
    //         icon: "success",
    //         durantion: 2000
    //       })
    //       return
    //     }

    //     if (haveSpec == 1) {
    //       if (current2 == undefined || current1 == undefined) {
    //         wx.showToast({
    //           title: "请选择规格",
    //           icon: "success",
    //           durantion: 2000
    //         })

    //         return

    //       } else {
    //         wx.navigateTo({
    //           url: "../dingdan/dingdan?gooditem=" + gooditemString,
    //           success: function (res) {

    //           },
    //           fail: function () {
    //             // fail
    //           },
    //           complete: function () {
    //             // complete
    //           }
    //         })
    //       }
    //     } else {
    //       wx.navigateTo({
    //         url: "../dingdan/dingdan?gooditem=" + gooditemString,
    //         success: function (res) {

    //         },
    //         fail: function () {


    //           // fail
    //         },
    //         complete: function () {
    //           // complete
    //         }
    //       })

    //     }
    //   }
      
    // }

    // if (perTotal == 0){
    //     if (memberId == "") {
    //       wx.showModal({
    //         title: '提示',
    //         content: '你还未登陆，是否登陆',
    //         success: function (res) {
    //           if (res.confirm) {
    //             wx.switchTab({
    //               url: '../my/my',
    //             })

    //             return;
    //           } else if (res.cancel) {

    //             return;
    //           }
    //         }
    //       })
    //     } else {
    //       if (haveSpec == 1) {
    //         var specvalue = text1 + text2;
    //         Goods.memberId = memberId,
    //           Goods.image = this.data.image,
    //           Goods.point = point
    //           aa.price = goodsList.finalAmount,
    //           aa.name = this.data.name,
    //           aa.num = this.data.pic,
    //           aa.cart = 0
    //         aa.goodsId = this.data.goodid,
    //           aa.catId = this.data.catId,
    //           aa.image = this.data.image,
    //           aa.goodsAmount = goodsAmount
    //         aa.specvalue = specvalue
    //         aa.productId = productId
    //         Goods.shippingAmount = this.data.shippingAmount
    //         Goods.orderAmount = this.data.orderAmount
    //         Goods.weight = weight
    //         gooditem.push(aa)
    //         Goods.limitId = this.data.limitId
    //         Goods.googitem = gooditem,
    //           Goods.goodsAmount = goodsAmount

    //       } else {
    //         Goods.memberId = memberId,
    //           Goods.point = point
    //           Goods.image = this.data.image,
    //           aa.price = goodsList.finalAmount,
    //           aa.name = this.data.name,
    //           aa.num = this.data.pic,
    //           aa.cart = 0
    //         aa.goodsId = this.data.goodid,
    //           aa.catId = this.data.catId,
    //           aa.image = this.data.image,
    //           aa.productId = productId
    //         aa.specvalue = specvalue
    //         aa.goodsAmount = goodsAmount
    //         aa.orderAmount = this.data.orderAmount
    //         Goods.shippingAmount = this.data.modemoney
    //         gooditem.push(aa)
    //         Goods.googitem = gooditem,
    //           Goods.goodsAmount = goodsAmount
    //         Goods.limitId = this.data.limitId
    //         Goods.weight = weight
    //         Goods.orderAmount = orderAmount
    //       }
    //       var gooditemString = JSON.stringify(Goods);
    //       if (enableStore == 0) {
    //         wx.showToast({
    //           title: "商品没货了！",
    //           icon: "success",
    //           durantion: 2000
    //         })
    //         return
    //       }

    //       if (haveSpec == 1) {
    //         if (current2 == undefined || current1 == undefined) {
    //           wx.showToast({
    //             title: "请选择规格",
    //             icon: "success",
    //             durantion: 2000
    //           })

    //           return

    //         } else {
    //           wx.navigateTo({
    //             url: "../dingdan/dingdan?gooditem=" + gooditemString,
    //             success: function (res) {

    //             },
    //             fail: function () {
    //               // fail
    //             },
    //             complete: function () {
    //               // complete
    //             }
    //           })
    //         }
    //       } else {
    //         wx.navigateTo({
    //           url: "../dingdan/dingdan?gooditem=" + gooditemString,
    //           success: function (res) {

    //           },
    //           fail: function () {


    //             // fail
    //           },
    //           complete: function () {
    //             // complete
    //           }
    //         })

    //       }
    //     }
    // }
  },
  /**
       * 绑定加数量事件
       */
  addCount(e) {
    let pic = this.data.pic;
    pic = pic + 1;
    this.data.pic = pic;
    this.setData({
      pic: pic
    });
  },
  /**
     * 绑定减数量事件
     */
  minusCount(e) {
    let pic = this.data.pic;
    if (pic <= 1) {
      return false;
    }
    pic = pic - 1;
    this.data.pic = pic;
    this.setData({
      pic: pic
    });
  },



})
