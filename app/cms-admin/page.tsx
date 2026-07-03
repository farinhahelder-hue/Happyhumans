'use client';
import React from 'react';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import EnhancedRichContent from '@/components/EnhancedRichContent';
import { bustCmsCache } from '@/hooks/useCmsContent';
import MediaLibrary from '@/components/MediaLibrary';
import { sanitizeHtml } from '@/lib/sanitize-html';
import CarouselEditor from '@/components/admin/CarouselEditor';
import CarouselGenerator from '@/components/admin/CarouselGenerator';
import BlogGenerator from '@/components/admin/BlogGenerator';
import { PAGE_DEFAULTS } from '@/lib/cms-page-defaults';
import { THEMES } from '@/components/DynamicTheme';
import { NavItem } from '@/hooks/useCmsNavigation';

const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false });

// ─── Types ───────────────────────────────────────────────────
type Article = {
  id: number; title: string; slug: string; category: string;
  published: boolean; published_at: string; created_at: string;
  excerpt: string; featured_image: string; content?: string; voice_notes?: string;
};

type Demande = {
  id: string; prenom: string; nom: string; email: string;
  telephone: string; destination: string; style_voyage: string;
  duree_jours: number; budget_fourchette: string; nb_voyageurs: number;
  mois_depart: string; notes: string; statut: string; created_at: string;
};

type Setting = { id: number; key: string; value: string; label: string; group_name: string; type?: string; };
type SiteContent = { id: number; page: string; block_key: string; value: string; label: string; type: string; };

type BookingSlot = {
  id: string; slot_date: string; slot_time: string;
  slot_type: 'coaching' | 'discovery' | 'enterprise';
  duration_minutes: number; status: 'available' | 'booked' | 'cancelled';
  notes: string | null; created_at: string;
};

type BookingRequest = {
  id: string; slot_id: string; client_name: string; client_email: string;
  client_phone: string | null; message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string; booking_slots?: BookingSlot;
};

type ContactMessage = {
  id: string; name: string; email: string; message: string;
  type: string; status: 'unread' | 'read' | 'replied';
  created_at: string;
};

// ─── Helpers ─────────────────────────────────────────────────
const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
const slug = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function normalizeArticleDraft(article: Partial<Article> | null | undefined) {
  return {
    id: article?.id ?? null,
    title: article?.title ?? '',
    slug: article?.slug ?? '',
    category: article?.category ?? '',
    excerpt: article?.excerpt ?? '',
    featured_image: article?.featured_image ?? '',
    content: article?.content ?? '',
    voice_notes: article?.voice_notes ?? '',
    published: Boolean(article?.published),
  };
}

function getArticleDraftSignature(article: Partial<Article> | null | undefined) {
  return JSON.stringify(normalizeArticleDraft(article));
}

