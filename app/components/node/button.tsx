import { withNode } from "~/components/node/connector";
import { Button } from "../ui/button";
import { LinkSettingsControl } from "../link-settings-control";
import { componentRegistry, capitalize, ComponentDef } from "~/lib/component-registry";
import React from "react";

const draggable = true;

// ButtonWrapper - conditionally renders as link when href is provided
const ButtonWrapper = React.forwardRef<HTMLButtonElement, any>(
  ({ href, target = '_self', children, ...props }, ref) => {
    const hasValidHref = href && href !== '#';

    if (hasValidHref) {
      return (
        <Button asChild {...props}>
          <a
            href={href}
            target={target}
            onClick={(e) => e.preventDefault()} // Prevent navigation in editor
          >
            {children}
          </a>
        </Button>
      );
    }

    return <Button ref={ref} {...props}>{children}</Button>;
  }
);

ButtonWrapper.displayName = "ButtonWrapper";

export const NodeButton = withNode(ButtonWrapper, {
  draggable,
});

NodeButton.craft = {
  ...NodeButton.craft,
  props: {
    className: "mx-auto block", // centers with auto margins
    href: '#',
    target: '_self',
  },
  related: {
    toolbar: LinkSettingsControl,
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
    props: {
      variant,
      children: capitalize(variant),
      href: '#',
      target: '_self',
    },
    demo: React.createElement(Button, { variant }, capitalize(variant)),
    node: React.createElement(NodeButton, { variant }, capitalize(variant)),
  }));
}

// Auto-register all button variants
componentRegistry.registerMany('Buttons', generateButtonComponents());
