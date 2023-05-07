import itoaBaseSheet from "../../core/itoaBaseSheet";
import ItemSheetTemplate from "./ItemSheetTemplate.svelte";

export default class itoaItemSheet extends itoaBaseSheet
{
    get item() {
        return this.object;
    }

    constructor(object = {}, options = {}) {
        super(object, options, ItemSheetTemplate);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 800,
            height: 600,
        });
    }
}