'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import { usePageSections } from '@/hooks/usePageSections';
import {
  Container,
  Section,
  PageIntro,
  IntroTitle,
  IntroLede,
  Kicker,
  Breadcrumb,
  Grid,
  CTABand,
  BandActions,
  Cta,
} from '@/components/site/ui';
import { CmsPageFlow, CmsSection } from '@/components/site/CmsPageFlow';
import { formatDate } from '@/lib/format';

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const ArticleCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
  border-radius: ${radii.lg};
  border: 1px solid ${colors.lineSoft};
  background: #fff;
  box-shadow: ${shadows.card};
  transition: transform ${transitions.fast}, box-shadow ${transitions.fast};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lift};
  }
`;

const Category = styled.span`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.copperDeep};
`;

const ArticleTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: 24px;
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.02em;
  color: ${colors.ink};
`;

const Excerpt = styled.p`
  font-size: 12.5px;
  line-height: 1.7;
  color: ${colors.muted};
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid ${colors.lineSoft};
  font-size: 10.5px;
  color: ${colors.faint};
`;

const ReadMore = styled.span`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  color: ${colors.forest};
`;

export default function BlogIndexPage() {
  const { section } = usePageSections('/blog');
  const hero = section('hero', {
    kicker: 'Journal',
    title: 'Notes from the plant floor.',
    body: 'Cost engineering, compliance and production thinking from the team that builds the packaging. Practical notes for buyers, founders and supply chain leads.',
  });
  const blogs = useDemoStore((state) => state.cmsBlogs);
  const published = blogs
    .filter((article) => article.status === 'Published')
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  return (
    <CmsPageFlow slug="/blog" knownKeys={['hero', 'grid', 'cta']}>
      <CmsSection sectionKey="hero">
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Journal
          </Breadcrumb>
          <Kicker>{hero.kicker}</Kicker>
          <IntroTitle>{hero.title}</IntroTitle>
          <IntroLede>{hero.body}</IntroLede>
        </Container>
      </PageIntro>
      </CmsSection>

      <CmsSection sectionKey="grid">
      <Section $tone="cream" $tight>
        <Container>
          {published.length ? (
            <ArticleGrid>
              {published.map((article) => (
                <ArticleCard key={article.id} href={`/blog/${article.slug}`}>
                  <Category>{article.category}</Category>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <Excerpt>{article.excerpt}</Excerpt>
                  <ArticleMeta>
                    <span>{formatDate(article.date)}</span>
                    <span>·</span>
                    <span>
                      <Clock3 size={10} style={{ verticalAlign: -1, marginRight: 3 }} />
                      {article.readTime}
                    </span>
                    <ReadMore>
                      Read <ArrowUpRight size={12} />
                    </ReadMore>
                  </ArticleMeta>
                </ArticleCard>
              ))}
            </ArticleGrid>
          ) : (
            <p style={{ fontSize: 14, color: colors.muted }}>New journal articles are being prepared.</p>
          )}
        </Container>
      </Section>
      </CmsSection>

      <CmsSection sectionKey="cta">
      <Section $tone="paper" $tight>
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Kicker $light>Talk to an engineer</Kicker>
              <h2 style={{ marginTop: 12 }}>Bring us the problem, not the spec.</h2>
              <p>We will review the structure, material and cost before you commit to a print run.</p>
            </div>
            <BandActions>
              <Cta href="/request-a-quote" variant="copper" size="lg">
                Request a quote <ArrowRight size={15} />
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
      </CmsSection>
    </CmsPageFlow>
  );
}
