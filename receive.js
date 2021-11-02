const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const queue = 'hello'          //  <-- name of the queue (the same on server)

    channel.assertQueue(queue, {   //  <-- need to assert the same queue cause client could be start before the server 
      durable: false,              //  <-- and be sure the queue exists before trying to consume msg from it 
    })

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)

    channel.consume(
      queue,
      (msg) => {
        console.log(' [x] Received %s', msg.content.toString())
      },
      {
        noAck: true,
      }
    )
  })
})
