export default class itoaActor extends Actor {
    derived = {
        armor: 1,
        shield: {
            hardness: 0,
            hp: 5
        }
    };
    
    prepareDerivedData() {
        const data = this.system;
    }
}