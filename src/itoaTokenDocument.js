export default class itoaTokenDocument extends TokenDocument {
    /**
     * When the base Actor for a TokenDocument changes, we may need to update its Actor instance
     * @param {object} update
     * @param {object} options
     * @internal
     */
    _onUpdateBaseActor(update={}, options={}) {

        // Update synthetic Actor data
        if (!this.isLinked && this.delta) {
            this.delta.updateSyntheticActor();
            this.actor.sheet.render(false, { action: 'updateSyntheticActor' });
        }

        this._onRelatedUpdate(update, options);
    }
}