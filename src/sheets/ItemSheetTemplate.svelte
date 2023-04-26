<script>
   import { TJSProseMirror }     from '@typhonjs-fvtt/svelte-standard/component';
   import { onMount } from 'svelte';

   // Sheet and Actor data passed in from base sheet.
   export let sheet;
   export let doc;
   // Set actor variable so we can refer to it later.
   const item = doc;

   // Variables for text editor
   const options = {
      // document: game.items.get('OYHnejmJO2fSlQDi'),   // An item to edit description; note: replace w/ valid doc.
      // fieldName: 'system.description.value',          // Path to data in `a.b.c`; note: this is a v10 field name.
      // collaborate: false,                             // Enables collaboration; requires document.
      // button: true      // Show edit button to launch editor when hovered; when false editor is open by default.
      // classes: ['foo', 'bar'],   // Adds additional classes to `.tjs-editor` element.
      // clickToEdit: false,  // Clicking editor content initializes the editor; hides the edit button.
      // DOMPurify,        // You can pass DOMPurify from `@typhonjs-fvtt/runtime/dompurify though ProseMirror does
                           // essential client side sanitation; IE stripping `<script>` tags, etc.
      // editable: true,   // Enable / disable editing
      // enrichContent: true  // The default is true, but if you set it to false content is not enriched.
      // initialSelection: 'start', // The initial selection / cursor position: 'all', 'end', or 'start'.
      // styles: { '--tjs-editor-toolbar-background': 'red' } // Apply any inline styles / CSS variables
   };
   let content = $item.system.text;
   let enrichedContent;

   function onContentSaved() {
      $doc.update({_id: $doc.id, "system.text": content});
   }

   // Weight
   let weight = $item.system.weight;
   let weightType;
   
   async function onWeightTypeChanged() {
      let newWeight;
      if(weightType == 0) { // Negligible
         newWeight = -1;
         console.log('Negligible');
      }
      else if(weightType == 1) { // Light
         newWeight = 0;
         console.log('Light');
      }
      else if(weightType == 2) { // Stone
         newWeight = 1;
         console.log('Stone');
      }

      weight = newWeight;
      await $doc.update({_id: $item.id, "system.weight": newWeight});
   }

   onMount(async () => {
      weightType = weight > 0 ? '2' : weight < 0 ? '0' : '1';
   });

</script>
  
