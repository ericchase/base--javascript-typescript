type NotificationCallback<Value> = (value: Value) => { abort: boolean } | void;
export class ElementAddedObserver {
  constructor({ source, options, selector }: { source: Node & { querySelectorAll?: Function }; options: MutationObserverInit; selector: string }) {
    this.mutationObserver = new MutationObserver((mutationRecords: MutationRecord[]) => {
      for (const record of mutationRecords) {
        switch (record.type) {
          case 'attributes':
          case 'characterData':
            if (record.target instanceof Element && record.target.matches(selector)) {
              this.add(record.target);
            }
            break;
          case 'childList':
            for (const node of record.addedNodes) {
              if (node instanceof Element && node.matches(selector)) {
                this.add(node);
              }
            }
            break;
        }
      }
    });
    this.mutationObserver.observe(source, options);

    const findMatches = (source: Element) => {
      if (source.matches(selector)) {
        this.add(source);
      }
      for (const element of source.querySelectorAll(selector)) {
        this.add(element);
      }
    };
    if (source instanceof Element) findMatches(source);
    else if (source.querySelectorAll) {
      for (const element of source.querySelectorAll(selector)) {
        this.add(element);
      }
    } else {
      if (source.parentElement) findMatches(source.parentElement);
      else {
        for (const node of source.childNodes) {
          if (node instanceof Element) {
            findMatches(node);
          }
        }
      }
    }
  }
  public subscribe(callback: NotificationCallback<Element>): () => void {
    this.subscriptionSet.add(callback);
    for (const element of this.matchSet) {
      if (callback(element)?.abort === true) {
        this.subscriptionSet.delete(callback);
        return () => {};
      }
    }
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  protected mutationObserver: MutationObserver;
  protected matchSet = new Set<Element>();
  protected subscriptionSet = new Set<NotificationCallback<Element>>();
  private add(element: Element) {
    this.matchSet.add(element);
    for (const callback of this.subscriptionSet) {
      if (callback(element)?.abort === true) {
        this.subscriptionSet.delete(callback);
      }
    }
  }

  static Help() {
    console.log(`
      The ElementAddedObserver class makes it easy to create a MutationObserver.

      options: {
        attributeFilter?: string[];
          - Set to a list of attribute local names (without namespace) if not all attribute mutations need to be observed and attributes is true or omitted.
        attributeOldValue?: boolean;
          - Set to true if attributes is true or omitted and target's attribute value before the mutation needs to be recorded.
        attributes?: boolean;
          - Set to true if mutations to target's attributes are to be observed. Can be omitted if attributeOldValue or attributeFilter is specified.
        characterData?: boolean;
          - Set to true if mutations to target's data are to be observed. Can be omitted if characterDataOldValue is specified.
        characterDataOldValue?: boolean;
          - Set to true if characterData is set to true or omitted and target's data before the mutation needs to be recorded.
        childList?: boolean;
          - Set to true if mutations to target's children are to be observed.
        subtree?: boolean;
          - Set to true if mutations to not just target, but also target's descendants are to be observed.
      }

      selector: A css query selector to match elements on. (Passing * will return all Element objects found.)
    `);
  }
}
