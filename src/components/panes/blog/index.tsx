import type { MarkdownInstance } from "astro";
import type { BlogPost } from "@hideoutTypes/blog";

import styles from "./blog.module.scss";

interface IBlog {
  posts: MarkdownInstance<BlogPost>[];
}

export const Blog = ({ posts }: IBlog) => {
  const latestPost = posts[posts.length - 1];
  return (
    <div>
      <div className={styles.header}>Latest Blog Post</div>
      <div className={styles.postContainer}>
        <h2>{latestPost.frontmatter.title}</h2>
        <span>{latestPost.frontmatter.description}</span>
        <span>Reading time calculation</span>
        <span>Read More button</span>
        <span>Arrows on the side to cycle through articles</span>
        <span>
          Expand button that will fit content height and transition smoothly
        </span>
      </div>
    </div>
  );
};
