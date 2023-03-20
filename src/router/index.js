import { createRouter, createWebHistory } from "vue-router";
import Form from "../components/savedView.js/Form.vue";

const routes = [
    { path: '/saveView', name: 'Save View', component: Form }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router