# Customize test views

While Horreum does not require any particular format for the stored data you can use views to display summary information about each run. This **view** is defined for each **test**; each test can display more views (TODO: not implemented).

## Defining a test view

Let's assume you've [already uploaded](./upload.html) some data. Before setting up the view itself, we have to define how can Horreum fetch the value from the **run** data. This is where **schema** comes into play. Let's define a new schema:

1. Login to Horreum, go to the 'Schema' tab and click 'New Schema': <br><img src="/assets/images/customize/1.png" />
2. Fill in name, description, optionally also the test/start time/stop time JSON Paths (these can be used for the upload instead of passing them as parameters).
3. You can paste a full-fledged [JSON schema](https://json-schema.org/) (draft-07) to describe your data, but if you don't want to document or validate your data format you can just set the `$id` and be done with it: <br><img src="/assets/images/customize/2.png" />
4. Click import schema URI: <br><img src="/assets/images/customize/3.png" />
5. Scroll down and save the schema: <br><img src="/assets/images/customize/4.png" />
6. Go back to the schema: <br><img src="/assets/images/customize/5.png" />
7. Switch tab to 'Schema extractors': <br><img src="/assets/images/customize/6.png" />
8. Add a new extractor: <br><img src="/assets/images/customize/7.png" />
9. Fill in an **accessor** - a symbolic identifier which will be used in the view (e.g. `runId`), and PostgreSQL-syntax JSON path to fetch the data from the JSON, omitting the initial dollar sign - e.g. `.info.id`. You can add as many extractors as you need.
10. Click Save to save the schema again. <br><img src="/assets/images/customize/8.png" />
11. Go to Tests and either create a new test or select an existing test (uploading a automatically creates a test if it does not exist): <br><img src="/assets/images/customize/9.png" />
12. Add a new component to the default view: <br><img src="/assets/images/customize/10.png" />
13. Fill in the column header and select `runId` as the accessor, using 'First match' in the dialog. Optionally you can fill a Javascript function that will format the data. If you select multiple accessors in the view component, the argument to this function will be an object with the accessor identifiers as keys. <br><img src="/assets/images/customize/11.png" />
14. Click the Save button to save the test.
15. In the test listing, click on the value in 'Run count' column to view all runs that belong to given test: <br><img src="/assets/images/customize/12.png" />
16. You can see extra column with the value fetched from your JSON. If you're not satisfied with the look, you can edit the test (view) using the edit icon in top right corner: <br><img src="/assets/images/customize/13.png" />

You might be wondering why you can't set the JSON path directly in the view; it is because one test can host runs using different schemas (e.g. when the tool used to produce the results evolves in a non-backwards-compatible way) that require different JSON paths. In simple cases, though, you don't have to go to the schema to define the accessors - the select menu can open a dialog to create new schema extractors in-place.

## Data and multiple schemas

If your data is coming from single source it usually belongs to single schema - an example of the data would look like

```json
{
   "$schema": "http://hyperfoil.io/schema",
   "info": { /* ... */ },
   "stats": [ /* ... */ ],
}
```

In other cases you collect data from multiple sources; in these cases the data file may look like

```json
{
   "hyperfoil": {
      "$schema": "http://hyperfoil.io/schema",
      "info": { /* ... */ },
      "stats": [ /* ... */ ],
   },
   "dstat": {
      "$schema": "urn:some:dstat:schema:1.0",
      /* ... */
   }
}
```

When trying to look up the view Horreum will consider all `$schema` keys on first and second nesting level in the JSON. That's also why the dollar sign is omitted in the accessor JSON Path - Horreum will prepend `$` if the schema is on first level, or `$.*` if the schema is found on the second level.
