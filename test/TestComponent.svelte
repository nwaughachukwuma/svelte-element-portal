<script>
  import ElementPortal from "../src/ElementPortal.svelte";
</script>

<body>
  <main>
    <div id="target" />

    <div style="overlow: hidden">
      <ElementPortal target="#target" let:showItem let:hideItem>
        <div
          data-testid="mainElement"
          on:pointerenter={showItem}
          on:pointerleave={hideItem}
        >
          Item 1
        </div>
        <div slot="item" data-testid="portalItem" />
      </ElementPortal>
    </div>
  </main>
</body>
