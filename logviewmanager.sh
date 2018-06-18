#! /bin/bash
# 删除原有容器
docker rm -f logviewmanager

# 启动并自动重启
docker run \
 --restart always \
 --name logviewmanager \
 --link myredis:myredis \
 --link mymongo:mymongo \
 --expose 80 \
 --expose 443 \
 -v /etc/localtime:/etc/localtime \
 -v ~/gitcode/log-view-manager:/webapp \
 -v ~/gitcode/:/gitcode \
 -w /webapp/server-node \
 -d node node index server
