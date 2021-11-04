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
      durable: true,
    })

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    })

    console.log(" [x] Sent '%s'", msg)

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)
  })
})
