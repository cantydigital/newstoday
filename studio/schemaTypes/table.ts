import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Simple table for article bodies: rows of plain-text cells. Articles imported
 * through the blog webhook use it for their Markdown tables.
 */
export default defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'hasHeaderRow',
      title: 'First row is a header',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'tableRow',
          title: 'Row',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
          preview: {
            select: {cells: 'cells'},
            prepare: ({cells}) => ({title: (cells ?? []).join(' | ')}),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {rows: 'rows'},
    prepare: ({rows}) => ({
      title: 'Table',
      subtitle: `${rows?.length ?? 0} rows`,
    }),
  },
})
