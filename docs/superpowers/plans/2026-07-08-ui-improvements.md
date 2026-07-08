# UI Enhancement Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement UI enhancement improvements including migrating business components to Tailwind, adding missing Form/Drawer/Command components, and enhancing the showcase page.

**Architecture:**

1. Migrate business shell components from `.repo-*` CSS classes to Tailwind + `cn()` pattern
2. Add missing shadcn/ui components (Form, Drawer, Command) with proper peer dependency handling
3. Enhance ComponentShowcaseView to demonstrate business components
4. Clean up duplicate patterns in global.scss

**Tech Stack:** TypeScript, React 19, Tailwind CSS v4, shadcn/ui, Radix UI, CVA, clsx, tailwind-merge, react-hook-form, zod, vaul, cmdk

---

## Task 1: Migrate Business Shell Components to Tailwind

**Files:**

- Modify: `packages/shared-ui/src/components/AdminShell.tsx`
- Modify: `packages/shared-ui/src/components/DataPanel.tsx`
- Modify: `packages/shared-ui/src/components/MetricCard.tsx`
- Modify: `packages/shared-ui/src/components/StatusTag.tsx`
- Modify: `packages/shared-ui/src/components/FilterBar.tsx`
- Modify: `packages/shared-ui/src/components/EmptyState.tsx`
- Modify: `packages/shared-ui/src/components/ExceptionState.tsx`
- Modify: `packages/shared-ui/src/components/PermissionGate.tsx`
- Modify: `packages/shared-ui/src/components/PageContainer.tsx`
- Modify: `packages/shared-ui/src/components/PageHeader.tsx`
- Modify: `packages/shared-ui/src/components/AppBreadcrumb.tsx`
- Modify: `packages/shared-ui/src/components/TopNav.tsx`
- Modify: `packages/shared-ui/src/components/SideMenu.tsx`
- Modify: `packages/shared-ui/src/components/TabWorkspace.tsx`
- Modify: `packages/shared-ui/src/components/ThemeModeSwitch.tsx`

- [ ] **Step 1: Migrate DataPanel component**

Read current `packages/shared-ui/src/components/DataPanel.tsx` and replace `.repo-*` CSS classes with Tailwind + `cn()`:

```typescript
// Before (example)
<div className="repo-data-panel">

// After
<div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
```

- [ ] **Step 2: Migrate MetricCard component**

Read current `packages/shared-ui/src/components/MetricCard.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<div className="repo-metric-card">

// After
<div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
```

- [ ] **Step 3: Migrate StatusTag component**

Read current `packages/shared-ui/src/components/StatusTag.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<span className="repo-status-tag">

// After
<span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", getVariantClasses(tone), className)}>
```

- [ ] **Step 4: Migrate FilterBar component**

Read current `packages/shared-ui/src/components/FilterBar.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<div className="repo-filter-bar">

// After
<div className={cn("flex items-center gap-4 p-4 bg-muted/50 rounded-lg", className)}>
```

- [ ] **Step 5: Migrate EmptyState component**

Read current `packages/shared-ui/src/components/EmptyState.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<div className="repo-empty-state">

// After
<div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
```

- [ ] **Step 6: Migrate ExceptionState component**

Read current `packages/shared-ui/src/components/ExceptionState.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<div className="repo-exception-state">

// After
<div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
```

- [ ] **Step 7: Migrate PageContainer component**

Read current `packages/shared-ui/src/components/PageContainer.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<div className="repo-page-container">

// After
<div className={cn("container mx-auto py-6", className)}>
```

- [ ] **Step 8: Migrate PageHeader component**

Read current `packages/shared-ui/src/components/PageHeader.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<div className="repo-page-header">

// After
<div className={cn("flex items-center justify-between mb-6", className)}>
```

- [ ] **Step 9: Migrate AppBreadcrumb component**

Read current `packages/shared-ui/src/components/AppBreadcrumb.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<nav className="repo-breadcrumb">

// After
<nav className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
```

- [ ] **Step 10: Migrate TopNav component**

Read current `packages/shared-ui/src/components/TopNav.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<header className="repo-top-nav">

// After
<header className={cn("flex items-center justify-between h-16 px-6 border-b bg-background", className)}>
```

- [ ] **Step 11: Migrate SideMenu component**

