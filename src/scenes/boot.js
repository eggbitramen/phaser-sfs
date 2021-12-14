export default class Boot extends Phaser.Scene {
    constructor()
    {
        super('boot');
    }

    preload()
    {
        let {width, height} = this.sys.game.canvas;
        this.game.width = width;
        this.game.height = height;

        this.load.setPath('./assets/images/');
        this.load.image('lobby-bg', 'wrapper/lobby-bg.png');
        this.load.image('button-00', 'wrapper/button-00.png');
        this.load.image('button-01', 'wrapper/button-01.png');
        this.load.image('sprtxt-start', 'wrapper/sprtxt-start.png');
        this.load.image('sprtxt-cancel', 'wrapper/sprtxt-cancel.png');
        this.load.image('sprtxt-exit', 'wrapper/sprtxt-exit.png');
        this.load.image('sprtxt-rematch', 'wrapper/sprtxt-rematch.png');
        this.load.image('avatar-none', 'wrapper/avatar-none.png');
        this.load.image('crown', 'wrapper/crown.png');
        this.load.image('iccoin', 'wrapper/iccoin.png');
        this.load.image('icdiamond', 'wrapper/icdiamond.png');

        this.load.image('ball_shadow', 'game/ball_shadow.png');
        this.load.image('bg_night', 'game/bg_night.png');
        this.load.image('ball', 'game/bola.png');
        this.load.image('red_head', 'game/charakter_head_red.png');
        this.load.image('red_shoe', 'game/charakter_red_spatu.png');
        this.load.image('dirt', 'game/dirt_.png');
        this.load.image('sprtxt-goal', 'game/goal.png');
        this.load.image('green_head', 'game/green_head.png');
        this.load.image('green_shoe', 'game/green_spatu.png');
        this.load.image('sprtxt-kickoff', 'game/kick_off.png');
        this.load.image('field', 'game/lapangan_.png');
        this.load.image('stadium_light', 'game/ligtstadium.png');
        this.load.image('goal_back', 'game/normal_gawang_belakang.png');
        this.load.image('goal_front', 'game/normal_gawang_depan.png');
        this.load.image('supporters', 'game/penonton.png');
        this.load.image('player_shadow', 'game/player_shadoww.png');
        this.load.image('sprtxt-ready', 'game/ready.png');
        this.load.image('ui-scoreboard', 'game/scoreboad_.png');
        this.load.image('tribune', 'game/tribune_stadium.png');
        this.load.image('btn_hi', 'game/btn_hi.png');
        this.load.image('btn_lo', 'game/btn_lo.png');
        this.load.image('btn_jump', 'game/btn_jump.png');
        this.load.image('btn_right', 'game/btn_right.png');
        this.load.image('btn_left', 'game/btn_left.png');

        //  popup
        this.load.image('kick_off', 'game/kick_off.png');
        this.load.image('ready', 'game/ready.png');
        this.load.image('goal', 'game/goal.png');

        this.load.once('complete', () => {
            this.goToLogin();
        });
    }

    create()
    {

        //add objects
        this.add.text(this.game.width / 2, this.game.height / 2, "Loading ...").setOrigin(0.5, 0.5);
    }

    goToLogin()
    {
        this.scene.stop(this);
        this.scene.start('login');
    }
}