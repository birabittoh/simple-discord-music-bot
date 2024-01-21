import path from 'node:path';
const { magazineSize } = require(path.join(process.cwd(), 'config.json'));

const magazines = new Map<string, Magazine>();

function sameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

export class Magazine {
    #size: number;
    #left: number;
    #last: Date;

    constructor(size: number) {
        this.#size = size;
        this.#left = size;
        this.#last = new Date();
    }

    update() {
        const now = new Date();
        if (!sameDay(now, this.#last))
            this.#left = this.#size;
    }

    get left() {
        this.update();
        return this.#left;
    }

    get size() {
        return this.#size
    }

    shoot() {
        this.update();
        if (this.#left <= 0) {
            return false;
        }

        this.#last = new Date();
        this.#left--;
        return true;
    }
}

export function getMagazine(user: string): Magazine {
    if (magazines.has(user))
        return magazines.get(user);

    const q = new Magazine(magazineSize ?? 6);
    magazines.set(user, q);
    return q;
}
