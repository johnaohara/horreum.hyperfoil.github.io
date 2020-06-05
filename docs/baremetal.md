# Installing Horreum on bare-metal machine

This guide documents production installation on bare-metal (or virtualized) server.

## Setup database

You need PostgreSQL 12 (or later) installed; setup is out of scope of this guide. Create a new database for the application called `horreum` and limited-priviledge user `appuser` with a secure password:

```bash
export PGHOST=127.0.0.1
export PGPORT=5432
export PGUSER=dbadmin
export PGPASSWORD="Curr3ntAdm!nPwd"
psql -c "CREATE DATABASE horreum" postgres
export PGDATABASE=horreum
psql -c "CREATE ROLE \"appuser\" noinherit login password 'SecurEpaSSw0!2D';" postgres
```

Now set up database structure using the scripts in [resources directory](https://github.com/Hyperfoil/Horreum/tree/master/repo/src/main/resources). Keep the value used in `DBSECRET` secret, too.

```bash
export DBSECRET=$(cat /dev/random | head -c 33 | base64)
psql -f structure.sql
psql -f auxiliary.sql
psql -c "INSERT INTO dbsecret (passphrase) VALUES ('$DBSECRET');"
psql -f policies.sql
psql -c "GRANT select, insert, delete, update ON ALL TABLES IN SCHEMA public TO \"appuser\";"
psql -c "REVOKE ALL ON dbsecret FROM \"appuser\";"
psql -c "GRANT ALL ON ALL sequences IN SCHEMA public TO \"appuser\";"
```

Now you need to setup a Keycloak user and database:

```bash
psql -c "CREATE ROLE \"keycloakuser\" noinherit login password 'An0th3rPA55w0rD';"
psql -c "CREATE DATABASE keycloak WITH OWNER = 'keycloakuser';"
```

## Keycloak setup

Before starting Keycloak you should adjust the [realm definition](https://github.com/Hyperfoil/Horreum/blob/master/repo/src/main/resources/keycloak-horreum.json); for clients `horreum` and `horreum-ui` you need to adjust these URLs:

* `rootUrl`
* `adminUrl`
* `webOrigins`
* `redirectUris` (make sure to include the `/*` to match all subpaths)

For complete Keycloak setup please refer to [Keycloak Getting Started](https://www.keycloak.org/docs/latest/getting_started/index.html) - you can also use existing Keycloak instance.

To import the realm use these system properties:

```bash
./bin/standalone.sh \
    -Dkeycloak.profile.feature.upload_scripts=enabled \
    -Dkeycloak.migration.action=import \
    -Dkeycloak.migration.provider=singleFile \
    -Dkeycloak.migration.file=/path/to/keycloak-horreum.json \
    -Dkeycloak.migration.strategy=IGNORE_EXISTING
```

When Keycloak starts you should access its admin console and create team roles, users and [assign them appropriatelly](user_management.html).

You should also open `horreum` client, switch to 'Credentials' tab and record the Secret (UUID identifier).

## Starting Horreum

Horreum is a Quarkus application and is [configured](https://quarkus.io/guides/config#overriding-properties-at-runtime) using one of these:

* Java system properties when starting the application
* Exported environment variables
* Environment variables definition in `.env` file in the current working directory

You should set up these variables:

```bash
QUARKUS_DATASOURCE_URL=jdbc:postgresql://my.database.host:5432/horreum
# Do not use DB superuser! SQL executed by Horreum might be compromised.
QUARKUS_DATASOURCE_USERNAME=appuser
QUARKUS_DATASOURCE_PASSWORD=SecurEpaSSw0!2D
# Secret generated during database setup
REPO_DB_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx
# This URL must be accessible from Horreum, but does not have to be exposed to the world
QUARKUS_OIDC_AUTH_SERVER_URL=https://my.keycloak.host/auth/realms/horreum
# Make sure to include the /auth path. This URL must be externally accessible.
REPO_KEYCLOAK_URL=https://my.keycloak.host/auth
# Secret found in Keycloak console
QUARKUS_OIDC_CREDENTIALS_SECRET=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# You might also want to set the IP the webserver is listening to
QUARKUS_HTTP_HOST=my.horreum.host
QUARKUS_HTTP_PORT=80
```

If you're not running Horreum behind a trusted proxy providing edge TLS termination you should set up Quarkus to use HTTPS; Check out [certificates configuration options](https://quarkus.io/guides/all-config#quarkus-vertx-http_quarkus-vertx-http).

With all this in you can finally start Horreum as any other Java application (note: dependencies in `repo/target/lib/` must be present):

```bash
java -jar repo/target/repo-1.0.0-SNAPSHOT-runner.jar
```
