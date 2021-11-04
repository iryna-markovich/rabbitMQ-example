// https://www.rabbitmq.com/tutorials/tutorial-four-javascript.html

// in terminal run script with keys to bind the queue, for example "cat" and "dog"
// --> node receive_logs_direct.js cat dog

// run to see the logs in file by provided keys
// --> node receive_logs_direct.js cat dog > logs_from_rabbit.log

const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)

if (args.length == 0) {
  console.log('Usage: receive_logs_direct.js [info] [warning] [error]')
  process.exit(1)
}

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const exchange = 'direct_logs'

    channel.assertExchange(exchange, 'direct', {
      durable: false,
    })

    channel.assertQueue(
      '',
      {
        exclusive: true,
      },
      (error2, q) => {
        if (error2) {
          throw error2
        }

        console.log(' [*] Waiting for logs. To exit press CTRL+C')

        args.forEach((severity) => {
          channel.bindQueue(q.queue, exchange, severity)
        })

        channel.consume(
          q.queue,
          (msg) => {
            console.log(
              " [x] %s: '%s'",
              msg.fields.routingKey,
              msg.content.toString()
            )
          },
          {
            noAck: true,
          }
        )
      }
    )
  })
})
