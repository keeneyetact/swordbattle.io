function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
  
    return (hours == "00"?"": hours+"h ") + (minutes == "00"?"": minutes+"m ") + seconds+"s";
  }

class WonScene extends Phaser.Scene {
    constructor(callback) {
        super();
        this.callback = callback;
    }
    preload() {
    }

    create() {

        this.background = this.add.rectangle(0, 0, this.canvas.height, this.canvas.width, 0x90ee90).setOrigin(0).setScrollFactor(0, 0).setScale(2);
        this.text = this.add.text(this.canvas.width / 2, 0, "You won!", {
            fontSize: "64px",
            fill: "#000000"
        }).setOrigin(0.5);

        this.displayTime = 0;
        this.displayKills = 0;

        this.timeUpdateDelay = 5000 / this.data.timeSurvived;
        this.lastUpdateTime = Date.now(); 

        this.displayKills = (this.data.kills == 1 ? 1 : 0);
        this.displayCoins = 0;

        this.stats = this.add.text(this.canvas.width / 2, this.canvas.height / 2, `You conquered the map and became Ka-HUGE!\nTime Taken: 0s\nKills: ${this.displayKills}`, {
            fontSize: "48px",
            fill: "#000000"
        }).setOrigin(0.5);

        this.lerpVal = 0;

        this.btnrect = this.add.rectangle(0, 0, 0, 0, 0x6666ff);
        this.btntext = this.add.text(this.canvas.width / 2, this.canvas.height / 1.2, "Play Again", {
            fontSize: "48px",
            fill: "#000000"
        }).setOrigin(0.5);
        this.btnrect.x = this.btntext.x - (this.btntext.width/2) - 5;
        this.btnrect.y = this.btntext.y - (this.btntext.height/2) - 5;
        this.btnrect.width = this.btntext.width + 10;
        this.btnrect.height = this.btntext.height + 10;
        //this.stats.y -= this.stats.height
        this.btnrect.setInteractive().on("pointerdown", (pointer, localX, localY, event) => {
            this.scene.start("title");
        });
        console.log(this.data.coins);
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.returnKey.on("down", event => {
            this.scene.start("title");
        });
    }

    update() {
        this.text.setFontSize(this.canvas.width / 10);
        this.stats.setFontSize(this.canvas.width / 30);
        this.btntext.setFontSize(this.canvas.width / 25);
        if (this.text.y < this.canvas.height / 4) this.text.y += 10;

        if(this.displayKills < this.data.kills ) {
            this.displayKills += 1;
            this.lastUpdateKills = Date.now();
        }

        if(this.displayTime < this.data.timeSurvived) {
            this.displayTime += 1000;
            
        }
        const lerp = function(start, end, t){
            return start * (1 - t) + end * t;
        };
       
            this.displayCoins = Math.round(lerp(0,this.data.coins, this.lerpVal));
            if(this.lerpVal < 1) this.lerpVal += 0.02;
            
        

        this.stats.setText(`A mighty warrior indeed..!\nTime Taken: ${msToTime(this.displayTime)}\nCoins: ${this.displayCoins}\nKills: ${this.displayKills}`);
        const resize = () => {
            this.game.scale.resize(this.canvas.width, this.canvas.height);
            this.background.width = this.canvas.width;
            this.background.height = this.canvas.height;
            this.text.x = this.canvas.width / 2;
            this.text.y = this.canvas.height / 4;
            this.stats.x = this.canvas.width / 2;
            this.stats.y = this.canvas.height / 2;
            
            this.btntext.x = this.canvas.width / 2;
            this.btntext.y = this.canvas.height / 1.2;


            //this.stats.y -= this.stats.height
        };
        this.btnrect.x = this.btntext.x - (this.btntext.width/2) - 5;
        this.btnrect.y = this.btntext.y - (this.btntext.height/2) - 5;
        this.btnrect.width = this.btntext.width + 10;
        this.btnrect.height = this.btntext.height + 10;
        window.addEventListener("resize", resize, false);

    }
}

export default WonScene;