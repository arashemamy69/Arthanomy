import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

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
export interface SanityImageAsset {
  _ref: string;
  _type: 'reference';
}

export interface SanityAuthor {
  name: string;
  slug: { current: string };
  bio?: string;
  photo?: { asset: SanityImageAsset; alt?: string };
  linkedinUrl?: string;
  substackUrl?: string;
  articles?: Array<{
    title: string;
    slug: { current: string };
    publishedAt?: string;
    excerpt?: string;
  }>;
}

export interface SanityArticle {
  title: string;
  subtitle?: string;
  slug: { current: string };
  publishedAt?: string;
  readTime?: string;
  mainImage?: {
    asset: SanityImageAsset;
    alt: string;
    hotspot?: { x: number; y: number; height: number; width: number };
  };
  author?: {
    name: string;
    slug: { current: string };
    bio?: string;
    photo?: { asset: SanityImageAsset; alt?: string };
    linkedinUrl?: string;
    substackUrl?: string;
  };
  topic?: { title: string; slug: { current: string } };
  tags?: Array<{ title: string; slug: { current: string } }>;
  excerpt?: string;
  seoTitle?: string;
  metaDescription?: string;
  targetKeyword?: string;
  substackUrl?: string;
  series?: { title: string; slug: { current: string }; description?: string };
  partNumber?: number;
  body?: PortableTextBlock[];
}

export interface SanityPage {
  title: string;
  subtitle?: string;
  slug: { current: string };
  body?: PortableTextBlock[];
}

export interface SanitySeries {
  title: string;
  slug: { current: string };
  description?: string;
  substackUrl?: string;
  articleCount?: number;
  articles?: Array<{
    title: string;
    subtitle?: string;
    slug: { current: string };
    partNumber?: number;
    excerpt?: string;
  }>;
}

// Helper fetch functions
export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  try {
    const query = `*[_type == "page" && slug.current == $slug][0] {
      title,
      subtitle,
      slug,
      body
    }`;
    const page = await sanityClient.fetch(query, { slug });
    return page;
  } catch (error) {
    console.error(`Error fetching page ${slug} from Sanity:`, error);
    return null;
  }
}

export async function getFeaturedArticles(): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && !archived] | order(publishedAt desc)[0...3] {
      title,
      subtitle,
      slug,
      publishedAt,
      readTime,
      mainImage { asset->, alt },
      "author": author->{ name, slug, photo },
      "topic": topic->{ title, slug },
      "tags": tags[]->{ title, slug },
      excerpt
    }`;
    
    const articles = await sanityClient.fetch(query);
    return articles;
  } catch (error) {
    console.error("Error fetching articles from Sanity:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<SanityArticle | null> {
  try {
    const query = `*[_type == "article" && slug.current == $slug && !archived][0] {
      title,
      subtitle,
      slug,
      publishedAt,
      readTime,
      mainImage { ..., alt },
      "author": author->{ name, slug, bio, photo, linkedinUrl, substackUrl },
      "topic": topic->{ title, slug },
      "tags": tags[]->{ title, slug },
      excerpt,
      seoTitle,
      metaDescription,
      targetKeyword,
      substackUrl,
      "series": series->{ 
        title, 
        slug, 
        description,
        "articles": *[_type == "article" && references(^._id) && !archived] | order(partNumber asc) {
          title,
          slug,
          partNumber
        }
      },
      partNumber,
      body[] {
        ...,
        _type == "image" => { ..., asset-> },
        _type == "disclaimer" => { style, text },
        _type == "table" => { rows },
        _type == "arthTable" => { rows },
        _type == "pullStat" => { value, label, subtext }
      }
    }`;
    
    const article = await sanityClient.fetch(query, { slug });
    return article;
  } catch (error) {
    console.error("Error fetching article from Sanity:", error);
    return null;
  }
}

export async function getRelatedArticles(currentSlug: string, limit: number = 3): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && slug.current != $currentSlug && !archived] | order(publishedAt desc)[0...$limit] {
      title,
      subtitle,
      slug,
      publishedAt,
      readTime,
      mainImage { asset->, alt },
      "author": author->{ name, slug, photo },
      "topic": topic->{ title, slug },
      "tags": tags[]->{ title, slug },
      excerpt
    }`;
    
    const articles = await sanityClient.fetch(query, { currentSlug, limit });
    return articles;
  } catch (error) {
    console.error("Error fetching related articles from Sanity:", error);
    return [];
  }
}

export async function getAllArticles(): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && !archived] | order(publishedAt desc) {
      title,
      subtitle,
      slug,
      publishedAt,
      readTime,
      mainImage { asset->, alt },
      "author": author->{ name, slug, photo },
      "topic": topic->{ title, slug },
      "tags": tags[]->{ title, slug },
      excerpt
    }`;
    
    const articles = await sanityClient.fetch(query);
    return articles;
  } catch (error) {
    console.error("Error fetching all articles from Sanity:", error);
    return [];
  }
}

export async function getArticlesByTopic(topicSlug: string): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && topic->slug.current == $topicSlug && !archived] | order(publishedAt desc) {
      title,
      subtitle,
      slug,
      publishedAt,
      readTime,
      mainImage { asset->, alt },
      "author": author->{ name, slug, photo },
      "topic": topic->{ title, slug },
      "tags": tags[]->{ title, slug },
      excerpt
    }`;
    
    const articles = await sanityClient.fetch(query, { topicSlug });
    return articles;
  } catch (error) {
    console.error(`Error fetching articles for topic ${topicSlug}:`, error);
    return [];
  }
}

export async function getArticlesByTag(tagSlug: string): Promise<SanityArticle[]> {
  try {
    const query = `*[_type == "article" && $tagSlug in tags[]->slug.current && !archived] | order(publishedAt desc) {
      title,
      subtitle,
      slug,
      publishedAt,
      readTime,
      mainImage { asset->, alt },
      "author": author->{ name, slug, photo },
      "topic": topic->{ title, slug },
      "tags": tags[]->{ title, slug },
      excerpt
    }`;
    
    const articles = await sanityClient.fetch(query, { tagSlug });
    return articles;
  } catch (error) {
    console.error(`Error fetching articles for tag ${tagSlug}:`, error);
    return [];
  }
}

export async function getAllSeries(): Promise<SanitySeries[]> {
  try {
    const query = `*[_type == "series"] | order(title asc) {
      title,
      slug,
      description,
      substackUrl,
      "articleCount": count(*[_type == "article" && references(^._id) && !archived])
    }`;
    
    const series = await sanityClient.fetch(query);
    return series;
  } catch (error) {
    console.error("Error fetching all series from Sanity:", error);
    return [];
  }
}

export async function getSeriesBySlug(slug: string): Promise<SanitySeries | null> {
  try {
    const query = `*[_type == "series" && slug.current == $slug][0] {
      title,
      slug,
      description,
      substackUrl,
      "articles": *[_type == "article" && references(^._id) && !archived] | order(partNumber asc) {
        title,
        subtitle,
        slug,
        partNumber,
        excerpt
      }
    }`;
    
    const series = await sanityClient.fetch(query, { slug });
    return series;
  } catch (error) {
    console.error("Error fetching series from Sanity:", error);
    return null;
  }
}
