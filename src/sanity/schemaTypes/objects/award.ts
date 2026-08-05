import { defineField, defineType } from 'sanity';
import { StarIcon } from '@sanity/icons/Star';

/** One row of the awards table on the home page. */
export const award = defineType({
    name: 'award',
    title: 'Award',
    type: 'object',
    icon: StarIcon,
    fields: [
        defineField({
            name: 'year',
            title: 'Year',
            type: 'string',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'organization',
            title: 'Awarding body',
            type: 'string',
            description: 'e.g. PPAI, PPPC',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'title',
            title: 'Award name',
            type: 'string',
            description: 'e.g. International Gold Pyramid Award',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            description: 'The smaller grey line underneath, e.g. Not for Profit'
        })
    ],
    preview: {
        select: { year: 'year', org: 'organization', title: 'title', category: 'category' },
        prepare: ({ year, org, title, category }) => ({
            title: `${year ?? '—'} · ${org ?? ''} ${title ?? ''}`.trim(),
            subtitle: category
        })
    }
});
