# Prereleasing New Version of Docusaurus

[![asciicast](https://asciinema.org/a/hZ7NNJPcgtdvzm5tMLLfHflMD.png)](https://asciinema.org/a/hZ7NNJPcgtdvzm5tMLLfHflMD)

# Steps

1. Ensure that `origin` remote is your Docusaurus fork and `upstream` is Docusaurus original repository. 

```bash
$ git remote -v
origin	https://github.com/endiliey/Docusaurus.git (fetch)
origin	https://github.com/endiliey/Docusaurus.git (push)
upstream    https://github.com/facebook/Docusaurus.git (fetch)
upstream    https://github.com/facebook/Docusaurus.git (push)
```

2. Pull latest changes from Docusaurus repository.

```bash
$ git fetch upstream && git checkout master && git merge upstream/master
```

2. Modify `CHANGELOG.md` and other necessary files. Do not commit the changes.
3. Run `bash scripts/prerelease.sh`.
4. Create your pull request on GitHub.

<img width="629" alt="pull request" src="https://user-images.githubusercontent.com/17883920/43393765-ccb050ac-942a-11e8-94e8-d585034fa064.PNG">