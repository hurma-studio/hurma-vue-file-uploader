import FileUploader from "./hurma-file-uploader.vue";

export default {
  ...FileUploader,
  install: vue => vue.component("hurma-file-uploader", FileUploader)
};
