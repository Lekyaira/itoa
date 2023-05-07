<script>
   import { witsDodgeMod, modText } from '../../scripts/attributes';

    // Sheet and Actor data passed in from base sheet.
   export let sheet;
   export let doc;
   // Set actor variable so we can refer to it later.
   const actor = doc;

    // Hero points
    let heroPoints = $actor.system.heropoints;
    async function heropointClick() {
        if(heroPoints >= 5) return;
        heroPoints++;
        // Update our document with the changes.
        let data = {'system.heropoints': heroPoints};
        $actor.update(data);
    }

    async function heropointRightClick() {
        if(heroPoints <= 0) return;
        heroPoints--;
        // Update our document with the changes.
        let data = {'system.heropoints': heroPoints};
        $actor.update(data);
    }

    // Saves
    async function rollSave(attribute) {
        let saveValue = null;
        if(attribute === 'strength') saveValue = $actor.system.strength.current;
        else if(attribute === 'wits') saveValue = $actor.system.wits.current;
        else if(attribute === 'will') saveValue = $actor.system.will.current;
        else throw 'Must choose a valid attribute!';

        // TODO: Replace this with a standardized roll dialog
        const roll = await new Roll('1d20').roll();
        let success = roll.total <= saveValue ? true : false;
        if(roll.total == 20) success = true;
        if(roll.total == 1) success = false;

        const message = `
            <div>
                <h2>${attribute.charAt(0).toUpperCase() + attribute.slice(1)} Save</h2>
                <span style='color: ${success ? "green" : "red"};'>${success ? "Success!" : "Fail!"}</span>
            </div>
        `;

        roll.toMessage({flavor: message});
    }
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<section id="stats">

<!--HP-->
    <section id="hpBlock">
        <div class="hpBox">
            <div class="valueLabel">HP</div>
            <input class="valueInput{$actor.system.hp.current <= 0 ? ' lowHP' : ''}" type="number" min=0 name="system.hp.current" bind:value={$actor.system.hp.current} />
            <div class='valueLabel'>Base {$actor.system.hp.base}</div>
        </div>
    </section>

<!--Armor-->
    <section id="armorBlock">
        <div class="armorBox">
            <span class="valueLabel top">Armor</span>
            <span class="valueInput">{$actor.derived.armor}</span>
            <span class="bottom">
                <span class="valueLabel">Mod</span>
                <input class="valueInput" type="number" min=0 name="system.armorMod" bind:value={$actor.system.armorMod} />
            </span>
        </div>
        <div class="armorBox shieldBox">
            <span class="valueLabel top">Shield</span>
            <input class="valueInput shieldValue" type="number" min=0 name="derived.shield.hp" bind:value={$actor.derived.shield.hp} />
            <span class="bottom">
                <span class="left">
                    <span class="valueLabel">HT</span>
                    <span class="valueInput">{$actor.derived.shield.hardness}</span>
                </span>
                <span class="verticalDivider"/>
                <span class="right">
                    <span class="valueLabel">Max</span>
                    <input class="valueInput" type="number" min=0 name="derived.shield.hpMax" bind:value={$actor.derived.shield.hpMax} />
                </span>
            </span>
        </div>
    </section>

