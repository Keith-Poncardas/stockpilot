// useOptimisticMutation.ts
import { useApolloClient, gql, type DocumentNode, type OperationVariables } from '@apollo/client';

interface OptimisticMutationOptions<TVariables extends OperationVariables, TOptimisticFields> {
    mutation: DocumentNode;
    typename: string;
    entityId: string;
    optimisticFields: TOptimisticFields;
    buildVariables: (fields: TOptimisticFields) => TVariables;
    refetchQueries?: (DocumentNode | string)[];
}

export function buildSnapshotFragment(typename: string, fields: string[]): DocumentNode {
    return gql`
    fragment SnapshotFragment on ${typename} {
      ${fields.join('\n')}
    }
  `;
}

export function useOptimisticMutation<TVariables extends OperationVariables = OperationVariables, TOptimisticFields extends Record<string, unknown> = Record<string, unknown>>() {
    const client = useApolloClient();

    const mutate = async <TOpt extends TOptimisticFields = TOptimisticFields, TVars extends TVariables = TVariables>({
        mutation,
        typename,
        entityId,
        optimisticFields,
        buildVariables,
        refetchQueries,
    }: OptimisticMutationOptions<TVars, TOpt>) => {
        // Snapshot current cache values for rollback
        const snapshot = client.cache.readFragment<TOptimisticFields>({
            id: client.cache.identify({ __typename: typename, id: entityId }),
            fragment: buildSnapshotFragment(typename, Object.keys(optimisticFields)),
        });

        // Optimistic update
        client.cache.modify({
            id: client.cache.identify({ __typename: typename, id: entityId }),
            fields: Object.fromEntries(
                Object.entries(optimisticFields as Record<string, unknown>).map(([key, value]) => [key, () => value])
            ),
        });

        try {
            await client.mutate({
                mutation,
                variables: buildVariables(optimisticFields),
                refetchQueries
            });
        } catch (error) {
            console.error(
                `[useOptimisticMutation] Failed to mutate ${typename}:`, error
            );
            // Revert to snapshot
            if (snapshot) {
                client.cache.modify({
                    id: client.cache.identify({ __typename: typename, id: entityId }),
                    fields: Object.fromEntries(
                        Object.entries(snapshot as Record<string, unknown>).map(([key, value]) => [key, () => value])
                    ),
                });
            }
            throw error;
        }
    };

    return { mutate };
}