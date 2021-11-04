// https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

// in terminal run script with keys to bind the queue, for example "cat.animal", "dog.animal" and "bird"
// --> node receive_logs_topic.js cat.animal dog.animal

// run to see the all logs
// --> node receive_logs_topic.js "#"

// run to see the logs about animals
// --> node receive_logs_topic.js "*.animal"

// run to see the logs about multiple things
// --> node receive_logs_topic.js "bird" "cat.*"

const amqp = require('amqplib/callback_api')
const args = process.argv.slice(2)

if (args.length == 0) {
  console.log('Usage: receive_logs_topic.js <facility>.<severity>')
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

    const exchange = 'topic_logs'

    channel.assertExchange(exchange, 'topic', {
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

        args.forEach((key) => {
          channel.bindQueue(q.queue, exchange, key)
        })

        channel.consume(
          q.queue,
          (msg) => {
            console.log(
              " [x] %s:'%s'",
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
