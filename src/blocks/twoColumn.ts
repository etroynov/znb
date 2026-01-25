import {
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

export const twoColumn: Block = {
  slug: 'two-column',
  interfaceName: 'TwoColumn',
  fields: [
    {
      type: 'row',
      fields: [
        {
          label: 'Lable',
          name: 'firstTitle',
          type: 'text',
          required: true,
        },
        {
          label: 'Lable',
          name: 'secondTitle',
          type: 'text',
          required: true,
        },
      ],
    },

    {
      name: 'rows',
      type: 'array',
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'image',
              type: 'relationship',
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  FixedToolbarFeature(),
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
};
