import { Slot } from 'expo-router';
import { SessionProvider } from '../ctx';
import { QueryClient, QueryClientProvider } from 'react-query'

export default function Root() {
  const queryClient = new QueryClient()
  // Set up the auth context and render our layout inside of it.
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </QueryClientProvider>
  );
}
