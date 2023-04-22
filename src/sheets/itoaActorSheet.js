import itoaBaseSheet from "../core/itoaBaseSheet";
import ActorSheetTemplate from "./ActorSheetTemplate.svelte";

export default class itoaActorSheet extends itoaBaseSheet
{
    get actor() {
        return this.object;
    }

    constructor(object = {}, options = {}) {
        super(object, options, ActorSheetTemplate);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 700,
            height: 900,
        });
    }
}