
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
var WxParse = require('/../../wxParse/wxParse.js');
const request = require('../../utils/request.js')
Page({
  data: {
    disimg: apimg + "/image/group/05.png",
    sbox: apimg + "/image/group/9.png",
    geimg: apimg + "/image/group/6.png",
    comimg: apimg + "/images/guige/zu01.png",
    chaimg: apimg + "/images/guige/xx.png",
    smallimg: apimg + "/image/group/06.png",
    path1: apimg + "/image/group/4.png",
    path2: apimg + "/image/group/2.png",
    path3: apimg + "/image/group/3.png",
    path4: apimg + "/image/group/16.png",
    path5: apimg + "/image/group/012.png",
    close: apimg + "/image/kx.png",
    cutTotal: '',
    percent: "",
    sw: 12,
    pc: '#ff4948',
    pbc: '#cccccc',
    isActive: true,
    isSi: false,//设置进度条百分比显示
    isjoin: false,
    //添加购物车提示
    cutGood: {},
    //end
    cutId: '',
    windowHeight: 654,
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownDay: '',
    countDownHour: '',
    countDownMinute: '',
    countDownSecond: '',
    iscutOk: false,
    hidden: false,
    indicatorDots: true,  //显示面板指示点
    autoplay: true,     //自动切换
    interval: 5000,    //自动切换时间间隔
    duration: 1000,    //滑动动画时长
    minprice:'',
    price: '',
    yun: '',
    contit: [],
    shaimg: apimg + "/image/group/5.png",
    collimg: apimg + "/image/group/10.png",
  },
  //事件处理函数 
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
    if (options == undefined) {
      that.setData({
        cutId: wx.getStorageSync('cutId'),
        goodsId: wx.getStorageSync('goodsId')
      })
    } else {
      var good = JSON.parse(options.good)
      that.setData({
        cutId: good.cutId,
        goodsId: good.goodsId
      })
    }

    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        that.setData({
          memberId: memberId
        })
      }
    } catch (e) {
    }


    let goodsParms = {}
    let parms = {}
    goodsParms.goodsId = that.data.goodsId
    goodsParms.memberId = that.data.memberId
    parms.parms = goodsParms;
    // 获取商品数据
    request.moregets('/api/Goods/getGoods', parms).then(function (res) {
      wx.hideLoading()
      that.setData({
        Gallery: res.Gallery,
        article: res.Goods.intro,
        Goods: res.Goods,
        tags: res.tags,
      })
      WxParse.wxParse('article', 'html', that.data.article, that, 25);
    })
    // 根据cutId查询砍价详情
     request.moregets('/api/cut/findCut?cutId=' + that.data.cutId).then(function (res) {
      Number(res.initPrice).toFixed(2);
      that.setData({
        cutGood: res,
      })
        let cutparm = {}
        let params={}
        cutparm.memberId = memberId
        cutparm.cutId = that.data.cutId
        params.params=cutparm
        that.cutTime(res.endtime)
       return request.moregets('/api/cut/isJoin', params)
    }).then(function(res){
      if (res.code == 1) {
          that.setData({
            isjoin: false
          })
        }
        else {
          var cuttotal = 0;
          for (var i = 0; i < res.memberCutDate.cutHistoryDOs.length; i++) {
            cuttotal = cuttotal + res.memberCutDate.cutHistoryDOs[i].cutPersAmount
          }
          if (res.memberCutDate.isSuccess == 1) {
            that.setData({
              iscutOk: true,
              isjoin: true,
            })
          }
          else {
            that.setData({
              isjoin: true
            })
          }
          that.setData({
            cutTotal:cuttotal,
            cutFinalAmount: Number(that.data.cutGood.initPrice - cuttotal).toFixed(2),
            percent: (cuttotal / (that.data.cutGood.initPrice - that.data.cutGood.belowPrice)) * 100,
            memberCut: res.memberCutDate
          })
        }
    })
  },
  cutTime: function (endtime){
    var that=this
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
  // 下单购买
  payorder:function(){
    var that=this;
    var cutfinalAmount = that.data.cutGood.initPrice - that.data.cutTotal
    wx.navigateTo({
      url: "../dingdan2/dingdan2?pic=1" + '&goodsId=' + that.data.goodsId + '&price=' + cutfinalAmount+ '&cutId=' + that.data.cutId + '&Type=KJ',
    })
  },
  //分享砍价模态框js
  modelClose: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    that.util(currentStatu);
    that.setData({
      isjoin: true
    })
    console.log(that.data.cutId);
    wx.setStorageSync("cutId", that.data.cutId)
    wx.setStorageSync("goodsId", that.data.goodsId)
    that.onLoad();
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '分享砍价',
      desc: '少侠，快帮我砍一刀',
      path: '/pages/fenxiangkanjia/fenxiangkanjia?memberId=' + wx.getStorageSync('memberId') + '&cutId=' + that.data.cutId + '&goodsId=' + that.data.goodsId// 路径，传递参数到指定页面
    }
  },
  powerDrawer: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    var startcutparm = {}
    startcutparm.memberId = that.data.memberId
    startcutparm.cutId = that.data.cutGood.cutId
    startcutparm.cutType = that.data.cutGood.cutType
    if (that.data.cutGood.cutType == 0) {
      startcutparm.minAmount = that.data.cutGood.minAmount
      startcutparm.maxAmount = that.data.cutGood.maxAmount
    }
    else {
      startcutparm.cutAverAmount = that.data.cutGood.cutAverAmount
    }
    let params = {}
    params.params = startcutparm;
    // 开始砍价
    request.moregets('/api/cut/startCut', params).then(function (res) {
      that.setData({
        cutResult: res.memberCutDate
      })
    })
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
        this.setData(
          {
            showModalStatus1: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus1: true
        }
      );
    }
  },
  
}) 