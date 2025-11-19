export default function wikipediaUrlFromSlug(slug: string | undefined) {
  if (slug) {
    return `https://en.wikipedia.org/wiki/${slug}`;
  } else {
    return null;
  }
}
