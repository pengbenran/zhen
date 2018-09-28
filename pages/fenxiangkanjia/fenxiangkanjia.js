var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    memberId: '',
    cutId: '',
    goodsId: '',
    helpMemberId: '',
    memberCut: {},
    goodImg: '',
    goodname: '',
    cutGood: {},
    percent: "100",// 进度条百分比
    sw: 12,
    pc: '#ff4948',
    pbc: '#cccccc',
    isActive: true,
    isCut: false,
    isSi: false,//设置进度条百分比显示
    countDownDay: '',
    countDownHour: '',
    countDownMinute: '',
    countDownSecond: '',
  },
  onLoad: function (options) {
    var that = this;
    if (options == undefined) {
      that.setData({
        cutId: wx.getStorageSync('cutId'),
        goodsId: wx.getStorageSync('goodsId'),
        memberId: wx.getStorageSync('memberId')
      })
    } else {
      that.setData({
        cutId: options.cutId,
        goodsId: options.goodsId,
        memberId: options.memberId,
      })
    }
    // 获取商品信息
    var parms = {}
    parms.memberId = that.data.memberId
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
      success: function (res) {
        that.setData({
          goodImg: res.data.Goods.thumbnail,
          goodname: res.data.Goods.name

        })
      }
    })
    wx.request({
      // url: api + '/api/Goods/getGoods',
      url: api + '/api/cut/findCut?cutId=' + that.data.cutId,
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          cutGood: res.data,
        })
        // 倒计时处理
        var timestamp2 = (new Date()).valueOf();
        console.log(timestamp2);

        var leftTime = res.data.endtime - timestamp2;
        console.log(leftTime);
        if (leftTime >= 0) {

          var interval = setInterval(function () {
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            leftTime = leftTime - 1000;
            if (leftTime < 0) {
              clearInterval(interval)
            }
            that.setData({
              countDownDay: days,
              countDownHour: hours,
              countDownMinute: minutes,
              countDownSecond: seconds,
            });

          }, 1000)
          if (leftTime <= 0) {
            clearInterval(interval)
          }
        }

      }
    })
    // 登录
    wx.login({
      success: function (res) {
        console.log(res.code)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: api + '/api/byCode',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res.data)

              if (res.data.memberDo == null) {
                wx.showModal({
                  title: '提示',
                  content: '你还未登录，是否登录',
                  success: function (res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../my/my',
                      })
                    } else if (res.cancel) {
                    }
                  }
                })
              } else {
                //用户已经登录 可以砍价了 
                //判断是否已经砍价
                var cutparm = {}
                console.log(that.data);
                cutparm.memberId = that.data.memberId;
                cutparm.helpMemberId = res.data.memberDo.memberId;
                cutparm.cutId = that.data.cutId;
                wx.request({
                  // url: api + '/api/Goods/getGoods',
                  url: api + '/api/cut/isHelp',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  data: {
                    "params": cutparm
                  },
                  success: function (res) {
                    console.log(res.data)
                    if (res.data.code == 200) {
                      // 改人未帮忙砍价，可以帮忙砍价
                      if (res.data.cutData.isSuccess == 1) {
                        that.setData({
                          isCut: true,
                          cutStatus: '好友已砍价成功，即将为他发货'
                        })
                      }
                      else {
                        that.setData({
                          isCut: false,
                          cutStatus: '好友正在砍价，快助他一臂之力吧'
                        })
                      }

                    } else {
                      that.setData({
                        isCut: true
                      })
                    }
                    var cuttotal = 0;
                    for (var i = 0; i < res.data.cutData.cutHistoryDOs.length; i++) {
                      cuttotal = cuttotal + res.data.cutData.cutHistoryDOs[i].cutPersAmount
                    }
                    that.setData({
                      cutTotal: cuttotal,
                      percent: (cuttotal / (that.data.cutGood.initPrice - that.data.cutGood.belowPrice)) * 100,
                      memberCut: res.data.cutData
                    })
                  }
                })

                if (res.data.memberDo.memberId == that.data.memberId) {
                  that.setData({
                    isCut: true
                  })
                } else {
                  that.setData({
                    isCut: false
                  })
                }












                //可以把openid保存起来,以便后期需求的使用
                wx.setStorageSync("openid", res.data.memberDo.openid)
                wx.setStorageSync("memberId", res.data.memberDo.memberId)
                that.setData({
                  helpMemberId: res.data.memberDo.memberId
                })
                // 分享进入如果是本人的话不能砍价

              }
            }
          })
        }
        else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });


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
  },
  gocutlist: function () {
    console.log(1111);
    wx.switchTab({
      url: '../active/active',
    })
  },
  helpcut: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    // 帮忙砍价
    var helpCutParm = {}
    var that = this;
    helpCutParm.memberId = that.data.memberId;
    helpCutParm.startcutId = that.data.memberCut.startcutId;
    helpCutParm.helpMemberId = that.data.helpMemberId;
    helpCutParm.residualAmount = that.data.memberCut.residualAmount;
    helpCutParm.cutType = that.data.cutGood.cutType;

    helpCutParm.belowPrice = that.data.cutGood.belowPrice;
    if (that.data.cutGood.cutType == 0) {
      helpCutParm.minAmount = that.data.cutGood.minAmount;
      helpCutParm.maxAmount = that.data.cutGood.maxAmount;
    }
    else {
      helpCutParm.cutAverAmount = that.data.cutGood.cutAverAmount
    }
    wx.request({
      // url: api + '/api/Goods/getGoods',
      url: api + '/api/cut/helpCut',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        "params": helpCutParm
      },
      success: function (res) {
        that.setData({
          cutResult: res.data
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
  //分享砍价模态框js
  modelClose: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    that.util(currentStatu);
    that.setData({
      isjoin: true,
    })
    wx.setStorageSync("cutId", that.data.cutId)
    wx.setStorageSync("goodsId", that.data.goodsId)
    wx.setStorageSync("memberId", that.data.memberId)
    that.onLoad();
  },
})