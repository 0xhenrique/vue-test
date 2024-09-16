<template>
  <VaDataTable
    :columns="columns"
    :items="orders"
    :loading="$props.loading"
  >
    <template #cell(product)="{ rowData }">
      <div>{{ rowData.product }}</div>
    </template>
    
    <template #cell(dateOrder)="{ rowData }">
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
import { Order } from "../utils/types";

const columns = defineVaDataTableColumns([
  { label: "Product", key: "product", sortable: true },
  { label: "Order Date", key: "dateOrder", sortable: true },
  { label: "Created", key: "createdAt", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  orders: {
      type: Array as PropType<Order[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "edit-order", order: Order): void;
  (event: "delete-order", user: Order): void;
}>();

const orders = toRef(props, "orders");

const onOrderDelete = (order: Order) => {
  if (confirm(`Are you sure you want to delete ${order.product}?`)) {
    emit("delete-order", order);
  }
};
</script>
