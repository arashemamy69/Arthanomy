import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// TODO: Replace with your actual Sanity Project ID once created
export const SANITY_PROJECT_ID = '9yc0h8hx'; 
export const SANITY_DATASET = 'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false, // set to `false` to bypass the edge cache (helps with new projects)
  apiVersion: '2024-03-24', // use current date (YYYY-MM-DD) to target the latest API version
});

// Helper function to generate image URLs from Sanity image records
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// Types for our Sanity Data
export interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage: any;
  topic: string;
  tags: string[];
  postType: 'article' | 'update';
  readTime: string;
}

// Helper fetch functions
export async function getFeaturedArticles(): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "post" && postType == "article"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage,
      postType,
      "topic": topic->title,
      "tags": tags[]->title,
      "readTime": round(length(pt::text(body)) / 5 / 180 ) + " min read"
    }`;
    
    const articles = await sanityClient.fetch(query);
    return articles;
  } catch (error) {
    console.error("Error fetching articles from Sanity:", error);
    return [];
  }
}

export async function getLatestUpdates(): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "post" && postType == "update"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      publishedAt,
      mainImage,
      postType,
      "topic": topic->title,
      "tags": tags[]->title,
      "readTime": round(length(pt::text(body)) / 5 / 180 ) + " min read"
    }`;
    
    const updates = await sanityClient.fetch(query);
    return updates;
  } catch (error) {
    console.error("Error fetching updates from Sanity:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<any> {
  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      publishedAt,
      mainImage,
      body,
      markdownText,
      postType,
      "markdownUrl": markdownFile.asset->url,
      "authorName": author->name,
      "authorImage": author->image,
      "topic": topic->title,
      "tags": tags[]->title,
      "readTime": round(length(pt::text(body)) / 5 / 180 ) + " min read"
    }`;
    
    const article = await sanityClient.fetch(query, { slug });
    return article;
  } catch (error) {
    console.error("Error fetching article from Sanity:", error);
    return null;
  }
}
