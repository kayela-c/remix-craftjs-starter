import React from 'react';
import * as t from '@rekajs/types';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

const literal = (value: string | number | boolean) =>
  t.literal({ value });

const textNode = (value: string) =>
  t.tagTemplate({
    tag: 'text',
    props: { value: literal(value) },
    children: [],
  });

const externalComponent = (name: string, props: Record<string, t.Expression>) =>
  t.componentTemplate({
    component: t.identifier({
      name,
      external: true,
    }),
    props,
    children: [],
  });

const section = (className: string, children: t.Template[]) =>
  t.tagTemplate({
    tag: 'section',
    props: {
      className: literal(className),
    },
    children,
  });

export type PaletteItem = {
  name: string;
  description?: string;
  demo: React.ReactNode;
  build: () => t.Template;
};

export type PaletteCategory = {
  name: string;
  items: PaletteItem[];
};

const heroSection: PaletteItem = {
  name: 'Hero',
  description: 'Large hero area with CTA button',
  demo: (
    <div className="space-y-2">
      <h4 className="text-base font-semibold">Hero section</h4>
      <p className="text-sm text-muted-foreground">
        A two line hero with button
      </p>
    </div>
  ),
  build: () =>
    section('flex flex-col gap-4 py-12', [
      t.tagTemplate({
        tag: 'h1',
        props: {
          className: literal('text-4xl font-bold tracking-tight'),
        },
        children: [textNode('Craft stunning pages with Reka')],
      }),
      t.tagTemplate({
        tag: 'p',
        props: {
          className: literal('text-lg text-muted-foreground max-w-2xl'),
        },
        children: [
          textNode(
            'Combine Remix, shadcn-ui and Reka to ship custom editors faster.'
          ),
        ],
      }),
      t.tagTemplate({
        tag: 'div',
        props: {
          className: literal('flex flex-row gap-3'),
        },
        children: [
          externalComponent('UIButton', {
            children: literal('Get started'),
          }),
        ],
      }),
    ]),
};

const statsSection: PaletteItem = {
  name: 'Stats',
  description: 'Three column stats layout',
  demo: (
    <div className="space-y-2">
      <h4 className="text-base font-semibold">Stat grid</h4>
      <p className="text-sm text-muted-foreground">
        Three metrics with labels
      </p>
    </div>
  ),
  build: () =>
    section('grid gap-6 sm:grid-cols-3 py-10', [
      ...['3x', '24%', '99.9%'].map((stat) =>
        t.tagTemplate({
          tag: 'div',
          props: {
            className: literal('rounded-lg border p-4 text-center space-y-1'),
          },
          children: [
            t.tagTemplate({
              tag: 'p',
              props: {
                className: literal('text-sm uppercase tracking-wide'),
              },
              children: [textNode('Metric')],
            }),
            t.tagTemplate({
              tag: 'p',
              props: {
                className: literal('text-3xl font-semibold'),
              },
              children: [textNode(stat)],
            }),
          ],
        })
      ),
    ]),
};

const cardGrid: PaletteItem = {
  name: 'Card grid',
  description: 'Two cards placed side by side',
  demo: (
    <div className="grid gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>Preview</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>Preview</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  build: () =>
    section('grid gap-4 md:grid-cols-2', [
      externalComponent('UICard', {
        title: literal('Reusable card'),
        description: literal('Connect cards to your data.'),
        content: literal('Content'),
        footer: literal('Footer'),
      }),
      externalComponent('UICard', {
        title: literal('Second card'),
        description: literal('Keep information tidy.'),
        content: literal('Content'),
        footer: literal('Footer'),
      }),
    ]),
};

const callout: PaletteItem = {
  name: 'Call to action',
  description: 'Simple CTA banner',
  demo: (
    <div className="rounded-md border p-3 text-sm">
      <p>Banner with button</p>
    </div>
  ),
  build: () =>
    section(
      'rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8 flex flex-col gap-4',
      [
        t.tagTemplate({
          tag: 'h2',
          props: {
            className: literal('text-3xl font-semibold'),
          },
          children: [textNode('Ready to launch your editor?')],
        }),
        t.tagTemplate({
          tag: 'p',
          props: {
            className: literal('text-muted-foreground max-w-2xl'),
          },
          children: [
            textNode(
              'Build structured experiences with a portable AST so your users can design with confidence.'
            ),
          ],
        }),
        externalComponent('UIButton', {
          children: literal('Schedule a demo'),
        }),
      ]
    ),
};

export const palette: PaletteCategory[] = [
  {
    name: 'Layout',
    items: [heroSection, statsSection],
  },
  {
    name: 'Content',
    items: [cardGrid],
  },
  {
    name: 'Actions',
    items: [callout],
  },
];
