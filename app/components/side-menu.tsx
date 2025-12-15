import React from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from './ui/vertical-navigation-menu';
import { palette } from '~/lib/palette';
import { useBuilder } from './builder-provider';
import { cn } from '~/lib/utils';

export const SideMenu = () => {
  const { addTemplate } = useBuilder();

  return (
    <NavigationMenu
      orientation="vertical"
      className="items-start justify-start border-r"
    >
      <NavigationMenuList className="w-40 flex-col">
        {palette.map((category) => (
          <NavigationMenuItem key={category.name} className="p-2">
            <NavigationMenuTrigger className="flex w-full justify-between">
              {category.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-full">
              <ul className="w-full">
                {category.items.map((item) => (
                  <li key={item.name} className="w-full p-2">
                    <NavigationMenuLink asChild>
                      <button
                        type="button"
                        className={cn(
                          'w-full rounded-md border p-3 text-left transition hover:border-primary hover:bg-muted'
                        )}
                        onClick={() => addTemplate(item.build)}
                      >
                        <div className="space-y-2">
                          <div className="text-sm font-medium">
                            {item.name}
                          </div>
                          {item.demo}
                          {item.description ? (
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                      </button>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <NavigationMenuViewport className="left-1 w-52 border-r shadow-none" />
    </NavigationMenu>
  );
};
