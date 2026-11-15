'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Download,
  Check,
  ShieldCheck,
  Factory,
} from 'lucide-react';
import { products } from '@/data/catalog';
import { useDemoStore } from '@/store/useDemoStore';
import { downloadCSV } from '@/lib/format';
import { colors, fonts, radii, shadows } from '@/lib/theme';
import {
  Container,
  Section,
  Kicker,
  SectionHead,
  Cta,
  ArrowLink,
  ImageFrame,
  Pill,
  CTABand,
  BandActions,
  Grid,
  FeatureCard,
  IconBadge,
  SiteIcon,
} from '@/components/site/ui';

const DetailBand = styled.section`
  padding: 34px 0 56px;
  background:
    radial-gradient(800px 420px at 90% 0%, rgba(184, 115, 51, 0.08), transparent 62%),
    ${colors.cream};
  border-bottom: 1px solid ${colors.lineSoft};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 48px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  font-size: 11px;
  font-weight: 600;
  color: ${colors.faint};
  margin-bottom: 22px;

  a:hover {
    color: ${colors.forest};
  }

  span {
    color: ${colors.line};
  }
`;

const ProductImage = styled(ImageFrame)`
  aspect-ratio: 4 / 3.7;

  @media (max-width: 900px) {
    aspect-ratio: 16 / 11;
  }
`;

const ImageCaption = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
`;

const Title = styled.h1`
  margin-top: 14px;
  font-family: ${fonts.display};
  font-size: clamp(35px, 4.4vw, 56px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: ${colors.ink};
`;

const Tagline = styled.p`
  margin-top: 12px;
  font-family: ${fonts.display};
  font-size: clamp(17px, 1.9vw, 22px);
  font-style: italic;
  color: ${colors.copperDeep};
  line-height: 1.35;
`;

const Description = styled.p`
  margin-top: 16px;
  font-size: 13.5px;
  line-height: 1.75;
  color: ${colors.muted};
`;

const PriceBand = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 24px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.md};
  background: #fff;
  overflow: hidden;

  div {
    padding: 13px 14px;
    border-right: 1px solid ${colors.lineSoft};

    &:last-child {
      border-right: 0;
    }
  }

  p {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 4px;
    font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 500;
    color: ${colors.ink};
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 9.5px;
    color: ${colors.muted};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 22px;
`;

const PromiseRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid ${colors.line};

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10.5px;
    font-weight: 600;
    color: ${colors.muted};
  }

  svg {
    color: ${colors.success};
  }
`;

const SpecsLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
  gap: 40px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const SpecList = styled.dl`
  border-top: 1px solid ${colors.line};

  div {
    display: grid;
    grid-template-columns: 170px minmax(0, 1fr);
    gap: 16px;
    padding: 13px 0;
    border-bottom: 1px solid ${colors.lineSoft};
  }

  dt {
    font-size: 11px;
    font-weight: 700;
    color: ${colors.faint};
    letter-spacing: 0.02em;
  }

  dd {
    margin: 0;
    font-size: 12.5px;
    color: ${colors.ink};
    line-height: 1.5;
  }

  @media (max-width: 520px) {
    div {
      grid-template-columns: 1fr;
      gap: 3px;
    }
  }
`;

const SideCard = styled.div`
  padding: 22px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: ${colors.paper};

  h3 {
    font-family: ${fonts.sans};
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.ink};
    margin-bottom: 12px;
  }

  & + & {
    margin-top: 14px;
  }
