import eventManager from '../tools/eventmanager';

export default class Ball extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'ball');
        this.name = 'ball';

        this.setScale(1.3);
        this.setOrigin(0.5, 0.5);

        this.scene.physics.world.enable(this);
        this.body.setCircle(this.width / 2);
        this.body.setCollideWorldBounds(true);
        this.scene.physics.add.collider(this, this.scene.solidGroup);

        eventManager.emit('register_overlap', this);
        
        //this.body.setVelocity(0, -2000);
        send('ball', {x: this.x, y: this.y, velocity_x: 0, velocity_y: -2000});

        //events
        eventManager.on('set_ball', this.setBall, this);

        this.scene.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('set_ball', this.setBall, this);
        });
    }

    update(time, delta)
    {
        
    }

    setBall(params) {
        console.log(params);
        this.setPosition(params.getDouble('x'), params.getDouble('y'));
        this.body.setVelocity(params.getDouble('velocity_x'), params.getDouble('velocity_y'));
    }

}

function send(req, obj) {
    let cmd = {
        req: req,
        obj: obj
    };

    eventManager.emit('send', cmd);
}