import itoaBaseSheet from "../../core/itoaBaseSheet";
import ActorSheetTemplate from "./ActorSheetTemplate.svelte";

export default class itoaActorSheet extends itoaBaseSheet
{
    get actor() {
        return this.object;
    }

    /**
     * If this Actor Sheet represents a synthetic Token actor, reference the active Token
     * @type {Token|null}
     */
    get token() {
        return this.object.token || this.options.token || null;
    }

    constructor(object = {}, options = {}) {
        super(object, options, ActorSheetTemplate);
    }

    /**
    * Specify the set of config buttons which should appear in the app header. Buttons should be returned as an
    * Array of objects.
    *
    * Provides an explicit override of Application._getHeaderButtons to add additional buttons.
    *
    * Additional properties for button data includes:
    * - {boolean}    alignLeft - When true the button is left aligned after the window title.
    * - {string}     keyCode - Defines the KeyboardEvent 'code' that activates the button; default: 'Enter'.
    * - {Function}   onContextMenu - Callback for right click / contextmenu keyboard event.
    * - {Function}   onPress - Callback for left click / 'Enter' key.
    * - {Record<string, string>} styles - Inline styles to apply to the button.
    * - {string}     title - A tooltip to display when hovered.
    *
    * @returns {ApplicationHeaderButton[]} The app header buttons.
    * @override
    */
    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();
        const canConfigure = game.user.isGM || (this.actor.isOwner && game.user.can("TOKEN_CONFIGURE"));
        if (this.options.editable && canConfigure) {
            buttons.unshift({
                label: this.token ? "Token" : "TOKEN.TitlePrototype",
                class: "configure-token",
                icon: "fas fa-user-circle",
                onclick: ev => this._onConfigureToken(ev)
            });
        }
        return buttons;
    }

    /**
     * Handle requests to configure the Token for the Actor
     * @param {PointerEvent} event      The originating click event
     * @private
     * @returns token.sheet.render function
     */
    _onConfigureToken(event) {
        event.preventDefault();
        const renderOptions = {
        left: Math.max(this.position.left - 560 - 10, 10),
        top: this.position.top
        };
        if (this.token) return this.token.sheet.render(true, renderOptions);
        else new CONFIG.Token.prototypeSheetClass(this.actor.prototypeToken, renderOptions).render(true);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 800,
            height: 900,
        });
    }
}