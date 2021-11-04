// https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html

// in terminal run script
// --> node emit_log.js

// to see and save logs to a file
// --> node receive_logs.js > logs_from_rabbit.log

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const exchange = 'logs'
    const msg = process.argv.slice(2).join(' ') || 'Hello World!'

    channel.assertExchange(exchange, 'fanout', {
      durable: false,
    })

    channel.publish(exchange, '', Buffer.from(msg))   //  <-- the empty string as second parameter means that 
    console.log(' [x] Sent %s', msg)                  //  <-- we don't want to send the message to any specific queue
  })

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
