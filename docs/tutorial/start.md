# Running Horreum locally

In this tutorial we'll show you how to start Horreum and its infrastructure using container technologies such as `podman` or `docker`.

### Step 0: install required software

Make sure that you have either `podman` and `podman-compose` or `docker` and `docker-compose` installed. Some scripting we have prepared to simplify the startup also requires `curl` and `jq`. On Fedora you would run

```
sudo dnf install -y curl jq podman podman-plugins podman-compose
```

### Step 1: start Horreum

We have prepared a simple script that downloads all the necessary files and starts all containers in host-network mode:

```bash
curl -s https://raw.githubusercontent.com/Hyperfoil/Horreum/0.6/infra/start.sh | bash
```

After a few moments everything should be up and ready, and a browser pointed to [http://localhost:8080](http://localhost:8080) will open.

### Step 2: log in

In the upper right corner you should see the **Log in** button. Press that and fill in username `user` and password `secret`. When you sign in the upper right corner you should see that you're authenticated as 'Dummy User'.

<div class="screenshot"><img src="/assets/images/create_test/01_logged_in.png"></div>

You can explore the application but at this moment it is empty. Let's continue with [creating a test and uploading a run](create_test_run.html).
