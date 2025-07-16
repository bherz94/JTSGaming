export default class InputHandler {
  keys: string[];
  accepptedKeys: string[];

  constructor(acceptedKeys?: string[]) {
    this.keys = [];
    this.accepptedKeys = acceptedKeys ?? [];

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.accepptedKeys.indexOf(e.key) === -1) return;
      const index = this.keys.indexOf(e.key);
      if (index < 0) {
        this.keys.push(e.key);
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (this.accepptedKeys.indexOf(e.key) === -1) return;
      const index = this.keys.indexOf(e.key);
      if (index >= 0) {
        this.keys.splice(index, 1);
      }
    });
  }

  lastPressed = (): string | null => {
    return this.keys.length > 0 ? this.keys[this.keys.length - 1] : null;
  };

  setAcceptedKeys = (acceptedKeys: string[]) => {
    this.keys = [];
    this.accepptedKeys = acceptedKeys;
  };
}
