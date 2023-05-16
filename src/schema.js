
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";


const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);

const loadedResolvers = loadFilesSync(
`${__dirname}/**/*.{query,mutations}.js`
);

const typeDefs = mergeTypeDefs(loadedTypes);

const resolvers = mergeResolvers(loadedResolvers);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