Read current `packages/shared-ui/src/components/SideMenu.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<aside className="repo-side-menu">

// After
<aside className={cn("flex flex-col w-64 h-full border-r bg-background", className)}>
```

- [ ] **Step 12: Migrate TabWorkspace component**

Read current `packages/shared-ui/src/components/TabWorkspace.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<div className="repo-tab-workspace">

// After
<div className={cn("flex items-center border-b bg-background", className)}>
```

- [ ] **Step 13: Migrate ThemeModeSwitch component**

Read current `packages/shared-ui/src/components/ThemeModeSwitch.tsx` and replace `.repo-*` CSS classes:

```typescript
// Before
<div className="repo-theme-mode-switch">

// After
<div className={cn("flex items-center gap-2", className)}>
```

- [ ] **Step 14: Run tests to verify component rendering**

```bash
cd packages/shared-ui
pnpm test
```

Expected: All tests pass, components render correctly with Tailwind classes.

- [ ] **Step 15: Commit changes**

```bash
git add packages/shared-ui/src/components/*.tsx
git commit -m "refactor(shared-ui): migrate business components from .repo-* CSS to Tailwind"
```

---

## Task 2: Add Missing Form Component (react-hook-form integration)

**Files:**

- Create: `packages/shared-ui/src/components/ui/form.tsx`
- Modify: `packages/shared-ui/src/components/ui/index.ts`
- Modify: `packages/shared-ui/package.json` (ensure peer deps)

- [ ] **Step 1: Create Form component with react-hook-form integration**

Create `packages/shared-ui/src/components/ui/form.tsx`:

```typescript
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'
import { cn } from '../../lib/utils'
import { Label } from './label'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    )
  },
)
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()
  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children
  if (!body) {
    return null
  }
  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

- [ ] **Step 2: Update barrel export index.ts**

Update `packages/shared-ui/src/components/ui/index.ts`:

```typescript
// Add to existing exports
export * from './form'
```

- [ ] **Step 3: Verify peer dependencies are installed**

Check `apps/react-app/package.json` to ensure react-hook-form, @hookform/resolvers, and zod are installed:

```bash
cd apps/react-app
cat package.json | grep -E "(react-hook-form|@hookform/resolvers|zod)"
```

If not installed, add them:

```bash
cd apps/react-app
pnpm add react-hook-form @hookform/resolvers zod
```

- [ ] **Step 4: Run tests to verify Form component**

```bash
cd packages/shared-ui
pnpm test
```

Expected: Form component can be imported and used.

- [ ] **Step 5: Commit changes**

```bash
git add packages/shared-ui/src/components/ui/form.tsx packages/shared-ui/src/components/ui/index.ts
git commit -m "feat(shared-ui): add Form component with react-hook-form integration"
```

---

## Task 3: Add Missing Drawer Component (vaul)

**Files:**

- Create: `packages/shared-ui/src/components/ui/drawer.tsx`
- Modify: `packages/shared-ui/src/components/ui/index.ts`
- Modify: `packages/shared-ui/package.json` (ensure peer deps)

- [ ] **Step 1: Create Drawer component with vaul**

Create `packages/shared-ui/src/components/ui/drawer.tsx`:

```typescript
'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { cn } from '../../lib/utils'

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Drawer.displayName = 'Drawer'

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
)
DrawerFooter.displayName = 'DrawerFooter'

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
```

- [ ] **Step 2: Update barrel export index.ts**

Update `packages/shared-ui/src/components/ui/index.ts`:

```typescript
// Add to existing exports
export * from './drawer'
```

- [ ] **Step 3: Verify peer dependency is installed**

Check `apps/react-app/package.json` to ensure vaul is installed:

```bash
cd apps/react-app
cat package.json | grep vaul
```

If not installed, add it:

```bash
cd apps/react-app
pnpm add vaul
```

- [ ] **Step 4: Run tests to verify Drawer component**

```bash
cd packages/shared-ui
pnpm test
```

Expected: Drawer component can be imported and used.

- [ ] **Step 5: Commit changes**

```bash
git add packages/shared-ui/src/components/ui/drawer.tsx packages/shared-ui/src/components/ui/index.ts
git commit -m "feat(shared-ui): add Drawer component with vaul"
```

---

## Task 4: Add Missing Command Component (cmdk)

**Files:**

- Create: `packages/shared-ui/src/components/ui/command.tsx`
- Modify: `packages/shared-ui/src/components/ui/index.ts`
- Modify: `packages/shared-ui/package.json` (ensure peer deps)

- [ ] **Step 1: Create Command component with cmdk**

Create `packages/shared-ui/src/components/ui/command.tsx`:

```typescript
'use client'

