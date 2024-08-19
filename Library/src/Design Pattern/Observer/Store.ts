export type SubscriptionCallback<Value> = (value: Value) => void;
export type UpdateCallback<Value> = (value: Value) => Value;

export class Store<Value> {
  protected currentValue: Value;
  protected subscriptionSet = new Set<SubscriptionCallback<Value>>();
  constructor(
    protected initialValue: Value,
    protected notifyOnChangeOnly: boolean = false,
  ) {
    this.currentValue = initialValue;
  }
  subscribe(callback: SubscriptionCallback<Value>) {
    this.subscriptionSet.add(callback);
    callback(this.currentValue);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  get value(): Value {
    return this.currentValue;
  }
  set(value: Value) {
    if (this.notifyOnChangeOnly && this.currentValue === value) return;
    this.currentValue = value;
    for (const callback of this.subscriptionSet) {
      callback(value);
    }
  }
  update(callback: UpdateCallback<Value>) {
    this.set(callback(this.currentValue));
  }
}

export class OptionalStore<Value> {
  protected currentValue: Value | undefined;
  protected subscriptionSet = new Set<SubscriptionCallback<Value | undefined>>();
  constructor(protected notifyOnChangeOnly: boolean = false) {}
  subscribe(callback: SubscriptionCallback<Value | undefined>) {
    this.subscriptionSet.add(callback);
    callback(this.currentValue);
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  get value(): Value | undefined {
    return this.currentValue;
  }
  set(value: Value | undefined) {
    if (this.notifyOnChangeOnly && this.currentValue === value) return;
    this.currentValue = value;
    for (const callback of this.subscriptionSet) {
      callback(value);
    }
  }
  update(callback: UpdateCallback<Value | undefined>) {
    this.set(callback(this.currentValue));
  }
}
