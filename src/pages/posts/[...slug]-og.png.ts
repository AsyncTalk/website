import OG from "../../components/OpenGraph/OG";
import { PNG } from "../../components/OpenGraph/createImage";
import type { APIRoute, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";
// import fs from "fs/promises";
// import matter from "gray-matter";

export async function getStaticPaths() {
  const blog = await getCollection("posts");
  // const blogData = await getBlogFrontmatterCollection();
  return blog.map((post) => {
    const title = post.data.title

    const matched = title.match(/(E|S)P(\d+) /)

    const ep = matched ? matched[1] === 'E' ? Number(matched[2]) : undefined : undefined
    const sp = matched ? matched[1] === 'S' ? Number(matched[2]) : undefined : undefined

    return {
      params: {
        post: post.slug,
        slug: post.slug.replace("/posts/", ""),
      },
      props: {
        title: post.data.title,
        ep,
        sp
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { title, ep, sp } = props as Props;
  const png = await PNG(OG({
    title,
    ep,
    sp
  }));
  return new Response(png as unknown as ReadableStream, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};

// const getBlogFrontmatterCollection = async () => {
//   const contentDir = "src/content/posts";
//   const files = await fs.readdir(contentDir);
//   const mdx = files.filter((file) => file.endsWith(".mdx"));
//   const frontmatter = mdx.map(async (file) => {
//     const content = await fs.readFile(`${contentDir}/${file}`, "utf-8");
//     const { data } = matter(content);
//     return data;
//   });
//   return Promise.all(frontmatter);
// };