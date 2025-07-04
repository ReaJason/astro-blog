// @unocss-include
import type { NavigationGroup } from 'src/types/sideBar'

export const navigations: NavigationGroup[] = [
  {
    items: [
      {
        label: 'Home',
        href: '/',
        iconClass: 'i-carbon-activity',
      },
      {
        label: 'Writing',
        href: '/writing',
        iconClass: 'i-fa-solid-book-open',
      },
      {
        label: 'Friends',
        href: '/friends',
        iconClass: 'i-fa-solid-user-friends',
      },
      {
        label: "RSS",
        href: "/rss.xml",
        iconClass: "i-simple-icons-rss",
        externalLink: true
      }
    ],
  },
  // {
  //   label: 'Me',
  //   items: [
  //     {
  //       label: 'Plans',
  //       href: '/plans',
  //       iconClass: 'i-fa-solid-tree',
  //     },
  //     {
  //       label: 'Bookmarks',
  //       href: '/bookmarks',
  //       iconClass: 'i-fa-solid-bookmark',
  //     },
  //     {
  //       label: 'Stack',
  //       href: '/stack',
  //       iconClass: 'i-simple-icons-stackoverflow',
  //     },
  //   ],
  // },
  {
    label: 'Projects',
    items: [
      {
        label: 'AstroBlog',
        href: 'https://github.com/ReaJason/astro-blog',
        iconClass: 'i-simple-icons-astro',
        externalLink: true,
      },
      {
        label: 'MemShellParty',
        href: 'https://github.com/ReaJason/MemShellParty',
        iconClass: 'i-fa-solid-dragon',
        externalLink: true,
      },
    ],
  },
  {
    label: 'Online',
    items: [
      {
        label: 'GitHub',
        href: 'https://github.com/ReaJason',
        iconClass: 'i-simple-icons-github',
        externalLink: true,
      },
      {
        label: 'Twitter',
        href: 'https://twitter.com/ReaJason_',
        iconClass: 'i-simple-icons-twitter',
        externalLink: true,
      },
      {
        label: 'Youtube',
        href: 'https://www.youtube.com/channel/UCwwMvqVrkQqJr1ILy9Ky8WQ',
        iconClass: 'i-simple-icons-youtube',
        externalLink: true,
      },
      {
        label: 'Telegram',
        href: 'https://t.me/ReaJason',
        iconClass: 'i-simple-icons-telegram',
        externalLink: true,
      },
    ],
  },
]
