// const readingTime = require(`reading-time`)
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, actions }: any) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    createNodeField({
      node,
      name: `timeToRead`,
      value: '10'
      // value: readingTime(node.body)
    })
  }
  if (node.internal.type === 'Mdx') {
    createNodeField({
      node,
      name: 'slug',
      value: createFilePath({ node, getNode })
    });
  }
}

exports.createSchemaCustomization = ({ actions }: any) => {
  const { createTypes } = actions

  createTypes(`#graphql
    type Mdx implements Node {
      # You can also use other keys from fields.timeToRead if you don't want "minutes"
      timeToRead: Float @proxy(from: "fields.timeToRead.minutes")
      wordCount: Int @proxy(from: "fields.timeToRead.words")
    }
  `)
}
