# Svelte-Element-Portal

Make an element escape its parent overflow by rendering it over an ancestor element in the DOM :v:. This is useful for rendering a tooltip or popover in place, over an element whose parent overflow is hidden.

## Usage

```svelte
<script>
  import ElementPortal from 'svelte-element-portal';
</script>

<body>
  <main>
    <div id="target" />

    <div style="overlow: hidden">
      <ElementPortal target="#target">
        <div>Item 1</div>
        
        <tooltip slot="item" />
      </ElementPortal>
    </div>
  </main>
</body>
```
