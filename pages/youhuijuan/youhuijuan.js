var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    
    tabPageHeight: 600,
    currentTab: 0,
    "Receive":["未领取"],
    "use":["已使用"],
    "notuse":["未使用"],
    "overdue":["已过期"],
    "members": [apimg+"/images/youhuijuan/zu26.png"],
    "moneyleft":50,
    "youhui": ["优惠券说明"],
    "pretext": ["满680元可用"],
    "data": ["有效期： 2018-03-01至2018-04-01"],
      "t1":["立"],
      "t2":["即"],
      "t3":["领"],
      "t4":["取"],
      "tu":"",
    "premoney":["20"],
    "yuan":["元"],
    "pretext2": ["满680元可用"],
    "member3": [apimg+"/images/youhuijuan/zu25.png"],
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

onLoad:function(){
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


  try {
    var memberIdlvId = wx.getStorageSync('memberIdlvId')
    if (memberIdlvId) {
      memberIdlvId: memberIdlvId
    }
  } catch (e) {
  }
  var that = this
  wx.request({
    url: api+'/api/vocher/unclosed',//上线的话必须是https，没有appId的本地请求貌似不受影响  
    data: {
      fitMemberType: memberIdlvId
    },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      console.log(res.data)
      var tu = that.data.tu
      if(res.data.code !=1){
      that.setData({
        VoucherMap: res.data.VoucherMap,
        tu :1
      })
    }
    },
    fail: function () {
      wx.showToast({
        title: '网络异常',
      })
    },
    complete: function () {
      // complete  
    }
  });


  wx.getSystemInfo({
    success: function (res) {
      console.info(res.windowHeight);
      that.setData({
        scrollHeight: res.windowHeight
      });
    }
  });



},



  onShareAppMessage: function () {

    withShareTicket: true
  },
  /*页面上拉触底事件的处理函数*/
  onReachBottom: function () {
    var that = this;
    var sendButoomData;
    if (that.data.currentTab == 0) {
      //全部
      sendButoomData = {
        "tokenSession": that.data.tokenSession,
        "lastId": that.data.shopLastId,
        "searchValue": that.data.shopSearchValue
      }

    }
    else if (that.data.currentTab == 1) {
      //待付款
    }
    else if (that.data.currentTab == 2) {
      //待发货
    }
  },
  //滑动切换
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTba: e.detail.current
    });
    that.onLoad()
  },

  shiyong:function(e){
    var voucherid = e.currentTarget.dataset.voucherid
    var activeType = e.currentTarget.dataset.activetype
      wx.navigateTo({
        url: '../youhui/youhui?voucherid=' + voucherid + '&activeType=' + activeType,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
  },
  //点击切换
  clickTab: function (e) {

    var that = this;
    wx.request({
      url: api + '/api/redPacket/selectMermberRed',
      data: {
        memberId:that.data.memberId
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            redPacket: res.data.redPacket
          })
        }
      }
    })



    if (e.target.dataset.current == 0) {
      try {
        var memberIdlvId = wx.getStorageSync('memberIdlvId')
        if (memberIdlvId) {
          memberIdlvId: memberIdlvId
        }
      } catch (e) {
      }
      var that = this
      wx.request({
        url: api+'/api/vocher/unclosed',//上线的话必须是https，没有appId的本地请求貌似不受影响  
        data: {
          fitMemberType: memberIdlvId
        },
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            VoucherMap: res.data.VoucherMap
          })
        },
        fail: function () {
          wx.showToast({
            title: '网络异常',
          })
        },
        complete: function () {
          // complete  
        }
      });
    }
    if (e.target.dataset.current == 2){
      // 已使用
      try {
        var memberId = wx.getStorageSync('memberId')
        if (memberId) {
          memberId: memberId
        }
      } catch (e) {
      }
      var that = this
      wx.request({
        url: api+'/api/vocher/used',//上线的话必须是https，没有appId的本地请求貌似不受影响  
        data: {
          memberId: memberId,
          state:1
        },
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            VoucherMap: res.data.VoucherMap
          })
        },
        fail: function () {
          wx.showToast({
            title: '网络异常',
          })
        },
        complete: function () {
          // complete  
        }
      });


    }
    if (e.target.dataset.current == 1) {
      // 未使用
      try {
        var memberId = wx.getStorageSync('memberId')
        if (memberId) {
          memberId: memberId
        }
      } catch (e) {
      }
      var that = this
      wx.request({
        url: api+'/api/vocher/used',//上线的话必须是https，没有appId的本地请求貌似不受影响  
        data: {
          memberId: memberId,
          state:2,
          isend:2
        },
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            VoucherMap: res.data.VoucherMap
          })
        },
        fail: function () {
          wx.showToast({
            title: '网络异常',
          })
        },
        complete: function () {
          // complete  
        }
      });


    }
    if (e.target.dataset.current == 3) {
      // 过期
      try {
        var memberId = wx.getStorageSync('memberId')
        if (memberId) {
          memberId: memberId
        }
      } catch (e) {
      }
      var that = this
      wx.request({
        url: api+'/api/vocher/closeUsed',//上线的话必须是https，没有appId的本地请求貌似不受影响  
        data: {
          memberId: memberId
        },
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if(res.data.code == 1){
            that.setData({
              VoucherMap: ""
            })
          }else{
          console.log(res.data)
          that.setData({
            VoucherMap: res.data.VoucherMap
          })
          }
        },
        fail: function () {
          wx.showToast({
            title: '网络异常',
          })
        },
        complete: function () {
          // complete  
        }
      });

    }
    

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

// 领取优惠券

  linqu:function(e){
    var voucherid = e.currentTarget.dataset.voucherid
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
var that = this
    setTimeout(function () { 
    // try {
    //   var memberIdlvId = wx.getStorageSync('memberIdlvId')
    //   if (memberIdlvId) {
    //     memberIdlvId: memberIdlvId
    //   }
    // } catch (e) {
    // }
    wx.request({
      url: api+'/api/vocher/received',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method:"POST",
      data: {
        memberId: memberId,
        voucherId: voucherid,
      },
      success: function (res) {
        if(res.data.code == 1){
          that.setData({
            tu:2,
            VoucherMap: that.data.VoucherMap
          })
          wx.showModal({
            title: '提示',
            content: '领取次数已达上限',
            success: function (res) {
              if (res.confirm) {

                return;
              } else if (res.cancel) {

                return;
              }
            }
          })
          return
        }else{
          that.setData({
            tu:1,
            VoucherMap: that.data.VoucherMap
          })
        }
        console.log(res.data)
        wx.showToast({
          title: '领取成功',
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () {
        // complete  
      }
    })
    }, 500)
  },


// 使用优惠券

  // uses:function(e){
  //   wx.request({
  //     // url: 'http://192.168.2.208/mall/api/collage/collageGoodsList',//上线的话必须是https，没有appId的本地请求貌似不受影响  
  //     data: {

  //     },
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       this.data.cartgoods.splice(e.currentTarget.dataset.index, 1)
  //       wx.showToast({
  //         title: '领取成功',
  //       })
  //     },
  //     fail: function () {
  //       this.data.cartgoods.splice(e.currentTarget.dataset.index, 1)
  //       wx.showToast({
  //         title: '网络异常',
  //       })
  //     },
  //     complete: function () {
  //       // complete       
  //     }
  //   });
  // },


  //商城 定制 资讯 tab 切换事件
  OnTabChangeEvent(event) {
    var current = event.detail.current;
    this.setData({
      currentTab: current
    });
  }


})