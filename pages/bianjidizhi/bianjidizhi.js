//市级联动js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var model = require('../../model/model.js')
var show = false;
var item = {};

Page({
  data: {
    iconimg: apimg +"/images/myaddress/8.png",
    height: 20,
    userName: "",
    mobile: "",
    addrId:"",
    addr:"",
    switchData: [
      {
        id: 1,
        color: '#26b4fe',
        isOn: false
      }
    ],
    //市级联动js
    item: {
      show: show
    }

  },

  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  }
  ,
  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  }
  ,
  more:function(e){
    this.setData({
      addr:e.detail.value
    })
  },

  onLoad: function (e) {
   var addrId= e.addrId
   var that = this
   var parms = {}
   parms.addrId = addrId
   wx.request({
     url: api + '/api/address/get',
     data: {
       parms: parms
     },
     header: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     success: function (res) {

       that.setData({
         addr: res.data.getaddr.addr,
         city: res.data.getaddr.city,
         mobile: res.data.getaddr.mobile,
         userName: res.data.getaddr.name,
         province: res.data.getaddr.province,
         defAddr: res.data.getaddr.defAddr,
         region: res.data.getaddr.region,
         addrId: addrId
       })
     }
   })
  },
  put: function () {
    var myaddress="0"
    var that = this
    var parms = {}
    var address = {}
    var addrId = that.data.addrId
    // 判断手机号合格
    var userName = this.data.userName;
    var mobile = this.data.mobile;
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    var defAddr = this.data.switchData["0"].isOn
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    parms.memberId = memberId
    if (defAddr == true) {
      defAddr = 1
    } else {
      defAddr = 0
    }

 if (mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
      })

      return false
    }
    else if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    var province = this.data.province
    var city = this.data.city
    var county = this.data.county
    if (province == undefined & city == undefined & county == undefined) {
      wx.showToast({
        title: '请选择您的地址！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    // https请求
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    address.memberId = memberId
    address.name = userName
    address.mobile = mobile
    address.province = province
    address.city = city
    address.region = county
    address.addr = that.data.addr
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
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1500
        })
        wx.navigateBack({
          delta:1,
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
    })
  },
  //蓝色开关js
  tapSwitch: function (event) {
    var index = event.currentTarget.id - 1;
    this.data.switchData[index].isOn = !this.data.switchData[index].isOn
    this.setData({
      switchData: this.data.switchData
    });
  },
  //市级联动js
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  onShareAppMessage: function () {


    withShareTicket: true

  },
  onReachBottom: function () {
  },
  nono: function () { },
cell: function () {
    wx.navigateBack({
      delta: 1
    })
  }
  


})
