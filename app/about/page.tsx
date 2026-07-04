import { Metadata } from 'next';
import { Breadcrumb } from '@/components/breadcrumb';

export const metadata: Metadata = {
  title: 'About - Blog Hub',
  description: 'Learn about Blog Hub, a modern blog platform for discovering articles, built with Next.js, React, and powered by open data.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
      />

      <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
        About Blog Hub
      </h1>

      <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          Blog Hub is a modern blog platform designed for discovering and reading articles from a
          variety of authors. Built with cutting-edge web technologies, it offers a fast, responsive,
          and enjoyable reading experience.
        </p>

        <p>
          Our platform is powered by open data, making it easy to explore a wide range of content.
          Whether you&apos;re looking for inspiration, knowledge, or just a good read, Blog Hub
          brings articles to your fingertips with a clean and intuitive interface.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white pt-4">
          Key Features
        </h2>

        <ul className="list-disc list-inside space-y-2">
          <li>Fast and responsive design</li>
          <li>Dark mode support</li>
          <li>Bookmarks for saving articles to read later</li>
          <li>Search and filter to find the content you need</li>
          <li>Author profiles to discover more from your favorite writers</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white pt-4">
          Built With
        </h2>

        <ul className="list-disc list-inside space-y-2">
          <li>Next.js</li>
          <li>React</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
        </ul>
      </div>
    </div>
  );
}
