import { ReactElement, ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  NavbarLink,
} from "../ui/navbar";
import {
  OneBlock,
  NodeOneBlock,
  NodeTwoBlocks,
  NodeThreeBlocks,
} from "./layout";
import { NodeCard } from "./card";
import { NodeNavbar, NodeNavbarSimple, NodeNavbarLink } from "./navbar";
import { Element } from "@craftjs/core";
import { componentRegistry, ComponentCategory } from "~/lib/component-registry";

// Import button to trigger its self-registration
import "./button";

/**
 * Legacy type for backward compatibility
 * @deprecated Use ComponentCategory from component-registry instead
 */
export type Components = ComponentCategory;

/**
 * Register Cards components
 */
componentRegistry.registerMany("Cards", [
  {
    name: "Default",
    demo: (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Empty Container</CardContent>
        <CardFooter>
          <Button className="w-full">Footer button</Button>
        </CardFooter>
      </Card>
    ),
    node: <NodeCard></NodeCard>,
  },
]);

/**
 * Register Layout components
 */
componentRegistry.registerMany("Layout", [
  {
    name: "One Block",
    demo: (
      <OneBlock className="text-center italic p-4 bg-yellow-100 outline-dashed outline-amber-400">
        One Block
      </OneBlock>
    ),
    node: (
      <Element
        canvas
        is={NodeOneBlock as typeof NodeOneBlock & string}
        id="one-block"
      />
    ),
  },
  {
    name: "Two Blocks",
    demo: (
      <OneBlock className="text-center italic p-4 bg-yellow-100 outline-dashed outline-amber-400 flex flex-row">
        <OneBlock className="text-center italic bg-yellow-100 outline-dashed outline-amber-400">
          First Block
        </OneBlock>
        <OneBlock className="text-center italic bg-yellow-100 outline-dashed outline-amber-400">
          Second Block
        </OneBlock>
      </OneBlock>
    ),
    node: <NodeTwoBlocks></NodeTwoBlocks>,
  },
  {
    name: "Three Blocks",
    demo: (
      <OneBlock className="text-center italic p-4 bg-yellow-100 outline-dashed outline-amber-400 flex flex-row">
        <OneBlock className="text-center italic bg-yellow-100 outline-dashed outline-amber-400">
          First Block
        </OneBlock>
        <OneBlock className="text-center italic bg-yellow-100 outline-dashed outline-amber-400">
          Second Block
        </OneBlock>
        <OneBlock className="text-center italic bg-yellow-100 outline-dashed outline-amber-400">
          Third Block
        </OneBlock>
      </OneBlock>
    ),
    node: <NodeThreeBlocks></NodeThreeBlocks>,
  },
]);

/**
 * Register Navigation components
 */
componentRegistry.registerMany("Navigation", [
  {
    name: "Navbar",
    demo: (
      <Navbar className="w-full">
        <NavbarBrand>
          <NavbarLink>Brand</NavbarLink>
        </NavbarBrand>
        <NavbarContent>
          <NavbarLink>Home</NavbarLink>
          <NavbarLink>About</NavbarLink>
          <NavbarLink>Services</NavbarLink>
          <NavbarLink>Contact</NavbarLink>
        </NavbarContent>
        <NavbarActions>
          <Button size="sm">Get Started</Button>
        </NavbarActions>
      </Navbar>
    ),
    node: <NodeNavbar></NodeNavbar>,
  },
  {
    name: "Empty Navbar",
    demo: (
      <Navbar className="w-full">
        <NavbarBrand className="text-center italic p-2 bg-yellow-100 outline-dashed outline-amber-400">
          Brand
        </NavbarBrand>
        <NavbarContent className="text-center italic p-2 bg-yellow-100 outline-dashed outline-amber-400">
          Content
        </NavbarContent>
        <NavbarActions className="text-center italic p-2 bg-yellow-100 outline-dashed outline-amber-400">
          Actions
        </NavbarActions>
      </Navbar>
    ),
    node: <NodeNavbarSimple></NodeNavbarSimple>,
  },
  {
    name: "Nav Link",
    demo: <NavbarLink>Nav Link</NavbarLink>,
    node: <NodeNavbarLink>Nav Link</NodeNavbarLink>,
  },
]);

/**
 * Get the complete components map from the registry
 * This automatically includes all registered components from all files
 */
export const componentsMap: Components[] = componentRegistry.getAll();
