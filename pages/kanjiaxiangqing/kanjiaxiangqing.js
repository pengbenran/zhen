
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
var WxParse = require('/../../wxParse/wxParse.js');
Page({
  data: {
    disimg: apimg + "/image/group/05.png",
    colle: apimg + "/image/souc.png",
    sbox: apimg + "/image/group/9.png",
    geimg: apimg + "/image/group/6.png",
    specimg: apimg + "/image/shouye/8.png",
    comimg: apimg + "/images/guige/zu01.png",
    chaimg: apimg + "/images/guige/xx.png",
    smallimg: apimg + "/image/group/06.png",
    prune: apimg + "/image/group/15.png",
    path1: apimg + "/image/group/4.png",
    path2: apimg + "/image/group/2.png",
    path3: apimg + "/image/group/3.png",
    path4: apimg + "/image/group/16.png",
    path5: apimg + "/image/group/012.png",
    xqimg: apimg + "/image/group/04.jpg",
    homepage: apimg + "/image/group/17.png",
    custom: apimg + "/image/group/8.png",
    gocart: apimg + "/image/group/7.png",
    close: apimg + "/imgs/kx.png",
    cutTotal: '',
    // 进度条
    percent: "",// 进度条百分比
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
    imgUrls: [
      apimg + "/image/group/zu04.png",
      apimg + "/image/group/zu04.png",
      apimg + "/image/group/zu04.png"

    ],
    "minprice": 180.00,
    "price": 1200.00,
    "yun": 6.00,
    "contit": ["X20旗舰版 4GB+ 128GB 大内存X20旗舰版 4GB+ 128GB"],
    "shaimg": [apimg + "/image/group/5.png"],
    "collimg": [apimg + "/image/group/10.png"],
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
        memberId: memberId
      }
    } catch (e) {
    }
    var parms = {}
    parms.memberId = memberId
    parms.goodsId = that.data.goodsId


    wx.request({
      url: api + '/api/Goods/getGoods',
      // url: 'http://192.168.2.144/api/index/getGoods/166993'
      data: {
        "parms": parms
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (aa) {
        var article = aa.data.Goods.intro;
        WxParse.wxParse('article', 'html', article, that, 25);
        var haveSpec = aa.data.Goods.haveSpec
        if (haveSpec == 1) {
          var adjusts = aa.data.Goods.adjuncts;
          var intro = aa.data.Goods.intro
          var adjustsObject = '';
        } else {
          var adjusts = aa.data.Goods.adjuncts;
          var intro = aa.data.Goods.intro
          var productId = aa.data.getproduct.productId;
          var adjustsObject = '';
        }
        if (isNaN(adjusts)) {
          adjustsObject = JSON.parse(adjusts);
          var length = adjustsObject.length;

        }
        var count = aa.data.count
        var posts = that.data.posts
        if (count == 0) {
          that.setData({
            posts: false
          })
        } else {
          that.setData({
            posts: true
          })
        }
        if (haveSpec == 1) {
          that.setData({
            intro: intro,
            haveSpec: haveSpec,
            goodid: aa.data.Goods.goodsId,
            count: aa.data.count,
            name: aa.data.Goods.name,
            good: good,
            Gallery: aa.data.Gallery,
            Goods: aa.data.Goods,
            tags: aa.data.tags,
            image: aa.data.Goods.thumbnail,
            catId: aa.data.Goods.catId,
            weight: aa.data.Goods.weight,
            typeId: aa.data.Goods.typeId,
            enableStore: aa.data.Goods.enableStore,
            store: aa.data.Goods.store,
            twoList: adjustsObject,
            enableStore: aa.data.Goods.enableStore,
            shippingAmount: aa.data.Goods.point
            //  goodid:options.goodid
          })

        } else {
          that.setData({
            intro: intro,
            haveSpec: haveSpec,
            productId: aa.data.getproduct.productId,
            goodid: aa.data.Goods.goodsId,
            count: aa.data.count,
            name: aa.data.Goods.name,
            Gallery: aa.data.Gallery,
            Goods: aa.data.Goods,
            tags: aa.data.tags,
            image: aa.data.Goods.thumbnail,
            catId: aa.data.Goods.catId,
            weight: aa.data.Goods.weight,
            typeId: aa.data.Goods.typeId,
            enableStore: aa.data.Goods.enableStore,
            store: aa.data.Goods.store,
            twoList: adjustsObject,
            shippingAmount: aa.data.Goods.point,
            //  goodid:options.goodid
          })
        }


      },
    })

    // 根据cutId查询砍价详情
    wx.request({
      // url: api + '/api/Goods/getGoods',
      url: api + '/api/cut/findCut?cutId=' + that.data.cutId,
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        Number(res.data.initPrice).toFixed(2);
        that.setData({
          cutGood: res.data,
        })
        // 判断是否参与砍价
        var cutparm = {}
        cutparm.memberId = memberId
        cutparm.cutId = that.data.cutId
        // cutparm.cutType = res.data.cutType
        wx.request({
          // url: api + '/api/Goods/getGoods',
          url: api + '/api/cut/isJoin',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            "params": cutparm
          },
          success: function (res) {
            if (res.data.code == 1) {
              that.setData({
                isjoin: false
              })
            }
            else {
              var cuttotal = 0;
              for (var i = 0; i < res.data.memberCutDate.cutHistoryDOs.length; i++) {
                cuttotal = cuttotal + res.data.memberCutDate.cutHistoryDOs[i].cutPersAmount
              }
              if (res.data.memberCutDate.isSuccess == 1) {
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
              // that.setData({
              //   
              // })
              
              that.setData({
                cutTotal:cuttotal,
                cutFinalAmount: Number(that.data.cutGood.initPrice - cuttotal).toFixed(2),
                percent: (cuttotal / (that.data.cutGood.initPrice - that.data.cutGood.belowPrice)) * 100,
                memberCut: res.data.memberCutDate
              })
            }
          }
        })
        // 倒计时处理
        var timestamp2 = (new Date()).valueOf();
        var leftTime = res.data.endtime - timestamp2;
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


      }
    })
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

  // 页面渲染完成后 调用 

  //cell事件处理函数 


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

  collection: function () {
    var that = this;
    that.setData({
      post: (!that.data.post)
    })
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
    console.log(wx.getStorageSync('memberId'));
    console.log(that.data.cutId);
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
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var startcutparm = {}
    startcutparm.memberId = memberId
    startcutparm.cutId = that.data.cutGood.cutId
    startcutparm.cutType = that.data.cutGood.cutType

    if (that.data.cutGood.cutType == 0) {
      startcutparm.minAmount = that.data.cutGood.minAmount
      startcutparm.maxAmount = that.data.cutGood.maxAmount
    }
    else {
      startcutparm.cutAverAmount = that.data.cutGood.cutAverAmount
    }
    console.log(startcutparm);
    wx.request({
      // url: api + '/api/Goods/getGoods',
      url: api+'/api/cut/startCut',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        "params": startcutparm
      },
      success: function (res) {
        that.setData({
          cutResult: res.data.memberCutDate
        })
        console.log(res.data)
      }
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
  // 时间戳转时间格式
  // formatDate:function(now) { 
  //   var time = new Date(now);
  //   var year = time.getFullYear(); 
  //   var month = time.getMonth() + 1; 
  //   var date = time.getDate(); 
  //   var hour = time.getHours(); 
  //   var minute = time.getMinutes(); 
  //   var second = time.getSeconds(); 
  //   return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second; 
  // }
}) 