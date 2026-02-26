'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import Navigation from '@/components/Navigation';
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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch all published posts and find by slug
        const response = await fetch('/api/blog?published=true');
        if (response.ok) {
          const data = await response.json();
          const found = (data.posts || []).find((p: BlogPost) => p.slug === slug);
          if (found) {
            setPost(found);
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#873260] mx-auto"></div>
          <p className="mt-6 text-[#32373c] text-[15px] font-light">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation variant="solid" />
        <div className="h-[90px]"></div>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-[36px] font-serif text-[#111111] mb-4">Post Not Found</h1>
            <p className="text-[#32373c] text-[15px] font-light mb-8">The blog post you're looking for doesn't exist.</p>
            <Link
              href="/blog"
              className="inline-block bg-[#111111] hover:bg-[#333333] text-white px-8 py-3.5 rounded-sm transition-colors text-[12px] font-medium tracking-[0.15em] uppercase"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Hero with Cover Image */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end mt-[70px] sm:mt-[90px] overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#873260] to-[#6B2850]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 pb-12 w-full">
          <div className="flex items-center gap-4 mb-4">
            {post.tags[0] && (
              <span className="text-white/80 text-[11px] tracking-[0.2em] uppercase font-medium">
                {post.tags[0]}
              </span>
            )}
            <span className="text-white/60 text-[13px] font-light">
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <h1 className="text-[36px] md:text-[52px] leading-[1.1] font-serif text-white">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {post.excerpt && (
            <p className="text-[19px] text-[#32373c] leading-[1.8] font-light mb-8 border-l-2 border-[#873260] pl-6">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-lg max-w-none text-[#32373c] leading-[1.9] font-light
              [&_h2]:text-[28px] [&_h2]:font-serif [&_h2]:text-[#111111] [&_h2]:mt-12 [&_h2]:mb-6
              [&_h3]:text-[22px] [&_h3]:font-serif [&_h3]:text-[#111111] [&_h3]:mt-8 [&_h3]:mb-4
              [&_p]:text-[16px] [&_p]:mb-6
              [&_a]:text-[#873260] [&_a]:underline [&_a:hover]:text-[#6B2850]
              [&_blockquote]:border-l-2 [&_blockquote]:border-[#873260] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-[#666]
              [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
              [&_li]:mb-2"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#e5e5e5]">
              <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-3 font-medium">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-[#f5f5f0] text-[#32373c] text-[13px] font-light rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#111111] font-medium text-sm hover:text-[#873260] transition-colors group"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
