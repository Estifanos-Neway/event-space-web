<template>
    <div class="rounded-lg border">
        <img class="h-[150px] w-full" :src="(image.b64 as string)">
        <div class="p-3 flex justify-between items-center cupo">
            <span @click="toggleThumbnail" :class="{ 'text-primary': image.isThumbnail }">Thumbnail</span>
            <span @click="deleteImage" class="text-red-600 text-xl cupo">
                <Icon icon="ph:trash-simple" />
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { SelectedImage } from './types';

const props = defineProps<{
    imagesArray: Array<SelectedImage>,
    index: number
}>()
const image = props.imagesArray[props.index]
function deleteImage() {
    props.imagesArray.splice(props.index, 1)
    if (image.isThumbnail && props.imagesArray.length > 0) {
        props.imagesArray[0].isThumbnail = true
    }
}
function toggleThumbnail() {
    props.imagesArray.forEach((image, index) => {
        image.isThumbnail = index === props.index ? true : false
    })
}
</script>