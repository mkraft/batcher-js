interface publisher {
    publish(event: event[]);
}

export interface event {
    name: string;
    data: any;
}

export type handler = {
    maxSize: number;
    waitMilliseconds: number;
    matcher: (event: event) => [string, boolean];
    reducer: (events: event[]) => event[];
}

type queue = {
    id: number;
    events: event[];
}

export class proxy {
    publisher: publisher;
    handlers: handler[];
    queues: Map<string, queue>;

    constructor(pub: publisher, handlers: handler[]) {
        this.publisher = pub;
        this.handlers = handlers;
        this.queues = new Map<string, queue>();
    }

    publish(event: event) {
        for (let i = 0; i < this.handlers.length; i++) {
            const handler: handler = this.handlers[i];
            const [queueName, isMatch]: [string, boolean] = handler.matcher(event);
            if (!isMatch) {
                continue
            }
            let queue: queue | undefined = this.queues.get(queueName);
            let events: event[];
            if (queue === undefined) {
                events = [event];
            } else {
                events = [...queue.events, event];
                clearTimeout(queue.id);
                if (events.length >= handler.maxSize) {
                    this.publisher.publish(events);
                    this.queues.delete(queueName);
                    return
                }
            }
            const id: number = setTimeout((evts: event[]) => {
                this.publisher.publish(evts);
                this.queues.delete(queueName);
            }, handler.waitMilliseconds, events);
            this.queues.set(queueName, { id, events });
            return // only operate on the the first handler match
        }
    }
}
