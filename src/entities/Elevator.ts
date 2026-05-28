import { Person } from "./Person";

export class Elevator {
    currentFloor = 0;
    targetFloor = 0;
    direction: 'up' | 'down' | 'idle' = 'idle';
    passengers: Person[] = [];
    capacity: number;
    isLoading = false;

    moveProgress = 0; // 0 -> між поверхами

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    update(delta: number) { 
        if (this.direction === 'idle') return;
        if (this.isLoading) return;

        this.moveProgress += delta;

        if (this.moveProgress >= 1) {
            this.moveProgress = 0;

            if (this.direction === 'up') this.currentFloor++;
            if (this.direction === 'down') this.currentFloor--;
        }
    }

    isFull() {
        return this.passengers.length >= this.capacity;
    }
}