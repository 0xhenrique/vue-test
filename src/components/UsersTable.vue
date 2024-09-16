<template>
  <VaDataTable
    :columns="columns"
    :items="users"
    :loading="$props.loading"
  >
    <template #cell(fullName)="{ rowData }">
      <router-link :to="{ path: `/user/${rowData.id}` }" class="va-link">
	{{ rowData.fullName }}
      </router-link>
    </template>
    
    <template #cell(email)="{ rowData }">
      <div>{{ rowData.email }}</div>
    </template>

    <template #cell(created_at)="{ rowData }">
      <div>{{ rowData.created_at }}</div>
    </template>

    <template #cell(updated_at)="{ rowData }">
      <div>{{ rowData.updated_at }}</div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
	  :to="{ path: `/user/${rowData.id}` }"
        >
          Orders
        </VaButton>
        <VaButton
          preset="primary"
          @click="$emit('edit-user', rowData)"
        >
          Edit
        </VaButton>
        <VaButton
          preset="primary"
          color="danger"
          @click="onUserDelete(rowData)"
        >
          Delete
        </VaButton>
      </div>
    </template>
  </VaDataTable>
</template>

<script setup lang="ts">
import { defineVaDataTableColumns } from "vuestic-ui";
import { toRef } from "vue";
import { User } from "../utils/types";

const columns = defineVaDataTableColumns([
  { label: "Name", key: "fullName", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Created", key: "createdAt", sortable: true },
  { label: "Last update", key: "updatedAt", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  users: {
    type: Array as () => User[],
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "edit-user", user: User): void;
  (event: "delete-user", user: User): void;
}>();

const users = toRef(props, "users");

const onUserDelete = (user: User) => {
  if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
    emit("delete-user", user);
  }
};
</script>
