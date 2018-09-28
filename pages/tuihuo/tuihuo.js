// pages/tuikuan/tuikuan.js
var api = getApp().globalData.api;
var apis = getApp().globalData.apis;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    index: 0,//选择的下拉列表下标
    selectData: ["商品有问题", "买错/拍错", "发票问题","其他"],
  },

  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },

  onLoad: function (options) {
    var parms = {}
    var that = this
    var dd = JSON.parse(options.dd)
    parms.orderId = dd.orderId
    parms = JSON.stringify(parms)

    wx.request({
      url: api + '/api/order/orderIntRo',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'parms': parms
      },
      success: function (res) {
        that.setData({
          goodsAmount: res.data.orderDO.goodsAmount,
          dd: dd,
          data: res.data
        })
      }
    })
  },
  more: function (e) {
    var key = e.detail.value;
    this.setData({
      more: key,
    });
  },

  trues: function () {
    var parms = {}
    var that = this
    var applyReason = ""
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var index = this.data.index
    // if (index == 0) {
    //   applyReason = "商品质量有问题"
    // }
    // if(index == 1){
    //   applyReason="收到商品与描述不符"
    // }if(index==2){
    //   applyReason = "不喜欢/不想要"
    // } if (index == 3) {
    //   applyReason = "发票问题"
    // } if (index == 4) {
    //   applyReason = "快递没收到"
    // }
    // if (index == 5) {
    //   applyReason = "其他"
    // }



    if (index == 0) {
      applyReason = "商品有问题"
    } if (index == 1) {
      applyReason = "买错/拍错"
    }
    if (index == 2) {
      applyReason = "发票问题"
    }
    if (index == 3) {
      applyReason = "其他"
    }
    if (that.data.more == undefined) {
      wx.showModal({
        title: '提示',
        content: '请描述退货原因详情',
        success: function (res) {
          if (res.confirm) {

            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    var returnorder = {}
    returnorder.memberid = memberId
    returnorder.ordersn = that.data.dd.sn
    returnorder.sellbackAmount = that.data.goodsAmount
    returnorder.remark = that.data.more
    returnorder.show = that.data.show
    returnorder.applyReason = applyReason
    returnorder.orderId = that.data.dd.orderId
    returnorder.type = 1
    parms.returnorder = returnorder
    parms = JSON.stringify(parms)
    wx.request({
      url: api + '/api/order/returnOrder',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      data: {
        'parms': parms
      },
      success: function (res) {
        if (res.data.msg == 1) {
          wx.showToast({
            title: '申请成功',
          })
          wx.switchTab({
            url: '../my/my',
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})