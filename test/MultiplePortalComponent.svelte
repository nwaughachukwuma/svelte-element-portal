<script>
  import ElementPortal from "../src/ElementPortal.svelte";
</script>

<body>
  <main>
    <div id="target" />
    <div class="target" />
    <section />

    <div style="overlow: hidden">
      <ElementPortal target="#target" let:showItem let:hideItem>
        <div
          data-testid="mainElement1"
          on:pointerenter={showItem}
          on:pointerleave={hideItem}
        >
          Item 1
        </div>
        <div slot="item" data-testid="portalItem1" />
      </ElementPortal>

      <ElementPortal target=".target" let:showItem let:hideItem>
        <div
          data-testid="mainElement2"
          on:pointerenter={showItem}
          on:pointerleave={hideItem}
        >
          Item 2
        </div>
        <div slot="item" data-testid="portalItem2" />
      </ElementPortal>

      <ElementPortal target="section" let:showItem let:hideItem>
        <div
          data-testid="mainElement3"
          on:pointerenter={showItem}
          on:pointerleave={hideItem}
        >
          Item 3
        </div>
        <div slot="item" data-testid="portalItem3" />
      </ElementPortal>

      <ElementPortal target="#target" let:showItem let:hideItem>
        <div
          data-testid="mainElement4"
          on:pointerenter={showItem}
          on:pointerleave={hideItem}
        >
          Item 4
        </div>
        <div slot="item" data-testid="portalItem4" />
      </ElementPortal>
    </div>
  </main>
</body>
