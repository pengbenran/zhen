var apimg = getApp().globalData.apimg;
// pages/group/group.js
var WxParse = require('/../../wxParse/wxParse.js');
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
// pages/my/my.js
var util = require('../../utils/util.js');
var app = getApp()
var Info = {}
var twoList = {}
Page({
  data: {
    mylogin:false,
    joinData:[],
    flag: true,
    item: {
      voteTitle: null,
    },
    shaimg: apimg + "/image/group/5.png",
    // postsimg:apimg+"/image/souc.png",
    postsimg: "/image/xin1.png",
    elesimg: apimg + "/image/group/10.png",
    // elesimg: "/image/xin.png",
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
    "standard": '[{"0":"m","1":"l","name":"尺码","code":"cm"},{"1":"蓝色","0":"红色","name":"颜色","code":"ys"}]',
    modemoney: "0.00",
    goodid: "",
    catId: "",
    pic: 1,
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
    hidden: false,
    canJoin: false,
    imgUrls: [
      apimg + "/image/group/zu04.png",
      apimg + "/image/group/zu04.png",
      apimg + "/image/group/zu04.png"
    ],
    //正品保证数据
    tags: []
  },
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var fenxiangpingtuan = JSON.parse(options.fenxiangpingtuan)
    that.setData({
      joinData: fenxiangpingtuan
    })
    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: api + '/api/byCode',
            data: {
              code: res.code
            },
            success: function (res) {
             if (res.data.memberDo == null) {
                wx.showModal({
                  title: '提示',
                  content: '您还未登录，请先登录',
                  showCancel:false,
                  success: function (res) { 
                    wx.switchTab({
                      url: '../my/my',
                    })
                  }
                })
                
              }
              else{
               that.setData({
                 joinmemberId: res.data.memberDo.memberId
               })
               var params = {}
               params.memberCollageId = that.data.joinData.memberCollageId
               wx.request({
                 url: api + '/api/collage/friendCollage',
                 data: {
                   params: params
                 },
                 success: function (res) {
                   console.log(res.data)
                   if(res.data.code==0){
                    //  说明拼团未成功可以参加拼团
                     var collageparams = {}
                     collageparams.goodsId = that.data.joinData.goodsId
                     collageparams.memberCollageId = that.data.joinData.memberCollageId
                      wx.request({
                        url: api + '/api/collage/collageSucceed',
                        data: {
                          params: collageparams
                        },
                        header: {
                          'Content-Type': 'application/json'
                        },
                        success: function (res) {     
                          var timestamp2 = (new Date()).valueOf();
                          var leftTime = (res.data.collageSucceed[0].entertime + 86400000) - timestamp2;
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
                            that.setData({
                              windowHeight: wx.getStorageSync('windowHeight'),
                              collageSucceed: res.data.collageSucceed[0],
                              isOk:true,
                              canJoin: true,
                            });
                          }else{
                            wx.showToast({
                              title: "活动已过期！",
                              icon: "success",
                              durantion: 2000
                            })
                            that.setData({
                              canJoin: false,
                              windowHeight: wx.getStorageSync('windowHeight'),
                              collageSucceed: res.data.collageSucceed[0],
                              isOk: false
                            });
                          }
                         
                        }
                      });
                   }
                   else{
                     wx.showToast({
                       title: "团人数已满！",
                       icon: "success",
                       durantion: 2000
                     })
                     that.setData({
                       canJoin:false
                     })
                   }
                 }
               });

              }
            }
          })
        }
      }

    });

  },

  // 获取输入框的值
  voteTitle: function (e) {
    this.data.voteTitle = e.detail.value;
  },
  kaituan:function(){
    wx.switchTab({
      url:'../active/active'
    })
  },
  //立即购买模态框
  sModal: function () {
   var that=this;
    // 显示遮罩层
    if (that.data.joinmemberId == that.data.joinData.memberId) {
      wx.showModal({
        title: '提示',
        content: '你不能参加自己的团哦!',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index',
            })
         
          } else if (res.cancel) {

          }
        }
      })
    }
    else if(that.data.isOk==false){
      wx.showToast({
        title: "活动已过期！",
        icon: "success",
        durantion: 2000
      })
    }
    else{
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
    }   
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
  onShareAppMessage: function () {
    withShareTicket: true
  },
  //规格下一步跳转
   next: function (e) {
     var that=this
     wx.setStorageSync('memberId', that.data.joinmemberId )
    wx.navigateTo({
      url: "../dingdan2/dingdan2?pic=" + that.data.pic + '&goodsId=' + that.data.joinData.goodsId + '&price=' + that.data.joinData.activityPrice + '&memberCollageId=' + that.data.joinData.memberCollageId + '&Type=C',
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



})
