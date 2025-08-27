import { defineContentConfig, defineCollection, z } from "@nuxt/content";
import { asSitemapCollection } from '@nuxtjs/sitemap/content'


export default defineContentConfig({
  collections: {
    articles: defineCollection(asSitemapCollection({
      type: "page",
      source: "articles/**/*.md",
      schema: z.object({
        date: z.date(),
        tags: z.array(z.string()),
        image: z.string().optional(),
      }),
    })),
    profile: defineCollection(asSitemapCollection({
      type: "page",
      source: "info/profile.md",
    })),
  }
});
