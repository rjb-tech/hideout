import type { MarkdownInstance } from "astro";
import type { BlogPost } from "@hideoutTypes/blog";

import styles from "./blog.module.scss";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

interface IBlog {
  posts: MarkdownInstance<BlogPost>[];
}

export const Blog = ({ posts }: IBlog) => {
  const [postIndex, setPostIndex] = useState<number>(posts.length - 1);

  const isLatestPost = postIndex === posts.length - 1;

  const onArrowClick = (direction: "incr" | "decr") => {
    const newIndex =
      direction === "incr"
        ? (postIndex + 1) % posts.length
        : (postIndex - 1 + posts.length) % posts.length;

    setPostIndex(newIndex);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <ChevronLeftIcon
          className={styles.arrow}
          onClick={() => onArrowClick("decr")}
        />
        <span className={styles.labelContainer}>
          <div className={`${styles.label} ${!isLatestPost && styles.hidden}`}>
            latest
          </div>
        </span>
        <ChevronRightIcon
          className={styles.arrow}
          onClick={() => onArrowClick("incr")}
        />
      </div>
      <div className={styles.blogContainer}>
        <div className={styles.postContainer}>
          <h2 className={styles.title}>{posts[postIndex].frontmatter.title}</h2>
          <span>{posts[postIndex].frontmatter.description}</span>
          <span className={styles.readingTime}>
            {posts[postIndex].frontmatter.minutesRead}
          </span>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.button}>
            <div>Read This</div>
          </div>
          <div className={styles.button}>
            <div>All Posts</div>
          </div>
        </div>
      </div>
    </div>
  );
};
