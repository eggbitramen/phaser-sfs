import eventManager from '../tools/eventmanager';

const MASS_GRAVITY = 5000;

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
        this.body.setGravityY(MASS_GRAVITY);

        eventManager.emit('register_overlap', this);

        this.overlaps = [];
        
        send('ball', {x: this.x, y: this.y, velocity_x: 2000, velocity_y: -2000});

        //events
        eventManager.on('set_ball', this.setBall, this);

        this.scene.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('set_ball', this.setBall, this);
        });
    }

    update(time, delta)
    {
        let solid_list = this.scene.solidGroup.getChildren();
        for (const i in solid_list) {
            if (solid_list[i] != this) {
                if (this.scene.physics.overlap(this, solid_list[i]) == false) {
                    let isolid = this.overlaps.indexOf(solid_list[i].name);
                    if (isolid != -1) {
                        /*
                        ... code for overlap exit
                        */

                        console.log(this.overlaps);

                        this.overlaps.splice(isolid, 1);   //  on overlap end
                    }
                }
            }
        }

        this.scene.physics.add.overlap(this, this.scene.solidGroup, checkCollide, null, this);
    }

    interact(sender_obj)
    {
        let angle = Phaser.Math.Angle.Between(this.x, this.y, sender_obj.x, sender_obj.y);

        console.log(Phaser.Math.Angle.WrapDegrees(angle));
        
        //send('ball', {x: this.x, y: this.y, dir_x: 2000, velocity_y: -2000});
    }

    setBall(params) {

        if (params.getDouble('velocity_y') == 0) {
            this.body.setGravityY(0);
        }
        else
        {
            this.body.setGravityY(MASS_GRAVITY);
        }

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
       console.log(self.overlaps);
        
        //   bounce
        bounce(self, other.name);
    }
}

function bounce(self, static_name) {

    let x_dir = Math.sign(self.body.velocity.x);
    let y_dir = Math.sign(self.body.velocity.y);

    switch (static_name) {
        case 'rect_down':
            y_dir = -1;
            break;
        case 'rect_up':
            y_dir = 1;
            break;
        case 'rect_left':
            x_dir = 1;
            break;
        case 'rect_right':
            x_dir = -1;
            break;
        case 'rect_down':
            y_dir = -1;
            break;
        case 'circ_left':
            // y_dir = -y_dir;
            // x_dir = -x_dir;
            break;
        case 'circ_right':
            // y_dir = -y_dir;
            // x_dir = -x_dir;
            break;
    }

    send('ball', {x: self.x, y: self.y, dir_x: x_dir, dir_y: y_dir});
}

function send(req, obj) {
    let cmd = {
        req: req,
        obj: obj
    };

    eventManager.emit('send', cmd);
}