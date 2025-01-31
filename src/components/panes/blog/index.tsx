import type { MarkdownInstance } from "astro";
import type { BlogPost } from "@hideoutTypes/blog";

import styles from "./blog.module.scss";

interface IBlog {
  posts: MarkdownInstance<BlogPost>[];
}

export const Blog = ({ posts }: IBlog) => {
  const latestPost = posts[posts.length - 1];
  return (
    <div className={styles.blogContainer}>
      <div className={styles.label}>latest</div>
      <div className={styles.postContainer}>
        <h2 className={styles.title}>{latestPost.frontmatter.title}</h2>
        <span>{latestPost.frontmatter.description}</span>
        <span>{latestPost.frontmatter.minutesRead}</span>

        {/* <span>Arrows on the side to cycle through articles</span>
        <span>
          Expand button that will fit content height and transition smoothly
        </span> */}
      </div>
      <div className={styles.readMore}>
        <span>Read More</span>
      </div>
    </div>
  );
};
