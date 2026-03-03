// js/pages/index.js
import { getUser } from "../services/userService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const user = await getUser("abc123");
    if (user) {
        document.querySelector("#welcome").textContent = `Welcome ${user.name}`;
    }
});
