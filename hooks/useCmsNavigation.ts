'use client';
import { useState, useEffect } from 'react';

export type NavItem = {
  id: string;
  href?: string;
  label: string;
  visible: boolean;
  position: number;
  isDropdown?: boolean;
  isCta?: boolean;
  icon?: string;
  dropdownItems?: NavItem[];
};

const DEFAULT_NAV: NavItem[] = [
  { id: '1', href: '/a-propos',       label: 'Monica',             visible: true, position: 1 },
  { id: '2', label: 'Coaching',      visible: true, position: 2,  isDropdown: true,
    dropdownItems: [
      { id: '2a', href: '/coaching',         label: 'Coaching individuel', visible: true, position: 1, icon: 'star' },
      { id: '2b', href: '/temoignages',      label: 'Témoignages',        visible: false, position: 2, icon: 'chat' },
      { id: '2c', href: '/sparring-partner', label: 'Sparring Partner',   visible: true, position: 3, icon: 'users' },
    ]},
  { id: '3', href: '/entreprises',    label: 'Organisations',      visible: true, position: 3 },
  { id: '4', href: '/happiness-design',label: 'Happiness Design',visible: true, position: 4 },
  { id: '5', href: '/relations',      label: 'Relations',          visible: true, position: 5 },
  { id: '6', href: '/contact',        label: 'Contact',            visible: true, position: 6 },
  { id: '7', href: '/booking',        label: 'Réserver une séance',visible: true, position: 7, isCta: true },
];

export function useCmsNavigation(): { nav: NavItem[]; loading: boolean } {
  const [nav, setNav] = useState<NavItem[]>(DEFAULT_NAV);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/cms/navigation')
      .then(r => r.ok ? r.json() : { nav: null })
      .then(({ nav: items }) => {
        if (items && Array.isArray(items) && items.length > 0) {
          setNav(items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { nav, loading };
}
