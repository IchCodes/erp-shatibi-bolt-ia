import axios from 'axios';
import { auth } from '../firebase';

export async function getNiveaux() {
    const url = `${import.meta.env.VITE_BASE_URL}/cours/coran/niveaux`;
    const token = await auth.currentUser.getIdToken();
    const config = {
        headers: { 'Authorization': `Bearer ${token}`}
    };

    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}