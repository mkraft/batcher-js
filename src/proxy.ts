export type handler = {
    maxSize: number;
    waitMilliseconds: number;
    matcher: (message: any) => [string, boolean];
    reducer: (messages: any[]) => any;
}

type queue = {
    id: number;
    messages: any[];
}

export class Proxy {
    publisher: (message: any[]) => any;
    handlers: handler[];
    queues: Map<string, queue>;

    constructor(publisher:  (message: any[]) => any, handlers: handler[]) {
        this.publisher = publisher;
        this.handlers = handlers;
        this.queues = new Map<string, queue>();
    }

    publish(message: any) {
        for (let i = 0; i < this.handlers.length; i++) {
            const handler: handler = this.handlers[i];
            const [queueName, isMatch]: [string, boolean] = handler.matcher(message);
            if (!isMatch) {
                continue
            }
            let queue: queue | undefined = this.queues.get(queueName);
            let messages: any[];
            if (queue === undefined) {
                messages = [message];
            } else {
                messages = [...queue.messages, message];
                clearTimeout(queue.id);
                if (messages.length >= handler.maxSize) {
                    this.publisher(messages);
                    this.queues.delete(queueName);
                    return
                }
            }
            const id: number = setTimeout((evts: any[]) => {
                this.publisher(evts);
                this.queues.delete(queueName);
            }, handler.waitMilliseconds, messages);
            this.queues.set(queueName, { id, messages });
            return // only operate on the the first handler match
        }
        this.publisher([message]);
    }
}