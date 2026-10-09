"use client";

import { useEffect } from "react";

const keyframes: Keyframe[] = [
  { opacity: 0, transform: "translateY(22px)" },
  { opacity: 1, transform: "none" },
];

const inView = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

/**
 * Anything marked `data-reveal` rises into place the first time it scrolls
 * into view; items entering together follow one another, like stock being
 * set out on a shelf. It uses the Web Animations API and never touches DOM
 * attributes, so server HTML stays visible and hydration stays clean:
 * only items still below the fold are held back, and only once this runs.
 * New items (client navigation, catalogue filters) rise in as they mount.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const held = new Map<Element, Animation>();

    const play = (els: Element[]) => {
      els
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left)
        .forEach(({ el }, i) => {
          const animation = held.get(el) ?? hold(el);
          held.delete(el);
          observer.unobserve(el);
          animation.effect?.updateTiming({ delay: Math.min(i, 7) * 70 });
          animation.play();
          // Drop the effect once done so hover transforms and layout are untouched.
          animation.finished.then(() => animation.cancel()).catch(() => {});
        });
    };

    const hold = (el: Element) => {
      const animation = el.animate(keyframes, {
        duration: 750,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "backwards",
      });
      animation.pause();
      return animation;
    };

    const observer = new IntersectionObserver(
      (entries) => play(entries.filter((e) => e.isIntersecting && held.has(e.target)).map((e) => e.target)),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );

    const watch = (el: Element) => {
      if (held.has(el) || el.getBoundingClientRect().top < window.innerHeight) return;
      held.set(el, hold(el));
      observer.observe(el);
    };

    // First pass: what is already on screen (or scrolled past) stays as rendered.
    document.querySelectorAll("[data-reveal]").forEach(watch);

    const mutations = new MutationObserver((records) => {
      const fresh: Element[] = [];
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          const found = node.matches("[data-reveal]") ? [node] : [...node.querySelectorAll("[data-reveal]")];
          for (const el of found) {
            if (inView(el)) fresh.push(el);
            else watch(el);
          }
        });
        record.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          for (const el of [node, ...node.querySelectorAll("[data-reveal]")]) {
            held.get(el)?.cancel();
            held.delete(el);
            observer.unobserve(el);
          }
        });
      }
      if (fresh.length) play(fresh);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      held.forEach((animation) => animation.cancel());
    };
  }, []);

  return null;
}
