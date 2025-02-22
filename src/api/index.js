import axios from 'axios';
import { auth } from '../firebase';

export async function getNiveaux() {
    const url = `${import.meta.env.VITE_BASE_URL}/cours`;
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

export async function createCours(coursData) {
    const url = `${import.meta.env.VITE_BASE_URL}/cours`;
    const token = await auth.currentUser.getIdToken();
    const config = {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(url, coursData, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createClasse(classeData) {
    const url = `${import.meta.env.VITE_BASE_URL}/classes`;
    const token = await auth.currentUser.getIdToken();
    const config = {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(url, classeData, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getClasses() {
    const url = `${import.meta.env.VITE_BASE_URL}/classes`;
    const token = await auth.currentUser.getIdToken();
    const config = {
        headers: { 
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}