import itoaBaseSheet from "../core/itoaBaseSheet";
import SkillSheetTemplate from "./SkillSheetTemplate.svelte";

export default class itoaItemSheet extends itoaBaseSheet
{
    get item() {
        return this.object;
    }

    constructor(object = {}, options = {}) {
        super(object, options, SkillSheetTemplate);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 700,
            height: 600,
        });
    }
}