import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const MyQueryProvider = ({children}) => {

  // 1. the query client
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
      },
      onSuccess: (data) => {
      }
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
      },
      onSuccess: (data) => {
      }
    }),
    defaultOptions: {
      queries: {
        retry: false,
        // cacheTime: 1000 * 60 * 60 * 24, 
        // 24 hours. This is garbage collection time. staleTime is prob what youre looking for instead
      },
      mutations: {
        retry: false
      }
    }
  })


  // 2. the persister
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  })

  return (
    <PersistQueryClientProvider 
      client={queryClient}
      persistOptions={{
        persister,
        // dehydrateOptions: {
        //   shouldDehydrateQuery: (query) => {
        //     // this funcion returns a boolean, which determines whether the query should be persisted into localStorage
        //     // default for this function is for all queries: return query.state.status === 'success'
        //     // log('DEHYDRATE', query);
        //     return query.state.status === 'success' && (query.queryKey.includes('search') || query.queryKey.includes('my-searches'));
        //     // return false;
        //   }
        // } 
      } }
    >
      {children}
      <ReactQueryDevtools />
    </PersistQueryClientProvider>

  )
}