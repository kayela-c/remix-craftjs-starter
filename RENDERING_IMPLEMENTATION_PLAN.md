# Implementation Plan: Website Rendering for CraftJS Editor

## Overview

Add database-backed persistence and preview rendering to the Remix + CraftJS starter. Users will be able to save their designs and view them on a separate `/preview` route without the editor UI.

## Architecture Decisions

- **Database**: SQLite with Prisma (simple, file-based, zero config)
- **Rendering**: Separate `/preview` route using CraftJS Frame in read-only mode
- **Scope**: Single project only (one saved design)
- **Persistence**: CraftJS `query.serialize()` → Database → `Frame data={}`

## Database Setup

### 1. Install Prisma Dependencies

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init --datasource-provider sqlite
```

### 2. Create Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Design {
  id          String   @id @default(cuid())
  craftState  String   // JSON string of CraftJS nodes
  updatedAt   DateTime @updatedAt
  createdAt   DateTime @default(now())

  @@map("designs")
}
```

### 3. Create Database

```bash
npx prisma db push
npx prisma generate
```

### 4. Create Prisma Client (`app/lib/db.server.ts`)

**NEW FILE** - Prisma singleton to prevent multiple instances

```typescript
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

export { prisma };
```

### 5. Environment Variable (`.env`)

```
DATABASE_URL="file:./dev.db"
```

### 6. Update `.gitignore`

```
# Database
/prisma/*.db
/prisma/*.db-journal
```

## Save Functionality

### 1. Add Save Action (`app/routes/_index.tsx`)

Add action to handle save requests:

```typescript
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "~/lib/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "save-design") {
    const craftState = formData.get("craftState") as string;

    // Upsert: update if exists, create if not
    const design = await prisma.design.upsert({
      where: { id: "default" },
      update: { craftState },
      create: {
        id: "default",
        craftState
      },
    });

    return json({ success: true, updatedAt: design.updatedAt });
  }

  return json({ success: false }, { status: 400 });
}
```

### 2. Add Save Button (`app/components/canvas.tsx`)

Add Save button next to Code/Undo/Redo buttons:

```typescript
import { useFetcher } from "@remix-run/react";
import { Save } from "lucide-react";

export const Canvas = ({ children }: CanvasProps) => {
  const { query } = useEditor();
  const fetcher = useFetcher();

  const handleSave = () => {
    const serializedState = query.serialize();

    fetcher.submit(
      {
        intent: "save-design",
        craftState: serializedState
      },
      { method: "post" }
    );
  };

  const isSaving = fetcher.state === "submitting";
  const isSaved = fetcher.data?.success;

  return (
    <div className="flex gap-2">
      <Save
        size={24}
        onClick={handleSave}
        className={`cursor-pointer ${
          isSaving ? 'animate-pulse text-blue-500' :
          isSaved ? 'text-green-500' :
          'text-gray-500 hover:text-primary'
        }`}
      />
      {/* existing Code/Undo/Redo buttons */}
    </div>
  );
}
```

## Load Functionality

### Add Loader to Editor (`app/routes/_index.tsx`)

Load saved state on page load:

```typescript
import { useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

export async function loader() {
  const design = await prisma.design.findUnique({
    where: { id: "default" }
  });

  return json({
    craftState: design?.craftState || null
  });
}

export default function Index() {
  const { craftState } = useLoaderData<typeof loader>();

  return (
    <Editor
      resolver={{
        NodeButton,
        Canvas,
        NodeCardHeader,
        NodeCard,
        NodeCardContent,
        NodeCardDescription,
        NodeCardTitle,
        NodeCardFooter,
        NodeOneBlock,
        NodeTwoBlocks,
        NodeThreeBlocks,
      }}
      onRender={RenderNode}
    >
      <Frame data={craftState}>
        <Element is={Canvas} canvas>
          {/* existing content */}
        </Element>
      </Frame>
    </Editor>
  );
}
```

**Note**: Frame's `data` prop accepts the serialized state and automatically deserializes it.

## Preview Route

### Create Preview Route (`app/routes/preview.tsx`)

**NEW FILE** - Renders saved design without editor UI

