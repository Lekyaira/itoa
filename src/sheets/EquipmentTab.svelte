<script>
    import { strEncumbered, strMaxLoad } from '../scripts/attributes';
    import { convertPxToRem } from '../scripts/rempx';
    import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';
    import { afterUpdate } from 'svelte';

    // Sheet and Actor data passed in from base sheet.
   export let sheet;
   export let doc;
   // Set actor variable so we can refer to it later.
   const actor = doc;

    // wornState:
    // 0 = dropped
    // 1 = stowed
    // 2 = worn
    // 3 = 1-hand
    // 4 = 2-hand
    // Worn state icons
    const wornStateDropped = "fas fa-grip-lines";
    const wornStateStowed = "fas fa-sack"; // fa-backpack, fa-cart-flatbed-suitcase
    const wornStateWorn = "fas fa-shirt";
    const wornStateOneHand = "fas fa-hand-fist";
    const wornStateTwoHand = "fas fa-hands-holding";

    function getWornStateIcon(state){
        if(state <= 0) return wornStateDropped;
        else if(state === 1) return wornStateStowed;
        else if(state === 2) return wornStateWorn;
        else if(state === 3) return wornStateOneHand;
        else return wornStateTwoHand;
    }

    function setWornState(item, state) {
        if(item){
            item.system.wornState = state;
            item.update({_id: item.id, 'system.wornState': state});
            document.getElementById('wornStatePopup').classList.toggle('show');
        }
    }

    let wornStatePopup = {
        left: 0,
        top: 0,
        rowItem: undefined
    }

    let lightItems;
    let lightEncumbrance;
    let encumbrance;
    let encumberedWeight;
    let maxWeight;
    let encumbrancePercent;

    function updateCarryWeight() {
        lightItems = $actor.derived.weight.light
            + Math.floor($actor.derived.weight.negligible/200);
        lightEncumbrance = lightItems - Math.floor(lightItems/5);
        encumbrance = $actor.derived.weight.stones 
            + Math.floor(lightEncumbrance/5);
        encumberedWeight = strEncumbered($actor.system.strength.current);
        maxWeight = strMaxLoad($actor.system.strength.current);
        encumbrancePercent = Math.min(encumbrance/maxWeight*100, 100);
    }

    ////////////////////////////////
    // Handle Inventory Functions //
    ////////////////////////////////
    async function addNewItem()
    {
        const data = [{name: 'New Item', type: 'item'}];
        await Item.createDocuments(data, {parent: $actor});
        updateCarryWeight();
    }

    async function deleteItem(item)
    {
        console.log(item);
        await Item.deleteDocuments([item.id], { parent: $actor });
        updateCarryWeight();
    }

    async function editItem(item)
    {
        item.sheet.render(true);
        updateCarryWeight();
    }

    /**
    * Handles parsing the drop event and sets the new `uuid` or undefined.
    *
    * @param {DragEvent}   event -
    */
    async function onDrop(event)
    {
            const dropped = new TJSDocument();
            let droppedItem;
            try
            {
                await dropped.setFromDataTransfer(JSON.parse(event.dataTransfer.getData('text/plain')))
                dropped.subscribe(value => droppedItem = value);
            }
            catch (err) { /**/ }

            if ( !$actor.isOwner ) return false;
            if(droppedItem.type !== 'item') return false;
            const data = [{name: droppedItem.name, type: droppedItem.type, img: droppedItem.img, system:{...droppedItem.system}}];
            await Item.createDocuments(data, {parent: $actor});
            updateCarryWeight();
    }

    afterUpdate(async () => {
        updateCarryWeight();
    });

