
const openapi = require('./openApi.json');
const utilities= require('./utilities.js')

module.exports = (app) => {

    const plugin = {
      id: 'utilities-sk',
      name: 'Signalk Plugin Utilities',
      start: (settings, restartPlugin) => {
        utilities.configure(settings)
        plugin.registerWithRouter = function(router) {
            router.post('/sendmail', async (req, res) => {
              const info= await utilities.sendmail(req.body)
              app.debug(info.response)
              res.json({message: info.response})

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