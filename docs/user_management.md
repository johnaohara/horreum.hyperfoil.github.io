# User management and security

It is assumed that the repo will host data for multiple teams; each user is a member of one or more teams.
Each run, test or schema is owned by one of the teams. The team corresponds to a Keycloak role (see below) with `-team` suffix, e.g. `engineers-team`. In the UI this will be displayed simply as `Engineers`, dropping the suffix and capitalizing the name.

## Data access

We define 3 levels of access to each item (run, test or schema):
* public: available even to non-authenticated users (for reading)
* protected: available to all authenticated users that have the `viewer` role (see below)
* private: available only to users who 'own' this data - those who have the team role.

In addition to these 3 levels, each item defines a random 'token': everyone who knows this token can read the record.
This token should be reset any time the restriction level changes.

## Users and roles

Users and teams are managed in Keycloak. In non-production environment you can reach it on [localhost:8180](http://localhost:8180/) using credentials `admin`/`secret`.

There are few generic roles automatically created during initial realm import.

* viewer: general permission to view non-public runs
* uploader: permission to upload new runs, useful for bot accounts (CI)
* tester: common user that can define tests, modify or delete data.
* admin: permission both see and change application-wide configuration such as hooks

Besides the team role itself (e.g. `engineers-team`) you are advised to create composite roles for each team; bot account that uploads team's data have `engineers-uploader` which is a composite role, including `engineers-team` and `uploader`. This role cannot view team's private data, it has a write-only access.
Users who explore runs, create and modify new tests should have the `engineers-tester` role; a composite role including `engineers-team`, `tester` and `viewer`.
You can also create a role that allows read-only access to team's private runs, `engineers-viewer` consisting of `engineers-team` and `viewer`.

The admin role is not tied to any of the teams.
