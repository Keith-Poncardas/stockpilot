declare module "apollo-upload-client/createUploadLink.mjs" {
    import type { ApolloLink, HttpOptions } from "@apollo/client";

    export default function createUploadLink(options?: HttpOptions): ApolloLink;
}
