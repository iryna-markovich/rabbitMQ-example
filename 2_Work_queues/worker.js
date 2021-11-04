// https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

// in terminal run script
// --> node worker.js

// open new terminal (or more) and run script in each terminal
// and sent some tasks to see how it will be shared between workers.
// --> node worker.js

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const queue = 'task_queue'

    channel.assertQueue(queue, {
      durable: true,
    })

    channel.prefetch(1);

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)

    channel.consume(
      queue,
      (msg) => {
        const secs = msg.content.toString().split('.').length - 1

        console.log(' [x] Received %s', msg.content.toString())

        setTimeout(() => {
          console.log(' [x] Done')
        }, secs * 1000)
      },
      {
        noAck: true,
      }
    )
  })
})
