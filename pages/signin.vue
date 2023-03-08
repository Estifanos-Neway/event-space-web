<template>
    <div>
        Sign Up
        <br>
        <Form v-slot="{ handleSubmit, isSubmitting }" :validation-schema="schema">
            <form @submit="handleSubmit($event, onSubmit)" class="flex flex-col gap-5 max-w-xl">
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
import { signinMutation } from "@/graphql/auth"
import { SigninMutationRes, SigninMutationVars } from "@/graphql/auth/signin-mutation.types"
import { useGeneralStore } from "@/pinia-stores";
import { responses } from "@/graphql/commons"

const generalStore = useGeneralStore()
const router = useRouter()

const schema = object({
    email: string().required().email().label("Email"),
    password: string().required().min(6).label("Password"),
})

const { mutate, loading: isLoading, onError, onDone } = useMutation<SigninMutationRes, SigninMutationVars>(
    signinMutation,
    {
        clientId: "anonymous",
        fetchPolicy: "no-cache"
    }
)
onError((error) => {
    if (error.message === responses.notFound) {
        generalStore.setErrorNotification("No account found!")
    } else {
        console.error("signin onError", error)
        generalStore.setSystemErrorNotification()
    }
})
onDone((result) => {
    if (result.data?.signIn.message === responses.OK) {
        const accessToken = result.data.signIn.userLogIn?.accessToken
        const refreshToken = result.data.signIn.userLogIn?.refreshToken
        useUserLogin(accessToken!, refreshToken!)
        router.replace("/")
    } else {
        console.error("signin onDone", result)
        generalStore.setSystemErrorNotification()
    }
})
function onSubmit(values: any) {
    generalStore.clearNotification()
    const variables: SigninMutationVars = {
        email: values.email,
        password: values.email
    }
    mutate(variables)
}
</script>