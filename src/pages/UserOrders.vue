<template>
  <h1>Order View - {{ $route.params.id }}</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
	<VaInput v-model="searchTerm" placeholder="Search">
	  <template #prependInner>
	    <VaIcon name="search" color="secondary" size="small" />
	  </template>
	</VaInput>
	<VaButton @click="showAddUserModal">Add Order</VaButton>
      </div>

      <UsersTable
        :users="orders"
        @edit-user="showEditUserModal"
        @delete-user="deleteUser"
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
    v-model="doShowEditUserModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
  >
    <h1 class="va-h5">{{ userToEdit ? "Edit user" : "Add user" }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
      :save-button-label="userToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (user) => {
          onUserSaved(user);
          ok();
        }
      "
    />
  </VaModal>
</template>

<script setup lang="ts">
 import { ref, onMounted, computed } from "vue";
 import UsersTable from "../components/UsersTable.vue";
 import EditUserForm from "../components/EditUserForm.vue";
 import { User } from "./types";
 import { OrderStore } from "../stores/orders.ts";
 import { useModal, useToast } from "vuestic-ui";

 const { init: notify } = useToast();
 const { confirm } = useModal();

 const store = OrderStore();
 const orders = ref([]);
 const userToEdit = ref<User | null>(null);
 const doShowEditUserModal = ref(false);
 const editFormRef = ref();
 const searchTerm = ref("");
 const currentPage = ref(1);
 const itemsPerPage = ref(10);
 const totalOrders = computed(() => orders.value.length);

 onMounted(async () => {
   await store.getOrderList();
   orders.value = store.orderList;
 });

    // Have to fix this for orders
 const filteredUsers = computed(() => {
   if (!searchTerm.value) {
     return orders.value;
   }
   
   return orders.value.filter((user) => {
     return (
       user.fullName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
     );
   });
 });

 const paginatedOrders = computed(() => {
   const start = (currentPage.value - 1) * itemsPerPage.value;
   const end = start + itemsPerPage.value;
   return filteredUsers.value.slice(start, end);
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

 const editOrder = async (order: User) => {
   console.log("Edit user:", order);
   await store.updateOrderById({
     fullName: user.fullName,
     email: user.email,
     id: user.id
   });
 };

 const deleteUser = async (user: User) => {
   console.log("user to delete: ", user.id);
   await store.deleteUserById(user.id);
 }

 const addUser = async (newUser) => {
   console.log("addUser func", newUser.fullName)
   await store.setNewUser({
     fullName: newUser.fullName,
     email: newUser.email,
     password: newUser.password
   })
 };

 const onUserSaved = async (user: User) => {
   if (userToEdit.value) {
     await editUser(user);
     notify({
       message: "User has been updated",
       color: "success",
     });
   } else {
     await addUser(user);
     notify({
       message: "New user has been created",
       color: "success",
     });
   }
 };

 const showEditUserModal = (user: User) => {
   userToEdit.value = user;
   doShowEditUserModal.value = true;
 };

 const showAddUserModal = () => {
   userToEdit.value = null;
   doShowEditUserModal.value = true;
 };
</script>