function getWordCount(content?: string) {
  if (!content) return 0;
  return content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function getReadTimeMinutes(content?: string) {
  const words = getWordCount(content);
  return words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
}

// ─── Config pages CMS ─────────────────────────────────────────
const PAGES_CONFIG: Record<string, { label: string; emoji: string; sections: { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'richtext' | 'select'; options?: string[]; optionLabels?: string[] }[] }> = {
  // ── Ordre du panneau gauche ──────────────────────────────────
  // 1. Accueil
  'home': {
    label: 'Accueil',
    emoji: '🏠',
    sections: [
      // Hero
      { key: 'hero_badge',            label: 'Hero — Badge (ex: Monica Schneider · Executive Coach)',  type: 'text' },
      { key: 'hero_title',            label: 'Hero — Titre principal',                                type: 'text' },
      { key: 'hero_subtitle',         label: 'Hero — Sous-titre / certifications',                   type: 'textarea' },
      { key: 'hero_cta_primary',      label: 'Hero — Bouton principal',                              type: 'text' },
      { key: 'hero_cta_contact',      label: 'Hero — Bouton contact',                                type: 'text' },
      // Services
      { key: 'services_badge',        label: 'Services — Badge section',                             type: 'text' },
      { key: 'services_title',        label: 'Services — Titre section',                             type: 'text' },
      { key: 'services_b2c_title',    label: 'Services — Particuliers : Titre',                      type: 'text' },
      { key: 'services_b2c_text',     label: 'Services — Particuliers : Texte',                      type: 'textarea' },
      { key: 'services_b2c_cta',      label: 'Services — Particuliers : Bouton',                     type: 'text' },
      { key: 'services_b2b_title',    label: 'Services — Organisations : Titre',                     type: 'text' },
      { key: 'services_b2b_text',     label: 'Services — Organisations : Texte',                      type: 'textarea' },
      { key: 'services_b2b_cta',      label: 'Services — Organisations : Bouton',                    type: 'text' },
      // Cards section
      { key: 'cards_section_badge',   label: 'Cartes — Badge section',                              type: 'text' },
      { key: 'cards_section_title',  label: 'Cartes — Titre section',                               type: 'text' },
      { key: 'cards_link_label',     label: 'Cartes — Label lien "Découvrir"',                      type: 'text' },
      // Ordre des rubriques (accueil)
      { key: 'home_card_order_1', label: 'Ordre — Position 1', type: 'select',
        options: ['coaching', 'organisations', 'happiness-design', 'relations'],
        optionLabels: ['⭐ Coaching', '🏢 Organisations', '☀️ Happiness Design', '💚 Relations'] },
      { key: 'home_card_order_2', label: 'Ordre — Position 2', type: 'select',
        options: ['coaching', 'organisations', 'happiness-design', 'relations'],
        optionLabels: ['⭐ Coaching', '🏢 Organisations', '☀️ Happiness Design', '💚 Relations'] },
      { key: 'home_card_order_3', label: 'Ordre — Position 3', type: 'select',
        options: ['coaching', 'organisations', 'happiness-design', 'relations'],
        optionLabels: ['⭐ Coaching', '🏢 Organisations', '☀️ Happiness Design', '💚 Relations'] },
      { key: 'home_card_order_4', label: 'Ordre — Position 4', type: 'select',
        options: ['coaching', 'organisations', 'happiness-design', 'relations'],
        optionLabels: ['⭐ Coaching', '🏢 Organisations', '☀️ Happiness Design', '💚 Relations'] },
      // Booking
      { key: 'booking_badge',        label: 'Booking — Badge',                                       type: 'text' },
      { key: 'booking_modal_title',  label: 'Booking modal — Titre',                                type: 'text' },
      { key: 'booking_modal_subtitle', label: 'Booking modal — Sous-titre',                         type: 'textarea' },
      // Contact section
      { key: 'contact_section_badge',   label: 'Contact — Badge section',                            type: 'text' },
      { key: 'contact_section_title',  label: 'Contact — Titre section',                            type: 'text' },
      { key: 'contact_section_subtitle', label: 'Contact — Sous-titre section',                    type: 'text' },
      { key: 'form_success_title',   label: 'Formulaire — Titre succès',                           type: 'text' },
      { key: 'form_success_body',    label: 'Formulaire — Corps succès',                           type: 'text' },
      { key: 'form_sending',         label: 'Formulaire — Texte envoi',                            type: 'text' },
      { key: 'form_submit',          label: 'Formulaire — Bouton envoi',                           type: 'text' },
      { key: 'contact_email',        label: 'Email contact',                                       type: 'text' },
    ],
  },
  // 2. À propos
  'a-propos': {
    label: 'À propos',
    emoji: '👋',
    sections: [
      { key: 'hero_image',        label: 'Photo principale (hero)',         type: 'image' },
      { key: 'hero_badge',        label: 'Badge hero',                     type: 'text' },
      { key: 'page_title',        label: 'Titre de la page',               type: 'text' },
      { key: 'intro_text',        label: "Texte d'introduction",           type: 'richtext' },
      { key: 'bio_badge',         label: 'Section bio — Badge',            type: 'text' },
      { key: 'bio_title',         label: 'Section bio — Titre',            type: 'text' },
      { key: 'bio_text',          label: 'Section bio — Texte',            type: 'richtext' },
      { key: 'photo',             label: 'Photo Monica',                   type: 'image' },
      { key: 'coaching_label',    label: 'Section coaching — Label',       type: 'text' },
      { key: 'coaching_text1',    label: 'Section coaching — Texte 1',     type: 'richtext' },
      { key: 'coaching_text2',    label: 'Section coaching — Texte 2',     type: 'richtext' },
      { key: 'coaching_cta',      label: 'Section coaching — CTA',         type: 'text' },
      { key: 'mentoring_label',   label: 'Section mentoring — Label',      type: 'text' },
      { key: 'mentoring_text',    label: 'Section mentoring — Texte',      type: 'richtext' },
      { key: 'mentoring_cta',      label: 'Section mentoring — CTA',       type: 'text' },
      { key: 'acc_badge',         label: 'Section accompagnement — Badge', type: 'text' },
      { key: 'acc_title',         label: 'Section accompagnement — Titre', type: 'text' },
      { key: 'acc_subtitle',      label: 'Section accompagnement — Sous-titre', type: 'text' },
      { key: 'hd_badge',          label: 'Section HD — Badge',             type: 'text' },
      { key: 'hd_text',           label: 'Section HD — Texte',             type: 'textarea' },
      { key: 'hd_cta',            label: 'Section HD — CTA',               type: 'text' },
      { key: 'footer_cta_title',  label: 'Footer CTA — Titre',             type: 'text' },
      { key: 'footer_cta_coaching', label: 'Footer CTA — Coaching',        type: 'text' },
      { key: 'footer_cta_booking',  label: 'Footer CTA — Réservation',     type: 'text' },
    ],
  },
  // 3. Coaching
  'coaching': {
    label: 'Coaching',
    emoji: '⭐',
    sections: [
      { key: 'hero_image',          label: 'Image hero',                    type: 'image' },
      { key: 'hero_badge',          label: 'Hero — Badge',                  type: 'text' },
      { key: 'hero_title',          label: 'Hero — Titre',                  type: 'text' },
      { key: 'hero_subtitle',       label: 'Hero — Sous-titre',             type: 'textarea' },
      { key: 'hero_cta_primary',    label: 'Hero — CTA principal',          type: 'text' },
      { key: 'hero_cta_contact',    label: 'Hero — CTA contact',            type: 'text' },
      { key: 'coaching_b2c_badge',  label: 'Coaching B2C — Badge',          type: 'text' },
      { key: 'coaching_b2c_image',  label: 'Coaching individuel — Image',   type: 'image' },
      { key: 'coaching_b2c_title',  label: 'Coaching individuel — Titre',   type: 'text' },
      { key: 'coaching_b2c_text',   label: 'Coaching individuel — Texte',   type: 'richtext' },
      { key: 'coaching_b2c_cta_link', label: 'Coaching B2C — CTA lien',    type: 'text' },
      { key: 'coaching_b2b_badge',  label: 'Coaching B2B — Badge',         type: 'text' },
      { key: 'coaching_b2b_image',  label: 'Coaching entreprises — Image',   type: 'image' },
      { key: 'coaching_b2b_title',  label: 'Coaching entreprises — Titre',  type: 'text' },
      { key: 'coaching_b2b_text',   label: 'Coaching entreprises — Texte', type: 'richtext' },
      { key: 'coaching_b2b_cta_link', label: 'Coaching B2B — CTA lien',    type: 'text' },
      // Tarifs programmes
      { key: 'programs_badge',      label: 'Tarifs — Badge',               type: 'text' },
      { key: 'programs_title',      label: 'Tarifs — Titre',               type: 'text' },
      { key: 'program_1_label',     label: 'Programme 1 — Label',          type: 'text' },
      { key: 'program_1_desc',      label: 'Programme 1 — Description',   type: 'textarea' },
      { key: 'program_1_price',     label: 'Programme 1 — Prix',           type: 'text' },
      { key: 'program_1_unit',      label: 'Programme 1 — Unité',          type: 'text' },
      { key: 'program_1_cta',       label: 'Programme 1 — CTA',            type: 'text' },
      { key: 'program_2_label',     label: 'Programme 2 — Label',          type: 'text' },
      { key: 'program_2_desc',      label: 'Programme 2 — Description',   type: 'textarea' },
      { key: 'program_2_price',     label: 'Programme 2 — Prix',           type: 'text' },
      { key: 'program_2_unit',     label: 'Programme 2 — Unité',          type: 'text' },
      { key: 'program_2_cta',       label: 'Programme 2 — CTA',            type: 'text' },
      { key: 'program_3_label',     label: 'Programme 3 — Label',          type: 'text' },
      { key: 'program_3_desc',      label: 'Programme 3 — Description',   type: 'textarea' },
      { key: 'program_3_price',     label: 'Programme 3 — Prix',           type: 'text' },
      { key: 'program_3_format',    label: 'Programme 3 — Format',        type: 'text' },
      { key: 'program_3_cta',       label: 'Programme 3 — CTA',            type: 'text' },
      { key: 'program_hd_label',    label: 'Programme HD — Label',         type: 'text' },
      { key: 'program_hd_unit',     label: 'Programme HD — Unité',        type: 'text' },
      { key: 'program_hd_desc',     label: 'Programme HD — Description',  type: 'textarea' },
      { key: 'program_hd_cta',      label: 'Programme HD — CTA',          type: 'text' },
      // Tunnel CTA
      { key: 'tunnel_title',              label: 'Tunnel rapide — Titre',       type: 'text' },
      { key: 'tunnel_cta_primary',       label: 'Tunnel rapide — Bouton principal', type: 'text' },
      { key: 'tunnel_cta_secondary',     label: 'Tunnel rapide — Bouton secondaire',type: 'text' },
      { key: 'tunnel_reassurance',      label: 'Tunnel rapide — Réassurance', type: 'text' },
      // Témoignages
      { key: 'testimonials_badge',      label: 'Témoignages — Badge',         type: 'text' },
      { key: 'testimonials_title',      label: 'Témoignages — Titre',         type: 'text' },
      { key: 'testimonials_footnote',  label: 'Témoignages — Note',          type: 'text' },
      { key: 'testimonial_1_quote',     label: 'Témoignage 1 — Texte',        type: 'textarea' },
      { key: 'testimonial_1_name',      label: 'Témoignage 1 — Auteur',      type: 'text' },
      { key: 'testimonial_1_title',     label: 'Témoignage 1 — Poste',       type: 'text' },
      { key: 'testimonial_2_quote',    label: 'Témoignage 2 — Texte',        type: 'textarea' },
      { key: 'testimonial_2_name',      label: 'Témoignage 2 — Auteur',      type: 'text' },
      { key: 'testimonial_2_title',    label: 'Témoignage 2 — Poste',       type: 'text' },
      { key: 'testimonial_3_quote',    label: 'Témoignage 3 — Texte',        type: 'textarea' },
      { key: 'testimonial_3_name',      label: 'Témoignage 3 — Auteur',      type: 'text' },
      { key: 'testimonial_3_title',    label: 'Témoignage 3 — Poste',       type: 'text' },
      // Form
      { key: 'form_cta_title',          label: 'Formulaire CTA — Titre',      type: 'textarea' },
      { key: 'form_cta_button',        label: 'Formulaire CTA — Bouton',     type: 'text' },
      { key: 'form_intro',             label: 'Intro formulaire',            type: 'textarea' },
      { key: 'reassurance',            label: 'Texte réassurance',          type: 'text' },
    ],
  },
  // 4. Sparring Partner
  'entreprises': {
    label: 'Organisations',
    emoji: '🏢',
    sections: [
      { key: 'hero_image',   label: 'Image hero',                   type: 'image' },
      { key: 'page_title',   label: 'Titre de la page',             type: 'text' },
      { key: 'intro_text',   label: "Texte d'introduction",         type: 'richtext' },
      { key: 'section_image',label: 'Image section principale',     type: 'image' },
      { key: 'section_title',label: 'Titre section',                type: 'text' },
      { key: 'section_text', label: 'Texte section',                type: 'richtext' },
      // Offres
      { key: 'offres_badge',   label: 'Offres — Badge',            type: 'text' },
      { key: 'offres_cta',     label: 'Offres — CTA',              type: 'text' },
      // Domaines
      { key: 'domains_badge',     label: 'Domaines — Badge',        type: 'text' },
      { key: 'domains_title',     label: 'Domaines — Titre',        type: 'text' },
      { key: 'domains_subtitle',  label: 'Domaines — Sous-titre',  type: 'textarea' },
      { key: 'domain_1_title',    label: 'Domaine 1 — Titre',       type: 'text' },
      { key: 'domain_1_desc',      label: 'Domaine 1 — Description', type: 'textarea' },
      { key: 'domain_2_title',    label: 'Domaine 2 — Titre',       type: 'text' },
      { key: 'domain_2_desc',      label: 'Domaine 2 — Description', type: 'textarea' },
      { key: 'domain_3_title',    label: 'Domaine 3 — Titre',       type: 'text' },
      { key: 'domain_3_desc',      label: 'Domaine 3 — Description', type: 'textarea' },
      { key: 'domain_4_title',    label: 'Domaine 4 — Titre',       type: 'text' },
      { key: 'domain_4_desc',      label: 'Domaine 4 — Description', type: 'textarea' },
      { key: 'domain_5_title',    label: 'Domaine 5 — Titre',       type: 'text' },
      { key: 'domain_5_desc',      label: 'Domaine 5 — Description', type: 'textarea' },
      { key: 'domain_6_title',    label: 'Domaine 6 — Titre',       type: 'text' },
      { key: 'domain_6_desc',      label: 'Domaine 6 — Description', type: 'textarea' },
      // Flash coaching
      { key: 'flash_badge',       label: 'Flash — Badge',            type: 'text' },
      { key: 'flash_title',       label: 'Flash — Titre',            type: 'text' },
      { key: 'flash_desc',        label: 'Flash — Description',      type: 'textarea' },
      { key: 'flash_features',    label: 'Flash — Caractéristiques', type: 'textarea' },
      { key: 'flash_format',      label: 'Flash — Format',          type: 'text' },
      { key: 'flash_rythme',      label: 'Flash — Rythme',           type: 'text' },
      { key: 'flash_tarif',       label: 'Flash — Tarif',            type: 'text' },
      { key: 'flash_cta_link',    label: 'Flash — CTA lien',        type: 'text' },
      // Sparring
      { key: 'sparring_badge',    label: 'Sparring — Badge',         type: 'text' },
      { key: 'sparring_title',    label: 'Sparring — Titre',         type: 'text' },
      { key: 'sparring_desc',     label: 'Sparring — Description',   type: 'textarea' },
      { key: 'sparring_features', label: 'Sparring — Caractéristiques', type: 'textarea' },
      { key: 'sparring_cta_link', label: 'Sparring — CTA lien',    type: 'text' },
      // CTA final
      { key: 'cta_title',         label: 'CTA final — Titre',       type: 'text' },
      { key: 'cta_button',        label: 'CTA final — Bouton',       type: 'text' },
      // Pricing
      { key: 'pricing_badge',     label: 'Pricing — Badge',          type: 'text' },
      { key: 'pricing_title',     label: 'Pricing — Titre',          type: 'text' },
      { key: 'pricing_subtitle', label: 'Pricing — Sous-titre',    type: 'textarea' },
      { key: 'pricing_card_1_title',  label: 'Prix carte 1 — Titre',    type: 'text' },
      { key: 'pricing_card_1_desc',   label: 'Prix carte 1 — Description', type: 'textarea' },
      { key: 'pricing_card_1_price',   label: 'Prix carte 1 — Prix',     type: 'text' },
      { key: 'pricing_card_1_cta',    label: 'Prix carte 1 — CTA',      type: 'text' },
      { key: 'pricing_card_2_title',  label: 'Prix carte 2 — Titre',    type: 'text' },
      { key: 'pricing_card_2_desc',   label: 'Prix carte 2 — Description', type: 'textarea' },
      { key: 'pricing_card_2_price',   label: 'Prix carte 2 — Prix',     type: 'text' },
      { key: 'pricing_card_2_cta',    label: 'Prix carte 2 — CTA',      type: 'text' },
      { key: 'pricing_card_3_title',  label: 'Prix carte 3 — Titre',    type: 'text' },
      { key: 'pricing_card_3_desc',   label: 'Prix carte 3 — Description', type: 'textarea' },
      { key: 'pricing_card_3_price',   label: 'Prix carte 3 — Prix',     type: 'text' },
      { key: 'pricing_card_3_cta',    label: 'Prix carte 3 — CTA',      type: 'text' },
      // Différenciateur
      { key: 'diff_badge',       label: 'Diff — Badge',             type: 'text' },
      { key: 'diff_title',      label: 'Diff — Titre',             type: 'text' },
      { key: 'diff_text',       label: 'Diff — Texte',             type: 'textarea' },
      { key: 'diff_cta_link',   label: 'Diff — CTA lien',         type: 'text' },
    ],
  },
  // 6. Happiness Design
  'sparring_partner': {
    label: 'Sparring Partner',
    emoji: '🤝',
    sections: [
      { key: 'hero_image',         label: 'Image hero',                    type: 'image' },
      { key: 'hero_badge',         label: 'Hero — Badge',                  type: 'text' },
      { key: 'hero_title',         label: 'Hero — Titre',                  type: 'text' },
      { key: 'hero_desc',          label: 'Hero — Description',            type: 'textarea' },
      { key: 'hero_cta_primary',   label: 'Hero — CTA principal',          type: 'text' },
      { key: 'hero_cta_secondary', label: 'Hero — CTA secondaire',          type: 'text' },
      { key: 'section_badge',     label: 'Section use cases — Badge',      type: 'text' },
      { key: 'section_title',      label: 'Section use cases — Titre',      type: 'text' },
      { key: 'use_case_1_title',   label: 'Use case 1 — Titre',             type: 'text' },
      { key: 'use_case_1_desc',    label: 'Use case 1 — Description',      type: 'textarea' },
      { key: 'use_case_2_title',   label: 'Use case 2 — Titre',             type: 'text' },
      { key: 'use_case_2_desc',    label: 'Use case 2 — Description',      type: 'textarea' },
      { key: 'use_case_3_title',   label: 'Use case 3 — Titre',             type: 'text' },
      { key: 'use_case_3_desc',    label: 'Use case 3 — Description',      type: 'textarea' },
      { key: 'use_case_4_title',   label: 'Use case 4 — Titre',             type: 'text' },
      { key: 'use_case_4_desc',    label: 'Use case 4 — Description',      type: 'textarea' },
      { key: 'use_case_5_title',   label: 'Use case 5 — Titre',             type: 'text' },
      { key: 'use_case_5_desc',    label: 'Use case 5 — Description',      type: 'textarea' },
      { key: 'why_section_badge',  label: 'Section pourquoi — Badge',       type: 'text' },
      { key: 'why_section_title',  label: 'Section pourquoi — Titre',      type: 'text' },
      { key: 'experience_items',   label: 'Expériences (séparées par \\n)', type: 'textarea' },
      { key: 'cta_title',          label: 'CTA final — Titre',              type: 'text' },
      { key: 'cta_desc',           label: 'CTA final — Description',       type: 'textarea' },
      { key: 'cta_primary',        label: 'CTA final — Bouton principal',  type: 'text' },
      { key: 'cta_secondary',     label: 'CTA final — Bouton secondaire', type: 'text' },
      { key: 'sparring_price',    label: 'Prix',                         type: 'text' },
    ],
  },
  // 5. Organisations (Entreprises)
  'happiness-design': {
    label: 'Happiness Design',
    emoji: '☀️',
    sections: [
      { key: 'hero_badge',         label: 'Hero — Badge',               type: 'text' },
      { key: 'hero_title',        label: 'Hero — Titre',               type: 'text' },
      { key: 'hero_subtitle',     label: 'Hero — Sous-titre',          type: 'textarea' },
      { key: 'hero_cta',          label: 'Hero — CTA',                 type: 'text' },
      // Pourquoi
      { key: 'pourquoi_badge',    label: 'Pourquoi — Badge',           type: 'text' },
      { key: 'pourquoi_title',    label: 'Pourquoi — Titre',           type: 'text' },
      { key: 'pourquoi_1_title',  label: 'Pourquoi 1 — Titre',         type: 'text' },
      { key: 'pourquoi_1_desc',   label: 'Pourquoi 1 — Description',  type: 'textarea' },
      { key: 'pourquoi_2_title',  label: 'Pourquoi 2 — Titre',         type: 'text' },
      { key: 'pourquoi_2_desc',   label: 'Pourquoi 2 — Description',  type: 'textarea' },
      { key: 'pourquoi_3_title',  label: 'Pourquoi 3 — Titre',         type: 'text' },
      { key: 'pourquoi_3_desc',   label: 'Pourquoi 3 — Description',  type: 'textarea' },
      // Programme
      { key: 'program_badge',           label: 'Programme — Badge',             type: 'text' },
      { key: 'program_title',          label: 'Programme — Titre',             type: 'text' },
      { key: 'program_followups_note',  label: 'Programme — Note follow-ups',  type: 'text' },
      // Outils
      { key: 'tools_badge',        label: 'Outils — Badge',            type: 'text' },
      { key: 'tools_title',        label: 'Outils — Titre',            type: 'text' },
      { key: 'tools_origin_text', label: 'Outils — Texte origine',    type: 'textarea' },
      // Pricing
      { key: 'pricing_badge',     label: 'Pricing — Badge',           type: 'text' },
      { key: 'pricing_title',     label: 'Pricing — Titre',           type: 'text' },
      { key: 'program_complete_label',   label: 'Prog complet — Label',    type: 'text' },
      { key: 'program_complete_unit',    label: 'Prog complet — Unité',     type: 'text' },
      { key: 'program_complete_features', label: 'Prog complet — Caractéristiques (séparées par \\n)', type: 'textarea' },
      { key: 'program_complete_cta',      label: 'Prog complet — CTA',       type: 'text' },
      { key: 'program_hd_price',          label: 'Programme HD — Prix',     type: 'text' },
      { key: 'discovery_label',          label: 'Découverte — Label',       type: 'text' },
      { key: 'discovery_price',          label: 'Découverte — Prix',       type: 'text' },
      { key: 'discovery_unit',            label: 'Découverte — Unité',      type: 'text' },
      { key: 'discovery_features',        label: 'Découverte — Caractéristiques (séparées par \\n)', type: 'textarea' },
      { key: 'discovery_cta',            label: 'Découverte — CTA',        type: 'text' },
      // CTA final
      { key: 'cta_title',         label: 'CTA final — Titre',          type: 'text' },
      { key: 'cta_subtitle',      label: 'CTA final — Sous-titre',    type: 'textarea' },
      { key: 'cta_button',        label: 'CTA final — Bouton',        type: 'text' },
    ],
  },
  // 7. Relations
  'relations': {
    label: 'Relations & Attachement',
    emoji: '💚',
    sections: [
      { key: 'hero_badge',          label: 'Badge intro',                         type: 'text' },
      { key: 'hero_title',          label: 'Titre principal',                     type: 'text' },
      { key: 'hero_description',    label: 'Description intro',                   type: 'textarea' },
      { key: 'hero_cta_primary',    label: 'CTA primaire hero',                  type: 'text' },
      { key: 'hero_cta_secondary',  label: 'CTA secondaire hero',                type: 'text' },
      // Quiz
      { key: 'quiz_badge',          label: 'Quiz — Badge',                       type: 'text' },
      // Styles
      { key: 'styles_badge',        label: 'Styles — Badge',                     type: 'text' },
      { key: 'styles_title',        label: 'Styles — Titre',                     type: 'text' },
      { key: 'styles_subtitle',    label: 'Styles — Sous-titre',                 type: 'textarea' },
      // Manifestations
      { key: 'manifestations_badge',          label: 'Manifestations — Badge',           type: 'text' },
      { key: 'manifestations_title',          label: 'Manifestations — Titre',           type: 'text' },
      { key: 'manifestations_subtitle',       label: 'Manifestations — Sous-titre',     type: 'textarea' },
      { key: 'manifestations_anxious_avoidant_text', label: 'Manifestations — Texte anxieux/évitant', type: 'textarea' },
      { key: 'manifestations_anxious_title',   label: 'Manifestations — Titre anxieux',   type: 'text' },
      { key: 'manifestations_anxious_desc',    label: 'Manifestations — Desc anxieux',   type: 'textarea' },
      { key: 'manifestations_avoidant_title', label: 'Manifestations — Titre évitant',   type: 'text' },
      { key: 'manifestations_avoidant_desc',  label: 'Manifestations — Desc évitant',   type: 'textarea' },
      { key: 'manifestations_goodnews_text',  label: 'Manifestations — Bonne nouvelle', type: 'textarea' },
      // Healing
      { key: 'healing_badge',       label: 'Guérison — Badge',                  type: 'text' },
      { key: 'healing_title',       label: 'Guérison — Titre',                  type: 'text' },
      { key: 'healing_subtitle',    label: 'Guérison — Sous-titre',            type: 'textarea' },
      { key: 'healing_step1_title', label: 'Guérison étape 1 — Titre',         type: 'text' },
      { key: 'healing_step1_desc',  label: 'Guérison étape 1 — Description',   type: 'textarea' },
      { key: 'healing_step2_title', label: 'Guérison étape 2 — Titre',         type: 'text' },
      { key: 'healing_step2_desc',  label: 'Guérison étape 2 — Description',   type: 'textarea' },
      { key: 'healing_step3_title', label: 'Guérison étape 3 — Titre',         type: 'text' },
      { key: 'healing_step3_desc',  label: 'Guérison étape 3 — Description',   type: 'textarea' },
      // Communication
      { key: 'comm_badge',          label: 'Communication — Badge',            type: 'text' },
      { key: 'comm_title',          label: 'Communication — Titre',            type: 'text' },
      { key: 'comm_subtitle',       label: 'Communication — Sous-titre',       type: 'textarea' },
      // Work section
      { key: 'work_section_badge',    label: 'Travail — Badge',                type: 'text' },
      { key: 'work_section_title',    label: 'Travail — Titre',                type: 'text' },
      { key: 'work_section_desc',     label: 'Travail — Description',          type: 'textarea' },
      { key: 'work_section_cta',      label: 'Travail — CTA',                  type: 'text' },
      { key: 'work_secure_label',    label: 'Travail — Label sécure',         type: 'text' },
      { key: 'work_secure_desc',     label: 'Travail — Desc sécure',          type: 'text' },
      { key: 'work_anxious_label',   label: 'Travail — Label anxieux',         type: 'text' },
      { key: 'work_anxious_desc',    label: 'Travail — Desc anxieux',         type: 'text' },
      { key: 'work_avoidant_label',  label: 'Travail — Label évitant',         type: 'text' },
      { key: 'work_avoidant_desc',   label: 'Travail — Desc évitant',         type: 'text' },
      // Steps
      { key: 'steps_badge',         label: 'Étapes — Badge',                    type: 'text' },
      { key: 'steps_title',         label: 'Étapes — Titre',                  type: 'text' },
      { key: 'step1_title',         label: 'Étape 1 — Titre',                 type: 'text' },
      { key: 'step1_desc',          label: 'Étape 1 — Description',           type: 'textarea' },
      { key: 'step2_title',         label: 'Étape 2 — Titre',                 type: 'text' },
      { key: 'step2_desc',          label: 'Étape 2 — Description',           type: 'textarea' },
      { key: 'step3_title',         label: 'Étape 3 — Titre',                 type: 'text' },
      { key: 'step3_desc',          label: 'Étape 3 — Description',           type: 'textarea' },
      // Multiculture
      { key: 'multiculture_badge',             label: 'Multiculture — Badge',            type: 'text' },
      { key: 'multiculture_title',             label: 'Multiculture — Titre',            type: 'text' },
      { key: 'multiculture_subtitle',          label: 'Multiculture — Sous-titre',       type: 'textarea' },
      { key: 'multiculture_entreprise_title',  label: 'Multiculture — Titre entreprise', type: 'text' },
      { key: 'multiculture_entreprise_desc',  label: 'Multiculture — Desc entreprise',  type: 'textarea' },
      { key: 'multiculture_mc_title',          label: 'Multiculture — Titre MC',        type: 'text' },
      { key: 'multiculture_mc_desc',            label: 'Multiculture — Desc MC',          type: 'textarea' },
      { key: 'multiculture_note',               label: 'Multiculture — Note',             type: 'textarea' },
      { key: 'multiculture_cta',                label: 'Multiculture — CTA',             type: 'text' },
      // Booking
      { key: 'booking_badge',       label: 'Booking — Badge',                  type: 'text' },
      { key: 'booking_title',       label: 'Booking — Titre',                  type: 'text' },
      { key: 'booking_subtitle',    label: 'Booking — Sous-titre',            type: 'textarea' },
      { key: 'booking_cta_button',  label: 'Booking — Bouton CTA',            type: 'text' },
      // Theory
      { key: 'theory_badge',        label: 'Théorie — Badge',                 type: 'text' },
      { key: 'theory_title',        label: 'Théorie — Titre',                 type: 'text' },
      { key: 'theory_subtitle',     label: 'Théorie — Sous-titre',            type: 'textarea' },
      { key: 'theory_card_1_title', label: 'Carte théorie 1 — Titre',        type: 'text' },
      { key: 'theory_card_1_text',  label: 'Carte théorie 1 — Texte',        type: 'textarea' },
      { key: 'theory_card_2_title', label: 'Carte théorie 2 — Titre',        type: 'text' },
      { key: 'theory_card_2_text',  label: 'Carte théorie 2 — Texte',        type: 'textarea' },
      { key: 'theory_card_3_title', label: 'Carte théorie 3 — Titre',        type: 'text' },
      { key: 'theory_card_3_text',  label: 'Carte théorie 3 — Texte',        type: 'textarea' },
      { key: 'theory_modal_cta',    label: 'Théorie modal — CTA',            type: 'text' },
      // Footer
      { key: 'footer_site_name',    label: 'Footer — Nom du site',            type: 'text' },
      { key: 'footer_copyright',    label: 'Footer — Copyright',              type: 'text' },
      // Prix
      { key: 'relations_price',    label: 'Prix (ex: Sur devis)',             type: 'text' },
    ],
  },
  // 8. Témoignages
  'temoignages': {
    label: 'Témoignages',
    emoji: '💬',
    sections: [
      { key: 'hero_image',           label: 'Image hero',           type: 'image' },
      { key: 'page_title',           label: 'Titre de la page',     type: 'text' },
      { key: 'intro_text',           label: 'Texte introduction',   type: 'textarea' },
      { key: 'grid_badge',           label: 'Grille — Badge',       type: 'text' },
      { key: 'grid_empty_state',     label: 'Grille — État vide',   type: 'text' },
      { key: 'linkedin_badge',       label: 'LinkedIn — Badge',     type: 'text' },
      { key: 'linkedin_title',       label: 'LinkedIn — Titre',     type: 'text' },
      { key: 'linkedin_subtitle',    label: 'LinkedIn — Sous-titre', type: 'textarea' },
      { key: 'linkedin_footnote',    label: 'LinkedIn — Note',      type: 'text' },
      { key: 'linkedin_intro_note',  label: 'LinkedIn — Note intro', type: 'text' },
      { key: 'cta_title',            label: 'CTA final — Titre',    type: 'text' },
      { key: 'cta_subtitle',         label: 'CTA final — Sous-titre', type: 'textarea' },
      { key: 'cta_coaching',         label: 'CTA — Coaching',       type: 'text' },
      { key: 'cta_contact',          label: 'CTA — Contact',       type: 'text' },
    ],
  },
  // 9. Réservation
  'booking': {
    label: 'Réservation',
    emoji: '📅',
    sections: [
      { key: 'hero_badge',           label: 'Badge hero',                          type: 'text' },
      { key: 'hero_title',           label: 'Titre hero',                          type: 'text' },
      { key: 'hero_subtitle',        label: 'Sous-titre hero',                     type: 'textarea' },
      { key: 'reassurance_1_title',  label: 'Réassurance 1 — Titre',              type: 'text' },
      { key: 'reassurance_1_desc',   label: 'Réassurance 1 — Description',        type: 'textarea' },
      { key: 'reassurance_2_title',  label: 'Réassurance 2 — Titre',              type: 'text' },
      { key: 'reassurance_2_desc',   label: 'Réassurance 2 — Description',        type: 'textarea' },
      { key: 'reassurance_3_title',  label: 'Réassurance 3 — Titre',              type: 'text' },
      { key: 'reassurance_3_desc',   label: 'Réassurance 3 — Description',        type: 'textarea' },
      { key: 'footer_note',          label: 'Note footer',                         type: 'textarea' },
      { key: 'email_booking_text',   label: 'Texte email booking',                 type: 'text' },
    ],
  },
  // 10. Contact
  'contact': {
    label: 'Contact',
    emoji: '📧',
    sections: [
      { key: 'hero_image',        label: 'Image hero',               type: 'image' },
      { key: 'hero_badge',        label: 'Badge hero',               type: 'text' },
      { key: 'page_title',        label: 'Titre de la page',         type: 'text' },
      { key: 'intro_text',        label: "Texte d'introduction",     type: 'textarea' },
      { key: 'form_name_label',   label: 'Formulaire — Label Nom',   type: 'text' },
      { key: 'form_email_label',  label: 'Formulaire — Label Email', type: 'text' },
      { key: 'form_subject_label', label: 'Formulaire — Label Sujet', type: 'text' },
      { key: 'form_message_label', label: 'Formulaire — Label Message', type: 'text' },
      { key: 'form_submit_label', label: 'Formulaire — Bouton Envoyer', type: 'text' },
      { key: 'success_title',     label: 'Message succès — Titre',   type: 'text' },
      { key: 'success_text',      label: 'Message succès — Texte',   type: 'textarea' },
      { key: 'sidebar_name',      label: 'Sidebar — Nom',            type: 'text' },
      { key: 'sidebar_title',     label: 'Sidebar — Titre',         type: 'text' },
    ],
  },
  // 11. Navigation
  'navigation': {
    label: 'Navigation',
    emoji: '🧭',
    sections: [
      { key: 'label_apropos',     label: 'Lien — À propos (ex: Monica)',       type: 'text' },
      { key: 'label_coaching',    label: 'Lien — Coaching',                    type: 'text' },
      { key: 'label_entreprises', label: 'Lien — Organisations',              type: 'text' },
      { key: 'label_relations',   label: 'Lien — Relations',                   type: 'text' },
      { key: 'label_temoignages', label: 'Lien — Témoignages',                 type: 'text' },
      { key: 'label_contact',     label: 'Lien — Contact',                     type: 'text' },
      { key: 'label_cta',         label: 'Bouton CTA (ex: Réserver une séance)', type: 'text' },
    ],
  },
  // 11. Footer
  'footer': {
    label: 'Footer',
    emoji: '🦶',
    sections: [
      { key: 'site_name',     label: 'Nom du site',                        type: 'text' },
      { key: 'tagline',       label: 'Tagline (ex: philo-coaching)',        type: 'text' },
      { key: 'description',   label: 'Description courte',                  type: 'textarea' },
      { key: 'description_2',label: 'Description longue',                  type: 'textarea' },
      { key: 'linkedin_url',  label: 'URL LinkedIn',                        type: 'text' },
      { key: 'service_1',     label: 'Service 1',                           type: 'text' },
      { key: 'service_2',     label: 'Service 2',                           type: 'text' },
      { key: 'service_3',     label: 'Service 3',                           type: 'text' },
      { key: 'service_4',     label: 'Service 4',                           type: 'text' },
      { key: 'service_5',     label: 'Service 5',                           type: 'text' },
      { key: 'copyright',     label: 'Texte copyright',                     type: 'text' },
      { key: 'logo_url',      label: 'Logo (MiniFooter)',                   type: 'image' },
      { key: 'footer_nav_show_temoignages', label: 'Afficher page Témoignages dans le footer', type: 'text' },
    ],
  },
  // 12. Sparring Partner
  'sparring-partner': {
    label: 'Sparring Partner',
    emoji: '🥊',
    sections: [
      { key: 'hero_badge',          label: 'Hero — Badge',                                  type: 'text' },
      { key: 'hero_title',          label: 'Hero — Titre principal',                        type: 'text' },
      { key: 'hero_desc',           label: 'Hero — Sous-titre / description',               type: 'textarea' },
      { key: 'hero_cta_primary',    label: 'Hero — Bouton réservation',                     type: 'text' },
      { key: 'hero_cta_secondary',  label: 'Hero — Bouton question',                        type: 'text' },
      { key: 'section_badge',       label: 'Cas d\'usage — Badge',                          type: 'text' },
      { key: 'section_title',       label: 'Cas d\'usage — Titre section',                  type: 'text' },
      { key: 'use_case_1_title',    label: 'Cas 1 — Titre',                                type: 'text' },
      { key: 'use_case_1_desc',     label: 'Cas 1 — Description',                          type: 'textarea' },
      { key: 'use_case_2_title',    label: 'Cas 2 — Titre',                                type: 'text' },
      { key: 'use_case_2_desc',     label: 'Cas 2 — Description',                          type: 'textarea' },
      { key: 'use_case_3_title',    label: 'Cas 3 — Titre',                                type: 'text' },
      { key: 'use_case_3_desc',     label: 'Cas 3 — Description',                          type: 'textarea' },
      { key: 'use_case_4_title',    label: 'Cas 4 — Titre',                                type: 'text' },
      { key: 'use_case_4_desc',     label: 'Cas 4 — Description',                          type: 'textarea' },
      { key: 'use_case_5_title',    label: 'Cas 5 — Titre',                                type: 'text' },
      { key: 'use_case_5_desc',     label: 'Cas 5 — Description',                          type: 'textarea' },
      { key: 'why_section_badge',   label: 'Profil Monica — Badge',                        type: 'text' },
      { key: 'why_section_title',   label: 'Profil Monica — Titre',                        type: 'text' },
      { key: 'experience_items',    label: 'Expérience Monica (1 item par ligne)',          type: 'textarea' },
      { key: 'cta_title',           label: 'CTA final — Titre',                            type: 'text' },
      { key: 'cta_desc',            label: 'CTA final — Sous-titre',                       type: 'textarea' },
      { key: 'cta_primary',         label: 'CTA final — Bouton réservation',               type: 'text' },
      { key: 'cta_secondary',       label: 'CTA final — Bouton contact',                   type: 'text' },
      { key: 'sparring_price',      label: 'Tarif (ex: Sur devis)',                        type: 'text' },
    ],
  },
  // 13. FAQ
  'faq': {
    label: 'FAQ',
    emoji: '❓',
    sections: [
      { key: 'page_title',    label: 'Titre de la page',                      type: 'text' },
      { key: 'page_subtitle',label: 'Sous-titre de la page',                  type: 'textarea' },
      { key: 'cta_title',    label: 'Section CTA — Titre',                    type: 'text' },
      { key: 'cta_text',     label: 'Section CTA — Texte',                    type: 'textarea' },
      { key: 'faqs_json',    label: 'FAQ — JSON (voir format dans le panneau)', type: 'textarea' },
    ],
  },
  // 13. Blog
  'blog': {
    label: 'Blog',
    emoji: '📝',
    sections: [
      { key: 'hero_badge',    label: 'Badge hero',                    type: 'text' },
      { key: 'hero_title',    label: 'Titre principal',               type: 'textarea' },
      { key: 'hero_subtitle', label: 'Sous-titre',                    type: 'textarea' },
      { key: 'featured_label',label: 'Label "À lire d\'abord"',       type: 'text' },
      { key: 'featured_title',label: 'Titre "À lire d\'abord"',       type: 'text' },
      { key: 'empty_title',   label: 'Recherche vide — Titre',        type: 'text' },
      { key: 'empty_text',    label: 'Recherche vide — Texte',        type: 'textarea' },
      { key: 'empty_action',  label: 'Recherche vide — Bouton',       type: 'text' },
      { key: 'carnets_title', label: 'Section Carnets — Titre',       type: 'text' },
      { key: 'carnets_desc',  label: 'Section Carnets — Description', type: 'textarea' },
      { key: 'pepites_title', label: 'Section Pépites — Titre',       type: 'text' },
      { key: 'pepites_desc',  label: 'Section Pépites — Description', type: 'textarea' },
      { key: 'guides_title',  label: 'Section Guides — Titre',        type: 'text' },
      { key: 'guides_desc',   label: 'Section Guides — Description',  type: 'textarea' },
    ],
  },
};

const SETTINGS_GROUPS: Record<string, { label: string; emoji: string }> = {
  theme:    { label: 'Thème & Couleurs', emoji: '🎨' },
  branding: { label: 'Logo & Identité',  emoji: '🖼' },
  general:  { label: 'Général',          emoji: '🌍' },
  social:   { label: 'Réseaux sociaux',  emoji: '📱' },
  seo:      { label: 'SEO',              emoji: '🔍' },
  footer:   { label: 'Footer',           emoji: '📄' },
};

// ─── Maintenance Mode Toggle ──────────────────────────────────
function MaintenanceModeToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/cms/maintenance')
      .then(r => r.json())
      .then(d => setEnabled(Boolean(d.enabled)))
      .catch(() => setEnabled(false))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/cms/maintenance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled }),
      });
      if (res.ok) {
        setEnabled(!enabled);
      }
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div style={{ marginBottom: '2rem', padding: '1.25rem', background: enabled ? '#fff7ed' : '#f9fafb', border: `2px solid ${enabled ? '#f97316' : '#e5e7eb'}`, borderRadius: '.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: enabled ? '#c2410c' : '#374151', margin: '0 0 .35rem' }}>
            ⚠️ Mode maintenance
          </h3>
          <p style={{ fontSize: '.82rem', color: '#6b7280', margin: 0 }}>
            Affiche une page &quot;en maintenance&quot; à tous les visiteurs (sauf Monica connectée au CMS)
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={saving}
          style={{
            position: 'relative',
            width: 56,
            height: 30,
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            background: enabled ? '#f97316' : '#d1d5db',
            transition: 'background .2s',
            flexShrink: 0,
            opacity: saving ? .7 : 1,
          }}
          title={enabled ? 'Désactiver le mode maintenance' : 'Activer le mode maintenance'}
        >
          <div style={{
            position: 'absolute',
            top: 3,
            left: enabled ? 29 : 3,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,.2)',
            transition: 'left .2s',
          }} />
        </button>
      </div>
      {enabled && (
        <div style={{ marginTop: '.75rem', padding: '.5rem .75rem', background: '#fff', borderRadius: '.4rem', border: '1px solid #fed7aa' }}>
          <p style={{ fontSize: '.8rem', color: '#c2410c', margin: 0 }}>
            ⚠️ Le site affiche actuellement une page de maintenance aux visiteurs non-connectés.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Navigation Editor ────────────────────────────────────────
function NavigationEditor({ onSaved }: { onSaved?: () => void }) {
  const [nav, setNav] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Drag & drop state
  const [dragSrc, setDragSrc] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  // Drag state for dropdown sub-items (parentId → dragged index)
  const [dragSrcSub, setDragSrcSub] = useState<{ parentId: string; idx: number } | null>(null);
  const [dragOverSub, setDragOverSub] = useState<{ parentId: string; idx: number } | null>(null);

  useEffect(() => {
    fetch('/api/cms/navigation')
      .then(r => r.json())
      .then(d => {
        const items = d.nav;
        if (Array.isArray(items) && items.length > 0) setNav(items);
        else setNav([]);
      })
      .catch(() => setError('Impossible de charger la navigation'))
      .finally(() => setLoading(false));
  }, []);

  const updateItem = (id: string, updates: Partial<NavItem>) => {
    setNav(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const updateDropdownItem = (parentId: string, dropdownId: string, updates: Partial<NavItem>) => {
    setNav(prev => prev.map(item => {
      if (item.id !== parentId) return item;
      return { ...item, dropdownItems: (item.dropdownItems || []).map(sub => sub.id === dropdownId ? { ...sub, ...updates } : sub) };
    }));
  };

  // ── Drag & drop for top-level items ──────────────────────
  const onItemDragStart = (e: React.DragEvent, idx: number) => {
    setDragSrc(idx);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onItemDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(idx);
  };
  const onItemDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragSrc === null || dragSrc === dropIdx) {
      setDragSrc(null); setDragOver(null);
      return;
    }
    setNav(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragSrc, 1);
      next.splice(dropIdx, 0, moved);
      next.forEach((item, i) => { item.position = i + 1; });
      return next;
    });
    setDragSrc(null); setDragOver(null);
  };
  const onItemDragEnd = () => { setDragSrc(null); setDragOver(null); };

  // ── Drag & drop for dropdown sub-items ───────────────────
  const onSubDragStart = (e: React.DragEvent, parentId: string, idx: number) => {
    setDragSrcSub({ parentId, idx });
    e.dataTransfer.effectAllowed = 'move';
  };
  const onSubDragOver = (e: React.DragEvent, parentId: string, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSub({ parentId, idx });
  };
  const onSubDrop = (e: React.DragEvent, parentId: string, dropIdx: number) => {
    e.preventDefault();
    if (!dragSrcSub || dragSrcSub.parentId !== parentId || dragSrcSub.idx === dropIdx) {
      setDragSrcSub(null); setDragOverSub(null);
      return;
    }
    setNav(prev => prev.map(item => {
      if (item.id !== parentId) return item;
      const subs = [...(item.dropdownItems || [])];
      const [moved] = subs.splice(dragSrcSub.idx, 1);
      subs.splice(dropIdx, 0, moved);
      subs.forEach((sub, i) => { sub.position = i + 1; });
      return { ...item, dropdownItems: subs };
    }));
    setDragSrcSub(null); setDragOverSub(null);
  };
  const onSubDragEnd = () => { setDragSrcSub(null); setDragOverSub(null); };

  const saveNav = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/cms/navigation', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nav }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erreur ${res.status}`);
      }
      bustCmsCache('navigation');
      onSaved?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Chargement de la navigation…</p>;

  const cardStyle = (isDragging: boolean, isOver: boolean): React.CSSProperties => ({
    background: '#faf9f7',
    border: isOver ? '2px solid #2d5f54' : '1px solid #e8e4df',
    borderRadius: '.75rem',
    padding: '1rem',
    opacity: isDragging ? 0.4 : 1,
    transition: 'border-color .1s, opacity .15s',
  });

  return (
    <div>
      {error && (
        <div style={{ padding: '.75rem 1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '.5rem', color: '#dc2626', fontSize: '.88rem', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}
      <p style={{ fontSize: '.85rem', color: '#888', marginBottom: '1rem' }}>
        Glissez-déposez les éléments pour changer l&apos;ordre. Modifiez visibilité et liens ci-dessous.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '1.5rem' }}>
        {nav.map((item, idx) => (
          <div key={item.id}>
            {/* Drop indicator above */}
            {dragOver === idx && dragSrc !== null && dragSrc !== idx && (
              <div style={{ height: 3, background: '#2d5f54', borderRadius: 2, margin: '0 .5rem' }} />
            )}
            <div
              draggable
              onDragStart={e => onItemDragStart(e, idx)}
              onDragOver={e => onItemDragOver(e, idx)}
              onDrop={e => onItemDrop(e, idx)}
              onDragEnd={onItemDragEnd}
              style={cardStyle(dragSrc === idx, dragOver === idx)}
            >
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', marginBottom: '.75rem' }}>
                {/* Drag handle */}
                <span style={{ cursor: 'grab', padding: '.35rem .2rem', color: '#bbb', fontSize: '1rem', lineHeight: 1, userSelect: 'none' }} title="Glisser pour réordonner">⠿</span>

                {/* Visibility toggle */}
                <button onClick={() => updateItem(item.id, { visible: !item.visible })}
                  title={item.visible ? 'Masquer' : 'Afficher'}
                  style={{ padding: '.35rem .5rem', background: item.visible ? '#ecfdf5' : '#fef2f2', border: `1px solid ${item.visible ? '#6ee7b7' : '#fca5a5'}`, borderRadius: '.4rem', cursor: 'pointer', fontSize: '.85rem' }}>
                  {item.visible ? '👁️' : '👁️‍🗨️'}
                </button>

                {/* Fields */}
                <div style={{ flex: 1, display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  <input value={item.label} onChange={e => updateItem(item.id, { label: e.target.value })}
                    placeholder="Label du lien" style={{ ...inp, flex: 1, minWidth: 120 }} />
                  <input value={item.href || ''} onChange={e => updateItem(item.id, { href: e.target.value })}
                    placeholder="URL (ex: /contact)" style={{ ...inp, flex: 1, minWidth: 160 }} />
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: '.35rem', alignItems: 'center', flexShrink: 0 }}>
                  {item.isDropdown && <span style={{ padding: '.2rem .5rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '.3rem', fontSize: '.7rem', fontWeight: 600 }}>Menu</span>}
                  {item.isCta && <span style={{ padding: '.2rem .5rem', background: '#dcfce7', color: '#15803d', borderRadius: '.3rem', fontSize: '.7rem', fontWeight: 600 }}>CTA</span>}
                </div>
              </div>

              {/* Dropdown sub-items */}
              {item.isDropdown && (
                <div style={{ marginLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <p style={{ fontSize: '.75rem', fontWeight: 600, color: '#888', marginBottom: '.4rem' }}>Sous-éléments :</p>
                  {(item.dropdownItems || []).map((sub, subIdx) => {
                    const isSubDragging = dragSrcSub?.parentId === item.id && dragSrcSub.idx === subIdx;
                    const isSubOver = dragOverSub?.parentId === item.id && dragOverSub.idx === subIdx;
                    return (
                      <div key={sub.id}>
                        {isSubOver && dragSrcSub && !(dragSrcSub.parentId === item.id && dragSrcSub.idx === subIdx) && (
                          <div style={{ height: 2, background: '#2d5f54', borderRadius: 2, margin: '2px .25rem' }} />
                        )}
                        <div
                          draggable
                          onDragStart={e => onSubDragStart(e, item.id, subIdx)}
                          onDragOver={e => onSubDragOver(e, item.id, subIdx)}
                          onDrop={e => onSubDrop(e, item.id, subIdx)}
                          onDragEnd={onSubDragEnd}
                          style={{
                            display: 'flex', gap: '.4rem', alignItems: 'center',
                            opacity: isSubDragging ? 0.4 : 1,
                            background: isSubOver ? '#f0fdf4' : 'transparent',
                            borderRadius: '.4rem',
                            padding: isSubOver ? '.35rem .35rem' : '.35rem .35rem',
                            transition: 'opacity .15s, background .1s',
                          }}
                        >
                          <span style={{ cursor: 'grab', color: '#ccc', fontSize: '.85rem', padding: '0 .1rem', userSelect: 'none' }}>⠿</span>
                          <button onClick={() => updateDropdownItem(item.id, sub.id, { visible: !sub.visible })}
                            style={{ padding: '.2rem .35rem', background: sub.visible ? '#ecfdf5' : '#fef2f2', border: `1px solid ${sub.visible ? '#6ee7b7' : '#fca5a5'}`, borderRadius: '.3rem', cursor: 'pointer', fontSize: '.75rem' }}>
                            {sub.visible ? '👁️' : '👁️‍🗨️'}
                          </button>
                          <input value={sub.label} onChange={e => updateDropdownItem(item.id, sub.id, { label: e.target.value })}
                            placeholder="Label" style={{ ...inp, flex: 1 }} />
                          <input value={sub.href || ''} onChange={e => updateDropdownItem(item.id, sub.id, { href: e.target.value })}
                            placeholder="URL" style={{ ...inp, flex: 1 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {/* Drop indicator at end */}
        {dragOver === nav.length && dragSrc !== null && (
          <div style={{ height: 3, background: '#2d5f54', borderRadius: 2, margin: '0 .5rem' }} />
        )}
      </div>

      <button onClick={saveNav} disabled={saving}
        style={{ padding: '.7rem 2rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem', opacity: saving ? .7 : 1 }}>
        {saving ? '⏳ Sauvegarde…' : '💾 Sauvegarder la navigation'}
      </button>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────
function BulkSlotCreator({ onCreated }: { onCreated: () => void }) {
  const [days, setDays] = React.useState<number[]>([1,2,3,4,5])
  const [startH, setStartH] = React.useState(9)
  const [endH, setEndH]   = React.useState(17)
  const [type, setType]   = React.useState('discovery')
  const [weeks, setWeeks] = React.useState(4)
  const [startDate, setStartDate] = React.useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = React.useState(false)
  const [result, setResult]   = React.useState('')

  const toggleDay = (d: number) => setDays(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d].sort())
  const DAY_LABELS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

  const create = async () => {
    setLoading(true); setResult('')
    const res = await fetch('/api/cms/booking-slots-bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days_of_week: days, start_hour: startH, end_hour: endH, slot_type: type, duration: 45, weeks, start_date: startDate })
    })
    const d = await res.json()
    setResult(d.message || d.error || 'Terminé')
    setLoading(false)
    if (res.ok) onCreated()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
      <div>
        <label style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'#555', marginBottom:'.4rem' }}>Jours de la semaine</label>
        <div style={{ display:'flex', gap:'.3rem', flexWrap:'wrap' }}>
          {DAY_LABELS.map((l,i) => (
            <button key={i} onClick={() => toggleDay(i+1)} style={{ padding:'.3rem .6rem', borderRadius:'.4rem', border:'1.5px solid', fontSize:'.78rem', fontWeight:600, cursor:'pointer', background:days.includes(i+1) ? '#2d5f54' : 'white', color:days.includes(i+1) ? 'white' : '#555', borderColor:days.includes(i+1) ? '#2d5f54' : '#ddd' }}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'#555', marginBottom:'.4rem' }}>De (heure)</label>
        <select value={startH} onChange={e => setStartH(+e.target.value)} style={{ width:'100%', padding:'.5rem .75rem', border:'1.5px solid #e0dbd5', borderRadius:'.5rem', fontSize:'.88rem' }}>
          {Array.from({length:12}, (_,i)=>i+7).map(h => <option key={h} value={h}>{h}:00</option>)}
        </select>
      </div>
      <div>
        <label style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'#555', marginBottom:'.4rem' }}>À (heure)</label>
        <select value={endH} onChange={e => setEndH(+e.target.value)} style={{ width:'100%', padding:'.5rem .75rem', border:'1.5px solid #e0dbd5', borderRadius:'.5rem', fontSize:'.88rem' }}>
          {Array.from({length:12}, (_,i)=>i+9).map(h => <option key={h} value={h}>{h}:00</option>)}
        </select>
      </div>
      <div>
        <label style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'#555', marginBottom:'.4rem' }}>Type de séance</label>
        <select value={type} onChange={e => setType(e.target.value)} style={{ width:'100%', padding:'.5rem .75rem', border:'1.5px solid #e0dbd5', borderRadius:'.5rem', fontSize:'.88rem' }}>
          <option value="discovery">Découverte (gratuit)</option>
          <option value="coaching">Coaching (120€)</option>
          <option value="enterprise">Entreprise</option>
        </select>
      </div>
      <div>
        <label style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'#555', marginBottom:'.4rem' }}>Nb semaines</label>
        <select value={weeks} onChange={e => setWeeks(+e.target.value)} style={{ width:'100%', padding:'.5rem .75rem', border:'1.5px solid #e0dbd5', borderRadius:'.5rem', fontSize:'.88rem' }}>
          {[1,2,4,6,8,12].map(w => <option key={w} value={w}>{w} semaine{w>1?'s':''}</option>)}
        </select>
      </div>
      <div>
        <label style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'#555', marginBottom:'.4rem' }}>À partir du</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width:'100%', padding:'.5rem .75rem', border:'1.5px solid #e0dbd5', borderRadius:'.5rem', fontSize:'.88rem' }} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
        <button onClick={create} disabled={loading || !days.length} style={{ padding:'.65rem 1rem', background:'#2d5f54', color:'white', border:'none', borderRadius:'.5rem', fontWeight:700, cursor:'pointer', fontSize:'.88rem', opacity:loading?0.7:1 }}>
          {loading ? 'Création…' : '+ Créer les créneaux'}
        </button>
        {result && <p style={{ fontSize:'.78rem', color:result.includes('Erreur') ? '#dc2626' : '#2d5f54', fontWeight:600 }}>{result}</p>}
      </div>
    </div>
  )
}
export default function CMSAdmin() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [apiPwd, setApiPwd] = useState(''); // Kept for API calls
  const [authErr, setAuthErr] = useState('');
  const [tab, setTab] = useState('articles');
  const [toast, setToast] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // Articles
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [savingArticle, setSavingArticle] = useState(false);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string | null>(null);
  const [articleBaseline, setArticleBaseline] = useState(() => getArticleDraftSignature(null));
  const [showArticlePreview, setShowArticlePreview] = useState(false);

  // Messages contact
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Demandes travel
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [savingSlot, setSavingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: '', time: '10:00', type: 'coaching', notes: '' });
  const [loadingDemandes, setLoadingDemandes] = useState(false);
  const [updatingDemandeId, setUpdatingDemandeId] = useState<string | null>(null);

  // Paramètres + Contenu pages
  const [settings, setSettings] = useState<Setting[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [settingsGroup, setSettingsGroup] = useState('general');
  const [activePage, setActivePage] = useState('home');
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const cleanHash = React.useRef('');

  const isArticleDirty = getArticleDraftSignature(editingArticle) !== articleBaseline;
  const articleWordCount = getWordCount(editingArticle?.content);
  const articleReadTime = getReadTimeMinutes(editingArticle?.content);
  const articlePreviewHtml = sanitizeHtml(editingArticle?.content);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }, []);
  const handleUnauthorized = useCallback((res: Response, message = 'Session expirée. Merci de vous reconnecter.') => {
    if (res.status !== 401) return false;
    setAuthed(false);
    setPwd('');
    setApiPwd('');
    setAuthErr(message);
    showToast(message);
    return true;
  }, [showToast]);

  const resetArticleEditor = useCallback((nextTab = 'articles') => {
    setEditingArticle(null);
    setArticleBaseline(getArticleDraftSignature(null));
    setShowArticlePreview(false);
    setTab(nextTab);
  }, []);

  const confirmDiscardArticleChanges = useCallback(() => {
    if (!isArticleDirty) return true;
    return confirm('Tu as des modifications non sauvegardées. Les quitter ?');
  }, [isArticleDirty]);
  // ── Suivi dirty content/settings ────────────────────────
  useEffect(() => {
    if (!cleanHash.current) return; // pas encore chargé
    const cur = JSON.stringify(editedContent) + '|' + JSON.stringify(editedSettings);
    setIsDirty(cur !== cleanHash.current);
  }, [editedContent, editedSettings]);

  // ── Raccourci Cmd+S / Ctrl+S ─────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!isDirty || savingSettings) return;
        if (tab === 'pages') savePageContent(activePage);
        else if (tab === 'settings') saveSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, savingSettings, tab, activePage]);

  // ── Confirmation avant de quitter ────────────────────────
  useEffect(() => {
    if (isDirty) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
    return () => { window.onbeforeunload = null; };
  }, [isDirty]);


  const openArticleEditor = useCallback((article?: Partial<Article>) => {
    if ((editingArticle || tab === 'new') && !confirmDiscardArticleChanges()) return;
    const draft = article ? { ...article } : {};
    setEditingArticle(draft);
    setArticleBaseline(getArticleDraftSignature(draft));
    setShowArticlePreview(false);
    setTab('new');
  }, [confirmDiscardArticleChanges, editingArticle, tab]);

  const closeArticleEditor = useCallback(() => {
    if (!confirmDiscardArticleChanges()) return false;
    resetArticleEditor();
    return true;
  }, [confirmDiscardArticleChanges, resetArticleEditor]);

  const handleTabChange = useCallback((nextTab: string) => {
    if (nextTab === 'new') {
      openArticleEditor({});
      return;
    }

    if (tab === 'new' && nextTab !== 'new' && !confirmDiscardArticleChanges()) {
      return;
    }

    setTab(nextTab);
  }, [confirmDiscardArticleChanges, openArticleEditor, tab]);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const res = await fetch('/api/cms/auth');
        if (!active) return;
        setAuthed(res.ok);
      } catch {
        if (!active) return;
        setAuthed(false);
      } finally {
        if (active) setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  // Auth
  const login = async () => {
    if (authLoading) return;
    setAuthErr('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setAuthed(true);
        setPwd('');
        setApiPwd(pwd); // Keep for API calls
        // Store password for API auth (used by upload endpoints)
        if (typeof window !== 'undefined') {
          localStorage.setItem('cms_password', pwd);
        }
      } else {
        setAuthErr(data.error || 'Mot de passe incorrect');
      }
    } catch {
      setAuthErr('Impossible de contacter le CMS pour le moment.');
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/cms/auth', { method: 'DELETE' }).catch(() => {});
    setAuthed(false);
    setPwd('');
    setApiPwd('');
    setAuthErr('');
    setShowMediaLibrary(false);
    resetArticleEditor();
    // Clear stored password
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cms_password');
    }
  };

  useEffect(() => {
    if (checkingSession || authed) return;
    fetch('/api/cms/auth', { method: 'DELETE' }).catch(() => {});
  }, [authed, checkingSession]);

  useEffect(() => {
    if (!isArticleDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isArticleDirty]);
  // ── Suivi dirty content/settings ────────────────────────
  useEffect(() => {
    if (!cleanHash.current) return; // pas encore chargé
    const cur = JSON.stringify(editedContent) + '|' + JSON.stringify(editedSettings);
    setIsDirty(cur !== cleanHash.current);
  }, [editedContent, editedSettings]);

  // ── Raccourci Cmd+S / Ctrl+S ─────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!isDirty || savingSettings) return;
        if (tab === 'pages') savePageContent(activePage);
        else if (tab === 'settings') saveSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, savingSettings, tab, activePage]);

  // ── Confirmation avant de quitter ────────────────────────
  useEffect(() => {
    if (isDirty) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
    return () => { window.onbeforeunload = null; };
  }, [isDirty]);


  // Load articles
  const loadArticles = useCallback(async () => {
    setLoadingArticles(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/cms/articles?${params}`);
      if (handleUnauthorized(res)) return;
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      showToast('Impossible de charger les articles.');
    } finally {
      setLoadingArticles(false);
    }
  }, [handleUnauthorized, search, showToast, statusFilter]);

  // Load demandes
  const loadDemandes = useCallback(async () => {
    setLoadingDemandes(true);
    try {
      const res = await fetch('/api/cms/demandes-travel');
      if (handleUnauthorized(res)) return;
      const data = await res.json();
      setDemandes(data.demandes || []);
    } catch {
      showToast('Impossible de charger les demandes travel.');
    } finally {
      setLoadingDemandes(false);
    }
  }, [handleUnauthorized, showToast]);

  // Load booking slots
  const loadBookingSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch('/api/cms/booking-slots');
      if (handleUnauthorized(res)) return;
      const data = await res.json();
      setBookingSlots(data.slots || []);
    } catch {
      showToast('Impossible de charger les créneaux.');
    } finally {
      setLoadingSlots(false);
    }
  }, [handleUnauthorized, showToast]);

  // Load booking requests
  const loadBookingRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/booking-requests');
      if (handleUnauthorized(res)) return;
      const data = await res.json();
      setBookingRequests(data.requests || []);
    } catch {
      showToast('Impossible de charger les demandes.');
    }
  }, [handleUnauthorized, showToast]);

  // Save new slot
  const saveNewSlot = async () => {
    if (!newSlot.date || !newSlot.time) {
      showToast("Veuillez remplir la date et l'heure");
      return;
    }
    setSavingSlot(true);
    try {
      const res = await fetch('/api/cms/booking-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlot),
      });
      if (handleUnauthorized(res)) return;
      showToast('Créneau ajouté');
      setNewSlot({ date: '', time: '10:00', type: 'coaching', notes: '' });
      loadBookingSlots();
    } catch {
      showToast("Erreur: Impossible d'ajouter");
    } finally {
      setSavingSlot(false);
    }
  };

  // Delete slot
  const deleteSlot = async (id: string) => {
    if (!confirm('Supprimer ce créneau ?')) return;
    try {
      const res = await fetch(`/api/cms/booking-slots/${id}`, { method: 'DELETE' });
      if (handleUnauthorized(res)) return;
      showToast('Créneau supprimé');
      loadBookingSlots();
    } catch {
      showToast('Erreur: Impossible de supprimer');
    }
  };

  // Update request status
  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/cms/booking-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (handleUnauthorized(res)) return;
      showToast('Statut mis à jour');
      loadBookingRequests();
    } catch {
      showToast('Erreur: Impossible de mettre à jour');
    }
  };

  // Load settings + content
  const loadSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetch('/api/cms/settings'),
        fetch('/api/cms/content'),
      ]);
      if (handleUnauthorized(sRes) || handleUnauthorized(cRes)) return;
      const sData = await sRes.json();
      const cData = await cRes.json();
      setSettings(sData.settings || []);
      setSiteContent(cData.content || []);
      const initS: Record<string, string> = {};
      (sData.settings || []).forEach((s: Setting) => { initS[s.key] = s.value || ''; });
      // Pré-remplir avec les defaults de chaque page
      const initC: Record<string, string> = {};
      Object.entries(PAGE_DEFAULTS).forEach(([page, defs]) => {
        Object.entries(defs).forEach(([key, val]) => {
          initC[`${page}__${key}`] = val;
        });
      });
      // Les valeurs DB écrasent les defaults
      (cData.content || []).forEach((c: SiteContent) => {
        if (c.value) initC[`${c.page}__${c.block_key}`] = c.value;
      });
      setEditedSettings(initS);
      setEditedContent(initC);
      setTimeout(() => { cleanHash.current = JSON.stringify(initC) + '|' + JSON.stringify(initS); setIsDirty(false); }, 50);
    } catch {
      showToast('Impossible de charger les contenus du CMS.');
    } finally {
      setLoadingSettings(false);
    }
  }, [handleUnauthorized, showToast]);

  const loadMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/cms/contact-messages');
      if (res.status === 401) { setAuthed(false); return; }
      const d = await res.json();
      setMessages(d.messages || []);
    } catch { showToast('Impossible de charger les messages.'); }
    finally { setLoadingMessages(false); }
  }, [handleUnauthorized, showToast]);

  useEffect(() => { if (authed) loadArticles(); }, [authed, loadArticles]);
  useEffect(() => { if (authed && tab === 'demandes') loadDemandes(); }, [authed, tab, loadDemandes]);
  useEffect(() => { if (authed && tab === 'booking') { loadBookingSlots(); loadBookingRequests(); } }, [authed, tab, loadBookingSlots, loadBookingRequests]);
  useEffect(() => { if (authed && (tab === 'settings' || tab === 'pages')) loadSettings(); }, [authed, tab, loadSettings]);
  useEffect(() => { if (authed && tab === 'messages') loadMessages(); }, [authed, tab, loadMessages]);

  // Save settings
  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const promises: Promise<Response>[] = [];
      settings.forEach(s => {
        const newVal = editedSettings[s.key];
        if (newVal !== undefined && newVal !== s.value) {
          promises.push(fetch('/api/cms/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: s.key, value: newVal }),
          }));
        }
      });

      if (promises.length === 0) {
        showToast('Aucune modification à enregistrer.');
        return;
      }

      const responses = await Promise.all(promises);
      if (responses.some(res => handleUnauthorized(res))) return;
      showToast('✅ Paramètres sauvegardés !');
      cleanHash.current = JSON.stringify(editedContent) + '|' + JSON.stringify(editedSettings); setIsDirty(false); setSavedOk(true); setTimeout(() => setSavedOk(false), 2000);
      loadSettings();
    } catch {
      showToast('Impossible de sauvegarder les paramètres.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Save content pour une page donnée
  const savePageContent = async (pageKey: string) => {
    setSavingSettings(true);
    const config = PAGES_CONFIG[pageKey];
    if (!config) { setSavingSettings(false); return; }

    try {
      // Sauvegarder TOUS les champs (upsert — pas de diff pour éviter les faux négatifs)
      const promises = config.sections.map(section => {
        const key = `${pageKey}__${section.key}`;
        const value = editedContent[key] ?? '';
        return fetch('/api/cms/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: pageKey, block_key: section.key, value }),
        });
      });

      const responses = await Promise.all(promises);

      // Vérifier auth
      if (responses.some(res => handleUnauthorized(res))) return;

      // Vérifier erreurs API (500, 503, etc.)
      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) {
        const errBody = await failed[0].json().catch(() => ({}));
        showToast(`❌ Erreur ${failed[0].status}: ${errBody.error || 'Impossible de sauvegarder'}`);
        return;
      }

      showToast(`✅ Page "${config.label}" sauvegardée !`);
      bustCmsCache(pageKey);
      cleanHash.current = JSON.stringify(editedContent) + '|' + JSON.stringify(editedSettings); setIsDirty(false); setSavedOk(true); setTimeout(() => setSavedOk(false), 2000);
      loadSettings();
    } catch {
      showToast('Impossible de sauvegarder cette page.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Save article
  const saveArticle = useCallback(async () => {
    if (!editingArticle) return;
    if (savingArticle) return;
    if (!editingArticle.title?.trim()) {
      showToast('Le titre est obligatoire avant d’enregistrer.');
      return;
    }

    const isNew = !editingArticle.id;
    const payload = {
      ...editingArticle,
      slug: editingArticle.slug || slug(editingArticle.title || ''),
      published_at: editingArticle.published && !editingArticle.published_at
        ? new Date().toISOString() : editingArticle.published_at,
    };
    const url = isNew ? '/api/cms/articles' : `/api/cms/articles/${editingArticle.id}`;
    const method = isNew ? 'POST' : 'PUT';
    setSavingArticle(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (handleUnauthorized(res)) return;
      if (res.ok) {
        showToast(isNew ? '✅ Article créé !' : '✅ Article mis à jour !');
        setArticleBaseline(getArticleDraftSignature(payload));
        resetArticleEditor();
        loadArticles();
      } else {
        const d = await res.json();
        showToast(`âŒ Erreur : ${d.error}`);
      }
    } catch {
      showToast('Impossible de sauvegarder cet article.');
    } finally {
      setSavingArticle(false);
    }
  }, [editingArticle, handleUnauthorized, loadArticles, resetArticleEditor, savingArticle, showToast]);

  useEffect(() => {
    if (tab !== 'new') return;

    const handleSaveShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's') return;
      event.preventDefault();
      void saveArticle();
    };

    window.addEventListener('keydown', handleSaveShortcut);
    return () => window.removeEventListener('keydown', handleSaveShortcut);
  }, [saveArticle, tab]);

  const togglePublish = async (a: Article) => {
    try {
      const res = await fetch(`/api/cms/articles/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: !a.published,
          published_at: !a.published ? new Date().toISOString() : a.published_at,
        }),
      });
      if (handleUnauthorized(res)) return;
      if (res.ok) { showToast(!a.published ? '✅ Publié !' : '📦 Repassé en brouillon'); loadArticles(); }
    } catch {
      showToast('Impossible de mettre à jour le statut de publication.');
    }
  };

  const deleteArticle = async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      const res = await fetch(`/api/cms/articles/${id}`, { method: 'DELETE' });
      if (handleUnauthorized(res)) return;
      if (res.ok) { showToast('🗑ï¸ Article supprimé'); loadArticles(); }
    } catch {
      showToast('Impossible de supprimer cet article.');
    }
  };

  const uploadFeaturedImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeaturedImage(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'articles');
    try {
      const res = await fetch('/api/cms/media-upload', {
        method: 'POST',
        body: fd,
      });
      if (handleUnauthorized(res)) return;
      const data = await res.json();
      if (data.url) {
        setEditingArticle(prev => prev ? { ...prev, featured_image: data.url } : prev);
        showToast('✅ Image uploadée sur Supabase !');
      } else {
        showToast(`âŒ Upload échoué : ${data.error}`);
      }
    } catch {
      showToast('Impossible d’envoyer cette image.');
    } finally {
      setUploadingFeaturedImage(false);
      e.target.value = '';
    }
  };

  const updateStatut = async (id: string, statut: string) => {
    setUpdatingDemandeId(id);
    try {
      const res = await fetch('/api/cms/demandes-travel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, statut }),
      });
      if (handleUnauthorized(res)) return;
      if (res.ok) { showToast('✅ Statut mis à jour'); loadDemandes(); }
    } catch {
      showToast('Impossible de mettre à jour cette demande.');
    } finally {
      setUpdatingDemandeId(null);
    }
  };

  // ─── Login ────────────────────────────────────────────────
  if (checkingSession) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f3ef' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,.1)', width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>...</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2d5f54' }}>Happy Humans CMS</h1>
        <p style={{ color: '#888', fontSize: '.9rem' }}>Verification de la session...</p>
      </div>
    </div>
  );

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f3ef' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,.1)', width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🌿</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2d5f54' }}>Happy Humans CMS</h1>
          <p style={{ color: '#888', fontSize: '.9rem' }}>Accès réservé</p>
        </div>
        <input type="password" placeholder="Mot de passe" value={pwd}
          onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', padding: '.75rem 1rem', border: '1.5px solid #ddd', borderRadius: '.5rem', fontSize: '1rem', marginBottom: '.75rem', outline: 'none' }}
        />
        {authErr && <p style={{ color: '#c0392b', fontSize: '.85rem', marginBottom: '.75rem' }}>{authErr}</p>}
        <button onClick={login} disabled={authLoading}
          style={{ width: '100%', padding: '.8rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 700, fontSize: '1rem', cursor: authLoading ? 'wait' : 'pointer', opacity: authLoading ? .7 : 1 }}
        >{authLoading ? 'Connexion…' : 'Entrer'}</button>
      </div>
    </div>
  );

  // ─── CMS ──────────────────────────────────────────────────
  const TABS = [
    { id: 'articles', label: '📝 Articles', count: articles.length },
    { id: 'new',      label: '✏️ Nouvel article', count: null },
    { id: 'pages',    label: '🗂️ Pages', count: null },
    { id: 'media',    label: '🖼️ Médiathèque', count: null },
    { id: 'booking',  label: '📅 Réservations', count: null },
    { id: 'messages', label: '💬 Messages', count: messages.filter(m => m.status === 'unread').length || null },
    { id: 'settings', label: '⚙️ Paramètres', count: null },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ef', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#2d5f54', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '.03em' }}>Happy Humans CMS</span>
          <span style={{ background: 'rgba(255,255,255,.18)', fontSize: '.72rem', padding: '.2rem .6rem', borderRadius: '9999px', fontWeight: 600 }}>Supabase</span>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <button
            onClick={async () => {
              const res = await fetch('/api/cms/generate-edit-token');
              if (!res.ok) return;
              const data = await res.json();
              if (data.token) {
                window.open(`/?cms_edit_token=${encodeURIComponent(data.token)}`, '_blank');
              }
            }}
            style={{ background: 'rgba(255,255,255,.22)', border: '1px solid rgba(255,255,255,.35)', color: 'white', padding: '.4rem .9rem', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '.35rem' }}
            title="Ouvrir le site en mode édition inline"
          >
            ✏️ Éditer le site
          </button>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: 'white', padding: '.4rem .9rem', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.85rem' }}>Déconnexion</button>
        </div>
      </div>

      {/* Bannière modifications non sauvegardées */}
      {isDirty && (
        <div style={{ background: '#fff8e1', borderBottom: '1px solid #f0c040', padding: '.6rem 2rem', display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem', color: '#7a5c00', fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Modifications non sauvegardées — utilisez le bouton flottant ou Ctrl+S pour sauvegarder
        </div>
      )}

      {/* Bouton flottant sticky */}
      {(tab === 'pages' || tab === 'settings') && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          display: isDirty || savedOk ? 'block' : 'none',
          transition: 'opacity .2s',
        }}>
          <button
            onClick={() => { if (tab === 'pages') savePageContent(activePage); else saveSettings(); }}
            disabled={savingSettings || !isDirty}
            style={{
              display: 'flex', alignItems: 'center', gap: '.5rem',
              padding: '14px 28px', borderRadius: '9999px',
              background: savedOk ? '#1a5c35' : '#2d5f54', color: 'white',
              border: 'none', cursor: savingSettings ? 'wait' : 'pointer',
              fontSize: '15px', fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0,0,0,.18)',
              opacity: savingSettings ? .8 : 1,
              transition: 'background .2s, transform .1s',
            }}
            onMouseEnter={e => { if (!savingSettings) (e.currentTarget as HTMLButtonElement).style.background = savedOk ? '#1a5c35' : '#1e4a40'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = savedOk ? '#1a5c35' : '#2d5f54'; }}
          >
            {savingSettings ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                Sauvegarde…
              </>
            ) : savedOk ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Sauvegardé !
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Sauvegarder
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', top: '5rem', right: '1.5rem', background: '#1a1a1a', color: 'white', padding: '.8rem 1.4rem', borderRadius: '.6rem', zIndex: 100, fontSize: '.9rem', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>{toast}</div>
      )}

      {showMediaLibrary && (
        <MediaLibrary
          onClose={() => setShowMediaLibrary(false)}
          onSelect={(url) => {
            setEditingArticle(prev => prev ? { ...prev, featured_image: url } : prev);
            if (mediaPickerTarget) {
              setEditedContent((prev: Record<string,string>) => ({ ...prev, [mediaPickerTarget]: url }));
              setMediaPickerTarget(null);
              setTab('pages');
              showToast('✅ Image sélectionnée !');
            } else {
              showToast('✅ Image sélectionnée depuis la médiathèque !');
            }
          }}
        />
      )}

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1.5px solid #e8e3dc', padding: '0 2rem', display: 'flex', gap: '.25rem', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id}
            onClick={() => handleTabChange(t.id)}
            style={{
              padding: '.85rem 1.2rem', border: 'none', background: 'none', cursor: 'pointer',
              fontWeight: tab === t.id ? 700 : 400,
              color: tab === t.id ? '#2d5f54' : '#666',
              borderBottom: tab === t.id ? '2.5px solid #2d5f54' : '2.5px solid transparent',
              fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: '.4rem', whiteSpace: 'nowrap',
            }}
          >
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span style={{ background: '#f0e8e4', color: '#2d5f54', borderRadius: '9999px', padding: '.1rem .55rem', fontSize: '.75rem', fontWeight: 700 }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* ── ARTICLES ── */}
        {tab === 'articles' && (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input placeholder="Rechercher un article..." value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadArticles()}
                style={{ padding: '.6rem 1rem', border: '1.5px solid #ddd', borderRadius: '.5rem', flex: 1, minWidth: 200, fontSize: '.9rem' }}
              />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '.6rem .9rem', border: '1.5px solid #ddd', borderRadius: '.5rem', fontSize: '.9rem' }}
              >
                <option value="all">Tous</option>
                <option value="published">Publiés</option>
                <option value="draft">Brouillons</option>
              </select>
              <button onClick={loadArticles} style={{ padding: '.6rem 1.2rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', cursor: 'pointer', fontSize: '.9rem' }}>🔍</button>
              <button onClick={() => openArticleEditor({})} style={{ padding: '.6rem 1.2rem', background: '#01696f', color: 'white', border: 'none', borderRadius: '.5rem', cursor: 'pointer', fontSize: '.9rem' }}>+ Nouvel article</button>
            </div>
            {loadingArticles ? <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Chargement…</p>
              : articles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <p>Aucun article trouvé</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  {articles.map(a => (
                    <div key={a.id} style={{ background: 'white', borderRadius: '.75rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,.06)', flexWrap: 'wrap' }}>
                      {a.featured_image && <img src={a.featured_image} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: '.4rem', flexShrink: 0 }} />}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1a1a1a', marginBottom: '.2rem' }}>{a.title}</div>
                        <div style={{ fontSize: '.8rem', color: '#888', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span>{a.category || '—'}</span>
                          <span>{fmt(a.created_at)}</span>
                        </div>
                      </div>
                      <span style={{ padding: '.3rem .8rem', borderRadius: '9999px', fontSize: '.78rem', fontWeight: 600, background: a.published ? '#d4edda' : '#fff3cd', color: a.published ? '#155724' : '#856404' }}>
                        {a.published ? '✅ Publié' : '📦 Brouillon'}
                      </span>
                      <div style={{ display: 'flex', gap: '.5rem' }}>
                        <button onClick={() => openArticleEditor(a)} style={{ padding: '.35rem .8rem', border: '1px solid #ddd', borderRadius: '.4rem', background: 'white', cursor: 'pointer', fontSize: '.82rem' }}>✏️ Ã‰diter</button>
                        <button onClick={() => togglePublish(a)} style={{ padding: '.35rem .8rem', border: '1px solid #ddd', borderRadius: '.4rem', background: 'white', cursor: 'pointer', fontSize: '.82rem' }}>{a.published ? '📦 Dépublier' : '🚀 Publier'}</button>
                        <button onClick={() => deleteArticle(a.id)} style={{ padding: '.35rem .8rem', border: '1px solid #fcc', borderRadius: '.4rem', background: '#fff5f5', color: '#c0392b', cursor: 'pointer', fontSize: '.82rem' }}>🗑ï¸</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ── Ã‰DITEUR ARTICLE ── */}
        {tab === 'new' && (
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2d5f54' }}>{editingArticle?.id ? `✏️ Modifier : ${editingArticle.title}` : '✏️ Nouvel article'}</h2>
              <button onClick={closeArticleEditor} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={() => setShowArticlePreview(prev => !prev)}
                style={{ padding: '.5rem .95rem', border: '1px solid #ddd', borderRadius: '.5rem', background: 'white', color: '#2d5f54', cursor: 'pointer', fontSize: '.82rem', fontWeight: 700 }}
              >
                {showArticlePreview ? "Masquer l'aperçu" : 'Aperçu live'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Titre *</label>
                <input value={editingArticle?.title || ''}
                  onChange={e => setEditingArticle(p => ({ ...p, title: e.target.value, slug: slug(e.target.value) }))}
                  style={inp} placeholder="Titre de l'article" />
              </div>
              <div>
                <label style={lbl}>Slug (URL)</label>
                <input value={editingArticle?.slug || ''}
                  onChange={e => setEditingArticle(p => ({ ...p, slug: e.target.value }))}
                  style={inp} placeholder="slug-auto-genere" />
              </div>
              <div>
                <label style={lbl}>Catégorie</label>
                <select value={editingArticle?.category || ''}
                  onChange={e => setEditingArticle(p => ({ ...p, category: e.target.value }))}
                  style={inp}
                >
                  <option value="">— Choisir —</option>
                  <option value="Slow Travel">Slow Travel</option>
                  <option value="Europe">Europe</option>
                  <option value="Escapades">Escapades</option>
                  <option value="Carnets de voyage">Carnets de voyage</option>
                  <option value="Coulisses">Coulisses</option>
                  <option value="Conseils">Conseils</option>
                  <option value="Destinations">Destinations</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Image à la une</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '.75rem' }}>
                  <button onClick={() => setShowMediaLibrary(true)}
                    style={{ padding: '.6rem 1.1rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}
                  >🖼️ Médiathèque Supabase</button>
                  <span style={{ color: '#aaa', fontSize: '.82rem' }}>ou</span>
                  <label style={{ padding: '.6rem 1rem', background: uploadingFeaturedImage ? '#8aa8a9' : '#01696f', color: 'white', borderRadius: '.5rem', cursor: uploadingFeaturedImage ? 'wait' : 'pointer', fontSize: '.85rem', fontWeight: 600 }}>
                    {uploadingFeaturedImage ? '⏳ Upload…' : '⬆️ Upload direct'}
                    <input type="file" accept="image/*" onChange={uploadFeaturedImage} style={{ display: 'none' }} disabled={uploadingFeaturedImage} />
                  </label>
                </div>
                {editingArticle?.featured_image ? (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={editingArticle.featured_image} alt="" style={{ height: 80, borderRadius: '.5rem', objectFit: 'cover' }} />
                      <button onClick={() => setEditingArticle(p => ({ ...p, featured_image: '' }))}
                        style={{ position: 'absolute', top: -6, right: -6, background: '#c0392b', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '.7rem' }}>✕</button>
                    </div>
                    <input value={editingArticle.featured_image}
                      onChange={e => setEditingArticle(p => ({ ...p, featured_image: e.target.value }))}
                      style={{ ...inp, flex: 1, fontSize: '.82rem' }} placeholder="URL de l'image" />
                  </div>
                ) : (
                  <input value=""
                    onChange={e => setEditingArticle(p => ({ ...p, featured_image: e.target.value }))}
                    style={{ ...inp, fontSize: '.82rem' }} placeholder="Ou coller une URL directement" />
                )}
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Extrait</label>
                <textarea value={editingArticle?.excerpt || ''}
                  onChange={e => setEditingArticle(p => ({ ...p, excerpt: e.target.value }))}
                  style={{ ...inp, height: 80, resize: 'vertical' }}
                  placeholder="Résumé accrocheur pour les cards du blog…" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <div style={{ border: '1px solid #ece3d8', borderRadius: '1rem', background: '#faf6f1', padding: '1rem 1.1rem', marginBottom: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#8a7a70' }}>
                    Guide de rédaction Monica
                  </p>
                  <ul style={{ margin: '.75rem 0 0', paddingLeft: '1.1rem', color: '#6d625a', fontSize: '.88rem', lineHeight: 1.7 }}>
                    <li>Ouverture : un moment précis ou une observation concrète.</li>
                    <li>Corps : des scènes qui avancent, une idée par paragraphe.</li>
                    <li>Détail signature : ce qu'on a vu, senti, raté ou retenu.</li>
                    <li>Fin : une impression juste, sans CTA forcé.</li>
                  </ul>
                </div>
                <label style={lbl}>Voice notes / détail signature</label>
                <textarea value={editingArticle?.voice_notes || ''}
                  onChange={e => setEditingArticle(p => ({ ...p, voice_notes: e.target.value }))}
                  style={{ ...inp, height: 96, resize: 'vertical' }}
                  placeholder="Détail terrain, texture, hésitation, micro-verdict, ou rappel d'angle vécu..." />
                <p style={{ margin: '.4rem 0 0', color: '#6d625a', fontSize: '.8rem', lineHeight: 1.6 }}>
                  Si la migration Supabase `voice_notes` n'est pas encore appliquée, ce champ peut être ignoré
                  temporairement à l'enregistrement.
                </p>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Contenu</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!editingArticle?.title && !editingArticle?.content) {
                        alert('Veuillez entrer un titre ou un theme pour generer le contenu');
                        return;
                      }
                      try {
                        const topic = editingArticle?.title || editingArticle?.content?.slice(0, 50) || 'voyages';
                        const res = await fetch('/api/ai/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ topic, platform: 'instagram' })
                        });
                        const data = await res.json();
                        if (data.success && data.content) {
                          setEditingArticle(p => ({ ...p, content: (p?.content || '') + '<p>' + data.content + '</p>' }));
                        } else {
                          alert('Erreur: ' + (data.error || data.message || 'Impossible de generer le contenu'));
                        }
                      } catch (err) {
                        alert('Erreur de connexion: Ollama nest peut-etre pas actif');
                      }
                    }}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    ✨ Generer avec IA
                  </button>
                </div>
                <RichEditor value={editingArticle?.content || ''}
                  onChange={html => setEditingArticle(p => ({ ...p, content: html }))}
                  placeholder="Commence à écrire ton article ici…" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontWeight: 600, color: '#444', fontSize: '.9rem' }}>
                  <input type="checkbox" checked={!!editingArticle?.published}
                    onChange={e => setEditingArticle(p => ({ ...p, published: e.target.checked }))}
                    style={{ width: 18, height: 18 }} />
                  Publier immédiatement
                </label>
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                <span style={metaChip}>URL: /blog/{editingArticle?.slug || slug(editingArticle?.title || '') || 'nouvel-article'}</span>
                <span style={metaChip}>{articleWordCount} mots</span>
                <span style={metaChip}>{articleReadTime} min de lecture</span>
                <span style={metaChip}>Cmd/Ctrl+S pour enregistrer</span>
                {isArticleDirty && <span style={{ ...metaChip, background: '#fff4db', color: '#8a5a00' }}>Brouillon non sauvegardé</span>}
              </div>
            </div>
            {showArticlePreview && (
              <div style={previewPanel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '.78rem', color: '#8a7a70', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>Preview</p>
                    <h3 style={{ margin: '.2rem 0 0', fontSize: '1.1rem', color: '#2d5f54' }}>Aperçu public de l&apos;article</h3>
                  </div>
                  <span style={{ ...metaChip, background: '#e8f5f2', color: '#01696f' }}>HTML sanitizé comme sur le site</span>
                </div>
                <div style={previewFrame}>
                  {editingArticle?.featured_image ? (
                    <img src={editingArticle.featured_image} alt="" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: '.9rem', marginBottom: '1.5rem' }} />
                  ) : (
                    <div style={previewImageFallback}>Ajoute une image à la une pour prévisualiser le hero</div>
                  )}
                  <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {editingArticle?.category && <span style={metaChip}>{editingArticle.category}</span>}
                    <span style={metaChip}>{editingArticle?.published ? 'Publication immédiate' : 'Brouillon'}</span>
                    <span style={metaChip}>/blog/{editingArticle?.slug || slug(editingArticle?.title || '') || 'nouvel-article'}</span>
                  </div>
                  <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.1, color: '#1f1a17' }}>
                    {editingArticle?.title || 'Titre de l’article'}
                  </h1>
                  <p style={{ margin: '1rem 0 1.5rem', color: '#6d625a', fontSize: '1rem', lineHeight: 1.7 }}>
                    {editingArticle?.excerpt || 'Ton extrait apparaîtra ici pour donner envie d’ouvrir l’article.'}
                  </p>
                  {editingArticle?.voice_notes && (
                    <div style={{ margin: '0 0 1.5rem', padding: '1rem 1.1rem', background: '#f6f1eb', border: '1px solid #ece3d8', borderRadius: '1rem' }}>
                      <p style={{ margin: 0, fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#8a7a70' }}>
                        Détail terrain
                      </p>
                      <p style={{ margin: '.4rem 0 0', color: '#6d625a', lineHeight: 1.7 }}>
                        {editingArticle.voice_notes}
                      </p>
                    </div>
                  )}
                  {articlePreviewHtml ? (
                    <EnhancedRichContent html={articlePreviewHtml} style={previewBody} />
                  ) : (
                    <p style={{ margin: 0, color: '#8a7a70', lineHeight: 1.7 }}>
                      Commence à écrire dans l’éditeur pour voir le rendu du contenu ici.
                    </p>
                  )}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', justifyContent: 'flex-end' }}>
              <button onClick={closeArticleEditor}
                style={{ padding: '.7rem 1.5rem', border: '1.5px solid #ddd', borderRadius: '.5rem', background: 'white', cursor: 'pointer', fontSize: '.9rem' }}>Annuler</button>
              <button onClick={saveArticle} disabled={savingArticle}
                style={{ padding: '.7rem 2rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 700, cursor: savingArticle ? 'wait' : 'pointer', fontSize: '.9rem', opacity: savingArticle ? .75 : 1 }}>{savingArticle ? '⏳ Enregistrement…' : '💾 Enregistrer'}</button>
            </div>
          </div>
        )}

        {/* ── PAGES ── */}
        {tab === 'pages' && (
          <div>
            {loadingSettings ? <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Chargement…</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* Sidebar pages */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                  <p style={{ fontSize: '.75rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.75rem', padding: '0 .5rem' }}>Pages du site</p>
                  {Object.entries(PAGES_CONFIG).map(([key, cfg]) => (
                    <button key={key} onClick={() => setActivePage(key)}
                      style={{ display: 'flex', alignItems: 'center', gap: '.5rem', width: '100%', textAlign: 'left', padding: '.6rem .75rem', borderRadius: '.5rem', border: 'none', cursor: 'pointer', fontSize: '.88rem', fontWeight: activePage === key ? 700 : 400, background: activePage === key ? '#f0e8e4' : 'transparent', color: activePage === key ? '#2d5f54' : '#555', marginBottom: '.2rem' }}
                    >
                      <span>{cfg.emoji}</span> {cfg.label}
                    </button>
                  ))}
                </div>

                {/* Éditeur de page */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                  {activePage === 'navigation' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2d5f54' }}>
                          🧭 Navigation
                        </h2>
                      </div>
                      <NavigationEditor />
                    </div>
                  ) : (
                    (() => {
                      const config = PAGES_CONFIG[activePage];
                      if (!config) return null;
                      return (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2d5f54' }}>
                              {config.emoji} {config.label}
                            </h2>
                            <a
                              href={activePage === 'home' ? '/' : `/${activePage}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: '.82rem', color: '#01696f', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.3rem' }}
                            >
                              🔗 Voir la page
                            </a>
                            <button
                              onClick={() => savePageContent(activePage)}
                              disabled={savingSettings}
                              style={{ padding: '.45rem 1.25rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '.85rem', opacity: savingSettings ? .7 : 1 }}
                            >
                              {savingSettings ? '⏳ Sauvegarde…' : '💾 Sauvegarder'}
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {config.sections.map(section => {
                              const key = `${activePage}__${section.key}`;
                              return (
                                <div key={key}>
                                  <label style={lbl}>{section.label}</label>
                                  {section.type === 'image' ? (
                                    <div>
                                      {editedContent[key] && (
                                        <div style={{ position: 'relative', marginBottom: '.5rem', display: 'inline-block' }}>
                                          <img src={editedContent[key]} alt={section.label} style={{ maxWidth: '100%', maxHeight: 200, borderRadius: '.5rem', border: '1px solid #ddd' }} />
                                          <button onClick={() => setEditedContent(prev => ({ ...prev, [key]: '' }))} style={{ position: 'absolute', top: -8, right: -8, background: '#c0392b', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: '.8rem' }}>✕</button>
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                                        <button onClick={() => { setMediaPickerTarget(key); setTab('media'); }} style={{ padding: '.5rem 1rem', background: '#01696f', color: 'white', border: 'none', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.85rem' }}>🖼️ Choisir dans la médiathèque</button>
                                        <label style={{ padding: '.5rem 1rem', background: '#2d5f54', color: 'white', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.85rem' }}>
                                          ⬆️ Upload
                                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const fd = new FormData();
                                            fd.append('file', file);
                                            const res = await fetch('/api/cms/upload', { method: 'POST', body: fd });
                                            const data = await res.json();
                                            if (data.url) setEditedContent(prev => ({ ...prev, [key]: data.url }));
                                          }} />
                                        </label>
                                        <input value={editedContent[key] ?? ''} onChange={e => setEditedContent(prev => ({ ...prev, [key]: e.target.value }))} style={{ ...inp, flex: 1, minWidth: 200 }} placeholder="Ou coller une URL d'image..." />
                                      </div>
                                    </div>
                                  ) : section.type === 'richtext' ? (
                                    <textarea
                                      value={editedContent[key] ?? ''}
                                      onChange={e => setEditedContent(prev => ({ ...prev, [key]: e.target.value }))}
                                      style={{ ...inp, height: 180, resize: 'vertical', fontFamily: 'monospace', fontSize: '.85rem' }}
                                      placeholder={section.label}
                                    />
                                  ) : section.type === 'textarea' ? (
                                    <textarea
                                      value={editedContent[key] ?? ''}
                                      onChange={e => setEditedContent(prev => ({ ...prev, [key]: e.target.value }))}
                                      style={{ ...inp, height: 110, resize: 'vertical' }}
                                      placeholder={section.label}
                                    />
                                  ) : (
                                    <input
                                      value={editedContent[key] ?? ''}
                                      onChange={e => setEditedContent(prev => ({ ...prev, [key]: e.target.value }))}
                                      style={inp}
                                      placeholder={section.label}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => savePageContent(activePage)}
                              disabled={savingSettings}
                              style={{ padding: '.75rem 2.25rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '.95rem', opacity: savingSettings ? .7 : 1 }}
                            >
                              {savingSettings ? '⏳ Sauvegarde…' : '💾 Sauvegarder la page'}
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MÃ‰DIATHÃˆQUE ── */}
        {tab === 'media' && (
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,.07)', minHeight: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2d5f54' }}>🖼️ Médiathèque</h2>
              <p style={{ fontSize: '.85rem', color: '#888' }}>Supabase Storage</p>
            </div>
            <div style={{ background: '#faf8f5', borderRadius: '.75rem', padding: '2rem', textAlign: 'center', border: '2px dashed #e8e3dc' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>â˜ï¸</div>
              <p style={{ color: '#555', marginBottom: '1.25rem', lineHeight: 1.6 }}>Toutes tes images sont stockées sur <strong>Supabase Storage</strong>.</p>
              <button onClick={() => setShowMediaLibrary(true)}
                style={{ padding: '.8rem 1.75rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '.95rem' }}
              >🖼️ Ouvrir la médiathèque</button>
            </div>
          </div>
        )}

        {/* ── TRAVEL PLANNING ── */}
        {tab === 'demandes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2d5f54' }}>✈️ Demandes Travel Planning</h2>
              <button onClick={loadDemandes} disabled={loadingDemandes} style={{ padding: '.5rem 1rem', background: 'white', border: '1.5px solid #ddd', borderRadius: '.5rem', cursor: loadingDemandes ? 'wait' : 'pointer', fontSize: '.85rem', opacity: loadingDemandes ? .7 : 1 }}>{loadingDemandes ? '⏳ Actualisation…' : '🔄 Actualiser'}</button>
            </div>
            {loadingDemandes ? <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Chargement…</p>
              : demandes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
                  <p>Aucune demande pour le moment</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {demandes.map(d => (
                    <div key={d.id} style={{ background: 'white', borderRadius: '.75rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.75rem', flexWrap: 'wrap', gap: '.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>{d.prenom} {d.nom}</div>
                          <div style={{ fontSize: '.85rem', color: '#888' }}>{d.email} {d.telephone && `· ${d.telephone}`}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                          <span style={{ fontSize: '.75rem', color: '#aaa' }}>{fmt(d.created_at)}</span>
                          <select value={d.statut || 'nouvelle'} onChange={e => updateStatut(d.id, e.target.value)} disabled={updatingDemandeId === d.id}
                            style={{ padding: '.3rem .7rem', border: '1.5px solid #ddd', borderRadius: '.4rem', fontSize: '.82rem', cursor: updatingDemandeId === d.id ? 'wait' : 'pointer', opacity: updatingDemandeId === d.id ? .7 : 1 }}
                          >
                            <option value="nouvelle">🆕 Nouvelle</option>
                            <option value="en_cours">🔄 En cours</option>
                            <option value="devis_envoye">📨 Devis envoyé</option>
                            <option value="accepte">✅ Acceptée</option>
                            <option value="terminee">🏁 Terminée</option>
                            <option value="annulee">âŒ Annulée</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '.5rem .75rem', fontSize: '.85rem', color: '#555' }}>
                        {d.destination && <span>📍 <strong>Destination :</strong> {d.destination}</span>}
                        {d.style_voyage && <span>🌿 <strong>Style :</strong> {d.style_voyage}</span>}
                        {d.duree_jours && <span>📅 <strong>Durée :</strong> {d.duree_jours} jours</span>}
                        {d.mois_depart && <span>🗓 <strong>Départ :</strong> {d.mois_depart}</span>}
                        {d.budget_fourchette && <span>💶 <strong>Budget :</strong> {d.budget_fourchette}</span>}
                        {d.nb_voyageurs && <span>👫 <strong>Voyageurs :</strong> {d.nb_voyageurs}</span>}
                      </div>
                      {d.notes && (
                        <div style={{ marginTop: '.75rem', padding: '.75rem', background: '#faf8f5', borderRadius: '.5rem', fontSize: '.85rem', color: '#666', borderLeft: '3px solid #d4a88a' }}>💬 {d.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ── BOOKING ── */}
        {tab === 'booking' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Création en masse */}
            <div style={{ gridColumn: '1 / -1', background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,.07)', marginBottom: '-.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d5f54', marginBottom: '1rem' }}>🗓 Créneaux récurrents — Ajout en masse</h2>
              <BulkSlotCreator onCreated={loadBookingSlots} />
            </div>
            {/* Add slot */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,.07)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d5f54', marginBottom: '1rem' }}>📅 Ajouter un créneau</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                <div>
                  <label style={lbl}>Date</label>
                  <input type="date" value={newSlot.date}
                    onChange={e => setNewSlot(p => ({...p, date: e.target.value}))}
                    style={inp} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label style={lbl}>Heure</label>
                  <select value={newSlot.time}
                    onChange={e => setNewSlot(p => ({...p, time: e.target.value}))}
                    style={inp}>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Type</label>
                  <select value={newSlot.type}
                    onChange={e => setNewSlot(p => ({...p, type: e.target.value}))}
                    style={inp}>
                    <option value="coaching">Coaching (60 min)</option>
                    <option value="discovery">Découverte (30 min)</option>
                    <option value="enterprise">Entreprise</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Notes</label>
                  <input type="text" value={newSlot.notes}
                    onChange={e => setNewSlot(p => ({...p, notes: e.target.value}))}
                    style={inp} placeholder="En ligne, présentiel..." />
                </div>
                <button onClick={saveNewSlot} disabled={savingSlot}
                  style={{ padding: '.75rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 700, cursor: 'pointer' }}>
                  {savingSlot ? 'Ajout...' : '+ Ajouter le créneau'}
                </button>
              </div>
            </div>
            {/* Slots list */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,.07)', maxHeight: 600, overflow: 'auto' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d5f54', marginBottom: '1rem' }}>
                📆 Créneaux ({bookingSlots.length})
              </h2>
              {loadingSlots ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Chargement...</p>
              ) : bookingSlots.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Aucun créneau</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  {bookingSlots.map(slot => (
                    <div key={slot.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem', background: '#faf9f7', borderRadius: '.5rem', border: '1px solid #e8e4df' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#333' }}>{slot.slot_date} à {slot.slot_time}</div>
                        <div style={{ fontSize: '.8rem', color: '#666' }}>{slot.slot_type} · {slot.duration_minutes} min</div>
                      </div>
                      <button onClick={() => deleteSlot(slot.id)}
                        style={{ padding: '.3rem .6rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '.3rem', cursor: 'pointer', fontSize: '.8rem' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Requests */}
            <div style={{ gridColumn: '1 / -1', background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,.07)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d5f54', marginBottom: '1rem' }}>
                📋 Demandes ({bookingRequests.length})
              </h2>
              {bookingRequests.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>Aucune demande</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  {bookingRequests.map(req => (
                    <div key={req.id} style={{ padding: '1rem', background: '#faf9f7', borderRadius: '.75rem', border: '1px solid #e8e4df' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                        <strong>{req.client_name}</strong>
                        <span style={{ color: '#888' }}>{req.client_email}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem' }}>
                        <button onClick={() => updateRequestStatus(req.id, 'confirmed')}
                          style={{ padding: '.4rem .8rem', background: '#166534', color: 'white', border: 'none', borderRadius: '.4rem', cursor: 'pointer' }}>
                          ✅ Confirmer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CAROUSEL ── */}
        {tab === 'carousel' && (
          <div className="space-y-6">
            <CarouselGenerator />
            <CarouselEditor />
          </div>
        )}

        {/* ── BLOG IA ── */}
        {tab === 'blog' && (
          <BlogGenerator
            onGenerated={(data) => {
              setEditingArticle({
                title: data.title,
                slug: data.suggestedSlug,
                excerpt: data.excerpt,
                content: data.content,
                voice_notes: '',
                featured_image: '',
                category: 'Voyage',
                published: false,
              });
              showToast('✅ Article généré ! Edite-le puis enregistre.');
              setTab('new');
            }}
          />
        )}


        {/* ── MESSAGES ── */}
        {tab === 'messages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2d5f54' }}>💬 Messages reçus</h2>
              <button onClick={loadMessages} style={{ padding: '.45rem 1rem', background: '#f5f0eb', border: 'none', borderRadius: '.5rem', cursor: 'pointer', fontSize: '.85rem', color: '#555' }}>↻ Actualiser</button>
            </div>
            {loadingMessages ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Chargement…</p>
            ) : messages.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#aaa', padding: '3rem' }}>Aucun message pour le moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {messages.map(m => (
                  <div key={m.id} style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,.06)', borderLeft: m.status === 'unread' ? '4px solid #2d5f54' : '4px solid #e0dbd5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '.95rem', color: '#1a1a1a', marginBottom: '.2rem' }}>{m.name} <span style={{ fontWeight: 400, color: '#888' }}>— {m.email}</span></p>
                        <p style={{ fontSize: '.8rem', color: '#aaa', marginBottom: '.75rem' }}>{fmt(m.created_at)}</p>
                        <p style={{ fontSize: '.9rem', color: '#444', whiteSpace: 'pre-wrap' }}>{m.message}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', flexShrink: 0 }}>
                        {m.status !== 'read' && (
                          <button onClick={async () => {
                            await fetch(`/api/cms/contact-messages/${m.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-cms-token': localStorage.getItem('cms_token') || '' }, body: JSON.stringify({ status: 'read' }) });
                            setMessages(prev => prev.map(x => x.id === m.id ? { ...x, status: 'read' } : x));
                          }} style={{ padding: '.35rem .75rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600 }}>
                            ✓ Marquer lu
                          </button>
                        )}
                        <button onClick={async () => {
                          if (!confirm('Supprimer ce message ?')) return;
                          await fetch(`/api/cms/contact-messages/${m.id}`, { method: 'DELETE', headers: { 'x-cms-token': localStorage.getItem('cms_token') || '' } });
                          setMessages(prev => prev.filter(x => x.id !== m.id));
                        }} style={{ padding: '.35rem .75rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600 }}>
                          🗑 Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* ── PARAMÃˆTRES ── */}
        {tab === 'settings' && (
          <div>
            {loadingSettings ? <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Chargement…</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* Sidebar settings */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                  <p style={{ fontSize: '.75rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.75rem', padding: '0 .5rem' }}>Paramètres globaux</p>
                  {Object.entries(SETTINGS_GROUPS).map(([key, cfg]) => (
                    <button key={key} onClick={() => setSettingsGroup(key)}
                      style={{ display: 'flex', alignItems: 'center', gap: '.5rem', width: '100%', textAlign: 'left', padding: '.6rem .75rem', borderRadius: '.5rem', border: 'none', cursor: 'pointer', fontSize: '.88rem', fontWeight: settingsGroup === key ? 700 : 400, background: settingsGroup === key ? '#f0e8e4' : 'transparent', color: settingsGroup === key ? '#2d5f54' : '#555', marginBottom: '.2rem' }}
                    >
                      <span>{cfg.emoji}</span> {cfg.label}
                    </button>
                  ))}
                </div>

                {/* Panel settings */}
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                  {/* ── MAINTENANCE MODE ── */}
                  <MaintenanceModeToggle />
                  
                  {(() => {
                    const groupItems = settings.filter(s => s.group_name === settingsGroup);
                    const groupCfg = SETTINGS_GROUPS[settingsGroup];
                    return (
                      <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d5f54', marginBottom: '1.5rem' }}>
                          {groupCfg?.emoji} {groupCfg?.label}
                        </h2>
                        {/* ── BRANDING PANEL ── */}
                        {settingsGroup === 'branding' && (
                          <div style={{ marginBottom: '2rem' }}>
                            {/* Prévisualisation live */}
                            <div style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', background: 'white', borderRadius: '.75rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: 260, background: '#fff', borderBottom: '1px solid #f0ece8', borderRadius: '.5rem .5rem 0 0', padding: '.6rem 1rem', display: 'flex', alignItems: 'center', gap: '.75rem', justifyContent: (editedSettings['logo_position'] || 'left') === 'center' ? 'center' : 'flex-start' }}>
                                {editedSettings['logo_url'] ? (
                                  <img
                                    src={editedSettings['logo_url']}
                                    alt="Logo prévisualisation"
                                    style={{
                                      width: Number(editedSettings['logo_size'] || 44),
                                      height: Number(editedSettings['logo_size'] || 44),
                                      borderRadius: (editedSettings['logo_shape'] || 'circle') === 'circle' ? '50%' : (editedSettings['logo_shape'] === 'rounded' ? '12px' : '4px'),
                                      objectFit: 'cover',
                                      border: '1px solid #eee',
                                    }}
                                  />
                                ) : (
                                  <div style={{
                                    width: Number(editedSettings['logo_size'] || 44),
                                    height: Number(editedSettings['logo_size'] || 44),
                                    borderRadius: (editedSettings['logo_shape'] || 'circle') === 'circle' ? '50%' : (editedSettings['logo_shape'] === 'rounded' ? '12px' : '4px'),
                                    background: '#2d5f54',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '.7rem', fontWeight: 700, flexShrink: 0,
                                  }}>HH</div>
                                )}
                                <div>
                                  <p style={{ fontWeight: 700, fontSize: '.9rem', color: '#1a1a1a', margin: 0, fontFamily: 'Georgia, serif' }}>{editedSettings['site_name'] || 'Happy Humans'}</p>
                                  {editedSettings['tagline'] && <p style={{ fontSize: '.7rem', color: '#c9a96e', margin: 0, fontStyle: 'italic' }}>{editedSettings['tagline']}</p>}
                                </div>
                              </div>
                              <p style={{ fontSize: '.78rem', color: '#aaa', margin: 0 }}>← Prévisualisation header</p>
                            </div>

                            {/* Upload logo */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={lbl}>Logo (image)</label>
                              <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <label style={{ padding: '.5rem 1rem', background: '#2d5f54', color: 'white', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.85rem', display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
                                  ⬆ Upload logo
                                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const fd = new FormData(); fd.append('file', file);
                                    const res = await fetch('/api/cms/upload', { method: 'POST', body: fd });
                                    const { url } = await res.json();
                                    if (url) setEditedSettings(p => ({ ...p, logo_url: url }));
                                  }} />
                                </label>
                                <input type="text" value={editedSettings['logo_url'] || ''} placeholder="Ou coller une URL d'image"
                                  onChange={e => setEditedSettings(p => ({ ...p, logo_url: e.target.value }))}
                                  style={{ ...inp, flex: 1, minWidth: 200 }} />
                                {editedSettings['logo_url'] && (
                                  <button onClick={() => setEditedSettings(p => ({ ...p, logo_url: '' }))}
                                    style={{ padding: '.4rem .6rem', background: '#fee2e2', border: 'none', borderRadius: '.3rem', cursor: 'pointer', fontSize: '.8rem', color: '#dc2626' }}>✕</button>
                                )}
                              </div>
                            </div>

                            {/* Taille du logo */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={lbl}>Taille du logo — {editedSettings['logo_size'] || 44}px</label>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '.75rem', color: '#aaa' }}>24px</span>
                                <input type="range" min="24" max="96" step="4"
                                  value={Number(editedSettings['logo_size'] || 44)}
                                  onChange={e => setEditedSettings(p => ({ ...p, logo_size: e.target.value }))}
                                  style={{ flex: 1, accentColor: '#2d5f54' }} />
                                <span style={{ fontSize: '.75rem', color: '#aaa' }}>96px</span>
                                {/* Tailles prédéfinies */}
                                {[['XS', '28'], ['S', '36'], ['M', '44'], ['L', '56'], ['XL', '72']].map(([label, val]) => (
                                  <button key={val} onClick={() => setEditedSettings(p => ({ ...p, logo_size: val }))}
                                    style={{ padding: '.2rem .5rem', fontSize: '.72rem', border: `1px solid ${editedSettings['logo_size'] === val ? '#2d5f54' : '#ddd'}`, borderRadius: '.3rem', cursor: 'pointer', background: editedSettings['logo_size'] === val ? '#2d5f54' : 'white', color: editedSettings['logo_size'] === val ? 'white' : '#555' }}>
                                    {label}
                                  </button>
                                ))}
                              </div>

                            {/* Taille logo footer */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={lbl}>Taille logo footer — {editedSettings['logo_footer_size'] || 36}px</label>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '.75rem', color: '#aaa' }}>20px</span>
                                <input type="range" min="20" max="72" step="4"
                                  value={Number(editedSettings['logo_footer_size'] || 36)}
                                  onChange={e => setEditedSettings(p => ({ ...p, logo_footer_size: e.target.value }))}
                                  style={{ flex: 1, accentColor: '#2d5f54' }} />
                                <span style={{ fontSize: '.75rem', color: '#aaa' }}>72px</span>
                                {[['S', '24'], ['M', '36'], ['L', '48']].map(([label, val]) => (
                                  <button key={val} onClick={() => setEditedSettings(p => ({ ...p, logo_footer_size: val }))}
                                    style={{ padding: '.2rem .5rem', fontSize: '.72rem', border: `1px solid ${editedSettings['logo_footer_size'] === val ? '#2d5f54' : '#ddd'}`, borderRadius: '.3rem', cursor: 'pointer', background: editedSettings['logo_footer_size'] === val ? '#2d5f54' : 'white', color: editedSettings['logo_footer_size'] === val ? 'white' : '#555' }}>
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Position du logo */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={lbl}>Position dans le header</label>
                              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                                {[['Gauche', 'left'], ['Centré', 'center']].map(([label, val]) => (
                                  <button key={val} onClick={() => setEditedSettings(p => ({ ...p, logo_position: val }))}
                                    style={{ padding: '.45rem 1.1rem', fontSize: '.82rem', fontWeight: 600, border: `1.5px solid ${(editedSettings['logo_position'] || 'left') === val ? '#2d5f54' : '#ddd'}`, borderRadius: '.5rem', cursor: 'pointer', background: (editedSettings['logo_position'] || 'left') === val ? '#2d5f54' : 'white', color: (editedSettings['logo_position'] || 'left') === val ? 'white' : '#555', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                                    {val === 'left'
                                      ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><line x1="14" y1="6" x2="21" y2="6"/></svg>{label}</>
                                      : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="8" y2="6"/><rect x="9" y="3" width="6" height="6" rx="1"/><line x1="16" y1="6" x2="21" y2="6"/></svg>{label}</>
                                    }
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Forme du logo */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={lbl}>Forme du logo</label>
                              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                                {[['Cercle', 'circle'], ['Arrondi', 'rounded'], ['Carré', 'square']].map(([label, val]) => {
                                  const active = (editedSettings['logo_shape'] || 'circle') === val;
                                  const size = 32;
                                  const radius = val === 'circle' ? '50%' : val === 'rounded' ? '6px' : '2px';
                                  return (
                                    <button key={val} onClick={() => setEditedSettings(p => ({ ...p, logo_shape: val }))}
                                      style={{ padding: '.45rem 1rem', fontSize: '.82rem', fontWeight: 600, border: `1.5px solid ${active ? '#2d5f54' : '#ddd'}`, borderRadius: '.5rem', cursor: 'pointer', background: active ? '#2d5f54' : 'white', color: active ? 'white' : '#555', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                      <div style={{ width: size, height: size, borderRadius: radius, background: active ? 'rgba(255,255,255,.3)' : '#e8e4df', border: `1px solid ${active ? 'rgba(255,255,255,.4)' : '#ccc'}`, flexShrink: 0 }} />
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            </div>
                          </div>
                        )}

                        {/* ── THEME PICKER ── */}
                        {settingsGroup === 'theme' && (
                          <div style={{ marginBottom: '2rem' }}>
                            <p style={{ fontSize: '.85rem', color: '#888', marginBottom: '1rem' }}>Choisissez un thème visuel pour tout le site. Cliquez pour appliquer instantanément.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                              {Object.entries(THEMES).map(([key, theme]) => {
                                const isActive = (editedSettings['theme_preset'] || 'forest') === key;
                                return (
                                  <button key={key} onClick={() => setEditedSettings(p => ({ ...p, theme_preset: key }))}
                                    style={{ border: isActive ? `3px solid ${theme.primary}` : '2px solid #e5e7eb', borderRadius: '.75rem', padding: '1rem .75rem', cursor: 'pointer', background: theme.bg, textAlign: 'center', transition: 'all .15s', boxShadow: isActive ? `0 0 0 2px ${theme.primary}33` : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '.5rem' }}>
                                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: theme.primary }} />
                                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: theme.accent }} />
                                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: theme.dark }} />
                                    </div>
                                    <p style={{ fontWeight: isActive ? 700 : 500, fontSize: '.82rem', color: theme.text, margin: 0 }}>{theme.label}</p>
                                    {isActive && <p style={{ fontSize: '.7rem', color: theme.primary, margin: '2px 0 0', fontWeight: 600 }}>✓ Actif</p>}
                                  </button>
                                );
                              })}
                            </div>
                            <div style={{ borderTop: '1px solid #f0ece8', paddingTop: '1.5rem' }}>
                              <p style={{ fontSize: '.82rem', fontWeight: 600, color: '#555', marginBottom: '1rem' }}>Couleurs personnalisées (optionnel — surcharge le thème)</p>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                  { key: 'theme_primary', label: 'Couleur principale' },
                                  { key: 'theme_accent',  label: 'Couleur accent' },
                                  { key: 'theme_dark',    label: 'Couleur sombre (nav/footer)' },
                                  { key: 'theme_bg',      label: 'Couleur fond' },
                                ].map(({ key, label }) => (
                                  <div key={key}>
                                    <label style={lbl}>{label}</label>
                                    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                                      <input type="color" value={editedSettings[key] || '#2d5f54'}
                                        onChange={e => setEditedSettings(p => ({ ...p, [key]: e.target.value }))}
                                        style={{ width: 40, height: 36, border: 'none', borderRadius: '.3rem', cursor: 'pointer', padding: 2 }} />
                                      <input type="text" value={editedSettings[key] || ''}
                                        onChange={e => setEditedSettings(p => ({ ...p, [key]: e.target.value }))}
                                        placeholder="ex: #2d5f54"
                                        style={{ ...inp, flex: 1 }} />
                                      {editedSettings[key] && (
                                        <button onClick={() => setEditedSettings(p => { const n = {...p}; delete n[key]; return n; })}
                                          style={{ padding: '.3rem .5rem', background: '#fee2e2', border: 'none', borderRadius: '.3rem', cursor: 'pointer', fontSize: '.75rem', color: '#dc2626' }}>
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <button onClick={() => setEditedSettings(p => {
                                const n = {...p};
                                delete n['theme_primary']; delete n['theme_accent'];
                                delete n['theme_dark']; delete n['theme_bg'];
                                return n;
                              })} style={{ marginTop: '1rem', padding: '.4rem .9rem', background: '#f5f0eb', border: 'none', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.8rem', color: '#666' }}>
                                Réinitialiser les couleurs personnalisées
                              </button>

                            {/* Position du logo */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={lbl}>Position dans le header</label>
                              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                                {[['Gauche', 'left'], ['Centré', 'center']].map(([label, val]) => (
                                  <button key={val} onClick={() => setEditedSettings(p => ({ ...p, logo_position: val }))}
                                    style={{ padding: '.45rem 1.1rem', fontSize: '.82rem', fontWeight: 600, border: `1.5px solid ${(editedSettings['logo_position'] || 'left') === val ? '#2d5f54' : '#ddd'}`, borderRadius: '.5rem', cursor: 'pointer', background: (editedSettings['logo_position'] || 'left') === val ? '#2d5f54' : 'white', color: (editedSettings['logo_position'] || 'left') === val ? 'white' : '#555', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                                    {val === 'left'
                                      ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><line x1="14" y1="6" x2="21" y2="6"/></svg>{label}</>
                                      : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="8" y2="6"/><rect x="9" y="3" width="6" height="6" rx="1"/><line x1="16" y1="6" x2="21" y2="6"/></svg>{label}</>
                                    }
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Forme du logo */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={lbl}>Forme du logo</label>
                              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                                {[['Cercle', 'circle'], ['Arrondi', 'rounded'], ['Carré', 'square']].map(([label, val]) => {
                                  const active = (editedSettings['logo_shape'] || 'circle') === val;
                                  const size = 32;
                                  const radius = val === 'circle' ? '50%' : val === 'rounded' ? '6px' : '2px';
                                  return (
                                    <button key={val} onClick={() => setEditedSettings(p => ({ ...p, logo_shape: val }))}
                                      style={{ padding: '.45rem 1rem', fontSize: '.82rem', fontWeight: 600, border: `1.5px solid ${active ? '#2d5f54' : '#ddd'}`, borderRadius: '.5rem', cursor: 'pointer', background: active ? '#2d5f54' : 'white', color: active ? 'white' : '#555', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                      <div style={{ width: size, height: size, borderRadius: radius, background: active ? 'rgba(255,255,255,.3)' : '#e8e4df', border: `1px solid ${active ? 'rgba(255,255,255,.4)' : '#ccc'}`, flexShrink: 0 }} />
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            </div>
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                          {groupItems.map(s => {
                            const field = s as { key: string; label: string; type: string; options?: string[]; optionLabels?: string[] };
                            return (
                            <div key={s.key}>
                              <label style={lbl}>{s.label}</label>
                              {field.type === 'image' ? (
                                <div>
                                  {editedSettings[s.key] && (
                                    <div style={{ marginBottom: '.5rem' }}>
                                      <img src={editedSettings[s.key]} alt="Logo" style={{ maxHeight: 80, maxWidth: 300, objectFit: 'contain', borderRadius: '.4rem', border: '1px solid #eee', padding: '.5rem', background: '#fafafa' }} />
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <label style={{ padding: '.5rem 1rem', background: '#2d5f54', color: 'white', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.85rem' }}>
                                      ⬆️ Upload logo
                                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const fd = new FormData();
                                        fd.append('file', file);
                                        const res = await fetch('/api/cms/upload', { method: 'POST', body: fd });
                                        const data = await res.json();
                                        if (data.url) setEditedSettings(prev => ({ ...prev, [s.key]: data.url }));
                                      }} />
                                    </label>
                                    <input value={editedSettings[s.key] || ''} onChange={e => setEditedSettings(prev => ({ ...prev, [s.key]: e.target.value }))} style={{ ...inp, flex: 1 }} placeholder="Ou coller une URL..." />
                                    {editedSettings[s.key] && <button onClick={() => setEditedSettings(prev => ({ ...prev, [s.key]: '' }))} style={{ padding: '.5rem .8rem', background: '#fee', color: '#c0392b', border: '1px solid #fcc', borderRadius: '.4rem', cursor: 'pointer', fontSize: '.85rem' }}>✕ Supprimer</button>}
                                  </div>
                                </div>
                              ) : field.type === 'textarea' ? (
                                <textarea value={editedSettings[s.key] || ''} onChange={e => setEditedSettings(prev => ({ ...prev, [s.key]: e.target.value }))} style={{ ...inp, height: 100, resize: 'vertical' }} placeholder={s.label} />
                              ) : field.type === 'select' && field.options ? (
                                <select
                                  value={editedSettings[s.key] || field.options[0]}
                                  onChange={e => setEditedSettings(prev => ({ ...prev, [s.key]: e.target.value }))}
                                  style={{ ...inp, cursor: 'pointer' }}
                                >
                                  {field.options.map((opt: string, i: number) => (
                                    <option key={opt} value={opt}>{field.optionLabels?.[i] || opt}</option>
                                  ))}
                                </select>
                              ) : (
                                <input value={editedSettings[s.key] || ''}
                                  onChange={e => setEditedSettings(prev => ({ ...prev, [s.key]: e.target.value }))}
                                  style={inp} placeholder={s.label} />
                              )}
                            </div>
                            );
                          })}
                          {groupItems.length === 0 && (
                            <p style={{ color: '#aaa', fontSize: '.9rem', textAlign: 'center', padding: '2rem' }}>Aucun paramètre dans ce groupe.</p>
                          )}
                        </div>
                        <button onClick={saveSettings} disabled={savingSettings}
                          style={{ marginTop: '1.75rem', padding: '.7rem 2rem', background: '#2d5f54', color: 'white', border: 'none', borderRadius: '.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem', opacity: savingSettings ? .7 : 1 }}
                        >{savingSettings ? '⏳ Sauvegarde…' : '💾 Sauvegarder'}</button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const lbl: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '.85rem', color: '#555', marginBottom: '.35rem',
};
const inp: React.CSSProperties = {
  width: '100%', padding: '.65rem .9rem',
  border: '1.5px solid #e0dbd5', borderRadius: '.5rem',
  fontSize: '.9rem', outline: 'none', background: '#faf9f7', color: '#1a1a1a',
};
const metaChip: React.CSSProperties = {
  padding: '.35rem .65rem',
  borderRadius: '9999px',
  background: '#f0e8e4',
  color: '#2d5f54',
  fontSize: '.76rem',
  fontWeight: 600,
};
const previewPanel: React.CSSProperties = {
  marginTop: '1.75rem',
  padding: '1.25rem',
  borderRadius: '1rem',
  background: '#f8f4ef',
  border: '1px solid #ece3d8',
};
const previewFrame: React.CSSProperties = {
  background: 'white',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,.05)',
};
const previewImageFallback: React.CSSProperties = {
  minHeight: 220,
  marginBottom: '1.5rem',
  borderRadius: '.9rem',
  background: 'linear-gradient(135deg, #f2e8dc 0%, #d9ebe6 100%)',
  color: '#6d625a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '1.5rem',
  fontWeight: 600,
};
const previewBody: React.CSSProperties = {
  color: '#302925',
  lineHeight: 1.8,
  fontSize: '1rem',
};


