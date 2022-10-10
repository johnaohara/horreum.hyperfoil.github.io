#!/bin/bash
cd /app
echo $pwd
gem install jekyll bundler
bundle update jekyll
bundle install
bundle exec jekyll serve
