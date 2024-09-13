<template>
  <VaDataTable
    :columns="columns"
    :items="users"
    :loading="$props.loading"
  >
    <template #cell(fullName)="{ rowData }">
      <div>{{ rowData.fullName }}</div>
    </template>

    <template #cell(email)="{ rowData }">
      <div>{{ rowData.email }}</div>
    </template>

    <template #cell(createdAt)="{ rowData }">
      <div>{{ rowData.createdAt }}</div>
    </template>

    <template #cell(updatedAt)="{ rowData }">
      <div>{{ rowData.updatedAt }}</div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          @click="$emit('edit-user', rowData)"
        >
          Edit
        </VaButton>
        <VaButton
          preset="primary"
          size="small"
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
import { PropType, toRef } from "vue";

const columns = defineVaDataTableColumns([
  { label: "Name", key: "fullName", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Created", key: "createdAt", sortable: true },
  { label: "Last update", key: "updatedAt", sortable: true },
  { label: "Actions", key: "actions", align: "right" },
]);

const props = defineProps({
  users: {
    type: Array as PropType<{ fullName: string; email: string }[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "edit-user", user: { fullName: string; email: string }): void;
  (event: "delete-user", user: { fullName: string; email: string }): void;
}>();

const users = toRef(props, "users");

const onUserDelete = (user: { fullName: string; email: string }) => {
  if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
    emit("delete-user", user);
  }
};
</script>
