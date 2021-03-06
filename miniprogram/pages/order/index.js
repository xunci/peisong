import { http } from '../../request'
//index.js
const app = getApp()

Page({
  data: {
    orders: [],
    isDispatcher: app.isDispatcher,
    statusMap: {
      orderd: '待采购',
      purchasing: '采购中',
      purchased: '待配送',
      dispatched: '已配送',
      done: '已完成',
      cancelled: '已取消',
    },
    status: 'orderd',
  },

  onLoad() {},

  onShow() {
    this.fetchOrderList()
    this.setData({
      isDispatcher: app.isDispatcher,
    })
  },

  async fetchOrderList() {
    const { status } = this.data
    let order_type = 'shopping_order'
    if (status === 'orderd') {
      order_type = 'shopping_order'
    } else if (status === 'purchased') {
      order_type = 'dispatching_order'
    } else {
      order_type = status
    }
    const { list, err } = await http('getOrderList', {
      order_type: app.isDispatcher ? order_type : 'history_order',
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

  checkboxChange(e) {
    const { index, idx } = e.target.dataset
    const { checked } = e.detail

    this.setData({
      [`orders[${index}].goods[${idx}].status`]: checked ? 'in_stock' : 'out_of_stock',
    })
  },

  showSelect() {
    const that = this
    // const status = ['orderd', 'purchasing', 'purchased', 'dispatched', 'done', 'cancelled']
    const status = ['orderd', 'purchased']
    wx.showActionSheet({
      // itemList: ['待采购', '采购中', '已采购', '已配送', '已完成', '已取消'],
      itemList: ['待采购', '待配送'],
      success(res) {
        that.setData({
          status: status[res.tapIndex],
        })

        that.fetchOrderList()
      },
      fail(res) {
        console.log(res.errMsg)
      },
    })
  },
})
