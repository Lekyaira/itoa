import itoaActor from './itoaActor.js';
import itoaItem from './itoaItem.js';

import itoaActorSheet from './sheets/itoaActorSheet.js';
import itoaItemSheet from './sheets/itoaItemSheet.js';
import itoaSkillSheet from './sheets/itoaSkillSheet.js';

Hooks.once("init", async () => 
{
    console.log("ItOA | Initializing system...");

    // Unregister existing default sheets
    console.log("ItOA | Unregistering sheets...");
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    // Set classes
    console.log("ItOA | Setting up classes...");
    CONFIG.Actor.documentClass = itoaActor;
    CONFIG.Item.documentClass = itoaItem;

    // Register sheets
    console.log("ItOA | Registering sheets...");

    // Actors
    const actorTypes = [
        ["character", itoaActorSheet]
    ];
    // Loop through all our actor types and register each one
    actorTypes.forEach((type) => {
        Actors.registerSheet("itoa", type[1], {
            types: [type[0]],
            // If I were fancy I'd localize this...
            label: type[0] && type[0][0].toUpperCase() + type[0].slice(1),
            makeDefault: true
        });
    });

    // Items
    const itemTypes = [
        ["item", itoaItemSheet],
        ["skill", itoaSkillSheet]
    ];
    // Loop through all our item types and register each one
    itemTypes.forEach((type) => {
        Items.registerSheet("itoa", type[1], {
            types: [type[0]],
            // If I were fancy I'd localize this...
            label: type[0] && type[0][0].toUpperCase() + type[0].slice(1),
            makeDefault: true
        });
    });

    console.log("ItOA | Initialization complete!");
});