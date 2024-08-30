const nodemailer=require('nodemailer')

var singleton = {
    configure: function(config){
        if (config.node_mailer){
             this.user = config.node_mailer.smtp_user
             this.transporter= nodemailer.createTransport({
                host: config.node_mailer.smtp_host,
                port: config.node_mailer.smtp_port,
                secure: config.node_mailer.smtp_port==465, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: config.node_mailer.smtp_user,
                    pass: config.node_mailer.smtp_password,
                }
                })
            }
    },
    sendmail:
    async function(req) {
        if (typeof this.transporter  == 'undefined')
            throw new Error('SK_utilities not configured for sendmail')
        const info = await this.transporter.sendMail({
          from: this.user, // sender address
          to: req.to, // list of receivers
          subject: req.subject, // Subject line
          text: req.text, // plain text body
          html: req.html, // html body
        });
        return info
    }
       
}
module.exports = singleton