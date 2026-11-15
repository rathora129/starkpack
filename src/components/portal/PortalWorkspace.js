'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  Package,
  Palette,
  Receipt,
  Building2,
  LifeBuoy,
  Bell,
  LogOut,
  ShieldCheck,
  ArrowRight,
  Check,
  Clock,
  Download,
  Truck,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Landmark,
  RefreshCw,
  AlertCircle,
  Send,
  Factory,
  Boxes,
  Wallet,
  TrendingUp,
  ClipboardCheck,
  Eye,
  Pencil,
  FlaskConical,
  CheckCircle2,
  Circle,
  UploadCloud,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import { notify } from '@/store/useUiStore';
import {
  ABC_CAMPAIGN_ID,
  ABC_COMPANY,
  ABC_CUSTOMER_ID,
  ABC_PORTAL_HIGHLIGHTS,
  abcPortalProfile,
  portalDemoAccess,
} from '@/data/portal';
import {
  downloadCSV,
  formatCompactINR,
  formatDate,
  formatDateTime,
  formatINR,
  formatNumber,
  initialsOf,
  statusTone,
  timeAgo,
} from '@/lib/format';
import { colors, fonts, radii, shadows, transitions } from '@/lib/theme';
import { Button, StatusChip, ProgressTrack, ProgressFill, Divider, Avatar } from '@/components/ui/primitives';
import {
  AppModal,
  Drawer,
  ConfirmDialog,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineMeta,
} from '@/components/ui/Overlay';
import { TextField, TextAreaField, SelectField, FormActions, FormGrid } from '@/components/ui/FormFields';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'rfqs', label: 'RFQs', icon: FilePlus2 },
  { id: 'quotations', label: 'Quotations', icon: FileText },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'artwork', label: 'Artwork proofs', icon: Palette },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'profile', label: 'Company profile', icon: Building2 },
  { id: 'support', label: 'Support', icon: LifeBuoy },
];

const ORDER_STAGES = ['Confirmed', 'Prepress', 'In production', 'QC', 'Dispatched', 'Delivered'];

const rfqValidation = Yup.object({
  product: Yup.string().trim().required('Tell us what you need packaged'),
  quantity: Yup.string().trim().required('Add an approximate quantity'),
  message: Yup.string().trim().min(15, 'A little more detail helps the sales team quote accurately').required('Add a short brief'),
  budget: Yup.number().typeError('Use numbers only').min(0, 'Cannot be negative'),
});

const supportValidation = Yup.object({
  subject: Yup.string().trim().min(6, 'Add a clearer subject').required('Add a subject'),
  message: Yup.string().trim().min(15, 'Share a little more detail').required('Add a message'),
});

const profileValidation = Yup.object({
  company: Yup.string().trim().required('Company name is required'),
  contactName: Yup.string().trim().required('Contact name is required'),
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().trim().required('Phone is required'),
});

const money = (value) => formatINR(Number(value) || 0);

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function orderStageIndex(order) {
  if (!order) return -1;
  return ORDER_STAGES.indexOf(order.status);
}

function proofAwaiting(artwork) {
  if (!artwork) return false;
  if (artwork.proofStatus === 'Approved' || artwork.status === 'Approved') return false;
  if (artwork.status === 'Awaiting file') return false;
  return artwork.proofStatus === 'Sent' || artwork.status === 'In review' || artwork.proofStatus === 'Rejected';
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const PortalRoot = styled.div`
  min-height: ${({ $embedded }) => ($embedded ? '0' : '100vh')};
  background: ${({ $embedded }) =>
    $embedded ? 'transparent' : `radial-gradient(1200px 600px at 12% -10%, #FFFDF7 0%, ${colors.cream} 48%, ${colors.mist} 100%)`};
  color: ${colors.ink};
  font-family: ${fonts.sans};
`;

const PortalTop = styled.header`
  position: ${({ $embedded }) => ($embedded ? 'static' : 'sticky')};
  top: 0;
  z-index: 40;
  background: ${({ $embedded }) => ($embedded ? colors.cream : `linear-gradient(120deg, #123229 0%, ${colors.forest} 68%, #1C5243 100%)`)};
  color: ${({ $embedded }) => ($embedded ? colors.ink : '#F9F6EE')};
  border-bottom: 1px solid ${({ $embedded }) => ($embedded ? colors.line : 'rgba(255,255,255,0.08)')};
  box-shadow: ${({ $embedded }) => ($embedded ? 'none' : '0 10px 30px rgba(9, 27, 22, 0.16)')};
`;

const TopInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 760px) {
    padding: 10px 14px;
    gap: 10px;
  }
`;

const BrandMark = styled.div`
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: ${({ $embedded }) => ($embedded ? colors.forest : colors.copper)};
  color: #fff;
  font-family: ${fonts.display};
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: ${({ $embedded }) => ($embedded ? 'none' : '0 6px 16px rgba(0,0,0,0.18)')};
`;

const BrandText = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    opacity: ${({ $embedded }) => ($embedded ? 0.66 : 0.62)};
    color: ${({ $embedded }) => ($embedded ? colors.muted : 'inherit')};
  }

  @media (max-width: 640px) {
    strong {
      font-size: 11px;
    }
  }
`;

const TopDivider = styled.span`
  width: 1px;
  height: 26px;
  background: ${({ $embedded }) => ($embedded ? colors.line : 'rgba(255,255,255,0.18)')};

  @media (max-width: 860px) {
    display: none;
  }
`;

const TopSpacer = styled.div`
  flex: 1;
`;

const DemoChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: ${radii.pill};
  border: 1px solid ${({ $embedded }) => ($embedded ? '#E7C9A8' : 'rgba(217, 160, 106, 0.5)')};
  background: ${({ $embedded }) => ($embedded ? '#FBF1E4' : 'rgba(184, 115, 51, 0.18)')};
  color: ${({ $embedded }) => ($embedded ? colors.copperDeep : colors.copperSoft)};
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;

  @media (max-width: 640px) {
    display: none;
  }
`;

const IconGhost = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  border: 1px solid ${({ $embedded }) => ($embedded ? colors.line : 'rgba(255,255,255,0.18)')};
  background: ${({ $embedded }) => ($embedded ? '#fff' : 'rgba(255,255,255,0.08)')};
  color: ${({ $embedded }) => ($embedded ? colors.inkSoft : '#F9F6EE')};
  transition: background ${transitions.fast}, transform ${transitions.fast};

  &:hover {
    background: ${({ $embedded }) => ($embedded ? colors.paper : 'rgba(255,255,255,0.16)')};
    transform: translateY(-1px);
  }
`;

const Unread = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: ${colors.copper};
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  display: grid;
  place-items: center;
  border: 2px solid ${({ $embedded }) => ($embedded ? colors.cream : colors.forest)};
`;

const AccountChip = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 8px 4px 4px;
  border-radius: 999px;
  border: 1px solid ${({ $embedded }) => ($embedded ? colors.line : 'rgba(255,255,255,0.16)')};
  background: ${({ $embedded }) => ($embedded ? '#fff' : 'rgba(255,255,255,0.07)')};
  min-width: 0;

  strong {
    display: block;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  span {
    display: block;
    font-size: 9.5px;
    color: ${({ $embedded }) => ($embedded ? colors.muted : 'rgba(249,246,238,0.66)')};
    white-space: nowrap;
  }

  @media (max-width: 760px) {
    div {
      display: none;
    }
  }
`;

const SignOut = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.18);
  background: transparent;
  color: rgba(249, 246, 238, 0.86);
  font-size: 11px;
  font-weight: 700;
  transition: background ${transitions.fast};

  &:hover {
    background: rgba(255,255,255,0.12);
  }

  @media (max-width: 900px) {
    span {
      display: none;
    }
  }
`;

const DemoBanner = styled.div`
  background: linear-gradient(90deg, #F7E8D4 0%, #FBF3E7 60%, #F7E8D4 100%);
  border-bottom: 1px solid #EBD5B7;
  color: #6E451E;
`;

const DemoInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 8px 24px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 10.5px;
  line-height: 1.5;

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
  }

  strong {
    font-weight: 800;
  }

  @media (max-width: 760px) {
    padding: 8px 14px;
  }
`;

const TabBarWrap = styled.nav`
  background: ${({ $embedded }) => ($embedded ? colors.cream : 'rgba(251, 248, 242, 0.96)')};
  border-bottom: 1px solid ${colors.line};
  backdrop-filter: blur(10px);
`;

const TabBar = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 3px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 760px) {
    padding: 0 10px;
  }
`;

const TabButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 13px 13px 12px;
  border: 0;
  background: transparent;
  color: ${({ $active }) => ($active ? colors.forest : colors.muted)};
  font-family: ${fonts.sans};
  font-size: 11.5px;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  white-space: nowrap;
  transition: color ${transitions.fast};

  &::after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: -1px;
    height: 2px;
    border-radius: 2px;
    background: ${({ $active }) => ($active ? colors.copper : 'transparent')};
  }

  &:hover {
    color: ${colors.forest};
  }

  svg {
    color: ${({ $active }) => ($active ? colors.copper : colors.faint)};
  }
`;

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px 24px 56px;

  @media (max-width: 760px) {
    padding: 14px 12px 42px;
  }
`;

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: ${radii.xl};
  background: linear-gradient(128deg, #12392F 0%, #0B241D 62%, #143C31 100%);
  color: #F9F6EE;
  padding: 30px 30px 26px;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
  gap: 26px;
  box-shadow: 0 18px 45px rgba(10, 32, 25, 0.2);

  &::before {
    content: '';
    position: absolute;
    right: -70px;
    top: -110px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  &::after {
    content: '';
    position: absolute;
    right: 140px;
    bottom: -180px;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(184, 115, 51, 0.28), transparent 68%);
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    padding: 24px 20px;
  }
`;

const HeroCopy = styled.div`
  position: relative;
  z-index: 1;
  min-width: 0;

  small {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${colors.copperSoft};
  }

  h1 {
    margin-top: 10px;
    font-family: ${fonts.display};
    font-size: clamp(27px, 3.5vw, 40px);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -0.02em;
    color: #FBF8F2;
  }

  p {
    margin-top: 10px;
    max-width: 600px;
    font-size: 12.5px;
    line-height: 1.65;
    color: rgba(249, 246, 238, 0.72);
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
`;

const HeroPanel = styled.div`
  position: relative;
  z-index: 1;
  align-self: stretch;
  border-radius: ${radii.lg};
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  padding: 16px;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeroPanelHead = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: rgba(249, 246, 238, 0.62);
  }
`;

const HeroMini = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const HeroMiniItem = styled.div`
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.12);
  padding: 8px 10px;

  p {
    margin: 0;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(249, 246, 238, 0.48);
  }

  strong {
    display: block;
    margin-top: 3px;
    font-size: 12px;
    font-weight: 700;
    color: #F9F6EE;
  }
`;

const HeroLink = styled.a`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: auto;
  font-size: 10.5px;
  font-weight: 700;
  color: ${colors.copperSoft};
  cursor: pointer;

  &:hover {
    color: #F3CDA4;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StatCard = styled.div`
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: #fff;
  padding: 14px 15px;
  box-shadow: ${shadows.xs};

  p {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 5px;
    font-family: ${fonts.display};
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: ${colors.muted};
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled.button`
  text-align: left;
  border: 1px solid ${({ $accent }) => ($accent ? '#E7C9A8' : colors.line)};
  border-radius: ${radii.lg};
  background: ${({ $accent }) => ($accent ? '#FFFBF4' : '#fff')};
  padding: 15px;
  box-shadow: ${shadows.xs};
  display: flex;
  gap: 12px;
  align-items: flex-start;
  transition: transform ${transitions.fast}, border-color ${transitions.fast}, box-shadow ${transitions.fast};

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $accent }) => ($accent ? colors.copper : colors.lineStrong || '#D8D2C4')};
    box-shadow: ${shadows.sm};
  }
`;

const ActionIcon = styled.span`
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: ${({ $tone }) => ($tone === 'copper' ? '#F8EBD9' : $tone === 'success' ? '#E7F2EC' : '#EEF3F6')};
  color: ${({ $tone }) => ($tone === 'copper' ? colors.copperDeep : $tone === 'success' ? colors.success : colors.info)};
`;

const ActionBody = styled.div`
  min-width: 0;
  flex: 1;

  small {
    display: block;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 3px;
    font-size: 12.5px;
    font-weight: 800;
    color: ${colors.ink};
  }

  p {
    margin-top: 3px;
    font-size: 10.5px;
    line-height: 1.5;
    color: ${colors.muted};
  }

  em {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 7px;
    font-style: normal;
    font-size: 10px;
    font-weight: 800;
    color: ${colors.copperDeep};
  }
`;

const Section = styled.section`
  margin-top: 20px;
  border: 1px solid ${colors.line};
  border-radius: ${radii.xl};
  background: #fff;
  box-shadow: ${shadows.card};
  overflow: hidden;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px 15px;
  border-bottom: 1px solid ${colors.lineSoft};
  flex-wrap: wrap;
`;

const HeadCopy = styled.div`
  min-width: 0;

  small {
    display: block;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
  }

  h2 {
    margin-top: 3px;
    font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: ${colors.ink};
  }

  p {
    margin-top: 4px;
    max-width: 720px;
    font-size: 11px;
    line-height: 1.55;
    color: ${colors.muted};
  }
`;

const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SectionBody = styled.div`
  padding: 18px 20px 20px;

  @media (max-width: 640px) {
    padding: 14px 13px 16px;
  }
`;

const WorkflowLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 9.5px;
  color: ${colors.muted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }
`;

const Phase = styled.div`
  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed ${colors.line};
  }
`;

const PhaseTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  span {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  i {
    flex: 1;
    height: 1px;
    background: ${colors.lineSoft};
  }
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 9px;
  border: 1px solid ${({ $state }) =>
    $state === 'current' ? '#E7C9A8' : $state === 'blocked' ? '#E8C8C0' : colors.lineSoft};
  background: ${({ $state }) =>
    $state === 'current' ? '#FFFBF4' : $state === 'done' ? '#F8FBF9' : $state === 'blocked' ? '#FDF6F3' : '#FDFCF9'};
`;

const StepDot = styled.span`
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 9.5px;
  font-weight: 800;
  background: ${({ $state }) =>
    $state === 'done' ? colors.success : $state === 'current' ? colors.copper : $state === 'blocked' ? colors.danger : colors.mist};
  color: ${({ $state }) => ($state === 'pending' ? colors.faint : '#fff')};
  border: ${({ $state }) => ($state === 'pending' ? `1px solid ${colors.line}` : 'none')};
`;

const StepBody = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: ${({ $state }) => ($state === 'pending' ? colors.muted : colors.ink)};
  }

  p {
    margin-top: 2px;
    font-size: 9.5px;
    line-height: 1.45;
    color: ${colors.faint};
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin-top: 3px;
    font-size: 9px;
    font-weight: 800;
    color: ${colors.copperDeep};

    &:hover {
      color: ${colors.forest};
    }
  }
