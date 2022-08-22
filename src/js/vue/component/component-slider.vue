<template>
  <div class="my-slider">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide>
        <img src="http://placehold.jp/24/cc9999/993333/1500x1000.png" />
      </swiper-slide>
      <swiper-slide>
        <img src="http://placehold.jp/24/cc9999/993333/1500x1000.png" />
      </swiper-slide>
      <swiper-slide>
        <img src="http://placehold.jp/24/cc9999/993333/1500x1000.png" />
      </swiper-slide>
      <swiper-slide>
        <img src="http://placehold.jp/24/cc9999/993333/1500x1000.png" />
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  data() {
    return {
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 0,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        autoplay: {
          delay: 3000
        }
      }
    };
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.my-slider {
  img {
    width: 100%;
  }
}
</style>
