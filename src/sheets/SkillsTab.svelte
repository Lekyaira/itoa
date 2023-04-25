<script>
    import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';

    // Sheet and Actor data passed in from base sheet.
    export let sheet;
    export let doc;
    // Set actor variable so we can refer to it later.
    const actor = doc;

    ////////////////////////////////
    // Handle Inventory Functions //
    ////////////////////////////////
    async function addNewItem()
    {
        const data = [{name: 'New Skill', type: 'skill'}];
        await Item.createDocuments(data, {parent: $actor});
    }

    async function deleteItem(item)
    {
        console.log(item);
        await Item.deleteDocuments([item.id], { parent: $actor });
    }

    async function editItem(item)
    {
        item.sheet.render(true);
    }

    /**
    * Handles parsing the drop event and sets the new `uuid` or undefined.
    *
    * @param {DragEvent}   event -
    */
    async function onDrop(event)
    {
            console.log(event);
            const dropped = new TJSDocument();
            let droppedSkill;
            try
            {
                await dropped.setFromDataTransfer(JSON.parse(event.dataTransfer.getData('text/plain')))
                dropped.subscribe(value => droppedSkill = value);
            }
            catch (err) { /**/ }

            if ( !$actor.isOwner ) return false;
            const data = [{name: droppedSkill.name, type: droppedSkill.type, img: droppedSkill.img, system:{...droppedSkill.system}}];
            await Item.createDocuments(data, {parent: $actor});
    }
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<section on:drop|preventDefault|stopPropagation={onDrop}>
    <div class="seperator"/>
    <div id="skillsHeader">
        <i id="addNew" class="editButton fas fa-plus" name="skill" on:click={e => addNewItem("skill")} />
    </div>
    {#each $actor.skills as skill, i}
    <div class="skillEntry" style:background-color="{i % 2 ? 'rgba(0,0,0,0.05)' : 'transparent'}">
        <img class="skillImage" src="{skill.item.img}" alt="{skill.item.name} image." />
        <div class="skillTitle" on:click={e => item.expanded = !item.expanded}>{skill.item.name}</div>
        <div class="editBlock">
            <i id="editItem" class="editButton fas fa-pen-to-square" on:click={e => editItem(skill.item)} />
            <i id="deleteItem" class="editButton fas fa-trash" on:click={e => deleteItem(skill.item)} />
        </div>
    </div>
    {/each}
</section>

<style lang="scss">
    section {
        height: 47.5rem;
        overflow-y: auto;
    }

    .editButton {
        font-size: 1rem;
        color: #635d58;
        margin-right: 0.2rem;
    }

    .seperator {
        height: 0.4rem;
    }

    #skillsHeader {
        display: flex;
        justify-content: right;
        align-items: center;
        height: 1.2rem;
        border-bottom: 1px solid black;
        border-top: 1px solid black;
        background-color: rgba(0,0,0,0.1);
        padding: 0.2rem;
    }

    .skillEntry {
        display: grid;
        grid: 1.5rem / 1.5rem auto auto;
        align-items: center;
        height: 1.7rem;
        padding: 0.1rem;
    }

    .skillEntry img {
        height: 1.5rem;
        width: 1.5rem;
    }

    .skillEntry .skillTitle {
        justify-self: left;
        margin: 0 0.3rem 0 0.3rem;
    }

    .skillEntry .editBlock {
        display: flex;
        justify-self: right;
    }
</style>