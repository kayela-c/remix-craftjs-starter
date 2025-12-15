import React from 'react';
import { Reka } from '@rekajs/core';
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

export const ROOT_COMPONENT_NAME = 'App';

const createExternalComponents = () => [
  t.externalComponent({
    name: 'UIButton',
    meta: {
      importPath: '~/components/ui/button',
    },
    render: (props: any) => <Button {...props} />,
    props: [],
  }),
  t.externalComponent({
    name: 'UICard',
    meta: {
      importPath: '~/components/ui/card',
    },
    render: (props: any) => (
      <Card {...props}>
        <CardHeader>
          <CardTitle>{props?.title ?? 'Card title'}</CardTitle>
          <CardDescription>
            {props?.description ?? 'Card description'}
          </CardDescription>
        </CardHeader>
        <CardContent>{props?.content ?? 'Content'}</CardContent>
        <CardFooter>{props?.footer ?? 'Footer'}</CardFooter>
      </Card>
    ),
    props: [],
  }),
];

export const reka = Reka.create({
  externals: {
    components: createExternalComponents(),
  },
});

const textTemplate = (value: string) =>
  t.tagTemplate({
    tag: 'text',
    props: {
      value: t.literal({
        value,
      }),
    },
    children: [],
  });

const baseState = t.state({
  program: t.program({
    globals: [],
    components: [
      t.rekaComponent({
        name: ROOT_COMPONENT_NAME,
        props: [],
        state: [],
        template: t.tagTemplate({
          tag: 'div',
          props: {
            className: t.literal({
              value:
                'min-h-screen bg-white text-neutral-900 flex flex-col gap-6 p-10',
            }),
          },
          children: [
            textTemplate('Welcome to the Remix + Reka starter'),
            textTemplate('Use the side menu to insert templates.'),
          ],
        }),
      }),
    ],
  }),
});

if (!reka.loaded) {
  reka.load(baseState);
}

export const getComponentByName = (name = ROOT_COMPONENT_NAME) => {
  const component = reka.program.components.find((c) => c.name === name);
  if (!component) {
    throw new Error(`Component ${name} not found in Reka state.`);
  }
  return component;
};
