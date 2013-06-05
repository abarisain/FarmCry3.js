GameState = {
    player: null,
    online_players: [],
	crops: {},
	buildings: {},
	weapons: {},
	stored_crops: {},
	inventorySize: 5,
    addPlayer: function(player) {
        this.removePlayer(player.nickname);
        this.online_players.push(player);
        Map.addPlayer(player);
    },
    removePlayer: function(nickname) {
        Map.removePlayer(nickname);
        if(this.player != null && nickname == this.player.nickname)
            return;
        var playerCount = this.online_players.length;
        for (var i = playerCount - 1; i >= 0; i--) {
            if (this.online_players[i].nickname == nickname) {
                this.online_players.removeItemAtIndex(i);
            }
            break;
        }
    }
    //TODO : Add weapons and stuff
}