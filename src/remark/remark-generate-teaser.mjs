import { toString } from "mdast-util-to-string";

// https://docs.astro.build/en/recipes/reading-time/
export function remarkGenerateTeaser() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    // Get the first 250 characters to show in the home page blog component
    data.astro.frontmatter.teaser = textOnPage.substring(0, 250);
  };
}
