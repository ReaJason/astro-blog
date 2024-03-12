import { getCollection } from 'astro:content'

export const sortedPost = async () => {
  const blogs = await getCollection('blog')
  return blogs
    .filter((blog) => !blog.data.draft) // draft: true
    .filter((blog) => !blog.data.hide) // hide: true
    .sort((a, b) => {
      if (a.data?.sticky === b.data?.sticky) {
        return a.data?.date > b.data?.date ? -1 : 1
      } else {
        return (b.data?.sticky ?? 0) - (a.data?.sticky ?? 0)
      }
    })
}

export const openNavBar = () => {
  const navBar = document.getElementById('navBar')
  const overlayer = document.getElementById('overlayer')
  const menuBtns = document.querySelectorAll('.menu-btn')
  menuBtns.forEach((menuBtn) => {
    const [menuIcon, closeIcon] = menuBtn.children
    menuIcon.classList.add('hidden')
    closeIcon.classList.remove('hidden')
  })

  navBar?.classList.add('inset-y-0', 'left-0', 'shadow-lg')
  navBar?.classList.replace('-translate-x-full', 'translate-x-0')

  overlayer?.classList.replace('pointer-events-none', 'pointer-events-auto')
  overlayer?.classList.replace('opacity-0', 'opacity-100')
}

export const closeNavBar = () => {
  const navBar = document.getElementById('navBar')
  const overlayer = document.getElementById('overlayer')
  const menuBtns = document.querySelectorAll('.menu-btn')
  menuBtns.forEach((menuBtn) => {
    const [menuIcon, closeIcon] = menuBtn.children
    menuIcon.classList.remove('hidden')
    closeIcon.classList.add('hidden')
  })

  navBar?.classList.remove('inset-y-0', 'left-0', 'shadow-lg')
  navBar?.classList.replace('translate-x-0', '-translate-x-full')

  overlayer?.classList.replace('pointer-events-auto', 'pointer-events-none')
  overlayer?.classList.replace('opacity-100', 'opacity-0')
}

export const dateToString = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
}
