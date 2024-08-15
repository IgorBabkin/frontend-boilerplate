type ElementID = string;
type PropName = string;

type Parent = {
  id: ElementID;
  propName: PropName;
};

type ReactiveNode = {
  value: string | number;
  parent: Parent;
};

type GroupNode = {
  name: string;
  parent?: Parent;
};

type ElementNode = ReactiveNode | GroupNode;

export type UpsertMessage = {
  id: ElementID;
  type: 'upsert';
  payload: ElementNode;
};

export type DeleteMessage = {
  id: ElementID;
  type: 'delete';
};

export type WatchMessage = DeleteMessage | UpsertMessage;

export class WatchStore {
  private propsStore = new Map<ElementID, ElementNode>();

  dispatch(message: WatchMessage): void {
    switch (message.type) {
      case 'upsert':
        this.upsert(message.id, message.payload);
        break;

      case 'delete':
        this.delete(message.id);
        break;
    }
  }

  upsert(id: ElementID, body: ElementNode) {
    this.propsStore.set(id, {
      ...(this.propsStore.get(id) ?? {}),
      ...body,
    });
  }

  delete(id: ElementID) {
    this.propsStore.delete(id);
  }
}
