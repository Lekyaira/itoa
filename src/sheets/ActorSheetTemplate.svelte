<script>
   // Sheet and Actor data passed in from base sheet.
   export let sheet;
   export let doc;
   // Set actor variable so we can refer to it later.
   const actor = doc;
</script>
  
<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<main class="itoaSheet">
   <header>
      <input id="name" type="text" name="name" bind:value={$actor.name} />
      <section id="levelBar">
         <section id="level">
            <div>Level</div>
            <input id="levelText" type="text" name="system.level" bind:value={$actor.system.level} />
         </section>
         <div id="experience">
            <div id="experienceValue"><input id="xpValue" type="text" name="system.xp" bind:value={$actor.system.xp} /> / 1000</div>
            <progress id="experienceBar" value={$actor.system.xp} max="1000" />
         </div>
      </section>
   </header>
   <section id="main">
      <section id="attributes">
         <div>
            Hero points
         </div>
         <div>
            HP
         </div>
         <div>
            Armor
         </div>
         <div>
            Shield
         </div>
         <div>
            Dodge
         </div>
         <div>
            <div class="attribName" id="str">Strength</div>
            <input class="attribValue" type="text" name="system.strength.current" bind:value={$actor.system.strength.current} />
         </div>
         <div>
            <div class="attribName" id="wit">Wits</div>
            <input class="attribValue" type="text" name="system.wits.current" bind:value={$actor.system.wits.current} />
         </div>
         <div>
            <div class="attribName" id="wil">Will</div>
            <input class="attribValue" type="text" name="system.will.current" bind:value={$actor.system.will.current} />
         </div>
      </section>
      <section id="info">
         <img src={$actor.img} alt="{$actor.name}'s portrait" on:click={sheet.editImage()} />
         <section id="infoBlock">
            <div><label for="species">Species </label><input id="species" type="text" /></div>
            <div><label for="class">Class</label><input id="class" type="text" /></div>
            <div><label for="background">Background</label><input id="background" type="text" /></div>
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
   }

   header #levelBar {
      display: flex;
      align-items: center;
   }

   header #level {
      position: relative;  
   }

   header #level div {
      font-size: 0.7rem;
      position: absolute;
      top: 0.2rem;
      left: 0.4rem;
   }

   header #levelText {
      height: 3.5rem;
      width: 2.5rem;
      font-size: 2rem;
      border-radius: 0.5rem;
   }

   #xpValue {
      height: 1rem;
      width: 4rem;
   }

   /*
    * Main
    */
   #main {
      display: flex;
      flex-flow: row;
   }

   /*
    * Attributes
    */
   #attributes {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 8rem;
      height: 40rem;
      border-right: 1px solid black;
      text-align: left;
      padding: 0.5rem;
      margin: 0rem;
   }

   #attributes div {
      position: relative;
      margin: 0.4rem;
   }

   #attributes .attribName {
      font-size: 0.7rem;
      text-align: center;
      position: absolute;
      top: -0.2rem;
   }

   #attributes #str {
      left: -0.1rem;
   }

   #attributes #wit {
      left: 0.5rem;
   }

   #attributes #wil {
      left: 0.6rem;
   }

   #attributes .attribValue {
      width: 3.2rem;
      height: 3.2rem;
      text-align: center;
      font-size: 1.5rem;
      border-radius: 0.5rem;
   }

   /*
    * Info
    */
   #info {
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