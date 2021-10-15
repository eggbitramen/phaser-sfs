import eventManager from '../tools/eventmanager';

export default class Login extends Phaser.Scene {
    constructor()
    {
        super('login');
    }

    create()
    {
        eventManager.emit('connect');

        eventManager.on('enter-loby', this.enterLoby, this);
        this.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('enter-loby', this.enterLoby, this);
        });

        this.add.text(10, 10, "Connecting ...");
    }

    enterLoby()
    {
        this.scene.stop(this);
        this.scene.start('lobby');
    }
}