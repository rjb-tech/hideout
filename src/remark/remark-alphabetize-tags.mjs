// https://docs.astro.build/en/recipes/reading-time/
export function remarkAlphabetizeTags() {
  return function (tree, { data }) {
    data.astro.frontmatter.tags = data.astro.frontmatter.tags.sort();
  };
}
