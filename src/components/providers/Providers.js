'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroUIProvider } from '@heroui/react';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { ToastViewport } from '@/components/ui/Toast';
import { NavProgress } from '@/components/ui/NavProgress';
import StyledComponentsRegistry from './StyledComponentsRegistry';

export default function Providers({ children }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <StyledComponentsRegistry>
      <GlobalStyle />
      <HeroUIProvider navigate={(href) => router.push(href)}>
        <QueryClientProvider client={queryClient}>
          <NavProgress />
          {children}
          <ToastViewport />
        </QueryClientProvider>
      </HeroUIProvider>
    </StyledComponentsRegistry>
  );
}
