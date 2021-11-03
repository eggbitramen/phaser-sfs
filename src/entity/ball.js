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
        this.scene.physics.add.collider(this, this.scene.solidGroup, checkCollide, null, this);

        eventManager.emit('register_overlap', this);

        this.overlaps = [];
        
        send('ball', {x: this.x, y: this.y, velocity_x: 5000, velocity_y: -5000});

        //events
        eventManager.on('set_ball', this.setBall, this);

        this.scene.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('set_ball', this.setBall, this);
        });

        this.body.setGravityY(MASS_GRAVITY);
    }

    update(time, delta)
    {
        //console.log(this.body.gravity);

        let solid_list = this.scene.solidGroup.getChildren();
        for (const i in solid_list) {
            if (!this.scene.physics.collide(this, solid_list[i]))
            {
                let isolid = this.overlaps.indexOf(solid_list[i].name);
                if (isolid != -1) 
                {
                    this.overlaps.splice(isolid, 1);
                    console.log(this.overlaps);
                }
            }
        }
    }

    interact(sender_obj)
    {
        let bounce_result = bounceCircle(this, sender_obj);
        console.log(bounce_result);

        send('ball', {x: this.x, y: this.y, dir_x: bounce_result.x_dir, dir_y: bounce_result.y_dir});
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

function testo(self, other) {
    console.log(other.name);
}

function checkCollide(self, other) {
    if (!self.overlaps.includes(other.name)) {   // on overlap start
        self.overlaps.push(other.name);
        console.log(self.overlaps);
        
        //   bounce
        bounce(self, other);
    }
}

function bounce(self, static_body) {

    let x_dir = Math.sign(self.body.velocity.x);
    let y_dir = Math.sign(self.body.velocity.y);
    let bounce_result = null;

    switch (static_body.name) {
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
            bounce_result = bounceCircle(self, static_body);
            x_dir = bounce_result.x_dir;
            y_dir = bounce_result.y_dir;
            break;
        case 'circ_right':
            bounce_result = bounceCircle(self, static_body);
            x_dir = bounce_result.x_dir;
            y_dir = bounce_result.y_dir;
            break;
    }

    send('ball', {x: self.x, y: self.y, dir_x: x_dir, dir_y: y_dir});
}

function bounceCircle(self, other) {

    let angle = Phaser.Math.Angle.Between(other.x, other.y, self.x, self.y) * (180 / Math.PI);
        
    let x_dir = Math.sign(self.body.velocity.x);
    let y_dir = Math.sign(self.body.velocity.y);

    if (-45 < angle && angle <= 45) {
        x_dir = 1;
    }
    else if (45 < angle && angle <= 135) {
        y_dir = 1;
    }
    else if(-135 < angle && angle <= -45) {
        y_dir = 1;
    }
    else {
        x_dir = -1;
    }

    return {x_dir: x_dir, y_dir: y_dir};
}

function send(req, obj) {
    let cmd = {
        req: req,
        obj: obj
    };

    eventManager.emit('send', cmd);
}