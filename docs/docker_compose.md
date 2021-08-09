# Running Horreum using docker-compose

While in production you'll install Horreum using [Openshift operator](./operator.html) or use customized installation on bare metal machine, for convenience while trying it out locally we have prepared a Docker-compose script to set up PosgreSQL database, Keycloak and create some example users. Therefore you can simply run

```bash
COMPOSE_FILE=$(mktemp horreum-docker-compose.XXXX.yaml)
curl https://raw.githubusercontent.com/Hyperfoil/Horreum/master/docker-compose.yml \
    -s -o $COMPOSE_FILE
docker-compose -f $COMPOSE_FILE up -d
```

and after a few moments everything should be up and ready. You can later configure Keycloak on [localhost:8180](http://localhost:8180) using credentials `admin`/`secret`.
The `horreum` realm already has some roles (`dev-team`) and single user with credentials `user`/`secret` you can use once you start Horreum. You can learn more about roles in [user management](./user_management.html) docs.

As the docker-compose script is also used for development setup starting Horreum appserver is not a part of this script.
When the required services are up, you can start the last published image using

```bash
docker run --rm --name horreum_app --network host --env-file .env quay.io/hyperfoil/horreum:latest
```

As the default URLs for PostgreSQL, Keycloak and Grafana refer to localhost (and that would not resolve correctly inside the container) we are running in host network mode.

## Podman

If you prefer to run Horreum in a rootless Podman environment you can use this alternative:

```bash
COMPOSE_FILE=$(mktemp horreum-podman-compose.XXXX.yaml)
curl https://raw.githubusercontent.com/Hyperfoil/Horreum/master/podman-compose.yml \
    -s -o $COMPOSE_FILE
podman-compose -f $COMPOSE_FILE -t hostnet up -d
```

Besides some differences in the compose file we need to run all services in host network mode; Grafana calls back to Horreum (which works as a datasource) and that would not be possible from within the pod unless we placed it into the same pod. As the podman-compose scripts are used for development we expect the application running on host machine.

You can run the application using a command almost identical to the one for Docker:

```bash
podman run --rm --name horreum_app --network host --env-file .env quay.io/hyperfoil/horreum:latest
```
