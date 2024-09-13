import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const UserStore = defineStore("user", () => {
  const isLoading = ref(false);
  const userList = ref<Array<any>>([]);
  const userInfo = ref<{ fullName: string; email: string, password: string }>({
    fullName: "",
    email: "",
    password: ""
  });
  
  const getUserList = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get("http://localhost:3333/users");
      userList.value = response.data;
      isLoading.value = false;
    } catch (err) {
      isLoading.value = false;
      return err;
    }
  };

  const updateUserById = async ({ fullName, email, id }: { fullName: string, email: string, id: number }) => {
    try {
      isLoading.value = true;
      const request = await axios.put(`http://localhost:3333/user/${id}/edit`, {
	fullName: fullName,
	email: email
      });
      isLoading.value = false;
      return request.data;
    } catch(err) {
      isLoading.value = false;
      return err;
    }
  }

  const deleteUserById = async (id: number) => {
    try {
      isLoading.value = true;
      const request = await axios.delete(`http://localhost:3333/users/${id}`);
      isLoading.value = false;
      return request.data;
    } catch(err) {
      isLoading.value = false;
    }
  }

  const setNewUser = async ({ fullName, email, password }: { fullName: string, email: string, password: string }) => {
    try {
      isLoading.value = true;
      const request = await axios.post("http://localhost:3333/users", {
	fullName: fullName,
	email: email,
	password: password
      });

      isLoading.value = false;
      return request.data;
    } catch(err) {
      isLoading.value = false;
      return err;
    }
  }

  return {
    isLoading,
    setNewUser,
    userInfo,
    userList,
    updateUserById,
    deleteUserById,
    getUserList
  }
});
