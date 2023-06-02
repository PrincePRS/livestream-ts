import { v4 } from "uuid";

export const ToastManager = {
  toasts: new Map(),
  listeners: new Map(),
  addToast(toast: Record<string, any>) {
    const id = toast.id ? toast.id : v4();
    this.toasts.set(id, { ...toast, id });
    this.onChange();
    return id;
  },

  clearAllToast() {
    this.toasts.clear();
    this.onChange();
  },

  removeToast(id: string) {
    this.toasts.delete(id);
    this.onChange();
  },
  replaceToast(id: string, toast: Record<string, any>) {
    if (this.isActive(id)) {
      this.toasts.set(id, { ...this.toasts.get(id), ...toast });
      this.onChange();
      return id;
    } else {
      return this.addToast(toast);
    }
  },
  addListener(cb: any) {
    this.listeners.set(cb, cb);
  },
  removeListener(cb: any) {
    this.listeners.delete(cb);
  },
  isActive(id: string) {
    return this.toasts.has(id);
  },
  onChange() {
    const toasts = Array.from(this.toasts.values());
    this.listeners.forEach((listener) => listener(toasts));
  },
};
