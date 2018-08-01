# Prereleasing New Version of Docusaurus

[![asciicast](https://asciinema.org/a/n8rm53yfNURlIreGJkdSTgfAi.png)](https://asciinema.org/a/n8rm53yfNURlIreGJkdSTgfAi)

# Steps

1. Ensure that `origin` remote is your Docusaurus fork. Example

```bash
$ git remote -v
origin	https://github.com/endiliey/Docusaurus.git (fetch)
origin	https://github.com/endiliey/Docusaurus.git (push)
```

2. Modify `CHANGELOG.md` and other necessary files. Do not commit yet.
3. Run `bash scripts/prerelease.sh` to create a commit for the new version pre-release.
4. Create your pull request on GitHub.

Example:
<img width="629" alt="pull request" src="https://user-images.githubusercontent.com/17883920/43393765-ccb050ac-942a-11e8-94e8-d585034fa064.PNG">

