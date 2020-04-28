# Uploading results into Horreum

Horreum accepts any valid **JSON** as the input. To get maximum out of Horreum, though, it is recommended to categorize the input using [JSON schema](https://json-schema.org/).

## Getting the token

New data can be uploaded into Horreum only by authorized users. We recommend setting up a separate user account for the load-driver (e.g. [Hyperfoil](https://hyperfoil.io)) or CI toolchain that will upload the data as part of your benchmark pipeline. This role should be a composition of the owner team role (e.g. `engineers-team`) and `uploader` role.

```bash
KEYCLOAK_URL=http://localhost:8180 # Default URL when using docker-compose
HORREUM_USER=user
HORREUM_PASSWORD=secret
TOKEN=$(curl -s -X POST $KEYCLOAK_URL/auth/realms/horreum/protocol/openid-connect/token \
     -H 'content-type: application/x-www-form-urlencoded' \
     -d 'username='$HORREUM_USER'&password='$HORREUM_PASSWORD'&grant_type=password&client_id=horreum-ui' \
     | jq -r .access_token)
```

## Uploading the data

There are several mandatory parameters for the upload:
* JSON `data` itself
* `test`: Name of existing test in Horreum, or name for a test to be created. You can also use JSON Path to fetch the test name from the data, e.g. `$.info.benchmark`.
* `start`, `stop`: Timestamps when the run commenced and terminated. This should be epoch time in milliseconds, ISO-8601-formatted string in UTC (e.g. `2020-05-01T10:15:30.00Z`) or a JSON Path to any of above.
* `owner`: Name of the owning role with `-team` suffix, e.g. `engineers-team`.
* `access`: one of `PUBLIC`, `PROTECTED` or `PRIVATE`. See more in [data access](./user_management.html#data-access).

Optionally you can also set `schema` with URI of the JSON schema, overriding (or providing) the `$schema` key in the `data`. If the schema is found the JSON is validated against the schema; otherwise it is simply admitted. You don't need to define the schema in Horreum ahead.

The upload itself can look like:

```bash
HORREUM_URL=http://localhost:8080
TEST='$.info.benchmark'
START='2020-05-01T10:15:30.00Z'
STOP='2020-05-01T10:40:26.00Z'
OWNER='engineers-team'
ACCESS='PUBLIC'
curl $HORREUM_URL'/api/run/data?test='$TEST'&start='$START'&stop='$STOP'&owner='$OWNER'&access='$ACCESS \
    -s -X POST -H 'content-type: application/json' \
    -H 'Authorization: Bearer '$TOKEN \
    -d @/path/to/data.json
```
