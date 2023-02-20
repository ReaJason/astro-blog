export interface NavigationGroup {
  label?: string
  items: NavigationLink[]
}

export interface NavigationLink {
  href: string
  label: string
  externalLink?: boolean
  active?: Function
  iconClass: string
}
