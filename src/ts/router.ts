import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import Message from "@/components/Message.vue"
import NotFoundView from "@/views/NotFoundView.vue";
import { loadToken } from "@/ts/saveload.ts";
import { createRouter, createWebHistory} from "vue-router";
import CreateChannelView from "@/views/CreateChannelView.vue";

// Set up the routes
const routes = [
		{
            path : "/",
            name : "Home",
            component : HomeView,
			children: [
				{
					path: 'channel/:id',
					name : "Channel Details",
					component: Message
				}
			]
        },
        {
            path : "/login",
            name : "Login",
            component : LoginView,
            
        },
        {
            path: '/channel/create',
            name : "Channel",
            component : CreateChannelView
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
const isTokenValid = async (token: string): bool => {

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


// Safe guard, cant access other pages if your not connected
router.beforeEach(async (to, from) => {

	// If there is a token and is valid, the user is connected
	let token = loadToken();
	const valid = await isTokenValid(token);

	if(!valid && to.name !== 'Login') {
		return { name : 'Login' };
	}

	// If the user is already login redirect to home page
	if(valid && to.name === 'Login') {
		return { name: 'Home'};
	}
})
