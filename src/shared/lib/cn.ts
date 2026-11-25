import { createCn } from "cn/config";

/**
 * Class merger that knows the design system's custom text sizes.
 * Without this, `text-caption` and `text-ink` look like the same group
 * (text colour) and the merger silently drops the size.
 * Keep in sync with the `--text-*` sizes in src/app/globals.css.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "numeric-lg",
            "numeric",
            "numeric-sm",
            "title-lg",
            "title",
            "body",
            "label",
            "caption",
            "micro",
          ],
        },
      ],
    },
  },
});
