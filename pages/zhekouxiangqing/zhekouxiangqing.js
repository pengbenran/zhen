 var apimg = getApp().globalData.apimg;
// pages/group/group.js
const util = require('../../utils/util.js')
var WxParse = require('/../../wxParse/wxParse.js');
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
const request = require('../../utils/request.js')
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
    sboximg: apimg + "/image/group/9.png",
    gimg: apimg + "/image/group/6.png",
    xximg: apimg + "/images/guige/xx.png",
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
    //正品保证数据,
     distanceimg: apimg + "/image/group/05.png",
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
    that.cutTime(that.data.xianshidetail.endtime)
    let goodsParms = {}
    let parms = {}
    goodsParms.goodsId = that.data.xianshidetail.goodsId
    parms.parms = goodsParms;
    request.moregets('/api/Goods/getGoods', parms).then(function (res) {
      wx.hideLoading()
      var article = res.Goods.intro;
      var percount = res.percount
      var point = res.Goods.point
      WxParse.wxParse('article', 'html', article, that, 25);
      var haveSpec = res.Goods.haveSpec
      that.setData({
        Gallery: res.Gallery,
        Gooddetatil: res.Goods,
        tags: res.tags
      })
    })
  },
// 倒计时
cutTime:function(endtime){
  var that=this;
  var timestamp2 = (new Date()).valueOf();
  var leftTime = endtime - timestamp2;
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
},
  // 获取输入框的值
  voteTitle: function (e) {
    this.data.voteTitle = e.detail.value;
  },
  //立即购买模态框
  sModal: function () {
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
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
  },
  //主页跳转
  zhuye: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  //购物车跳转
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
