## Docker environment for production

You can **build** and **run** project by executing this commands in **_root package_**.

1. `cd service && GOOS=linux GOARCH=amd64 go build -o build && cd ..` - build binary for service
2. `yarn --cwd web run build` or `npm --prefix web run build` - build web project
3. `docker build -t ivory .` - create image for docker
4. `docker run -d -p 80:80 --name ivory ivory` - run docker container

Please, be aware that it won't work with **development environment**
while you do not connect this container to network of the environment. You can do that by executing this command

5. (optional) `docker network connect development_dev-patroni ivory` - connect to dev environment

P.S. Dockerfile is located in root path, because of docker restrictions

P.S.S In production it will work only with full domains name like _google.com_, just _google_ won't work cause container doesn't know anything about your local
machine network
