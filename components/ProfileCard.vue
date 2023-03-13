<template>
    <div>
        <div
            class="bg-white p-4 divide-y divide-gray-100 rounded-lg shadow w-[550px] dark:bg-gray-700 dark:divide-gray-600">
            <div class="flex gap-2 justify-around">
                <div class="w-24 h-24 text-5xl flex-shrink-0">
                    <Avatar :url="user.avatarUrl ? createStaticServerLink(user.avatarUrl) : ''" :name="user.name"
                        id="avatar" data-dropdown-toggle="dropdown"
                        :class="{ 'animate-pulse': uploadingAvatarUrl || deletingAvatarUrl }" class="cupo" />
                    <div id="dropdown"
                        class="z-10 hidden border bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatar">
                            <li>
                                <label for="avatar-selector"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cupo">
                                    Upload Image</label>
                            </li>
                            <li v-if="user.avatarUrl">
                                <div @click="deleteAvatarUrl"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500">
                                    Delete</div>
                            </li>
                        </ul>
                    </div>
                    <input class="invisible" type="file" id="avatar-selector" accept="image/*" @change="uploadAvatar"
                        :disabled="uploadingAvatarUrl || deletingAvatarUrl" />
                </div>
                <div class="flex flex-col gap-3">
                    <div class="flex flex-col gap-2">
                        <div>
                            <div v-show="editingName">
                                <div class="flex flex-col">
                                    <input type="text" ref="nameInputField" v-model="name" @focusout="resetName"
                                        @keyup="saveNameOnEnter" class="outline-none">
                                    <button @click="saveName" :class="{ 'text-gray-500': updatingName }">
                                        save
                                    </button>
                                </div>
                            </div>
                            <h4 v-if="!editingName" class="font-bold" @click="startNameEdit">
                                {{ user.name }}
                            </h4>
                        </div>
                        <div>
                            <div v-show="editingDescription">
                                <div class="flex flex-col">
                                    <textarea ref="descriptionInputField" rows="5" cols="38" v-model="description"
                                        @focusout="resetDescription" class="outline-none"></textarea>
                                    <button @click="saveDescription" :class="{ 'text-gray-500': updatingDescription }">
                                        save
                                    </button>
                                </div>
                            </div>
                            <div v-if="!editingDescription" @click="startDescriptionEdit">
                                <p v-if="user.description">
                                    {{ user.description }}
                                </p>
                                <p v-else class="font-thin">
                                    No description. Click here to add description
                                </p>
                            </div>
                        </div>
                    </div>
                    <span>
                        {{ user.email }}
                    </span>
                </div>
            </div>
            <div class="flex justify-around">
                <div class="flex flex-col items-center">
                    <h2>
                        {{ user.followersCount }}
                    </h2>
                    <h2>
                        followers
                    </h2>
                </div>
                <div>
                    <h2>
                        {{ user.followingCount }}
                    </h2>
                    <h2>
                        following
                    </h2>
                </div>
            </div>
            <div>
                <div @click="useUserSignOut" class="cupo text-center">
                    Log Out
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { User } from '~~/types/entities';
import { UpdateUserMutationVars, UpdateUserMutationRes } from "~~/graphql/user/update-user.mutation.types"
import { updateUserMutation } from "~~/graphql/user"
import { useGeneralStore } from '~~/pinia-stores';
import { initDropdowns } from 'flowbite';
import { fileToBase64, getFileExtension, createStaticServerLink } from '~~/commons/functions';
import { UploadFileMutationRes, UploadFileMutationVars } from '~~/graphql/files/upload-file.mutation.types';
import { uploadFileMutation } from '~~/graphql/files';

const generalStore = useGeneralStore()
const props = defineProps<
    {
        user: User
    }
>()

