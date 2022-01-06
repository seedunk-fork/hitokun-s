
// meta: path, title, description, image
const metaInfo2 = (meta: any): any => {
  return [
    {
      name: 'description',
      content:
        meta.description || "Hitokun's"
    },
    {
      key: 'og:description',
      property: 'og:description',
      content:
        meta.description || "Hitokun's"
    },
    {
      property: 'og:site_name',
      content: meta.title || "Hitokun's"
    },
    {
      property: 'og:title',
      content: meta.title || "Hitokun's"
    },
    {
      property: 'og:type',
      content: meta.type || 'article'
    },
    {
      key: 'og:image',
      property: 'og:image',
      content: (meta.image || "self.jpg").startsWith("http") ? meta.image : `https://hitokun-s.github.io/images/${meta.image}`
    },
    {
      property: 'og:url',
      content: `https://hitokun-s.github.io${meta.path}`
    },
    {
      name: 'twitter:card',
      content: meta.twittercard || "summary"
    },
    {
      name: 'twitter:site',
      content: "@hitokun-s"
    },
    {
      property: 'fb:app_id',
      content: "362864550832043"
    },
  ]
}

export {
  metaInfo2
}
