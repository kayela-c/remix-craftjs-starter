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
import { NodeButton } from "./button";
import { NodeCard } from "./card";
import { NodeNavbar, NodeNavbarSimple, NodeNavbarLink } from "./navbar";
import { Element } from "@craftjs/core";

export type Components = {
  name: string;
  items: {
    name: string;
    props?: {
      variant?:
        | "link"
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | null
        | undefined;
      className?: string;
      children?: ReactNode | string;
    };
    node: ReactElement;
    demo?: ReactNode;
  }[];
};

export const componentsMap: Components[] = [
  {
    name: "Buttons",
    items: [
      {
        name: "Default",
        demo: (
          <div className="flex justify-center w-full">
            <Button>Default</Button>
          </div>
        ),
        node: <NodeButton>Default</NodeButton>,
      },
      {
        name: "Outline",
        props: { variant: "outline", children: "Outline" },
        demo: (
          <div className="flex justify-center w-full">
            <Button variant={"outline"}>Outline</Button>
          </div>
        ),
        node: <NodeButton variant={"outline"}>Outline</NodeButton>,
      },
      {
        name: "Destructive",
        props: { variant: "destructive", children: "Destructive" },
        demo: (
          <div className="flex justify-center w-full">
            <Button variant={"destructive"}>Destructive</Button>
          </div>
        ),
        node: <NodeButton variant={"destructive"}>Destructive</NodeButton>,
      },
    ],
  },
  {
    name: "Cards",
    items: [
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
    ],
  },
  {
    name: "Layout",
    items: [
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
    ],
  },
  {
    name: "Navigation",
    items: [
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
    ],
  },
];
