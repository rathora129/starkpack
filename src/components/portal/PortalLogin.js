'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileCheck2,
  FlaskConical,
  LockKeyhole,
  ShieldAlert,
  Sparkles,
  Truck,
} from 'lucide-react';
import { PORTAL_SESSION_KEY, portalDemoAccess } from '@/data/portal';
import { notify } from '@/store/useUiStore';
import { colors, fonts, radii, shadows } from '@/lib/theme';
import { Button, StatusChip } from '@/components/ui/primitives';
import { TextField, FormActions } from '@/components/ui/FormFields';

const loginValidation = Yup.object({
  email: Yup.string().trim().email('Enter a valid email').required('Enter the demo email'),
  password: Yup.string().required('Enter the demo password'),
});

const BENEFITS = [
  { icon: FileCheck2, title: 'Quotes and approvals in one place', body: 'Accept a quotation, approve artwork and request changes with a full audit trail.' },
  { icon: Truck, title: 'Live production tracking', body: 'Follow a job from prepress to dispatch without emailing your account manager.' },
  { icon: Building2, title: 'Invoices and documents', body: 'Statements, GST invoices and compliance documents download in a click.' },
];

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  background: ${colors.cream};
  font-family: ${fonts.sans};
  color: ${colors.ink};

  @media (max-width: 940px) {
    grid-template-columns: 1fr;
  }
`;

const Aside = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  padding: 44px clamp(28px, 5vw, 64px);
  overflow: hidden;
  background:
    radial-gradient(760px 420px at 88% -12%, rgba(184, 115, 51, 0.34) 0%, rgba(184, 115, 51, 0) 62%),
    linear-gradient(150deg, #0B2A22 0%, #17493B 58%, #1E5A49 100%);
  color: #F6F2E8;

  @media (max-width: 940px) {
    padding: 30px 24px 34px;
    gap: 26px;
  }
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(150deg, #D9A06A 0%, ${colors.copper} 100%);
  color: #23150A;
  font-family: ${fonts.display};
  font-size: 17px;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
`;

const BrandName = styled.div`
  small {
    display: block;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: rgba(246, 242, 232, 0.6);
  }

  strong {
    display: block;
    font-family: ${fonts.display};
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: #FBF8F2;
  }
`;

const AsideBody = styled.div`
  max-width: 520px;
`;

const Kicker = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid rgba(217, 160, 106, 0.35);
  background: rgba(217, 160, 106, 0.12);
  color: ${colors.copperSoft};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 18px;
`;

const Headline = styled.h1`
  font-family: ${fonts.display};
  font-size: clamp(30px, 3.4vw, 44px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.015em;
  color: #FBF8F2;

  em {
    font-style: italic;
    color: ${colors.copperSoft};
  }
`;

const Subline = styled.p`
  margin-top: 14px;
  max-width: 44ch;
  font-size: 13px;
  line-height: 1.65;
  color: rgba(246, 242, 232, 0.72);
`;

const BenefitList = styled.ul`
  display: grid;
  gap: 14px;
  margin-top: 30px;
  padding: 0;
  list-style: none;
`;

const Benefit = styled.li`
  display: flex;
  gap: 12px;
  align-items: flex-start;

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: #FBF8F2;
  }

  p {
    margin-top: 3px;
    font-size: 11.5px;
    line-height: 1.55;
    color: rgba(246, 242, 232, 0.62);
  }
`;

const BenefitIcon = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(246, 242, 232, 0.09);
  border: 1px solid rgba(246, 242, 232, 0.14);
  color: ${colors.copperSoft};
`;

const AsideFoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 18px;
  font-size: 10.5px;
  color: rgba(246, 242, 232, 0.5);
`;

const Panel = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 44px clamp(20px, 4vw, 56px);
  background:
    radial-gradient(640px 320px at 100% 0%, #FFFDF8 0%, rgba(255, 253, 248, 0) 70%),
    ${colors.cream};

  @media (max-width: 940px) {
    padding: 26px 16px 48px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 424px;
  padding: 26px;
  border-radius: ${radii.lg};
  border: 1px solid ${colors.line};
  background: ${colors.surface};
  box-shadow: ${shadows.lift};
  position: relative;

  @media (max-width: 940px) {
    max-width: 520px;
  }
`;

const DemoRibbon = styled.div`
  position: absolute;
  top: -12px;
  left: 26px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: ${colors.copper};
  color: #fff;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  box-shadow: 0 8px 18px -10px rgba(156, 94, 39, 0.9);
`;

const CardHead = styled.div`
  margin: 8px 0 20px;

  h2 {
    font-family: ${fonts.display};
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  p {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.6;
    color: ${colors.muted};
  }
`;

const DemoBox = styled.div`
  border: 1px dashed ${colors.copperSoft};
  border-radius: ${radii.sm};
  background: ${colors.copperWash};
  padding: 12px 13px;
  margin-bottom: 18px;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  header strong {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
  }
`;

const CredentialRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  font-size: 11.5px;

  span {
    color: ${colors.copperDeep};
    font-weight: 600;
  }

  code {
    font-family: ${fonts.mono};
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(184, 115, 51, 0.22);
    border-radius: 5px;
    padding: 2px 7px;
    word-break: break-all;
    text-align: right;
  }
