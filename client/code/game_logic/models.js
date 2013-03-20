function Farmer(nickname) {
    this.position = {
        x: 0,
        y: 0
    };
    this.is_allied = false;
    this.nickname = nickname;
}

Farmer.prototype = {
    constructor: Farmer,
    getSmallFarmer: function () {
        var tmpFarmer = {};
        tmpFarmer.nickname = this.nickname;
        tmpFarmer.col = this.position.x;
        tmpFarmer.line = this.position.y;
        return tmpFarmer;
    },
    initFromFarmer: function(smallFarmer) {
        this.nickname = smallFarmer.nickname;
        this.position.x = smallFarmer.col;
        this.position.y = smallFarmer.line;
        //TODO : Add support for allies
    }
};

/*
 * Object representing the current farmer (the player)
 */
function PlayableFarmer(nickname) {
    Farmer.call(this, nickname);
    this.money = 0;
    this.allied_farmers = [];
    this.weapons = [];
}

PlayableFarmer.prototype = new Farmer();
PlayableFarmer.prototype.constructor = PlayableFarmer;
PlayableFarmer.prototype.getSmallFarmer = function() {
    var tmpFarmer = Farmer.prototype.getSmallFarmer.call(this);
    tmpFarmer.money = this.money;
    tmpFarmer.weapons = [];
    for (var weapon in tmpFarmer.weapons) {
        tmpFarmer.weapons.push(weapon.codename);
    }
}
PlayableFarmer.prototype.initFromFarmer = function(smallFarmer) {
    Farmer.prototype.initFromFarmer.call(this, smallFarmer);
    this.money = smallFarmer.money;
    //TODO : Add support for allies
    this.allied_farmers = [];
    //TODO : Implement weapons parsing
    this.weapons = [];
}