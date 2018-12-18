var apimg = getApp().globalData.apimg;
const util = require('../../utils/util.js')
const request = require('../../utils/request.js')
//index.js
//获取应用实例
var api = getApp().globalData.api;
const app = getApp()
Page({
  data: {
    memberId: '',
    iscanGet:false,
    menus:[],
    bi: apimg +"/image/bi.png",
    gethong: apimg +"/image/gethong.png",
    labaimg: apimg + "/image/shouye/laba.png",
    bimg: apimg + "/image/shouye/logo01.png",
    moreimg: apimg + "/image/shouye/8.png",
    bimg2: apimg + "/image/shouye/logo02.png",
    mores: apimg + "/image/shouye/8.png",
    jiahao: apimg + "/images/phonefenlei/jia.png",
    userInfo: {},
    indicatorDots: true,  //显示面板指示点
    autoplay: true,     //自动切换
    duration: 1000,    //滑动动画时长
    sModalStatus:false,
    faceValue:'',
    mobile:'请点击验证号码',
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
  // 获得商品详情
  getMain:function(){
    var that = this;
    let url = '/api/index/main';
    request.moregets(url).then(function (res) {
      that.setData({
        menus: res.data.menus,
        brand: res.data.brand,
        data: res.data,
        indexNotice: res.data.indexNotice
      })
      wx.setStorageSync('indexdata', res.data.message, )
    })
  },
  // 获取code
  getCode:function(callback){
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          let url = '/api/byCode';
          let codedata={};
          codedata.code=res.code
          request.moregets(url, codedata).then(function (res) {
              if (res.memberDo != null) {
                wx.setStorageSync('memberId', res.memberDo.memberId)
                // that.getMermberId(res.data.memberDo.memberId)
                let memberId = res.memberDo.memberId
                callback(memberId)
              }
              else {
                let memberId="00"
                wx.setStorageSync('memberId', "00")
                callback(memberId)
              }
          })
        }
      }
    })
  },
  // 获取mermberID
  getMermberId:function(memberId){  
    let url = '/api/member/memberIndex';
    let data = {};
    let parms={};
    parms.memberId = memberId
    data.parms = parms
    request.moregets(url, data).then(function (res) {
      if (res.code == 0) {
          wx.setStorageSync('point', res.memberDO.point)
          wx.setStorageSync('memberIdlvId', res.memberDO.lvId)
          wx.setStorageSync('isAgent', res.memberDO.isAgent)
          wx.setStorageSync('uname', res.memberDO.uname)
          wx.setStorageSync('face', res.memberDO.face)
          wx.setStorageSync('openId', res.memberDO.openId)
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
    let data = {};
    data.memberId = memberId
    request.moregets('/api/redPacket/selectMermberRed', data).then(function (res) {
      if(res.code==1){
        request.moregets('/api/redPacket/select').then(function (res) {
          if (res.redPacket[0].isend == 1) {
                that.sModal()
                that.setData({
                  iscanGet:true,
                  faceValue: res.redPacket[0].faceValue,
                  repacketId: res.redPacket[0].repacketId
                })
          }
        })
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
    // that.onLoad();
  },
  receiveRed:function(){
    var that=this
    let url = '/api/redPacket/MemberRedGet';
    let data = {};
    let receiveParams = {}
    receiveParams.openId = that.data.openId
    receiveParams.phoneNumber = that.data.mobile
    receiveParams.memberId = that.data.memberId
    receiveParams.amount = that.data.faceValue
    receiveParams.redpacketId = that.data.repacketId
    data.parm = receiveParams
    if (that.data.memberId == "00") {
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
    else {
      if (that.data.mobile == '请点击验证号码') {
        wx.showToast({
          title: '未验证手机号',
          icon: 'loading'
        })
      }
      else {
        wx.showLoading({
          title: '请稍等',
        })
        request.moregets(url, data).then(function (res) {
          if (res.code == 0) {
            that.setData({
              iscanGet: false
            })
            // that.onLoad()
            that.hModal()
            wx.hideLoading()
            wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 2000
            })
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
            let url = '/api/weCatGetTel';
            let data = {};
            data.code = res.code
            data.encryptedData = e.detail.encryptedData
            data.iv = e.detail.iv
            request.moregets(url, data).then(function (res) {
              if (res.code == 0) {
                that.setData({
                  mobile: res.mobile,
                  openId: res.opendId
                })
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
    console.log(e)
    var catId = e.currentTarget.id
    // wx.navigateTo({
    //   url: "../phonefenlei/phonefenlei?catId=" + catId +'&titlebar='+e.currentTarget.dataset.item,
    // })
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