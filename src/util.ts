
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
                key: 'og:site_name',
                property: 'og:site_name',
                content: meta.title || "Hitokun's"
            },
            {
                key: 'og:title',
                property: 'og:title',
                content: meta.title || "Hitokun's"
            },
            {
                key: 'og:type',
                property: 'og:type',
                content: meta.type || 'article'
            },
            {
                key: 'og:image',
                property: 'og:image',
                content: `https://hitokun-s.github.io/images/${meta.image || "self.jpg"}`
            },
            {
                key: 'og:url',
                property: 'og:url',
                content: `https://hitokun-s.github.io${instance.$route.fullPath}`
            },
            {
                key: 'twitter:card',
                name: 'twitter:card',
                content: meta.twittercard || "summary"
            },
            {
                key: 'twitter:site',
                name: 'twitter:site',
                content: "@hitokun-s"
            },
            {
                key: 'fb:app_id',
                property: 'fb:app_id',
                content: "362864550832043"
            },
        ]
    }
}

export {
    metaInfo
}
