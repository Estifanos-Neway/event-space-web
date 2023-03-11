<template>
    <div>

        <button type="button"
            class="rounded-md bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <label class="block py-2.5 px-3.5 cupo" for="fieldName">Upload Images</label>
        </button>
        <input class="invisible" type="file" id="fieldName" :accept="accept" :multiple="multiple" @change="handleSelection">
    </div>
</template>

<script setup lang="ts">
import { SelectedImage } from './types';

const props = withDefaults(
    defineProps<{
        fieldName?: string
        accept?: string
        multiple?: boolean
        selectedFiles: globalThis.Ref<Array<SelectedImage>>
    }>(),
    {
        fieldName: "fileSelector",
        accept: "*/*",
        multiple: true,
    })
async function handleSelection(event: Event) {
    const fileList: FileList = event.target?.files
    console.log(fileList[0])
    props.selectedFiles.value = []
    for (let i = 0; i < fileList.length; i++) {
        const b64 = await getBase64(fileList[i])
        props.selectedFiles.value.push({ b64, id: i, isThumbnail: i === 0, extension: getFileExtension(fileList[i].name) })
    }
}

async function getBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result!);
        reader.onerror = error => reject(error);
    });
}

function getFileExtension(fileName: string) {
    return fileName.substring(fileName.lastIndexOf("."))
}
</script>