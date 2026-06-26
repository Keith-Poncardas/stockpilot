import { useAuthStore } from "@/store";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().token;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const errorLink = onError((errorResponse) => {
    // Cast to any to suppress the deprecation warning for graphQLErrors.
    // Apollo 3.x still uses it, but it will be moved to `error` in 4.0.
    const graphQLErrors = (errorResponse as any).graphQLErrors;
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            if (err.extensions?.code === "UNAUTHENTICATED") {
                // Erase auth tokens and user data
                useAuthStore.getState().logout();
            }
        }
    }
});

export const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: { fetchPolicy: "cache-and-network" },
        query: { fetchPolicy: "network-only" },
    },
});