</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<section on:drop|preventDefault|stopPropagation={onDrop}>
    <div class="seperator"/>
    <div id="itemsHeader">
        <div class="headerText">Equipment</div>
        <div class="headerText">Quantity</div>
        <div class="headerText">Weight</div>
        <i id="addNew" class="editButton fas fa-plus" on:click={addNewItem} />
    </div>
    {#each $actor.equipment as item, i}
    <div class="itemEntry" style:background-color="{i % 2 ? 'rgba(0,0,0,0.05)' : 'transparent'}">
        <img class="skillImage" src="{item.item.img}" alt="{item.item.name} image." />
        <div class="itemTitle" on:click={e => item.expanded = !item.expanded}>{item.item.name}</div>
        <div class="itemQuantityBlock">
            <i class="fas fa-minus" on:click={() => {
                item.item.system.quantity > 1 ? item.item.system.quantity-- : '';
                item.item.update({_id: item.item.id, 'system.quantity': item.item.system.quantity});
            }} />
            <div style:width={'2rem'}>{item.item.system.quantity}</div>
            <i class="fas fa-plus" on:click={() => {
                item.item.system.quantity++;
                item.item.update({_id: item.item.id, 'system.quantity': item.item.system.quantity});
            }} />
        </div>
        <div class="itemWeight">{
            item.item.system.weight < 0 ? '-' : 
            item.item.system.weight > 0 ? item.item.system.quantity * item.item.system.weight :
            item.item.system.quantity > 1 ? item.item.system.quantity + 'L' : 'L'
        }</div>
        
        <div class="editBlock">
            <i id="wornItem{i}" class="editButton wornPopup {getWornStateIcon(item.item.system.wornState)}" on:click={() => {
                //let row = document.getElementById(`wornItem${i}`);
                let row = window.$(`#wornItem${i}`);
                wornStatePopup.rowItem = item.item;
                wornStatePopup.top = row.position().top;
                wornStatePopup.left = row.position().left;
                let popup = document.getElementById(`wornStatePopup`);
                popup.classList.toggle("show");
            }}/>
            <i id="editItem" class="editButton fas fa-pen-to-square" on:click={e => editItem(item.item)} />
            <i id="deleteItem" class="editButton fas fa-trash" on:click={e => deleteItem(item.item)} />
        </div>
    </div>
    <div class="itemInfo" style:display={item.expanded ? 'flex' : 'none'}>
        <div class="infoSeperator"/>
        <div>{@html item.item.system.text}</div>
    </div>
    {/each}
</section>
<div id="encumbranceProgress">
    <div id="encumbranceBarBack">
        <div id="encumbranceBar" 
            style:width='{encumbrancePercent}%'
            style:background-color={encumbrancePercent >= 100 ? 'red' : encumbrancePercent > 50 ? 'orange' : 'blue'}
            style:border-radius={encumbrancePercent >= 100 ? '0.2rem' : '0.2rem 0 0 0.2rem'}/>
        <div id="encumbranceValue" class="encumbranceText">Encumbrance {encumbrance} ({lightEncumbrance}/5)L / Encumbered: {encumberedWeight}</div>
        <div id="encumbranceMax" class="encumbranceText">Max Load: {maxWeight}</div>
    </div>
</div>
<!--wornState Popup-->
<div class="wornStatePopup" id="wornStatePopup" 
    style:left='{convertPxToRem(wornStatePopup.left)-9}rem' 
    style:top='{convertPxToRem(wornStatePopup.top)-1.2}rem'
>
    <div on:click={() => setWornState(wornStatePopup.rowItem, 0) }>
        <i class="{wornStateDropped}"/> 
        <span class="popupText">Dropped</span>
    </div>
    <div on:click={() => setWornState(wornStatePopup.rowItem, 1) }>
        <i class="{wornStateStowed}" />
        <span class="popupText">Stowed</span>
    </div>
    <div on:click={() => setWornState(wornStatePopup.rowItem, 2) }>
        <i class="{wornStateWorn}" />
        <span class="popupText">Worn</span>
    </div>
    <div on:click={() => setWornState(wornStatePopup.rowItem, 3) }>
        <i class="{wornStateOneHand}" />
        <span class="popupText">1-Hand</span>
    </div>
    <div on:click={() => setWornState(wornStatePopup.rowItem, 4) }>
        <i class="{wornStateTwoHand}" />
        <span class="popupText">2-Hand</span>
    </div>
</div>
<!--End wornState Popup-->

<style lang="scss">
    section {
        height: 46.5rem;
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

    #itemsHeader {
        display: grid;
        grid: auto / 18rem 5rem 5rem auto;
        align-items: center;
        height: 1.2rem;
        border-bottom: 1px solid black;
        border-top: 1px solid black;
        background-color: rgba(0,0,0,0.1);
        padding: 0 0 0 3rem;
    }

    #itemsHeader .headerText {
        color: #635d58;
        font-weight: bold;
        font-size: 0.8rem;
        text-align: center;
    }

    #itemsHeader #addNew {
        justify-self: right;
        margin-right: 0.4rem;
    }

    .itemEntry {
        display: grid;
        grid: 1.5rem / 1.5rem 19.4rem 5rem 5rem auto;
        align-items: center;
        height: 1.7rem;
        padding: 0.1rem;
    }

    .itemEntry img {
        height: 1.5rem;
        width: 1.5rem;
        border: 0;
    }

    .itemEntry .itemTitle {
        justify-self: left;
        display: flex;
        justify-content: left;
        align-items: center;
        margin: 0 0.3rem 0 0.3rem;
        width: 100%;
        height: 1.5rem;
    }

    .itemEntry .editBlock {
        display: flex;
        justify-self: right;
    }

    .itemEntry .editBlock .wornPopup {
        position: relative;
        display: inline-block;
    }

    .wornStatePopup {
        visibility: hidden;
        display: flex;
        flex-direction: column;
        width: 8rem;
        text-align: center;
        border-radius: 6px;
        padding: 0.5rem 0;
        position: absolute;
        z-index: 1;
        /*bottom: 0;
        left: 0;
        margin-left: 0;*/
        background-color: #908d8a;
    }

    .wornStatePopup > div {
        display: grid;
        grid: auto / 1rem auto;
        padding: 0 1rem 0 1rem;
    }

    .wornStatePopup::after {
        content: "";
        position: absolute;
        top: 20%;
        left: 100%;
        border-width: 8px;
        border-style: solid;
        border-color: transparent transparent transparent #908d8a;
    }

    .show {
        visibility: visible;
    }

    .itemEntry .itemQuantityBlock {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .itemInfo {
        flex-direction: row;
        /*margin: 0.2rem 0.2rem 0.2rem 1rem;*/
        text-align: left;
    }

    .itemInfo .infoSeperator {
        width: 0.9rem;
        margin: 0.4rem 0.8rem 0.4rem 0;
        border-right: 3px dotted #908d8a;
    }

    /*
     * Encumbrance Progress Bar
     */

    #encumbranceProgress {
        height: 1rem;
        width: 90%;
        margin-left: 2rem;
    }

    .encumbranceText {
        position: absolute;
        top: 0;
        height: 1rem;
        font-size: 0.8rem;
        color: white;
    }

    #encumbranceValue {
        left: 0.5rem;
    }

    #encumbranceMax {
        right: 0.5rem;
    }

    #encumbranceBarBack {
        position: relative;
        height: 1rem;
        width: 100%;
        background-color: darkgray;
        border-radius: 0.2rem;
    }

    #encumbranceBar {
        position: absolute;
        top: 0;
        left: 0;
        height: 1rem;
    }
</style>