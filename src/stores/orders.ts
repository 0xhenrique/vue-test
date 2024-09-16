import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Order } from "../utils/types"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const OrderStore = defineStore("order", () => {
  const isLoading = ref(false);
  const orderList = ref<Array<any>>([]);
  
  const getOrderList = async (userId: number) => {
    try {
      isLoading.value = true;
      const response = await axios.get(`${API_BASE_URL}/orders/${userId}`);
      orderList.value = response.data;
    } catch (err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateOrderById = async (order: Order) => {
    try {
      isLoading.value = true;
      const request = await axios.put(`${API_BASE_URL}/order/${order.id}/edit`, {
	orderDate: order.dateOrder,
	product: order.product
      });
      return request.data;
    } catch(err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const deleteOrderById = async (order: Order) => {
    try {
      isLoading.value = true;
      const request = await axios.delete(`${API_BASE_URL}/orders/${order.id}`);
      return request.data;
    } catch(err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  const setNewOrder = async (order: Order) => {
    try {
      isLoading.value = true;
      const request = await axios.post(`${API_BASE_URL}/orders`, {
	user: order.userId,
	orderDate: order.dateOrder,
	product: order.product
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
    setNewOrder,
    orderList,
    updateOrderById,
    deleteOrderById,
    getOrderList
  }
});
