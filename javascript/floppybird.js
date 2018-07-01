// This file is a modified version of a script from a Flappy Bird clone by Lessmilk, www.lessmilk.com

var mainState = {
    
	preload: function() {
		game.load.image('bird', 'images/bird.png');
		game.load.image('pipe', 'images/pipe.png');
        game.load.image('background', 'images/background.png');
	},
	
	create: function () {   
        // reset timer
        timer = 0;
		// add background
		game.add.tileSprite(0, 0, 400, 490, 'background');

		// add general physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// add floppy bird
		this.bird = game.add.sprite(100, 245, 'bird');
		
		// add input action
		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);
		
		// create pipe (computer) group
		this.pipes = game.add.group();
		
		// add pipes at 1500ms interval
		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        
        // display score
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff"});
	},
	
	update: function() {
        // update timer
        timer = timer + 1;
        if (timer > 75) {
            // enable floppy bird physics
            game.physics.arcade.enable(this.bird);
            this.bird.body.gravity.y = 1000;
        }
		// if bird out of bounds, restart
        if (this.bird.y < 0 || this.bird.y > 490) this.restartGame();
        // if bird hits pipes (computers), go to hitPipe function
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
	},
	
	jump: function() {
        if (this.bird.alive == false)
            return;
		this.bird.body.velocity.y = -350;
	},
	
	restartGame: function() {
		game.state.start('main');
	},
	
	addOnePipe: function(x, y) {
		// add pipe (computer) and pipe physics
		var pipe = game.add.sprite(x, y, 'pipe');
		this.pipes.add(pipe);
		game.physics.arcade.enable(pipe);
		pipe.body.velocity.x = -200;
		// destroy pipe when off screen
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},
	
	addRowOfPipes: function() {
		// chose hole position
		var hole = Math.floor(Math.random() * 5) + 1;
		// add 6 pipes (computers) with 2 holes at hole position
		for (var i=0; i<8; i++)
			if (i!=hole && i!=hole+1 && i!=hole-1)
				this.addOnePipe(400, i*60+10);
        // increase score each time new row created
        if (timer > 150) 
            this.score += 1;
        this.labelScore.text = this.score;
	},
    
    hitPipe: function() {
        // fall and stop pipes (computers) if hit pipe (triggers game restart on return to update function)
        if (this.bird.alive == false)
            return;
        this.bird.alive = false;
        game.time.events.remove(this.timer);
        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        }, this);
    },
};

var timer = 0;
var game = new Phaser.Game(400,490, Phaser.AUTO, 'floppy-bird');
game.state.add('main', mainState);
game.state.start('main');