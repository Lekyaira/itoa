<script>
    // Sheet and Actor data passed in from base sheet.
    export let sheet;
    export let doc;
    // Set actor variable so we can refer to it later.
    const actor = doc;

    // Edit actor portrait
    function editPortrait(event){
        console.log("Edit!");
        const tokenize = game.modules.get('vtta-tokenizer')?.api?.tokenizeActor;
        console.log($doc.actor);
        if(tokenize) tokenize($doc);
        else sheet.editImage();
    }

</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<section id="characterContent">
    <img src={$actor.img} alt="{$actor.name}'s portrait" on:click={editPortrait} />
    <section id="infoBlock">
        <div><label for="species">Species </label><input id="species" name="system.species" type="text" bind:value={$actor.system.species} /></div>
        <div><label for="class">Class</label><input id="class" name="system.class" type="text" bind:value={$actor.system.class} /></div>
        <div><label for="background">Background</label><input id="background" name="system.background" type="text" bind:value={$actor.system.background} /></div>
    </section>
</section>

<style lang="scss">
    #characterContent {
        display: flex;
        border-bottom: 1px solid black;
        padding: 0.5rem;
        height: 14rem;
    }
    img {
        width: 10rem;
        height: 13rem;
        object-fit: cover;
    }
    #infoBlock {
        padding: 0.4rem;
        width: 22rem;
    }
    #infoBlock input {
        width: 10rem;
        height: 2rem;
        display: flex;
    }
    #infoBlock div {
        display: flex;
        flex-direction: column;
        text-align: left;
        justify-content: space-between;
        margin: 0.4rem;
    }
    #infoBlock label {
        font-size: 0.7rem;
    }
</style>