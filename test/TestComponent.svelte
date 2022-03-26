<script>
  import ElementPortal from "../src/ElementPortal.svelte";
</script>

<body>
  <main>
    <div id="target" />

    <div style="overlow: hidden">
      <ElementPortal target="#target">
        <div data-testid="mainElement">Item 1</div>
        <div slot="item" data-testid="portalElement" />
      </ElementPortal>
    </div>
  </main>
</body>
