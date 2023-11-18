exports.NetworkMod = function ShortDmgNumbers(mod) {

	const DmgType = 1
	let players = {}

	mod.hook('S_SPAWN_USER', 16, event => {
		players[event.gameId] = true
	})
	mod.hook('S_DESPAWN_USER', 3, event => {
		delete players[event.gameId]
	})
	mod.game.me.on('leave_loading_screen', () => players = {})

	mod.hook('S_EACH_SKILL_RESULT', 14, { order: 100 }, event => {
		if (!mod.settings.enabled || mod.game.me.level < 65) return
		if ((mod.game.me.gameId === event.source || mod.game.me.gameId === event.owner) && event.type === DmgType) {
			let smolDmg = 0n
			if (players[event.target] != undefined)
				smolDmg = event.value / BigInt(mod.settings.pvp_divisor)
			else
				smolDmg = event.value / BigInt(mod.settings.pve_divisor)
			if (smolDmg < 1n)
				smolDmg = 1n
			event.value = smolDmg
			return true
		}
	})

	// Bunch of useless commands
	mod.command.add('smn', {
		on() {
			if (mod.settings.enabled) return mod.command.message('Already enabled.')
			mod.settings.enabled = true
			mod.command.message('Module enabled.')
		},
		off() {
			if (!mod.settings.enabled) return mod.command.message('Already disabled.')
			mod.settings.enabled = false
			mod.command.message('Module disabled.')
		},
		pve(value) {
			if (!+value) return mod.command.message('Innapropiate or missing value.')
			mod.settings.pve_divisor = value
			mod.command.message('Pve divisor set to ' + mod.settings.pve_divisor + '.')
		},
		pvp(value) {
			if (!+value) return mod.command.message('Innapropiate or missing value.')
			mod.settings.pvp_divisor = value
			mod.command.message('Pvp divisor set to ' + mod.settings.pvp_divisor + '.')
		},
		$default() { mod.command.message('Invalid command.') }
	})
}
