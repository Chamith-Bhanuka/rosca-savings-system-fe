export const menuConfig: MenuColumn[] = [
  {
    title: 'menu.groups',
    items: [
      { label: 'menu.myGroups', route: '/groups' },
      { label: 'menu.createGroup', route: '/groups/create' },
      { label: 'menu.joinGroup', route: '/groups/join' },
      { label: 'menu.trustProfile', route: '/trust' },
    ],
  },
  {
    title: 'menu.actions',
    items: [
      { label: 'menu.contributions', route: '/contributions' },
      { label: 'menu.liveDraw', route: '/live-draw' },
      { label: 'menu.wallet', route: '/wallet' },
      { label: 'menu.disputes', route: '/disputes' },
    ],
  },
  {
    title: 'menu.insights',
    items: [
      { label: 'menu.analytics', route: '/analytics' },
      { label: 'menu.leaderboard', route: '/leaderboard' },
      { label: 'menu.notifications', route: '/notifications' },
    ],
  },
  {
    title: 'menu.settings',
    items: [
      { label: 'menu.adminPanel', route: '/admin' },
      { label: 'menu.help', route: '/help' },
      { label: 'menu.languageToggle', route: 'LANGUAGE_TOGGLE' },
    ],
  },
];

export interface MenuItem {
  label: string;
  route: string;
}

export interface MenuColumn {
  title: string;
  items: MenuItem[];
}
