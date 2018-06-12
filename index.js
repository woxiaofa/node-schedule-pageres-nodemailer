const Pageres = require('pageres')
const nodemailer = require('nodemailer')
const schedule = require('node-schedule')

//发邮件配置
var transporter = nodemailer.createTransport({
  //我这里的默认直接给了QQ邮箱的个人用户是在设置-账户【POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务】；企业邮箱是设置【客户端设置】
  host: 'smtp.exmail.qq.com',
  secure: true,
  port: 465,
  auth: {
    user: '', //发邮件的邮箱号如123@abc.com
    pass: '' //上面邮箱的密码——共享给别人代码记得删除
  },
  debug: true // include SMTP traffic in the logs
})
// 延迟配置
var rule = new schedule.RecurrenceRule()
// 这个时间可以到官方文档查看有各种循环定时范围等，可以直接拿来
rule.second = 20

var j = schedule.scheduleJob(rule, function() {
  //直接把pageres的Usage拿来，除了最后一行注释掉了
  const pageres = new Pageres({ delay: 2 })
    .src('baidu.com', ['1600x900', 'iphone 6p'])
    // 可以只截图一个网站也可以多个
    .src('qq.com', ['1600x900'])
    .dest(__dirname)
    .run()
    // .then(() => console.log('图片导出完成'))

    .then(img => {
      // 邮件标题内容
      var message = {
        from: '', //发邮件的邮箱号如123@abc.com
        to: '', //收件人邮箱
        // cc: 123@abc.com抄送 密送等都有可以查看邮件的官网文档
        subject: '网站截图', //邮件标题
        html:
          '网站截图：<img src="cid:baidu"/><img src="cid:baidutest"/>啦啦啦后面可以继续加图片文字任何东西<img src="cid:qq"/>', //邮件内容

        attachments: [
          {
            filename: 'baidu.com-1600x900',
            path: __dirname + '/baidu.com-1600x900.png',
            cid: 'baidu' // 唯一就行随便和上面的图片里img里对应
          },
          //多个附件，删除的话记得删上面的 逗号
          {
            filename: 'baidu.com-1600x900',
            path: __dirname + '/baidu.com-1600x900.png',
            cid: 'baidutest' // 唯一就行随便
          },
          {
            filename: 'qq.com-1600x900',
            path: __dirname + '/qq.com-1600x900.png',
            cid: 'qq' // 唯一就行随便
          }
        ]
      }
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log('错误')
          console.log(error.message)
          return
        }
        console.log('信息发送成功!')
        console.log('服务器响应 "%s"', info.response)
        transporter.close()
      })
    })
    .catch(err => {
      throw err
    })
})
