/** Deterministic synchronous domain events; listeners are not platform callbacks. */
export class EventBus {
    private listeners = new Map<string, Set<(payload:any)=>void>>();
    on(type:string, fn:(payload:any)=>void) {
        if(!this.listeners.has(type)) this.listeners.set(type,new Set());
        this.listeners.get(type)!.add(fn);
        return () => this.listeners.get(type)?.delete(fn);
    }
    emit(type:string, payload?:any) { for(const fn of Array.from(this.listeners.get(type) ?? [])) fn(payload); }
    clear() { this.listeners.clear(); }
}
