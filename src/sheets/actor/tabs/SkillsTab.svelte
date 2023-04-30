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
            const dropped = new TJSDocument();
            let droppedSkill;
            try
            {
                await dropped.setFromDataTransfer(JSON.parse(event.dataTransfer.getData('text/plain')))
                dropped.subscribe(value => droppedSkill = value);
            }
            catch (err) { /**/ }

            if ( !$actor.isOwner ) return false;
            if(droppedSkill.type !== 'skill') return false;
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
        <div class="skillTitle" on:click={e => skill.expanded = !skill.expanded}>{skill.item.name}</div>
        <div class="editBlock">
            <i id="editItem" class="editButton fas fa-pen-to-square" on:click={e => editItem(skill.item)} />
            <i id="deleteItem" class="editButton fas fa-trash" on:click={e => deleteItem(skill.item)} />
        </div>
    </div>
    <div class="skillInfo" style:display={skill.expanded ? 'flex' : 'none'}>
        <div class="infoSeperator"/>
        <div>{@html skill.item.system.text}</div>
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
        grid: 1.5rem / 1.5rem auto 3rem;
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
        display: flex;
        justify-content: left;
        align-items: center;
        margin: 0 0.3rem 0 0.3rem;
        width: 100%;
        height: 1.5rem;
    }

    .skillEntry .editBlock {
        display: flex;
        justify-self: right;
    }

    .skillInfo {
        flex-direction: row;
        /*margin: 0.2rem 0.2rem 0.2rem 1rem;*/
        text-align: left;
    }

    .skillInfo .infoSeperator {
        width: 0.9rem;
        margin: 0.4rem 0.8rem 0.4rem 0;
        border-right: 3px dotted #908d8a;
    }
</style>