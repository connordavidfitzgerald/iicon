import { defineField, defineType } from 'sanity';
import { TagIcon } from '@sanity/icons/Tag';

/**
 * The tags shown under a project name, e.g. "Product Sourcing, Brand Strategy".
 * Kept as their own documents so the wording stays identical everywhere and new
 * ones can be added without a developer.
 */
export const discipline = defineType({
    name: 'discipline',
    title: 'Discipline',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Name',
            type: 'string',
            description: 'e.g. Product Sourcing',
            validation: (rule) => rule.required()
        })
    ],
    preview: {
        select: { title: 'title' }
    }
});
