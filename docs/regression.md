# Regression testing and Series

One of the most important features of Horreum is regression testing - checking if the new results significantly differ from previous data. Horreum uses **Regression Variables** to extract and calculate **Datapoints** - for each run and each variable it creates one datapoint. Horreum compares recent datapoint(s) to older ones and if it spots a significant difference it emits a **Change**, and sends a notification to subscribed users or teams. User can later confirm that there was a change (restarting the history from this point for the purpose of regression testing) or dismiss it.

Horreum does not distinguish changes causing increase or decrease in given metric. Even if the effect is positive (e.g. decrease in latency or increase in throughput) users should know about this - the improvement could be triggered by a functional bug as well.

We assume that you've already [created a test](/docs/create_test.html), [uploaded](/docs/upload.html) some data and [defined the Schema](/docs/customize_views.html) with some extractors. Let's go to the test and switch to the 'Regression variables' tab:

<div class="screenshot"><img src="/assets/images/regression/00_variables.png"></div>

We have created one variable `throughput` and added the same accessors `requests` and `duration` as in the guide for views customization. Horreum warns us about not being able to cope with two accessors without a calculation function - we set this as well.

Contrary to the view render function this is evaluated on the server side as soon as a new run is uploaded (or later on demand). The function accepts single argument - with single accessor it is the jsonpath result, if you have multiple extractors it is an object keyed with the accessor names. The result of this function must be a single number, otherwise the datapoint is not generated.

One chart can display series of datapoints for multiple variables: you can use Groups to plot the variables together. The dashboard will contain one chart for each group and for each variable without a group set.

In the Advanced settings section there are options to fine tune the thresholds for change. At this moment Horreum employs only two comparisons to detect the change: comparing last datapoint vs. mean of datapoints since last change, and comparing a mean of small sliding window to the mean of preceding datapoints. Both comparisons use a percentage difference as the threshold. While we have experimented with different statistical test we've seen too high rate of false positives and therefore reverted to this naive algorithm. This is an area where we expect further [research and development](https://github.com/Hyperfoil/Horreum/issues/38).

When we hit the save button Horreum asks if it should recalculate datapoints from all existing runs as we have changed the regression variables definition. Let's check the debug logs option and proceed with the recalculation.

<div class="screenshot"><img src="/assets/images/regression/01_recalculate.png"></div>

When the recalculation finishes we can click on the 'Show log' button in upper right corner to see what was actually executed - this is convenient when you're debugging accessors or a more complicated calculation function.

<div class="screenshot"><img src="/assets/images/regression/02_log.png"></div>

If everything works as planned you can click the 'Go to series' button or use the 'Series' link in navigation bar on the top and select the test in the dropbox. You will be presented with a chart with single dot with result data (we have created only one Run so far so there's one datapoint).

<div class="screenshot"><img src="/assets/images/regression/03_series.png"></div>

If you're familiar with Grafana you might want to use that to view the data - the button 'Open Grafana' will lead you there. Note that the dashboard is created automatically and it cannot be altered by users. The OAuth access into both Horreum and Grafana is shared and Horreum automatically creates Grafana users. In the default configuration anonymous users don't have access to Grafana, though they can see charts directly in Horreum (if the test and runs are public).

When a Change is created it is represented as a red circle in Series, or as an annotation (vertical line) in Grafana. Regrettably Grafana does not support annotation per chart, therefore the change in datapoint series for one regression variable is displayed in all charts even though the variable is unrelated.

<div class="screenshot"><img src="/assets/images/regression/04_grafana.png"></div>

In order to receive notifications users need to subscribe to given test. Test owner can manage all subscriptions in the 'Subscriptions' tab in the test. Lookup the current user using the search bar, select him in the left pane and use the arrow to move him to the right pane.

<div class="screenshot"><img src="/assets/images/regression/05_subscriptions.png"></div>

You can do the same with teams using the lists in the bottom. All available teams are listed in the left pane (no need for search). When certain users are members of a subscribed team but don't want to receive notifications these can opt out in the middle pair of lists.

When you save the test and navigate to 'Tests', you can notice a bold eye icon on the very left of the row. This signifies that you are about to receive notifications. You can click it and manage your own notifications here as well.

<div class="screenshot"><img src="/assets/images/regression/06_watching.png"></div>

Despite being subscribed to some tests Horreum does not know *how* should it notify you. Click on your name with user icon next to the 'Logout' button in the top right corner and add a personal notification. Currently only email notification is implemented; use your email as the data field. You can also switch to 'Team notifications' tab and set a notification for an entire team. After saving Horreum is ready to let you know when a Change is detected.

<div class="screenshot"><img src="/assets/images/regression/07_notifications.png"></div>

Developers often run performance tests nightly or weekly on a CI server. After setting up the workflow and verifying that it works you might be content that you have no notifications in your mailbox, but in fact the test might get broken and the data is not uploaded at all. That's why Horreum implements watchdogs for periodically uploaded test runs.

Go to the 'General' tab in the test and on the bottom select `<all tags>` and click the 'Add missing run watchdog...' button. At this moment it doesn't matter if you use `<all tags>` or `<no tags>` since the test is not using tags at all. If you expect that the test will run nightly (or daily) set the 'Max staleness' to a value somewhat greater than 24 hours, e.g. `25 h`. If there was no new run for this test (and combination of tags) for more than 25 hours the subscribed users and teams will receive a notification.

<div class="screenshot"><img src="/assets/images/regression/08_staleness.png"></div>

Notice the switch above Missing runs notifications: you can globally disable all notifications for given test without unsubscribing. This is useful e.g. when you bulk upload historical results and don't want to spam everyone's mailbox.

You can continue exploring Horreum in the [webhooks guide](/docs/webhooks.html).