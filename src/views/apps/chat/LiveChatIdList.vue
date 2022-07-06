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
          <th scope="col">LiveId</th>
          <th scope="col">User Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, k) in rows" :key="k">
          <th scope="row">{{ k }}</th>
          <td>{{ row.liveId }}</td>
          <td>{{ row.UserCount }}</td>
          <td>
            <button
              class="btn btn-sm btn-light-primary fw-bolder"
              data-kt-drawer-toggle="true"
              data-kt-drawer-target="#kt_drawer_chat"
              @click="openDrawer(row._id)"
            >
              User Lists
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
export default defineComponent({
  name: "drawer-chat",
  // @anhquan_198
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rows: [],
      users: [],
      messages: [],
      checkedCustomers: false,
      loading: false,
    };
  },
  methods: {
    openDrawer(userId) {
      this.$router.push({
        name: "apps-user-list-chat",
        params: { livechatId: userId },
      });
    },
    async getTableData() {
      this.loading = true;
      console.log("this.channelId", this.channelId);
      this.$http
        .get(
          process.env.VUE_APP_SOCKET_ENDPOINT +
            "/get_live_chat_ids?channel_id=" +
            this.channelId
        )
        .then((res) => {
          this.rows = res.data;
          this.loading = false;
        });
    },
  },
  created() {
    this.getTableData();
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("LiveId Chat", ["Chat"]);
    });
  },
});
</script>
