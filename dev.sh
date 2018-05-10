# /bin/sh
docker run \
    -it \
    --rm \
    -v $(pwd):/home/project \
    -p 8004:8000 \
    t3/mk2 \
    bash