export type handler = {
    waitMilliseconds: number;
    matcher: (message: any) => [string, boolean];
}

export class Proxy {
    out: (message: any[]) => any;
    handlers: handler[];
    queues: Map<string, any[]>;

    constructor(out: (message: any[]) => any, handlers: handler[]) {
        this.out = out;
        this.handlers = handlers;
        this.queues = new Map<string, any[]>();
    }

    in(message: any) {
        for (let i = 0; i < this.handlers.length; i++) {
            const handler: handler = this.handlers[i];
            const [queueName, isMatch]: [string, boolean] = handler.matcher(message);
            if (!isMatch) {
                continue
            }
            let queue: any[] | undefined = this.queues.get(queueName);
            let messages: any[];
            if (queue === undefined || queue.length == 0) {
                messages = [message];
                setTimeout(() => {
                    let queue: any[] | undefined = this.queues.get(queueName);
                    if (queue !== undefined) {
                        this.out(queue);
                        this.queues.delete(queueName);
                    }
                }, handler.waitMilliseconds);
            } else {
                messages = [...queue, message];
            }
            this.queues.set(queueName, messages);

            // if execution is here then a handler was matched
            // and the message was processed so stop the loop
            // because only one matcher should be used
            return
        }

        // if execution is here then there are no matching handlers
        // so send the message out immediately and unreduced
        this.out(message);
    }
}
