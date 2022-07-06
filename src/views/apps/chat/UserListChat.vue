<template>
  <!--begin::Heading-->
  <div class="d-flex flex-wrap flex-stack mb-6">
    <!--begin::Title-->
    <h3 class="fw-bolder my-2">Danh sách người chat</h3>
    <!--end::Title-->

    <!--begin::Controls
    <div class="d-flex my-2">
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
    </div>
    end::Controls-->
  </div>
  <!--end::Heading-->

  <!--begin::Contacts-->
  <div class="row g-6 g-xl-9">
    <div v-if="loading">LOADING......</div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">image</th>
          <th scope="col">nickname</th>
          <th scope="col">commentCount</th>
          <th scope="col">uniqueId</th>
          <th scope="col">userId</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, k) in rows" :key="k">
          <th scope="row">{{ k }}</th>
          <td><img :src="row.image" /></td>
          <td>{{ row.nickname }}</td>
          <td>{{ row.commentCount }}</td>
          <td>{{ row.uniqueId }}</td>
          <td>{{ row.userId }}</td>
          <td>
            <button
              class="btn btn-sm btn-light-primary fw-bolder"
              data-kt-drawer-toggle="true"
              data-kt-drawer-target="#kt_drawer_chat"
              @click="openDrawer(row._id)"
            >
              Message Lists
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <messenger-drawer :messages="messages" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { DrawerComponent } from "@/assets/ts/components/_DrawerComponent";
import MessengerDrawer from "@/components/cards/MessengerDrawer.vue";
export default defineComponent({
  name: "drawer-chat",
  components: {
    MessengerDrawer,
  },
  // @anhquan_198
  data() {
    return {
      rows: [],
      users: [],
      messages: [],
      checkedCustomers: false,
      loading: false,
    };
  },
  props: ["livechatId"],
  methods: {
    async getTableData() {
      this.loading = true;
      this.$http
        .get(
          process.env.VUE_APP_SOCKET_ENDPOINT +
            "/get_user_lists?livechat_id=" +
            this.livechatId
        )
        .then((res) => {
          this.rows = res.data;
          this.loading = false;
        });
    },
    openDrawer(id) {
      this.messages = [];
      this.$http
        .get(
          process.env.VUE_APP_SOCKET_ENDPOINT +
            "/get_comment_lists?user_id=" +
            id
        )
        .then((res) => {
          this.messages = res.data;
        });
      DrawerComponent?.getInstance("message_list_drawer_chat")?.toggle();
    },
  },
  created() {
    this.getTableData();
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("Drawer Chat", ["Chat"]);
    });
  },
});
</script>
