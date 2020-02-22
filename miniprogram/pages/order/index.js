import { http } from '../../request'
//index.js
const app = getApp()

Page({
  data: {
    orders: [],
    isDispatcher: app.isDispatcher,
    statusMap: {
      orderd: '已下单',
      purchasing: '采购中',
      purchased: '已采购',
      dispatched: '已配送',
      done: '已完成',
      cancelled: '已取消',
    },
  },

  onLoad() {},

  onShow() {
    this.fetchOrderList()
    this.setData({
      isDispatcher: app.isDispatcher,
    })
  },

  async fetchOrderList() {
    const { list, err } = await http('getOrderList', {
      order_type: app.isDispatcher ? 'shopping_order' : 'history_order',
    })
    if (err) return
    this.setData({
      orders: list,
    })
  },

  add(e) {
    const { id } = e.currentTarget.dataset
    app.action = 'add'
    app.currentOrder = this.findOrder(id)
    wx.switchTab({
      url: `/pages/index/index`,
    })
  },

  update(e) {
    const { id } = e.currentTarget.dataset
    app.action = 'update'
    app.currentOrder = this.findOrder(id)

    wx.switchTab({
      url: `/pages/index/index`,
    })
  },

  findOrder(id) {
    return this.data.orders.find(item => item._id === id)
  },

  async cancel(e) {
    const { id } = e.currentTarget.dataset
    const order = this.findOrder(id)
    order.status = 'cancelled'
    const { err } = await http('addOrUpdateOrder', { order })
    if (!err) {
      this.fetchOrderList()
    }
  },

  async buy(e) {
    const { id } = e.currentTarget.dataset
    const order = this.findOrder(id)
    order.status = 'purchased'
    const { err } = await http('addOrUpdateOrder', { order })
    if (!err) {
      this.fetchOrderList()
    }
  },

  async dispatch(e) {
    const { id } = e.currentTarget.dataset
    const order = this.findOrder(id)
    order.status = 'dispatched'
    const { err } = await http('addOrUpdateOrder', { order })
    if (!err) {
      this.fetchOrderList()
    }
  },

  checkboxChange(data) {
    console.log('data', data)
  },
})
