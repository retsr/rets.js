# How to contribute

rets.js is MIT licensed and accepts contributions via Github pull requests.

## Getting started

- Fork the repository on GitHub

## Contribution flow

- Create a topic branch from where you want to base your work.
- Make commits.
- Make sure your commit messages are in the proper format (see below).
- Push your changes to a topic branch in your fork of the repository.
- Submit a pull request to retsr/rets.js.

### Format of the Commit Message

We follow a rough convention for commit messages that is designed to answer two
questions: what changed and why. The subject line should feature the what and
the body of the commit should describe the why. This is inspired by the stile used
by some CoreOS project.

```
scripts: add the test-cluster command

this uses tmux to setup a test cluster that you can easily kill and
start for debugging.
```

The format can be described more formally as follows:
```
<subsystem>: <what changed>
<BLANK LINE>
<why this change was made>
```

The first line is the subject and should be no longer than 70 characters, the
second line is always blank, and other lines should be wrapped at 80 characters.
This allows the message to be easier to read on GitHub as well as in various
git tools.
