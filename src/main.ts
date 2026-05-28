import * as PIXI from 'pixi.js'
import { Loop } from './core/Loop'
import { Simulation } from './systems/Simulation'
import { Renderer } from './render/Renderer';
import { tweenGroup } from './core/TweenManager';



(async() => {

    const app = new PIXI.Application();

    await app.init({
        width: 400,
        height: 600,
        backgroundColor: 0x222222,
    });

    document.body.appendChild(app.canvas);

    const simulation = new Simulation();
    const renderer = new Renderer(app, simulation);

    const loop = new Loop((delta, time) => {
        simulation.update(delta);
        tweenGroup.update(time);
        renderer.render();
    });

    loop.start();
})();


