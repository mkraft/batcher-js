# Batchelor

Batch a list of messages you're sending or receiving based on some configured logic.

## Details

Configure a `handler` for messages that match your configured `matcher` function. If more matching messages are received within your configured `waitMilliseconds` time, and your queue is below your configured `maxSize`, then keep queueing matches. Once the queue is full or the wait time has elapsed, process your messages through your configured `reducer` function before sending them to your configured `publish` method.

Example usage: https://github.com/mkraft/someotherproject

## Install

```shell
yarn add https://github.com/mkraft/batchelor
```