'use client';

import { createContext, useContext, useMemo } from 'react';
import Image from 'next/image';
import { useDemoStore } from '@/store/useDemoStore';
import {
  Container,
  Section,
  Kicker,
  SectionTitle,
  Lede,
  Cta,
  ImageFrame,
} from '@/components/site/ui';

const FlowContext = createContext(null);

const toneFor = (background) => {
  const value = String(background || '').toLowerCase();
  if (value === 'white' || value === 'surface') return 'white';
  if (value === 'paper') return 'paper';
  if (value === 'forest' || value === 'dark' || value === 'ink') return 'forest';
  if (value === 'copper') return 'copper';
  return 'cream';
};

function GenericSection({ section }) {
  const tone = toneFor(section.background);
  const light = tone === 'forest';
  return (
    <Section $tone={tone} id={section.key}>
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: section.image ? 'minmax(0, 1.05fr) minmax(0, 0.95fr)' : 'minmax(0, 1fr)',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div>
            <Kicker $light={light}>{section.kicker || section.type || 'Stark Packmate'}</Kicker>
            <SectionTitle $light={light}>{section.title}</SectionTitle>
            {section.body ? <Lede $light={light}>{section.body}</Lede> : null}
            {section.ctaLabel ? (
              <div style={{ marginTop: 22 }}>
                <Cta
                  href={section.ctaHref || '/contact'}
                  variant={light ? 'ghostLight' : 'primary'}
                  size="md"
                >
                  {section.ctaLabel}
                </Cta>
              </div>
            ) : null}
          </div>
          {section.image ? (
            <ImageFrame>
              <Image
                src={section.image}
                alt={section.title || 'Stark Packmate packaging'}
                fill
                sizes="(max-width: 900px) 92vw, 44vw"
              />
            </ImageFrame>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

export function CmsPageFlow({ slug, knownKeys = [], children }) {
  const pages = useDemoStore((state) => state.cmsPages);

  const flow = useMemo(() => {
    const page = pages.find((item) => item.slug === slug) || null;
    const sections = [...(page?.sections || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const slots = new Map();
    sections.forEach((item, index) => {
      slots.set(item.key, { index: index + 1, enabled: item.enabled !== false, section: item });
    });
    const extras = sections.filter(
      (item) => item.enabled !== false && item.key && !knownKeys.includes(item.key)
    );
    return { slots, extras };
  }, [pages, slug, knownKeys]);

  return (
    <FlowContext.Provider value={flow}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
        {flow.extras.map((section) => (
          <div
            key={section.id || section.key}
            style={{ order: flow.slots.get(section.key)?.index || 99, minWidth: 0 }}
          >
            <GenericSection section={section} />
          </div>
        ))}
      </div>
    </FlowContext.Provider>
  );
}

export function CmsSection({ sectionKey, fallbackOrder = 99, children }) {
  const flow = useContext(FlowContext);
  const slot = flow?.slots.get(sectionKey);

  if (slot && !slot.enabled) return null;

  return (
    <div style={{ order: slot?.index || fallbackOrder, minWidth: 0 }} data-cms-section={sectionKey}>
      {children}
    </div>
  );
}
