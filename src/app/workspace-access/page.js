'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Crown,
  Factory,
  LockKeyhole,
  Shield,
  ShieldAlert,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { demoRoleById, demoRoles } from '@/lib/nav';
import { PORTAL_SESSION_KEY } from '@/data/portal';
import { useAuthStore } from '@/store/useAuthStore';
import { notify } from '@/store/useUiStore';
import { colors, fonts, radii, shadows } from '@/lib/theme';

const ROLE_ICONS = {
  owner: Crown,
  admin: Shield,
  'sales-manager': BriefcaseBusiness,
  'sales-executive': UserRound,
  'production-manager': Factory,
  'inventory-manager': Boxes,
  accounts: Wallet,
  hr: Users,
  customer: Building2,
};

const validation = Yup.object({
  email: Yup.string().trim().email('Enter a valid email').required('Enter the demo email'),
  password: Yup.string().required('Enter the demo password'),
});

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  background: ${colors.cream};
  color: ${colors.ink};
  font-family: ${fonts.sans};

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Aside = styled.section`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  padding: 40px clamp(26px, 4.4vw, 58px);
  color: #F6F6FF;
  background:
    radial-gradient(680px 380px at 92% -10%, rgba(237, 28, 36, 0.32) 0%, rgba(237, 28, 36, 0) 64%),
    radial-gradient(520px 380px at 8% 104%, rgba(0, 167, 233, 0.28) 0%, rgba(0, 167, 233, 0) 66%),
    linear-gradient(155deg, #1B1464 0%, #120D45 58%, #0D0A33 100%);

  &::after {
    content: '';
    position: absolute;
    right: -150px;
    bottom: -170px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }

  @media (max-width: 980px) {
    padding: 28px 22px 32px;
    gap: 22px;
  }
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  position: relative;
  z-index: 1;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(246, 246, 255, 0.62);
  transition: color 140ms ease;

  &:hover {
    color: #fff;
  }
`;

const AsideBody = styled.div`
  position: relative;
  z-index: 1;
  max-width: 470px;
`;

const Kicker = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border-radius: ${radii.pill};
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #C9C6F5;
  margin-bottom: 18px;
`;

const Headline = styled.h1`
  font-family: ${fonts.display};
  font-size: clamp(30px, 3.4vw, 46px);
  font-weight: 500;
  line-height: 1.06;
  letter-spacing: -0.02em;
  color: #FBFBFE;

  em {
    font-style: italic;
    color: #F06D77;
  }
`;

const Lede = styled.p`
  margin-top: 14px;
  max-width: 420px;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(246, 246, 255, 0.68);
`;

const RoleList = styled.ul`
  margin-top: 26px;
  display: grid;
  gap: 8px;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: rgba(246, 246, 255, 0.6);
  }

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #00A7E9;
    flex: 0 0 auto;
  }
`;

const AsideFoot = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 6px;
  font-size: 10px;
  line-height: 1.55;
  color: rgba(246, 246, 255, 0.42);
  max-width: 430px;

  strong {
    color: rgba(246, 246, 255, 0.72);
    font-weight: 700;
  }
`;

const Panel = styled.section`
  display: grid;
  place-items: center;
  padding: 44px clamp(20px, 4vw, 56px);
  background:
    radial-gradient(600px 360px at 100% 0%, rgba(27, 20, 100, 0.06), transparent 70%),
    ${colors.cream};

  @media (max-width: 980px) {
    padding: 28px 16px 40px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 560px;
  background: ${colors.surface};
  border: 1px solid ${colors.line};
  border-radius: ${radii.xl};
  box-shadow: ${shadows.lift};
  padding: 30px clamp(20px, 3vw, 34px) 28px;

  @media (max-width: 560px) {
    border-radius: ${radii.lg};
    padding: 24px 18px;
  }
`;

const CardHead = styled.div`
  h2 {
    font-family: ${fonts.display};
    font-size: 26px;
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.6;
    color: ${colors.muted};
  }
`;

const Legend = styled.p`
  margin-top: 22px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.faint};
`;

