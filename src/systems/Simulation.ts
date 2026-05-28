import { Elevator } from "../entities/Elevator";
import { Floor } from "../entities/Floor";
import { Person } from "../entities/Person";
import { config } from "../config/Config";
import { Tween } from "@tweenjs/tween.js"; 
import { tweenGroup } from "../core/TweenManager";

export class Simulation {
    elevator: Elevator;
    floors: Floor[];

    private spawnTimer = 0;

    constructor() { 
        this.elevator = new Elevator(config.capacity);
        this.floors = [];

        for (let i = 0; i < config.floors; i++) {
            this.floors.push(new Floor(i));
        }
    }

    update(delta: number) {
        this.spawnLogic(delta);
        this.elevator.update(delta);

        this.handleDropOff();
        this.handlePickUp();
        this.updateDirection();

    }

    //Logick 

    spawnLogic(delta: number) {
        this.spawnTimer += delta;

        if (this.spawnTimer >= this.randomSpawnTime()) {
            this.spawnTimer = 0;
            this.spwanPerson();
        }
    }

    randomSpawnTime() {
        return 4 + Math.random() * 6; //4-10 sec
    }

    spwanPerson() {
        const floorIndex = Math.floor(Math.random() * this.floors.length);
        const target = Math.floor(Math.random() * this.floors.length);

        if (floorIndex === target) return;

        const person = new Person(floorIndex, target);
        this.floors[floorIndex].waiting.push(person);

        console.log(`Person at ${floorIndex} -> ${target}`);
    }

    handleDropOff() {
        const currentFloor = this.elevator.currentFloor;

        const toDrop = this.elevator.passengers.filter(
            (p) => p.targetFloor === currentFloor
        );

        for (const person of toDrop) {
            if (person.state === 'exiting') continue;

            person.state = 'exiting';
            this.elevator.isLoading = true;

            const targetX = config.layout.personStartX;
            person.x = config.layout.elevatorX + 10;

            new Tween(person, tweenGroup)
                .to({x: targetX}, 500)
                .onComplete(() => {
                    this.elevator.passengers = this.elevator.passengers.filter(
                        (p) => p !== person
                    );

                    this.elevator.isLoading = false;
                })
                .start();
        }
    }

    handlePickUp() {
        const floor = this.floors[this.elevator.currentFloor];

        if (!floor) return;

        for (const person of floor.waiting) {
            if (this.elevator.isFull()) break;

            if (this.elevator.direction !== 'idle' &&
                person.direction !== this.elevator.direction
            ) {
                continue;
            }

            if (person.state !== 'waiting') continue;

            person.state = 'walkingToElevator';
            this.elevator.isLoading = true;

            const targetX = config.layout.elevatorX +10;

            new Tween(person, tweenGroup)
            .to({x: targetX}, 500)
            .onComplete(() => {
                person.state = 'inElevator';
                this.elevator.passengers.push(person);

                floor.waiting = floor.waiting.filter((p) => p !== person);

                this.elevator.isLoading = false;
        })
        .start();
        break;
        }
    }

    updateDirection() {
        const elevator = this.elevator;

        if (elevator.direction === 'up') {
            if (this.hasRequestsAbove()) return;

            if (this.hasRequestsBelow()) {
                elevator.direction = 'down';
                return;
            }
        }

        if (elevator.direction === 'down') {
            if (this.hasRequestsBelow()) return;

            if(this.hasRequestsAbove()) {
                elevator.direction = 'up';
                return;
            }
        }

        if (elevator.direction === 'idle') {
            if (this.hasRequestsAbove()) {
                elevator.direction = 'up';
                return;
            }

            if (this.hasRequestsBelow()) {
                elevator.direction = 'down';
                return;
            }
        }

        if (!this.hasRequestsAbove() && !this.hasRequestsBelow() && elevator.passengers.length ===0){
            elevator.direction = 'idle';
        }
    }

    hasRequestsAbove() {
        const current = this.elevator.currentFloor;

        if (this.elevator.passengers.some(
            (p) => p.targetFloor > current
        )){
            return true;
        }

        for (let i = current + 1; i < this.floors.length; i++ ) {
            if (this.floors[i].waiting.length > 0) {
                return true;
            }
        }

        return false;
    }

    hasRequestsBelow() {
        const current = this.elevator.currentFloor;

        if (this.elevator.passengers.some(
            (p) => p.targetFloor < current
        )) {
            return true;
        }

        for (let i = 0; i < current; i++) {
            if (this.floors[i].waiting.length > 0) {
                return true;
            }
        }

        return false;
    }
}