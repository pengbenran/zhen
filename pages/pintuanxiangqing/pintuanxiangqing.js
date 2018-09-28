 var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var WxParse = require('/../../wxParse/wxParse.js');
let actEndTimeLists = [];
Page({
  data: {
    Gallery:[],
    collageDo:{},
    collageGoodsDo:{},
    Goods:[],
    Type: [{ buyType: 1, isClick: false },
     { buyType: 2, isClick: false },
     { buyType: 3, isClick: false}],
    sModalStatuss:false,
    goodsId:'',
    collageGoodsId:'',
    countDownList: [],
    actEndTimeList: [],
    coll:apimg+"/image/souc.png", 
    shutiao:apimg+"/image/group/10.png",
    boxleft:apimg+"/image/group/9.png",
    comimg:apimg+"/images/guige/zu01.png",
    chaimg:apimg+"/images/guige/xx.png",
    huo:apimg+"/images/guige/zu01.png",
    model:apimg+"/images/guige/xx.png",
    kefu:apimg+"/image/group/8.png",
    
    //添加购物车提示 
    item: {
      title: 6666666,
      price: 998.00,
    }, 
    pic:1,
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    flag: true,
    dataList: {},
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
    posts: false,
    hidden:  false,
    indicatorDots: true,  //显示面板指示点
    autoplay: true,     //自动切换
    interval: 5000,    //自动切换时间间隔 
    duration: 1000,    //滑动动画时长
    imgUrls: [
      'https://shop.yogain.cn/simages/image/group/zu04.png',
      'https://shop.yogain.cn/simages/image/group/zu04.png',
      'https://shop.yogain.cn/simages/image/group/zu04.png'

    ],
    "gimg": [apimg+"/image/gotuan/6.png"],
    "kefu": [apimg+"/image/group/8.png"],
    "indeximg": [apimg+"/image/group/17.png"],
    "xqimg": [apimg+"/image/group/04.jpg"],
    "join": [apimg+"/image/group/14.png"],
    "himg": [apimg+"/image/group/15.png"],
    "chaimg": [apimg+"/images/guige/xx.png"],
    "dityimg": [apimg+"/images/guige/zu01.png"],
    "spec": [apimg+"/image/shouye/8.png"],
    "sbox": [apimg+"/image/group/9.png"],
    "shou": [apimg+"/image/group/10.png"],
    "sharing": [apimg+"/image/group/5.png"],
    "distance": [apimg+"/image/group/13.png"],
    


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
    this.onLoad();
  },
  //事件处理函数 
  collage: function () {
    wx.navigateTo({
      url: '../cantuan/cantuan'
    })
  }, 
  onPullDownRefresh: function () {
    this.onLoad()
  },

  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ImageWidth: res.screenWidth + 'px',
          ImageHeight: res.screenWidth * 9 / 16 + 'px',
        })
      }
    })
    that.setData({
      collageGoodsId: options.collageGoodsId,
      goodsId: options.goodsId,
      memberId: wx.getStorageSync('memberId')
    })
   
    wx.showLoading({
      title: '加载中',
    })
    //上个页面传的开团活动商品数据
  
    
    //商品详情
    var goodsParms = {}
    goodsParms.goodsId = that.data.goodsId
    goodsParms.memberId = that.data.memberId
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
          productId: res.data.product.productId,
        })
      }
    })
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
        wx.hideLoading()
        that.setData({
          Gallery: res.data.Gallery,
          article:res.data.Goods.intro,
          Goods:res.data.Goods,
          tags:res.data.tags,
        })
        WxParse.wxParse('article', 'html', that.data.article, that, 25);
      },
    })
    // 获取拼团数据
    wx.request({
      url: api + '/api/collage/seleCollGoods/' + that.data.collageGoodsId, 
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code==0){
          that.setData({
            collageDo: res.data.collageDO,
            collageGoodsDo: res.data.collageGoodsDO
          })
        }   
      },
    })

    // var goodsList = options.goodsList
  //   var goodsList = JSON.parse(e.goodString);
  //   console.log(goodsList);
  // //请求获取正在开团的数据
    wx.request({
      url: api +'/api/collage/allStartCollage', 
      data: {
        goodsId: that.data.goodsId
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {  
         that.setData({
            collages: res.data
          })
       // console.log(res.data)
       // that.countdown(that.data.collages[0].collageStarttime)
        for (var i = 0; i < that.data.collages.length; i++) {
          that.countdown(i,that.data.collages[i].collageStarttime)
        }
      }
    })  
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  Readytobuy:function(e){
    // 显示模态框
    var that=this
    for (var i in that.data.Type) {
      var key1 = "Type[" + i + "].isClick";
      this.setData({
        [key1]: false
      });
    }
    if(e.currentTarget.dataset.type==1){ 
      let cantuanParams = {}
      cantuanParams.memberId = wx.getStorageSync('memberId')
      cantuanParams.memberCollageId = e.target.id
      // 调用接口
      wx.request({
        url: api + "/api/collage/joinCollageRepetition",
        data: {
          params: JSON.stringify(cantuanParams)
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.code == 1) {
            wx.showModal({
              title: '提示',
              showCancel:false,
              confirmText:'我知道了',
              content: '你已经参加过该拼团了哦！',
              success: function (res) {
     
              }
            })
          }
          else {
            that.sModel();
            let key = "Type[" + 0 + "].isClick";
            that.setData({
              [key]: true,
              memberCollageId:e.target.id
            });
          }
        }
      })
      
     
    }
    else if (e.currentTarget.dataset.type == 2){
     that.sModel();
      let key = "Type[" + 1+ "].isClick";
      that.setData({
        [key]: true,
      });
    }
    else{
      that.sModel();
      let key = "Type[" + 2 + "].isClick";
      that.setData({
        [key]: true,
      });
    }
  },
 
  buySelf:function(e){
    var that = this
    var goodarr = []
    var goodlist = {}
    goodlist.pic = that.data.pic
    goodlist.goodsId = that.data.goodsId
    goodlist.productId = that.data.productId
    goodarr[0] = goodlist
    wx.navigateTo({
      url: "../dingdan/dingdan?goodlist=" + JSON.stringify(goodarr) + '&cart=0'
    })
  },
  getnum:function(e){
  var that=this
  that.setData({
    pic:e.detail.value
  })
  },
  countdown:function(i,endtime){
    var that=this;
    var timestamp2 = (new Date()).valueOf();
    var leftTime = (endtime+86400000) - timestamp2
      if (leftTime >= 0) {
        var interval = setInterval(function () {
          // var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
          var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
          var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
          var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
          leftTime = leftTime - 1000;
          var keyhours = "collages[" + i + "].countDownHour";
          var keyminutes = "collages[" + i + "].countDownMinute";
          var keyseconds = "collages[" + i + "].countDownSecond";
          that.setData({
            [keyhours]: hours,
            [keyminutes]: minutes,
            [keyseconds]: seconds,
          });
        }, 1000)
        console.log(that.data.collages)
        if (leftTime <= 0) {
          clearinterval(interval)
        }
      } 
  },
  sModel:function(){
    var that=this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
      sModalStatuss: true,
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hModals: function () {
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
        sModalStatuss: false
      })
    }.bind(this), 200)
  },
  //主页跳转
  zhuye: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
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



// 参团
  cantuan: function (e) {
    var that = this;
    console.log(e)
    if (that.data.pic > that.data.Goods.enableStore) {
      wx.showToast({
        title: "库存不够！",
        icon: "success",
        durantion: 2000
      })
    }
    else {
      wx.navigateTo({
        url: "../dingdan2/dingdan2?pic=" + that.data.pic + '&goodsId=' + that.data.Goods.goodsId + '&price=' + that.data.collageGoodsDo.activityPrice + '&memberCollageId=' + that.data.memberCollageId + '&Type=C',
      })
    }   
  },




// 开团
  kaituan:function(){
    var that = this;
    if (that.data.pic > that.data.Goods.enableStore) {
        wx.showToast({
          title: "库存不够！",
          icon: "success",
          durantion: 2000
        })
    }
    else{ 
      console.log(that.data.collageDo.collagePersons)  
    wx.navigateTo({
      url: "../dingdan2/dingdan2?pic=" + that.data.pic + '&goodsId=' + that.data.Goods.goodsId + '&price=' + that.data.collageGoodsDo.activityPrice + '&collagePersons='+that.data.collageDo.collagePersons+'&Type=K',
            })
    }   
  },
  //消失
  hide: function () {
    this.setData({ flag: true })
  },
}) 
