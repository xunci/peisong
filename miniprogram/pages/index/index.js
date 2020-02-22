import { http } from '../../request'
//index.js
const app = getApp()
const goodsItem = {
  name: '',
  number: '1',
  note: '',
  stats: '购买', //枚举： 已下单、已购买、无法购买
  handler: '',
  hand_time: '',
}
Page({
  data: {
    formData: {},
    goods: [{ ...goodsItem }],
    action: 'add',
    orderId: null,
  },

  onLoad() {
    wx.hideTabBar()
    this.getDispatcherInfo() // 判断是否配送人
  },

  onShow() {
    const { action, currentOrder } = app
    if (action) {
      this.setData({
        action,
        goods: currentOrder.goods,
        orderId: currentOrder._id,
        formData: {
          orderer: currentOrder.orderer,
          phone_number: currentOrder.phone_number,
        },
      })
    }

    app.action = null
    app.currentOrder = null
  },

  async getDispatcherInfo() {
    const { dispatcher } = await http('login')
    // const dispatcher = false
    app.isDispatcher = dispatcher
    if(dispatcher){
      wx.hideTabBar()
      wx.switchTab({
        url: `/pages/order/index`,
      })
    }else{
      wx.showTabBar()
    }
  },

  async submitForm() {
    const { formData, goods, action, orderId } = this.data
    const order = {
      _id: action === 'update' ? orderId : '',
      ...formData,
      goods,
      hand_time: '',
      handler: '',
      status: 'orderd', // 已下单、正在采购、已购买、已配送、完成
    }

    const { err } = await http('addOrUpdateOrder', { order })
    if (err) {
      wx.showToast({
        title: err,
        icon: 'none',
      })
    } else {
      wx.showToast({
        title: '添加成功',
      })
      wx.switchTab({
        url: `/pages/order/index`,
      })
    }
  },

  addItem() {
    const index = this.data.goods.length
    this.setData({
      [`goods[${index}]`]: { ...goodsItem },
    })
  },

  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value,
    })
  },

  goodsNameChange(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      [`goods[${index}].name`]: e.detail.value,
    })
  },

  goodsCountChange(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      [`goods[${index}].count`]: e.detail.value,
    })
  },

  onGetOpenid() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getOrderList',
      data: {
        order_type: 'history_order',
      },
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      },
    })
  },
})
