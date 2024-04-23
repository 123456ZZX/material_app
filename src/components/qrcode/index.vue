<!--
 * @Author: wei_sc2
 * @Date: 2022-02-22 10:57:35
 * @LastEditTime: 2022-02-25 10:10:49
 * @LastEditors: xie_sm
 * @Description: 封装二维码组件
 * @FilePath: \mobile-template\src\components\qrcode\index.vue
-->
<template>
  <div class="qrcode-container">
    <canvas
      :style="{
        height: `${size}px`,
        width: `${size}px`,
      }"
      :height="size"
      :width="size"
      v-show="type === 'canvas'"
      ref="canvas"
    ></canvas>
    <img
      :src="imgData"
      v-if="type === 'img'"
      :style="{
        height: `${size}px`,
        width: `${size}px`,
      }"
    />
  </div>
</template>

<script>
import QRCodeImpl from "qr.js/lib/QRCode";
import ErrorCorrectLevel from "qr.js/lib/ErrorCorrectLevel";
export default {
  name: "QRCode",
  props: {
    value: String,
    size: {
      type: Number,
      default: 160,
    },
    level: {
      type: String,
      default: "L",
    },
    bgColor: {
      type: String,
      default: "#FFFFFF",
    },
    fgColor: {
      type: String,
      default: "#000000",
    },
    type: {
      type: String,
      default: "img",
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.render();
    });
  },
  data() {
    return {
      imgData: "",
    };
  },
  watch: {
    value() {
      this.render();
    },
    size() {
      this.render();
    },
    level() {
      this.render();
    },
    bgColor() {
      this.render();
    },
    fgColor() {
      this.render();
    },
  },
  methods: {
    render() {
      if (typeof this.value === "undefined") {
        return;
      }
      const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[this.level]);
      qrcode.addData(utf16to8(this.value));
      qrcode.make();
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      const cells = qrcode.modules;
      const tileW = this.size / cells.length;
      const tileH = this.size / cells.length;
      const scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
      canvas.height = canvas.width = this.size * scale;
      ctx.scale(scale, scale);
      cells.forEach((row, rdx) => {
        row.forEach((cell, cdx) => {
          ctx.fillStyle = cell ? this.fgColor : this.bgColor;
          const w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
          const h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
          ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
        });
      });
      if (this.type === "img") {
        this.imgData = canvas.toDataURL("image/png");
      }
    },
  },
};
function getBackingStorePixelRatio(ctx) {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  );
}
function utf16to8(str) {
  let out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  return out;
}
</script>

<style>
.qrcode-container {
  padding-top: 0.2rem;
  padding-right: 0.2rem;
  padding-left: 0.2rem;
  background-color: #fff;
}
</style>
