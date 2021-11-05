// https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

// in terminal run these scripts with different args
// --> node new_task.js task_1
// --> node new_task.js task_2

// to fake complexity of the tasks we will use dots, so ... - it takes 3 seconds to done
// --> node new_task.js task_3...
// --> node new_task.js task_4..........

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
    const msg = process.argv.slice(2).join(' ') || 'Hello World!'

    channel.assertQueue(queue, {
      durable: true,                 // <-- make sure that the queue will survive a RabbitMQ node restart.
    })                               // <-- you cant redefine queue as durable, if it was not durable previosly

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,              // <-- marking messages as persistent doesn't fully guarantee that a message
    })                               // <-- won't be lost. Although it tells RabbitMQ to save the message to disk,
                                     // <-- there is still a short time window when RabbitMQ has accepted a message
                                     // <-- and hasn't saved it yet

    console.log(" [x] Sent '%s'", msg)

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)
  })
})
