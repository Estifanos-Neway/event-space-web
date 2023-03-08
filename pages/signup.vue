<template>
    <div>
        Sign Up
        <br>
        <Form v-slot="{ handleSubmit, isSubmitting }" :validation-schema="schema">
            <form @submit="handleSubmit($event, onSubmit)" class="flex flex-col gap-5 max-w-xl">
                <div class="flex flex-col gap-2">
                    <Field name="name" />
                    <ErrorMessage name="name" />
                </div>
                <div class="flex flex-col gap-2">
                    <Field name="email" />
                    <ErrorMessage name="email" />
                </div>
                <div class="flex flex-col gap-2">
                    <Field name="password" type="password" />
                    <ErrorMessage name="password" />
                </div>
                <button :disabled="isSubmitting || isLoading">Submit</button>
            </form>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate"
import { string, object } from "yup"
import { signupMutation } from "@/graphql/auth"
import { SignupMutationRes, SignupMutationVars } from "@/graphql/auth/signup-mutation.types"
import { useGeneralStore } from "@/pinia-stores";
import { responses } from "@/graphql/commons"

const generalStore = useGeneralStore()

const schema = object({
    name: string().required().label("Name"),
    email: string().required().email().label("Email"),
    password: string().required().min(6).label("Password"),
})

const { mutate, loading: isLoading, onError, onDone } = useMutation<SignupMutationRes, SignupMutationVars>(
    signupMutation,
    {
        clientId: "anonymous",
        fetchPolicy: "no-cache"
    }
)
onError((error) => {
    if (error.message === responses.emailAlreadyExist) {
        generalStore.setErrorNotification("Email already exist, Please use another email or Sing in.")
    } else {
        console.error("signup onError", error)
        generalStore.setSystemErrorNotification()
    }
})
onDone((result) => {
    if (result.data?.signUp.message === responses.OK) {
        generalStore.setErrorNotification("SUCCESS! We have sent a verification link to your email!")
    } else {
        console.error("signup onDone", result)
        generalStore.setSystemErrorNotification()
    }
})
function onSubmit(values: any) {
    generalStore.clearNotification()
    const variables: SignupMutationVars = {
        name: values.name,
        email: values.email,
        password: values.email
    }
    mutate(variables)
}
</script>