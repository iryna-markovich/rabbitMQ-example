// https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html

// in terminal run script
// --> node receive_logs.js

// to see the logs
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

    channel.assertExchange(exchange, 'fanout', {   //  <-- there are a few exchange types available:
      durable: false,                              //  <-- direct, topic, headers and fanout
    })

    channel.assertQueue(                           
      '',                                          //  <-- when we supply queue name as an empty string,
      {                                            //  <-- we create a non-durable queue with a generated name
        exclusive: true,
      },
      (error2, q) => {
        if (error2) {
          throw error2
        }

        console.log(
          ' [*] Waiting for messages in %s. To exit press CTRL+C',
          q.queue
        )
        channel.bindQueue(q.queue, exchange, '')  //  <-- relationship between exchange and a queue is called a binding

        channel.consume(
          q.queue,
          (msg) => {
            if (msg.content) {
              console.log(' [x] %s', msg.content.toString())
            }
          },
          {
            noAck: true,
          }
        )
      }
    )
  })
})
