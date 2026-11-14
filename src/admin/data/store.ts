/**
 * Minimal in-memory stores compatible with `useSyncExternalStore`.
 * Snapshots are immutable and only replaced after a successful mutation, then
 * subscribers are notified. Mutations run one at a time through a queue, so
 * concurrent clicks can never apply against a stale array.
 */
import type { Entity } from "../types";

type Listener = () => void;

/** Fake round-trip so loading states are visible; 0 in tests. */
export const latency = { ms: 250 };
const wait = () => new Promise<void>((r) => setTimeout(r, latency.ms));

abstract class Store<S> {
  private listeners = new Set<Listener>();
  private queue: Promise<unknown> = Promise.resolve();
  protected constructor(protected snapshot: S) {}
  subscribe = (l: Listener) => { this.listeners.add(l); return () => this.listeners.delete(l); };
  getSnapshot = () => this.snapshot;
  protected commit(next: S) { this.snapshot = next; this.listeners.forEach((l) => l()); }
  /** Serialises a mutation; `fn` reads the latest snapshot when it runs. */
  protected run<R>(fn: () => R): Promise<R> {
    const job = this.queue.then(async () => { await wait(); return fn(); });
    this.queue = job.catch(() => undefined);
    return job;
  }
}

export class DocStore<T> extends Store<T> {
  constructor(initial: T) { super(initial); }
  update(value: T) { return this.run(() => { this.commit(structuredClone(value)); return value; }); }
}

export class CollectionStore<T extends Entity> extends Store<readonly T[]> {
  constructor(initial: T[]) { super(initial); }
  get(id: string) { return this.snapshot.find((i) => i.id === id); }
  /** Creates (appends) or replaces by id. */
  save(item: T) {
    return this.run(() => {
      const copy = structuredClone(item);
      const exists = this.snapshot.some((i) => i.id === item.id);
      this.commit(exists ? this.snapshot.map((i) => (i.id === item.id ? copy : i)) : [...this.snapshot, copy]);
      return copy;
    });
  }
  remove(id: string) {
    return this.run(() => {
      if (!this.snapshot.some((i) => i.id === id)) throw new Error("Registro não encontrado.");
      this.commit(this.snapshot.filter((i) => i.id !== id));
    });
  }
  removeWhere(pred: (item: T) => boolean) { return this.run(() => this.commit(this.snapshot.filter((i) => !pred(i)))); }
  updateWhere(pred: (item: T) => boolean, patch: (item: T) => T) {
    return this.run(() => this.commit(this.snapshot.map((i) => (pred(i) ? patch(i) : i))));
  }
  /**
   * Swaps the item with its nearest neighbour in `dir`, among items matching
   * `scope` (e.g. same tab), so grouped lists reorder within their group.
   */
  move(id: string, dir: -1 | 1, scope: (item: T) => boolean = () => true) {
    return this.run(() => {
      const list = [...this.snapshot];
      const from = list.findIndex((i) => i.id === id);
      if (from < 0) return;
      let to = from + dir;
      while (to >= 0 && to < list.length && !scope(list[to]!)) to += dir;
      if (to < 0 || to >= list.length) return;
      [list[from], list[to]] = [list[to]!, list[from]!];
      this.commit(list);
    });
  }
}

let counter = 0;
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;
