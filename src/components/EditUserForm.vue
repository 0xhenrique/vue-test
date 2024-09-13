<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-user-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <!-- Fields for user (only show if editing/creating a user) -->
      <template v-if="!order">
        <VaInput
          v-model="newUser.fullName"
          label="Full name"
          class="w-full"
          :rules="[val => !!val || 'Full name is required']"
          name="fullName"
        />

        <VaInput
          v-model="newUser.email"
          label="Email"
          class="w-full"
          :rules="[val => !!val || 'Email is required']"
          name="email"
        />

        <!-- Only show password field when creating a new user -->
        <VaInput
          v-if="!user || user.id === -1"
          v-model="newUser.password"
          label="Password"
          type="password"
          class="w-full"
          :rules="[val => !!val || 'Password is required']"
          name="password"
        />
      </template>

      <!-- Fields for order (only show if editing/creating an order) -->
      <template v-else>
        <VaInput
          v-model="newOrder.product"
          label="Product"
          class="w-full"
          :rules="[val => !!val || 'Product is required']"
          name="product"
        />

        <VaInput
          v-model="newOrder.dateOrder"
          label="Date of Order"
          type="date"
          class="w-full"
          :rules="[val => !!val || 'Date of Order is required']"
          name="dateOrder"
        />
      </template>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useForm } from "vuestic-ui";

type User = {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
}

type Order = {
   userId: string;
   product: string;
   dateOrder: string;
}

const props = defineProps({
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
  order: {
    type: Object as PropType<Order | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewUser: User = {
  id: -1,
  fullName: "",
  email: "",
  password: "",
};

const defaultNewOrder: Order = {
  userId: "",
  product: "",
  dateOrder: "",
};

const newUser = ref<User>({ ...defaultNewUser });
const newOrder = ref<Order>({ ...defaultNewOrder });

watch(
  () => props.user,
  () => {
    if (props.user) {
      newUser.value = {
        ...props.user,
        password: "",  // Reset password for existing users
      };
    }
  },
  { immediate: true }
);

watch(
  () => props.order,
  () => {
    if (props.order) {
      newOrder.value = { ...props.order };
    }
  },
  { immediate: true }
);

const form = useForm("add-user-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    if (props.order) {
      emit("save", newOrder.value);
    } else {
      emit("save", newUser.value);
    }
  }
};
</script>
