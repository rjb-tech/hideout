import type { MarkdownInstance } from "astro";
import type { HideoutMarkdown } from "@hideoutTypes/content";

import styles from "./blog.module.scss";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

interface IBlog {
  posts: MarkdownInstance<HideoutMarkdown>[];
}

export const Blog = ({ posts }: IBlog) => {
  const [postIndex, setPostIndex] = useState<number>(posts.length - 1);

  const multiplePosts = posts.length > 1;
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
      {multiplePosts && (
        <div className={styles.navContainer}>
          <ChevronLeftIcon
            className={styles.arrow}
            onClick={() => onArrowClick("decr")}
          />
          <span className={styles.labelContainer}>
            <div
              className={`${styles.label} ${!isLatestPost && styles.hidden}`}
            >
              latest
            </div>
          </span>
          <ChevronRightIcon
            className={styles.arrow}
            onClick={() => onArrowClick("incr")}
          />
        </div>
      )}
      <div
        className={`${multiplePosts ? styles.blogContainer : styles.fullHeightBlogContainer}`}
      >
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{posts[postIndex].frontmatter.title}</h2>
        </div>
        <div className={styles.postContainer}>
          <span>{posts[postIndex].frontmatter.description}</span>
        </div>
        <div className={styles.bottomContainer}>
          <span className={styles.readingTime}>
            {posts[postIndex].frontmatter.minutesRead}
          </span>
          <div className={styles.buttonContainer}>
            <div className={styles.button}>
              <a href={posts[postIndex].url} target="_self">
                Read This
              </a>
            </div>
            <div className={styles.button}>
              <a href="/blog" target="_self">
                All Posts
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
