import * as React from 'react';
import { cn } from '~/lib/utils';

const Navbar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      'flex items-center justify-between w-full px-4 py-3 bg-background border-b',
      className
    )}
    {...props}
  />
));
Navbar.displayName = 'Navbar';

const NavbarBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center space-x-2', className)}
    {...props}
  />
));
NavbarBrand.displayName = 'NavbarBrand';

const NavbarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-center space-x-4 flex-1',
      className
    )}
    {...props}
  />
));
NavbarContent.displayName = 'NavbarContent';

const NavbarActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center space-x-2', className)}
    {...props}
  />
));
NavbarActions.displayName = 'NavbarActions';

const NavbarLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer',
      className
    )}
    {...props}
  />
));
NavbarLink.displayName = 'NavbarLink';

export { Navbar, NavbarBrand, NavbarContent, NavbarActions, NavbarLink };
