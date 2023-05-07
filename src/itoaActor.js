export default class itoaActor extends Actor {
    // Item types
    skills = [];
    equipment = [];

    derived = {
        armor: 1,
        shield: {
            hardness: 0,
            hp: 5
        },
        weight: {
            stones: 0,
            light: 0,
            negligible: 0
        }
    };
    
    prepareDerivedData() {
        const data = this.system;

        // Initialize derived data
        this.derived = {
            armor: 0,
            shield: {
                hardness: 0,
                hp: 0
            },
            weight: {
                stones: 0,
                light: 0,
                negligible: 0
            }
        };

        // Populate items lists
        this.prepareItems(this.items);


    }

    prepareItems(items) {
        this.skills = [];
        this.equipment = [];

        items.forEach(item => {
            if(item.type === 'skill') {
                this.skills.push({item, expanded: false});
            }
            if(item.type === 'item') {
                this.equipment.push({item, expanded: false});
                // wornState:
                // 0 = dropped
                // 1 = stowed
                // 2 = worn
                // 3 = 1-hand
                // 4 = 2-hand
                // Item is equipped, modify stats
                if(item.system.equipable && item.system.wornState > 1) {
                    if(item.system.isArmor) this.derived.armor = Math.max(this.derived.armor, item.system.armor);
                    if(item.system.isShield) {
                        this.derived.shield.hardness = item.system.shield.hardness;
                        this.derived.shield.hp = item.system.shield.hp;
                    }
                    // TODO: Speed modifier
                    // TODO: Dodge modifier
                    // TODO: If required strength < strength, add disadvantage
                }

                if(item.system.wornState > 0) {    // If it isn't dropped
                    // Update carry weight
                    if(item.system.weight < 0) { // Negligible
                        //this.derived.weight.negligible++;
                        this.derived.weight.negligible += parseInt(item.system.quantity);
                    }
                    else if(item.system.weight === 0) { // Light
                        //this.derived.weight.light++;
                        this.derived.weight.light += parseInt(item.system.quantity);
                    }
                    else if(item.system.weight > 0) { // Stones
                        this.derived.weight.stones += parseInt(item.system.weight) * parseInt(item.system.quantity);
                    }
                }
            }
        });
    }

}