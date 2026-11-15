'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import LandingPageView from '@/components/site/LandingPageView';
import { Container, PageIntro, IntroTitle, IntroLede, Cta } from '@/components/site/ui';

export default function PublicLandingPage() {
  const params = useParams();
  const slug = `/lp/${params.slug}`;
  const pages = useDemoStore((state) => state.landingPages);
  const trackView = useDemoStore((state) => state.trackLandingView);
  const submitForm = useDemoStore((state) => state.submitLandingForm);
  const tracked = useRef(null);

  const page = pages.find((entry) => entry.slug === slug && entry.status === 'Published');

  useEffect(() => {
    if (page && tracked.current !== page.id) {
      tracked.current = page.id;
      trackView(page.id);
    }
  }, [page, trackView]);

  if (!page) {
    return (
      <PageIntro>
        <Container>
          <IntroTitle>This campaign is not live.</IntroTitle>
          <IntroLede>
            The landing page you are looking for is paused, archived or does not exist. Explore the
            product range or request a quote instead.
          </IntroLede>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Cta href="/request-a-quote" variant="primary" size="md">
              Request a quote <ArrowRight size={14} />
            </Cta>
            <Cta href="/products" variant="outline" size="md">
              Browse products
            </Cta>
          </div>
        </Container>
      </PageIntro>
    );
  }

  return (
    <LandingPageView
      page={page}
      onSubmit={(values) => submitForm(page.id, values)}
    />
  );
}
