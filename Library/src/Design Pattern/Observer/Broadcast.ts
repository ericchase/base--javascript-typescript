export type SubscriptionCallback<Value> = (value: Value) => { abort: boolean } | void;

export class Broadcast<Value> {
  protected subscriptionSet = new Set<SubscriptionCallback<Value>>();
  subscribe(callback: SubscriptionCallback<Value>) {
    this.subscriptionSet.add(callback);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  wait(untilValue: Value) {
    return new Promise<void>((resolve) => {
      const once = (value: Value) => {
        if (value === untilValue) {
          resolve();
          this.subscriptionSet.delete(once);
        }
      };
      this.subscriptionSet.add(once);
    });
  }
  send(value: Value) {
    for (const callback of this.subscriptionSet) {
      callback(value);
    }
  }
  sendAndWait(value: Value, untilValue: Value) {
    const promise = this.wait(untilValue);
    this.send(value);
    return promise;
  }
}
