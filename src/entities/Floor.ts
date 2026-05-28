import { Person } from "./Person";

export class Floor {
    index: number;
    waiting: Person[]= [];

    constructor(index: number) {
        this.index = index;
    }
}