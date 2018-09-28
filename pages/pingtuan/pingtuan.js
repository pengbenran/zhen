var apimg = getApp().globalData.apimg;
const app = getApp()
Page({
  //页面的初始化数据
  data: {
    spell:"../../image/组27.png",
    down:"../../image/组28.png",
    
    char_lt: "去看看 >>",
    //列表商品数据


    phone: [
      {
        codImgs: "/image/图层7.png",
        copy: "这是文案文案文案这是文案文案文案",
        money: "￥998.00",
        discountmoney: "￥1200.00"
      },
      {
        codImgs: "/image/图层9.png",
        copy: "这是文案文案文案这是文案文案文案",
        money: "￥998.00",
        discountmoney: "￥1200.00"
      }
    ],

  },


  onShareAppMessage: function () {


    withShareTicket: true

  },
  
})