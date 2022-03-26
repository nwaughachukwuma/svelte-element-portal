<script context="module" lang="ts">
  const isHTMLElement = (el: any): el is HTMLElement =>
    el instanceof HTMLElement;

  function getParentOffsets(el: HTMLElement, parent: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const pRect = parent.getBoundingClientRect();

    const left = rect.left - pRect.left;
    const top = rect.top - pRect.top;
    const right = pRect.right - rect.right;
    const bottom = pRect.bottom - rect.bottom;

    return { left, top, right, bottom };
  }
</script>

<script lang="ts">
  import { tick, onMount } from "svelte";

  /** HTMLElement or selector, which must have a defined position := relative */
  export let target: HTMLElement | string = "body";

  let absItemEl: HTMLDivElement;
  let showItem = false;

  onMount(() => {
    validateTarget(target).style.position = "relative";
  });

  const validateTarget = (target: HTMLElement | string) => {
    if (typeof target === "string") {
      target = document.querySelector(target) as HTMLElement;
    } else if (!isHTMLElement(target)) {
      throw new TypeError(
        `Unknown target type: ${typeof target}. Allowed types: string (CSS selector) or HTMLElement.`
      );
    }

    return target;
  };

  const cleanUpWrappers = (target: HTMLElement) => {
    const wrappers = target.querySelectorAll<HTMLElement>("#item-wrapper");
    const visitedWrappers = Array.from(wrappers).filter(
      (el) => el.getAttribute("visited") === "true"
    );

    for (const el of visitedWrappers) {
      target.removeChild(el);
      el.setAttribute("visited", "false");
    }
  };

  const hoverEnter = async (ev: PointerEvent) => {
    target = validateTarget(target);
    cleanUpWrappers(target);

    await tick();

    target.appendChild(absItemEl);

    const element = ev.target as HTMLElement;
    const { top, left } = getParentOffsets(element, target);

    absItemEl.style.display = "inline-block";
    absItemEl.style.top = `${top}px`;
    absItemEl.style.left = `${left}px`;
    absItemEl.setAttribute("visited", "true");
    requestAnimationFrame(() => {
      showItem = true;
    });
  };

  const hoverLeave = (_ev: PointerEvent) => {
    showItem = false;
    absItemEl.style.display = "none";
  };
</script>

<element-portal
  class="block"
  on:pointerenter={hoverEnter}
  on:pointerleave={hoverLeave}
>
  <slot />
  <div
    id="item-wrapper"
    class="pointer-events-none absolute left-0 top-0 hidden"
    bind:this={absItemEl}
  >
    {#if showItem}
      <slot name="item" />
    {/if}
  </div>
</element-portal>
