import { ErrorCode } from "@/constants";
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
            // Only auto-logout if the account was explicitly restricted (e.g. Suspended, Terminated, Unassigned)
            // This prevents random logouts if the server drops the token due to a database connection timeout
            if (err.extensions?.code === ErrorCode.ACCOUNT_RESTRICTED) {
                console.error("Account restriction detected, logging out:", err);
                useAuthStore.getState().logout();
            }
        }
    }
});

export const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache({
        typePolicies: {
            CustomerPurchaseSummary: {
                keyFields: false,
            },
            CustomerPurchaseHistory: {
                keyFields: false,
            },
            Customer: {
                fields: {
                    purchaseSummary: {
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                    purchaseHistory: {
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: { fetchPolicy: "cache-and-network" },
        query: { fetchPolicy: "network-only" },
    },
});