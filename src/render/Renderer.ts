import * as PIXI from 'pixi.js';
import { Simulation } from '../systems/Simulation';
import { config } from '../config/Config';


export class Renderer {
    app: PIXI.Application;
    simulation: Simulation;

    elevatorGraphics: PIXI.Graphics;
    floorGraphics: PIXI.Graphics[] = [];
    peopleGraphics: PIXI.Graphics[] = [];

    constructor(app: PIXI.Application, simulation: Simulation) {
        this.app = app;
        this.simulation = simulation;

        this.elevatorGraphics = new PIXI.Graphics();

        this.drawFloors();
        this.app.stage.addChild(this.elevatorGraphics);
    }

    drawFloors() {
        for (let i = 0; i < config.floors; i++) {
            const g = new PIXI.Graphics();

            const y = this.getY(i);

            g.fill(0x444444);
            g.rect(0, y, 400, 2);
            g.fill();

            this.app.stage.addChild(g);
            this.floorGraphics.push(g);

            const text = new PIXI.Text ({
                text: `${i}`,
                style: {
                    fill: '#ffffff',
                    fontSize: 14.
                },
            });

            text.x = 5;
            text.y = y -20;

            this.app.stage.addChild(text);
        }
    }

    getY(floor: number) {
        return 600 - floor * config.floorHeight;
    }

    getElevatorY() {
        const elevator = this.simulation.elevator;

        return (
            this.getY(elevator.currentFloor) - elevator.moveProgress * config.floorHeight *
            (elevator.direction === 'up' ? 1 : -1)
        )
    }

    render() {
        this.drawElevator();
        this.drawPeople();
    }

    drawElevator() {
        const {elevatorX, elevatorWidth, elevatorHeight} = config.layout;

        const y = this.getElevatorY();

        this.elevatorGraphics.clear();
        this.elevatorGraphics.fill(0xffff00);
        this.elevatorGraphics.rect(elevatorX, y - elevatorHeight, elevatorWidth, elevatorHeight);
        this.elevatorGraphics.fill();
    }

    drawPeople() {
        for (const g of this.peopleGraphics) {
            this.app.stage.removeChild(g);
        }

        this.peopleGraphics = [];

        const size = 10;

        this.simulation.floors.forEach((floor, floorIndex) => {
            floor.waiting.forEach((person) => {
                const g = new PIXI.Graphics();
                const color = person.direction === 'up' ? 0x0000ff: 0x00ff00;
                const y = this.getY(floorIndex) - 20;

                g.fill(color);
                g.rect(person.x, y, size, size);
                g.fill();

                this.app.stage.addChild(g);
                this.peopleGraphics.push(g);
            });
        });
        
        this.simulation.elevator.passengers.forEach((person, i) => {
        const g = new PIXI.Graphics();
        const y = this.getElevatorY() - 20;

        g.fill(0xffffff);

        const x = person.state === 'exiting' ? person.x : config.layout.elevatorX + 10 + i * 12;

        g.rect(x, y, size, size);
        g.fill();

        this.app.stage.addChild(g);
        this.peopleGraphics.push(g);
        });
    }

}