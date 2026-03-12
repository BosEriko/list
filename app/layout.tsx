'use client';
import { useEffect } from 'react';
import useAuthStore from '@store/useAuthStore';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
