function Farmer() {
    this.position = {
        col: 0,
        line: 0
    };
    this.is_allied = false;
    this.nickname = "nick";
}

Farmer.prototype = {
    constructor: Farmer,
    getSmallFarmer: function () {
        var tmpFarmer = {};
        tmpFarmer.nickname = this.nickname;
        tmpFarmer.col = this.position.col;
        tmpFarmer.line = this.position.line;
        return tmpFarmer;
    },
    initFromFarmer: function(smallFarmer) {
        this.nickname = smallFarmer.nickname;
        this.position.col = smallFarmer.col;
        this.position.line = smallFarmer.line;
        //TODO : Add support for allies
    },
    invalidate: function() {
        // Refresh everything about the farmer here.
        // This include telling the engine about it
        for(var i = 0; i < Map.players.length; i++) {
            if(Map.players[i].nickname == this.nickname)
                Map.players[i].invalidate();
        }
    }
};

/*
 * Object representing the current farmer (the player)
 */
function PlayableFarmer() {
    Farmer.call(this);
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