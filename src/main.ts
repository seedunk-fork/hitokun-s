// register vue composition api globally
import {ViteSSG} from 'vite-ssg'
import generatedRoutes from 'virtual:generated-pages'
import {setupLayouts} from 'virtual:generated-layouts'
import App from './App.vue'
// import VueGtag from "vue-gtag-next";
import VueGtag from "vue-gtag";

// your custom styles here
// import './styles/main.css'
import "../src/assets/main.scss"

const routes = setupLayouts(generatedRoutes)

// app.use(VueGtag, {
//     property: {
//         id: "UA-123456-7"
//     }
// });

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
    App,
    {routes: routes},
    (ctx) => {
        ctx.app.use(VueGtag, {
            config: {id: "UA-48867719-1"},
            property: {id: "UA-48867719-1"}
        });
        // install all modules under `modules/`
        Object.values(import.meta.globEager('./modules/*.ts')).map(i => i.install?.(ctx))
    },
)
