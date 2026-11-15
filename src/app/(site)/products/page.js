'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  Ruler,
  Clock3,
  Recycle,
} from 'lucide-react';
import { products, productCategories } from '@/data/catalog';
import { useDemoStore } from '@/store/useDemoStore';
import { colors, fonts, radii, transitions } from '@/lib/theme';
import {
  Container,
  Section,
  PageIntro,
  IntroTitle,
  IntroLede,
  Kicker,
  Breadcrumb,
  Cta,
  CTABand,
  BandActions,
  Grid,
  ProductCard,
  ProductMedia,
  ProductTag,
  ProductBody,
  ProductMeta,
  Pill,
} from '@/components/site/ui';
import Link from 'next/link';

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

const Tab = styled.button`
  padding: 8px 14px;
  border-radius: ${radii.pill};
  border: 1px solid ${({ $active }) => ($active ? colors.forest : colors.line)};
  background: ${({ $active }) => ($active ? colors.forest : 'transparent')};
  color: ${({ $active }) => ($active ? '#F9F6EE' : colors.muted)};
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: 700;
  transition: all ${transitions.fast};

  &:hover {
    border-color: ${colors.forest};
    color: ${({ $active }) => ($active ? '#F9F6EE' : colors.forest)};
  }
`;

const Count = styled.p`
  margin-left: auto;
  font-size: 10.5px;
  font-weight: 600;
  color: ${colors.faint};

  @media (max-width: 680px) {
    display: none;
  }
`;

const Assurance = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 34px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const AssuranceCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border: 1px solid ${colors.lineSoft};
  border-radius: ${radii.md};
  background: #fff;

  svg {
    color: ${colors.copper};
    flex: 0 0 auto;
    margin-top: 1px;
  }

  strong {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.muted};
    line-height: 1.45;
  }
`;

const IntroActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 26px;
`;

const assuranceItems = [
  { icon: Ruler, title: '72-hour prototypes', detail: 'White samples before you commit.' },
  { icon: Layers, title: '500-unit MOQ', detail: 'On standard corrugated formats.' },
  { icon: Clock3, title: '7–10 day runs', detail: 'Standard production lead time.' },
  { icon: Recycle, title: 'FSC-certified', detail: 'Recyclable board as standard.' },
];

export default function ProductsPage() {
  const [category, setCategory] = useState('All');
  const cmsProducts = useDemoStore((state) => state.cmsProducts);
  const publishedSlugs = useMemo(
    () => new Set(cmsProducts.filter((item) => item.published).map((item) => item.slug)),
    [cmsProducts]
  );
  const visibleProducts = useMemo(
    () => products.filter((product) => publishedSlugs.has(product.slug)),
    [publishedSlugs]
  );

  const filtered = useMemo(
    () => (category === 'All' ? visibleProducts : visibleProducts.filter((product) => product.category === category)),
    [category, visibleProducts]
  );

  const counts = useMemo(() => {
    const map = { All: visibleProducts.length };
    visibleProducts.forEach((product) => {
      map[product.category] = (map[product.category] || 0) + 1;
    });
    return map;
  }, [visibleProducts]);

  return (
    <>
      <PageIntro>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            Products
          </Breadcrumb>
          <Kicker>Product range</Kicker>
          <IntroTitle>The right structure for the job.</IntroTitle>
          <IntroLede>
            Eight core packaging families, each engineered to your dimensions, print and distribution
            realities. Mix formats across a single programme and keep one quality standard.
          </IntroLede>
          <IntroActions>
            <Cta href="/request-a-quote" variant="primary" size="md">
              Request a quote <ArrowRight size={14} />
            </Cta>
            <Cta href="/capabilities" variant="outline" size="md">
              Manufacturing capabilities
            </Cta>
          </IntroActions>
          <Assurance>
            {assuranceItems.map((item) => (
              <AssuranceCard key={item.title}>
                <item.icon size={15} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              </AssuranceCard>
            ))}
          </Assurance>
        </Container>
      </PageIntro>

      <Section>
        <Container>
          <Tabs role="group" aria-label="Filter products by category">
            {productCategories.map((item) => (
              <Tab
                key={item}
                type="button"
                $active={category === item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
                <span style={{ opacity: 0.55, marginLeft: 5, fontSize: 9.5 }}>{counts[item] || 0}</span>
              </Tab>
            ))}
            <Count>
              Showing {filtered.length} of {visibleProducts.length} formats
            </Count>
          </Tabs>

          <Grid $cols={3} $colsLg={2} $gap="18px">
            {filtered.map((product) => (
              <ProductCard key={product.slug} href={`/products/${product.slug}`}>
                <ProductMedia>
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 680px) 92vw, (max-width: 1024px) 45vw, 31vw"
                  />
                  <ProductTag>{product.category}</ProductTag>
                </ProductMedia>
                <ProductBody>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {product.badges.map((badge) => (
                      <Pill key={badge}>{badge}</Pill>
                    ))}
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.tagline}</p>
                  <ProductMeta>
                    <span>
                      From <strong>₹{product.startingAt}</strong> / {product.unit}
                    </span>
                    <ArrowUpRight size={15} />
                  </ProductMeta>
                </ProductBody>
              </ProductCard>
            ))}
          </Grid>

          <div style={{ marginTop: 18, fontSize: 11, color: colors.faint, display: 'flex', gap: 7, alignItems: 'center' }}>
            <Sparkles size={12} style={{ color: colors.copper }} />
            Indicative pricing for planning. Final cost depends on board, print, finish and volume.
          </div>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>Custom structures</Pill>
              <h2 style={{ marginTop: 14 }}>Need something that is not on this list?</h2>
              <p>
                Most of our work is a custom structure. Send a sketch, a sample or a reference — our design team
                will engineer the dieline and prototype it.
              </p>
            </div>
            <BandActions>
              <Cta href="/request-a-quote" variant="copper" size="lg">
                Describe your pack <ArrowRight size={15} />
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
    </>
  );
}
