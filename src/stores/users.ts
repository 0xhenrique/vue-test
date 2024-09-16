import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { User } from "../utils/types"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UserStore = defineStore("user", () => {
  const isLoading = ref(false);
  const userList = ref<Array<User>>([]);
  
  const getUserList = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get(`${API_BASE_URL}/users`);
      userList.value = response.data;
    } catch (err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserById = async (user: User) => {
    try {
      isLoading.value = true;
      const request = await axios.put(`${API_BASE_URL}/user/${user.id}/edit`, {
	fullName: user.fullName,
	email: user.email
      });
      return request.data;
    } catch(err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const deleteUserById = async (user: User) => {
    try {
      isLoading.value = true;
      const request = await axios.delete(`${API_BASE_URL}/users/${user.id}`);
      return request.data;
    } catch(err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const setNewUser = async (user: User) => {
    try {
      isLoading.value = true;
      const request = await axios.post(`${API_BASE_URL}/users`, {
	fullName: user.fullName,
	password: user.password,
	email: user.email
      });

      return request.data;
    } catch(err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    setNewUser,
    userList,
    updateUserById,
    deleteUserById,
    getUserList
  }
});
