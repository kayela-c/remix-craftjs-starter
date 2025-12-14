import { withNode } from "~/components/node/connector";
import { Button } from "../ui/button";
import { SettingsControl } from "../settings-control";
import { componentRegistry, capitalize, ComponentDef } from "~/lib/component-registry";
import React from "react";

const draggable = true;

export const NodeButton = withNode(Button, {
  draggable,
});

NodeButton.craft = {
  ...NodeButton.craft,
  props: {
    className: "mx-auto block", // centers with auto margins
  },
  related: {
    toolbar: SettingsControl,
  },
};

/**
 * Button variant types - extracted from the cva definition
 * Add new variants here and they will automatically appear in the sidebar
 */
export const buttonVariantTypes = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
] as const;

export type ButtonVariantType = typeof buttonVariantTypes[number];

/**
 * Generate button component definitions for all variants
 * This auto-generates sidebar items for each button variant
 */
export function generateButtonComponents(): ComponentDef[] {
  return buttonVariantTypes.map((variant) => ({
    name: capitalize(variant),
    props: { variant, children: capitalize(variant) },
    demo: React.createElement(Button, { variant }, capitalize(variant)),
    node: React.createElement(NodeButton, { variant }, capitalize(variant)),
  }));
}

// Auto-register all button variants
componentRegistry.registerMany('Buttons', generateButtonComponents());
