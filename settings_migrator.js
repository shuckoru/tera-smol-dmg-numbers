const DefaultSettings = {
    "enabled": true,
    "pve_divisor": 1000,
    "pvp_divisor": 1
}

function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        if (from_ver + 1 < to_ver) {
            // Recursively upgrade in one-version steps
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
		}
		
        switch(to_ver)
        {	
			case 2:
				settings.pve_divisor = settings.divisor;
				settings.pvp_divisor = DefaultSettings.pvp_divisor;
				delete settings.divisor;
				break;
        }
        
        return settings;
    }
}

module.exports = MigrateSettings;