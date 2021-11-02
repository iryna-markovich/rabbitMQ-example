# rabbitMQ-example

Installation

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

Visit the `http://localhost:15672` to monitor

`username` = `guest`
`password` = `guest`