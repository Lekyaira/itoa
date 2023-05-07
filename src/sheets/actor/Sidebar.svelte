<script>
    // Sheet and Actor data passed in from base sheet.
   export let sheet;
   export let doc;
   // Set actor variable so we can refer to it later.
   const actor = doc;

    // Hero points
    let heroPoints = $actor.system.heropoints;
    function heropointClick() {
        if(heroPoints >= 5) return;
        heroPoints++;
        // Update our document with the changes.
        let data = {'system.heropoints': heroPoints};
        $actor.update(data, {action: 'heropointClick'});
    }

    function heropointRightClick() {
        if(heroPoints <= 0) return;
        heroPoints--;
        // Update our document with the changes.
        let data = {'system.heropoints': heroPoints};
        $actor.update(data, {action: 'heropointRightClick'});
    }
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<section id="stats">
    <!--HP-->
    <section id="hpBlock">
    <div class="hpBox">
        <div class="valueLabel">HP</div>
        <input class="valueInput" type="number" min=0 name="system.hp.current" bind:value={$actor.system.hp.current} />
    </div>
    
    <div class="hpBox">
        <div class="valueLabel">Hero Points</div>
        <div class="heroPointsValue" on:click={heropointClick} on:contextmenu={heropointRightClick}>
            {#each [...Array(5).keys()].map(i=>i+1) as n}
                {#if heroPoints >= n}
                <i class="fas fa-diamond" />
                {:else}
                <i class="far fa-diamond" />
                {/if}
            {/each}
        </div>
    </div>
    </section>
<!--Armor-->
    <section id="armorBlock">
    <div class="armorBox">
        <div class="valueLabel"> </div>
        <div class="valueLabel">Armor</div>
        <input class="valueInput" type="number" min=0 name="derived.armor" bind:value={$actor.derived.armor} />
    </div>
    <div class="armorBox">
        <div class="valueLabel">Shield</div>
        <div id="shieldBlock">
            <div class="shieldBox">
                <div class="valueLabel">Hardness</div>
                <input class="valueInput" type="number" min=0 name="derived.shield.hardness" bind:value={$actor.derived.shield.hardness} />
            </div>
            <div class="shieldBox">
                <div class="valueLabel">HP</div>
                <input class="valueInput" type="number" min=0 name="derived.shield.hp" bind:value={$actor.derived.shield.hp} />
            </div>
        </div>
    </div>
    </section>
<!--Attributes-->
    <section id="attributes">
    <div class="attributeBox">
        <div class="valueLabel"><div class="attribRoll fas fa-dice-d20"/>Strength</div>
        <input class="valueInput" type="number" min=0 name="system.strength.current" bind:value={$actor.system.strength.current} />
    </div>
    <div class="attributeBox">
        <div class="valueLabel"><div class="attribRoll fas fa-dice-d20"/>Wits</div>
        <input class="valueInput" type="number" min="0" name="system.wits.current" bind:value={$actor.system.wits.current} />
    </div>
    <div class="attributeBox">
        <div class="valueLabel"><div class="attribRoll fas fa-dice-d20"/>Will</div>
        <input class="valueInput" type="number" min="0" name="system.will.current" bind:value={$actor.system.will.current} />
    </div>
    </section>
</section>

<style lang="scss">
    .verticalDivider {
        border-left: 1px solid black;
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
        width: 3rem;
        height: 2rem;
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
        height: 4.5rem;
    }

    #armorBlock .valueInput {
        width: 3rem;
        height: 2rem;
    }

    #armorBlock #shieldBlock {
        display: flex;
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
</style>