```typescript
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Editor, Frame, Element } from "@craftjs/core";
import { Canvas } from "~/components/canvas";
import { prisma } from "~/lib/db.server";

// Import all components (same as editor)
import { NodeButton } from "~/components/node/button";
import {
  NodeCardHeader,
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardTitle,
  NodeCardFooter,
} from "~/components/node/card";
import {
  NodeOneBlock,
  NodeTwoBlocks,
  NodeThreeBlocks,
} from "~/components/node/layout";

export async function loader() {
  const design = await prisma.design.findUnique({
    where: { id: "default" }
  });

  if (!design) {
    throw new Response("No design saved yet. Please create a design first.", {
      status: 404,
    });
  }

  return json({ craftState: design.craftState });
}

export function ErrorBoundary() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No Design Found</h1>
        <p className="mb-4">Please create and save a design first.</p>
        <a href="/" className="text-blue-500 hover:underline">
          Go to Editor
        </a>
      </div>
    </div>
  );
}

export default function Preview() {
  const { craftState } = useLoaderData<typeof loader>();

  return (
    <div className="w-full min-h-screen">
      <Editor
        resolver={{
          NodeButton,
          Canvas,
          NodeCardHeader,
          NodeCard,
          NodeCardContent,
          NodeCardDescription,
          NodeCardTitle,
          NodeCardFooter,
          NodeOneBlock,
          NodeTwoBlocks,
          NodeThreeBlocks,
        }}
        enabled={false} // CRITICAL: Disables editing
      >
        <Frame data={craftState}>
          <Element is={Canvas} canvas />
        </Frame>
      </Editor>
    </div>
  );
}
```

## Optional Enhancements

### Add Preview Link to Editor

Add button in Canvas to open preview in new tab:

```typescript
import { Link } from "@remix-run/react";
import { Eye } from "lucide-react";

<Link to="/preview" target="_blank">
  <Eye
    size={24}
    className="text-gray-500 hover:text-primary cursor-pointer"
  />
</Link>
```

## Implementation Sequence

1. **Database Setup** (30 min)
   - Install Prisma dependencies
   - Create schema and db.server.ts
   - Run `prisma db push`
   - Update .env and .gitignore

2. **Save Functionality** (45 min)
   - Add action to _index.tsx
   - Add Save button to canvas.tsx
   - Implement save handler with fetcher
   - Test save flow

3. **Load Functionality** (30 min)
   - Add loader to _index.tsx
   - Update Editor to use loaded state
   - Test persistence on refresh

4. **Preview Route** (45 min)
   - Create preview.tsx
   - Implement loader and error boundary
   - Create read-only Editor
   - Test preview rendering

5. **Polish** (30 min)
   - Add save status indicator
   - Add preview link button
   - Test edge cases

**Total Time: ~3 hours**

## Testing Checklist

- [ ] Save button saves design to database
- [ ] Refresh editor page loads saved design
- [ ] Preview route renders saved design correctly
- [ ] Preview route shows error when no design saved
- [ ] Save indicator shows saving/saved states
- [ ] Multiple saves work correctly
- [ ] Verify database with `npx prisma studio`

## Critical Files

| File | Action | Purpose |
|------|--------|---------|
| `prisma/schema.prisma` | CREATE | Database schema |
| `app/lib/db.server.ts` | CREATE | Prisma client singleton |
| `app/routes/preview.tsx` | CREATE | Preview route |
| `app/routes/_index.tsx` | MODIFY | Add loader/action |
| `app/components/canvas.tsx` | MODIFY | Add Save button |
| `.env` | MODIFY | Add DATABASE_URL |
| `.gitignore` | MODIFY | Add database files |
| `package.json` | MODIFY | Add Prisma deps |

## Data Flow

### Save Flow
```
User clicks Save → query.serialize() → useFetcher submits →
action() receives → Prisma upserts → Success response → UI updates
```

### Load Flow
```
User visits / → loader() queries DB → Returns craftState →
useLoaderData() → <Frame data={craftState}> → Editor renders
```

### Preview Flow
```
User visits /preview → loader() queries DB → Returns craftState →
<Editor enabled={false}> → <Frame data={craftState}> → Read-only render
```

## Key Technical Decisions

- **Why SQLite**: Zero config, file-based, perfect for single project, easy migration to Postgres later
- **Why Prisma**: Type-safe, easy migrations, good Remix patterns
- **Why query.serialize()**: Built-in CraftJS method, matches Frame data prop format
- **Why enabled={false}**: Disables all editing while keeping components interactive
- **Why separate route**: Clean separation, better UX, shareable preview URL

## Error Handling

1. **No saved design**: Return null in loader, Frame handles gracefully
2. **Corrupt JSON**: Try-catch in loader, fallback to null
3. **Save failure**: Show error via fetcher.data
4. **Preview 404**: ErrorBoundary with link back to editor