// editing name
const nameInputField = ref<HTMLInputElement | null>(null)
const name = ref(props.user.name)
const editingName = ref(false)
const updatingName = ref(false)
function startNameEdit() {
    editingName.value = true
    setTimeout(() => {
        nameInputField.value?.focus()
        const temp = nameInputField.value!.value
        nameInputField.value!.value = ""
        nameInputField.value!.value = temp
    }, 0)
}
function resetName() {
    setTimeout(() => {
        if (!updatingName.value) {
            name.value = props.user.name
            editingName.value = false
        }
    }, 500)
}
function saveNameOnEnter(event: Event) {
    // console.log(event)
    if (event.type === "enter") {
        saveName()
    }
}
function finishUpdatingName() {
    editingName.value = false
    updatingName.value = false
}
function saveName() {
    if (updatingName.value) return
    const newName = name.value.trim();
    if (newName !== "" && newName !== props.user.name) {
        updatingName.value = true
        const { mutate: updateName, onDone: onUpdateNameDone, onError: onUpdateNameError } = useMutation<UpdateUserMutationRes, UpdateUserMutationVars>(
            updateUserMutation,
            {
                variables: {
                    id: props.user.id,
                    name: newName,
                    description: props.user.description,
                    avatarUrl: props.user.avatarUrl,
                },
                fetchPolicy: "network-only"
            }
        )
        updateName()
        onUpdateNameDone(result => {
            const updatedName = result.data?.updateUsersByPk.name
            if (updatedName) {
                props.user.name = updatedName
                finishUpdatingName()
            } else {
                name.value = props.user.name
                finishUpdatingName()
                generalStore.setSystemErrorNotification()
                console.error("onUpdateNameDone:", result)
            }
        })
        onUpdateNameError(error => {
            name.value = props.user.name
            finishUpdatingName()
            generalStore.setSystemErrorNotification()
            console.error("onUpdateNameError:", error)
        })
    } else {
        name.value = props.user.name
        editingName.value = false
    }
}


// editing description
const descriptionInputField = ref<HTMLInputElement | null>(null)
const description = ref(props.user.description)
const editingDescription = ref(false)
const updatingDescription = ref(false)
function startDescriptionEdit() {
    editingDescription.value = true
    setTimeout(() => {
        descriptionInputField.value?.focus()
        const temp = descriptionInputField.value!.value
        descriptionInputField.value!.value = ""
        descriptionInputField.value!.value = temp
    }, 0)
}
function resetDescription() {
    setTimeout(() => {
        if (!updatingDescription.value) {
            description.value = props.user.description
            editingDescription.value = false
        }
    }, 500)
}

function finishUpdatingDescription() {
    editingDescription.value = false
    updatingDescription.value = false
}
function saveDescription() {
    if (updatingDescription.value) return
    const newDescription = description.value.trim();
    if (newDescription !== props.user.description) {
        updatingDescription.value = true
        const { mutate: updateDescription, onDone: onUpdateDescriptionDone, onError: onUpdateDescriptionError } = useMutation<UpdateUserMutationRes, UpdateUserMutationVars>(
            updateUserMutation,
            {
                variables: {
                    id: props.user.id,
                    description: newDescription,
                    name: props.user.name,
                    avatarUrl: props.user.avatarUrl,
                },
                fetchPolicy: "network-only"
            }
        )
        updateDescription()
        onUpdateDescriptionDone(result => {
            const updatedDescription = result.data?.updateUsersByPk.description
            if (typeof updatedDescription === "string") {
                props.user.description = updatedDescription
                finishUpdatingDescription()
            } else {
                description.value = props.user.description
                finishUpdatingDescription()
                generalStore.setSystemErrorNotification()
                console.error("onUpdateDescriptionDone:", result)
            }
        })
        onUpdateDescriptionError(error => {
            description.value = props.user.description
            finishUpdatingDescription()
            generalStore.setSystemErrorNotification()
            console.error("onUpdateDescriptionError:", error)
        })
    } else {
        description.value = props.user.description
        editingDescription.value = false
    }
}

// avatar image
const uploadingAvatarUrl = ref(false)
const deletingAvatarUrl = ref(false)

