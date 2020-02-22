//index.js
const app = getApp()

Page({
  data: {
    formData: {},
    goods: [{ name: '', number: 1 }],
    action: 'add',
    orderId: null
  },

  onLoad() {},

  onShow() {
    this.onGetOpenid()

    console.log('app.action', app.action)
    console.log('app.currentOrder', app.currentOrder)
    const { action, currentOrder } = app
    if (action) {
      this.setData({
        action,
        goods: currentOrder.goods,
        orderId: currentOrder.id,
        formData: {
          orderer: currentOrder.orderer,
          phone_number: currentOrder.phone_number,
        },
      })
    }
    



    app.action = null
    app.currentOrder = null
  },

  submitForm() {
    console.log('this.data.formData', this.data)
  },

  addItem() {
    const item = { name: '', count: 1 }
    const index = this.data.goods.length
    this.setData({
      [`goods[${index}]`]: item,
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
      name: 'login',
      data: {a:123},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})
