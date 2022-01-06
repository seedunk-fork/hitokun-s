import {ComponentCustomProperties} from "@vue/runtime-core";


const metaInfo = (instance: ComponentCustomProperties, meta: any): any => {
  return {
    htmlAttrs: {
      lang: 'en'
    },
    title: (meta.title) || "Hitokun's",
    meta: [
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
        content: `https://hitokun-s.github.io/images/${meta.image || "self.jpg"}`
      },
      {
        property: 'og:url',
        content: `https://hitokun-s.github.io${instance.$route.fullPath}`
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
}

export {
  metaInfo
}
