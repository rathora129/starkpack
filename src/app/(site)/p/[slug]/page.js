'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { colors, fonts, radii } from '@/lib/theme';
import {
  Container,
  Section,
  Kicker,
  Breadcrumb,
  Cta,
} from '@/components/site/ui';
import { formatDate } from '@/lib/format';

const Head = styled.header`
  max-width: 820px;
  padding: 30px 0 34px;

  h1 {
    margin-top: 16px;
    font-family: ${fonts.display};
    font-size: clamp(38px, 5vw, 64px);
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.04em;
    color: ${colors.ink};
  }

  p.intro {
    margin-top: 20px;
    font-size: 18px;
    line-height: 1.6;
    color: ${colors.copperDeep};
    font-family: ${fonts.display};
  }
`;

const Body = styled.article`
  max-width: 760px;
  padding: 34px;
  border-radius: ${radii.lg};
  border: 1px solid ${colors.lineSoft};
  background: #fff;

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

const Foot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  max-width: 760px;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid ${colors.lineSoft};
`;

export default function CustomPage() {
  const params = useParams();
  const pages = useDemoStore((state) => state.cmsPages);
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const page = pages.find((item) => item.slug === `/p/${slug}`);
  const visible = page && page.status === 'Published';

  if (!visible) {
    return (
      <Section $tone="cream">
        <Container style={{ textAlign: 'center', maxWidth: 640 }}>
          <Kicker>Stark Packmate</Kicker>
          <h1 style={{ marginTop: 14, fontFamily: fonts.display, fontSize: 44, fontWeight: 500, color: colors.ink }}>
            This page is not published.
          </h1>
          <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.7, color: colors.muted }}>
            The page may be in draft in the website CMS. Publish it from the admin to make it live.
          </p>
          <div style={{ marginTop: 22 }}>
            <Cta href="/" variant="primary" size="md">
              Back to home <ArrowRight size={14} />
            </Cta>
          </div>
        </Container>
      </Section>
    );
  }

  const paragraphs = String(page.body || '').split(/\n{2,}/).filter(Boolean);

  return (
    <Section $tone="cream" $tight>
      <Container>
        <Breadcrumb>
          <Link href="/">Home</Link>
          <span>/</span>
          {page.title}
        </Breadcrumb>
        <Head>
          <Kicker>{page.type === 'Custom' ? 'Insight' : 'Stark Packmate'}</Kicker>
          <h1>{page.title}</h1>
          {page.intro ? <p className="intro">{page.intro}</p> : null}
        </Head>
        <Body>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Body>
        <Foot>
          <span style={{ fontSize: 10.5, color: colors.faint }}>Updated {formatDate(page.updated)}</span>
          <Cta href="/request-a-quote" variant="copper" size="md">
            <Sparkles size={14} /> Start a packaging brief
          </Cta>
        </Foot>
      </Container>
    </Section>
  );
}