`;

const StepState = styled.span`
  flex: 0 0 auto;
  margin-left: auto;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 999px;
  align-self: flex-start;
  background: ${({ $state }) =>
    $state === 'done' ? '#E7F2EC' : $state === 'current' ? '#F8EBD9' : $state === 'blocked' ? '#F7E4DF' : colors.mist};
  color: ${({ $state }) =>
    $state === 'done' ? colors.success : $state === 'current' ? colors.copperDeep : $state === 'blocked' ? colors.danger : colors.faint};
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 20px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const MiniPanel = styled.section`
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: #fff;
  box-shadow: ${shadows.xs};
  overflow: hidden;
`;

const MiniHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 13px 15px;
  border-bottom: 1px solid ${colors.lineSoft};

  strong {
    font-size: 12px;
    font-weight: 800;
    color: ${colors.ink};
  }

  span {
    font-size: 9.5px;
    color: ${colors.faint};
  }
`;

const MiniBody = styled.div`
  padding: 6px 15px 13px;
`;

const UpdateRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 0;

  & + & {
    border-top: 1px solid ${colors.lineSoft};
  }
`;

const UpdateDot = styled.span`
  width: 7px;
  height: 7px;
  margin-top: 5px;
  border-radius: 50%;
  flex: 0 0 auto;
  background: ${({ $tone }) =>
    $tone === 'finance' ? colors.success : $tone === 'artwork' ? colors.copper : $tone === 'production' ? colors.info : colors.forestSoft};
`;

const UpdateBody = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: ${colors.ink};
  }

  p {
    margin-top: 2px;
    font-size: 10px;
    line-height: 1.5;
    color: ${colors.muted};
  }

  small {
    display: block;
    margin-top: 3px;
    font-size: 9px;
    color: ${colors.faint};
  }
`;

const ListCard = styled.article`
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: #fff;
  padding: 16px;
  box-shadow: ${shadows.xs};

  & + & {
    margin-top: 11px;
  }
`;

const ListTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ListTitle = styled.div`
  min-width: 0;

  small {
    display: block;
    font-family: ${fonts.mono};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: ${colors.copperDeep};
  }

  strong {
    display: block;
    margin-top: 3px;
    font-size: 14px;
    font-weight: 800;
    color: ${colors.ink};
    line-height: 1.35;
  }

  p {
    margin-top: 3px;
    font-size: 10.5px;
    color: ${colors.muted};
    line-height: 1.5;
  }
`;

const ChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
  margin-top: 13px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Meta = styled.div`
  padding: 8px 10px;
  border-radius: 8px;
  background: ${colors.paper};
  border: 1px solid ${colors.lineSoft};

  small {
    display: block;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    font-weight: 700;
    color: ${colors.ink};
    line-height: 1.35;
  }
`;

const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-top: 13px;
  padding-top: 12px;
  border-top: 1px solid ${colors.lineSoft};
`;

const Spacer = styled.div`
  flex: 1;
`;

const LineTable = styled.div`
  margin-top: 12px;
  border: 1px solid ${colors.lineSoft};
  border-radius: 9px;
  overflow: hidden;
`;

const LineHead = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 70px 92px 100px;
  gap: 8px;
  padding: 7px 10px;
  background: ${colors.paper};
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${colors.faint};

  @media (max-width: 640px) {
    display: none;
  }
`;

const LineRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 70px 92px 100px;
  gap: 8px;
  padding: 9px 10px;
  font-size: 10.5px;
  color: ${colors.inkSoft};
  border-top: 1px solid ${colors.lineSoft};

  span:nth-child(2),
  span:nth-child(3),
  span:nth-child(4) {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  strong {
    font-weight: 700;
    color: ${colors.ink};
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr auto;
    gap: 4px 10px;

    span:nth-child(2) {
      text-align: right;
      color: ${colors.faint};
    }

    span:nth-child(3),
    span:nth-child(4) {
      text-align: left;
    }
  }
`;

const Totals = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 26px;
  margin-top: 11px;
  padding-top: 11px;
  border-top: 1px solid ${colors.lineSoft};

  div {
    text-align: right;

    small {
      display: block;
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: ${colors.faint};
    }

    strong {
      display: block;
      margin-top: 2px;
      font-size: 12px;
      font-weight: 700;
      color: ${colors.ink};
    }

    &:last-child strong {
      font-family: ${fonts.display};
      font-size: 19px;
      font-weight: 500;
      color: ${colors.forest};
    }
  }
`;

const Specs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px 16px;
  margin-top: 12px;
  padding: 11px 12px;
  border-radius: 9px;
  background: ${colors.paper};
  border: 1px solid ${colors.lineSoft};

  div {
    min-width: 0;
    font-size: 10px;
    line-height: 1.5;
    color: ${colors.muted};
  }

  strong {
    display: block;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.faint};
    margin-bottom: 1px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProofGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ProofCard = styled.article`
  border: 1px solid ${colors.line};
  border-radius: ${radii.lg};
  background: #fff;
  overflow: hidden;
  box-shadow: ${shadows.xs};
`;

const ProofPreview = styled.div`
  position: relative;
  height: 176px;
  background: ${colors.mist};

  img {
    object-fit: cover;
  }
`;

const ProofBadge = styled.span`
  position: absolute;
  left: 11px;
  top: 11px;
  z-index: 1;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(16, 35, 29, 0.82);
  color: #fff;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
`;

const ProofBody = styled.div`
  padding: 13px 14px 15px;
`;

const VersionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 9.5px;
  color: ${colors.muted};

  span:first-child {
    font-family: ${fonts.mono};
    font-weight: 700;
    color: ${colors.ink};
    width: 28px;
  }

  span:last-child {
    margin-left: auto;
    color: ${colors.faint};
  }

  & + & {
    border-top: 1px dashed ${colors.lineSoft};
  }
`;

const InvoiceSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 15px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const SummaryTile = styled.div`
  padding: 11px 12px;
  border-radius: 9px;
  border: 1px solid ${colors.lineSoft};
  background: ${({ $accent }) => ($accent ? '#F4FAF7' : colors.paper)};

  small {
    display: block;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 3px;
    font-family: ${fonts.display};
    font-size: 18px;
    font-weight: 500;
    color: ${colors.ink};
    letter-spacing: -0.01em;
  }
`;

const InvoiceCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) 90px 90px 100px 100px auto;
  gap: 12px;
  align-items: center;
  padding: 12px 13px;
  border: 1px solid ${colors.lineSoft};
  border-radius: 9px;
  background: #fff;

  & + & {
    margin-top: 8px;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;
  }
`;

const InvoiceId = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-family: ${fonts.mono};
    font-size: 11px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 9.5px;
    color: ${colors.muted};
  }
`;

const InvoiceCell = styled.div`
  font-size: 10.5px;
  color: ${colors.inkSoft};
  font-variant-numeric: tabular-nums;

  small {
    display: block;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 1px;
    font-weight: 700;
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  small {
    display: block;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.faint};
  }

  strong {
    display: block;
    margin-top: 2px;
    font-size: 11.5px;
    font-weight: 600;
    color: ${colors.ink};
    line-height: 1.45;
  }
`;

const AddressCard = styled.div`
  border: 1px solid ${colors.lineSoft};
  border-radius: 9px;
  padding: 11px 12px;
  background: ${colors.paper};

  strong {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.copperDeep};
  }

  p {
    margin-top: 5px;
    font-size: 10.5px;
    line-height: 1.55;
    color: ${colors.inkSoft};
  }
`;

const BankCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 9px;
  border: 1px dashed #DCC6A9;
  background: #FFFBF4;

  strong {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: ${colors.ink};
  }

  span {
    display: block;
    font-size: 10px;
    color: ${colors.muted};
    margin-top: 2px;
  }
`;

const DocRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;

  & + & {
    border-top: 1px solid ${colors.lineSoft};
  }
`;

const DocIcon = styled.span`
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: ${colors.paper};
  color: ${colors.copperDeep};
  border: 1px solid ${colors.lineSoft};
`;

const DocBody = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    color: ${colors.ink};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    margin-top: 1px;
    font-size: 9px;
    color: ${colors.faint};
  }
`;

const TicketCard = styled.article`
  border: 1px solid ${colors.lineSoft};
  border-radius: 9px;
  padding: 12px 13px;

  & + & {
    margin-top: 9px;
  }

  small {
    font-family: ${fonts.mono};
    font-size: 9px;
    color: ${colors.copperDeep};
    font-weight: 700;
  }

  h4 {
    margin-top: 3px;
    font-size: 12px;
    font-weight: 800;
    color: ${colors.ink};
  }

  p {
    margin-top: 3px;
    font-size: 10.5px;
    line-height: 1.55;
    color: ${colors.muted};
  }
`;

const Reply = styled.div`
  margin-top: 9px;
  padding: 8px 10px;
  border-left: 2px solid ${colors.line};
  background: ${colors.paper};
  border-radius: 0 7px 7px 0;

  strong {
    display: block;
    font-size: 9px;
    font-weight: 800;
    color: ${colors.inkSoft};
  }

  p {
    margin-top: 2px;
    font-size: 10px;
    line-height: 1.5;
    color: ${colors.muted};
  }

  small {
    display: block;
    margin-top: 3px;
    font-size: 8.5px;
    color: ${colors.faint};
    font-family: inherit;
    font-weight: 500;
  }
`;

const ContactCard = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border-radius: 9px;
  background: ${colors.paper};
  border: 1px solid ${colors.lineSoft};
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 10.5px;
  font-weight: 600;
  color: ${colors.inkSoft};

  svg {
    color: ${colors.copperDeep};
  }

  & + & {
    border-top: 1px solid ${colors.lineSoft};
  }
`;

const WhatsApp = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  height: 36px;
  border-radius: 8px;
  background: #1F7A54;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  margin-top: 7px;

  &:hover {
    background: #17613F;
  }
`;

const NoteBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 11px;
  border-radius: 8px;
  background: ${({ $tone }) => ($tone === 'warning' ? '#FDF7EC' : colors.paper)};
  border: 1px solid ${({ $tone }) => ($tone === 'warning' ? '#EBD9B7' : colors.lineSoft)};
  font-size: 9.5px;
  line-height: 1.55;
  color: ${colors.muted};

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
    color: ${({ $tone }) => ($tone === 'warning' ? colors.warning : colors.faint)};
  }
`;

const EmptyPanel = styled.div`
  padding: 34px 18px;
  text-align: center;
  border: 1px dashed ${colors.line};
  border-radius: 10px;
  background: ${colors.paper};

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 800;
    color: ${colors.ink};
  }

  p {
    margin: 4px auto 0;
    max-width: 420px;
    font-size: 10.5px;
    line-height: 1.55;
    color: ${colors.muted};
  }
`;

const NotifRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 4px;

  & + & {
    border-top: 1px solid ${colors.lineSoft};
  }

  i {
    width: 7px;
    height: 7px;
    margin-top: 5px;
    border-radius: 50%;
    flex: 0 0 auto;
    background: ${({ $unread }) => ($unread ? colors.copper : colors.line)};
  }

  strong {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    color: ${colors.ink};
  }

  p {
    margin-top: 2px;
    font-size: 10px;
    line-height: 1.5;
    color: ${colors.muted};
  }

  small {
    display: block;
    margin-top: 3px;
    font-size: 9px;
    color: ${colors.faint};
  }
`;

const DrawerActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 10px 12px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.line};
  background: #fff;
  color: ${colors.ink};
  font-family: ${fonts.sans};
  font-size: 12px;
  line-height: 1.55;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${colors.forestSoft};
    box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.1);
  }
`;

const PlainSelect = styled.select`
  width: 100%;
  height: 38px;
  padding: 0 10px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.line};
  background: #fff;
  color: ${colors.ink};
  font-family: ${fonts.sans};
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: ${colors.forestSoft};
    box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.1);
  }
`;

const ModalLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${colors.muted};
`;

const PlainInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 10px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.line};
  background: #fff;
  color: ${colors.ink};
  font-family: ${fonts.sans};
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: ${colors.forestSoft};
    box-shadow: 0 0 0 3px rgba(23, 73, 59, 0.1);
  }
`;

