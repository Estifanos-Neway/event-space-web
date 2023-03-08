<template>
    <div v-if="loading">
        verifying...
    </div>
    <div v-else-if="errorMessage">
        {{ errorMessage }}
        <br>
        <NuxtLink to="/">Home</NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { SignupVerificationMutationVars, SignupVerificationMutationRes } from "~~/graphql/auth/signup-verification-mutation.types"
import { signupVerificationMutation } from "@/graphql/auth"
import { responses } from "@/graphql/commons"

const route = useRoute()
const router = useRouter()

let errorMessage = ""

const { mutate, loading, error, onError, onDone } = useMutation<SignupVerificationMutationRes, SignupVerificationMutationVars>(
    signupVerificationMutation,
    {
        clientId: "anonymous",
        fetchPolicy: "no-cache"
    }
)

onError(error => {
    const message = error.message;
    if (message === responses.invalidToken) {
        errorMessage = "invalid token"
    } else if (message == responses.emailAlreadyExist) {
        errorMessage = "email already exist"

    } else {
        errorMessage = "system error"
        console.error("signup verification onError", error)
    }
})

onDone(result => {
    if (result.data?.verifySignUp.message === responses.OK) {
        const accessToken = result.data.verifySignUp.userLogIn?.accessToken
        const refreshToken = result.data.verifySignUp.userLogIn?.refreshToken
        useUserLogin(accessToken!, refreshToken!)
        router.replace("/")
    } else {
        errorMessage = "system error"
        console.error("signup verification onDone", result)
    }
})
onMounted(() => {
    mutate({ verificationToken: route.params.token as string })
})
</script>