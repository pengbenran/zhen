// pages/membermanage/membermanage.js
var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hei:[0,0,0],
    rot: [-90,-90,-90],
    animationData: {},
    Notforward: [],
    Alreadyforward: [],
    noUserforward: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var memberId = wx.getStorageSync('memberId')
    that.setData({
      memberId: memberId,
    })
    wx.request({
      url: api + '/api/distribe/accountManagement',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        memberId: that.data.memberId
      },
      success: function (res) {
      //  console.log(res.data.statusNo[0].withdrawTime.split(' ')[0]
        if(res.data.code==0){
          that.setData({
            Notforward: res.data.statusNo,
            Alreadyforward: res.data.statusSucceed, //累计到账金额
            noUserforward: res.data.statusFail,//资产总计
          })
        }   
      }
    })

  },
  change:function(e){
    var that=this;
    var idx = e.currentTarget.dataset.index,
      key1 = "hei[" + idx + "]",
      rotkey1 = "rot[" + idx + "]"
    var datalenght = 0;
    if(that.data.hei[idx]==0){
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 1000,
        timingFunction: "ease",
        delay: 0
      })
      this.animation = animation
      animation.rotate(90).step()
      this.setData({
        animationData: animation.export()
      })
      for (var i = 0; i < that.data.hei.length; i++) {
        var key = "hei[" + i + "]"
        var rotkey = "rot[" + i + "]"
        that.setData({
          [key]: 0,
          [rotkey]: -90
        })
      }

      if (idx == 0) {
        datalenght = that.data.Notforward.length
      }
      else if (idx == 1) {
        datalenght = that.data.Alreadyforward.length
      } else {
        datalenght = that.data.noUserforward.length
      }

      that.setData({
        [key1]: 80 * datalenght,
        [rotkey1]: 0
      })
    }
   else{
      that.setData({
        [key1]:0,
      })
   }
  }
})