<template>
<Layout>
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
      
      <VaDivider />
      
      <div class="flex flex-row justify-center gap-2 mt-5">
	<VaButton @click="prevPage" :disabled="currentPage === 1">Previous</VaButton>
	<p class="leading-none self-center">Page {{ currentPage }} of {{ Math.ceil(totalOrders / itemsPerPage) }}</p>
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
    <h1 class="va-h5">{{ orderToEdit?.product ? "Edit order" : "Add order" }}</h1>
    <EditUserForm
      ref="editFormRef"
      :order="orderToEdit"
      :user="null"
      :save-button-label="orderToEdit?.product ? 'Save' : 'Add'"
      @close="cancel"
      @save="async (order) => {
	     const success = await onOrderSaved(order);
	     if (success) {
	     ok();
	     }
	     }"
      />
    </VaModal>
  </Layout>
</template>

<script setup lang="ts">
 import { ref, onMounted, computed, watch } from "vue";
 import { useRoute } from 'vue-router';
 import Layout from "../components/Layout.vue";
 import OrdersTable from "../components/OrdersTable.vue";
 import EditUserForm from "../components/EditUserForm.vue";
 import { Order } from "../utils/types";
 import { OrderStore } from "../stores/orders.ts";
 import { useToast } from "vuestic-ui";

 const { init: notify } = useToast();
 const route = useRoute();

 const store = OrderStore();
 const orders = ref<Order[] | null>([]);
 const orderToEdit = ref<Order | null>(null);
 const doShowEditOrderModal = ref(false);
 const editFormRef = ref();
 const searchTerm = ref("");
 const currentPage = ref(1);
 const itemsPerPage = ref(5);
 const totalOrders = computed(() => orders.value?.length ?? 0);

 onMounted(async () => {
   await store.getOrderList(Number(route.params.id));
   orders.value = store.orderList;
 });


 const filteredOrders = computed<Order[]>(() => {
  const allOrders = orders.value || [];

  if (!searchTerm.value) {
    return allOrders;
  }

  return allOrders.filter((order: Order) => {
    return order.product?.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
 });

watch(searchTerm, () => {
  currentPage.value = 1;
});

const paginatedOrders = computed<Order[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOrders.value?.slice(start, end) ?? [];
});

 const nextPage = () => {
   if (currentPage.value * itemsPerPage.value < (totalOrders.value ?? 0)) {
     currentPage.value++;
   }
 };

 const prevPage = () => {
   if (currentPage.value > 1) {
     currentPage.value--;
   }
 };

const addOrder = async (newOrder: Order) => {
  if (!newOrder) return;
  await store.setNewOrder(newOrder);
};

const editOrder = async (order: Order) => {
  if (!order) return;
  await store.updateOrderById(order);
};

const deleteOrder = async (order: Order) => {
  await store.deleteOrderById(order);
  if (orders.value) {
    orders.value = orders.value.filter((o: Order) => o.id !== order.id);
  }
};

const onOrderSaved = async (order: Order): Promise<boolean> => {
  if (!order) return true;

  try {
    const isEdit = Boolean(orderToEdit.value?.id ? true : false);
    const action = isEdit ? editOrder : addOrder;
    const successMessage = isEdit
      ? "Order has been updated"
      : "New order has been created";

    await action(order);

    notify({
      message: successMessage,
      color: "success",
    });

    await refreshOrderList();
    return true;
  } catch (error) {
    handleSaveError(error);
    return false;
  }
};

const refreshOrderList = async () => {
    await store.getOrderList(Number(route.params.id));
    orders.value = store.orderList;
}

const handleSaveError = (error: any) => {
  notify({
    message: "An error occurred while saving the order. Please try again.",
    color: "danger",
  });
  console.log(error)
};

 const showEditOrderModal = (order: Order) => {
   orderToEdit.value = order;
   doShowEditOrderModal.value = true;
 };

const showAddOrderModal = () => {
  if (!route.params.id) return;

  orderToEdit.value = {
    id: null,
    userId: Number(route.params.id),
    product: "",
    dateOrder: ""
  };
  doShowEditOrderModal.value = true;
};
</script>
