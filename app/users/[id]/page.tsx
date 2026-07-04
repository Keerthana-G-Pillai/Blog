import Link from 'next/link';
import { Metadata } from 'next';
import { fetchUserById, fetchPostsByUserId, fetchAllUsers } from '@/lib/api-client';
import { BlogCard } from '@/components/blog-card';
import { Breadcrumb } from '@/components/breadcrumb';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await fetchUserById(Number(id));

  if (!user) {
    return {
      title: 'User Not Found',
      description: 'The user profile you are looking for does not exist.',
    };
  }

  return {
    title: `${user.name} - Profile`,
    description: `View ${user.name}'s profile and blog posts. Works at ${user.company.name}.`,
    openGraph: {
      title: `${user.name} - Profile`,
      description: `View ${user.name}'s profile and blog posts.`,
      type: 'profile',
    },
  };
}

export async function generateStaticParams() {
  const users = await fetchAllUsers();
  return users.map((user) => ({
    id: user.id.toString(),
  }));
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  const user = await fetchUserById(Number(id));

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-16 text-center dark:border-gray-700 dark:bg-gray-900/50">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            User Not Found
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            The user profile you are looking for does not exist.
          </p>
          <Link
            href="/users"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md dark:hover:bg-blue-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const posts = await fetchPostsByUserId(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-12">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Users', href: '/users' },
            { label: user.name },
          ]}
        />
      </div>

      {/* User Info */}
      <header className="mb-12">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          {user.name}
        </h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.phone}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Website
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {user.website}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Company
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.company.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                City
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.address.city}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* User's Posts */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Posts by {user.name}
        </h2>
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-900/50">
            <p className="text-gray-600 dark:text-gray-400">
              This user hasn&apos;t published any posts yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
