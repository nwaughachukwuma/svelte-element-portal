<script>
  import ElementPortal from "../src/ElementPortal.svelte";
</script>

<body>
  <main>
    <div id="target" />

    <div style="overlow: hidden">
      <ElementPortal target="wrong-target-selector">
        <div data-testid="mainElement">Item 1</div>
        <div slot="item" data-testid="portalItem" />
      </ElementPortal>
    </div>
  </main>
</body>
