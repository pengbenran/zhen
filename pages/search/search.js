var apimg = getApp().globalData.apimg;
var app = getApp();
var api = getApp().globalData.api;
// pages/search/search.js
Page({
  data:{
    focus:true,
    hotKeyShow:true,
    historyKeyShow:true,
    hide:true,
    searchValue:'',
    page:0,
    productData:[],
    historyKeyList:[],

  },
  onShareAppMessage: function () {


    withShareTicket: true

  },

  //取消返回js
  cell: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  serarchkey:function(e){
    this.setData({
      serarchkey: e.detail.value
    })
  },

  indexsou: function (e) {
    var that = this;
    var parms = {}
    var hide = that.data.hide
    parms.condition = that.data.serarchkey
    wx.request({
      url: api + '/api/Goods/selectIndexGoods',
      data: {
        parms: parms
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == "1") {
          hide = false
        }else if(res.data.code=="0") {
          hide = true
        }
        if (res.data.goodsList.length == 0) {
          hide = false
        }else{
          hide=true
        }
        that.setData({
          goodsList: res.data.goodsList,
          code: res.data.code,
          hide: hide,
        });
      },
      fail: function (e) {
        // wx.showToast({
        //   title: '网络异常！',
        //   duration: 2000
        // });
      },
    })
  },
  onLoad:function(options){
    var that = this;
    wx.request({
      url: api +"/api/brand/getSearchList",
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code!=1){
        that.setData({
          random: res.data.random
        });
        }
        else{

        }
      },
      fail:function(e){
        // wx.showToast({
        //   title: '网络异常！',
        //   duration: 2000
        // });
      },
    })
  },
  taps :function(){
    var that = this;
    wx.request({
      url: api + "/api/brand/randomList",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          random: res.data.random,
          goodsList: res.data.goodsList,
          code:res.data.code
        });
      },
      fail: function (e) {
        // wx.showToast({
        //   title: '网络异常！',
        //   duration: 2000
        // });
      },
    })
  },
  onReachBottom:function(){
      //下拉加载更多多...
      this.setData({
        page:(this.data.page+10)
      })
      
     
  },

  tiao:function(e){

    var goodsId = e.currentTarget.id;
    wx.navigateTo({
      url: '../group/group?goodid=' + goodsId,
    })
  },
  doKeySearch:function(e){
    var brandId = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../phonefenlei/phonefenlei?brandId='+brandId,
    })
    this.setData({
    });

    this.data.productData.length = 0;
   
  },
  doSearch:function(){
    var searchKey = this.data.searchValue;
    if (!searchKey) {
        this.setData({
            focus: true,
            hotKeyShow:true,
            historyKeyShow:true,
        });
        return;
    };

    this.setData({
      hotKeyShow:false,
      historyKeyShow:false,
    })
    
    this.data.productData.length = 0;
   

    this.getOrSetSearchHistory(searchKey);
  },
  getOrSetSearchHistory:function(key){
    var that = this;
    wx.getStorage({
      key: 'historyKeyList',
      success: function(res) {
          console.log(res.data);

          //console.log(res.data.indexOf(key))
          if(res.data.indexOf(key) >= 0){
            return;
          }

          res.data.push(key);
          wx.setStorage({
            key:"historyKeyList",
            data:res.data,
          });

          that.setData({
            historyKeyList:res.data
          });
      }
    });
  },
  searchValueInput:function(e){
    var value = e.detail.value;
    this.setData({
      searchValue:value,
    });
    if(!value && this.data.productData.length == 0){
      this.setData({
        hotKeyShow:true,
        historyKeyShow:true,
      });
    }
  },

  //点击加载更多
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/getlist',
      method: 'post',
      data: {
        page: page,
        brand_id: that.data.op_brand_id,
        cat_id: that.data.op_cat_id,
        ptype: that.data.op_ptype
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var prolist = res.data.pro;
        if (prolist == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page + 1,
          shopList: that.data.shopList.concat(prolist)
        });
        //endInitData
      },
      fail: function (e) {
        // wx.showToast({
        //   title: '网络异常！',
        //   duration: 2000
        // });
      }
    })
  },
});