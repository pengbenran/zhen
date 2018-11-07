// pages/memberconsume/memberconsume.js
var apimg = getApp().globalData.apimg;
//获取应用实例
var api = getApp().globalData.api;
const request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expense:[],
    shareProfit:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getexpense(0, 8, options.lvtype, options.memberId)
   
  },
  getexpense: function (offset, limit, lvType, memberId){
    let params = {};
    let data = {};
    let that = this;
    params.offset = offset;
    params.limit = limit;
    params.memberId = memberId
    params.lvType=lvType
    data.params = JSON.stringify(params)
    request.moregets('/api/distribe/expense', data).then(function (res) {
      let composeList = []
      composeList = that.data.expense.concat(res.expense.rows)
      that.setData({
        expense: composeList,
        shareProfit: res.shareProfit
      })

    })
  }
})