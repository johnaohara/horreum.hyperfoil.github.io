# How to create a new Test

After installing Horreum, creating required [roles and users](/docs/user_management.html) in Keycloak you will start with a blank table of tests:

<div class="screenshot"><img src="/assets/images/create_test/00_initial.png" /></div>

In the upper right corner click the **Login** button and fill in the credentials. If you are using the [docker-compose](/docs/docker_compose.html) for development/sandbox environment, there's already an user with credentials `user`/`secret` you can use.

The table does not change much but on the left side you'll find a 'New Test' button:

<div class="screenshot"><img src="/assets/images/create_test/01_logged_in.png" /></div>

All you need to fill in here is the test name. Test names must be unique within Horreum.

<div class="screenshot"><img src="/assets/images/create_test/02_new_test.png" /></div>

When you press the **Save** button on the bottom several other tabs appear on the top; you can go to **Access**. The test was created with **Private** access rights; if you want anonymous users to see your tests you can set it to **Public** and save the test.

<div class="screenshot"><img src="/assets/images/create_test/03_test_access.png" /></div>

When you're done you can navigate to **Tests** in the bar on the top of the screen and see that the test was really created:

<div class="screenshot"><img src="/assets/images/create_test/04_tests.png" /></div>

The test is there but in the Run Count column you don't see any runs. Now you can continue with [uploading data](/docs/upload.html) into Horreum.