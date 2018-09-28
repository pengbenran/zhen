var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
var zhihu=""
Page({
  data: {
    yes:apimg+"/images/quzhifu/shang.png",
    ind:apimg+"/images/quzhifu/8.png",
    
    cartgoods: [],
    startX: 0, //开始坐标
    startY: 0,
    hasList:true,
    selected:true,
    "selects":[],
    edit:true,
  },
  // 编辑跳转删除页面js
  toast: function (e) {
    wx.navigateTo({
      url: '../shopingcart/shopingcart',
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
  edit:function(){
   var edit=this.data.edit
    if(edit==true){
        edit=!this.data.edit
 
    }else{
        edit=!this.data.edit
    }
    this.setData({
      edit:edit
    })
  },
  // 去结算跳转js
  next: function () {
    var that = this
    let total = 0;
    var weight=0;
    var aa = {};
    var gainedpoint = 0;
    var googitem = [];
    var Goods = {};
    var gooditemString = gooditemString
    var shippingAmount = 0
   var orderAmount = that.data.totalPrice
   var totalPrice = that.data.totalPrice
   var goodsAmount = that.data.totalPrice
    var cartgoods = that.data.cartgoods;                  // 获取购物车列表
    for (let i = 0; i < cartgoods.length; i++) {         // 循环列表得到每个数据
      if (cartgoods[i].selected) {                // 判断选中      
        cartgoods[i].cart = 1,
        googitem.push(cartgoods[i])
        gainedpoint += cartgoods[i].point 
        total  += cartgoods[i].num * cartgoods[i].price;   
        weight += cartgoods[i].num * cartgoods[i].weight;     
      }
      Goods.googitem = googitem
      Goods.weight = weight
      Goods.gainedpoint = gainedpoint
      Goods.goodsAmount = goodsAmount
      Goods.shippingAmount = 0
      Goods.orderAmount = that.data.orderAmount
      Goods.gainedpoint = gainedpoint
      gooditemString = JSON.stringify(Goods)
    }
    that.setData({
      totalPrice: total.toFixed(2)
    })
    if (googitem.length == "") {
      wx.showToast({
        title: "请选择订单",
        icon: "success",
        durantion: 2000
      })
    } else {
     
      wx.navigateTo({
        url: "../dingdan/dingdan?gooditem=" + gooditemString + '&cart=1',
        success: function (res) {
          that.setData({
            selectAllStatus: false,
             totalPrice: 0.00,    
          })
        },
        fail: function () {
          // fail
        },
        complete: function () {
        }
      })
    }
  },
  onLoad: function () {
    var parms = {}
    var hasList = this.data.hasList
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    } 
    try {
      var indexdata = wx.getStorageSync('indexdata')
      if (indexdata) {
        indexdata: indexdata
      }
    } catch (e) {
    }
    parms.memberId = memberId
    // var parms = JSON.stringify(parms)
    var that = this//不要漏了这句，很重要
      wx.request({
        url: api +'/api/shoppingCart/select',
      data:{
        parms: parms
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if(res.data.code != 1){
        that.setData({
          cartgoods: res.data.cartgoods,
          code:res.data.code,
            selectAllStatus: false,
            totalPrice: 0.00,
            indexdata: indexdata
          //res代表success函数的事件对，data是固定的

        })
        }
        if(res.data.code==1){
          that.setData({
            indexdata: indexdata,
            hasList: false,
            totalPrice: 0.00,
          })
        }else{
          that.setData({
            indexdata: indexdata,
            hasList: true
          })
        }
      },
    })
      that.setData({

      })
    },
  //事件处理函数  
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow() {
    var that = this;
    that.onLoad()
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组） 
    var arr = that.data.cartgoods; 
    if( arr != undefined){
      // 有数据的话，就遍历数据，计算总金额 和 总数量  
      if (arr.length > 0) {
        for (var i in arr) {
          // that.data.total += Number(arr[i].price) * Number(arr[i].count);
          // that.data.goodsCount += Number(arr[i].count);
        }
        // 更新数据  
        this.setData({
          hasList: true,
          iscart: true,
          cartgoods: arr,
          // total: that.data.total,
          // goodsCount: that.data.goodsCount
        });
      }
    }
    
    this.getTotalPrice();
  },
  // 
  selectList(e) {
    this.data.selects = e.target.id;
    const index = e.currentTarget.dataset.index;
    let cartgoods = this.data.cartgoods;
    const selected = cartgoods[index].selected;
    cartgoods[index].selected = !selected;
    this.setData({
      cartgoods: cartgoods
    });
    this.getTotalPrice();
  },

  // 
  // 购物车全选事件
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let cartgoods = this.data.cartgoods;
    for (let i = 0; i < cartgoods.length; i++) {
      cartgoods[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      cartgoods: cartgoods
    });
    this.getTotalPrice();
  },

  /**
    * 绑定加数量事件
    */
  addCount(e) {
    var parms={}
    const index = e.currentTarget.dataset.index;
    let cartgoods = this.data.cartgoods;
    let num = cartgoods[index].num;
    var cartId = e.currentTarget.id
    var cart={}
      cart.cartId = cartId
      cart.num = num
      parms.cart = cart
      parms = JSON.stringify(parms)
      
    var that = this//不要漏了这句，很重要
    wx.request({
      url: api + '/api/shoppingCart/modification',
      data: {
        parms: parms
      },
      method: "PUT",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        num = num + 1;
        cartgoods[index].num = num;
        that.getTotalPrice();
        that.setData({
          cartgoods: cartgoods
        });
      }
    })
  },
  /**
     * 绑定减数量事件
     */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let cartgoods = this.data.cartgoods;
    let num = cartgoods[index].num;
    var cartId = e.currentTarget.id
    var parms={}
    var cart = {}
    var that = this
    cart.cartId = cartId
    cart.num = num
    parms.cart = cart
    parms = JSON.stringify(parms)
    cartgoods[index].num = num;
    wx.request({
      url: api + '/api/shoppingCart/modification',
      data: {
        parms: parms
      },
      method: "PUT",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (num <= 1) {
          return false;
        }
        num = num - 1;
        cartgoods[index].num = num;
        that.getTotalPrice();
        that.setData({
          cartgoods: cartgoods
        });
      }
    })
  },

  onShareAppMessage: function () {

    withShareTicket: true

  },
 /**
   * 计算总价
   */getTotalPrice() {
    let cartgoods = this.data.cartgoods;                  // 获取购物车列表
    let total = 0;
    if (cartgoods != undefined){
      for (let i = 0; i < cartgoods.length; i++) {         // 循环列表得到每个数据
        if (cartgoods[i].selected) {                     // 判断选中才会计算价格
          total += cartgoods[i].num * cartgoods[i].price;   // 所有价格加起来
        }
      }
      this.setData({                                // 最后赋值到data中渲染到页面
        cartgoods: cartgoods,
        // totalPrice: total.toFixed(2)
        totalPrice: total
      });
    }
  },



  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.cartgoods.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cartgoods: this.data.cartgoods
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.cartgoods.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      cartgoods: that.data.cartgoods
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    this.data.cartgoods.splice(e.currentTarget.dataset.index, 1)
    var parms={}
    var cart = {}
    var cartId = e.currentTarget.id
    cart.cartId=cartId
    parms.cart=cart
    parms = JSON.stringify(parms)
    var that = this
    wx.request({
      url: api + '/api/shoppingCart/delete',
      data: {
        "parms": parms
      },
      method: "POST",
      header: {
        
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          cartgoods: that.data.cartgoods,
          code:res.data.code
        });
        that.getTotalPrice();
      }
    })
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
  deled: function (e) {
    var parms = {}
    var totalPrice = this.data.totalPrice
    var cartIdgood=[]
    var edit=this.data.edit
    var cart = {}
    for (let i = 0; i < this.data.cartgoods.length; i++) {         // 循环列表得到每个数据
      if (this.data.cartgoods[i].selected) {                     // 判断选中
        cartIdgood.push(this.data.cartgoods[i].cartId)   
      }
    }
    parms.cartS = cartIdgood
    parms = JSON.stringify(parms)
    var that = this
    wx.request({
      url: api + '/api/shoppingCart/deleteAll',
      data: {
        "parms": parms
      },
      method: "POST",
      header: {

        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          cartgoods: that.data.cartgoods,
          selectAllStatus:false,
          edit: !edit,
          totalPrice:0.00,

        });
        that.onLoad()
      }

    })
  }
})
