<template>
  <div class="album" @click="enter" :style="style">
    <div class="lock" v-if="isLocked">
      <icon scale="2.5" name="lock" class="icon"></icon>
    </div>
    <span class="lable">
        <span class="title">{{album.name}}</span>
    </span>
    <div class="container">
      <div class="cover" :key="index" v-for="(url, index) in album.thumbnails">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        <div class="cropped" v-lazy:background-image="url" @loaded="loaded"></div>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/lock'
import Icon from 'vue-awesome/components/Icon'
import answerUtil from '@/utils/answer'

export default {
  components: {
    Icon
  },

  props: {
    album: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    checkAnswer: {
      type: Function,
      required: true
    }
  },

  computed: {
    style () {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    },

    isLocked () {
      return Boolean(Object.keys(this.album.questions).length)
    }
  },

  methods: {
    loaded ({ target }) {
      let parent = target.parentElement
      let loading = parent.querySelector('.spinner')
      loading.style.display = 'none'
    },

    navigate (path) {
      this.$router.push({
        name: 'gallery',
        query: { path }
      })
      document.documentElement.scrollTop = 0
    },

    enter () {
      if (!this.isLocked) {
        this.navigate(this.album.path)
        return
      }

      answerUtil(this.album.questions, this.checkAnswer).then((result) => {
        if (result.value) {
          this.navigate(this.album.path)
        }
      })
    }
  }
}
</script>
