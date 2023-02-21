import { getCollection } from 'astro:content'

export const sortedPost = async () => {
  const blogs = await getCollection("blog");
  return blogs.filter(blog => !blog.data.draft || !blog.data.hide)
  .sort((a,b) => {
    if(a.data?.sticky === b.data?.sticky){
        return a.data?.date > b.data?.date ? -1 : 1
    }else {
      return (b.data?.sticky ?? 0) - (a.data?.sticky ?? 0)
    }
  })
}
