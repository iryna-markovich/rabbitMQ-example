// https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html

// in terminal run script with key to direct the queue, for example "cat" or "dog"
// the second arg is the message, by default it is "Hello world!"
// --> node emit_log_direct.js cat "Hey, kitty!"
// --> node emit_log_direct.js dog

// try to run script with another key or not provide anything
// --> node emit_log_direct.js hey
// --> node emit_log_direct.js

// run to see the logs in file by provided keys
// --> node receive_logs_direct.js cat dog > logs_from_rabbit.log

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const exchange = 'direct_logs'
    const args = process.argv.slice(2)
    const msg = args.slice(1).join(' ') || 'Hello World!'
    const severity = args.length > 0 ? args[0] : 'info'
    
    channel.assertExchange(exchange, 'direct', {
      durable: false,
    })
    channel.publish(exchange, severity, Buffer.from(msg))

    console.log(" [x] Sent %s: '%s'", severity, msg)
  })

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
