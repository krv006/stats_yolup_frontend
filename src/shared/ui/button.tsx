import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-label whitespace-nowrap select-none",
    "transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: "bg-action text-ink-inverse hover:bg-action-hover",
        secondary: "bg-subtle text-ink hover:bg-track",
        outline: "border border-line bg-surface text-ink shadow-xs hover:bg-subtle",
        danger: "bg-danger text-ink-inverse hover:brightness-95 focus-visible:ring-danger/40",
        ghost: "text-ink-secondary hover:bg-subtle hover:text-ink",
      },
      size: {
        xs: "h-[30px] gap-1.5 px-3.5 text-caption font-medium",
        sm: "h-8 px-3",
        md: "h-[34px] px-4",
        icon: "size-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
