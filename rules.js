// Check if player has a specific item
function hasItem(player, itemName) {
    return player.inventory.includes(itemName);
}

// Add a flag to track game events
function setFlag(player, flagName) {
    player.flags[flagName] = true;
}

// Check if a flag is set
function isFlagSet(player, flagName) {
    return !!player.flags[flagName];
}

// Determine if a passage can be unlocked
function canUnlock(location, player) {
    if (!location.requires) return true;
    return hasItem(player, location.requires);
}