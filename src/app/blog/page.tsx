'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Navigation from '@/components/Navigation';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog?published=true');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center mt-[70px] sm:mt-[90px] overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-[56px] md:text-[72px] leading-[0.95] font-serif text-white">
            Blog & News
          </h1>
        </div>
      </section>

      {/* Featured Post Section */}
      {!loading && featuredPost && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Featured Image */}
              <div className="relative h-[350px] lg:h-[400px] overflow-hidden rounded-lg">
                {featuredPost.coverImage ? (
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center">
                    <svg className="w-24 h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Featured Content */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  {featuredPost.tags[0] && (
                    <span className="text-[#873260] text-[11px] tracking-[0.2em] uppercase font-medium">
                      {featuredPost.tags[0]}
                    </span>
                  )}
                  <span className="text-gray-400 text-sm">
                    {formatDate(featuredPost.publishedAt)}
                  </span>
                </div>
                <h2 className="text-[32px] md:text-[40px] leading-[1.2] font-serif text-[#111111]">
                  {featuredPost.title}
                </h2>
                <p className="text-[16px] text-[#32373c] leading-[1.8] font-light">
                  {featuredPost.excerpt || featuredPost.content.substring(0, 200) + '...'}
                </p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-[#111111] font-medium text-sm hover:text-[#873260] transition-colors group"
                >
                  Read More
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Items Section */}
      <section className="py-16 px-4 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] font-serif mb-10 text-[#111111]">Recent Blogs</h2>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : otherPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  {/* Post Image */}
                  <div className="relative h-48 overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    {post.tags[0] && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] text-[#873260] font-medium tracking-wide uppercase">
                        {post.tags[0]}
                      </span>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <p className="text-gray-400 text-xs mb-3">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h3 className="text-[18px] font-serif text-[#111111] mb-3 leading-tight group-hover:text-[#873260] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-3">
                      {post.excerpt || post.content.substring(0, 120) + '...'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-xl font-serif text-[#111111] mb-2">No Posts Yet</h3>
              <p className="text-gray-500">Check back soon for stories and updates from our hotel.</p>
            </div>
          )}
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
}
