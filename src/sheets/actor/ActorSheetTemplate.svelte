<script>
   import { each } from "svelte/internal";
   import {getContext} from "svelte";
   import CharacterInfoTab from './tabs/CharacterInfoTab.svelte';
   import SkillsTab from './tabs/SkillsTab.svelte';
   import EquipmentTab from './tabs/EquipmentTab.svelte';

   // Sheet and Actor data passed in from base sheet.
   export let sheet;
   export let doc;
   // Set actor variable so we can refer to it later.
   const actor = doc;

   const application = getContext('#external').application;
   const headerButtonNoLabel = application.reactive.storeAppOptions.headerButtonNoLabel;
   $headerButtonNoLabel = false;

   // Hero points
   function heropointClick() {
      if($actor.system.heropoints < 5) {
         $actor.system.heropoints += 1;
         // Create update data with our document id.
         let docData = {_id: $doc.id};
         // Get the calling element's name and value and update the data.
         docData['system.heropoints'] = $actor.system.heropoints;
         // Update our document with the changes.
         $doc.update(docData);
      }
   }

   function heropointRightClick() {
      if($actor.system.heropoints > 0) {
         $actor.system.heropoints -= 1;
         // Create update data with our document id.
         let docData = {_id: $doc.id};
         // Get the calling element's name and value and update the data.
         docData['system.heropoints'] = $actor.system.heropoints;
         // Update our document with the changes.
         $doc.update(docData);
      }
   }

   // Navigation
   const navTabs = [
      {label: "Character", symbol: "fas fa-address-card", component: CharacterInfoTab},
      {label: "Skills", symbol: "fas fa-hand", component: SkillsTab},
      {label: "Equipment", symbol: "fas fa-box-open", component: EquipmentTab}
   ];
   let currentTab = 0;
</script>
  
<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<main class="itoaSheet">
<!--Header-->
   <header>
      <input id="name" type="text" name="name" bind:value={$actor.name} />
      <section id="levelBar">
         <section id="level">
            <div class="valueLabel">Level</div>
            <input id="levelText" class="valueInput" type="text" name="system.level" bind:value={$actor.system.level} />
         </section>
         <div id="experience">
            <div id="experienceValue"><input id="xpValue" type="text" name="system.xp" bind:value={$actor.system.xp} /> / 1000</div>
            <progress id="experienceBar" value={$actor.system.xp} max="1000" />
         </div>
      </section>
   </header>
<!--Main-->
   <section id="main">
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
                     {#if $actor.system.heropoints >= n}
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
<!--Info-->
      <section id="info">
         <section id="infoHeader">
            <div id="tabLabel">{navTabs[currentTab].label}</div>
            {#each navTabs as tab, i}
               <div class="tabButton" on:click={e => currentTab = i}><i class={tab.symbol}/></div>
            {/each}
         </section>
         <section id="infoContent">
            <svelte:component
               this={navTabs[currentTab].component}
               bind:sheet={sheet}
               bind:doc={doc}/>
         </section>
      </section>
   </section>
</main>
  
<style lang="scss">
   /*
    * Header
    */
   main {
      text-align: center;
      display: flex;
      flex-direction: column;
   }

   main .verticalDivider {
      border-left: 1px solid black;
   }

   main .valueLabel {
      height: 0.9rem;
      font-size: 0.7rem;
      text-align: center;
   }

   main .valueInput {
      font-size: 2rem;
      text-align: center;
      border: none;
      background: initial;
   }

   header {
      display: flex;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid black;
   }

   header #name {
      font-size: 1.5rem;
      text-align: left;
      height: 2.5rem;
      margin: 0.5rem;
      border: none;
      background: initial;
   }

   header #levelBar {
      display: flex;
      align-items: center;
   }

   header #level {
      display: flex;
      flex-direction: column;
      align-items: center;
   }

   header .valueInput {
      height: 1.5rem;
      width: 2.5rem;
   }

   header #experience {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
   }

   #xpValue {
      height: 1rem;
      width: 2.2rem;
      border: none;
      background: initial;
      text-align: right;
   }

   /*
    * Main
    */
   #main {
      display: flex;
      flex-flow: row;
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

   /*
    * Info
    */
   #info {
      display: flex;
      flex-direction: column;
      width: 37rem;
   }
   #info #infoHeader {
      display: flex;
      align-items: center;
      border-bottom: 1px solid black;
      height: 1.5rem;
      background-color: rgba(0,0,0,0.1);
   }
   #infoHeader #tabLabel {
      font-size: 0.9rem;
      font-weight: bold;
      text-align: left;
      margin: 0 1rem 0 1rem;
      width: 10rem;
   }
   #infoHeader .tabButton {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid black;
      border-radius: 100%;
      width: 1.8rem;
      height: 1.8rem;
      margin-right: 0.5rem;
      /*background-color: rgb(100,100,100);*/
      /*background-color: #493028;
      color: burlywood;*/
      background-color: #635d58;
      color: #d1cecb;
      font-size: 1rem;
   }
   #infoHeader .tabButton:hover {
      transform: scale(1.15);
      /*width: 2.1rem;
      height: 2.1rem;
      font-size: 1.3rem;
      margin-right: 0.2rem;*/
   }
   
</style>