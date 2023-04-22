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
      <img src={$actor.img} alt="{$actor.name}'s portrait" on:click={sheet.editImage()} />
   <input type="text" name="name" bind:value={$actor.name} />
   </header>
</main>
  
 <style lang="scss">
    main {
       text-align: center;
       display: flex;
       flex-direction: column;
    }
 
    header {
       display: flex;
    }
 
    header img {
       width: 6rem;
       height: 6rem;
    }
 </style>