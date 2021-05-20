type Fun<T> = (arg1: T, arg2: any) => void

class Event<T> {
    private readonly listeners: Array<Fun<T>>
    private readonly sender: T
    constructor(sender: T) {
        this.sender = sender;
        this.listeners = []
    }

    attach(callback: Fun<T>) {
        this.listeners.push(callback)
    }

    notify(args: any) {
        for(let i = 0; i < this.listeners.length; i ++) {
            this.listeners[i](this.sender, args)
        }
    }
}

export default Event