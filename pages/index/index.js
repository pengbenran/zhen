var apimg = getApp().globalData.apimg;
const util = require('../../utils/util.js')
//index.js
//获取应用实例
var api = getApp().globalData.api;
const app = getApp()
Page({
  data: {
    memberId: '',
    iscanGet:false,
    menus:[],
    labaimg: apimg + "/image/shouye/laba.png",
    dfimg: apimg + "/image/shouye/08.png",
    bimg: apimg + "/image/shouye/logo01.png",
    moreimg: apimg + "/image/shouye/8.png",
    bimg2: apimg + "/image/shouye/logo02.png",
    jumbimg: apimg + "/image/shouye/zu28.png",
    mores: apimg + "/image/shouye/8.png",
    jiahao: apimg + "/images/phonefenlei/jia.png",
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    hidden: false,
    indicatorDots: true,  //显示面板指示点
    autoplay: true,     //自动切换
    duration: 1000,    //滑动动画时长
    sModalStatus:false,
    imgUrls: [
      apimg + "/image/shouye/zu31.png",
      apimg + "/image/shouye/zu27.png",
      apimg + "/image/shouye/zu28.png",
    ],
    extension:'',
    faceValue:'',
    mobile:'请点击验证号码',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20 // 时间间隔
  },
  join: function () {
    var that = this
    wx.navigateTo({
      url: '../join/join',
    })
  },
  onShow: function (options){
    // console.log(options) 
    var that=this
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        that.setData({
          memberId: memberId
        })   
      }
    } catch (e) {
    }
  },
  onReady: function (e) {
    
  },
 
  onLoad: function (options) {
    var that = this
  
    if (options.scene == undefined) {
      wx.setStorageSync('distribeId', null)
    }
    else {
      wx.setStorageSync('distribeId', decodeURIComponent(options.scene))
    }
    that.getMain();
    that.userLogin();
  },
  // run1: function () {
  //   var that = this;
  //   var interval = setInterval(function () {
  //     if (-that.data.marqueeDistance < that.data.length) {
  //       that.setData({
  //         marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
  //       });
  //     } else {
  //       clearInterval(interval);
  //       that.setData({
  //         marqueeDistance: that.data.windowWidth
  //       });
  //       // that.run1();
      
  //     }
  //   }, that.data.interval);
  // },
  // 获得商品详情
  getMain:function(){
    // 获取商品详情
    var that = this;
    wx.request({
      url: api + '/api/index/main',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫zhihu的这个数组中
        that.setData({
          menus: res.data.data.menus,
          brand: res.data.data.brand,
          data: res.data.data,
          indexNotice:res.data.data.indexNotice
          //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
        })

        console.log(res.data.data.indexNotice);

        // var length = that.data.gonggao.length * that.data.size;//文字长度
        // var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
        // that.setData({
        //   length: length,
        //   windowWidth: windowWidth,
        //   marquee2_margin: length < windowWidth ? windowWidth - length : that.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
        // });

        wx.setStorageSync('indexdata', res.data.data.message, )
        // 判断是否注册过
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
        })
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      }
    })
  },
  // 获取code
  getCode:function(callback){
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: api+'/api/byCode',
            // url: 'http://192.168.2.131:8080/mall/api/byCode',
            // url: 'http://192.168.2.131/mall/api/byCode',
            data: {
              code: res.code
            },
            success: function (res) {
              if (res.data.memberDo != null) {
                wx.setStorageSync('memberId', res.data.memberDo.memberId)
                // that.getMermberId(res.data.memberDo.memberId)
                let memberId = res.data.memberDo.memberId
                callback(memberId)
              }
              else {
                let memberId="00"
                wx.setStorageSync('memberId', "00")
                callback(memberId)
              }

            }
          })
        }
      }
    })
  },
  // 获取mermberID
  getMermberId:function(memberId){  
    var parms = {}
    parms.memberId = memberId
    wx.request({
      url:api +'/api/member/memberIndex',
      // url: 'http://192.168.2.131:8080/mall/api/member/memberIndex', 
      // url: 'http://192.168.2.131/mall/api/member/memberIndex',
      data: {
        parms: parms
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorageSync('point', res.data.memberDO.point)
          wx.setStorageSync('memberIdlvId', res.data.memberDO.lvId)
          wx.setStorageSync('isAgent', res.data.memberDO.isAgent)
          wx.setStorageSync('name', res.data.memberDO.name)
          wx.setStorageSync('face', res.data.memberDO.face)
          wx.setStorageSync('openId', res.data.memberDO.openId)
        }
      }
    })
  },
  userLogin:function(){
    var that = this
    that.getCode(function (memberId) {
      that.getMermberId(memberId)
      that.selectMermberRed(memberId)
      that.setData({
        memberId:memberId
      })
    })
  },
  showredpack:function(){
    var that=this;
    that.sModal()
  },
  selectMermberRed:function(memberId){
    var that=this
    wx.request({
      url: api + '/api/redPacket/selectMermberRed',
      data: {
        memberId: memberId
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.request({
            url: api + '/api/redPacket/select',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              if (res.data.redPacket[0].isend == 1) {
                that.sModal()
                that.setData({
                  iscanGet:true,
                  faceValue: res.data.redPacket[0].faceValue,
                  repacketId: res.data.redPacket[0].repacketId
                })
              }
            }
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    withShareTicket: true
  },
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
  receiveRed:function(){
    var that=this
    var receiveParams = {}
    receiveParams.openId = that.data.openId
    receiveParams.phoneNumber = that.data.mobile
    receiveParams.memberId = that.data.memberId
    receiveParams.amount = that.data.faceValue
    receiveParams.redpacketId = that.data.repacketId
    console.log(that.data.memberId)
    if(that.data.memberId=="00"){
      wx.showModal({
        title: '提示',
        content: '请先授权登录',
        confirmText: "去登录",
        cancelText: '残忍拒绝',
        success: function (res) {
          if (res.confirm) {
            that.hModal()
           wx.switchTab({
             url: '../my/my',
           })
          } else if (res.cancel) {

          }
        }
      })
    }
    else{
      if (that.data.mobile == '请点击验证号码') {
        wx.showToast({
          title: '未验证手机号',
          icon: 'loading'
        })
      }
      else{
        wx.showLoading({
          title: '请稍等',
        })
        wx.request({
          url: api + '/api/redPacket/MemberRedGet',
          data: {
            parm: receiveParams
          },
          success: function (res) {
            if (res.data.code == 0) {
              that.setData({
                iscanGet:false
              })
              that.onLoad()
              that.hModal()
              wx.hideLoading()
              wx.showToast({
                title: '领取成功',
                icon:'success',
                duration:2000
              })
            }   
          }
        })
      }
    } 
  },
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      this.setData({
        disabled: true
      })
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.request({
              url: api + '/api/weCatGetTel',
              data: {
                code: res.code,//获取openid的话 需要向后台传递code,利用code请求api获取openid
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
              },
              success: function (res) {
                if (res.data.code == 0) {
                  that.setData({
                    mobile: res.data.mobile,
                    openId: res.data.opendId
                  })
                }
              }
            })
          }
        }
      })
    }
    },
  // 搜索跳转js
  sousuo: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  //限时折扣跳转
  zhekou: function (e) {
    wx.navigateTo({
      url: '../zhekouxiangqing/zhekouxiangqing',
    })
  },
  // 编辑跳转js
  pingpai: function (e) {
    wx.navigateTo({
      url: '../spingpai/spingpai',
    })
  },
  // 编辑跳转js
  fenlei: function (e) {
    wx.navigateTo({
      url: '../shangfeilei/shangfeilei',
    })
  },
  //手机分类跳转js
  phonefenlei: function (e) {
    var catId = e.currentTarget.id
    console.log(e)
    wx.navigateTo({
      url: "../phonefenlei/phonefenlei?catId=" + catId +'&titlebar='+e.currentTarget.dataset.item,
    })
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
  }

})