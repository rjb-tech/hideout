import type { MarkdownInstance } from "astro";
import type { BlogPost } from "@hideoutTypes/blog";

import styles from "./blog.module.scss";

const posts = Object.values(
  import.meta.glob<MarkdownInstance<BlogPost>>("@content/blog/*.md", {
    eager: true,
  }),
).sort((a, b) => (a.frontmatter.date > b.frontmatter.date ? 1 : 0));

export const Blog = () => {
  return <>bleg</>;
};
