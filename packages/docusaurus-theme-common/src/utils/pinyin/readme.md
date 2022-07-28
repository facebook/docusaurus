# the minimal pinyin implementation

```shell
# get a pinyin source from project of `simple-pinyin`
wget https://raw.githubusercontent.com/xuqingkuang/simple-pinyin/master/src/dict.ts

# convert the pinyin source to reversed json format for querying pinyin from chinese character
ts-node --skipProject char2py.ts > ../data/pinyin.json
```
