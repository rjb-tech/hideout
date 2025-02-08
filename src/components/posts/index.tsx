import type { HideoutMarkdown } from "@hideoutTypes/content";
import type { MarkdownInstance } from "astro";
import { useState } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import styles from "./posts.module.scss";
import sharedStyles from "@styles/sharedStyles.module.scss";

interface IPostsDisplay {
  posts: MarkdownInstance<HideoutMarkdown>[];
}

export const PostsDisplay = ({ posts }: IPostsDisplay) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = posts.reduce<string[]>(
    (prev, curr) => [...prev, ...curr.frontmatter.tags],
    [],
  );

  const filteredPosts =
    selectedTags.length === 0
      ? posts
      : posts.filter((post) =>
          post.frontmatter.tags.some((tag) => selectedTags.includes(tag)),
        );

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((x) => x !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className={styles.postsContainer}>
      <div className={styles.filterContainer}>
        Filter posts by tag
        <div className={styles.filters}>
          {tags.map((tag, idx) => (
            <span
              key={idx}
              onClick={() => handleTagClick(tag)}
              className={`${styles.tagFilter} ${sharedStyles.noSelect} ${selectedTags.includes(tag) && sharedStyles.selected}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.postList}>
        {posts.map((post, idx) => {
          const isVisible = filteredPosts.includes(post);
          const published = format(
            toZonedTime(post.frontmatter.date, "America/New_York"),
            "dd MMMM yyyy",
          );
          return (
            <a
              key={idx}
              href={post.url}
              className={styles.postLink}
              target="_self"
            >
              <div
                className={`${styles.post} ${!isVisible && sharedStyles.hidden}`}
              >
                <h3>{post.frontmatter.title}</h3>
                <div className={styles.infoContainer}>
                  <div className={styles.timeDateContainer}>
                    <p className={styles.readingTime}>
                      {post.frontmatter.readingTime}
                    </p>
                    <p className={styles.published}>{` ${published}`}</p>
                  </div>
                  <div className={styles.postTagsContainer}>
                    Tags:
                    {post.frontmatter.tags.map((tag, idx) => (
                      <span key={idx} className={styles.postTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
