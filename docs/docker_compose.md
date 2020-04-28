# Running Horreum using docker-compose

While in production you'll install Horreum using [Openshift operator](./operator.html) or use customized installation on bare metal machine, for convenience while trying it out locally we have prepared a Docker-compose script to set up PosgreSQL database, Keycloak and create some example users. Therefore you can simply run

```bash
COMPOSE_FILE=$(mktemp horreum-docker-compose.XXXX.yaml)
curl https://raw.githubusercontent.com/Hyperfoil/Horreum/master/docker-compose.yml \
    -s -o $COMPOSE_FILE
docker-compose -f $COMPOSE_FILE up -d
```

and after a few moments everything should be up and ready. You can later configure Keycloak on [localhost:8180](http://localhost:8180) using credentials `admin`/`secret`.
The `horreum` realm already has some roles (`dev-team`) and single user with credentials `user`/`secret` you can use once you start up Horreum. You can learn more about roles in [user management](./user_management.html) docs.

When the required services are up, you can either start the last published image using

```bash
docker run -p 8080:8080 quay.io/hyperfoil/horreum:latest
```

Note: the docker-compose script is also used for development setup, therefore starting Horreum itself is not a part of this script.