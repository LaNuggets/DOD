import HomeView from "@/views/HomeView.vue";
import ConnexionView from "@/views/ConnexionView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { createRouter, createWebHistory} from "vue-router";
import CreateChannelView from "@/views/CreateChannelView.vue";

export default createRouter({
    history : createWebHistory(),
    routes : [
		{
            path : "/",
            name : "Home",
            component : HomeView,
        },
        {
            path : "/connexion",
            name : "Connexion",
            component : ConnexionView,
            
        },
        {
            path: '/protected/channel',
            name : "Channel",
            component : CreateChannelView
        },
        {
            path: '/:pathMatch(.*)*',
            name : "Not Found !",
            component : NotFoundView
        }
    ]
});