const RoleGrid = styled.div`
  margin-top: 9px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;

  @media (max-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const RoleCard = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 40px;
  padding: 7px 9px;
  border-radius: ${radii.sm};
  border: 1px solid ${({ $active }) => ($active ? colors.forest : colors.line)};
  background: ${({ $active }) => ($active ? 'rgba(27, 20, 100, 0.055)' : colors.surface)};
  color: ${({ $active }) => ($active ? colors.forest : colors.muted)};
  font-size: 10px;
  font-weight: 700;
  line-height: 1.25;
  text-align: left;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;

  svg {
    flex: 0 0 auto;
    color: ${({ $active }) => ($active ? colors.copper : colors.faint)};
  }

  &:hover {
    border-color: ${({ $active }) => ($active ? colors.forest : '#C9CBE0')};
    background: ${({ $active }) => ($active ? 'rgba(27, 20, 100, 0.055)' : '#FAFAFD')};
  }
`;

const DemoBox = styled.div`
  margin-top: 18px;
  padding: 12px 13px;
  border-radius: ${radii.md};
  border: 1px dashed #D6D8E8;
  background: #F8F8FC;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
  }

  strong {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${colors.muted};
  }

  span {
    font-size: 9.5px;
    color: ${colors.faint};
  }
`;

const CredentialRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  font-size: 11px;

  & + & {
    border-top: 1px solid #EDEEF6;
  }

  span {
    color: ${colors.muted};
    font-size: 10px;
  }

  code {
    font-family: ${fonts.mono};
    font-size: 10.5px;
    color: ${colors.ink};
    background: #fff;
    border: 1px solid ${colors.lineSoft};
    border-radius: 4px;
    padding: 1px 5px;
    overflow-wrap: anywhere;
    text-align: right;
  }
`;

const Fields = styled.div`
  margin-top: 18px;
  display: grid;
  gap: 12px;
`;

const FieldWrap = styled.label`
  display: grid;
  gap: 5px;

  > span {
    font-size: 10px;
    font-weight: 700;
    color: ${colors.inkSoft};
  }

  input {
    width: 100%;
    height: 40px;
    padding: 0 11px;
    border-radius: ${radii.sm};
    border: 1px solid ${({ $error }) => ($error ? colors.danger : colors.line)};
    background: ${colors.surface};
    color: ${colors.ink};
    font-family: ${fonts.sans};
    font-size: 12px;
    transition: border-color 140ms ease, box-shadow 140ms ease;

    &:focus {
      outline: none;
      border-color: ${colors.forest};
      box-shadow: 0 0 0 3px rgba(27, 20, 100, 0.1);
    }

    &:disabled {
      background: ${colors.mist};
      color: ${colors.muted};
    }
  }

  em {
    font-style: normal;
    font-size: 10px;
    color: ${colors.danger};
  }
`;

const Submit = styled.button`
  margin-top: 16px;
  width: 100%;
  height: 43px;
  border: 0;
  border-radius: ${radii.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${colors.forest};
  color: #fff;
  font-family: ${fonts.sans};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: background 140ms ease, transform 140ms ease;

  &:hover:not(:disabled) {
    background: ${colors.forestDeep};
  }

  &:disabled {
    opacity: 0.62;
    cursor: not-allowed;
  }
`;

const FormError = styled.p`
  margin-top: 12px;
  padding: 9px 11px;
  border-radius: ${radii.sm};
  background: ${colors.dangerBg};
  border: 1px solid #F3C9CE;
  color: ${colors.danger};
  font-size: 10.5px;
  line-height: 1.5;
`;

const Notice = styled.p`
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 9.5px;
  line-height: 1.55;
  color: ${colors.faint};

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
    color: ${colors.warning};
  }
`;

const FooterLinks = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 10px;
  color: ${colors.faint};

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
    color: ${colors.muted};

    &:hover {
      color: ${colors.ink};
    }
  }
`;

