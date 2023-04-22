import itoaBaseSheet from "../core/itoaBaseSheet";
import ItemSheetTemplate from "./ItemSheetTemplate.svelte";

export default class itoaItemSheet extends itoaBaseSheet
{
    get actor() {
        return this.object;
    }

    constructor(object = {}, options = {}) {
        super(object, options, ItemSheetTemplate);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 700,
            height: 900,
        });
    }
}