import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Dialog, DialogContent } from './dialog'

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className,
    )}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className,
    )}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
}
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
```

- [ ] **Step 2: Update barrel export index.ts**

Update `packages/shared-ui/src/components/ui/index.ts`:

```typescript
// Add to existing exports
export * from './command'
```

- [ ] **Step 3: Verify peer dependency is installed**

Check `apps/react-app/package.json` to ensure cmdk is installed:

```bash
cd apps/react-app
cat package.json | grep cmdk
```

If not installed, add it:

```bash
cd apps/react-app
pnpm add cmdk
```

- [ ] **Step 4: Run tests to verify Command component**

```bash
cd packages/shared-ui
pnpm test
```

Expected: Command component can be imported and used.

- [ ] **Step 5: Commit changes**

```bash
git add packages/shared-ui/src/components/ui/command.tsx packages/shared-ui/src/components/ui/index.ts
git commit -m "feat(shared-ui): add Command component with cmdk"
```

---

## Task 5: Enhance ComponentShowcaseView with Business Components

**Files:**

- Modify: `apps/react-app/src/views/showcase/ComponentShowcaseView.tsx`

- [ ] **Step 1: Add business component showcase sections**

Update `apps/react-app/src/views/showcase/ComponentShowcaseView.tsx` to include business components:

```typescript
import {
  DataPanel,
  MetricCard,
  StatusTag,
  FilterBar,
  EmptyState,
  ExceptionState,
  PageContainer,
  PageHeader,
  AppBreadcrumb,
} from '@repo/shared-ui'

// Add these sections after the existing showcases

{/* DataPanel Showcase */}
<ShowcaseSection title="DataPanel" description="Card-like panel with title and toolbar">
  <DataPanel title="Data Panel" className="w-full">
    <div className="p-4">
      <p>This is the data panel content.</p>
    </div>
  </DataPanel>
</ShowcaseSection>

{/* MetricCard Showcase */}
<ShowcaseSection title="MetricCard" description="KPI metric card with trend">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <MetricCard title="Total Users" value="12,345" trend="up" trendValue="+12.5%" />
    <MetricCard title="Revenue" value="$45,678" trend="up" trendValue="+8.2%" />
    <MetricCard title="Conversion" value="3.2%" trend="down" trendValue="-0.5%" />
  </div>
</ShowcaseSection>

{/* StatusTag Showcase */}
<ShowcaseSection title="StatusTag" description="Colored status badges">
  <div className="flex gap-2">
    <StatusTag tone="success">Active</StatusTag>
    <StatusTag tone="warning">Pending</StatusTag>
    <StatusTag tone="error">Inactive</StatusTag>
    <StatusTag tone="info">Info</StatusTag>
  </div>
</ShowcaseSection>

{/* FilterBar Showcase */}
<ShowcaseSection title="FilterBar" description="Filter and action bar">
  <FilterBar className="w-full">
    <Input placeholder="Search..." className="w-64" />
    <Button variant="outline">Filter</Button>
    <Button>Apply</Button>
  </FilterBar>
</ShowcaseSection>

{/* EmptyState Showcase */}
<ShowcaseSection title="EmptyState" description="Empty state placeholder">
  <EmptyState
    title="No data found"
    description="There are no items to display."
    action={<Button>Add Item</Button>}
  />
</ShowcaseSection>

{/* ExceptionState Showcase */}
<ShowcaseSection title="ExceptionState" description="Error state displays">
  <div className="space-y-4">
    <ExceptionState code="403" title="Access Denied" description="You don't have permission to access this page." />
    <ExceptionState code="404" title="Page Not Found" description="The page you're looking for doesn't exist." />
    <ExceptionState code="500" title="Server Error" description="Something went wrong on our end." />
  </div>
</ShowcaseSection>

