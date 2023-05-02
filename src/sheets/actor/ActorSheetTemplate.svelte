<script>
   import { each } from "svelte/internal";
   import {getContext} from "svelte";
   import CharacterInfoTab from './tabs/CharacterInfoTab.svelte';
   import SkillsTab from './tabs/SkillsTab.svelte';
   import EquipmentTab from './tabs/EquipmentTab.svelte';
   import Sidebar from './Sidebar.svelte';

   // Sheet and Actor data passed in from base sheet.
   export let sheet;
   export let doc;
   // Set actor variable so we can refer to it later.
   const actor = doc;

   const application = getContext('#external').application;
   const headerButtonNoLabel = application.reactive.storeAppOptions.headerButtonNoLabel;
   $headerButtonNoLabel = false;

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
      <svelte:component this={Sidebar} bind:sheet={sheet} bind:doc={doc}/>
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