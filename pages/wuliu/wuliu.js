var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
// pages/my/my.js
Page({

  data: {
    processData: [{
      name: '已发货',
      addree:'北京市',
      start: '#fff',
      end: '#d3d3d3',
      corl:'#22b3ff',
      icon: 'https://shop.yogain.cn/simages/images/wuliu/zu1.png'
    },
    {
      name: '运输中',
      start: '#d3d3d3',
      end: '#d3d3d3',
      icon: 'https://shop.yogain.cn/simages/images/wuliu/zu3.png'
    },
    {
      name: '派件中',
      start: '#d3d3d3',
      end: '#d3d3d3',
      icon: 'https://shop.yogain.cn/simages/images/wuliu/zu3.png'
    },
    {
      name: '已签收',
      addree: '深圳市',
      start: '#d3d3d3',
      end: '#fff',
      icon: 'https://shop.yogain.cn/simages/images/wuliu/zu3.png'
    }],
  },

  setPeocessIcon: function () {
    var index = 3//记录状态为1的最后的位置
    var processArr = this.data.processData
    // console.log("progress", this.data.detailData.progress)
    for (var i = 0; i < this.data.detailData.progress.length; i++) {
      var item = this.data.detailData.progress[i]
      processArr[i].name = item.word
      if (item.state == 1) {
        index = i
        processArr[i].icon = "https://shop.yogain.cn/simages/images/wuliu/zu1.png"
        processArr[i].start = "#45B2FE"
        processArr[i].end = "#45B2FE"
      } else {
        processArr[i].icon = "https://shop.yogain.cn/simages/images/wuliu/zu1.png"
        processArr[i].start = "#EFF3F6"
        processArr[i].end = "#EFF3F6"
      }
    }
    processArr[index].icon = "https://shop.yogain.cn/simages/images/wuliu/zu1.png"
    processArr[index].end = "#EFF3F6"
    processArr[0].start = "#fff"
    processArr[this.data.detailData.progress.length - 1].end = "#fff"
    this.setData({
      processData: processArr
    })
  },
  onLoad: function (options) {
    var that = this
    var parms = {}
    var orderId = options.orderId
    var image = options.image
    parms.orderId = orderId
    parms = JSON.stringify(parms)
    wx.request({
      url: api + '/api/order/logistics',
      data: {
        parms: parms
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var express =JSON.parse(res.data.express)
        that.setData({
          data:res.data,
          express: express,
          image: image
        })

      },

    })
      this.setData({
        image: image,
        orderId:options.orderId
      })
  },
})