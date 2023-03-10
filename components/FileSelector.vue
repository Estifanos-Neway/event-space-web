<template>
    <div>
        <label :for="fieldName"></label>
        <input type="file" :name="fieldName" :accept="accept" :multiple="multiple" @change="handleSelection">
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        fieldName: string
        accept: string
        multiple: boolean
        selectedFiles: globalThis.Ref<Array<string | ArrayBuffer>>
    }>(),
    {
        fieldName: "fileSelector",
        accept: "*/*",
        multiple: true,
    })
async function handleSelection(event: Event) {
    const fileList: FileList = event.target?.files
    props.selectedFiles.value = []
    for (let i = 0; i < fileList.length; i++) {
        const b64 = await getBase64(fileList[i])
        props.selectedFiles.value.push(b64)
    }
    console.log(props.selectedFiles.value)
}

async function getBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result!);
        reader.onerror = error => reject(error);
    });
}
</script>