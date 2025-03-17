import axios from "axios";
import { auth } from "../firebase";

export async function getNiveaux() {
  const url = `${import.meta.env.VITE_BASE_URL}/cours`;
  const token = await auth.currentUser.getIdToken();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
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
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCours(coursId) {
  const url = `${import.meta.env.VITE_BASE_URL}/cours/${coursId}`;
  const token = await auth.currentUser.getIdToken();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.delete(url, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteClasse(classeId) {
  const url = `${import.meta.env.VITE_BASE_URL}/classes/${classeId}`;
  const token = await auth.currentUser.getIdToken();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.delete(url, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getProfesseurs = async () => {
  const token = await auth.currentUser.getIdToken();
  const url = `${import.meta.env.VITE_BASE_URL}/professeurs`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(token);
  console.log(url);
  console.log(config);

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erreur lors de la récupération des professeurs");
  }
};

export const linkProfToCours = async (coursId, profId) => {
  const token = await auth.currentUser.getIdToken();
  const url = `${
    import.meta.env.VITE_BASE_URL
  }/cours/${coursId}/professeurs/${profId}`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(url, {}, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erreur lors de la liaison professeur-cours");
  }
};
