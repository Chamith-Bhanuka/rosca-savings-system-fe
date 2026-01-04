export const footerConfig: FooterMenuColumn[] = [
  {
    title: 'footer.platform',
    items: [
      { label: 'footer.items.aboutUs', route: '/about' },
      { label: 'footer.items.howItWorks', route: '/howItWorks' },
      { label: 'footer.items.security', route: '/security' },
      { label: 'footer.items.fees', route: '/fees' },
    ],
  },
  {
    title: 'footer.legal',
    items: [
      { label: 'footer.items.termsOfUse', route: '/terms' },
      { label: 'footer.items.privacyPolicy', route: '/privacy' },
      { label: 'footer.items.cookiePolicy', route: '/cookies' },
      { label: 'footer.items.compliance', route: '/compliance' },
    ],
  },
];

export interface FooterMenuItem {
  label: string;
  route: string;
}

export interface FooterMenuColumn {
  title: string;
  items: FooterMenuItem[];
}
