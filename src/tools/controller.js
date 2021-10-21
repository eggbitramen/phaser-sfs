import eventManager from '../tools/eventmanager';

export default class Controller
{
    constructor(scene)
    {
        this.scene = scene;

        this.key_status = 'idle';
        
        this.key_right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.key_left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        this.key_space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.key_z = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.key_x = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }

    update()
    {
        if (Phaser.Input.Keyboard.JustDown(this.key_right)) {
            this.key_status = updateKeyStatus(this.key_status, 'right');
        }
        if (Phaser.Input.Keyboard.JustDown(this.key_left)) {
            this.key_status = updateKeyStatus(this.key_status, 'left');
        }

        //  restore direction
        if (Phaser.Input.Keyboard.JustUp(this.key_right))
        {
            this.key_status = this.key_left.isDown ? updateKeyStatus(this.key_status, 'left') : this.key_status;
        }
        if (Phaser.Input.Keyboard.JustUp(this.key_left))
        {
            this.key_status = this.key_right.isDown ? updateKeyStatus(this.key_status, 'right') : this.key_status;
        }

        //  check no direction key
        if (!this.key_right.isDown && !this.key_left.isDown)
        {
            if (this.key_status != 'idle') {
                this.key_status = updateKeyStatus(this.key_status, 'idle');
            }
        }

        //  action buttons
        if (Phaser.Input.Keyboard.JustDown(this.key_space)) {
            this.send('act', {act : 'jump'});
        }
    }

    send(key, value) {
        let cmd = {
            key: key,
            value: value
        };

        eventManager.emit('send', cmd);
    }
}

function updateKeyStatus(key_status, key_value) {
    if (key_status != key_value) {
        key_status = key_value;
    }
    console.log(key_status);
    return key_status;
}