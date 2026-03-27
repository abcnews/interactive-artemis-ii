import { whenDOMReady } from "@abcnews/env-utils";
import { mount } from "svelte";
import InlinePill from "./components/InlinePill/InlineStyle.svelte";
import type { StyleConfig } from "./constants";
import { selectMounts } from "@abcnews/mount-utils";
import parse from "@abcnews/alternating-case-to-object";

let styleConfigs: StyleConfig[] = [];

function getPillConfig(text: string): StyleConfig | null {
  const normalizedText = text.toLowerCase().trim();
  return (
    styleConfigs.find((config) =>
      normalizedText.includes(String(config.keyword).toLowerCase()),
    ) || null
  );
}

/**
 * Automatically find all <strong> tags and replace them with styled components
 * if they match any styled keywords.
 */
function autoStyleStrongTags() {
  const strongTags = document.querySelectorAll("strong");
  strongTags.forEach((strong) => {
    const text = strong.textContent || "";
    const config = getPillConfig(text);

    if (config && strong.parentNode) {
      mount(InlinePill, {
        target: strong.parentNode as Element,
        anchor: strong,
        props: {
          name: text,
          colour: config.colour ? `#${config.colour}` : undefined,
          text: config.text ? `#${config.text}` : undefined,
          border: config.border ? `#${config.border}` : undefined,
          icon: config.icon,
          underline: config.underline ? `#${config.underline}` : undefined,
        },
      });

      strong.parentNode.removeChild(strong);
    }
  });
}

// Ensure DOM is ready before running auto-replacement
whenDOMReady.then(() => {
  styleConfigs = selectMounts("inlinestyle").map(
    (style) => parse(style.id) as unknown as StyleConfig,
  );
  autoStyleStrongTags();
});
