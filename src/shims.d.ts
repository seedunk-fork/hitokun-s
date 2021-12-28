declare interface Window {
  // extend the window
}

// with vite-plugin-md, markdowns can be treat as Vue components
declare module '*.md' {
  import type { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

import { Router } from 'vue-router'
declare module '@vue/runtime-core' {
   interface ComponentCustomProperties {
        $router: Router
   }
}
