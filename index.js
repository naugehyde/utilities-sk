
const nodemailer=require('nodemailer')
const openapi = require('./openapi.json');

module.exports = (app) => {
    async function sendEmail(transporter, req) {
        const info = await transporter.sendMail({
          from: req.smtp_user, // sender address
          to: req.recipients, // list of receivers
          subject: req.subject, // Subject line
          text: req.body, // plain text body
          html: req.htmlbody, // html body
        });
        return info
    }
    const plugin = {
      id: 'utilities-sk',
      name: 'Signalk Plugin Utilities',
      start: (settings, restartPlugin) => {
        const transporter = nodemailer.createTransport({
            host: settings.smtp_host,
            port: settings.smtp_port,
            secure: settings.smtp_port==465, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: settings.smtp_user,
              pass: settings.smtp_password,
            },
        })
        plugin.registerWithRouter = function(router) {
            router.put('/sendmail', (req, res) => {
              app.debug(req)
            });
          };
      },
      stop: () => {
      }
    };
    plugin.schema = {
        type: 'object',
        properties:{
            node_mailer:{
            type: 'object',
            title:'Node Mailer Configuration',
            required: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password'],
            properties: {
            smtp_host: {
                type: 'string',
                title: 'SMTP Host for sending email warning (e.g.: smtp.gmail.com)'
            },
            smtp_port: {
                type: 'number',
                title: 'SMTP Port (e.g.: 465 for secure, 587  for insecure)',
                default: 465
            },
            smtp_user:{
                type: 'string',
                title: 'SMTP user ID'
            },
            smtp_password:{
                type:'string',
                title: 'SMTP user password'
            }
        }
        }
        }
    }  
    plugin.getOpenApi = () => openapi;
    return plugin;
};