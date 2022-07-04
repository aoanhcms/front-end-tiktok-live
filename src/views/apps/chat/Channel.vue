<template>
  <!--begin::Heading-->
  <div class="d-flex flex-wrap flex-stack mb-6">
    <!--begin::Title-->
    <h3 class="fw-bolder my-2">
      My Contacts
      <span class="fs-6 text-gray-400 fw-bold ms-1">(59)</span>
    </h3>
    <!--end::Title-->

    <!--begin::Controls-->
    <div class="d-flex my-2">
      <!--begin::Select-->
      <select
        name="status"
        data-control="select2"
        data-hide-search="true"
        class="form-select form-select-white form-select-sm w-125px"
      >
        <option value="Online" selected>Online</option>
        <option value="Pending">Pending</option>
        <option value="Declined">Declined</option>
        <option value="Accepted">Accepted</option>
      </select>
      <!--end::Select-->
    </div>
    <!--end::Controls-->
  </div>
  <!--end::Heading-->

  <!--begin::Contacts-->
  <div class="row g-6 g-xl-9">
    <Card4
      v-for="(user, index) in users"
      :key="index"
      :name="user.nickname"
      :user_id="user._id"
      position=""
      :online="false"
      :avatar="user.image"
      :connected="false"
      avg-earnings="$14,560"
      total-sales="$236,400"
    ></Card4>
  </div>
  <!--end::Contacts-->

  <!--begin::Pagination-
  <div class="d-flex flex-stack flex-wrap pt-10">
    <div class="fs-6 fw-bold text-gray-700">Showing 1 to 10 of 50 entries</div>

   begin::Pages-
    <ul class="pagination">
      <li class="page-item previous">
        <a href="#" class="page-link"><i class="previous"></i></a>
      </li>

      <li class="page-item active">
        <a href="#" class="page-link">1</a>
      </li>

      <li class="page-item">
        <a href="#" class="page-link">2</a>
      </li>

      <li class="page-item">
        <a href="#" class="page-link">3</a>
      </li>

      <li class="page-item">
        <a href="#" class="page-link">4</a>
      </li>

      <li class="page-item">
        <a href="#" class="page-link">5</a>
      </li>

      <li class="page-item">
        <a href="#" class="page-link">6</a>
      </li>

      <li class="page-item next">
        <a href="#" class="page-link"><i class="next"></i></a>
      </li>
    </ul>
    end::Pages
  </div>
  end::Pagination-->
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
    this.$http.get("http://localhost:8081/get_user_lists").then((res) => {
      this.users = res.data;
    });
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("Drawer Chat", ["Chat"]);
    });
  },
});
</script>
