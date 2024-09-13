<template>
  <VaDataTable
    :columns="columns"
    :items="orders"
    :loading="$props.loading"
  >
    <template #cell(product)="{ rowData }">
      <div>{{ rowData.product }}</div>
    </template>
    
    <template #cell(orderDate)="{ rowData }">
      <div>{{ rowData.order_date }}</div>
    </template>

    <template #cell(createdAt)="{ rowData }">
      <div>{{ rowData.created_at }}</div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          @click="$emit('edit-order', rowData)"
        >
          Edit
        </VaButton>
        <VaButton
          preset="primary"
          color="danger"
          @click="onOrderDelete(rowData)"
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
  { label: "Product", key: "product", sortable: true },
  { label: "Order Date", key: "orderDate", sortable: true },
  { label: "Created", key: "createdAt", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  orders: {
    type: Array as PropType<{ product: string; orderDate: string, userId: number }[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "edit-order", order: { product: string; orderDate: string, userId: number }): void;
  (event: "delete-order", user: { product: string; orderDate: string, userId: number }): void;
}>();

const orders = toRef(props, "orders");

const onOrderDelete = (order: { product: string; orderDate: string, userId: number }) => {
  if (confirm(`Are you sure you want to delete ${order.product}?`)) {
    emit("delete-order", order);
  }
};
</script>
