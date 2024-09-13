import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

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
      const response = await axios.get(`http://localhost:3333/order/${userId}`);
      orderList.value = response.data;
      isLoading.value = false;
    } catch (err) {
      isLoading.value = false;
      return err;
    }
  };

  const updateOrderById = async ({ userId, orderDate, product }: { userId: number, orderDate: string, product: string }) => {
    try {
      isLoading.value = true;
      const request = await axios.put(`http://localhost:3333/order/${userId}/edit`, {
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
      const request = await axios.delete(`http://localhost:3333/orders/${orderId}`);
      isLoading.value = false;
      return request.data;
    } catch(err) {
      isLoading.value = false;
    }
  }

  const setNewOrder = async ({ userId, orderDate, product}: { userId: string, orderDate: string, product: string }) => {
    try {
      isLoading.value = true;
      const request = await axios.post("http://localhost:3333/orders", {
	userId: userId,
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
    getOrderList
  }
});
