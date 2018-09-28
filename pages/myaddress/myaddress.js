var api = getApp().globalData.api;
var apimg = getApp().globalData.apimg;
Page({
  data: {
    memberAddressList:"",
    selected:""
  },

  onLoad: function () {
    var that = this
    var parms = {}
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {  
        memberId: memberId
      }
    } catch (e) {
    }
    if (memberId==""){
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
    })  }else{
    parms.memberId = memberId
    // parms = JSON.stringify(parms)

    wx.request({
      url: api + '/api/address/addressAll',
      data: {
        "parms": parms
      },
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        var code = res.data.code
        if(code==1){
          res.data.memberAddressList=""
        }
        that.setData({
          memberAddressList: res.data.memberAddressList,
        })
      }
    })
    }
  },
  onShow: function () {
    var that= this
    that.onLoad();
  },
// del
del:function(e){
  var memberAddressList = this.data.memberAddressList
  var that= this
  wx.showModal({
    title: '提示',
    content: '是否删除该地址',
    success: function (res) {
      if (res.confirm) {
        var parms = {}
        var addrId = e.currentTarget.id
        parms.addrId = addrId
        parms = JSON.stringify(parms)
        var defAddr = e.currentTarget.dataset.del
        if (defAddr == 1) {
          wx.showModal({
            title: '提示',
            content: '请删除非默认地址',
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
          return
        }

        wx.request({
          url: api + '/api/address/deleteAddress',
          data: {
            "parms": parms
          },
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.onLoad(e)
          }
          
        })


      } else if (res.cancel) {
      }
    }
  })
},
  // 跳转xinzengdizhi页面
  add: function (e) {
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    if (memberId==""){
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
    }else{
      wx.navigateTo({
        url: '../xinzengdizhi/xinzengdizhi',
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  },
  select:function(e){
  var that = this
  var parms = {}
  var address={}
  
  var addrId = e.currentTarget.id
  try {
    var memberId = wx.getStorageSync('memberId')
    if (memberId) {
      memberId: memberId
    }
  } catch (e) {
  }
  var defAddr=e.target.id
  if(defAddr=="0"){
    defAddr="1";
    
  // var defAddr = e.currentTarget.dataset.del
  // if (defAddr == 1) {
  //   return
  // }
  address.memberId = memberId
  address.defAddr = defAddr
  address.addrId = addrId
  parms.address = address
  parms = JSON.stringify(parms)
  wx.request({
    url: api + '/api/address/update',
    data: {
      parms: parms
    },
    method:"PUT",
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
     that.onLoad(e)
    }
  })
  return;
  } else if (defAddr == "1") {
    defAddr = "1";
    address.memberId = memberId
    address.defAddr = defAddr
    address.addrId = addrId
    parms.address = address
    parms = JSON.stringify(parms)
    wx.request({
      url: api + '/api/address/update',
      data: {
        parms: parms
      },
      method: "PUT",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.onLoad(e)
      }
    })
    return
  }
},


  // 跳转bianjidizhi页面
  edit: function (e) {
    var addrId = e.currentTarget.id
    wx.navigateTo({
      url: '../bianjidizhi/bianjidizhi?addrId='+addrId,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  onShareAppMessage: function () {

    withShareTicket: true
  },

})