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
    async function addNewItem(type)
    {
        //const type = event.target.attributes.name.value;
        console.log(`ITOA | addNewItem, type: '${type}'`);
        // TODO: Add some cool item adding code here!
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

            console.log(droppedSkill);

            if ( !$actor.isOwner ) return false;
            const data = [{name: droppedSkill.name, type: droppedSkill.type, img: droppedSkill.img, system:{...droppedSkill.system}}];
            console.log(data);
            const item = await Item.createDocuments(data, {parent: $actor});
            console.log(item);
    }
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<div on:drop|preventDefault|stopPropagation={onDrop}>
    <div id="skillsHeader">
        <i id="addNew" class="editButton fas fa-plus" name="skill" on:click={e => addNewItem("skill")} />
    </div>
    {#each $actor.skills as skill}
    <div class="skillEntry">
        <img class="skillImage" src="{skill.item.img}" alt="{skill.item.name} image." />
        <div class="skillTitle" on:click={e => item.expanded = !item.expanded}>{skill.item.name}</div>
        <div class="editBlock">
            <i id="editItem" class="editButton fas fa-pen-to-square" on:click={e => editItem(skill.item)} />
            <i id="deleteItem" class="editButton fas fa-trash" on:click={e => deleteItem(skill.item)} />
        </div>
    </div>
    {/each}
</div>

<style lang="scss">
    
</style>