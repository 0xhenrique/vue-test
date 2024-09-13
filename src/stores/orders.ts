import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const OrderStore = defineStore("order", () => {
  const isLoading = ref(false);
  const orderList = ref<Array<any>>([]);
  const orderInfo = ref<{ userId: number; orderDate: string, product: string }>({
    userId: 0,
    orderDate: "",
    product: ""
  });
  
  const getOrderList = async (userId: number) => {
    try {
      isLoading.value = true;
      const response = await axios.get(`${API_BASE_URL}/orders/${userId}`);
      orderList.value = response.data;
      isLoading.value = false;
    } catch (err) {
      isLoading.value = false;
      return err;
    }
  };

  const updateOrderById = async ({ id, orderDate, product }: { id: number, orderDate: string, product: string }) => {
    try {
      isLoading.value = true;
      const request = await axios.put(`${API_BASE_URL}/order/${id}/edit`, {
	orderDate: orderDate,
	product: product
      });
      isLoading.value = false;
      return request.data;
    } catch(err) {
      isLoading.value = false;
      return err;
    }
  }

  const deleteOrderById = async (orderId: number) => {
    try {
      isLoading.value = true;
      const request = await axios.delete(`${API_BASE_URL}/orders/${orderId}`);
      isLoading.value = false;
      return request.data;
    } catch(err) {
      isLoading.value = false;
    }
  }

  const setTestOrder = async () => {
    try {
      isLoading.value = true;
      const request = await axios.post(`${API_BASE_URL}/orders`, {
	user: 8,
	orderDate: "tomorrw",
	product: "product name"
      });

      isLoading.value = false;
      return request.data;
    } catch(err) {
      isLoading.value = false;
      return err;
    }
  }

  const setNewOrder = async ({ userId, orderDate, product}: { userId: string, orderDate: string, product: string }) => {
    try {
      isLoading.value = true;
      const request = await axios.post(`${API_BASE_URL}/orders`, {
	user: userId,
	orderDate: orderDate,
	product: product
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
    setNewOrder,
    orderInfo,
    orderList,
    updateOrderById,
    deleteOrderById,
    getOrderList,
    setTestOrder
  }
});
