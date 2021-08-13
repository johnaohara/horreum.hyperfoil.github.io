# Uploading results into Horreum

Horreum accepts any valid **JSON** as the input. To get maximum out of Horreum, though, it is recommended to categorize the input using [JSON schema](https://json-schema.org/).

## Getting the token

New data can be uploaded into Horreum only by authorized users. We recommend setting up a separate user account for the load-driver (e.g. [Hyperfoil](https://hyperfoil.io)) or CI toolchain that will upload the data as part of your benchmark pipeline. This role should be a composition of the owner team role (e.g. `dev-team`) and `uploader` role - call this role `dev-uploader`. Note that in the [docker-compose](/docs/docker_compose.html) setup the `user` account already has this role.

```bash
KEYCLOAK_URL=http://localhost:8180 # Default URL when using docker-compose
HORREUM_USER=user
HORREUM_PASSWORD=secret
TOKEN=$(curl -s -X POST $KEYCLOAK_URL/auth/realms/horreum/protocol/openid-connect/token \
    -H 'content-type: application/x-www-form-urlencoded' \
    -d 'username='$HORREUM_USER'&password='$HORREUM_PASSWORD'&grant_type=password&client_id=horreum-ui' \
    | jq -r .access_token)
```

## Using offline token

Access token has very limited timespan; when you want to perform the upload from CI script and don't want to store the password inside you can keep an offline token. This token cannot be used directly as an access token; instead you can store it and use it to obtain a regular short-lived access token:

```bash
OFFLINE_TOKEN=$(curl -s -X POST $KEYCLOAK_URL/auth/realms/horreum/protocol/openid-connect/token \
    -H 'content-type: application/x-www-form-urlencoded' \
    -d 'username='$HORREUM_USER'&password='$HORREUM_PASSWORD'&grant_type=password&client_id=horreum-ui&scope=offline_access' \
    | jq -r .refresh_token)
TOKEN=$(curl -s -X POST $KEYCLOAK_URL/auth/realms/horreum/protocol/openid-connect/token \
    -H 'content-type: application/x-www-form-urlencoded' \
    -d 'grant_type=refresh_token&client_id=horreum-ui&refresh_token='$OFFLINE_TOKEN' \
    |  jq -r .access_token)
```

Note that the offline token also expires eventually, by default after 30 days.

## Uploading the data

There are several mandatory parameters for the upload:
* JSON `data` itself
* `test`: Name or numeric ID of an existing test in Horreum. You can also use JSON Path to fetch the test name from the data, e.g. `$.info.benchmark`.
* `start`, `stop`: Timestamps when the run commenced and terminated. This should be epoch time in milliseconds, ISO-8601-formatted string in UTC (e.g. `2020-05-01T10:15:30.00Z`) or a JSON Path to any of above.
* `owner`: Name of the owning role with `-team` suffix, e.g. `engineers-team`.
* `access`: one of `PUBLIC`, `PROTECTED` or `PRIVATE`. See more in [data access](./user_management.html#data-access).

Optionally you can also set `schema` with URI of the JSON schema, overriding (or providing) the `$schema` key in the `data`. If the schema is found and it has a JSON schema the JSON is validated against it; otherwise it is simply admitted. You don't need to define the schema in Horreum ahead.

The upload itself can look like:

```bash
HORREUM_URL=http://localhost:8080
TEST='$.info.benchmark'
START='2021-08-01T10:35:22.00Z'
STOP='2021-08-01T10:40:28.00Z'
OWNER='dev-team'
ACCESS='PUBLIC'
curl $HORREUM_URL'/api/run/data?test='$TEST'&start='$START'&stop='$STOP'&owner='$OWNER'&access='$ACCESS \
    -s -X POST -H 'content-type: application/json' \
    -H 'Authorization: Bearer '$TOKEN \
    -d @/path/to/data.json
```

Assuming that you've [created the test](/docs/create_test.html) let's try to upload this JSON document:

```json
{
    "$schema": "urn:my-schema:1.0",
    "info": {
        "benchmark": "FooBarTest",
        "ci-url": "https://example.com/build/123"
    },
    "results": {
        "requests": 12345678,
        "duration": 300 // the test took 300 seconds
    }
}
```

When you open Horreum you will see that your tests contains single run in the 'Run Count' column.

<div class="screenshot"><img src="/assets/images/upload/00_tests.png" /></div>

Click on the run count number with open-folder icon to see the listing of all runs for given test:

<div class="screenshot"><img src="/assets/images/upload/01_runs.png" /></div>

You can hit the run ID with arrow icon in one of the first columns and see the contents of the run you just created:

<div class="screenshot"><img src="/assets/images/upload/02_run.png" /></div>

Even though the JSON has `$schema` key the schema column in the table above is empty; Horreum does not know that URI yet. You can continue with [customizing test view](/docs/customize_views.html).