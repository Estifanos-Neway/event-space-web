<template>
    <div>
        <h3>Create New Event</h3>

        <h3>Select Images</h3>
        <div>
            <FileSelector accept="image/*" :selectedFiles="getSelectedImagesRef()" />
        </div>
        <div>
            <img v-for="image in selectedImages" :src="image" />
        </div>
    </div>
</template>

<script setup lang="ts">
const selectedImages = ref<Array<string | ArrayBuffer>>([])
watch(selectedImages, () => {
    console.log("::", selectedImages.value)
})

function getSelectedImagesRef(): globalThis.Ref<Array<string | ArrayBuffer>> {
    return selectedImages
}
</script>