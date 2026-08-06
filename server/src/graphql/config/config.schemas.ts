import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import path from "path";

/**
 * Config TypeDefs
 *
 * Loads all .gql files from:
 *   - src/graphql/config/ (base schema: Pagination, InfiniteScrollMeta, OrderDirection)
 *   - src/features/**  (one .gql per feature)
 *
 * mergeTypeDefs combines all Query / Mutation extension blocks automatically.
 */
export const typeDefs = mergeTypeDefs(
    loadFilesSync([
        path.join(__dirname, "../config/**/*.gql"),
        path.join(__dirname, "../../features/**/*.gql"),
    ])
);
