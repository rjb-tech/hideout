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
  const currentPost = posts[postIndex];

  const onArrowClick = (direction: "incr" | "decr") => {
    const newIndex =
      direction === "incr"
        ? (postIndex + 1) % posts.length
        : (postIndex - 1 + posts.length) % posts.length;

    setPostIndex(newIndex);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tagContainer}>
        {currentPost.frontmatter.tags.map((tag, idx) => (
          <span key={idx} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <div
        className={`${multiplePosts ? styles.blogContainer : styles.fullHeightBlogContainer}`}
      >
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{currentPost.frontmatter.title}</h2>
        </div>
        <div className={styles.postContainer}>
          <span>{currentPost.frontmatter.description}</span>
        </div>
        <div className={styles.bottomContainer}>
          <span className={styles.readingTime}>
            {currentPost.frontmatter.readingTime}
          </span>

          <div className={styles.buttonContainer}>
            <div className={styles.button}>
              <a href={currentPost.url} target="_self">
                Read This
              </a>
            </div>

            {posts.length > 1 && (
              <div className={styles.button}>
                <a href="/blog" target="_self">
                  All Posts
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {multiplePosts && (
        <div className={styles.navContainer}>
          <ChevronLeftIcon
            className={styles.arrow}
            onClick={() => onArrowClick("decr")}
          />
          <ChevronRightIcon
            className={styles.arrow}
            onClick={() => onArrowClick("incr")}
          />
        </div>
      )}
    </div>
  );
};
