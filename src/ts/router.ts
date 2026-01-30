import HomeView from "@/views/HomeView.vue";
import ConnexionView from "@/views/ConnexionView.vue";
import ChannelView from "@/views/ChannelView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { createRouter, createWebHistory} from "vue-router";

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
            path : "/channel/:id",
            name : "Channel",
            component : ChannelView,
        },
        {
            path: '/:pathMatch(.*)*',
            name : "Not Found !",
            component : NotFoundView
        }
    ]
});