`;

const Notice = styled.div`
  display: flex;
  gap: 9px;
  align-items: flex-start;
  margin-top: 16px;
  padding: 11px 12px;
  border-radius: ${radii.sm};
  background: ${colors.mist};
  border: 1px solid ${colors.lineSoft};
  font-size: 10.5px;
  line-height: 1.55;
  color: ${colors.muted};

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
    color: ${colors.warning};
  }
`;

const FormError = styled.p`
  margin-bottom: 12px;
  padding: 9px 11px;
  border-radius: 7px;
  background: ${colors.dangerBg};
  border: 1px solid rgba(176, 71, 47, 0.25);
  color: ${colors.danger};
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.5;
`;

const FootLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid ${colors.lineSoft};

  a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.forest};

    &:hover {
      color: ${colors.copperDeep};
    }
  }
`;

export default function PortalLogin({ onSignedIn }) {
  const [formError, setFormError] = useState('');
  const handleSubmit = (values, helpers) => {
    const email = values.email.trim().toLowerCase();
    const matchesEmail = email === portalDemoAccess.email.toLowerCase();
    const matchesPassword = values.password === portalDemoAccess.password;

    if (!matchesEmail || !matchesPassword) {
      setFormError(
        'These credentials do not match the demo account. Use the pre-filled email and password, or reset them below.'
      );
      helpers.setSubmitting(false);
      return;
    }

    setFormError('');
    try {
      window.sessionStorage.setItem(
        PORTAL_SESSION_KEY,
        JSON.stringify({ email: portalDemoAccess.email, company: 'ABC Foods Pvt Ltd', at: new Date().toISOString() })
      );
    } catch {
      /* sessionStorage can be blocked; the demo still opens for this page view */
    }
    notify('Demo session started', 'Signed in as ABC Foods Pvt Ltd. All data is fictional and resets on refresh.', 'success');
    helpers.setSubmitting(false);
    onSignedIn();
  };

  return (
    <Page>
      <Aside>
        <BrandRow>
          <BrandMark>S</BrandMark>
          <BrandName>
            <small>Stark Packmate</small>
            <strong>Customer Portal</strong>
          </BrandName>
        </BrandRow>

        <AsideBody>
          <Kicker>
            <Sparkles size={11} /> Fictional demo workspace
          </Kicker>
          <Headline>
            Every order, proof and invoice <em>in one calm place.</em>
          </Headline>
          <Subline>
            The same records your account team works on in CRM, production, inventory and finance — shown to
            you as the customer, without waiting for an email.
          </Subline>

          <BenefitList>
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <Benefit key={title}>
                <BenefitIcon>
                  <Icon size={15} />
                </BenefitIcon>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </Benefit>
            ))}
          </BenefitList>
        </AsideBody>

        <AsideFoot>
          <span>Demo data only</span>
          <span>No live ERP connection</span>
          <span>Resets on hard refresh</span>
        </AsideFoot>
      </Aside>

      <Panel>
        <Card>
          <DemoRibbon>
            <FlaskConical size={11} /> Demo mode
          </DemoRibbon>

          <CardHead>
            <h2>Sign in to the customer portal</h2>
            <p>
              This demo signs you in as Ritu Bansal at {portalDemoAccess.email.split('@')[1]} — no real
              authentication is performed.
            </p>
          </CardHead>

          <DemoBox>
            <header>
              <strong>
                <BadgeCheck size={12} /> Demo credentials
              </strong>
              <StatusChip $tone="warning">Prefilled</StatusChip>
            </header>
            <CredentialRow>
              <span>Email</span>
              <code>{portalDemoAccess.email}</code>
            </CredentialRow>
            <CredentialRow>
              <span>Password</span>
              <code>{portalDemoAccess.password}</code>
            </CredentialRow>
          </DemoBox>

          <Formik
            initialValues={{ email: portalDemoAccess.email, password: portalDemoAccess.password }}
            validationSchema={loginValidation}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, resetForm }) => (
              <Form noValidate>
                {formError ? <FormError role="alert">{formError}</FormError> : null}
                <TextField name="email" label="Work email" type="email" autoComplete="username" required />
                <div style={{ height: 12 }} />
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  required
                  hint={portalDemoAccess.label}
                />

                <FormActions style={{ justifyContent: 'space-between' }}>
                  <Button
                    type="button"
                    $variant="ghost"
                    $size="sm"
                    onClick={() => {
                      resetForm({ values: { email: portalDemoAccess.email, password: portalDemoAccess.password } });
                      setFormError('');
                      notify('Demo credentials restored', 'The fields are pre-filled with the demo account.', 'info');
                    }}
                  >
                    Reset demo login
                  </Button>
                  <Button type="submit" $variant="primary" $size="md" disabled={isSubmitting}>
                    <LockKeyhole size={14} /> Open portal <ArrowRight size={14} />
                  </Button>
                </FormActions>
              </Form>
            )}
          </Formik>

          <Notice>
            <ShieldAlert size={13} />
            <span>{portalDemoAccess.notice}</span>
          </Notice>

          <FootLinks>
            <Link href="/">← Back to website</Link>
            <Link href="/admin">Admin workspace</Link>
          </FootLinks>
        </Card>
      </Panel>
    </Page>
  );
}