<!--Attributes-->
    <section id="attributes">
    <div class="attributeBox">
        <div class="valueLabel" on:click={() => rollSave('strength')}><div class="attribRoll fas fa-dice-d20"/>Strength</div>
        <input class="valueInput" type="number" min=0 name="system.strength.current" bind:value={$actor.system.strength.current} />
    </div>
    <div class="attributeBox">
        <div class="valueLabel" on:click={() => rollSave('wits')}><div class="attribRoll fas fa-dice-d20"/>Wits</div>
        <input class="valueInput" type="number" min="0" name="system.wits.current" bind:value={$actor.system.wits.current} />
    </div>
    <div class="attributeBox">
        <div class="valueLabel" on:click={() => rollSave('will')}><div class="attribRoll fas fa-dice-d20"/>Will</div>
        <input class="valueInput" type="number" min="0" name="system.will.current" bind:value={$actor.system.will.current} />
    </div>
    </section>

    <div class='horizontalDivider'/>

    <section id="otherStats">
        <!--Speed-->
        <span class="valueLabel">Speed</span>
        <span class="otherValue">4</span>
        <!--Dodge-->
        <span class="valueLabel">Dodge</span>
        <span class="otherValue">{modText(witsDodgeMod($actor.system.wits.current))}</span>
        <!--Hero Points-->
        <span class="valueLabel">Hero Points</span>
        <span class="heroPointsValue" on:click={heropointClick} on:contextmenu={heropointRightClick}>
            {#each [...Array(5).keys()].map(i=>i+1) as n}
                {#if heroPoints >= n}
                <i class="fas fa-diamond" />
                {:else}
                <i class="far fa-diamond" />
                {/if}
            {/each}
        </span>
    </section>

</section>

<style lang="scss">
    .verticalDivider {
        border-left: 1px solid black;
        height: 80%;
        width: 0.2rem;
        margin-right: 0.2rem;
    }
    
    .horizontalDivider {
        border-bottom: 1px solid black;
        height: 0.2rem;
        width: 80%;
        margin-bottom: 0.2rem;
    }

    .valueLabel {
        height: 0.9rem;
        font-size: 0.7rem;
        text-align: center;
    }

    .valueInput {
        font-size: 2rem;
        text-align: center;
        border: none;
        background: initial;
    }

    #stats {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 12rem;
        height: 49rem;
        border-right: 1px solid black;
        text-align: left;
        padding: 0.5rem;
        margin: 0rem;
    }

    #stats .verticalDivider {
        margin: 0 0.9rem 0 0.9rem;
    }

    /*
     * HP
     */
    #hpBlock {
        display: flex;
    }

    #hpBlock .hpBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0.2rem;
    }

    #hpBlock .valueInput {
        font-size: 3.5rem;
        width: 6rem;
        height: 3.5rem;
    }

    #hpBlock .lowHP {
        color: red;
    }

    /*
     * Armor
     */
    #armorBlock {
        display: flex;
    }
    
    #armorBlock .armorBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0.2rem;
        border: 1px solid black;
        border-radius: 0.2rem;
        height: 5.2rem;
    }

    #armorBlock .valueInput {
        width: 3rem;
        height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #armorBlock span {
        width: 100%;
    }

    #armorBlock span > .valueInput {
        font-size: 0.7rem;
        height: 0.8rem;
        width: 1.2rem;
        min-width: 1.2rem;
    }

    #armorBlock .top {
        border-bottom: 1px solid black;
        height: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #armorBlock .bottom {
        border-top: 1px solid black;
        display: flex;
        align-items: center;
        height: 1.2rem;
        padding: 0 0.2rem 0 0.2rem;
    }

    #armorBlock .bottom .verticalDivider {
        margin: 0;
        margin-right: 0.2rem;
        width: 0.1rem;
        height: 100%;
    }

    #armorBlock .bottom .right {
        display: flex;
        justify-content: center;
        align-items: baseline;
    }

    #armorBlock .bottom .left {
        display: flex;
        justify-content: center;
        align-items: baseline;
    }

    #armorBlock .bottom .valueLabel {
        text-align: right;
    }

    /*
     * Attributes
     */
    #attributes {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0.5rem 0 0.5rem 0;
    }

    #attributes .attributeBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 3.6rem;
        height: 3.6rem;
        border: 1px solid black;
        border-radius: 0.1rem 0.6rem 0.6rem 0.6rem;
        margin: 0 0.1rem 0 0.1rem;
    }

    #attributes .valueLabel {
        width: 100%;
        text-align: left;
        margin-left: 0.2rem;
    }

    #attributes .valueInput {
        width: 2.8rem;
        height: 1.5rem;
    }

    #attributes .attribRoll {
        font-size: 0.6rem;
        margin-right: 0.1rem;
    }

    #otherStats {
        display: grid;
        grid: auto / auto auto;
        width: 100%;
        align-items: baseline;
    }

    #otherStats span {
        margin: 0 0.2rem 0 0.2rem;
    }

    #otherStats .valueLabel {
        text-align: right;
    }

    #otherStats .otherValue {
        font-size: 1rem;
    }
</style>