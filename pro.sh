# /bin/sh
docker run \
    -d \
    -v $(pwd)/logs:/home/project/server/logs \
    -p 8003:8000 \
    t2/pro