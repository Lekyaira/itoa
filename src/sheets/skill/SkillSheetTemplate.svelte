<script>
   import { TJSProseMirror }     from '@typhonjs-fvtt/svelte-standard/component';

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

   $: if (content) {
      console.log(`! bound content changed: ${content}`);
      // Update the item data
      $doc.update({_id: $doc.id, "system.text": content});
      console.log("Updated item: ", $item);
   }
   $: if (enrichedContent) { console.log(`! bound enrichedContent changed: ${enrichedContent}`) }

   //DEBUG
   
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>
 
<main class="itoaSheet">
   <header>
      <img src={$item.img} alt="{$item.name}'s image" on:click={sheet.editImage()} />
      <input type="text" name="name" bind:value={$item.name} />
   </header>
   <section id="skillText">
      <TJSProseMirror {options}
                   bind:content
                   bind:enrichedContent
                   on:editor:cancel={() => console.log('! event - editor:cancel')}
                   on:editor:document:deleted={() => console.log('! event - editor:document:deleted')}
                   on:editor:enrichedContent={(event) => console.log(`! event - editor:enrichedContent - ${event.detail.enrichedContent}`)}
                   on:editor:save={(event) => console.log(`! event - editor:save - ${event.detail.content}`)}
                   on:editor:start={() => console.log('! event - editor:start')} />
   </section>
</main>
   
<style lang="scss">
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

   header img {
      width: 6rem;
      height: 6rem;
   }

   #skillText {
      text-align:initial;
      padding: 0.5rem;
      height: 28rem;
   }
</style>