`;

const ApplicationList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SupportCard = styled.div`
  padding: 22px;
  border-radius: ${radii.lg};
  background: ${colors.sidebar};
  color: rgba(243, 239, 228, 0.7);

  h3 {
    font-family: ${fonts.display};
    font-size: 22px;
    color: #F9F6EE;
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 8px;
    font-size: 11.5px;
    line-height: 1.65;
    max-width: 380px;
  }

  div {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
`;

export default function ProductDetailPage() {
  const params = useParams();
  const whatsapp = useDemoStore((state) => state.settings.whatsapp);
  const product = products.find((item) => item.slug === params.slug);

  if (!product) notFound();

  const related = products.filter((item) => product.related?.includes(item.slug)).slice(0, 3);
  const whatsappHref = `https://wa.me/${String(whatsapp.number).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi Stark Packmate, I'd like to discuss ${product.name} for my brand.`
  )}`;

  const downloadSpecs = () => {
    downloadCSV(
      `${product.slug}-specification.csv`,
      ['Specification', 'Detail'],
      [
        ['Product', product.name],
        ['Category', product.category],
        ['Starting price (INR)', product.startingAt],
        ['MOQ', product.moq],
        ['Lead time', product.turnaround],
        ...product.specs.map((spec) => [spec.label, spec.value]),
      ]
    );
  };

  return (
    <>
      <DetailBand>
        <Container>
          <Breadcrumb>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Products</Link>
            <span>/</span>
            {product.name}
          </Breadcrumb>
          <DetailGrid>
            <div>
              <ProductImage $ratio="4 / 3.7">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 900px) 92vw, 46vw"
                />
              </ProductImage>
              <ImageCaption>
                {product.badges.map((badge) => (
                  <Pill key={badge}>{badge}</Pill>
                ))}
                <Pill $tone="copper">{product.category}</Pill>
              </ImageCaption>
            </div>

            <div>
              <Kicker>{product.eyebrow}</Kicker>
              <Title>{product.name}</Title>
              <Tagline>{product.tagline}</Tagline>
              <Description>{product.description}</Description>

              <PriceBand>
                <div>
                  <p>Starting at</p>
                  <strong>₹{product.startingAt}</strong>
                  <span>per {product.unit} · ex-works</span>
                </div>
                <div>
                  <p>Minimum order</p>
                  <strong>{product.moq.split(' ')[0]}</strong>
                  <span>{product.moq.split(' ').slice(1).join(' ')}</span>
                </div>
                <div>
                  <p>Lead time</p>
                  <strong>{product.turnaround.split(' ')[0]}</strong>
                  <span>{product.turnaround.split(' ').slice(1).join(' ')}</span>
                </div>
              </PriceBand>

              <Actions>
                <Cta href={`/request-a-quote?product=${encodeURIComponent(product.slug)}`} variant="primary" size="lg">
                  Request a quote <ArrowRight size={15} />
                </Cta>
                {whatsapp.enabled ? (
                  <Cta href={whatsappHref} variant="outline" size="lg" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={15} /> Ask on WhatsApp
                  </Cta>
                ) : null}
              </Actions>

              <PromiseRow>
                <span>
                  <Check size={12} /> Free structural prototype for qualified projects
                </span>
                <span>
                  <ShieldCheck size={12} /> FSC-certified board
                </span>
                <span>
                  <Factory size={12} /> Made in our own plants
                </span>
              </PromiseRow>
            </div>
          </DetailGrid>
        </Container>
      </DetailBand>

      <Section>
        <Container>
          <SectionHead
            kicker="Engineered detail"
            title="What is designed into this format."
            lede="Every element below can be tuned to your product, courier tier and shelf environment."
            action={
              <button
                type="button"
                onClick={downloadSpecs}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  border: `1px solid ${colors.line}`,
                  background: '#fff',
                  borderRadius: radii.sm,
                  padding: '9px 14px',
                  fontFamily: fonts.sans,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: colors.ink,
                }}
              >
                <Download size={13} /> Download specs
              </button>
            }
            flush
          />
          <div style={{ height: 32 }} />
          <Grid $cols={4} $colsLg={2} $gap="14px">
            {product.features.map((feature) => (
              <FeatureCard key={feature.title}>
                <IconBadge>
                  <SiteIcon name={feature.icon} size={19} />
                </IconBadge>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section $tone="white" $tight>
        <Container>
          <SpecsLayout>
            <div>
              <SectionHead kicker="Specification" title="Technical summary." flush />
              <div style={{ height: 24 }} />
              <SpecList>
                {product.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </SpecList>
            </div>
            <div>
              <SideCard>
                <h3>Typical applications</h3>
                <ApplicationList>
                  {product.applications.map((application) => (
                    <Pill key={application}>{application}</Pill>
                  ))}
                </ApplicationList>
              </SideCard>

              <SupportCard>
                <h3>Not sure this is the right format?</h3>
                <p>
                  Send us your product dimensions and channel. We will recommend the structure and run a drop
                  test before you commit to tooling.
                </p>
                <div>
                  <Cta href="/contact" variant="light" size="sm">
                    Talk to a packaging engineer
                  </Cta>
                </div>
              </SupportCard>
            </div>
          </SpecsLayout>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section>
          <Container>
            <SectionHead
              kicker="Related formats"
              title="Often specified together."
              action={
                <ArrowLink href="/products">
                  All products <ArrowRight size={13} />
                </ArrowLink>
              }
            />
            <Grid $cols={3} $colsLg={2} $gap="18px">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '92px minmax(0, 1fr)',
                    gap: 14,
                    alignItems: 'center',
                    padding: 12,
                    border: `1px solid ${colors.line}`,
                    borderRadius: radii.lg,
                    background: '#fff',
                    boxShadow: shadows.xs,
                  }}
                >
                  <div style={{ position: 'relative', width: 92, height: 82, borderRadius: radii.sm, overflow: 'hidden' }}>
                    <Image src={item.image} alt={item.imageAlt} fill sizes="92px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: colors.copperDeep }}>
                      {item.category}
                    </p>
                    <h3 style={{ marginTop: 4, fontFamily: fonts.sans, fontSize: 13, fontWeight: 700, letterSpacing: 0, color: colors.ink }}>
                      {item.name}
                    </h3>
                    <p style={{ marginTop: 3, fontSize: 10.5, color: colors.muted }}>
                      From ₹{item.startingAt} / {item.unit}
                    </p>
                  </div>
                </Link>
              ))}
            </Grid>
          </Container>
        </Section>
      ) : null}

      <Section $tone="paper" $tight>
        <Container>
          <CTABand>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Pill $light>Quote in one business day</Pill>
              <h2 style={{ marginTop: 14 }}>Get {product.name.toLowerCase()} priced for your volume.</h2>
              <p>Share dimensions, print expectations and annual volume. We will return a costed structure.</p>
            </div>
            <BandActions>
              <Cta href={`/request-a-quote?product=${encodeURIComponent(product.slug)}`} variant="copper" size="lg">
                Start your RFQ <ArrowUpRight size={15} />
              </Cta>
            </BandActions>
          </CTABand>
        </Container>
      </Section>
    </>
  );
}
