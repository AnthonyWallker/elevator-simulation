export class Loop {
    private lastTime = 0;
    private update: (delta: number, time: number) => void;

    constructor(update: (delta: number, time: number) => void) {
        this.update = update;
    }

    start() {
        requestAnimationFrame(this.tick);
    }

    private tick = (time: number) => {
        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(delta, time);

        requestAnimationFrame(this.tick);
    };
}