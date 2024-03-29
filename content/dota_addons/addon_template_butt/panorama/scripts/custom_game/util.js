var DOTA_TEAM_SPECTATOR = 1;

function GetHEXPlayerColor(playerId) {
	var playerColor = Players.GetPlayerColor(playerId).toString(16);
	return playerColor == null ? '#000000' : ('#' + playerColor.substring(6, 8) + playerColor.substring(4, 6) + playerColor.substring(2, 4) + playerColor.substring(0, 2));
}

function secondsToMS(seconds, bTwoChars) {
	var sec_num = parseInt(seconds, 10);
	var minutes = Math.floor(sec_num / 60);
	var seconds = Math.floor(sec_num - minutes * 60);

	if (bTwoChars && minutes < 10)
		minutes = '0' + minutes;
	if (seconds < 10)
		seconds = '0' + seconds;
	return minutes + ':' + seconds;
}

function dynamicSort(property) {
	var sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function(a, b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

function SortPanelChildren(panel, sortFunc, compareFunc) {
	var tlc = panel.Children().sort(sortFunc)
	$.Each(tlc, function(child) {
		for (var k in tlc) {
			var child2 = tlc[k]
			if (child != child2 && compareFunc(child, child2)) {
				panel.MoveChildBefore(child, child2)
				break;
			}
		}
	});
}

function GetDotaHud() {
    var panel = $.GetContextPanel();
    while (panel && panel.id !== 'Hud') {
        panel = panel.GetParent();
	}

    if (!panel) {
        throw new Error('Could not find Hud root from panel with id: ' + $.GetContextPanel().id);
	}

	return panel;
}

function FindDotaHudElement(id) {
	return GetDotaHud().FindChildTraverse(id);
}


// Credits: EarthSalamander #42
// Hide vanilla pick screen in loading screen
HidePickScreen();

function HidePickScreen() {
	if (!Game.GameStateIsAfter(DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP)) {
		FindDotaHudElement("PreGame").style.opacity = "0";
		$.Schedule(1.0, HidePickScreen)
	}
	else {
		FindDotaHudElement("PreGame").style.opacity = "1";
	}
}

function FixShopToolsUI(){
	if (!Game.GameStateIsAfter(DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME)) {
		$.Schedule(1.0, FixShopToolsUI)
	}
	else {
		FindDotaHudElement("GridNewShopTab").style.width = "0px";
		FindDotaHudElement("NewPlayerShopConsumables").style.height = "0px";
	}
}
FixShopToolsUI();

GameEvents.Subscribe('dota_hud_error_message_player', (data)=>{
	GameEvents.SendEventClientSide("dota_hud_error_message", {
		splitscreenplayer: 0,
		reason: 80,
		message: data.message});
});

// Fixes the top bar scores
GameEvents.Subscribe('scoreboard_fix', (data)=>{
	FindDotaHudElement("TopBarRadiantScore").text = data.radiantKills;
	FindDotaHudElement("TopBarDireScore").text = data.direKills;
});
