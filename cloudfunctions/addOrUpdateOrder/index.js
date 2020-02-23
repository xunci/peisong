// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "maicai-mjh-m1q9t",//这个就是环境id
})
const db = cloud.database()

var statuses = ["orderd", "purchasing", "purchased", "dispatched", "done", "cancelled"]

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _openid = wxContext.OPENID
  console.log("event ", event)

  if (statuses.indexOf(event.order.status) == -1) {
    return {
      err: "status is not correct",
      status: "fail"
    }
  }

  const _ = db.command
  var _err = ""
  var _status = ""

  if ( event.order== null ) {
    _err = "order is null"
    _status = "fail"
    return {
      err: _err,
      status: _status
    }
  }

  var isDispatcher = false

  await db.collection('dispatcher')
    .where({
      openid: _.eq(wxContext.OPENID)
    })
    .get()
    .then(res => {
      res_log = res
      isDispatcher = (res.data.length != 0)
    })
  
  var _handType = "add" 

  await db.collection("order")
  .where({
    _id: event.order._id
  })
  .count()
  .then( res => {
    if (res.total > 0) {
      _handType = "update"
    }
    console.log("order cnt ", res)
  })
  if (!isDispatcher && event.order.status != "orderd" && _handType == "update") {
    _err = "the order is not editable"
    _status = "fail"
    return {
      err: _err,
      status: _status
    }
  }

  var id = event.order._id
  delete event.order._id
  event.order.hand_time = new Date()
  event.order.handler = _openid
  if (_handType == "add") {
    event.order.openid = _openid
    await db.collection("order").add({
      data:event.order
    })
    .then(res => {
      console.log("order add ", res)
    })
  } else {
    console.log("event.order before update ", event.order)
    await db.collection("order")
    .where({
      _id: id
    })
    .update({
      data : event.order,
    })
    .then(res => {
      console.log("order update ", res)
    })
  }

  db.collection("log").add({
    data: {
      openid: wxContext.OPENID,
      handType: _handType,
      data: event.order,
      time: new Date().toLocaleTimeString(),
      order_id: id

    }
  })
  .then(res => {
      console.log("order add ", res)
  })

  return {
    status:_status,
    err:_err
  }
}