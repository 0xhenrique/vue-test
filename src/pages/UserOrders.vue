<template>
  <AppLayout>
    <div class="flex flex-row content-center pb-5 gap-2">
      <VaButton
	round
	color="warning"
	:to="{ path: '/' }"
      >
	Return Home
      </VaButton>
      <h1 class="text-2xl text-white">Orders View - {{ $route.params.id }}</h1>
    </div>
    <VaCard>
      <VaCardContent>
	<div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
	  <VaInput v-model="searchTerm" placeholder="Search">
	    <template #prependInner>
	      <VaIcon name="search" color="secondary" size="small" />
	    </template>
	  </VaInput>
	  <VaButton @click="showAddOrderModal">Add Order</VaButton>
	</div>

	<OrdersTable
          :orders="paginatedOrders"
          @edit-order="showEditOrderModal"
          @delete-order="deleteOrder"
	/>

	<div class="pagination-controls">
	  <VaButton @click="prevPage" :disabled="currentPage === 1">Previous</VaButton>
	  <span>Page {{ currentPage }} of {{ Math.ceil(totalOrders / itemsPerPage) }}</span>
	  <VaButton @click="nextPage" :disabled="currentPage * itemsPerPage >= totalOrders">Next</VaButton>
	</div>
      </VaCardContent>
    </VaCard>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowEditOrderModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
    >
      <h1 class="va-h5">{{ orderToEdit ? "Edit order" : "Add order" }}</h1>
      <EditUserForm
	ref="editFormRef"
	:order="orderToEdit"
	:user="null"
	:save-button-label="orderToEdit ? 'Save' : 'Add'"
	@close="cancel"
	@save="
        (order) => {
          onOrderSaved(order);
          ok();
        }
	"
      />
    </VaModal>
  </AppLayout>
</template>

<script setup lang="ts">
 import { ref, onMounted, computed } from "vue";
 import { useRoute } from 'vue-router';
 import AppLayout from "../components/AppLayout.vue";
 import OrdersTable from "../components/OrdersTable.vue";
 import EditUserForm from "../components/EditUserForm.vue";
 import { User } from "./types";
 import { OrderStore } from "../stores/orders.ts";
 import { useModal, useToast } from "vuestic-ui";

 const { init: notify } = useToast();
 const { confirm } = useModal();
const route = useRoute();

 const store = OrderStore();
 const orders = ref([]);
 const orderToEdit = ref<User | null>(null);
 const doShowEditOrderModal = ref(false);
 const editFormRef = ref();
 const searchTerm = ref("");
 const currentPage = ref(1);
 const itemsPerPage = ref(10);
 const totalOrders = computed(() => orders.value.length);

 onMounted(async () => {
   await store.getOrderList(route.params.id);
   orders.value = store.orderList;
 });


 const filteredOrders = computed(() => {
   if (!searchTerm.value) {
     return orders.value;
   }
   
   return orders.value.filter((order) => {
     return (
       order.product.toLowerCase().includes(searchTerm.value.toLowerCase())
     );
   });
 });

 const paginatedOrders = computed(() => {
   const start = (currentPage.value - 1) * itemsPerPage.value;
   const end = start + itemsPerPage.value;
   return filteredOrders.value.slice(start, end);
 });

 const nextPage = () => {
   if (currentPage.value * itemsPerPage.value < totalOrders.value) {
     currentPage.value++;
   }
 };

 const prevPage = () => {
   if (currentPage.value > 1) {
     currentPage.value--;
   }
 };

 const addOrder = async (newOrder) => {
   await store.setNewOrder({
     orderDate: newOrder.dateOrder,
     product: newOrder.product,
     userId: newOrder.userId,
   });
 };

 const editOrder = async (order: Order) => {
   await store.updateOrderById({
     orderDate: order.dateOrder,
     product: order.product,
     id: order.id,
   });
 };

 const deleteOrder = async (order: User) => {
   await store.deleteOrderById(order.id);
   orders.value = orders.value.filter(o => o.id !== order.id);
 }

 const onOrderSaved = async (order: Order) => {
   if (orderToEdit.value?.id) {
     await editOrder(order);
     notify({
       message: "Order has been updated",
       color: "success",
     });
   } else {
     await addOrder(order);
     notify({
       message: "New order has been created",
       color: "success",
     });
   }
   await store.getOrderList(route.params.id);
   orders.value = store.orderList;
 };

 const showEditOrderModal = (order: User) => {
   orderToEdit.value = order;
   doShowEditOrderModal.value = true;
 };

const showAddOrderModal = (userId: string) => {
  orderToEdit.value = {
    userId: route.params.id,
    product: '',
    dateOrder: new Date().toISOString(),
  };
  doShowEditOrderModal.value = true;
};
</script>
