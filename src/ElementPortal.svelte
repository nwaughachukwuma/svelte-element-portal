<script context="module">
  /**
   * @param {any} el any DOM element
   * @returns {boolean} whether the element is an instance of HTMLElement
   */
  const isHTMLElement = (el) => el instanceof HTMLElement;

  /**
   * @param {HTMLElement} el
   * @param {HTMLElement} parent
   * @return {left: number, right: number, top: number, bottom: number}
   */
  function getParentOffsets(el, parent) {
    const rect = el.getBoundingClientRect();
    const pRect = parent.getBoundingClientRect();

    const left = rect.left - pRect.left;
    const top = rect.top - pRect.top;
    const right = pRect.right - rect.right;
    const bottom = pRect.bottom - rect.bottom;

    return { left, top, right, bottom };
  }
</script>

<script>
  import { tick, onMount } from "svelte";

  /**
   * HTMLElement or selector, which must have position := relative
   * @type {HTMLElement|string}
   */
  export let target = "body";

  /**
   * @type {HTMLDivElement}
   */
  let absItemEl;
  let showItem = false;

  onMount(() => {
    validateTarget(target).style.position = "relative";
  });

  /**
   * @param {HTMLElement | string} target
   * @return {HTMLElement}
   */
  const validateTarget = (target) => {
    const targetType = typeof target;
    if (targetType === "string") {
      target = document.querySelector(target);
    }

    if (!isHTMLElement(target)) {
      throw new TypeError(
        `Unknown target type: ${targetType}. Allowed types: string (CSS selector) or HTMLElement must exist in the DOM.`
      );
    }

    return target;
  };

  /**
   * @param {HTMLElement} target
   */
  const cleanUpWrappers = (target) => {
    const wrappers = target.querySelectorAll("[data-item-wrapper]");
    const visitedWrappers = Array.from(wrappers).filter(
      (el) => el.getAttribute("visited") === "true"
    );

    for (const el of visitedWrappers) {
      target.removeChild(el);
      el.setAttribute("visited", "false");
    }
  };

  /**
   * @param {PointerEvent} ev
   */
  const show = async (ev) => {
    target = validateTarget(target);
    cleanUpWrappers(target);

    await tick();

    target.appendChild(absItemEl);

    const element = ev.target;
    const { top, left } = getParentOffsets(element, target);

    absItemEl.style.display = "inline-block";
    absItemEl.style.top = `${top}px`;
    absItemEl.style.left = `${left}px`;
    absItemEl.setAttribute("visited", "true");
    requestAnimationFrame(() => {
      showItem = true;
    });
  };

  /**
   * @param {PointerEvent} _ev
   */
  const hide = (_ev) => {
    showItem = false;
    absItemEl.style.display = "none";
  };
</script>

<element-portal>
  <slot showItem={show} hideItem={hide} />
  <div data-item-wrapper class="item-wrapper" bind:this={absItemEl}>
    {#if showItem}
      <slot name="item" />
    {/if}
  </div>
</element-portal>

<style>
  .item-wrapper {
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }
</style>
