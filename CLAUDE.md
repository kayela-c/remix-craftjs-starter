# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Remix-based drag-and-drop website builder using Craft.js and shadcn/ui components. Users can visually build pages by dragging components onto a canvas, configure them via a control panel, and generate production-ready React code.

**Demo/Architecture**: https://youtu.be/INNjkgE5p0o

## Development Commands

```bash
# Start development server (runs on port 10000)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Architecture

### Craft.js Integration

The app uses Craft.js for the page builder functionality. Understanding the integration pattern is critical:

1. **Editor Setup** (`app/routes/_index.tsx`):
   - `<Editor>` wraps the entire builder interface
   - `resolver` prop maps component names to implementations (all Node components must be registered here)
   - `onRender` prop specifies custom render wrapper (RenderNode)
   - Layout: SideMenu (left) | Viewport with ReactIframe (center) | ControlPanel (right)

2. **Component Wrapping Pattern**:
   - **UI Components** (`app/components/ui/*`): Base shadcn/ui components - never import Craft.js
   - **Node Components** (`app/components/node/*`): Craft.js-wrapped versions using `withNode()` HOC
   - `withNode()` HOC (`app/components/node/connector.tsx`):
     - Connects components to Craft.js drag-and-drop system
     - Handles draggable/droppable configuration
     - Manages visual feedback for selected components
     - Forwards refs correctly

3. **Component Configuration** (`.craft` property):
   ```typescript
   NodeComponent.craft = {
     displayName: 'Component',        // Name shown in editor
     props: { /* default props */ },  // Default property values
     custom: {
       importPath: '@/components/...' // For code generation
     },
     related: {
       toolbar: SettingsComponent     // Control panel UI
     }
   };
   ```

4. **Settings/Control Panel**:
   - Each component can specify a `toolbar` component in `.craft.related`
   - When a node is selected, ControlPanel renders the associated toolbar
   - Use `useNode()` hook to access/update component props via `setProp()`
   - `SettingsControl` is the base settings component (text, className, delete)
   - `LinkSettingsControl` extends base settings with href/target for links

### Component Registry System

(`app/lib/component-registry.ts`)

Self-registration system for sidebar components:

```typescript
// Manual registration
componentRegistry.register('Category', {
  name: 'Component',
  props: { /* default props */ },
  node: React.createElement(NodeComponent, props),
  demo: React.createElement(Component, props) // optional preview
});

// Batch registration (see app/components/node/button.tsx)
componentRegistry.registerMany('Buttons', generateButtonComponents());
```

Components auto-register on import via side-effects in node component files.

### Key Architectural Patterns

1. **Polymorphic Button as Link**:
   - Buttons can render as styled anchor tags using Radix UI's `asChild` prop
   - Pattern: `<Button asChild><a href="...">Text</a></Button>`
   - See `ButtonWrapper` in `app/components/node/button.tsx`

2. **Variant Generation**:
   - Button variants auto-generate sidebar entries
   - See `generateButtonComponents()` in `app/components/node/button.tsx`
   - Each variant (default, destructive, outline, etc.) becomes a draggable component

3. **Canvas and Containers**:
   - `Canvas` component is a droppable container for building
   - Use `<Element is={Component} canvas>` to make components accept drops
   - Layout components (OneBlock, TwoBlocks, ThreeBlocks) use this pattern

4. **iframe Isolation**:
   - Built page renders in `ReactIframe` for style isolation
   - Prevents builder UI styles from affecting built page

## File Structure

```
app/
├── components/
│   ├── ui/              # Base shadcn/ui components (no Craft.js)
│   ├── node/            # Craft.js wrapped components
│   │   ├── connector.tsx       # withNode() HOC
│   │   ├── button.tsx          # Button + variants
│   │   ├── card.tsx            # Card components
│   │   ├── navbar.tsx          # Navbar components
│   │   ├── layout.tsx          # Layout containers
│   │   └── components-map.tsx  # Legacy component map
│   ├── settings-control.tsx       # Base settings UI
│   ├── link-settings-control.tsx  # Link-specific settings
│   ├── control-panel.tsx          # Right sidebar
│   ├── side-menu.tsx              # Left sidebar (draggable items)
│   ├── viewport.tsx               # Center canvas area
│   └── render-node.tsx            # Custom node renderer
├── lib/
│   ├── component-registry.ts  # Self-registration system
│   └── utils.ts               # cn() helper
└── routes/
    └── _index.tsx             # Main editor page
```

## Adding New Components

1. **Create UI Component** (if needed): `app/components/ui/your-component.tsx`
   - Pure React component, no Craft.js imports
   - Use shadcn/ui patterns (CVA for variants, Radix for primitives)

2. **Create Node Wrapper**: `app/components/node/your-component.tsx`
   ```typescript
   import { withNode } from './connector';
   import { YourComponent } from '../ui/your-component';
   import { SettingsControl } from '../settings-control'; // or custom settings

   const draggable = true;
   const droppable = false; // true if can contain other components

   export const NodeYourComponent = withNode(YourComponent, {
     draggable,
     droppable,
   });

   NodeYourComponent.craft = {
     displayName: 'YourComponent',
     props: { /* defaults */ },
     custom: {
       importPath: '@/components/your-component',
     },
     related: {
       toolbar: SettingsControl,
     },
   };

   // Auto-register in sidebar
   componentRegistry.register('Category', {
     name: 'YourComponent',
     props: { /* defaults */ },
     node: React.createElement(NodeYourComponent, {}),
   });
   ```

3. **Register in Editor**: Add to resolver in `app/routes/_index.tsx`
   ```typescript
   <Editor
     resolver={{
       // ... existing components
       NodeYourComponent,
     }}
   >
   ```

## Custom Settings Panels

To create component-specific settings:

1. Create settings component using `useNode()` hook:
   ```typescript
   export const YourSettings = () => {
     const {
       actions: { setProp },
       propName,
     } = useNode((node) => ({
       propName: node.data.props["propName"] as string,
     }));

     return (
       <div className="p-4">
         <Input
           value={propName}
           onChange={(e) =>
             setProp((props: any) => (props.propName = e.target.value))
           }
         />
       </div>
     );
   };
   ```

2. Reference in `.craft.related.toolbar`

## Important Notes

- **UI vs Node Components**: Never mix Craft.js logic into `app/components/ui/*` - keep them pure
- **Editor Resolver**: All draggable components must be in the Editor's `resolver` prop
- **Refs**: Use `forwardRef` when creating wrapper components for proper drag-and-drop
- **TypeScript**: Craft.js types can be loose - liberal use of `any` is common in `.craft` configs
- **Port**: Dev server runs on port 10000 (configured in package.json)
