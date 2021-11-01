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

        eventManager.emit('register_overlap', this);

        this.overlaps = [];
        
        send('ball', {x: this.x, y: this.y, velocity_x: 0, velocity_y: -2000});

        //events
        eventManager.on('set_ball', this.setBall, this);

        this.scene.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('set_ball', this.setBall, this);
        });
    }

    update(time, delta)
    {
        //this.scene.physics.overlap(this, this.scene.solidGroup, checkCollide, null, this);
        let solid_list = this.scene.solidGroup.getChildren();
        for (const i in solid_list) {
            if (solid_list[i] != this) {
                if (this.scene.physics.overlap(this, solid_list[i]) == false) {
                    let isolid = this.overlaps.indexOf(solid_list[i].name);
                    if (isolid != -1) {
                        /*
                        ... code for overlap exit
                        */
                        this.overlaps.splice(isolid, 1);   //  on overlap end
                    }
                }
            }
        }

        this.scene.physics.add.overlap(this, this.scene.solidGroup, checkCollide, null, this);
    }

    setBall(params) {
        this.setPosition(params.getDouble('x'), params.getDouble('y'));
        this.body.setVelocity(params.getDouble('velocity_x'), params.getDouble('velocity_y'));
    }

}

function checkCollide(self, other) {
    if (!self.overlaps.includes(other.name)) {   // on overlap start
        self.overlaps.push(other.name);
        /*
        ... code for overlap enter
        */
    }
}

function send(req, obj) {
    let cmd = {
        req: req,
        obj: obj
    };

    eventManager.emit('send', cmd);
}