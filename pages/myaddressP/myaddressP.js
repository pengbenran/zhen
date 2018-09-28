var api = getApp().globalData.api;
var apimg = getApp().globalData.apimg;
Page({
  data: {
    memberAddressList: "",
    selected: ""
  },

  onLoad: function (e) {
    var that = this
    var parms = {}
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
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
        if (code == 1) {
          res.data.memberAddressList = ""
        }
        that.setData({
          memberAddressList: res.data.memberAddressList,
        })
      }
    })
  },
  moren: function (e) {
    var that = this
    var pars = 1
    var gooditem = []
    var aa = {}

    var addrId = e.currentTarget.id
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var defAddr = e.target.id
    aa.memberId = memberId
    aa.defAddr = defAddr
    aa.addrId = addrId
    aa.name = e.currentTarget.dataset.name
    aa.mobile = e.currentTarget.dataset.mobile
    aa.province = e.currentTarget.dataset.province
    aa.city = e.currentTarget.dataset.city
    aa.region = e.currentTarget.dataset.region
    aa.addr = e.currentTarget.dataset.addr

    // gooditem.push(aa)
    // parms.gooditem = gooditem
    // parms = JSON.stringify(parms)
    wx.setStorageSync('addr', aa);
    wx.navigateTo({
      url: '../dingdan2/dingdan2?pars=' + pars,
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
    try {
      var value = wx.getStorageSync('addr')
      if (value) {
        console.log(value)
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  onShow: function () {
    this.onLoad()
  },

  // del
  del: function (e) {
    var that = this
    var parms = {}
    var addrId = e.currentTarget.id
    parms.addrId = addrId
    parms = JSON.stringify(parms)
    var defAddr = e.currentTarget.dataset.del
    if (defAddr == 1) {
      wx.showToast({
        title: "请删非默认",
        icon: "success",
        durantion: 2000
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
        that.onLoad()
      }
    })
  },
  // 跳转xinzengdizhi页面
  add: function (e) {
    wx.navigateTo({
      url: '../xinzengdizhitwo2/xinzengdizhitwo2',
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
  select: function (e) {
    var that = this
    var parms = {}
    var address = {}

    var addrId = e.currentTarget.id
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var defAddr = e.target.id
    if (defAddr == "0") {
      defAddr = "1";

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
        method: "PUT",
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
      url: '../bianjidizhitwo/bianjidizhitwo?addrId=' + addrId,
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