var apimg = getApp().globalData.apimg;
//市级联动js
var api = getApp().globalData.api;
var model = require('../../model/model.js')
var show = false;
var item = {};

Page({
  data: {
    iconed: apimg +"/images/myaddress/8.png",
    height: 20,
    userName:"",
    mobile:"",
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
  onShow:function(){
  },
  userNameInput:function(e){
    this.setData({
      userName: e.detail.value
    })
  }
,
mobileInput:function(e){
    this.setData({
      mobile:e.detail.value
    })
}
,
addrInput: function (e) {
  this.setData({
    addr: e.detail.value
  })
}
  ,

onShareAppMessage: function () {


  withShareTicket: true

},
  add: function () {
    var that = this
    var parms = {}
    
    var address = {}  
    var defAddr = this.data.switchData["0"].isOn
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    parms.memberId = memberId
if(defAddr==true){
  defAddr=1
}else{
  defAddr=0
}


    // 判断手机号合格
    var userName = this.data.userName;
    var mobile = this.data.mobile;
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;



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
    var addr = this.data.addr
    if (province == undefined & city == undefined & county == undefined){
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
    address.defAddr = defAddr
    address.name = userName
    address.mobile = mobile
    address.province = province
    address.city = city
    address.region = county
    address.addr = addr
    parms.address = address
    parms = JSON.stringify(parms)

    wx.request({
      url: api + '/api/address/add',
      data: {
        parms:parms
      },
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1500
        })
        wx.redirectTo({
          url: '../myaddresstwo/myaddresstwo',
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
  onReachBottom: function () {
  },
  nono: function () { },

//取消返回js
cell: function () {
      wx.navigateBack({
        delta: 1
      })
  }
})
