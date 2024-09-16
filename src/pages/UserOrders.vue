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
	@save="
        (order) => {
          onOrderSaved(order);
          ok();
        }
	"
      />
    </VaModal>
  </Layout>
</template>

<script setup lang="ts">
 import { ref, onMounted, computed } from "vue";
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


 const filteredOrders = computed(() => {
   if (!searchTerm.value) {
     return orders.value;
   }
   
   return orders?.value?.filter((order: Order) => {
     return (
       order?.product?.toLowerCase().includes(searchTerm.value.toLowerCase())
     );
   });
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
  await store.setNewOrder({
    orderDate: newOrder.dateOrder ?? "",
    product: newOrder.product ?? "",
    userId: String(newOrder.userId ?? ""),
  });
};

const editOrder = async (order: Order) => {
  await store.updateOrderById({
    orderDate: order.dateOrder ?? '',
    product: order.product ?? '',
    id: Number(order.id),
  });
};

const deleteOrder = async (order: Order) => {
  await store.deleteOrderById(Number(order.id));
  if (orders.value) {
    orders.value = orders.value.filter(o => o.id !== order.id);
  }
};

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
   await store.getOrderList(Number(route.params.id));
   orders.value = store.orderList;
 };

 const showEditOrderModal = (order: Order) => {
   orderToEdit.value = order;
   doShowEditOrderModal.value = true;
 };

const showAddOrderModal = () => {
  orderToEdit.value = {
    userId: Number(route.params.id),
    product: '',
    dateOrder: new Date().toISOString(),
  };
  doShowEditOrderModal.value = true;
};
</script>
