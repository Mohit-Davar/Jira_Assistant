import { Toaster } from 'react-hot-toast';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Chat } from '@/features/chat/components/Chat';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Chat />
      {/* <Toaster /> */}
    </QueryClientProvider>
  );
}