// Avatar Upload
function finishUploadingAvatar() {
    uploadingAvatarUrl.value = false
}
async function uploadAvatar(event: Event) {
    // @ts-ignore
    if (uploadingAvatarUrl.value || deletingAvatarUrl.value || !event.target?.files[0]) return
    uploadingAvatarUrl.value = true
    // @ts-ignore
    const uploadedImage: File = event.target?.files[0]
    const b64 = await fileToBase64(uploadedImage)
    const fileExtension = getFileExtension(uploadedImage.name)
    const { mutate: uploadFile, onDone: onUploadFileDone, onError: onUploadFileError } = useMutation<UploadFileMutationRes, UploadFileMutationVars>(
        uploadFileMutation,
        {
            variables: {
                base64Str: b64.toString().replace('data:', '').replace(/^.+,/, ''),
                fileName: props.user.id + fileExtension,
                category: "avatar-image",
                extension: fileExtension
            },
            fetchPolicy: "no-cache"
        }
    )
    uploadFile()
    onUploadFileDone(result => {
        const filePath = result.data?.uploadFile.filePath
        if (typeof filePath !== "string") {
            console.error("onUploadFileDone:", result)
        } else {
            const { mutate: updateAvatarUrl, onDone: onUpdateAvatarUrlDone, onError: onUpdateAvatarUrlError } = useMutation<UpdateUserMutationRes, UpdateUserMutationVars>(
                updateUserMutation,
                {
                    variables: {
                        id: props.user.id,
                        description: props.user.description,
                        name: props.user.name,
                        avatarUrl: filePath + `?t=${Date.now()}`,
                    },
                    fetchPolicy: "network-only"
                }
            )
            updateAvatarUrl()
            onUpdateAvatarUrlDone(result => {
                const updatedAvatarUrl = result.data?.updateUsersByPk.avatarUrl
                if (typeof updatedAvatarUrl === "string") {
                    props.user.avatarUrl = updatedAvatarUrl
                    finishUploadingAvatar()
                } else {
                    finishUploadingAvatar()
                    console.error("onUpdateAvatarUrlDone:", result)
                }
            })
            onUpdateAvatarUrlError(error => {
                finishUploadingAvatar()
                generalStore.setSystemErrorNotification()
                console.error("onUpdateAvatarUrlError:", error)
            })
        }
    })
    onUploadFileError(error => {
        finishUploadingAvatar()
        generalStore.setSystemErrorNotification()
        console.error("onUploadFileError:", error)
    })
}

// delete avatar
function finishDeletingAvatarImage() {
    deletingAvatarUrl.value = false
}
function deleteAvatarUrl() {
    if (uploadingAvatarUrl.value || deletingAvatarUrl.value) return
    deletingAvatarUrl.value = true
    const { mutate: deleteAvatarUrl, onDone: onDeleteAvatarUrlDone, onError: onDeleteAvatarUrlError } = useMutation<UpdateUserMutationRes, UpdateUserMutationVars>(
        updateUserMutation,
        {
            variables: {
                id: props.user.id,
                description: props.user.description,
                name: props.user.name,
                avatarUrl: "",
            },
            fetchPolicy: "network-only"
        }
    )
    deleteAvatarUrl()
    onDeleteAvatarUrlDone(result => {
        const deletedAvatarUrl = result.data?.updateUsersByPk.avatarUrl
        if (deletedAvatarUrl === "") {
            props.user.avatarUrl = deletedAvatarUrl
            finishDeletingAvatarImage()
        } else {
            finishDeletingAvatarImage()
            console.error("onDeleteAvatarUrlDone:", result)
        }
    })
    onDeleteAvatarUrlError(error => {
        finishDeletingAvatarImage()
        generalStore.setSystemErrorNotification()
        console.error("onDeleteAvatarUrlError:", error)
    })
}

onMounted(() => {
    initDropdowns()
})

</script>