import eventManager from '../tools/eventmanager';

export default class Lobby extends Phaser.Scene {
    constructor()
    {
        super('lobby');
    }

    init(data)
    {
  
        this.rematch = data.rematch;
    }

    create()
    {
        this.menu_state = 0
        this.add.image(0, 0, 'lobby-bg').setScale(2); //bg

        this.find_match_btn = this.add.sprite(0, 0, 'button-00').setOrigin(0.5, 0.5);
        this.find_match_btn.setPosition(this.game.width * 3/4, this.game.height * 8.5/10);
		this.find_match_btn.setInteractive();
        
        this.find_match_txt = this.add.sprite(0, 0, 'sprtxt-start').setOrigin(0.5, 0.5);
        this.find_match_txt.setPosition(this.find_match_btn.x, this.find_match_btn.y);

        this.tutorial_cont = this.add.container(this.game.width / 2, this.game.height / 2);
        this.tutorial_cont.setVisible(true);

        this.find_match_cont = this.add.container(this.game.width / 2, this.game.height / 2);
        this.find_match_cont.setVisible(false);
        
        this.find_match_info = this.add.text(0, 0, "Waiting for Players")
            .setOrigin(0.5, 0.5)
            .setFontSize(30)
            .setFontStyle('bold');
        this.find_match_cont.add(this.find_match_info);

        this.ready_member_txt = this.add.text(0, 75, "0 / 0")
            .setOrigin(0.5, 0.5)
            .setFontSize(30)
            .setFontStyle('bold');
        this.find_match_cont.add(this.ready_member_txt);

		/*		Tutorial	*/
		let text_howto = this.add.text(0, -this.game.height/2 + 85, "HOW TO PLAY:")
			.setFontSize(70)
			.setOrigin(0.5, 0.5);
		this.tutorial_cont.add(text_howto);

		let text_prop = {
			wordWrap: {
				width: this.game.width/2 * 4/5
			}
		};
		this.texts = [
			"Cetaklah gol sebanyak mungkin ke gawang lawan. Pemain yang paling banyak mencetak skor dalam 30 detik akan menjadi pemenang.",
			"Tekan tombol arah KANAN atau KIRI untuk menggerakkan karakter pemain. Tekan tombol SPACE untuk melompat.",
			"Tekan tombol Z untuk melambungkan bola ke arah gawang lawan. Tekan tombol X untuk menendang bola lurus ke gawang lawan.",
			"Pemain juga dapat menggunakan tombol pada layar untuk mengontrol pergerakan karakter pemain."
		];
		this.tutorial_txt = this.add.text(this.game.width * 1.1/5, -this.game.height * 0.5/10, this.texts[0], text_prop)
			.setOrigin(0.5, 0.5)
			.setFontSize(37);
		this.tutorial_cont.add(this.tutorial_txt);

		let slide_mask = this.add.rectangle(-this.game.width * 1.1/5, this.game.height * 0.5/10, this.game.height * 3/5, this.game.height * 3/5, 0x000000).setOrigin(0.5, 0.5);
		this.tutorial_cont.add(slide_mask);	

		this.dots = [];
		let dot_offset = -1.5;
		for (var i = 0; i < 4; i++)
		{
			let dot = this.add.circle(slide_mask.x + 20 * (i + dot_offset), slide_mask.y + slide_mask.height / 2 + 50, 5, 0xffffff).setOrigin(0.5, 0.5);
			dot.alpha = 0.4;
			this.dots.push(dot);
			this.tutorial_cont.add(dot);
		}

		this.slide_frame = ['tut_00', 'tut_01', 'tut_02', 'tut_03'];
		this.slides = this.add.image(slide_mask.x, slide_mask.y, this.slide_frame[0]).setOrigin(0.5);
		this.tutorial_cont.add(this.slides);
		
		this.dots[0].alpha = 1.0;
		this.tut_index = 0;
        
		// add events
        this.find_match_btn.on('pointerup', () => {
            this.find_match_btn.alpha == 1.0
                this.toggleLobbyState();
        });

        // rematch
        if (this.rematch && this.menu_state == 0) {
            this.toggleLobbyState();
        }

		this.input.on('pointerdown', (pointer) => {
			
			let dir;
			if (
				(this.find_match_btn.x - this.find_match_btn.width/2 < pointer.x && pointer.x < this.find_match_btn.x + this.find_match_btn.width/2)
				&&
				(this.find_match_btn.y - this.find_match_btn.height/2 < pointer.y && pointer.y < this.find_match_btn.y + this.find_match_btn.height/2)
			)
			{
				//do nothing
			}
			else
			{
				if (pointer.x > this.game.width/2)
					dir = 1;
				else
					dir = -1;
				
				let next = this.tut_index + dir;	
				if ((next >=0 && next <= 3) && this.menu_state == 0)
				{
					this.tut_index = next;
					for (var i in this.dots)
					{
						this.dots[i].alpha = 0.4;
					}
					this.dots[this.tut_index].alpha = 1.0;
					this.tutorial_txt.setText(this.texts[this.tut_index]);
					this.slides.setTexture(this.slide_frame[this.tut_index]);
					//image change
				}
			}
		});

        eventManager.on('ready', this.showReadyMember, this);
        eventManager.on('enter-matchwrapper', this.enterMatchWrapper, this);
        eventManager.on('lobby-state', this.lobbyState, this);

		this.game.events.on(Phaser.Core.Events.HIDDEN, () => {
            this.forceExitMatch();
        }, this);
        
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.find_match_btn.off('pointerup', () => {
                this.toggleLobbyState();
            });
            eventManager.off('ready');
            eventManager.off('enter-matchwrapper');
            eventManager.off('lobby-state');
			
			this.input.off('pointerdown');

			this.game.events.off(Phaser.Core.Events.HIDDEN);
        });
    }

    showReadyMember(text)
    {
        this.ready_member_txt.setText(text);
    }

    enterMatchWrapper()
    {
        this.scene.stop(this);
        this.scene.start('matchwrapper');
    }

    toggleLobbyState() 
    {
        this.find_match_btn.alpha = 0.3;
        if (this.menu_state == 0)
        {
            this.menu_state = 1;
            this.find_match_txt.setTexture('sprtxt-cancel');
            eventManager.emit('find-match');
        }
        else
        {	
            this.menu_state = 0;
            this.find_match_txt.setTexture('sprtxt-start');
            eventManager.emit('exit-match');
        }
    }

    lobbyState(room_name)
    {
        if (room_name == "The Lobby") 
		{
			this.find_match_btn.setPosition(this.game.width * 3/4, this.game.height * 8.5/10);
			this.find_match_txt.setPosition(this.find_match_btn.x, this.find_match_btn.y);
            this.find_match_cont.setVisible(false);
            this.tutorial_cont.setVisible(true);

			this.tutorial_txt.setText(this.texts[this.tut_index]);
			this.slides.setTexture(this.slide_frame[this.tut_index]);
			for (var i in this.dots)
			{
				if (i == this.tut_index)
					this.dots[i].alpha = 1.0;
				else
					this.dots[i].alpha = 0.4;
			}
        }
        else
        {
			this.find_match_btn.setPosition(this.game.width * 1/2, this.game.height * 8.5/10);
            this.find_match_txt.setPosition(this.find_match_btn.x, this.find_match_btn.y);
			this.tutorial_cont.setVisible(false);
            this.find_match_cont.setVisible(true);
        }
        this.find_match_btn.alpha = 1.0;
    }

    forceExitMatch()
    {
	    if (this.menu_state == 1) {
            this.toggleLobbyState();
        }
    }
}
