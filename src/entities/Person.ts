export type PersonState = 
    | 'waiting'
    | 'walkingToElevator'
    | 'inElevator'
    | 'exiting';  

export class Person {
    currentFloor: number;
    targetFloor: number;
    direction: 'up' | 'down';

    x: number;
    y: number;

    state: PersonState = 'waiting';

    constructor(currentFloor: number, targetFloor: number) {
        this.currentFloor = currentFloor;
        this.targetFloor = targetFloor;
        this.direction = targetFloor > currentFloor ? 'up' : 'down';

        this.x = 350;
        this.y = 0;
    }
}