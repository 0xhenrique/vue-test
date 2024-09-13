<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-user-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
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

      <!-- only shows when creating a new user -->
      <VaInput
        v-if="!user || user.id === -1"
        v-model="newUser.password"
        label="Password"
        type="password"
        class="w-full"
        :rules="[val => !!val || 'Password is required']"
        name="password"
      />

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

const props = defineProps({
  user: {
    type: Object as PropType<User | null>,
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

const newUser = ref<User>({ ...defaultNewUser });

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

const form = useForm("add-user-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    emit("save", newUser.value);
  }
};
</script>
