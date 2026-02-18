import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import Message from "@/components/Message.vue"
import NotFoundView from "@/views/NotFoundView.vue";
import ModifyChannel from "@/components/ModifyChannel.vue";
import { loadToken } from "@/ts/saveload.ts";
import { createRouter, createWebHistory} from "vue-router";
const routes = [
		{
            path : "/",
            name : "Home",
            component : HomeView,
			children: [
				{
					path: 'channel/:id/:id2?',
					name : "channel-details",
					components: {
						default: Message, // Left when split
						secondary: Message // right when split
					}
				}
			]
        },
        {
            path : "/login",
            name : "Login",
            component : LoginView,
            
        },
	    {
            path: '/channel/modify/:id',
            name : "Channel modification",
            component : ModifyChannel
        },
        {
            path: '/:pathMatch(.*)*',
            name : "Not Found !",
            component : NotFoundView
        }
]

// Create router with routes and history
const router = createRouter({
	history : createWebHistory(),
	routes
})


export default router

/**
 * Check if the current user token is valid.
 *
 * @async - Wait the api responce.
 * @param {string} token - The user current token.
 * @return {bool} True if the token is valid, else false.
 */
const isTokenValid = async (token: string | null): bool => {

	if(!token)
		return false;

	try {
		const response = await fetch("https://edu.tardigrade.land/msg/protected/extend_session", {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
		});

		return response.ok;

	} catch (e: unknown) {
		return false;
	}
}

router.beforeEach(async (to, from) => {

	let token = loadToken();
	const valid = await isTokenValid(token);

	if(!valid && to.name !== 'Login') {
		return { name : 'Login' };
	}

	if(valid && to.name === 'Login') {
		return { name: 'Home'};
	}
})