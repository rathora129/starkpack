'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { formatDate } from '@/lib/format';
import { colors, fonts, radii } from '@/lib/theme';
import {
  Container,
  Section,
  Kicker,
  Breadcrumb,
  Cta,
} from '@/components/site/ui';

const ArticleHead = styled.header`
  max-width: 780px;
  margin: 0 auto;
  padding: 34px 0 28px;

  h1 {
    margin-top: 14px;
    font-family: ${fonts.display};
    font-size: clamp(34px, 4.5vw, 58px);
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: -0.035em;
    color: ${colors.ink};
  }

  p.excerpt {
    margin-top: 18px;
    font-size: 16px;
    line-height: 1.7;
    color: ${colors.muted};
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid ${colors.lineSoft};
  font-size: 11.5px;
  color: ${colors.faint};
`;

const Body = styled.article`
  max-width: 720px;
  margin: 0 auto;
  padding: 34px 30px;
  border-radius: ${radii.lg};
  background: #fff;
  border: 1px solid ${colors.lineSoft};

  p {
    font-size: 15px;
    line-height: 1.85;
    color: ${colors.inkSoft};
  }

  p + p {
    margin-top: 18px;
  }

  @media (max-width: 680px) {
    padding: 24px 20px;
  }
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 28px;
  font-size: 12px;
  font-weight: 700;
  color: ${colors.forest};
`;

export default function BlogArticlePage() {
  const params = useParams();
  const blogs = useDemoStore((state) => state.cmsBlogs);
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const article = blogs.find((item) => item.slug === slug && item.status === 'Published');

  if (!article) {
    return (
      <Section $tone="cream">
        <Container style={{ textAlign: 'center', maxWidth: 620 }}>
          <Kicker>Journal</Kicker>
          <h1 style={{ marginTop: 14, fontFamily: fonts.display, fontSize: 42, fontWeight: 500, color: colors.ink }}>
            This article is not published.
          </h1>
          <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.7, color: colors.muted }}>
            The article may have been unpublished from the CMS or the link is incorrect.
          </p>
          <div style={{ marginTop: 22 }}>
            <Cta href="/blog" variant="primary" size="md">
              Back to the journal <ArrowRight size={14} />
            </Cta>
          </div>
        </Container>
      </Section>
    );
  }

  const paragraphs = String(article.body || '').split(/\n{2,}/).filter(Boolean);

  return (
    <Section $tone="cream" $tight>
      <Container>
        <Breadcrumb>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Journal</Link>
          <span>/</span>
          {article.category}
        </Breadcrumb>
        <ArticleHead>
          <Kicker>{article.category}</Kicker>
          <h1>{article.title}</h1>
          <p className="excerpt">{article.excerpt}</p>
          <Meta>
            <span>By {article.author}</span>
            <span>·</span>
            <span>{formatDate(article.date)}</span>
            <span>·</span>
            <span>
              <Clock3 size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
              {article.readTime}
            </span>
          </Meta>
        </ArticleHead>
        <Body>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Body>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Back href="/blog">
            <ArrowLeft size={13} /> All articles
          </Back>
        </div>
      </Container>
    </Section>
  );
}
