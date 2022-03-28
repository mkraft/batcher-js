# Batcher JS

A message batching and/or buffering module for incoming or outgoing messages.

## Details

Send messages in, if they meet some criteria then queue them with the other matched messages. When the duration elapses since the first message in that queue was received then send them back out as a batch.

Example usage: https://github.com/mkraft/batcher-js-example

## Install

```shell
yarn add https://github.com/mkraft/batchelorjs
```
