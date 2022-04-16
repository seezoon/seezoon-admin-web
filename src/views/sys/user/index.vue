<template>
  <page-wrapper contentBackground contentClass="p-4">
    <s-main></s-main>
  </page-wrapper>
</template>

<script>
import {PageWrapper} from '/@/components/Page';
import SMain from "./Main.vue";

export default {
  name: "SysUser",
  components: {SMain, PageWrapper},
}
</script>
