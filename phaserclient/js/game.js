

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    
    backgroundColor: "#FFFFFF"
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image("player", "/assets/images/player.png")
    this.load.image("sword", "/assets/images/sword.png")
    this.load.image('background', '/assets/images/background.jpeg');

    this.socket = io()
    this.ready = false;
}

function create() {
    //background
    this.background = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'background').setOrigin(0).setScrollFactor(0, 0);
    this.background.fixedToCamera = true;

    //player 
    this.mePlayer = this.add.image(400, 100, "player").setScale(0.25)

    //sword
    this.meSword = this.add.image(400, 100, "sword").setScale(0.25)

    //enemies array
    this.enemyPlayers = []
    this.enemySwords = []
    this.dots = []
    this.dead = false
    //arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    //camera follow
    
    this.cameras.main.setBounds(-2500, -2500, 5000, 5000);
    this.cameras.main.startFollow(this.mePlayer);

    //go packet
    this.socket.emit("go")

    //mouse down
    this.input.on('pointerdown', function(pointer) {
        if (!this.mouseDown) {
            this.mouseDown = true
            this.socket.emit("mouseDown", true)
        }
    }, this);
    this.input.on('pointerup', function(pointer) {
        if (this.mouseDown) {
            this.mouseDown = false
            this.socket.emit("mouseDown", false)
        }
    }, this);

    //server -> client
    const addPlayer = (player) => {

        this.enemyPlayers[this.enemyPlayers.length] = {
            item: this.add.image(player.pos.x, player.pos.y, "player").setScale(0.25),
            id: player.id
        }
        this.enemySwords[this.enemySwords.length] = {
            item: this.add.image(player.pos.x, player.pos.y, "sword").setScale(0.25),
            id: player.id,
            down: false
        }
        var enemySword = this.enemyPlayers[this.enemyPlayers.length - 1].item
        var enemyPlayer = this.enemySwords[this.enemySwords.length - 1].item
        console.log(player)
        enemySword.angle = Math.atan2(player.mousePos.y - ((player.mousePos.viewport.height) / 2), player.mousePos.x - ((player.mousePos.viewport.width) / 2)) * 180 / Math.PI + 45;
        enemySword.x = enemyPlayer.x + enemyPlayer.width / 6 * Math.cos(enemySword.angle * Math.PI / 180)
        enemySword.y = enemyPlayer.y + enemyPlayer.width / 6 * Math.sin(enemySword.angle * Math.PI / 180)


    }
    this.socket.on("players", (players) => {
        players.forEach(player => addPlayer(player))

        this.ready = true
    })
    this.socket.on("new", (player) => {
        addPlayer(player)
        this.ready = true
    })
    this.socket.on("myPos", (pos) => {
        this.mePlayer.x = pos.x
        this.mePlayer.y = pos.y
    })
    this.socket.on("player", (player) => {
        //update player
        if (!this.ready) return
      try {
        var enemyPlayer = this.enemyPlayers.find(enemyPlayer => enemyPlayer.id == player.id).item
        var enemySword = this.enemySwords.find(enemySword => enemySword.id == player.id).item

        //update pos
        enemyPlayer.x = player.pos.x
        enemyPlayer.y = player.pos.y

        enemySword.x = enemyPlayer.x + enemyPlayer.width / 6 * Math.cos(enemySword.angle * Math.PI / 180)
        enemySword.y = enemyPlayer.y + enemyPlayer.width / 6 * Math.sin(enemySword.angle * Math.PI / 180)

        //update sword
        var mousePos = player.mousePos
        enemySword.angle = Math.atan2(mousePos.y - ((mousePos.viewport.height) / 2), mousePos.x - ((mousePos.viewport.width) / 2)) * 180 / Math.PI + 45;
        if (this.enemySwords.find(enemySword => enemySword.id == player.id).down) {

            enemySword.angle -= 30
        }

        enemySword.x = enemyPlayer.x + enemyPlayer.width / 6 * Math.cos(enemySword.angle * Math.PI / 180)
        enemySword.y = enemyPlayer.y + enemyPlayer.width / 6 * Math.sin(enemySword.angle * Math.PI / 180)

        this.enemySwords.find(enemySword => enemySword.id == player.id).down = player.mouseDown
      } catch(e) {
        console.log(e)
      }
    })
    this.socket.on("playerLeave", (id) => {
        try {

            this.enemySwords.find(enemySword => enemySword.id == id).item.destroy()
            this.enemyPlayers.find(enemyPlayer => enemyPlayer.id == id).item.destroy()

            this.enemySwords.splice(this.enemySwords.findIndex(enemySword => enemySword.id == id), 1)
            this.enemyPlayers.splice(this.enemyPlayers.findIndex(enemyPlayer => enemyPlayer.id == id), 1)
        } catch (e) {
            console.log(e)
        }
    })
}

