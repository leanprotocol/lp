import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { apiVersion } from "../env.public";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
    }),
    defineField({
      name: "enabled",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isFeatured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isHero",
      type: "boolean",
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true;

          try {
            const client = context.getClient({ apiVersion });
            const docId = context.document?._id;

            if (!docId) {
              const existing = await client.fetch<{ title?: string } | null>(
                '*[_type == "post" && coalesce(isHero, false) == true][0]{title}'
              );
              return existing
                ? `Only one post can be marked as hero. Current hero: ${existing.title || "(untitled)"}`
                : true;
            }

            const publishedId = docId.replace(/^drafts\./, "");
            const draftId = `drafts.${publishedId}`;

            const existing = await client.fetch<{ title?: string } | null>(
              '*[_type == "post" && coalesce(isHero, false) == true && !(_id in [$draftId, $publishedId])][0]{title}',
              { draftId, publishedId }
            );

            return existing
              ? `Only one post can be marked as hero. Current hero: ${existing.title || "(untitled)"}`
              : true;
          } catch (err) {
            console.error("[postType.isHero validation]", err);
            return true;
          }
        }),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      enabled: "enabled",
      isFeatured: "isFeatured",
      isHero: "isHero",
    },
    prepare(selection) {
      const { author, enabled, isFeatured, isHero } = selection;
      const flags: string[] = [];
      if (enabled === false) flags.push("disabled");
      if (isHero) flags.push("hero");
      if (isFeatured) flags.push("featured");
      const flagsText = flags.length > 0 ? ` (${flags.join(", ")})` : "";
      return {
        ...selection,
        subtitle: `${author ? `by ${author}` : ""}${flagsText}`.trim(),
      };
    },
  },
});