export default function WorkspaceAccessPage() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [roleId, setRoleId] = useState('owner');
  const [formError, setFormError] = useState('');
  const role = demoRoleById(roleId);

  const chooseRole = (next) => {
    setFormError('');
    setRoleId(next);
  };

  const handleSubmit = (values, helpers) => {
    const email = values.email.trim().toLowerCase();
    if (email !== role.email.toLowerCase() || values.password !== role.password) {
      setFormError(
        `These credentials do not match the ${role.label} demo account. Use the pre-filled demo credentials or reselect the role.`
      );
      helpers.setSubmitting(false);
      return;
    }
    signIn(role.id);
    if (role.id === 'customer') {
      try {
        window.sessionStorage.setItem(
          PORTAL_SESSION_KEY,
          JSON.stringify({ email: role.email, company: 'ABC Foods Pvt Ltd', at: new Date().toISOString() })
        );
      } catch {
        /* storage can be blocked; the portal demo still opens for this page view */
      }
    }
    notify('Demo session started', `Signed in as ${role.label} — ${role.hint.toLowerCase()}.`, 'success');
    router.replace(role.home);
  };

  return (
    <Page>
      <Aside>
        <BrandRow>
          <Logo inverse size="md" />
          <BackLink href="/">
            <ArrowLeft size={11} /> Website
          </BackLink>
        </BrandRow>

        <AsideBody>
          <Kicker>
            <LockKeyhole size={10} /> Private demo route
          </Kicker>
          <Headline>
            The packaging workspace, <em>role by role.</em>
          </Headline>
          <Lede>
            Choose a demo role to explore the Stark Packmate operations workspace. Each role opens the
            modules and actions it would use in a real packaging business.
          </Lede>
          <RoleList>
            <li><i /> Nine roles: owner, admin, sales, production, inventory, accounts, HR and customer</li>
            <li><i /> Shared demo data across CRM, quotations, orders, production, finance and the portal</li>
            <li><i /> Reset the demo dataset any time from the workspace bar</li>
          </RoleList>
        </AsideBody>

        <AsideFoot>
          <span><strong>Demo only.</strong> This route is not linked from the public website. Role checks run in the browser and are not production security.</span>
          <span>Stark Packmate Private Limited · Demo environment v1.0</span>
        </AsideFoot>
      </Aside>

      <Panel>
        <Card>
          <CardHead>
            <h2>Sign in to the demo workspace</h2>
            <p>Select a role, then use the pre-filled demo credentials. No real authentication is performed.</p>
          </CardHead>

          <Legend id="role-label">Choose a demo role</Legend>
          <RoleGrid role="group" aria-labelledby="role-label">
            {demoRoles.map((entry) => {
              const Icon = ROLE_ICONS[entry.id] || UserRound;
              return (
                <RoleCard
                  key={entry.id}
                  type="button"
                  $active={entry.id === roleId}
                  aria-pressed={entry.id === roleId}
                  onClick={() => chooseRole(entry.id)}
                >
                  <Icon size={14} /> {entry.label}
                </RoleCard>
              );
            })}
          </RoleGrid>

          <DemoBox>
            <header>
              <strong>{role.label} demo credentials</strong>
              <span>{role.hint}</span>
            </header>
            <CredentialRow>
              <span>Email</span>
              <code>{role.email}</code>
            </CredentialRow>
            <CredentialRow>
              <span>Password</span>
              <code>{role.password}</code>
            </CredentialRow>
          </DemoBox>

          <Formik
            initialValues={{ email: role.email, password: role.password }}
            enableReinitialize
            validationSchema={validation}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form noValidate>
                <Fields>
                  <FieldWrap $error={touched.email && errors.email}>
                    <span>Email</span>
                    <Field
                      name="email"
                      type="email"
                      autoComplete="username"
                      spellCheck={false}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(touched.email && errors.email)}
                    />
                    {touched.email && errors.email ? <em>{errors.email}</em> : null}
                  </FieldWrap>
                  <FieldWrap $error={touched.password && errors.password}>
                    <span>Password</span>
                    <Field
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(touched.password && errors.password)}
                    />
                    {touched.password && errors.password ? <em>{errors.password}</em> : null}
                  </FieldWrap>
                </Fields>

                {formError ? <FormError role="alert">{formError}</FormError> : null}

                <Submit type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in…' : `Sign in as ${role.label}`} <ArrowRight size={14} />
                </Submit>
              </Form>
            )}
          </Formik>

          <Notice>
            <ShieldAlert size={12} />
            <span>
              Demo data is fictional, stored in browser memory and resets on a hard refresh. Do not enter
              real customer, employee or financial information.
            </span>
          </Notice>

          <FooterLinks>
            <span>Need the customer view? Choose Customer above.</span>
            <Link href="/">Back to public website <ArrowRight size={10} /></Link>
          </FooterLinks>
        </Card>
      </Panel>
    </Page>
  );
}
