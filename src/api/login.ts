
export const login = async function () {
    try {
        const response = await fetch('/login');
        console.log(response.json());
    } catch (error) {
        console.error("Error retrieving your session data.", error)
    }
}