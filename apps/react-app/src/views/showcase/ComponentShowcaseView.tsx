import { useState } from 'react'
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Separator,
  Checkbox,
  Switch,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  AvatarFallback,
  Progress,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Slider,
  Skeleton,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  RadioGroup,
  RadioGroupItem,
  ThemeModeSwitch,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  Steps,
  StepItem,
} from '@repo/shared-ui'
import { useThemeStore } from '@/stores/theme'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@repo/shared-ui'

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Separator />
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function ButtonShowcase() {
  return (
    <ShowcaseSection title="Button" description="Buttons with multiple variants and sizes.">
      <div className="flex flex-wrap gap-3">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">⏎</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button disabled>Disabled</Button>
      </div>
    </ShowcaseSection>
  )
}

function InputShowcase() {
  return (
    <ShowcaseSection title="Input" description="Text input fields with various states.">
      <div className="grid max-w-sm gap-3">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="disabled">Disabled</Label>
          <Input id="disabled" disabled placeholder="Cannot edit" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Type your message..." />
        </div>
      </div>
    </ShowcaseSection>
  )
}

function CardShowcase() {
  return (
    <ShowcaseSection title="Card" description="Cards for content grouping.">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content area with some text.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing emails</Label>
              <Switch id="marketing" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="security">Security alerts</Label>
              <Switch id="security" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </ShowcaseSection>
  )
}

function BadgeShowcase() {
  return (
    <ShowcaseSection title="Badge" description="Badges for status and labels.">
      <div className="flex flex-wrap gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </ShowcaseSection>
  )
}

function SelectShowcase() {
  const [value, setValue] = useState('')
  return (
    <ShowcaseSection title="Select" description="Dropdown select menus.">
      <div className="max-w-sm space-y-3">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
          </SelectContent>
        </Select>
        {value && <p className="text-sm text-muted-foreground">Selected: {value}</p>}
      </div>
    </ShowcaseSection>
  )
}

function CheckboxRadioShowcase() {
  return (
    <ShowcaseSection title="Checkbox & Radio" description="Selection controls.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Label>Checkboxes</Label>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="newsletter" defaultChecked />
            <Label htmlFor="newsletter">Subscribe</Label>
          </div>
        </div>
        <div className="space-y-3">
          <Label>Radio Group</Label>
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </ShowcaseSection>
  )
}

function DialogShowcase() {
  return (
    <ShowcaseSection title="Dialog" description="Modal dialogs and alerts.">
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ShowcaseSection>
  )
}

function DrawerShowcase() {
  return (
    <ShowcaseSection title="Drawer" description="Drawer panels for mobile-friendly overlays.">
      <div className="flex flex-wrap gap-3">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <p className="text-sm text-muted-foreground">
                This is a drawer component using vaul. It slides up from the bottom on mobile.
              </p>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </ShowcaseSection>
  )
}

function TableShowcase() {
  return (
    <ShowcaseSection title="Table" description="Data tables for lists.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
            { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
            { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
          ].map((row) => (
            <TableRow key={row.invoice}>
              <TableCell className="font-medium">{row.invoice}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    row.status === 'Paid'
                      ? 'default'
                      : row.status === 'Pending'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell className="text-right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ShowcaseSection>
  )
}

function TabsShowcase() {
  return (
    <ShowcaseSection title="Tabs" description="Tabbed content navigation.">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ShowcaseSection>
  )
}

function AdvancedShowcase() {
  const [progress] = useState(66)
  const [sliderValue, setSliderValue] = useState([50])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ShowcaseSection
      title="Advanced"
      description="Accordion, Avatar, Progress, Slider, Toggle, Collapsible, ScrollArea, Skeleton, Tooltip."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Accordion</h3>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that match the design system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Avatar</h3>
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Progress ({progress}%)</h3>
          <Progress value={progress} />
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Slider ({sliderValue[0]})</h3>
          <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Toggle & Toggle Group</h3>
          <div className="flex gap-3">
            <Toggle>Bold</Toggle>
            <Toggle variant="outline">Italic</Toggle>
          </div>
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
            <ToggleGroupItem value="c">C</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Collapsible</h3>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                {isOpen ? 'Close' : 'Open'} Details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 rounded-md border p-3 text-sm">
              These are the collapsible details that can be shown or hidden.
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Tooltip</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Skeleton</h3>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </ShowcaseSection>
  )
}

function CommandShowcase() {
  const [open, setOpen] = useState(false)

  return (
    <ShowcaseSection title="Command" description="Command palette (⌘K style) using cmdk.">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              Calendar
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Search Emoji
              <CommandShortcut>⌘E</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Calculator
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </ShowcaseSection>
  )
}

function StepsShowcase() {
  return (
    <ShowcaseSection title="Steps" description="Step indicator for multi-step flows.">
      <div className="space-y-8">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">Horizontal (current=2)</p>
          <Steps current={2}>
            <StepItem stepNumber={1} title="Account" description="Set up your account" />
            <StepItem stepNumber={2} title="Security" description="Configure security" />
            <StepItem stepNumber={3} title="Done" description="Completed" />
          </Steps>
        </div>
        <div>
          <p className="mb-3 text-sm text-muted-foreground">Vertical (current=1)</p>
          <Steps current={1} direction="vertical">
            <StepItem stepNumber={1} title="Step One" description="This is the first step." />
            <StepItem stepNumber={2} title="Step Two" description="This is the second step." />
            <StepItem stepNumber={3} title="Step Three" description="This is the last step." />
          </Steps>
        </div>
      </div>
    </ShowcaseSection>
  )
}

const formSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
})

function FormShowcase() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '' },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <ShowcaseSection title="Form" description="Form validation with react-hook-form + zod.">
      <div className="max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormDescription>We will never share your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </ShowcaseSection>
  )
}

function ThemeShowcase() {
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)
  const themeName = useThemeStore((state) => state.themeName)
  const setThemeName = useThemeStore((state) => state.setThemeName)

  return (
    <ShowcaseSection
      title="Theme"
      description="Switch between light/dark mode and default/compact theme."
    >
      <div className="flex flex-wrap items-center gap-4">
        <ThemeModeSwitch
          preference={preference}
          label="Theme Mode"
          systemText="System"
          lightText="Light"
          darkText="Dark"
          ariaLabel="Toggle theme mode"
          onChange={setPreference}
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="theme-name">Theme Variant</Label>
          <Select value={themeName} onValueChange={(v) => setThemeName(v as 'default' | 'compact')}>
            <SelectTrigger id="theme-name" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </ShowcaseSection>
  )
}

export default function ComponentShowcaseView() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Component Showcase</h1>
        <p className="mt-2 text-muted-foreground">
          All shadcn/ui components integrated with the design-tokens theme system.
        </p>
      </div>
      <Separator />
      <ThemeShowcase />
      <ButtonShowcase />
      <InputShowcase />
      <CardShowcase />
      <BadgeShowcase />
      <SelectShowcase />
      <CheckboxRadioShowcase />
      <DialogShowcase />
      <DrawerShowcase />
      <TableShowcase />
      <TabsShowcase />
      <CommandShowcase />
      <StepsShowcase />
      <FormShowcase />
      <AdvancedShowcase />
    </div>
  )
}
