<template>
  <!--begin::Heading-->
  <div class="d-flex flex-wrap flex-stack mb-6">
    <!--begin::Title-->
    <h3 class="fw-bolder my-2">Danh sách kênh</h3>
    <!--end::Title-->
  </div>
  <!--end::Heading-->

  <!--begin::Contacts-->
  <div class="row g-6 g-xl-9">
    <Card4
      v-for="(user, index) in users"
      :key="index"
      :name="user.username"
      :user_id="user._id"
      position=""
      :online="false"
      :avatar="user.image"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card4>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Card4 from "@/components/cards/Card4.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";

export default defineComponent({
  name: "drawer-chat",
  components: {
    Card4,
  },
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.$http.get("http://localhost:8081/get_channels").then((res) => {
      this.users = res.data;
    });
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("Channel List", ["Chat"]);
    });
  },
});
</script>
