//index.js
const app = getApp()

Page({
  data: {
    orders: [],
    isDispatcher:app.isDispatcher
  },

  onLoad() {},

  onShow() {
    this.fetchOrderList()
  },

  fetchOrderList() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getOrderList',
      data: {
        order_type: 'history_order',
      },
      success: res => {
        console.log('getOrderList', res.result)
        const { err, list } = res.result
        if (err) return
        this.setData({
          orders: list,
        })
      },
      fail: err => {
        console.error('[云函数] [getOrderList] 调用失败', err)
      },
    })
  },

  add(e) {
    const { id } = e.currentTarget.dataset
    app.action = 'add'
    app.currentOrder = this.data.orders.find(item => item.id === id)
    wx.switchTab({
      url: `/pages/index/index`,
    })
  },

  update(e) {
    const { id } = e.currentTarget.dataset
    app.action = 'update'
    app.currentOrder = this.data.orders.find(item => item.id === id)

    wx.switchTab({
      url: `/pages/index/index`,
    })
  },

  cancel(e) {
    const { id } = e.currentTarget.dataset
    console.log('id', id)
  },

  checkboxChange(data){
    console.log('data', data)
  }
})
