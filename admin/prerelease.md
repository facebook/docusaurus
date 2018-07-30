# Prereleasing New Version of Docusaurus

[![asciicast](https://asciinema.org/a/n8rm53yfNURlIreGJkdSTgfAi.png)](https://asciinema.org/a/n8rm53yfNURlIreGJkdSTgfAi)

# Steps

1. Ensure that `origin` remote is your Docusaurus fork. Example

```bash
$ git remote -v
origin	https://github.com/endiliey/Docusaurus.git (fetch)
origin	https://github.com/endiliey/Docusaurus.git (push)
```

2. Run `bash scripts/prerelease.sh` to create a pull request for release of new version.
