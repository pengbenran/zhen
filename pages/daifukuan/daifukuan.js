var apimg = getApp().globalData.apimg;
var api = getApp().globalData.api;
Page({
  data: {
    "completeimg": [apimg+"/images/quzhifu/shang.png"],
    cellimg:apimg+"/image/quxiaoyemian/zu28.png",
    "toptext1": ["手机专卖商城"],
    "toptext2": ["待付款"],
    "bootom1": ["订单编号：454485654564"],
    "box2": ["/image/shouye/zu9.png"],
    "title": ["vivo X20双摄头智能大屏手机前置2000万像素"],
    "context2": ["20只/盒"],
    "price":["998.00"],
    "kan":["1200.00"],
    "num":["2"],
    "yun":["5.00"],
    "del": ["取消订单"],
    "yes": ["确认付款"],
    "prompt": ["订单还未付款，确定取消吗？"],
    "dellt": ["取消订单"],
    "think": ["在考虑一下"]
    },
  onLoad: function () {
    var parms = {}
    try {
      var memberId = wx.getStorageSync('memberId')
      if (memberId) {
        memberId: memberId
      }
    } catch (e) {
    }
    var stastus = 0
    parms.memberId = memberId
    parms.stastus=stastus
    /**  
     * 获取用户信息  
     */
    var that = this//不要漏了这句，很重要
    wx.request({
      url: api + '/api/order/orderList',
      data: {
        parms: parms
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          orderList: res.data.orderList
          //res代表success函数的事件对，data是固定的

        })
      },
    })
  },
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
  // 模态框js
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  onShareAppMessage: function () {


    withShareTicket: true

  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    //弹出取消成功  
    if (currentStatu == "close1") {
      this.setData(
        {
          showModalStatus: false,
          
        },
        // 添加取消成功的消息提示框
        wx.showToast({
          title: "取消成功",
          icon: "success",
          durantion: 2000
        })
      );
    }
  }

})