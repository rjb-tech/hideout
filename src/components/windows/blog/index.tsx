import Markdown from "react-markdown";

import styles from "./blogWindow.module.scss";

// posts[0].rawContent() -> render in a markdown component
// posts[0].frontmatter.title -> get title from frontmatter
export const BlogWindow = () => {
  return <div className={styles.blogContainer}>{}</div>;
};
