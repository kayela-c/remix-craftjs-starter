import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  NavbarLink,
} from '../ui/navbar';
import { Element } from '@craftjs/core';
import { SettingsControl } from '../settings-control';
import { LinkSettingsControl } from '../link-settings-control';
import { withNode } from './connector';

interface NodeNavbarProps extends React.HTMLAttributes<HTMLElement> {}

const draggable = true;
const droppable = true;

// Navbar Brand - Draggable and droppable section for logo/brand
export const NodeNavbarBrand = withNode(NavbarBrand, {
  draggable,
  droppable,
});

(NodeNavbarBrand as any).craft = {
  ...(NodeNavbarBrand as any).craft,
  displayName: 'NavbarBrand',
  related: {
    toolbar: SettingsControl,
  },
};

// Navbar Content - Droppable section for navigation links
export const NodeNavbarContent = withNode(NavbarContent, {
  droppable,
});

(NodeNavbarContent as any).craft = {
  ...(NodeNavbarContent as any).craft,
  displayName: 'NavbarContent',
  related: {
    toolbar: SettingsControl,
  },
};

// Navbar Actions - Droppable section for action buttons
export const NodeNavbarActions = withNode(NavbarActions, {
  droppable,
});

(NodeNavbarActions as any).craft = {
  ...(NodeNavbarActions as any).craft,
  displayName: 'NavbarActions',
  related: {
    toolbar: SettingsControl,
  },
};

// Navbar Link - Draggable link component with click prevention in editor
const NavbarLinkWrapper = ({ onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent navigation in the editor
    e.preventDefault();
    onClick?.(e);
  };

  return <NavbarLink onClick={handleClick} {...props} />;
};

export const NodeNavbarLink = withNode(NavbarLinkWrapper, {
  draggable,
});

(NodeNavbarLink as any).craft = {
  ...(NodeNavbarLink as any).craft,
  displayName: 'NavbarLink',
  props: {
    href: '#',
    target: '_self',
  },
  related: {
    toolbar: LinkSettingsControl,
  },
};

// Main Navbar Container
export const NodeNavbarContainer = withNode(Navbar, {
  draggable,
  droppable,
});

// Composed Navbar Component
export const NodeNavbar = ({ ...props }: NodeNavbarProps) => {
  return (
    <NodeNavbarContainer {...props}>
      <Element
        canvas
        id="navbar-brand"
        is={NodeNavbarBrand as typeof NodeNavbarBrand & string}
      >
        <NodeNavbarLink>Brand</NodeNavbarLink>
      </Element>
      <Element
        canvas
        id="navbar-content"
        is={NodeNavbarContent as typeof NodeNavbarContent & string}
      >
        <NodeNavbarLink>Home</NodeNavbarLink>
        <NodeNavbarLink>About</NodeNavbarLink>
        <NodeNavbarLink>Services</NodeNavbarLink>
        <NodeNavbarLink>Contact</NodeNavbarLink>
      </Element>
      <Element
        canvas
        id="navbar-actions"
        is={NodeNavbarActions as typeof NodeNavbarActions & string}
      >
      </Element>
    </NodeNavbarContainer>
  );
};

NodeNavbar.craft = {
  displayName: 'Navbar',
  props: {
    className: 'w-full',
  },
  custom: {
    importPath: '@/components/navbar',
  },
  related: {
    toolbar: SettingsControl,
  },
};

// Simple Navbar without preset content
export const NodeNavbarSimple = ({ ...props }: NodeNavbarProps) => {
  return (
    <NodeNavbarContainer {...props}>
      <Element
        canvas
        id="navbar-brand-simple"
        is={NodeNavbarBrand as typeof NodeNavbarBrand & string}
      >
      </Element>
      <Element
        canvas
        id="navbar-content-simple"
        is={NodeNavbarContent as typeof NodeNavbarContent & string}
      >
      </Element>
      <Element
        canvas
        id="navbar-actions-simple"
        is={NodeNavbarActions as typeof NodeNavbarActions & string}
      >
      </Element>
    </NodeNavbarContainer>
  );
};

NodeNavbarSimple.craft = {
  displayName: 'NavbarSimple',
  props: {
    className: 'w-full',
  },
  custom: {
    importPath: '@/components/navbar',
  },
  related: {
    toolbar: SettingsControl,
  },
};
