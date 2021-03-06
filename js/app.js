'use strict';

let battleTimer;
let player1;
let player2;
let P1Health;
let P2Health;

// EVENTS

$(document).ready(function() {
	$('#start-page').show();
	$('#start-page').siblings().hide();

	// Begin Game Button
	$('#begin-game').on('click', function() {
		$('#robot-selection').show();
		$('#robot-selection').siblings().hide();
		player1 = new Robot();
		player2 = new Robot();
	});

	// Choose a Class -- load page w/ robot selection view
	$('.robot-btn').on('click', function(e) {
		let choice = e.target.id;
		// allow user to change their mind before selecting weapon
		if (!player1.isEquipped) {
			chooseRobot(choice, player1);
			// only assign player2 type if player1 is equipped
		} else if (!player2.isEquipped) {
			chooseRobot(choice, player2);
		}
	});

	// Choose a Weapon -- show weapon selection view
	$('#choose-weapon').on('click', function(e) {
		if (player1.type) {
			if (player2.type || !player1.isEquipped) {
				$('#weapon-selection').show();
				$('#weapon-selection').siblings().hide();
			} else {
				console.log("Player 2 hasn't chosen a robot");
			}
		} else {
			console.log("Player 1 hasn't chosen a robot");
		}
	});

	// Weapon Buttons
	$('.weapon-btn').on('click', function(e) {
		let choice = e.target.id;
		if (!player1.isEquipped) {
			chooseWeapon(choice, player1);
		} else if (!player2.isEquipped) {
			chooseWeapon(choice, player2);
		}
	});

	// Choose A Mod -- show modification selection view
	$('#choose-mod').on('click', function(e) {
		if (player1.weapon) {
			if (player2.weapon || !player1.isEquipped) {
				$('#mod-selection').show();
				$('#mod-selection').siblings().hide();
				if (player1.weapon && player2.weapon) {
					$('#define-player2').hide();
					$('#begin-battle').show();
				} else {
					$('#begin-battle').hide();
					$('#define-player2').show();
				}
			} else {
				console.log("Player 2 hasn't chosen a weapon");
			}
		} else {
			console.log("Player 1 has't chosen a weapon");
		}
	});

	// Mod Buttons
	$('.mod-btn').on('click', function(e) {
		let choice = e.target.id;
		if (!player1.isEquipped) {
			chooseMod(choice, player1);
		} else if (!player2.isEquipped) {
			chooseMod(choice, player2);
		}
	});

	// Define Player 2 -- revert to robot selection view
	$('#define-player2').on('click', function() {
		if (player1.modification) {
			player1.isEquipped = true;
			$('#robot-selection').show();
			$('#robot-selection').siblings().hide();
		} else {
			console.log("Player 1 hasn't chosen a modification");
		}
	});

	// Begin Battle -- show battle view
	$('#begin-battle').on('click', function(e) {
		if (player2.modification) {
			player2.isEquipped = true;
		} else {
			console.log("Player 2 hasn't chosen a modification");
		}
		if (player1.isEquipped && player2.isEquipped) {
			$('#battle-view').show();
			$('#battle-view').siblings().hide();
			$('#restart').hide();
			$('#battleground').html("");
			player1.health = randomNumber(player1.type.maxHealth, player1.type.minHealth);
			P1Health = player1.health;
			player2.health = randomNumber(player2.type.maxHealth, player2.type.minHealth);
			P2Health = player2.health;
			formatCard(player1);
			formatCard(player2);
			updateBattleground(`<h4>Let the battle begin!</h4>`);
			battleTimer = window.setInterval(() => {
				trackBattle(player1, player2);
			}, 3000);
		}
	});

	$('#restart-game').on('click', function() {
		$('#start-page').show();
		$('#start-page').siblings().hide();
	});

	// Initiate battle rounds and update DOM with player HP
	function trackBattle (P1, P2) {
		P2Health = fight(P1, P2);
		$('#player2 .health').html(`HEALTH: ${P2Health}`);
		// only let P2 attack if not dead yet
		if (P2Health > 0) {
			// offset P2 attacks between P1 attacks
			let P2battle = window.setTimeout(() => {
				P1Health = fight(P2, P1);
				$('#player1 .health').html(`HEALTH: ${P1Health}`);
			}, 1500);
		}
	}

	// Build robot card
	function formatCard (player) {
		let contents = "";
		contents += `<h1>${player.type.name}</h1>`;
		contents += `<img src=${player.type.image} alt=${player.type.name} class='robot-img' />`;
		contents += `<p>WEAPON: ${player.weapon.name}</p>`;
		contents += `<p>MODIFICATION: ${player.modification.name}</p>`;
		contents += `<p class='health'>HEALTH: ${player.health}</p>`;
		if (player === player1) {
			$('#player1').html(contents);
		} else {
			$('#player2').html(contents);
		}
	}
});

