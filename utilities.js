const nodemailer=require('nodemailer')
const fs = require('fs');
const path = require('path');

var singleton = {
    configured: false,
    configure: function(config){
        if (this.configured) return
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
        configured=true
    },
    reconfigure: function(config){
        this.configured=false
        this.configure(config)
    },

    sendmail: async function(req) {
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
    },
/**
 * Load the .js classes in a given directory and return a map of classes
 * @param {string} dir - the directory from which to load classes
 * @param {string} [ext='.js'] - optional file extension
 * @returns {Map} - Map of class names to classes 
 */

    loadSubclasses: function(dir, ext='.js')
    {
        const classMap = new Map()
        const classFiles = fs.readdirSync(dir)
        .filter(file => file.endsWith(ext));
    
        classFiles.forEach(file => {
            const filePath = path.join(dir, file);
            const cls = require(filePath);
            classMap.set(cls.name, cls);
        })
        return classMap
    }
       
}
module.exports = singleton