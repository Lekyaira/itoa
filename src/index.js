import itoaActor from './itoaActor.js';
import itoaItem from './itoaItem.js';
import itoaActorSheet from './sheets/itoaActorSheet.js';
import itoaItemSheet from './sheets/itoaItemSheet.js';

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
    Actors.registerSheet("itoa", itoaActorSheet, { 
        types: ["character"],
        makeDefault: true 
    });
    Items.registerSheet("itoa", itoaItemSheet, {
        types: ["item"],
        makeDefault: true
    });

    console.log("ItOA | Initialization complete!");
});