{/* PageContainer Showcase */}
<ShowcaseSection title="PageContainer" description="Page wrapper with breadcrumb">
  <PageContainer>
    <PageHeader title="Page Title" description="Page description goes here." />
    <div className="p-6">
      <p>Page content goes here.</p>
    </div>
  </PageContainer>
</ShowcaseSection>
```

- [ ] **Step 2: Run build to verify compilation**

```bash
cd apps/react-app
pnpm build
```

Expected: Build succeeds without errors.

- [ ] **Step 3: Commit changes**

```bash
git add apps/react-app/src/views/showcase/ComponentShowcaseView.tsx
git commit -m "feat(react-app): enhance showcase page with business components"
```

---

## Task 6: Clean Up Duplicate SCSS Patterns

**Files:**

- Modify: `apps/react-app/src/styles/global.scss`
- Modify: `packages/shared-ui/src/style.css` (optional cleanup)

- [ ] **Step 1: Identify duplicate patterns**

Read `apps/react-app/src/styles/global.scss` and identify patterns that duplicate shared-ui components:

- `.login-form` → Could use Card + Form components
- `.data-table` → Could use Table component
- `.role-card` → Could use Card component
- `.pagination` → Could use Pagination component
- `.meta-input` → Could use Input + Label components

- [ ] **Step 2: Remove duplicate CSS rules**

Remove or reduce CSS rules that are now handled by shared components:

```scss
// Remove or reduce these sections
.login-form {
  /* Replace with Card + Form components */
}
.data-table {
  /* Replace with Table component */
}
.role-card {
  /* Replace with Card component */
}
.pagination {
  /* Replace with Pagination component */
}
.meta-input {
  /* Replace with Input + Label components */
}
```

- [ ] **Step 3: Verify no visual regressions**

Start dev server and check all pages still look correct:

```bash
pnpm dev
```

- [ ] **Step 4: Commit changes**

```bash
git add apps/react-app/src/styles/global.scss
git commit -m "refactor(react-app): remove duplicate SCSS patterns handled by shared components"
```

---

## Task 7: Final Integration and Testing

**Files:**

- Modify: `packages/shared-ui/src/index.ts` (ensure proper exports)
- Modify: `apps/react-app/src/bootstrap.tsx` (ensure all providers)

- [ ] **Step 1: Verify shared-ui exports all new components**

Check `packages/shared-ui/src/index.ts` to ensure Form, Drawer, Command are exported:

```typescript
// Ensure these exports exist
export * from './components/ui'
export * from './components'
export * from './provider/ThemeProvider'
export * from './hooks/useThemeSnapshot'
export * from './hooks/useThemeMode'
export * from './hooks/use-toast'
```

- [ ] **Step 2: Verify theme provider integration**

Check `apps/react-app/src/bootstrap.tsx` to ensure ThemeProvider and Toaster are properly wrapping the app:

```typescript
import { ThemeProvider } from '@repo/shared-ui'
import { Toaster } from '@repo/shared-ui'

function App() {
  return (
    <ThemeProvider>
      {/* ... app content */}
      <Toaster />
    </ThemeProvider>
  )
}
```

- [ ] **Step 3: Run full build and test suite**

```bash
# Run all builds
pnpm build:shared
pnpm build:react

# Run type checking
pnpm typecheck

# Run all tests
pnpm test

# Run linting
pnpm lint
```

Expected: All builds pass, no type errors, all tests pass, no lint errors.

- [ ] **Step 4: Manual verification**

Start the development server and verify:

```bash
pnpm dev
```

Then:

1. Navigate to `/components` to see the enhanced showcase page
2. Test all new components (Form, Drawer, Command)
3. Test migrated business components (DataPanel, MetricCard, StatusTag, etc.)
4. Test theme switching (light/dark/system)
5. Test theme name switching (default/compact)
6. Verify all components render correctly
7. Test keyboard navigation for interactive components

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete UI enhancement improvements"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** All improvement areas are addressed
- [ ] **No placeholders:** All steps contain complete code and exact commands
- [ ] **Type consistency:** All types, method signatures, and property names are consistent
- [ ] **Testing:** All components have basic tests and can be imported
- [ ] **Documentation:** README files updated if necessary
- [ ] **Commit messages:** All commits follow conventional commit format

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-08-ui-improvements.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
