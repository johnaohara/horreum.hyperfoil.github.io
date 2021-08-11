# Tests, runs and schemas

*This article explains the basic concepts in Horreum; if you're looking for a step-by-step guide go to [Create a Test and Schema](/docs/create_test_and_schema.html ).*

Any document stored in Horreum is called a **Run** - usually this is the output of a single CI build. Horreum does not need to know much about: it accepts it as a plain JSON document and stores it in the database with very little metadata.

Each Run belongs to a series called a **Test**. This is where you can define metrics and setup regression testing. As you could do the same things for multiple logical series (e.g. if you're running the same test on 32-bit and 64-bit system) you can use **test tags** to differentiate between flavours of the test, too.

If you want to do anything but upload and retrieve data from Horreum, such as customize the UI or run regression testing you need to tell Horreum how to extract data from those fuzzy JSONs: in case of Horreum this is a combination of jsonpaths[^1] and Javascript/Typescript code. However it's impractical to define the JSONPaths directly in the test: when you're running the test for several months or years it is quite likely that the format of your results will evolve, although the information inside stay consistent. That's why the data in a Run should contain the `$schema` key:

```json
{
    "$schema": "urn:load-driver:1.0",
    "ci-url": "https://my-ci-instance.example.com/build/123",
    "throughput": 4567.8
}
```

For each format of your results (in other words, for each URI used in `$schema`) you can define a **Schema** in Horreum. This has two purposes:

* Defining a set of **Extractors** - named jsonpath expressions
* Validation using [JSON schema](https://json-schema.org/)

You don't need to use both - e.g. it's perfectly fine to keep the JSON schema empty or use an extremely permissive one.

In our case you could create a schema 'Load Driver 1.0' using the URI `urn:load-driver:1.0`, and add an extractor `throughput` (this identifier is called the **Accessor**) that would fetch jsonpath `$.throughput`. Some time later the format of your JSON changes:

```json
{
    "$schema": "urn:load-driver:2.0",
    "ci-url": "https://my-ci-instance.example.com/build/456",
    "metrics": {
        "throughput": 5432.1,
        "mean-latency": 12.3
    }
}
```

As the format changed you create schema 'Load Driver 2.0' with URI `urn:load-driver:2.0` and define an extractor in that schema, naming it again `throughput` but this time with jsonpath `$.metrics.throughput`. In all places through Horreum you will use only the accessor `throughput` to refer to the jsonpath and you can have a continuous series of results.

You can define an extractor `mean-latency` in Load Driver 2.0 that would not have a matching one in Load Driver 1.0. You can use that accessor without error, but naturally you won't receive and data from runs with the older schema.

In other cases you can start aggregating data from multiple tools, each producing the results in its own format. Each run has only single JSON document but you can merge the results into single object:

```json
{
    "load-driver": {
        "$schema": "urn:load-driver:1.0",
        "throughput": 4567.8
    },
    "monitoring": {
        "$schema": "urn:monitoring:1.0",
        "cpu-consumption": "1234s",
        "max-memory": "567MB"
    },
    "ci-url": "https://my-ci-instance.example.com/build/123"
}
```

Horreum will transparently extract the throughput relatively to the `$schema` key. Note that this is not supported deeper than on the second level as shown above, though.

[^1]: Since the jsonpath is evaluated directly in the database we use PostgreSQL [jsonpath syntax](https://www.postgresql.org/docs/12/datatype-json.html#DATATYPE-JSONPATH)