"use client";

import { useEffect } from "react";

const copyTargets = [
  "h1",
  "h2",
  "h3",
  ".hero-intro > p",
  ".section-heading > p",
  ".article-content > p",
  ".submit-intro > p",
  ".admin-header p",
  ".card-copy > p",
  ".activity-title",
  ".metric-row",
].join(",");

const riseTargets = [
  ".post-card",
  ".voice-tile",
  ".hero-feature",
  ".hero-empty",
  ".latest-empty",
  ".submission-form",
  ".success-panel",
  ".admin-stats > div",
  ".admin-empty",
  ".analytics-card",
  ".activity-row",
  ".login-card",
].join(",");

const imageTargets = ".card-image, .hero-picture, .article-cover";
let copyTargetIndex = 0;

export function ScrollReveals() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const timers = new Set<number>();
    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const target = entry.target;
        target.classList.add("scroll-revealed");
        observer.unobserve(target);
        const timer = window.setTimeout(() => {
          target.removeAttribute("data-scroll-reveal");
          target.classList.remove("scroll-revealed");
          timers.delete(timer);
        }, 800);
        timers.add(timer);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

    const markTargets = (selector: string, type: "copy" | "rise" | "image") => {
      document.querySelectorAll(selector).forEach((target) => {
        if (!target.hasAttribute("data-scroll-reveal")) {
          const reveal = type === "copy"
            ? (copyTargetIndex++ % 2 === 0 ? "inline-start" : "inline-end")
            : type;
          target.setAttribute("data-scroll-reveal", reveal);
        }

        if (!observed.has(target) && !target.classList.contains("scroll-revealed")) {
          observed.add(target);
          observer.observe(target);
        }
      });
    };

    const scan = () => {
      markTargets(copyTargets, "copy");
      markTargets(riseTargets, "rise");
      markTargets(imageTargets, "image");
    };

    document.documentElement.classList.add("scroll-reveals-ready");
    scan();

    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      timers.forEach(window.clearTimeout);
      document.documentElement.classList.remove("scroll-reveals-ready");
    };
  }, []);

  return null;
}
