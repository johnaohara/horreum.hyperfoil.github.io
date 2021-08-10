# Customize test views

While Horreum does not require any particular format for the stored data you can use views to display summary information about each run. This is set in a **view**; each **test** defines it's own view.

## Defining a test view

Let's assume you've [already uploaded](./upload.html) some data. Before setting up the view itself, we have to define how can Horreum fetch the value from the **run** data. This is where **schema** comes into play. Let's define a new schema:

Login to Horreum, go to the 'Schema' tab and click 'New Schema':

<div class="screenshot"><img src="/assets/images/customize_views/00_schemas.png" /></div>

Fill in the name and URI and hit the **Save** button on the bottom.

<div class="screenshot"><img src="/assets/images/customize_views/01_new_schema.png" /></div>

Switch tab to 'Schema extractors and add 3 extractors, filling in the **accessor** - a symbolic identifier which will be used in the view - and PostgreSQL-syntax jsonpath to fetch the data from the run JSON. After that click Save again.

<div class="screenshot"><img src="/assets/images/customize_views/02_extractors.png" /></div>

In the navigation bar on the top go to Tests and click either on the name or ID of your test. Switch to the Views tab and add first component, the CI link. When selecting the `ciUrl` accessor pick 'First match' - we expect only one result for the jsonpath anyway.

<div class="screenshot"><img src="/assets/images/customize_views/03_view.png" /></div>

Horreum will recognize the value as a hyperlink and automatically renders it.

Now let's add one more view component, this time using two accessors. Horreum would warn you that it could not display the result correctly; therefore click on the 'Add render function...' and put in a Javascript/Typescript code that will be used to render the value. Note that this code is evaluated in the browser, not server-side.

<div class="screenshot"><img src="/assets/images/customize_views/04_throughput.png" /></div>

The first parameter for your function is either the value extracted by the jsonpath (if you have only one accessor) or an object keyed according to your accessors. The second parameter is summary of the run used to display the whole row (most notably, there's the `id` column). The third parameter is current user's OAuth token.

When you save the view, navigate to Tests and click on the link in Run Count column to see all runs for this test. You should notice two new columns on the right side, showing your custom view components.

<div class="screenshot"><img src="/assets/images/customize_views/05_columns.png" /></div>

You might be wondering why you can't set the JSON path directly in the view; [Tests, Runs and Schemas](/docs/test_run_schema.html) explains why this separation is useful when the format of your data evolves. However you don't need to switch to the Schema when adding view components: when you start typing a non-existent accessor, you can add it to a schema in a modal dialogue.

We can continue with defining the variables for [regression analysis](/docs/regression.html).
