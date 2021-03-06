<template>
  <div class="gallery">
    <div class="row"
      :key="index"
      :style="{ height: row.height + 'px'}"
      v-for="(row, index) of rows">
      <template v-for="item in row.data">
        <album
          :key="item.path"
          :album="item"
          :width="row.height"
          :height="row.height"
          :checkAnswer="checkAnswer"
          v-if="item.type === 'ALBUM'">
        </album>
        <photo
          :key="item.path"
          :image="item"
          :width="item.meta.width / item.meta.height * row.height"
          :height="row.height"
          v-else>
        </photo>
      </template>
    </div>
  </div>
</template>

<script>
import Album from '@/components/Album'
import Image from '@/components/Image'

const MAX_ROW_HEIGHT = 200
const MID_ROW_HEIGHT = 150

export default {
  name: 'gallery',

  props: {
    gallery: {
      type: Object,
      required: false
    },
    checkAnswer: {
      type: Function,
      required: true
    }
  },

  components: {
    'album': Album,
    'photo': Image
  },

  data () {
    return {
      width: this.getRealWidth()
    }
  },

  computed: {
    rows () {
      if (!this.gallery) {
        return []
      }
      return this.compute(this.gallery, this.width)
    }
  },

  methods: {
    getRealWidth () {
      return window.document.body.clientWidth
    },

    resize () {
      this.width = this.getRealWidth()
    },

    getRowHeight (totalWidth, count, ratio) {
      let marginWidth = 10 + count * 4
      return (totalWidth - marginWidth) / ratio
    },

    getInitRow () {
      return {
        data: [],
        ratio: 0,
        height: 0
      }
    },

    unify (albums, images) {
      let items = []

      for (let album of albums) {
        items.push({
          ...album,
          type: 'ALBUM',
          ratio: 1
        })
      }

      for (let image of images) {
        items.push({
          ...image,
          type: 'IMAGE',
          ratio: image.meta.width / image.meta.height
        })
      }
      return items
    },

    compute (data, galleryWidth) {
      let row = this.getInitRow()
      let rows = []
      let items = this.unify(data.albums, data.images)
      for (let item of items) {
        row.data.push(item)
        row.ratio += item.ratio
        row.height = this.getRowHeight(galleryWidth, row.data.length, row.ratio)
        if (row.height < MAX_ROW_HEIGHT) {
          rows.push(row)
          row = this.getInitRow()
        } else if (item === items[items.length - 1]) {
          row.height = Math.min(row.height, MID_ROW_HEIGHT)
          if (rows.length > 0) {
            row.height = Math.max(row.height, rows[rows.length - 1].height)
          }
          rows.push(row)
        }
      }
      return rows
    }
  },

  created () {
    window.addEventListener('resize', this.resize)
  },

  beforeDestory () {
    window.removeEventListener('resize', this.resize)
  },

  mounted () {
    if (this.width !== this.getRealWidth()) {
      this.resize()
    }
  }
}
</script>
