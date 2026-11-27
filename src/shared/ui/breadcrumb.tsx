import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

/** Trail with a back chevron that points at the parent crumb. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const parent = items.at(-2);
  return (
    <nav aria-label="Navigatsiya" className="flex h-4 items-center gap-2 text-caption text-ink-secondary">
      {parent?.href ? (
        <Link href={parent.href} aria-label={`${parent.label} sahifasiga qaytish`} className="rounded-xs hover:text-ink">
          <ChevronLeft className="size-3.5" />
        </Link>
      ) : null}
      <ol className="flex items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 ? <li aria-hidden="true">/</li> : null}
              <li>
                {last || !item.href ? (
                  <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-ink" : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-ink">
                    {item.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