<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<main class="itoaSheet">
   <header>
      <img src={$item.img} alt="{$item.name}'s image" on:click={sheet.editImage()} />
      <div>
         <input type="text" name="name" bind:value={$item.name} />
         <!--TODO: Placeholder. Implement item rarity.-->
         <select>
            <option value=0>Common</option>
            <option value=1>Uncommon</option>
            <option vlaue=2>Rare</option>
            <option value=3>Unique</option>
         </select>
      </div>
   </header>
   <section id="bar" class="contentGrid">
      <div>Summary</div>
      <div>Description</div>
   </section>
   <section id="content" class="contentGrid">
      <div id="contentSidebar">
         <label>Quantity</label><input name="system.quantity" type="number" bind:value={$item.system.quantity} />
         <label>Price</label><input name="system.price" type="number" bind:value={$item.system.price} />
         <label>Weight</label>
         <select bind:value={weightType} on:change={onWeightTypeChanged}>
            <option value=0>Negligible</option>
            <option value=1>Light</option>
            <option value=2>Stone</option>
         </select>
         <label class="indented" style:display={weightType > 1 ? 'initial' : 'none'}>Stones</label><input type="number" min="0" name="system.weight" bind:value={$item.system.weight} style:display={weightType > 1 ? 'initial' : 'none'} />   
         <label>Equipable</label><input type="checkbox" name="system.equipable" bind:checked={$item.system.equipable} />
         <label>Armor</label><input type="checkbox" name="system.isArmor" bind:checked={$item.system.isArmor} >
         <label class="indented" style:display={$item.system.isArmor ? 'initial' : 'none'}>Value</label><input type="number" min="1" name="system.armor" bind:value={$item.system.armor} style:display={$item.system.isArmor ? 'initial' : 'none'}/>
         <label>Shield</label><input type="checkbox" name="system.isShield" bind:checked={$item.system.isShield} />
         <label class="indented" style:display={$item.system.isShield ? 'initial' : 'none'}>Hardness</label><input type="number" min="0" name="system.shield.hardness" bind:value={$item.system.shield.hardness} style:display={$item.system.isShield ? 'initial' : 'none'} />
         <label class="indented" style:display={$item.system.isShield ? 'initial' : 'none'}>HP</label><input type="number" min="1" name="system.shield.hp" bind:value={$item.system.shield.hp} style:display={$item.system.isShield ? 'initial' : 'none'} />
         <label>Speed Modifier</label><input type="number" min="0" name="system.speedMod" bind:value={$item.system.speedMod} />
         <label>Dodge Modifier</label><input type="number" min="0" name="system.dodgeMod" bind:value={$item.system.dodgeMod} />
         <label>Required Strength</label><input type="number" min="0" name="system.requiredStr" bind:value={$item.system.requiredStr} />
      </div>
      <div id="contentArea">
         <TJSProseMirror {options}
                   bind:content
                   bind:enrichedContent
                   on:editor:cancel={() => console.log('! event - editor:cancel')}
                   on:editor:document:deleted={() => console.log('! event - editor:document:deleted')}
                   on:editor:enrichedContent={(event) => console.log(`! event - editor:enrichedContent - ${event.detail.enrichedContent}`)}
                   on:editor:save={onContentSaved}
                   on:editor:start={() => console.log('! event - editor:start')} />
      </div>
   </section>
</main>
  
 <style lang="scss">
   main {
      display: flex;
      flex-direction: column;
   }

   .contentGrid {
      display: grid;
      grid: auto / 14rem auto;
   }

   header {
      display: flex;
   }

   header img {
      width: 4rem;
      height: 4rem;
      border: 0;
      /*border: 1px solid rgba(0,0,0,0.1);*/
      border-radius: 0.2rem;
   }

   header div {
      margin-left: 0.5rem;
      width: 100%;
   }

   header input {
      height: 2.5rem;
      font-size: 2rem;
      border: none;
      border-radius: 0.2rem;
      margin-bottom: 0.1rem;
   }

   header select {
      height: 1.4rem;
      border: 0;
      border-radius: 0.2rem;
   }

   #bar {
      align-items: center;
      height: 2rem;
      border-top: 1px solid black;
      border-bottom: 1px solid black;
      margin: 0.4rem 0 0.4rem 0;
   }

   #bar div {
      display: flex;
      justify-content: center;
   }

   #content {
      height: 100%;
   }

   #contentArea {
      overflow-y: auto;
   }

   #contentSidebar {
      display: grid;
      grid-template-columns: 7rem auto;
      grid-auto-rows: 1.6rem;
      /*grid: 1.6rem 1.6rem 1.6rem / 5rem auto;*/
      gap: 0 0;
      align-items: baseline;
      border-right: 1px solid #908d8a;
      padding: 0.3rem;
   }
   
   #contentSidebar > label {
      font-weight: bold;
   }

   #contentSidebar > input {
      width: 100%;
      height: 1rem;
      background: none;
      border: 0;
      border-radius: 0.1rem;
      text-align: right;
      font-size: 0.9rem;
   }

   #contentSidebar > select {
      width: 100%;
      height: 1.1rem;
      background: 0;
      border: 0;
      border-radius: 0.1rem;
      text-align: right;
      font-size: 0.9rem;
   }

   #contentSidebar input[type=checkbox] {
      height: 1rem;
      width: 1rem;
      justify-self: right;
      align-self: flex-start;
   }

   #contentSidebar .indented {
      margin-left: 1rem;
   }
 </style>