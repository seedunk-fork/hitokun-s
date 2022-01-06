import path from 'path'
import {defineConfig} from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Markdown from 'vite-plugin-md'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Inspect from 'vite-plugin-inspect'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'
import ViteRadar from 'vite-plugin-radar'

import { JSDOM } from "jsdom";
import siteInfo from "./src/site.json";
import {metaInfo2} from "./util2";

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],

      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
    }),

    // https://github.com/antfu/vite-plugin-md
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup(md) {
        md.use(Prism)
        md.use(LinkAttributes, {
          pattern: /^https?:\/\//,
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),

    // https://github.com/stafyniaksacha/vite-plugin-radar
    ViteRadar({
      enableDev: true,
      // Google Analytics tag injection
      analytics: {
        id: "UA-48867719-1",
      },
      gtm: {
        id: "GTM-TJZMBGZ"
      }
    })
  ],

  server: {
    fs: {
      strict: true,
    },
    watch: {
      usePolling: true,
    },
  },

  // see https://github.com/antfu/vite-ssg/blob/main/src/types.ts
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: "nested",
    onPageRendered: (route, indexHTML, appCtx) => {
      const info = siteInfo.find(i => i.path === route)
      if(!info){
        console.log("=== info not found for route: " + route)
        return indexHTML
      }
      const dom = new JSDOM(indexHTML);
      const doc = dom.window.document;

      const metas = metaInfo2(info);
      metas.forEach(m => {
        const keyType = m.name ? "name" : "property"
        const key = m[keyType]
        const found = doc.querySelector(`meta[${keyType}="${key}"]`)
        if(found){
          found.setAttribute("content", m.content)
        }else{
          const el = doc.createElement("meta");
          el.setAttribute(keyType, key)
          el.setAttribute("content", m.content)
          doc.head.appendChild(el)
        }
      })
      return dom.serialize();
    }
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
    ],
    exclude: [
      'vue-demi',
    ],
  },
})
