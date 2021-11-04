// https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html

// in terminal run script with key to direct the queue, for example "cat.animal" or "dog.animal" or "bird"
// the second arg is the message, by default it is "Hello world!"
// --> node emit_log_topic.js cat.animal "Hey, kitty!"
// --> node emit_log_topic.js dog.animal
// --> node emit_log_topic.js bird

// try to run script with another key or not provide anything
// --> node emit_log_topic.js hey
// --> node emit_log_topic.js

// run to see the all logs
// --> node receive_logs_topic.js "#"

// run to see the logs about animals
// --> node receive_logs_topic.js "*.animal"

// run to see the logs about multiple things
// --> node receive_logs_topic.js "bird" "cat.*"

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const exchange = 'topic_logs'
    const args = process.argv.slice(2)
    const key = args.length > 0 ? args[0] : 'anonymous.info'
    const msg = args.slice(1).join(' ') || 'Hello World!'

    channel.assertExchange(exchange, 'topic', {
      durable: false,
    })

    channel.publish(exchange, key, Buffer.from(msg))
    
    console.log(" [x] Sent %s:'%s'", key, msg)
  })

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