const ProofModalImage = styled.div`
  position: relative;
  height: 200px;
  border-radius: 9px;
  overflow: hidden;
  background: ${colors.mist};
  margin-bottom: 13px;

  img {
    object-fit: cover;
  }
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function PortalWorkspace({ embedded = false, initialTab = 'overview', onSignOut = null }) {
  const [tab, setTab] = useState(initialTab);
  const [notifOpen, setNotifOpen] = useState(false);
  const [rfqOpen, setRfqOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState(null);
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [declineTarget, setDeclineTarget] = useState(null);
  const [declineNote, setDeclineNote] = useState('');
  const [proofTarget, setProofTarget] = useState(null);
  const [proofNote, setProofNote] = useState('');
  const [trackTarget, setTrackTarget] = useState(null);
  const [repeatTarget, setRepeatTarget] = useState(null);
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('NEFT');
  const [profileOpen, setProfileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const customer = useDemoStore((state) => state.customers.find((entry) => entry.id === ABC_CUSTOMER_ID));
  const leads = useDemoStore((state) => state.leads);
  const quotes = useDemoStore((state) => state.quotes);
  const orders = useDemoStore((state) => state.orders);
  const production = useDemoStore((state) => state.production);
  const artwork = useDemoStore((state) => state.artwork);
  const invoices = useDemoStore((state) => state.invoices);
  const campaigns = useDemoStore((state) => state.campaigns);
  const campaignExpenses = useDemoStore((state) => state.campaignExpenses);
  const stockMovements = useDemoStore((state) => state.stockMovements);
  const supportEnquiries = useDemoStore((state) => state.supportEnquiries);
  const notifications = useDemoStore((state) => state.notifications);
  const settings = useDemoStore((state) => state.settings);

  const acceptPortalQuote = useDemoStore((state) => state.acceptPortalQuote);
  const declinePortalQuote = useDemoStore((state) => state.declinePortalQuote);
  const reviewPortalProof = useDemoStore((state) => state.reviewPortalProof);
  const requestRepeatOrder = useDemoStore((state) => state.requestRepeatOrder);
  const recordPortalPayment = useDemoStore((state) => state.recordPortalPayment);
  const submitPortalRfq = useDemoStore((state) => state.submitPortalRfq);
  const submitSupportEnquiry = useDemoStore((state) => state.submitSupportEnquiry);
  const savePortalProfile = useDemoStore((state) => state.savePortalProfile);
  const markAllNotificationsRead = useDemoStore((state) => state.markAllNotificationsRead);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const data = useMemo(() => {
    const abcLeads = leads.filter((lead) => lead.company === ABC_COMPANY || lead.id === 'LD-1059');
    const abcQuotes = quotes.filter((quote) => quote.customerId === ABC_CUSTOMER_ID || quote.customer === ABC_COMPANY);
    const abcOrders = orders.filter((order) => order.customerId === ABC_CUSTOMER_ID || order.customer === ABC_COMPANY);
    const abcJobs = production.filter(
      (job) => job.customer === ABC_COMPANY || abcOrders.some((order) => order.id === job.orderId)
    );
    const abcArtwork = artwork.filter(
      (job) => job.customer === ABC_COMPANY || abcOrders.some((order) => order.id === job.orderId)
    );
    const abcInvoices = invoices.filter(
      (invoice) => invoice.customerId === ABC_CUSTOMER_ID || invoice.customer === ABC_COMPANY
    );
    const abcSupport = supportEnquiries.filter((entry) => entry.customerId === ABC_CUSTOMER_ID);
    const workflowQuote = abcQuotes.find((quote) => quote.id === 'QT-2026-119') || abcQuotes[0] || null;
    const workflowOrder = workflowQuote ? abcOrders.find((order) => order.quoteId === workflowQuote.id) : null;
    const workflowJob = workflowOrder ? abcJobs.find((job) => job.orderId === workflowOrder.id) : null;
    const workflowArtwork = workflowOrder ? abcArtwork.find((job) => job.orderId === workflowOrder.id) : null;
    const workflowInvoice = workflowOrder ? abcInvoices.find((invoice) => invoice.orderId === workflowOrder.id) : null;
    const workflowLead = abcLeads.find((lead) => lead.id === 'LD-1059') || abcLeads[0] || null;
    const linkedStock = workflowJob
      ? stockMovements.filter((movement) => movement.jobId === workflowJob.id && movement.type === 'Consumption')
      : [];
    const campaign = campaigns.find((entry) => entry.id === ABC_CAMPAIGN_ID) || null;
    const campaignSpend = campaignExpenses
      .filter((expense) => expense.campaignId === ABC_CAMPAIGN_ID)
      .reduce((total, expense) => total + expense.amount, 0);
    const campaignLeads = leads.filter((lead) => lead.campaignId === ABC_CAMPAIGN_ID).length + (campaign?.leads || 0);
    const campaignRevenue = abcOrders
      .filter((order) => order.campaignId === ABC_CAMPAIGN_ID && order.status !== 'On hold')
      .reduce((total, order) => total + order.value, 0);

    const relatedRefs = [
      ...abcLeads.map((lead) => lead.id),
      ...abcLeads.map((lead) => lead.reference),
      ...abcQuotes.map((quote) => quote.id),
      ...abcOrders.map((order) => order.id),
      ...abcJobs.map((job) => job.id),
      ...abcArtwork.map((job) => job.id),
      ...abcInvoices.map((invoice) => invoice.id),
    ].filter(Boolean);

    const abcNotifications = notifications.filter((entry) => {
      const text = `${entry.title} ${entry.body}`;
      return text.includes(ABC_COMPANY) || relatedRefs.some((ref) => text.includes(ref));
    });

    return {
      abcLeads,
      abcQuotes,
      abcOrders,
      abcJobs,
      abcArtwork,
      abcInvoices,
      abcSupport,
      workflowQuote,
      workflowOrder,
      workflowJob,
      workflowArtwork,
      workflowInvoice,
      workflowLead,
      linkedStock,
      campaign,
      campaignSpend,
      campaignLeads,
      campaignRevenue,
      abcNotifications,
    };
  }, [leads, quotes, orders, production, artwork, invoices, campaigns, campaignExpenses, stockMovements, supportEnquiries, notifications]);

  const {
    abcLeads,
    abcQuotes,
    abcOrders,
    abcJobs,
    abcArtwork,
    abcInvoices,
    abcSupport,
    workflowQuote,
    workflowOrder,
    workflowJob,
    workflowArtwork,
    workflowInvoice,
    workflowLead,
    linkedStock,
    campaign,
    campaignSpend,
    campaignLeads,
    campaignRevenue,
    abcNotifications,
  } = data;

  const openOrders = abcOrders.filter((order) => !['Delivered'].includes(order.status));
  const awaitingArtwork = abcArtwork.filter((job) => proofAwaiting(job));
  const outstanding = abcInvoices.reduce((total, invoice) => total + Math.max(0, invoice.amount - invoice.paid), 0);
  const unpaidInvoices = abcInvoices.filter((invoice) => invoice.status !== 'Paid');
  const nextQuote = abcQuotes.find((quote) => quote.status === 'Sent');
  const nextProof = awaitingArtwork[0];
  const nextInvoice = unpaidInvoices[0];
  const unread = abcNotifications.filter((entry) => !entry.read).length;
  const quoteDeclined = workflowQuote?.status === 'Declined';
  const activeOrder = openOrders[0];
  const whatsapp = settings?.whatsapp || {};
  const whatsappHref = useMemo(() => {
    const number = String(whatsapp.number || '').replace(/[^0-9]/g, '');
    return `https://wa.me/${number}?text=${encodeURIComponent(whatsapp.message || '')}`;
  }, [whatsapp.number, whatsapp.message]);

  const workflowSteps = useMemo(() => {
    const currentOrder = workflowOrder;
    const currentJob = workflowJob;
    const currentArtwork = workflowArtwork;
    const currentInvoice = workflowInvoice;
    const jobStageIndex = currentJob ? ['Pending', 'Prepress', 'Approval', 'Printing', 'Finishing', 'Quality Check', 'Dispatch'].indexOf(currentJob.stage) : -1;
    const leadFollowUp = workflowLead?.followUps?.find((follow) => follow.status === 'Open') || workflowLead?.followUps?.[0];
    const quoteAccepted = workflowQuote?.status === 'Accepted';
    const quoteDeclinedNow = workflowQuote?.status === 'Declined';
    const proofApproved = currentArtwork?.proofStatus === 'Approved' || currentArtwork?.status === 'Approved';
    const productionMoved = jobStageIndex > 1;
    const consumption = linkedStock.reduce((total, movement) => total + Number(movement.qty || 0), 0);
    const qcComplete = currentJob?.stage === 'Dispatch' || ['Dispatched', 'Delivered'].includes(currentOrder?.status);
    const dispatched = ['Dispatched', 'Delivered'].includes(currentOrder?.status) || Boolean(currentOrder?.delivery?.dispatchedOn);
    const paid = Number(currentInvoice?.paid || 0) > 0 || Number(currentOrder?.payment?.paid || 0) > 0;
    const campaignLive = Boolean(currentOrder?.campaignId === ABC_CAMPAIGN_ID);

    const raw = [
      {
        id: 1,
        phase: 'Intake',
        title: 'RFQ submitted on the website',
        detail: workflowLead ? `${workflowLead.reference} · ${formatDate(workflowLead.createdAt)}` : 'Not received yet',
        done: Boolean(workflowLead),
        href: '/admin/leads',
        module: 'CRM',
      },
      {
        id: 2,
        phase: 'Intake',
        title: 'RFQ appears in CRM',
        detail: workflowLead ? `${workflowLead.id} at stage ${workflowLead.stage}` : 'Waiting for the first enquiry',
        done: Boolean(workflowLead),
        href: '/admin/leads',
        module: 'CRM',
      },
      {
        id: 3,
        phase: 'Intake',
        title: 'Salesperson assigned',
        detail: workflowLead ? `${workflowLead.owner} owns the enquiry` : 'Awaiting assignment',
        done: Boolean(workflowLead?.owner),
        href: '/admin/leads',
        module: 'CRM',
      },
      {
        id: 4,
        phase: 'Intake',
        title: 'Follow-up created',
        detail: leadFollowUp ? `Next: ${leadFollowUp.date} · ${leadFollowUp.owner}` : 'No follow-up yet',
        done: Boolean(workflowLead?.followUps?.length),
        href: '/admin/leads',
        module: 'CRM',
      },
      {
        id: 5,
        phase: 'Commercial',
        title: 'Sales creates a quotation',
        detail: workflowQuote ? `${workflowQuote.id} · ${money(workflowQuote.total)}` : 'Quotation not created yet',
        done: Boolean(workflowQuote),
        href: '/admin/quotations',
        module: 'Quotations',
      },
      {
        id: 6,
        phase: 'Commercial',
        title: 'Customer accepts the quotation',
        detail: quoteDeclinedNow
          ? 'Declined in the portal — sales will follow up'
          : quoteAccepted
            ? `Accepted${workflowQuote.respondedAt ? ` ${formatDate(workflowQuote.respondedAt)}` : ''}`
            : 'Waiting for your decision in Quotations',
        done: quoteAccepted,
        blocked: quoteDeclinedNow,
        actionTab: 'quotations',
        module: 'Portal',
      },
      {
        id: 7,
        phase: 'Commercial',
        title: 'System creates the order',
        detail: currentOrder ? `${currentOrder.id} · ${money(currentOrder.value)}` : 'Created automatically on acceptance',
        done: Boolean(currentOrder),
        actionTab: 'orders',
        module: 'Orders',
      },
      {
        id: 8,
        phase: 'Production',
        title: 'Production job card generated',
        detail: currentJob ? `${currentJob.id} · ${currentJob.stage}` : 'Generated with the order',
        done: Boolean(currentJob),
        href: '/admin/production',
        module: 'Production',
      },
      {
        id: 9,
        phase: 'Production',
        title: 'Artwork uploaded',
        detail: currentArtwork ? `${currentArtwork.id} · ${currentArtwork.version}` : 'Prepress will upload the first proof',
        done: Boolean(currentArtwork),
        href: '/admin/prepress',
        module: 'Prepress',
      },
      {
        id: 10,
        phase: 'Production',
        title: 'Proof sent to the customer',
        detail: currentArtwork
          ? currentArtwork.proofStatus === 'Not sent'
            ? 'Proof is being prepared'
            : `${currentArtwork.proofStatus} · ${currentArtwork.fileType}`
          : 'Waiting for artwork',
        done: Boolean(currentArtwork && currentArtwork.proofStatus !== 'Not sent'),
        actionTab: 'artwork',
        module: 'Portal',
      },
      {
        id: 11,
        phase: 'Production',
        title: 'Customer approves the proof',
        detail: proofApproved
          ? 'Approved — print files are locked'
          : currentArtwork?.status === 'Changes requested'
            ? 'Corrections requested — revised proof pending'
            : 'Waiting for your review in Artwork proofs',
        done: proofApproved,
        actionTab: 'artwork',
        module: 'Portal',
      },
      {
        id: 12,
        phase: 'Production',
        title: 'Production stage changes',
        detail: currentJob ? `${currentJob.stage} · ${currentJob.progress}% complete` : 'Waiting for the job card',
        done: productionMoved,
        href: '/admin/production',
        module: 'Production',
      },
      {
        id: 13,
        phase: 'Production',
        title: 'Inventory records material consumption',
        detail: linkedStock.length
          ? `${formatNumber(consumption)} units issued · ${linkedStock.map((movement) => movement.sku).join(', ')}`
          : 'Material is issued when production starts',
        done: linkedStock.length > 0,
        href: '/admin/inventory',
        module: 'Inventory',
      },
      {
        id: 14,
        phase: 'Fulfilment',
        title: 'Quality check completed',
        detail: qcComplete ? 'Batch cleared by the QC lab' : 'Runs after printing and finishing',
        done: qcComplete,
        href: '/admin/production',
        module: 'Production',
      },
      {
        id: 15,
        phase: 'Fulfilment',
        title: 'Dispatch status updated',
        detail: currentOrder?.delivery?.dispatchedOn
          ? `${currentOrder.delivery.carrier} · ${currentOrder.delivery.tracking}`
          : currentOrder
            ? currentOrder.delivery?.status || 'Pending dispatch'
            : 'Waiting for production',
        done: dispatched,
        href: '/admin/orders',
        module: 'Orders',
      },
      {
        id: 16,
        phase: 'Fulfilment',
        title: 'Payment recorded',
        detail: currentInvoice
          ? `${currentInvoice.id} · ${money(currentInvoice.paid)} of ${money(currentInvoice.amount)} received`
          : currentOrder
            ? 'Invoice raises with the order'
            : 'No invoice yet',
        done: paid,
        actionTab: 'invoices',
        module: 'Finance',
      },
      {
        id: 17,
        phase: 'Intelligence',
        title: 'Owner dashboard updates sales and financial figures',
        detail: `Live booked value ${formatCompactINR(abcOrders.reduce((total, order) => total + order.value, 0))} · receipts ${formatCompactINR(
          abcInvoices.reduce((total, invoice) => total + invoice.paid, 0)
        )}`,
        done: paid,
        href: '/admin',
        module: 'Dashboard',
      },
      {
        id: 18,
        phase: 'Intelligence',
        title: 'Marketing shows spend, leads and attributed revenue',
        detail: `${campaign?.name || 'Food-grade microsite'} · ${formatCompactINR(campaignSpend)} spend · ${formatNumber(
          campaignLeads
        )} leads · ${formatCompactINR(campaignRevenue)} attributed`,
        done: campaignLive,
        href: '/admin/marketing',
        module: 'Marketing',
      },
    ];

    let currentMarked = false;
    return raw.map((step) => {
      if (step.blocked) return { ...step, state: 'blocked' };
      if (step.done) return { ...step, state: 'done' };
      if (!quoteDeclinedNow && !currentMarked) {
        currentMarked = true;
        return { ...step, state: 'current' };
      }
      return { ...step, state: 'pending' };
    });
  }, [
    workflowLead,
    workflowQuote,
    workflowOrder,
    workflowJob,
    workflowArtwork,
    workflowInvoice,
    linkedStock,
    quoteDeclined,
    abcOrders,
    abcInvoices,
    campaign,
    campaignSpend,
    campaignLeads,
    campaignRevenue,
  ]);

  const phases = ['Intake', 'Commercial', 'Production', 'Fulfilment', 'Intelligence'];
  const stepStateLabel = { done: 'Done', current: 'Next', pending: 'Waiting', blocked: 'Blocked' };
  const dueForPayment = paymentTarget ? Math.max(0, paymentTarget.amount - paymentTarget.paid) : 0;

  const goto = (nextTab) => {
    setTab(nextTab);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPayment = (invoice) => {
    setPaymentTarget(invoice);
    setPaymentAmount(String(Math.max(0, invoice.amount - invoice.paid)));
    setPaymentMethod('NEFT');
  };

  const submitPayment = () => {
    if (!paymentTarget) return;
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      notify('Enter an amount', 'The reported payment must be greater than zero.', 'warning');
      return;
    }
    const result = recordPortalPayment(paymentTarget.id, amount, paymentMethod);
    if (!result) {
      notify('Nothing to record', 'This invoice is already settled.', 'warning');
      return;
    }
    notify(
      'Payment reported',
      `${paymentTarget.id} updated. Finance sees the receipt in the demo ledger.`,
      'success'
    );
    setPaymentTarget(null);
  };

  const handleAcceptQuote = () => {
    if (!acceptTarget) return;
    const result = acceptPortalQuote(acceptTarget.id, 'Accepted in portal demo');
    setAcceptTarget(null);
    if (!result) {
      notify('Could not accept', 'This quotation can no longer be accepted.', 'warning');
      return;
    }
    notify(
      'Quotation accepted',
      `${result.order.id} created · job card ${result.job.id} · proof ${result.artwork.id} sent to you.`,
      'success'
    );
    goto('orders');
  };

  const handleDeclineQuote = () => {
    if (!declineTarget) return;
    if (declineNote.trim().length < 6) return;
    const result = declinePortalQuote(declineTarget.id, declineNote.trim());
    setDeclineTarget(null);
    setDeclineNote('');
    if (result) {
      notify('Quotation declined', 'Sales has been notified and a win-back follow-up is scheduled.', 'success');
    }
  };

  const handleProofDecision = (decision) => {
    if (!proofTarget) return;
    if (decision !== 'Approved' && proofNote.trim().length < 6) return;
    const result = reviewPortalProof(proofTarget.id, decision, proofNote.trim());
    setProofTarget(null);
    setProofNote('');
    if (!result) return;
    if (decision === 'Approved') {
      notify(
        'Proof approved',
        result.job
          ? `${proofTarget.id} locked · ${result.job.id} moved to printing · material consumption recorded.`
          : `${proofTarget.id} approved. Production has been notified.`,
        'success'
      );
    } else {
      notify('Corrections requested', 'Prepress has the note and will upload a revised proof.', 'success');
    }
  };

  const handleRepeatOrder = () => {
    if (!repeatTarget) return;
    const result = requestRepeatOrder(repeatTarget.id);
    setRepeatTarget(null);
    if (!result) return;
    notify(
      'Repeat order requested',
      `${result.order.id} created from ${repeatTarget.id} · job card ${result.job.id} · artwork request ${result.artwork.id}.`,
      'success'
    );
    goto('orders');
  };

  const handleProfileSave = (values, helpers) => {
    savePortalProfile(values);
    notify('Company profile updated', 'The account record in CRM now matches your changes.', 'success');
    setProfileOpen(false);
    helpers.setSubmitting(false);
  };

  const handleSupportSubmit = (values, helpers) => {
    const ticket = submitSupportEnquiry(values);
    notify('Support enquiry sent', `${ticket.id} is with your account team.`, 'success');
    setSupportOpen(false);
    helpers.resetForm();
    helpers.setSubmitting(false);
  };

  const handleRfqSubmit = (values, helpers) => {
    const lead = submitPortalRfq(values);
    notify(
      'RFQ submitted',
      `${lead.reference} is in CRM under ${lead.owner} with a follow-up scheduled.`,
      'success'
    );
    setRfqOpen(false);
    helpers.resetForm();
    helpers.setSubmitting(false);
    goto('rfqs');
  };

  const downloadStatement = () => {
    downloadCSV(
      'abc-foods-statement.csv',
      ['Invoice', 'Order', 'Issued', 'Due', 'Amount', 'Paid', 'Balance', 'Status'],
      abcInvoices.map((invoice) => [
        invoice.id,
        invoice.orderId || '—',
        invoice.issued,
        invoice.due,
        invoice.amount,
        invoice.paid,
        Math.max(0, invoice.amount - invoice.paid),
        invoice.status,
      ])
    );
    notify('Statement downloaded', 'A CSV statement of invoices was generated for the demo.', 'success');
  };

  const downloadInvoice = (invoice) => {
    downloadCSV(
      `${invoice.id.toLowerCase()}-summary.csv`,
      ['Invoice', 'Customer', 'Order', 'Issued', 'Due', 'Amount', 'Paid', 'Balance', 'Status'],
      [
        [
          invoice.id,
          invoice.customer,
          invoice.orderId || '—',
          invoice.issued,
          invoice.due,
          invoice.amount,
          invoice.paid,
          Math.max(0, invoice.amount - invoice.paid),
          invoice.status,
        ],
      ]
    );
    notify('Invoice downloaded', `${invoice.id} summary was generated as CSV.`, 'success');
  };

  const downloadOrder = (order) => {
    downloadCSV(
      `${order.id.toLowerCase()}-summary.csv`,
      ['Order', 'Customer', 'Status', 'Due', 'Value', 'Payment status', 'Items'],
      [[order.id, order.customer, order.status, order.dueDate, order.value, order.payment?.paymentStatus || '—', order.items.map((item) => item.description).join(' | ')]]
    );
    notify('Order summary downloaded', `${order.id} was exported as CSV.`, 'success');
  };

  const downloadDocument = (document) => {
    downloadCSV(
      `${document.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-register.csv`,
      ['Document', 'Type', 'Updated', 'Size'],
      [[document.name, document.type, document.updated, document.size]]
    );
    notify('Document register downloaded', `${document.name} · metadata exported for the demo.`, 'success');
  };

  const activeCampaign = campaign;
  const projectValue = abcOrders.reduce((total, order) => total + order.value, 0);
  const receipts = abcInvoices.reduce((total, invoice) => total + invoice.paid, 0);

  return (
    <PortalRoot $embedded={embedded}>
      <PortalTop $embedded={embedded}>
        <TopInner>
          <BrandMark $embedded={embedded}>SP</BrandMark>
          <BrandText $embedded={embedded}>
            <strong>Stark Packmate</strong>
            <span>Customer portal</span>
          </BrandText>
          <TopDivider $embedded={embedded} />
          <BrandText $embedded={embedded} style={{ opacity: 0.8 }}>
            <strong>{customer?.company || ABC_COMPANY}</strong>
            <span>Account {customer?.id || ABC_CUSTOMER_ID} · {customer?.paymentTerms || 'Net 30'}</span>
          </BrandText>
          <TopSpacer />
          <DemoChip $embedded={embedded}>
            <FlaskConical size={11} /> Demo mode
          </DemoChip>
          <IconGhost
            type="button"
            $embedded={embedded}
            aria-label="Notifications"
            onClick={() => {
              setNotifOpen(true);
              markAllNotificationsRead();
            }}
          >
            <Bell size={15} />
            {unread ? <Unread $embedded={embedded}>{unread > 9 ? '9+' : unread}</Unread> : null}
          </IconGhost>
          <AccountChip $embedded={embedded}>
            <Avatar $size="sm">{initialsOf(customer?.contact || 'Ritu Bansal')}</Avatar>
            <div>
              <strong>{customer?.contact || 'Ritu Bansal'}</strong>
              <span>{customer?.company || ABC_COMPANY}</span>
            </div>
          </AccountChip>
          {onSignOut ? (
            <SignOut type="button" onClick={onSignOut} aria-label="Sign out" title="Sign out">
              <LogOut size={13} /> <span>Sign out</span>
            </SignOut>
          ) : null}
        </TopInner>
      </PortalTop>

      {!embedded ? (
        <DemoBanner>
          <DemoInner>
            <FlaskConical size={14} />
            <span>
              <strong>Demo workspace.</strong> {portalDemoAccess.notice}{' '}
              Signed in with the shared demo account <strong>{portalDemoAccess.email}</strong>.
            </span>
          </DemoInner>
        </DemoBanner>
      ) : null}

      <TabBarWrap $embedded={embedded}>
        <TabBar role="tablist" aria-label="Customer portal sections">
          {TABS.map((item) => {
            const Icon = item.icon;
            return (
              <TabButton
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                $active={tab === item.id}
                onClick={() => goto(item.id)}
              >
                <Icon size={13} /> {item.label}
                {item.id === 'rfqs' && abcLeads.length ? <StatusChip $tone="copper">{abcLeads.length}</StatusChip> : null}
                {item.id === 'artwork' && awaitingArtwork.length ? <StatusChip $tone="warning">{awaitingArtwork.length}</StatusChip> : null}
                {item.id === 'invoices' && unpaidInvoices.length ? <StatusChip $tone="danger">{unpaidInvoices.length}</StatusChip> : null}
              </TabButton>
            );
          })}
        </TabBar>
      </TabBarWrap>

      <Main>
        {tab === 'overview' ? (
          <>
            <Hero>
              <HeroCopy>
                <small>
                  <Sparkles size={11} /> {customer?.company || ABC_COMPANY} · {customer?.segment || 'Food & beverage'}
                </small>
                <h1>{greeting()}, {(customer?.contact || 'Ritu Bansal').split(' ')[0]}.</h1>
                <p>
                  {workflowOrder
                    ? `Your ${workflowOrder.id} order is ${workflowOrder.status.toLowerCase()}${workflowJob ? ` at the ${workflowJob.stage.toLowerCase()} stage` : ''}. ${nextProof ? 'A proof is waiting for your approval.' : nextInvoice ? `Invoice ${nextInvoice.id} is ready in the portal.` : 'Everything is on track.'}`
                    : nextQuote
                      ? `${nextQuote.id} is ready for your review. Accept it in the portal and Stark Packmate will create the order, job card and first proof.`
                      : 'Raise a new RFQ or review your orders, proofs and invoices in one place.'}
                </p>
                <HeroActions>
                  {nextQuote ? (
                    <Button $variant="primary" $size="sm" onClick={() => goto('quotations')}>
                      <FileText size={13} /> Review quotation
                    </Button>
                  ) : null}
                  {nextProof ? (
                    <Button $variant="light" $size="sm" onClick={() => goto('artwork')}>
                      <Palette size={13} /> Review proof
                    </Button>
                  ) : null}
                  <Button $variant="ghost" $size="sm" style={{ color: '#F3EFE4' }} onClick={() => goto('orders')}>
                    <Truck size={13} /> Track orders
                  </Button>
                </HeroActions>
              </HeroCopy>
              <HeroPanel>
                <HeroPanelHead>
                  <Avatar $size="md" $bg="rgba(255,255,255,0.14)" $color="#F9F6EE">
                    {initialsOf(customer?.owner || 'Neha Joshi')}
                  </Avatar>
                  <div>
                    <strong>{customer?.owner || 'Neha Joshi'} · Account manager</strong>
                    <span>Replies within 2 business hours</span>
                  </div>
                </HeroPanelHead>
                <HeroMini>
                  {ABC_PORTAL_HIGHLIGHTS.slice(0, 2).map((item) => (
                    <HeroMiniItem key={item.label}>
                      <p>{item.label}</p>
                      <strong>{item.value}</strong>
                    </HeroMiniItem>
                  ))}
                  <HeroMiniItem>
                    <p>Open orders</p>
                    <strong>{openOrders.length}</strong>
                  </HeroMiniItem>
                  <HeroMiniItem>
                    <p>Outstanding</p>
                    <strong>{formatCompactINR(outstanding)}</strong>
                  </HeroMiniItem>
                </HeroMini>
                <HeroLink role="button" tabIndex={0} onClick={() => goto('support')}>
                  Talk to your account team <ArrowRight size={12} />
                </HeroLink>
              </HeroPanel>
            </Hero>

            <StatGrid>
              <StatCard>
                <p>
                  <Package size={11} /> Open orders
                </p>
                <strong>{openOrders.length}</strong>
                <span>{openOrders.filter((order) => order.status === 'In production').length} in production</span>
              </StatCard>
              <StatCard>
                <p>
                  <Palette size={11} /> Proofs requiring you
                </p>
                <strong>{awaitingArtwork.length}</strong>
                <span>{awaitingArtwork[0] ? `${awaitingArtwork[0].id} · ${awaitingArtwork[0].version}` : 'Nothing waiting'}</span>
              </StatCard>
              <StatCard>
                <p>
                  <Wallet size={11} /> Outstanding
                </p>
                <strong>{formatCompactINR(outstanding)}</strong>
                <span>{unpaidInvoices.length} open invoice{unpaidInvoices.length === 1 ? '' : 's'}</span>
              </StatCard>
              <StatCard>
                <p>
                  <TrendingUp size={11} /> Lifetime value
                </p>
                <strong>{formatCompactINR(customer?.lifetimeValue || 0)}</strong>
                <span>{customer?.ordersCount || 0} orders since {customer?.since ? formatDate(customer.since, { year: undefined }) : '2023'}</span>
              </StatCard>
            </StatGrid>

            <ActionGrid>
              <ActionCard
                type="button"
                $accent={Boolean(nextQuote)}
                onClick={() => goto(nextQuote ? 'quotations' : 'rfqs')}
              >
                <ActionIcon $tone="copper">
                  {nextQuote ? <FileText size={15} /> : <FilePlus2 size={15} />}
                </ActionIcon>
                <ActionBody>
                  <small>Next action</small>
                  <strong>{nextQuote ? `${nextQuote.id} awaits your decision` : 'Raise a new packaging RFQ'}</strong>
                  <p>
                    {nextQuote
                      ? `${money(nextQuote.total)} · valid until ${formatDate(nextQuote.validUntil)}. Accepting creates the order and job card automatically.`
                      : 'Send a brief straight into CRM for a salesperson to qualify and quote.'}
                  </p>
                  <em>{nextQuote ? 'Review quotation' : 'Start an RFQ'} <ArrowRight size={10} /></em>
                </ActionBody>
              </ActionCard>

              <ActionCard type="button" $accent={!nextQuote && Boolean(nextProof)} onClick={() => goto('artwork')}>
                <ActionIcon $tone="info">
                  <Eye size={15} />
                </ActionIcon>
                <ActionBody>
                  <small>Artwork</small>
                  <strong>{nextProof ? `${nextProof.id} proof ${nextProof.version} is ready` : 'No proof awaiting approval'}</strong>
                  <p>
                    {nextProof
                      ? `${nextProof.product} · due ${formatDate(nextProof.due)}. Approving releases the job to printing and issues material from stock.`
                      : 'Proofs appear here when prepress sends them for customer sign-off.'}
                  </p>
                  <em>{nextProof ? 'Review proof' : 'Open artwork'} <ArrowRight size={10} /></em>
                </ActionBody>
              </ActionCard>

              <ActionCard type="button" $accent={!nextQuote && !nextProof && Boolean(nextInvoice)} onClick={() => goto('invoices')}>
                <ActionIcon $tone="success">
                  <Receipt size={15} />
                </ActionIcon>
                <ActionBody>
                  <small>Finance</small>
                  <strong>{nextInvoice ? `${nextInvoice.id} · ${money(nextInvoice.amount - nextInvoice.paid)} due` : 'No open invoices'}</strong>
                  <p>
                    {nextInvoice
                      ? `Due ${formatDate(nextInvoice.due)} · ${nextInvoice.status}. Download the invoice or report a bank transfer in the demo.`
                      : 'Paid invoices and payment status remain available in the invoices tab.'}
                  </p>
                  <em>{nextInvoice ? 'Open invoices' : 'View invoices'} <ArrowRight size={10} /></em>
                </ActionBody>
              </ActionCard>
            </ActionGrid>

            <Section>
              <SectionHead>
                <HeadCopy>
                  <small>Connected demo</small>
                  <h2>Order-to-cash workflow</h2>
                  <p>
                    The same records drive CRM, quotations, orders, production, inventory, finance and marketing.
                    Customer steps happen here; plant and finance steps link to the internal workspace and update this
                    tracker live.
                  </p>
                </HeadCopy>
                <HeadActions>
                  <StatusChip $tone={quoteDeclined ? 'danger' : 'success'}>
                    {workflowSteps.filter((step) => step.state === 'done').length} of {workflowSteps.length} complete
                  </StatusChip>
                  <Link href="/admin/reports" style={{ textDecoration: 'none' }}>
                    <Button $variant="secondary" $size="sm" type="button">
                      <TrendingUp size={13} /> Reports
                    </Button>
                  </Link>
                </HeadActions>
              </SectionHead>
              <SectionBody>
                <WorkflowLegend>
                  <span><i style={{ background: colors.success }} /> Done</span>
                  <span><i style={{ background: colors.copper }} /> Next action</span>
                  <span><i style={{ background: colors.line }} /> Waiting on a later step</span>
                  <span><i style={{ background: colors.danger }} /> Blocked</span>
                  <span style={{ marginLeft: 'auto' }}>
                    Focus flow: {workflowQuote?.id || 'RFQ'} → {workflowOrder?.id || 'order'} → {workflowJob?.id || 'job card'}
                  </span>
                </WorkflowLegend>
                {phases.map((phase) => (
                  <Phase key={phase}>
                    <PhaseTitle>
                      <span>{phase}</span>
                      <i />
                      <span>
                        {workflowSteps.filter((step) => step.phase === phase && step.state === 'done').length}/
                        {workflowSteps.filter((step) => step.phase === phase).length}
                      </span>
                    </PhaseTitle>
                    <StepGrid>
                      {workflowSteps
                        .filter((step) => step.phase === phase)
                        .map((step) => (
                          <Step key={step.id} $state={step.state}>
                            <StepDot $state={step.state}>
                              {step.state === 'done' ? <Check size={11} /> : step.state === 'blocked' ? '!' : step.id}
                            </StepDot>
                            <StepBody $state={step.state}>
                              <strong>{step.title}</strong>
                              <p>{step.detail}</p>
                              {step.href ? (
                                <Link href={step.href}>
                                  {step.module} <ExternalLink size={8} />
                                </Link>
                              ) : step.actionTab ? (
                                <a
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => goto(step.actionTab)}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') goto(step.actionTab);
                                  }}
                                >
                                  {step.module} <ArrowRight size={8} />
                                </a>
                              ) : null}
                            </StepBody>
                            <StepState $state={step.state}>{stepStateLabel[step.state]}</StepState>
                          </Step>
                        ))}
                    </StepGrid>
                  </Phase>
                ))}
              </SectionBody>
            </Section>

            <TwoCol>
              <MiniPanel>
                <MiniHead>
                  <strong>Latest updates</strong>
                  <span>{abcNotifications.length ? `${abcNotifications.length} events` : 'No events yet'}</span>
                </MiniHead>
                <MiniBody>
                  {abcNotifications.slice(0, 5).map((entry) => (
                    <UpdateRow key={entry.id}>
                      <UpdateDot $tone={entry.type} />
                      <UpdateBody>
                        <strong>{entry.title}</strong>
                        <p>{entry.body}</p>
                        <small>{timeAgo(entry.time)}</small>
                      </UpdateBody>
                    </UpdateRow>
                  ))}
                  {!abcNotifications.length ? (
                    <NoteBox>
                      <AlertCircle size={13} /> Portal activity will appear here as quotes, proofs, jobs and payments move
                      through the demo.
                    </NoteBox>
                  ) : null}
                </MiniBody>
              </MiniPanel>

              <MiniPanel>
                <MiniHead>
                  <strong>Account team</strong>
                  <span>{customer?.owner || 'Neha Joshi'}</span>
                </MiniHead>
                <MiniBody>
                  <ContactCard>
                    <Avatar $size="lg">{initialsOf(customer?.owner || 'Neha Joshi')}</Avatar>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 800, color: colors.ink }}>{customer?.owner || 'Neha Joshi'}</p>
                      <p style={{ marginTop: 2, fontSize: 10, color: colors.muted }}>Account manager · Packaging consultant</p>
                    </div>
                  </ContactCard>
                  <ContactLink href="tel:+919820011223">
                    <Phone size={12} /> +91 98200 11223
                  </ContactLink>
                  <ContactLink href="mailto:neha@starkpackmate.com">
                    <Mail size={12} /> neha@starkpackmate.com
                  </ContactLink>
                  {whatsapp.enabled ? (
                    <WhatsApp href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={13} /> Chat on WhatsApp
                    </WhatsApp>
                  ) : null}
                  <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
                    <Button $variant="secondary" $size="sm" $full type="button" onClick={() => setSupportOpen(true)}>
                      <MessageCircle size={12} /> New enquiry
                    </Button>
                    <Button $variant="secondary" $size="sm" $full type="button" onClick={() => goto('profile')}>
                      <Building2 size={12} /> Profile
                    </Button>
                  </div>
                </MiniBody>
              </MiniPanel>
            </TwoCol>
          </>
        ) : null}

        {tab === 'rfqs' ? (
          <>
            <Section>
              <SectionHead>
                <HeadCopy>
                  <small>Intake · CRM connected</small>
                  <h2>Requests for quotation</h2>
                  <p>
                    Every RFQ raised here writes straight into the CRM lead board, assigns a salesperson and creates a
                    follow-up task. Quotations appear in the Quotations tab once sales responds.
                  </p>
                </HeadCopy>
                <HeadActions>
                  <StatusChip $tone="info">{abcLeads.length} RFQs</StatusChip>
                  <Button $variant="primary" $size="sm" type="button" onClick={() => setRfqOpen(true)}>
                    <FilePlus2 size={13} /> New RFQ
                  </Button>
                </HeadActions>
              </SectionHead>
              <SectionBody>
                {abcLeads.length ? (
                  abcLeads.map((lead) => {
                    const openFollowUps = (lead.followUps || []).filter((follow) => follow.status === 'Open');
                    const quote = abcQuotes.find(
                      (entry) => entry.leadId === lead.id || (lead.quoteId && entry.id === lead.quoteId)
                    );
                    return (
                      <ListCard key={lead.id}>
                        <ListTop>
                          <ListTitle>
                            <small>{lead.reference || lead.id}</small>
                            <strong>{lead.product}</strong>
                            <p>
                              {lead.quantity} · {lead.city} · submitted {formatDate(lead.createdAt)}
                            </p>
                          </ListTitle>
                          <ChipRow>
                            <StatusChip $tone={statusTone(lead.stage)}>{lead.stage}</StatusChip>
                            <StatusChip $tone="neutral">{lead.owner}</StatusChip>
                          </ChipRow>
                        </ListTop>
                        <MetaGrid>
                          <Meta>
                            <small>CRM record</small>
                            <strong>{lead.id}</strong>
                          </Meta>
                          <Meta>
                            <small>Open follow-ups</small>
                            <strong>{openFollowUps.length ? `${openFollowUps[0].date} · ${openFollowUps[0].owner}` : 'None'}</strong>
                          </Meta>
                          <Meta>
                            <small>Source</small>
                            <strong>{lead.source}</strong>
                          </Meta>
                          <Meta>
                            <small>Quotation</small>
                            <strong>{quote ? quote.id : 'Sales preparing'}</strong>
                          </Meta>
                        </MetaGrid>
                        <CardActions>
                          <span style={{ fontSize: 9.5, color: colors.faint }}>
                            {quote
                              ? 'Quotation issued — review the commercial terms in the next tab.'
                              : 'A salesperson will qualify this RFQ and share a quotation.'}
                          </span>
                          <Spacer />
                          {quote ? (
                            <Button $variant="primary" $size="xs" type="button" onClick={() => goto('quotations')}>
                              <FileText size={11} /> View quotation
                            </Button>
                          ) : null}
                          <Link href="/admin/leads" style={{ textDecoration: 'none' }}>
                            <Button $variant="secondary" $size="xs" type="button">
                              <ExternalLink size={11} /> CRM record
                            </Button>
                          </Link>
                        </CardActions>
                      </ListCard>
                    );
                  })
                ) : (
                  <EmptyPanel>
                    <strong>No RFQs yet</strong>
                    <p>Raise your first request and it will appear in CRM with an owner and follow-up.</p>
                  </EmptyPanel>
                )}
              </SectionBody>
            </Section>
          </>
        ) : null}

        {tab === 'quotations' ? (
          <Section>
            <SectionHead>
              <HeadCopy>
                <small>Commercial · Sales connected</small>
                <h2>Quotations</h2>
                <p>
                  Accepting a quotation updates CRM, creates an order, generates the production job card, sends the first
                  proof and raises an invoice — all in one step.
                </p>
              </HeadCopy>
              <HeadActions>
                <StatusChip $tone="warning">{abcQuotes.filter((quote) => quote.status === 'Sent').length} awaiting you</StatusChip>
              </HeadActions>
            </SectionHead>
            <SectionBody>
              {abcQuotes.map((quote) => {
                const linkedOrder = abcOrders.find((order) => order.quoteId === quote.id);
                const isAccepted = quote.status === 'Accepted';
                const isDeclined = quote.status === 'Declined';
                return (
                  <ListCard key={quote.id}>
                    <ListTop>
                      <ListTitle>
                        <small>{quote.id} · rev {quote.revision || 1}</small>
                        <strong>{quote.items.map((item) => item.description).join(' · ')}</strong>
                        <p>
                          Issued {formatDate(quote.date)} · valid until {formatDate(quote.validUntil)} · {quote.owner}
                        </p>
                      </ListTitle>
                      <ChipRow>
                        <StatusChip $tone={isAccepted ? 'success' : statusTone(quote.status)}>{quote.status}</StatusChip>
                        <StatusChip $tone="copper">{formatCompactINR(quote.total)} incl. GST</StatusChip>
                      </ChipRow>
                    </ListTop>
                    <LineTable>
                      <LineHead>
                        <span>Item</span>
                        <span>Qty</span>
                        <span>Rate</span>
                        <span>Line total</span>
                      </LineHead>
                      {quote.items.map((item) => (
                        <LineRow key={item.description}>
                          <strong>{item.description}</strong>
                          <span>{formatNumber(item.qty)}</span>
                          <span>{money(item.rate)}</span>
                          <span>{money(item.qty * item.rate)}</span>
                        </LineRow>
                      ))}
                    </LineTable>
                    <Totals>
                      <div>
                        <small>Subtotal</small>
                        <strong>{money(quote.subtotal)}</strong>
                      </div>
                      <div>
                        <small>GST 18%</small>
                        <strong>{money(quote.tax)}</strong>
                      </div>
                      <div>
                        <small>Total payable</small>
                        <strong>{money(quote.total)}</strong>
                      </div>
                    </Totals>
                    {quote.specs ? (
                      <Specs>
                        <div>
                          <strong>Material</strong>
                          {quote.specs.material}
                        </div>
                        <div>
                          <strong>Print & finish</strong>
                          {quote.specs.print} · {quote.specs.finish}
                        </div>
                        <div>
                          <strong>Dimensions</strong>
                          {quote.specs.dimensions}
                        </div>
                        <div>
                          <strong>Packing</strong>
                          {quote.specs.packing}
                        </div>
                      </Specs>
                    ) : null}
                    {quote.responseNote ? (
                      <NoteBox $tone="warning" style={{ marginTop: 10 }}>
                        <AlertCircle size={12} /> Customer response: “{quote.responseNote}”
                      </NoteBox>
                    ) : null}
                    <CardActions>
                      <Button $variant="secondary" $size="xs" type="button" onClick={() => setQuoteTarget(quote)}>
                        <Eye size={11} /> View quotation
                      </Button>
                      {isAccepted && linkedOrder ? (
                        <Button $variant="ghost" $size="xs" type="button" onClick={() => goto('orders')}>
                          <Package size={11} /> {linkedOrder.id}
                        </Button>
                      ) : null}
                      <Spacer />
                      {quote.status === 'Sent' ? (
                        <>
                          <Button $variant="ghost" $size="xs" type="button" onClick={() => setDeclineTarget(quote)}>
                            Decline
                          </Button>
                          <Button $variant="primary" $size="xs" type="button" onClick={() => setAcceptTarget(quote)}>
                            <CheckCircle2 size={12} /> Accept quotation
                          </Button>
                        </>
                      ) : null}
                      {isAccepted ? (
                        <span style={{ fontSize: 9.5, color: colors.success, fontWeight: 700 }}>
                          Accepted — order {linkedOrder?.id || 'being created'}
                        </span>
                      ) : null}
                      {isDeclined ? (
                        <span style={{ fontSize: 9.5, color: colors.danger, fontWeight: 700 }}>Declined in portal</span>
                      ) : null}
                    </CardActions>
                  </ListCard>
                );
              })}
            </SectionBody>
          </Section>
        ) : null}

        {tab === 'orders' ? (
          <Section>
            <SectionHead>
              <HeadCopy>
                <small>Fulfilment · Production connected</small>
                <h2>Orders & production tracking</h2>
                <p>
                  Status, stage, delivery and payment all read from the same order and job-card records used by the
                  plant. Request a repeat order and sales receives a new confirmed order instantly.
                </p>
              </HeadCopy>
              <HeadActions>
                <StatusChip $tone="info">{openOrders.length} open</StatusChip>
              </HeadActions>
            </SectionHead>
            <SectionBody>
              {abcOrders.map((order) => {
                const job = abcJobs.find((entry) => entry.orderId === order.id);
                const invoice = abcInvoices.find((entry) => entry.orderId === order.id);
                return (
                  <ListCard key={order.id}>
                    <ListTop>
                      <ListTitle>
                        <small>{order.id}</small>
                        <strong>{order.items.map((item) => item.description).join(' · ')}</strong>
                        <p>
                          {formatNumber(order.items.reduce((total, item) => total + item.qty, 0))} units · due{' '}
                          {formatDate(order.dueDate)} · PO {order.poNumber}
                        </p>
                      </ListTitle>
                      <ChipRow>
                        <StatusChip $tone={statusTone(order.status)}>{order.status}</StatusChip>
                        <StatusChip $tone="neutral">{formatCompactINR(order.value)} order value</StatusChip>
                      </ChipRow>
                    </ListTop>
                    <div style={{ margin: '12px 0 4px' }}>
                      <ProgressTrack>
                        <ProgressFill $value={order.progress} $tone={order.progress >= 85 ? 'success' : 'info'} />
                      </ProgressTrack>
                    </div>
                    <MetaGrid>
                      <Meta>
                        <small>Production stage</small>
                        <strong>{job ? `${job.stage} · ${job.progress}%` : 'Awaiting job card'}</strong>
                      </Meta>
                      <Meta>
                        <small>Delivery</small>
                        <strong>{order.delivery?.status || 'Pending dispatch'}</strong>
                      </Meta>
                      <Meta>
                        <small>Payment</small>
                        <strong>{order.payment?.paymentStatus || 'Unpaid'}</strong>
                      </Meta>
                      <Meta>
                        <small>Invoice</small>
                        <strong>{invoice ? `${invoice.id} · ${invoice.status}` : 'Not raised'}</strong>
                      </Meta>
                    </MetaGrid>
                    <CardActions>
                      <Button $variant="primary" $size="xs" type="button" onClick={() => setTrackTarget(order)}>
                        <Truck size={11} /> Track order
                      </Button>
                      <Button $variant="secondary" $size="xs" type="button" onClick={() => downloadOrder(order)}>
                        <Download size={11} /> Summary
                      </Button>
                      <Spacer />
                      <Button $variant="ghost" $size="xs" type="button" onClick={() => setRepeatTarget(order)}>
                        <RefreshCw size={11} /> Request repeat order
                      </Button>
                    </CardActions>
                  </ListCard>
                );
              })}
              {!abcOrders.length ? (
                <EmptyPanel>
                  <strong>No orders yet</strong>
                  <p>Accept a quotation and the order, job card and proof will appear here automatically.</p>
                </EmptyPanel>
              ) : null}
            </SectionBody>
          </Section>
        ) : null}

        {tab === 'artwork' ? (
          <Section>
            <SectionHead>
              <HeadCopy>
                <small>Prepress · Artwork connected</small>
                <h2>Artwork proofs</h2>
                <p>
                  Approving a proof locks the print files, moves the production job to printing, records material
                  consumption in inventory and updates the order status.
                </p>
              </HeadCopy>
              <HeadActions>
                <StatusChip $tone={awaitingArtwork.length ? 'warning' : 'success'}>
                  {awaitingArtwork.length ? `${awaitingArtwork.length} awaiting you` : 'All reviewed'}
                </StatusChip>
              </HeadActions>
            </SectionHead>
            <SectionBody>
              {abcArtwork.length ? (
                <ProofGrid>
                  {abcArtwork.map((job) => {
                    const approved = job.proofStatus === 'Approved' || job.status === 'Approved';
                    const changes = job.status === 'Changes requested';
                    const waiting = proofAwaiting(job);
                    return (
                      <ProofCard key={job.id}>
                        <ProofPreview>
                          <ProofBadge>{job.proofStatus}</ProofBadge>
                          <Image
                            src={job.preview || '/images/folding-cartons.jpg'}
                            alt={`${job.product} artwork proof`}
                            fill
                            sizes="(max-width: 900px) 100vw, 50vw"
                          />
                        </ProofPreview>
                        <ProofBody>
                          <ListTop>
                            <ListTitle>
                              <small>{job.id} · {job.version}</small>
                              <strong>{job.product}</strong>
                              <p>
                                Due {formatDate(job.due)} · {job.fileType} · {job.colours}
                              </p>
                            </ListTitle>
                            <StatusChip $tone={approved ? 'success' : changes ? 'danger' : 'warning'}>
                              {approved ? 'Approved' : changes ? 'Changes requested' : job.proofStatus}
                            </StatusChip>
                          </ListTop>
                          <NoteBox $tone={changes ? 'warning' : 'default'} style={{ marginTop: 10 }}>
                            <AlertCircle size={12} /> {job.notes}
                          </NoteBox>
                          <div style={{ marginTop: 9 }}>
                            {(job.versions || []).slice(-3).map((version) => (
                              <VersionRow key={version.version}>
                                <span>{version.version}</span>
                                <span>{version.note}</span>
                                <span>{formatDate(version.date)}</span>
                              </VersionRow>
                            ))}
                          </div>
                          <CardActions>
                            {waiting ? (
                              <Button $variant="primary" $size="xs" type="button" onClick={() => setProofTarget(job)}>
                                <Eye size={11} /> Review proof
                              </Button>
                            ) : approved ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: colors.success }}>
                                <CheckCircle2 size={12} /> Proof approved — production released
                              </span>
                            ) : changes ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: colors.danger }}>
                                <UploadCloud size={12} /> Waiting for Stark Packmate to upload a revised proof
                              </span>
                            ) : (
                              <span style={{ fontSize: 10, color: colors.muted }}>Artwork is being prepared by prepress.</span>
                            )}
                            <Spacer />
                            <Button $variant="secondary" $size="xs" type="button" onClick={() => setProofTarget(job)}>
                              <Eye size={11} /> View details
                            </Button>
                          </CardActions>
                        </ProofBody>
                      </ProofCard>
                    );
                  })}
                </ProofGrid>
              ) : (
                <EmptyPanel>
                  <strong>No proofs yet</strong>
                  <p>When the order is created, prepress uploads a proof and it appears here for approval.</p>
                </EmptyPanel>
              )}
            </SectionBody>
          </Section>
        ) : null}

        {tab === 'invoices' ? (
          <>
            <Section>
              <SectionHead>
                <HeadCopy>
                  <small>Finance · Invoices & payments</small>
                  <h2>Invoices and payment status</h2>
                  <p>
                    Invoices are raised from order records. Reporting a bank transfer in the demo creates a finance
                    receipt and updates the order, owner dashboard and reports.
                  </p>
                </HeadCopy>
                <HeadActions>
                  <Button $variant="secondary" $size="sm" type="button" onClick={downloadStatement}>
                    <Download size={13} /> Statement
                  </Button>
                </HeadActions>
              </SectionHead>
              <SectionBody>
                <InvoiceSummary>
                  <SummaryTile>
                    <small>Total billed</small>
                    <strong>{formatCompactINR(abcInvoices.reduce((total, invoice) => total + invoice.amount, 0))}</strong>
                  </SummaryTile>
                  <SummaryTile $accent>
                    <small>Received</small>
                    <strong>{formatCompactINR(receipts)}</strong>
                  </SummaryTile>
                  <SummaryTile>
                    <small>Outstanding</small>
                    <strong>{formatCompactINR(outstanding)}</strong>
                  </SummaryTile>
                  <SummaryTile>
                    <small>Next due</small>
                    <strong>{nextInvoice ? formatDate(nextInvoice.due, { year: undefined }) : '—'}</strong>
                  </SummaryTile>
                </InvoiceSummary>

                {abcInvoices.map((invoice) => {
                  const balance = Math.max(0, invoice.amount - invoice.paid);
                  return (
                    <InvoiceCard key={invoice.id}>
                      <InvoiceId>
                        <strong>{invoice.id}</strong>
                        <span>
                          {invoice.orderId ? `Order ${invoice.orderId}` : 'Billing document'} · issued {formatDate(invoice.issued)}
                        </span>
                      </InvoiceId>
                      <InvoiceCell>
                        <small>Amount</small>
                        <strong>{money(invoice.amount)}</strong>
                      </InvoiceCell>
                      <InvoiceCell>
                        <small>Paid</small>
                        <strong>{money(invoice.paid)}</strong>
                      </InvoiceCell>
                      <InvoiceCell>
                        <small>Balance</small>
                        <strong>{money(balance)}</strong>
                      </InvoiceCell>
                      <div>
                        <StatusChip $tone={statusTone(invoice.status)}>{invoice.status}</StatusChip>
                      </div>
                      <CardActions style={{ marginTop: 0, paddingTop: 0, borderTop: 0, justifyContent: 'flex-end' }}>
                        <Button $variant="ghost" $size="xs" type="button" onClick={() => downloadInvoice(invoice)}>
                          <Download size={11} />
                        </Button>
                        {invoice.status !== 'Paid' ? (
                          <Button $variant="primary" $size="xs" type="button" onClick={() => openPayment(invoice)}>
                            <Wallet size={11} /> Report payment
                          </Button>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9.5, fontWeight: 700, color: colors.success }}>
                            <CheckCircle2 size={11} /> Settled
                          </span>
                        )}
                      </CardActions>
                    </InvoiceCard>
                  );
                })}
                <NoteBox style={{ marginTop: 13 }}>
                  <Landmark size={13} /> Payments are accepted by NEFT, RTGS and UPI. Quote the invoice number in the
                  narration. “Report payment” is a demo action cleared immediately; a production portal would reconcile
                  against the bank statement.
                </NoteBox>
              </SectionBody>
            </Section>

            <Section>
              <SectionHead>
                <HeadCopy>
                  <small>Account</small>
                  <h2>Documents</h2>
                  <p>Compliance documents held against the ABC Foods account. Downloads are clearly labelled demo registers.</p>
                </HeadCopy>
              </SectionHead>
              <SectionBody>
                {abcPortalProfile.documents.map((document) => (
                  <DocRow key={document.id}>
                    <DocIcon>
                      <FileText size={13} />
                    </DocIcon>
                    <DocBody>
                      <strong>{document.name}</strong>
                      <span>
                        {document.type} · updated {formatDate(document.updated)} · {document.size}
                      </span>
                    </DocBody>
                    <Button $variant="ghost" $size="xs" type="button" onClick={() => downloadDocument(document)}>
                      <Download size={11} /> Register
                    </Button>
                  </DocRow>
                ))}
              </SectionBody>
            </Section>
          </>
        ) : null}

        {tab === 'profile' ? (
          <ProfileGrid>
            <Section style={{ marginTop: 0 }}>
              <SectionHead>
                <HeadCopy>
                  <small>Account</small>
                  <h2>Company profile</h2>
                  <p>Changes save back to the CRM customer and primary contact records.</p>
                </HeadCopy>
                <HeadActions>
                  <Button $variant="secondary" $size="sm" type="button" onClick={() => setProfileOpen(true)}>
                    <Pencil size={12} /> Edit profile
                  </Button>
                </HeadActions>
              </SectionHead>
              <SectionBody>
                <FieldGrid>
                  <Field>
                    <small>Legal name</small>
                    <strong>{abcPortalProfile.legalName}</strong>
                  </Field>
                  <Field>
                    <small>Trading name</small>
                    <strong>{customer?.company || ABC_COMPANY}</strong>
                  </Field>
                  <Field>
                    <small>GSTIN</small>
                    <strong>{customer?.gstin || abcPortalProfile.gstin}</strong>
                  </Field>
                  <Field>
                    <small>FSSAI licence</small>
                    <strong>{abcPortalProfile.fssai}</strong>
                  </Field>
                  <Field>
                    <small>Primary contact</small>
                    <strong>{customer?.contact || 'Ritu Bansal'}</strong>
                  </Field>
                  <Field>
                    <small>Email</small>
                    <strong>{customer?.email || 'ritu.bansal@abcfoods.in'}</strong>
                  </Field>
                  <Field>
                    <small>Phone</small>
                    <strong>{customer?.phone || '+91 98204 33718'}</strong>
                  </Field>
                  <Field>
                    <small>Payment terms</small>
                    <strong>{customer?.paymentTerms || 'Net 30'}</strong>
                  </Field>
                  <Field>
                    <small>Industry</small>
                    <strong>{abcPortalProfile.industry}</strong>
                  </Field>
                  <Field>
                    <small>Account manager</small>
                    <strong>{customer?.owner || 'Neha Joshi'}</strong>
                  </Field>
                </FieldGrid>

                <Divider style={{ margin: '16px 0 13px' }} />
                <FieldGrid>
                  {abcPortalProfile.addresses.map((address) => (
                    <AddressCard key={address.id}>
                      <strong>
                        <MapPin size={10} /> {address.label}
                      </strong>
                      <p>{address.lines.join(', ')}</p>
                    </AddressCard>
                  ))}
                </FieldGrid>
              </SectionBody>
            </Section>

            <div>
              <Section style={{ marginTop: 0 }}>
                <SectionHead>
                  <HeadCopy>
                    <small>Finance</small>
                    <h2>Bank details</h2>
                  </HeadCopy>
                </SectionHead>
                <SectionBody>
                  <BankCard>
                    <Landmark size={16} style={{ color: colors.copperDeep, flex: '0 0 auto', marginTop: 2 }} />
                    <div>
                      <strong>{abcPortalProfile.bank.name}</strong>
                      <span>A/c {abcPortalProfile.bank.account}</span>
                      <span>IFSC {abcPortalProfile.bank.ifsc}</span>
                      <span>{abcPortalProfile.bank.note}</span>
                    </div>
                  </BankCard>
                </SectionBody>
              </Section>

              <Section>
                <SectionHead>
                  <HeadCopy>
                    <small>Relationship</small>
                    <h2>Account highlights</h2>
                  </HeadCopy>
                </SectionHead>
                <SectionBody>
                  <FieldGrid>
                    {ABC_PORTAL_HIGHLIGHTS.map((item) => (
                      <Field key={item.label}>
                        <small>{item.label}</small>
                        <strong>{item.value}</strong>
                      </Field>
                    ))}
                  </FieldGrid>
                  <Divider style={{ margin: '14px 0' }} />
                  <ContactCard>
                    <Avatar $size="lg">{initialsOf(customer?.owner || 'Neha Joshi')}</Avatar>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 800, color: colors.ink }}>{customer?.owner || 'Neha Joshi'}</p>
                      <p style={{ marginTop: 2, fontSize: 10, color: colors.muted }}>{abcPortalProfile.accountManagerEmail}</p>
                      <p style={{ marginTop: 1, fontSize: 10, color: colors.muted }}>{abcPortalProfile.accountManagerPhone}</p>
                    </div>
                  </ContactCard>
                </SectionBody>
              </Section>
            </div>
          </ProfileGrid>
        ) : null}

        {tab === 'support' ? (
          <ProfileGrid>
            <Section style={{ marginTop: 0 }}>
              <SectionHead>
                <HeadCopy>
                  <small>Support</small>
                  <h2>Support enquiries</h2>
                  <p>
                    Enquiries create a ticket with an acknowledgement from the account team and a notification in the
                    internal workspace.
                  </p>
                </HeadCopy>
                <HeadActions>
                  <Button $variant="primary" $size="sm" type="button" onClick={() => setSupportOpen(true)}>
                    <MessageCircle size={13} /> New enquiry
                  </Button>
                </HeadActions>
              </SectionHead>
              <SectionBody>
                {abcSupport.map((ticket) => (
                  <TicketCard key={ticket.id}>
                    <ListTop>
                      <div>
                        <small>{ticket.id} · {ticket.category}</small>
                        <h4>{ticket.subject}</h4>
                      </div>
                      <ChipRow>
                        <StatusChip $tone={statusTone(ticket.status)}>{ticket.status}</StatusChip>
                        <StatusChip $tone={statusTone(ticket.priority)}>{ticket.priority}</StatusChip>
                      </ChipRow>
                    </ListTop>
                    <p>{ticket.message}</p>
                    <div style={{ marginTop: 3 }}>
                      {ticket.replies.map((reply) => (
                        <Reply key={reply.id}>
                          <strong>{reply.author} · {reply.role}</strong>
                          <p>{reply.message}</p>
                          <small>{formatDateTime(reply.time)}</small>
                        </Reply>
                      ))}
                    </div>
                  </TicketCard>
                ))}
                {!abcSupport.length ? (
                  <EmptyPanel>
                    <strong>No open enquiries</strong>
                    <p>Raise an enquiry and the account team will pick it up.</p>
                  </EmptyPanel>
                ) : null}
              </SectionBody>
            </Section>

            <Section style={{ marginTop: 0 }}>
              <SectionHead>
                <HeadCopy>
                  <small>Account team</small>
                  <h2>Talk to us</h2>
                </HeadCopy>
              </SectionHead>
              <SectionBody>
                <ContactCard>
                  <Avatar $size="lg">{initialsOf(customer?.owner || 'Neha Joshi')}</Avatar>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: colors.ink }}>{customer?.owner || 'Neha Joshi'}</p>
                    <p style={{ marginTop: 2, fontSize: 10, color: colors.muted }}>Account manager · Packaging consultant</p>
                    <p style={{ marginTop: 1, fontSize: 10, color: colors.muted }}>Mon–Sat · 9:00–18:30 IST</p>
                  </div>
                </ContactCard>
                <ContactLink href="tel:+919820011223">
                  <Phone size={12} /> +91 98200 11223
                </ContactLink>
                <ContactLink href="mailto:neha@starkpackmate.com">
                  <Mail size={12} /> neha@starkpackmate.com
                </ContactLink>
                {whatsapp.enabled ? (
                  <WhatsApp href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={13} /> Chat on WhatsApp
                  </WhatsApp>
                ) : null}
                <NoteBox style={{ marginTop: 11 }}>
                  <ShieldCheck size={13} /> Enquiries are stored in this browser session for the demo. Nothing leaves
                  your device and no email is sent.
                </NoteBox>
              </SectionBody>
            </Section>
          </ProfileGrid>
        ) : null}
      </Main>

      {/* RFQ modal */}
      <AppModal
        open={rfqOpen}
        onClose={() => setRfqOpen(false)}
        title="Submit a new RFQ"
        description="This writes a lead into CRM, assigns Neha Joshi and creates a follow-up task."
        size="md"
      >
        <Formik
          initialValues={{ product: '', quantity: '', deliveryCity: customer?.city || 'Mumbai', budget: '', message: '' }}
          validationSchema={rfqValidation}
          onSubmit={handleRfqSubmit}
        >
          <Form>
            <FormGrid>
              <TextField name="product" label="What do you need packaged?" placeholder="Food-grade carton for 300 g muesli" required />
              <TextField name="quantity" label="Approximate quantity" placeholder="150,000 cartons" required />
            </FormGrid>
            <FormGrid>
              <TextField name="deliveryCity" label="Primary delivery city" placeholder="Navi Mumbai" />
              <TextField name="budget" label="Indicative budget (₹, optional)" placeholder="2500000" />
            </FormGrid>
            <TextAreaField
              name="message"
              label="Brief"
              rows={4}
              placeholder="Pack size, barrier requirements, print colours, launch date and any food-safety certifications…"
              required
            />
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setRfqOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                <Send size={13} /> Submit RFQ
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      {/* Quote drawer */}
      <Drawer
        open={Boolean(quoteTarget)}
        onClose={() => setQuoteTarget(null)}
        title={quoteTarget ? `${quoteTarget.id} · ${quoteTarget.status}` : ''}
        description={quoteTarget ? `${quoteTarget.items.length} line items · valid until ${formatDate(quoteTarget.validUntil)}` : ''}
        width="560px"
        footer={
          quoteTarget ? (
            <DrawerActions>
              <Button $variant="secondary" $size="sm" type="button" onClick={() => setQuoteTarget(null)}>
                Close
              </Button>
              {quoteTarget.status === 'Sent' ? (
                <>
                  <Button $variant="ghost" $size="sm" type="button" onClick={() => { setDeclineTarget(quoteTarget); setQuoteTarget(null); }}>
                    Decline
                  </Button>
                  <Button $variant="primary" $size="sm" type="button" onClick={() => { setAcceptTarget(quoteTarget); setQuoteTarget(null); }}>
                    <CheckCircle2 size={13} /> Accept quotation
                  </Button>
                </>
              ) : null}
            </DrawerActions>
          ) : null
        }
      >
        {quoteTarget ? (
          <>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>
                  <StatusChip $tone={quoteTarget.status === 'Accepted' ? 'success' : statusTone(quoteTarget.status)}>
                    {quoteTarget.status}
                  </StatusChip>
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Total payable</DetailLabel>
                <DetailValue>{money(quoteTarget.total)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Issued</DetailLabel>
                <DetailValue>{formatDate(quoteTarget.date)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Valid until</DetailLabel>
                <DetailValue>{formatDate(quoteTarget.validUntil)}</DetailValue>
              </DetailItem>
            </DetailGrid>
            <LineTable>
              <LineHead>
                <span>Item</span>
                <span>Qty</span>
                <span>Rate</span>
                <span>Total</span>
              </LineHead>
              {quoteTarget.items.map((item) => (
                <LineRow key={item.description}>
                  <strong>{item.description}</strong>
                  <span>{formatNumber(item.qty)}</span>
                  <span>{money(item.rate)}</span>
                  <span>{money(item.qty * item.rate)}</span>
                </LineRow>
              ))}
            </LineTable>
            <Totals>
              <div>
                <small>Subtotal</small>
                <strong>{money(quoteTarget.subtotal)}</strong>
              </div>
              <div>
                <small>GST 18%</small>
                <strong>{money(quoteTarget.tax)}</strong>
              </div>
              <div>
                <small>Total</small>
                <strong>{money(quoteTarget.total)}</strong>
              </div>
            </Totals>
            {quoteTarget.specs ? (
              <Specs>
                <div>
                  <strong>Material</strong>
                  {quoteTarget.specs.material}
                </div>
                <div>
                  <strong>Print</strong>
                  {quoteTarget.specs.print}
                </div>
                <div>
                  <strong>Finish</strong>
                  {quoteTarget.specs.finish}
                </div>
                <div>
                  <strong>Packing</strong>
                  {quoteTarget.specs.packing}
                </div>
              </Specs>
            ) : null}
            <Timeline style={{ marginTop: 16 }}>
              {(quoteTarget.revisions || []).map((revision) => (
                <TimelineItem key={revision.id} $active={revision.status === 'Current'}>
                  <TimelineTitle>
                    Revision {revision.version} · {money(revision.total)}
                  </TimelineTitle>
                  <TimelineMeta>
                    {revision.status} · {formatDate(revision.date)} · {revision.by}
                  </TimelineMeta>
                </TimelineItem>
              ))}
            </Timeline>
          </>
        ) : null}
      </Drawer>

      {/* Accept quote confirm */}
      <ConfirmDialog
        open={Boolean(acceptTarget)}
        onClose={() => setAcceptTarget(null)}
        onConfirm={handleAcceptQuote}
        title="Accept this quotation?"
        message={
          acceptTarget
            ? `${acceptTarget.id} · ${money(acceptTarget.total)}. This creates a confirmed order, a production job card, the first artwork proof and an invoice. The sales, production and finance teams see the same records immediately.`
            : ''
        }
        confirmLabel="Accept & create order"
        tone="primary"
      />

      {/* Decline quote modal */}
      <AppModal
        open={Boolean(declineTarget)}
        onClose={() => { setDeclineTarget(null); setDeclineNote(''); }}
        title={declineTarget ? `Decline ${declineTarget.id}` : 'Decline quotation'}
        description="Sales receives the reason and a win-back follow-up is scheduled."
        size="sm"
      >
        <ModalLabel htmlFor="portal-decline-note">Reason for declining</ModalLabel>
        <TextArea
          id="portal-decline-note"
          value={declineNote}
          onChange={(event) => setDeclineNote(event.target.value)}
          placeholder="Rate is above our target for this launch. Please revisit after Q1…"
        />
        <FormActions>
          <Button $variant="secondary" $size="sm" type="button" onClick={() => { setDeclineTarget(null); setDeclineNote(''); }}>
            Cancel
          </Button>
          <Button
            $variant="danger"
            $size="sm"
            type="button"
            disabled={declineNote.trim().length < 6}
            onClick={handleDeclineQuote}
          >
            Decline quotation
          </Button>
        </FormActions>
      </AppModal>

      {/* Proof review modal */}
      <AppModal
        open={Boolean(proofTarget)}
        onClose={() => { setProofTarget(null); setProofNote(''); }}
        title={proofTarget ? `Review ${proofTarget.id}` : 'Review proof'}
        description={proofTarget ? `${proofTarget.product} · ${proofTarget.version} · due ${formatDate(proofTarget.due)}` : ''}
        size="lg"
      >
        {proofTarget ? (
          <>
            <ProofModalImage>
              <Image
                src={proofTarget.preview || '/images/folding-cartons.jpg'}
                alt={`${proofTarget.product} proof`}
                fill
                sizes="640px"
              />
            </ProofModalImage>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Proof status</DetailLabel>
                <DetailValue>{proofTarget.proofStatus}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Files</DetailLabel>
                <DetailValue>{proofTarget.fileType}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Colours</DetailLabel>
                <DetailValue>{proofTarget.colours}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Designer</DetailLabel>
                <DetailValue>{proofTarget.designer}</DetailValue>
              </DetailItem>
            </DetailGrid>
            <NoteBox style={{ marginTop: 12 }}>
              <AlertCircle size={13} /> {proofTarget.notes}
            </NoteBox>
            <div style={{ marginTop: 13 }}>
              <ModalLabel htmlFor="portal-proof-note">Corrections (required if you request changes)</ModalLabel>
              <TextArea
                id="portal-proof-note"
                value={proofNote}
                onChange={(event) => setProofNote(event.target.value)}
                placeholder="Move the FSSAI block 3 mm left and increase the batch code size…"
              />
            </div>
            <FormActions>
              <Button $variant="secondary" $size="sm" type="button" onClick={() => { setProofTarget(null); setProofNote(''); }}>
                Close
              </Button>
              <Button
                $variant="ghost"
                $size="sm"
                type="button"
                disabled={proofNote.trim().length < 6}
                onClick={() => handleProofDecision('Changes requested')}
              >
                <UploadCloud size={13} /> Request corrections
              </Button>
              <Button $variant="primary" $size="sm" type="button" onClick={() => handleProofDecision('Approved')}>
                <CheckCircle2 size={13} /> Approve proof
              </Button>
            </FormActions>
          </>
        ) : null}
      </AppModal>

      {/* Order tracking drawer */}
      <Drawer
        open={Boolean(trackTarget)}
        onClose={() => setTrackTarget(null)}
        title={trackTarget ? trackTarget.id : 'Track order'}
        description={trackTarget ? trackTarget.items.map((item) => item.description).join(' · ') : ''}
        width="520px"
        footer={
          trackTarget ? (
            <DrawerActions>
              <Button $variant="secondary" $size="sm" type="button" onClick={() => setTrackTarget(null)}>
                Close
              </Button>
              <Button $variant="ghost" $size="sm" type="button" onClick={() => downloadOrder(trackTarget)}>
                <Download size={12} /> Summary
              </Button>
              <Button $variant="primary" $size="sm" type="button" onClick={() => { setRepeatTarget(trackTarget); setTrackTarget(null); }}>
                <RefreshCw size={12} /> Repeat order
              </Button>
            </DrawerActions>
          ) : null
        }
      >
        {trackTarget ? (
          <>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>
                  <StatusChip $tone={statusTone(trackTarget.status)}>{trackTarget.status}</StatusChip>
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Due date</DetailLabel>
                <DetailValue>{formatDate(trackTarget.dueDate)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Order value</DetailLabel>
                <DetailValue>{money(trackTarget.value)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Payment</DetailLabel>
                <DetailValue>{trackTarget.payment?.paymentStatus || 'Unpaid'}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <div style={{ margin: '16px 0 14px' }}>
              <ProgressTrack>
                <ProgressFill $value={trackTarget.progress} $tone={trackTarget.progress >= 85 ? 'success' : 'info'} />
              </ProgressTrack>
              <p style={{ marginTop: 5, fontSize: 9.5, color: colors.muted }}>{trackTarget.progress}% complete</p>
            </div>

            {(() => {
              const job = abcJobs.find((entry) => entry.orderId === trackTarget.id);
              const activeIndex = orderStageIndex(trackTarget);
              return (
                <>
                  {job ? (
                    <NoteBox style={{ marginBottom: 12 }}>
                      <Factory size={13} /> Job card {job.id} · {job.stage} · {job.machine} · operator {job.operator}
                    </NoteBox>
                  ) : null}
                  <Timeline>
                    {ORDER_STAGES.map((stage, index) => {
                      const done = index <= activeIndex;
                      return (
                        <TimelineItem key={stage} $active={index === activeIndex}>
                          <TimelineTitle style={{ color: done ? colors.ink : colors.muted }}>
                            {stage === 'QC' ? 'Quality check' : stage}
                          </TimelineTitle>
                          <TimelineMeta>
                            {index < activeIndex ? 'Completed' : index === activeIndex ? 'Current stage' : 'Scheduled'}
                          </TimelineMeta>
                        </TimelineItem>
                      );
                    })}
                  </Timeline>
                </>
              );
            })()}

            <Divider style={{ margin: '15px 0' }} />
            <p
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.faint,
                marginBottom: 7,
              }}
            >
              Order timeline
            </p>
            <Timeline>
              {(trackTarget.timeline || [])
                .slice()
                .reverse()
                .slice(0, 7)
                .map((event) => (
                  <TimelineItem key={event.id} $active={event.done}>
                    <TimelineTitle>{event.label}</TimelineTitle>
                    <TimelineMeta>
                      {formatDate(event.date)} · {event.note}
                    </TimelineMeta>
                  </TimelineItem>
                ))}
            </Timeline>

            <NoteBox style={{ marginTop: 14 }}>
              <Truck size={13} /> {trackTarget.delivery?.status || 'Pending dispatch'}
              {trackTarget.delivery?.carrier && trackTarget.delivery.carrier !== '—'
                ? ` · ${trackTarget.delivery.carrier} · ${trackTarget.delivery.tracking}`
                : ' · tracking appears once dispatched'}
            </NoteBox>
          </>
        ) : null}
      </Drawer>

      {/* Repeat order confirm */}
      <ConfirmDialog
        open={Boolean(repeatTarget)}
        onClose={() => setRepeatTarget(null)}
        onConfirm={handleRepeatOrder}
        title="Request a repeat order?"
        message={
          repeatTarget
            ? `A new confirmed order will be cloned from ${repeatTarget.id}, with a production job card and an artwork request. Sales and production see it immediately.`
            : ''
        }
        confirmLabel="Create repeat order"
        tone="primary"
      />

      {/* Payment modal */}
      <AppModal
        open={Boolean(paymentTarget)}
        onClose={() => setPaymentTarget(null)}
        title={paymentTarget ? `Report payment · ${paymentTarget.id}` : 'Report payment'}
        description="Demo action: a finance receipt is recorded immediately in this browser session."
        size="sm"
      >
        {paymentTarget ? (
          <>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Invoice</DetailLabel>
                <DetailValue>{paymentTarget.id}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Outstanding</DetailLabel>
                <DetailValue>{money(dueForPayment)}</DetailValue>
              </DetailItem>
            </DetailGrid>
            <div style={{ marginTop: 12 }}>
              <ModalLabel htmlFor="portal-payment-amount">Amount (₹)</ModalLabel>
              <PlainInput
                id="portal-payment-amount"
                name="portal-payment-amount"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                type="number"
                min="0"
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <ModalLabel htmlFor="portal-payment-method">Method</ModalLabel>
              <PlainSelect
                id="portal-payment-method"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="UPI">UPI</option>
              </PlainSelect>
            </div>
            <FormActions>
              <Button $variant="secondary" $size="sm" type="button" onClick={() => setPaymentTarget(null)}>
                Cancel
              </Button>
              <Button $variant="primary" $size="sm" type="button" onClick={submitPayment}>
                <Wallet size={13} /> Report payment
              </Button>
            </FormActions>
          </>
        ) : null}
      </AppModal>

      {/* Profile modal */}
      <AppModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Edit company profile"
        description="Updates the CRM customer and primary contact records."
        size="md"
      >
        <Formik
          initialValues={{
            company: customer?.company || ABC_COMPANY,
            contactName: customer?.contact || 'Ritu Bansal',
            email: customer?.email || 'ritu.bansal@abcfoods.in',
            phone: customer?.phone || '+91 98204 33718',
            city: customer?.city || 'Mumbai',
            gstin: customer?.gstin || '27AABCA9472Q1Z3',
            paymentTerms: customer?.paymentTerms || 'Net 30',
          }}
          validationSchema={profileValidation}
          onSubmit={handleProfileSave}
        >
          <Form>
            <FormGrid>
              <TextField name="company" label="Company name" required />
              <TextField name="contactName" label="Primary contact" required />
            </FormGrid>
            <FormGrid>
              <TextField name="email" label="Email" type="email" required />
              <TextField name="phone" label="Phone" required />
            </FormGrid>
            <FormGrid>
              <TextField name="city" label="City" />
              <TextField name="gstin" label="GSTIN" />
            </FormGrid>
            <SelectField
              name="paymentTerms"
              label="Payment terms"
              options={[
                { value: 'Net 15', label: 'Net 15' },
                { value: 'Net 30', label: 'Net 30' },
                { value: 'Net 45', label: 'Net 45' },
                { value: 'Net 60', label: 'Net 60' },
              ]}
            />
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                Save changes
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      {/* Support modal */}
      <AppModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        title="Submit a support enquiry"
        description="Creates a ticket and notifies the account team in the demo workspace."
        size="md"
      >
        <Formik
          initialValues={{ category: 'Artwork', priority: 'Normal', subject: '', message: '' }}
          validationSchema={supportValidation}
          onSubmit={handleSupportSubmit}
        >
          <Form>
            <FormGrid>
              <SelectField
                name="category"
                label="Category"
                options={[
                  { value: 'Artwork', label: 'Artwork' },
                  { value: 'Production', label: 'Production' },
                  { value: 'Delivery', label: 'Delivery' },
                  { value: 'Invoice', label: 'Invoice' },
                  { value: 'Quality', label: 'Quality' },
                  { value: 'General', label: 'General' },
                ]}
              />
              <SelectField
                name="priority"
                label="Priority"
                options={[
                  { value: 'Normal', label: 'Normal' },
                  { value: 'High', label: 'High' },
                  { value: 'Urgent', label: 'Urgent' },
                ]}
              />
            </FormGrid>
            <TextField name="subject" label="Subject" placeholder="Split delivery for PO ABC/PO/2026/0714" required />
            <TextAreaField
              name="message"
              label="How can we help?"
              rows={4}
              placeholder="Share the requirement, affected order and any deadline…"
              required
            />
            <FormActions>
              <Button type="button" $variant="secondary" $size="sm" onClick={() => setSupportOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" $size="sm">
                <Send size={13} /> Send enquiry
              </Button>
            </FormActions>
          </Form>
        </Formik>
      </AppModal>

      {/* Notifications drawer */}
      <Drawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="Portal updates"
        description={`${abcNotifications.length} events linked to ${ABC_COMPANY}`}
        width="420px"
        footer={
          <DrawerActions>
            <Button $variant="secondary" $size="sm" type="button" onClick={() => setNotifOpen(false)}>
              Close
            </Button>
            <Button $variant="primary" $size="sm" type="button" onClick={() => { markAllNotificationsRead(); notify('All caught up', 'Portal updates marked as read.', 'success'); }}>
              <Check size={12} /> Mark all read
            </Button>
          </DrawerActions>
        }
      >
        {abcNotifications.length ? (
          abcNotifications.map((entry) => (
            <NotifRow key={entry.id} $unread={!entry.read}>
              <i />
              <UpdateBody>
                <strong>{entry.title}</strong>
                <p>{entry.body}</p>
                <small>{formatDateTime(entry.time)}</small>
              </UpdateBody>
            </NotifRow>
          ))
        ) : (
          <EmptyPanel>
            <strong>No updates yet</strong>
            <p>Workflow events will be listed here.</p>
          </EmptyPanel>
        )}
      </Drawer>
    </PortalRoot>
  );
}
