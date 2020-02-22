//index.js
const app = getApp()

Page({
  data: {
    orders: [
      { orderer: 'mjh', phone_number: '13333333333', status: '已下单', id: 1, goods: [
        { name: '土豆', number: 30 },
        { name: '白菜', number: '3斤' },
      ] },
      { orderer: 'mjh', phone_number: '13333333333', status: '已下单', id: 1, goods: [{ name: 'mjh', number: 30 }] },
    ],
  },

  onLoad() {},

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
})
