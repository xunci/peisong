// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

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
    .catch(err => {
      err_log = err
    })
  return {
    dispatcher:isDispatcher
  }
}
