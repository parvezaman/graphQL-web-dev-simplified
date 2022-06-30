const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
// const { graphqlHTTP } = require("express-graphql"); // line 2 and three are same function
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();
const port = 3000;

const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J.R. R.Tolkien" },
  { id: 3, name: "Brenet Weeks" },
];
const Books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 },
];

/* const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "HelloWorld",
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => "Hello World",
      },
    }),
  }),
}); */

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "this represents the author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return Books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "singleBook",
  description: "this represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        // console.log(book);
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root query",
  fields: () => ({
    // to find single book
    book: {
      type: BookType,
      description: "A single book by Brenet Weeks",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => Books.find((book) => args.id === book.id),
    },

    // to find all books
    Books: {
      type: new GraphQLList(BookType),
      description: "List of all books",
      resolve: () => Books, // if you had any database u would written that name
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "to get the list of all authors",
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: "a single author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => args.id === author.id),
    },
  }),
});

const schema = new GraphQLSchema({
  query: rootQueryType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log("the server is running...");
});
