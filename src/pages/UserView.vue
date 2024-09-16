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
	  <VaButton @click="showAddUserModal">Add User</VaButton>
	</div>

	<UsersTable
          :users="paginatedUsers"
          @edit-user="showEditUserModal"
          @delete-user="deleteUser"
	/>

	<VaDivider />

	<div class="flex flex-row justify-center gap-2 mt-5">
	  <VaButton @click="prevPage" :disabled="currentPage === 1">Previous</VaButton>
	  <p class="leading-none self-center">Page {{ currentPage }} of {{ Math.ceil(totalUsers / itemsPerPage) }}</p>
	  <VaButton @click="nextPage" :disabled="currentPage * itemsPerPage >= totalUsers">Next</VaButton>
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
    <h3 class="text-white pt-5">Tip: To view the user's orders list you can also click on the user's name.</h3>
  </Layout>
</template>

<script setup lang="ts">
 import { ref, onMounted, computed } from "vue";
 import UsersTable from "../components/UsersTable.vue";
 import EditUserForm from "../components/EditUserForm.vue";
 import Layout from "../components/Layout.vue";
 import { User } from "../utils/types";
 import { UserStore } from "../stores/users.ts";
 import { useModal, useToast } from "vuestic-ui";

 const { init: notify } = useToast();
 const { confirm } = useModal();

 const store = UserStore();
 const users = ref([]);
 const userToEdit = ref<User | null>(null);
 const doShowEditUserModal = ref(false);
 const editFormRef = ref();
 const searchTerm = ref("");
 const currentPage = ref(1);
 const itemsPerPage = ref(10);
 const totalUsers = computed(() => users.value.length);

 store.getUserList();

 onMounted(async () => {
   await store.getUserList();
   users.value = store.userList;
 });

 const filteredUsers = computed(() => {
   if (!searchTerm.value) {
     return users.value;
   }
   
   return users.value.filter((user) => {
     return (
       user.fullName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
     );
   });
 });

 const paginatedUsers = computed(() => {
   const start = (currentPage.value - 1) * itemsPerPage.value;
   const end = start + itemsPerPage.value;
   return filteredUsers.value.slice(start, end);
 });

 const nextPage = () => {
   if (currentPage.value * itemsPerPage.value < totalUsers.value) {
     currentPage.value++;
   }
 };

 const prevPage = () => {
   if (currentPage.value > 1) {
     currentPage.value--;
   }
 };

 const editUser = async (user: User) => {
   await store.updateUserById({
     fullName: user.fullName,
     email: user.email,
     id: user.id
   });
 };

 const deleteUser = async (user: User) => {
   await store.deleteUserById(user.id);
   users.value = users.value.filter(o => o.id !== user.id);
 }

 const addUser = async (newUser: User) => {
   await store.setNewUser({
     fullName: newUser.fullName,
     email: newUser.email,
     password: newUser.password
   });
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

   await store.getUserList();
   users.value = store.userList;
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
