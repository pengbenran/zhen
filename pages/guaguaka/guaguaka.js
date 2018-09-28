const ctx = wx.createCanvasContext('myCanvas')
Page({

  data: {
    img: '../image/shouye01.png',

  },
  startX: 0, //保存X坐标轴变量
  startY: 0, //保存X坐标轴变量
  onReady: function () {
    ctx.setFillStyle('#EFEFEF')
    ctx.fillRect(0, 0, 240, 150.75)
    ctx.draw()
  },
  touchStart: function (e) {
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    ctx.save();  //保存当前坐标轴的缩放、旋转、平移信息
    ctx.beginPath() //开始一个路径 
    ctx.clearRect(startX1, startY1, 10, 10);
    ctx.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息

  },
  touchMove: function (e) {
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    ctx.save();  //保存当前坐标轴的缩放、旋转、平移信息
    ctx.moveTo(this.startX, this.startY);  //把路径移动到画布中的指定点，但不创建线条
    ctx.clearRect(startX1, startY1, 10, 10);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
    ctx.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
    this.startX = startX1;
    this.startY = startY1;
    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: ctx.getActions() // 获取绘图动作数组
    })
  },

})