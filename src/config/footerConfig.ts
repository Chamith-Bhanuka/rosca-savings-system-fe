export const footerConfig: FooterMenuColumn[] = [
  {
    title: 'footer.platform',
    items: [
      { label: 'footer.aboutUs', route: '/about' },
      { label: 'footer.howItWorks', route: '/how' },
      { label: 'footer.security', route: '/security' },
      { label: 'footer.fees', route: '/fees' },
    ],
  },
  {
    title: 'footer.legal',
    items: [
      { label: 'footer.termsOfUse', route: '/terms' },
      { label: 'footer.privacyPolicy', route: '/privacy' },
      { label: 'footer.cookePolicy', route: '/cookies' },
      { label: 'footer.compliance', route: '/compliance' },
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
