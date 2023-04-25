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
                if(item.equipable && item.wornState > 1) {
                    if(item.isArmor) this.derived.armor = Math.max(this.derived.armor, item.armor);
                    if(item.isShield) {
                        this.derived.shield.hardness = item.shield.hardness;
                        this.derived.shield.hp = item.shield.hp;
                    }
                    // TODO: Speed modifier
                    // TODO: Dodge modifier
                    // TODO: If required strength < strength, add disadvantage
                }

                // Update carry weight
                if(item.weightType === 0) { // Stones
                    this.derived.weight.stones += item.weight;
                }
                else if(item.weightType === 1) { // Light
                    this.derived.weight.light += item.weight;
                }
                else if(item.weightType === 2) { // Negligible
                    this.derived.weight.negligible += item.weight;
                }
            }
        });
    }
}