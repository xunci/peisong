// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "maicai-mjh-m1q9t",//这个就是环境id
})
const db = cloud.database()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async(event, context) => {
  console.log(event)
  console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const _ = db.command
  var isDispatcher = false
  var res_log = "mjh res"
  var err_log = "mjh err"

  await db.collection('dispatcher')
    .where({
      openid: _.eq(wxContext.OPENID)
    })
    .get()
    .then(res => {
      res_log = res
      isDispatcher = (res.data.length != 0)
    })


  console.log("debug log new date", new Date())
  console.log("debug log local", new Date().toLocaleTimeString())
  await db.collection("log").add({
    data: {
      openid: wxContext.OPENID,
      handType: "login",
      data: event,
      time: new Date(),
    }
  })
    .then(res => {
      console.log("order add ", res)
    })

    console.log("isDispatcher ", isDispatcher)

  return {
    dispatcher:isDispatcher
  }
}
