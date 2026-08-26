import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zhangjik.bbroot.com'),
  title: 'Z Lab｜张浩的个人开发实验室',
  description: '集求职、学习、生活工具和轻量娱乐于一体的个人开发项目。',
  openGraph: {
    title: 'Z Lab｜张浩的个人开发实验室',
    description: '集求职、学习、生活工具和轻量娱乐于一体的个人开发项目。',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Z Lab｜张浩的个人开发实验室',
    description: '集求职、学习、生活工具和轻量娱乐于一体的个人开发项目。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
