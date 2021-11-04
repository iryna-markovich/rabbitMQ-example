# rabbitMQ-example :rabbit:

## Installation
1. Visit [Downloading and Installing RabbitMQ](https://www.rabbitmq.com/download.html)

2. Install node depedencies
```bash
npm install
```

Could be useful (in case):

```bash
sudo apt-get update 
sudo apt-get install erlang
sudo apt-get install rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
```

Check the status

```bash
sudo systemctl status rabbitmq-server
```

Enable the management plugin and see the list of already enabled

```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

Visit [http://localhost:15672](http://localhost:15672) to monitor

`username` = `guest`  
`password` = `guest`

## Structure
Each folder contains two files with code and some instructions that could be run with `node` in separate terminals 
```
|-- 1_Hello_World! 
|-- 2_Work_queues 
|-- 3_Publish_Subscribe  
|-- 4_Routing 
|-- 5_Topics 
|-- 6_Remote_procedure_call_(RPC)
```
