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
import { SignupVerificationMutationVars, SignupVerificationMutationRes } from "~~/graphql/auth/signup-verification-mutation-types"
import { signupVerificationMutation } from "@/graphql/auth"
import { responses } from "@/graphql/commons"

const route = useRoute()
const router = useRouter()
const { onLogin } = useApollo()

let errorMessage = ""

const { mutate, loading, error, onError, onDone } = useMutation<SignupVerificationMutationRes, SignupVerificationMutationVars>(
    signupVerificationMutation,
    {
        "fetchPolicy": "no-cache"
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
        console.log("signup verification onError", error)
    }
})

onDone(result => {
    if (result.data?.verifySignUp.message === responses.OK) {
        onLogin(result.data.verifySignUp.userLogIn.accessToken)
        router.replace("/")
    } else {
        errorMessage = "system error"
        console.log("signup verification onDone", result)
    }
})
onMounted(() => {
    mutate({ verificationToken: route.params.token as string })
})
</script>