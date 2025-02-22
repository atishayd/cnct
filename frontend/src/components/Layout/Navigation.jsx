const navigation = [
  { name: 'Contacts', href: '/contacts' },
  { name: 'Jobs', href: '/jobs' },
  { 
    name: 'Campaigns',
    href: '/campaigns',
    children: [
      { name: 'Overview', href: '/campaigns' },
      { name: 'Templates', href: '/campaigns/templates' },
      { name: 'Automations', href: '/campaigns/automations' }
    ]
  },
  { name: 'Senders', href: '/senders' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Settings', href: '/settings' },
]; 