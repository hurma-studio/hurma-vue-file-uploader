<template>
  <div class="hd-file-upload">
    <div class="hd-file-upload__button">
      <button @click="chooseFiles" :disabled="inProgress">
        <i v-if="selectIcon" :class="selectIcon"></i>
        <label>{{text}}</label>
      </button>
      <div class="hd-file-upload__progress" v-if="inProgress">
        <div class="hd-file-upload__progress--inner" :style="{ width: `${currentProgress}%`}"></div>
      </div>
      <div class="hd-file-upload__error" v-if="error">{{errorText}}</div>
    </div>
    <input
      style="width: 0; height: 0"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="onFileChange"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Axios from "axios";

export default {
  name: "hurma-file-uploader",
  props: {
    url: {
      type: String,
      required: true
    },
    accept: {
      type: String,
      required: false,
      default: () => {
        return "*.*";
      }
    },
    maxSize: {
      type: Number,
      required: false,
      default: () => {
        return 0;
      }
    },
    selectIcon: {
      type: String,
      required: false,
      default: () => {
        return null;
      }
    },
    selectText: {
      type: String,
      required: false,
      default: () => {
        return "select file...";
      }
    },
    uploadText: {
      type: String,
      required: false,
      default: () => {
        return "uploading...";
      }
    },
    multiple: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      }
    },
    headers: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  components: {},
  data() {
    return {
      progress: {},
      error: false,
      errorText: ""
    };
  },
  computed: {
    inProgress() {
      return !!Object.keys(this.progress).length;
    },
    text() {
      return this.inProgress ? this.uploadText : this.selectText;
    },
    currentProgress() {
      let loaded = 0;
      let total = 0;

      Object.keys(this.progress).forEach(key => {
        loaded += this.progress[key].loaded;
        total += this.progress[key].total;
      });

      return (loaded / total) * 100;
    }
  },
  mounted() {},
  methods: {
    chooseFiles(e) {
      this.$el.querySelector("[type=file]").click(e);
    },
    onFileChange(e) {
      let files = Array.from(e.target.files || e.dataTransfer.files);

      if (!files.length) return;

      let bigFiles = files.filter(file => {
        return this.maxSize > 0 && file.size > this.maxSize;
      });

      if (bigFiles.length) {
        console.error("file size biggest then", `${this.maxSize}b`);
        this.errorText = `max size ${this.maxSize}b`;
        this.error = true;

        setTimeout(() => {
          this.error = false;
        }, 2000);
      } else {
        files.forEach((file, index) => {
          this.uploadFile(file, index);
        });
      }
    },
    uploadFile(file, index) {
      let data = new FormData();

      data.append("file", file);

      Vue.set(this.progress, index, {
        loaded: 0,
        total: file.size
      });

      Axios.post(this.url, data, {
        headers: Vue.extend(
          { "Content-Type": "multipart/form-data" },
          this.headers
        ),
        onUploadProgress: e => {
          this.progress[index].loaded = e.loaded;
          this.progress[index].total = e.total;
        }
      })
        .then(response => {
          Vue.delete(this.progress, index);
          this.$emit("onFileUpload", response.data);
        })
        .catch(response => {
          Vue.delete(this.progress, index);
        });
    }
  },
  watch: {}
};
</script>

<style lang="less">
.hd-file-upload {
  font-size: 0;
  padding: 0;
  margin: 0;
  position: relative;

  input[type="file"] {
    width: 0;
    height: 0;
  }

  &__button {
    width: 100%;
    position: relative;

    button {
      width: 100%;
      font-size: 1rem;
      font-weight: 300;
      line-height: 1;
      background-color: #1e88e5;
      margin: 0;
      padding: 0.75rem;
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;

      i {
        color: #fff;
        margin-right: 0.5rem;
      }

      label {
        color: #fff;
      }

      &:hover {
        cursor: pointer;
        background-color: #1976d2;
      }

      &:disabled {
        background-color: #aeaeae;

        i,
        label {
          color: #494949;
        }
      }
    }
  }

  &__progress {
    position: absolute;
    width: 100%;
    height: 0.25rem;

    left: 0;
    right: 0;
    bottom: 0;

    &--inner {
      position: absolute;
      left: 0;
      bottom: 0;
      top: 0;
      background-color: #dd2c00;
    }
  }

  &__error {
    position: absolute;
    margin-top: -0.625rem;
    background-color: #dd2c00;
    color: #fff;
    font-size: 0.75rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-left: 0.5rem;
    top: 50%;
    height: 1.25rem;
    border-radius: 0.125rem;
  }
}
</style>