function update() {
  console.log(this.mePlayer.x+", "+this.mePlayer.y)
    var controller = {
        left: false,
        up: false,
        right: false,
        down: false
    }

    var wKey = this.input.keyboard.addKey('W');
    var aKey = this.input.keyboard.addKey('A');
    var sKey = this.input.keyboard.addKey('S');
    var dKey = this.input.keyboard.addKey('D');

    if (this.cursors.up.isDown || wKey.isDown) {
        controller.up = true
    }
    if (this.cursors.down.isDown || sKey.isDown) {
        controller.down = true
    }
    if (this.cursors.right.isDown || dKey.isDown) {
        controller.right = true
    }
    if (this.cursors.left.isDown || aKey.isDown) {
        controller.left = true
    }

    this.socket.emit("move", controller)

    //sword rotation
    var old = this.meSword.angle
    if (this.mouseDown) old += 30

    var mousePos = this.input
function getRelativePositionToCanvas(gameObject, camera) {
  return {
    x: (gameObject.x - camera.worldView.x) * camera.zoom,
    y: (gameObject.y - camera.worldView.y) * camera.zoom
  }
}
var relativePos = getRelativePositionToCanvas(this.mePlayer, this.cameras.main)
    this.meSword.angle = Math.atan2(mousePos.y - (relativePos.y), mousePos.x - (relativePos.x)) * 180 / Math.PI + 45;

    if (this.mouseDown) this.meSword.angle -= 30
    this.meSword.x = this.mePlayer.x + this.mePlayer.width / 6 * Math.cos(this.meSword.angle * Math.PI / 180)
    this.meSword.y = this.mePlayer.y + this.mePlayer.width / 6 * Math.sin(this.meSword.angle * Math.PI / 180)

    var mousePos2 = {
        viewport: {width: window.innerWidth, height: window.innerHeight},
        x: mousePos.x,
        y: mousePos.y
    }
    if (this.meSword.angle != old) this.socket.emit("mousePos", mousePos2)


    function movePointAtAngle(point, angle, distance) {
        return [
            point[0] + (Math.sin(angle) * distance),
            point[1] - (Math.cos(angle) * distance)
        ];
    }
    var x1 = this.meSword.x
    var y1 = this.meSword.y

    var position = movePointAtAngle([x1, y1], this.meSword.angle * Math.PI / 180, 50)

    //yes i know this is hackable im too lazy pls dont create a hack if you do then you have no life
    this.socket.emit("hitbox", {
        swordPos: {
            x: x1,
            y: y1
        },
        hitPos: {
            x: position[0],
            y: position[1]
        }
    })
    //better health/killing/respawning coming soon :D
    if (this.ready && !this.dead && !this.socket.connected) {
        document.write("<h1>You died</h1><br><button onclick=\"location.reload()\"><h1>Respawn</h1></button>")
        this.dead = true
    }

    //playercount
    if (this.playerCount) this.playerCount.destroy()
    this.playerCount = this.add.text(0, 0, 'Players: ' + (Object.keys(this.enemyPlayers).length + 1).toString(), {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
    }).setFontSize(20);
    this.playerCount.scrollFactorX = 0
    this.playerCount.scrollFactorY = 0
    //background movement
    this.background.setTilePosition(this.cameras.main.scrollX, this.cameras.main.scrollY);
  
}

function resize() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if(windowRatio < gameRatio){
      canvas.style.width = windowWidth + "px";
      canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else{
      canvas.style.width = (windowHeight * gameRatio) + "px";
      canvas.style.height = windowHeight + "px";
  }
}

window.addEventListener('resize', resize); 



//for debugging on the school chromebooks they fricking banned dev console
window.onerror = function(msg, url, line) {
    document.write("Error : " + msg + "<br><br>");
    document.write("Line number : " + line + "<br><br>");
    document.write("File : " + url);
}