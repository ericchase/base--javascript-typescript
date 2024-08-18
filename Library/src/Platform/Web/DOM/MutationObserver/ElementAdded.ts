type NotificationCallback = (element: Element) => { abort: boolean } | void;

export class ElementAddedObserver {
  constructor({ source = document.documentElement, options = { subtree: true }, selector, includeExistingElements = true }: { source?: Node & { querySelectorAll?: Function }; options?: { subtree?: boolean }; selector: string; includeExistingElements?: boolean }) {
    this.mutationObserver = new MutationObserver((mutationRecords: MutationRecord[]) => {
      for (const record of mutationRecords) {
        const treeWalker = document.createTreeWalker(record.target, NodeFilter.SHOW_ELEMENT);
        do {
          if ((treeWalker.currentNode as Element).matches(selector)) {
            this.send(treeWalker.currentNode as Element);
          }
        } while (treeWalker.nextNode());
      }
    });
    this.mutationObserver.observe(source, { childList: true, subtree: options.subtree ?? true });

    if (includeExistingElements === true) {
      const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
      do {
        if ((treeWalker.currentNode as Element).matches(selector)) {
          this.send(treeWalker.currentNode as Element);
        }
      } while (treeWalker.nextNode());
    }
  }
  public disconnect() {
    this.mutationObserver.disconnect();
    for (const callback of this.subscriptionSet) {
      this.subscriptionSet.delete(callback);
    }
  }
  public subscribe(callback: NotificationCallback): () => void {
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
  protected subscriptionSet = new Set<NotificationCallback>();
  private send(element: Element) {
    if (!this.matchSet.has(element)) {
      this.matchSet.add(element);
      for (const callback of this.subscriptionSet) {
        if (callback(element)?.abort === true) {
          this.subscriptionSet.delete(callback);
        }
      }
    }
  }
}
