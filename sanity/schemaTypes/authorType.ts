import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'


// Test comment
export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'credentials',
      title: 'Qualifications',
      type: 'string',
      description:
        'For doctors and dietitians. Shown after the name on articles they review, for example: MBBS, MD (Internal Medicine).',
    }),
    defineField({
      name: 'registration',
      title: 'Registration number',
      type: 'string',
      description:
        'Medical council registration, for example: DMC 12345. Kept for the doctor profile page. It is not shown on articles.',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
