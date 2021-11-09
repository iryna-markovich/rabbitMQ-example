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
      durable: true,      // <-- make sure that the queue will survive a RabbitMQ node restart.
    })                    // <-- you cant redefine queue as durable, if it was not durable previosly

    channel.prefetch(1);  // <-- this tells RabbitMQ not to give more than one message to a worker at a time. 
                          // <-- Or, in other words, don't dispatch a new message to a worker until it has 
                          // <-- processed and acknowledged the previous one. 

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)

    channel.consume(
      queue,
      (msg) => {
        const secs = msg.content.toString().split('.').length - 1

        console.log(' [x] Received %s', msg.content.toString())

        setTimeout(() => {
          console.log(' [x] Done')
          channel.ack(msg)
        }, secs * 1000)
      },
      {
        noAck: true,     // <-- using this code we can be sure that even if you kill a worker using CTRL+C while
      }                  // <-- it was processing a message, nothing will be lost. Soon after the worker dies 
    )                    // <-- all unacknowledged messages will be redelivered.
  })
})
