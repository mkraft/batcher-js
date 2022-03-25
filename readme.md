# Batchelor

*DO NOT USE YET; NEEDS TESTS*

Buffer and/or batch a list of messages you're sending or receiving.

## Details

Configure a `handler` for messages that match your configured `matcher` function. Queue incoming messages for `waitMilliseconds` and then send then out through the optional configured `reducer` function.

Example usage: https://github.com/mkraft/someotherproject/blob/main/src/index.ts

## Install

```shell
yarn add https://github.com/mkraft/batchelor
```
