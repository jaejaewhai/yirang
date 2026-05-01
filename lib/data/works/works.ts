import raw from "./works.json"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const worksData = shuffle(raw).map((item: { src: string; caption: string; tags: string; category: string }) => ({
  src: `/images/works/${item.src}`,
  caption: item.caption || "",
  tags: item.tags ? item.tags.split(" ").filter(Boolean) : [],
  category: item.category || "",
}))