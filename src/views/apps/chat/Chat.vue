<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Sidebar-->
    <div
      class="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0"
    >
      <div class="card card-flush">
        Nhập kênh channel (enter):
        <input
          v-model="username"
          type="text"
          class="form-control form-control-solid px-15"
          placeholder="@username tiktok..."
          @keydown.enter="submitGetUser"
        />
      </div>
      <div v-if="connected != null">Kết nối với {{ connected }}</div>
      <!--begin::Contacts-->
      <div class="card card-flush">
        <!--begin::Card header-->
        <div class="card-header pt-7" id="kt_chat_contacts_header">
          <!--begin::Form-->
          <form class="w-100 position-relative" autocomplete="off">
            <!--begin::Icon-->
            <span
              class="svg-icon svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-5 translate-middle-y"
            >
              <inline-svg src="media/icons/duotune/general/gen021.svg" />
            </span>
            <!--end::Icon-->

            <!--begin::Input-->
            <input
              v-model="search"
              @keypress="onSearch"
              type="text"
              class="form-control form-control-solid px-15"
              name="search"
              placeholder="Search by username or email..."
            />
            <!--end::Input-->
          </form>
          <!--end::Form-->
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body pt-5" id="kt_chat_contacts_body">
          <!--begin::List-->
          <div
            class="scroll-y me-n5 pe-5 h-200px h-lg-auto"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header"
            data-kt-scroll-wrappers="#kt_content, #kt_chat_contacts_body"
            data-kt-scroll-offset="0px"
          >
            <div v-if="loading" id="loading">LOADING.....</div>
            <template v-for="(item, index) in contacts" :key="index">
              <div class="d-flex flex-stack py-4">
                <!--begin::Details-->
                <div class="d-flex align-items-center">
                  <!--begin::Avatar-->
                  <div class="symbol symbol-45px symbol-circle">
                    <img v-if="item.image" :src="item.image" alt="" />
                    <span
                      v-else
                      :class="`bg-light-${item.color} text-${item.color}`"
                      class="symbol-label fs-6 fw-bolder"
                      >{{ item.name.charAt(0) }}</span
                    >
                  </div>
                  <!--end::Avatar-->
                  <!--begin::Details-->
                  <div class="ms-5">
                    <a
                      href="#"
                      class="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2"
                      >{{ item.name }}</a
                    >
                    <div class="fw-bold text-gray-400">{{ item.email }}</div>
                  </div>
                  <!--end::Details-->
                </div>
                <!--end::Details-->

                <!--begin::Lat seen-->
                <div class="d-flex flex-column align-items-end ms-2">
                  <span class="text-muted fs-7 mb-1">{{ item.time }}</span>
                </div>
                <!--end::Lat seen-->
              </div>
            </template>
          </div>
          <!--end::List-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Contacts-->
    </div>
    <!--end::Sidebar-->

    <!--begin::Content-->
    <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
      <!--begin::Messenger-->
      <div class="card" id="kt_chat_messenger">
        <!--begin::Card header-->
        <div class="card-header" id="kt_chat_messenger_header">
          <!--begin::Title-->
          <div class="card-title">
            <!--begin::User-->
            <div class="d-flex justify-content-center flex-column me-3">
              <div v-if="isGroupChat" class="symbol-group symbol-hover">
                <div class="symbol symbol-35px symbol-circle">
                  <img alt="Pic" src="media/avatars/300-5.jpg" />
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <img alt="Pic" src="media/avatars/300-25.jpg" />
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <span class="symbol-label bg-light-warning text-warning 40px"
                    >M</span
                  >
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <img alt="Pic" src="media/avatars/300-9.jpg" />
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <span class="symbol-label bg-light-danger text-danger 40px"
                    >O</span
                  >
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <span class="symbol-label bg-light-primary text-primary 40px"
                    >N</span
                  >
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <img alt="Pic" src="media/avatars/300-23.jpg" />
                </div>
                <a
                  href="#"
                  class="symbol symbol-35px symbol-circle"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_view_users"
                >
                  <span
                    class="symbol-label fs-8 fw-bolder"
                    data-bs-toggle="tooltip"
                    data-bs-trigger="hover"
                    title=""
                    data-bs-original-title="View more users"
                    >+42</span
                  >
                </a>
                <!--end::All users-->
              </div>
              <template v-else>
                <a
                  href="#"
                  class="fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1"
                  >Comments</a
                >

                <!--end::Info-->
              </template>
            </div>
            <!--end::User-->
          </div>
          <!--end::Title-->

          <!--begin::Card toolbar-->
          <div class="card-toolbar">
            <!--begin::Menu-->
            <div class="me-n3">
              <button
                class="btn btn-sm btn-icon btn-active-light-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
              >
                <i class="bi bi-three-dots fs-2"></i>
              </button>
              <Dropdown4></Dropdown4>
            </div>
            <!--end::Menu-->
          </div>
          <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body" id="kt_chat_messenger_body">
          <!--begin::Messages-->
          <div
            class="scroll-y me-n5 pe-5 h-lg-auto"
            ref="messagesRef"
            data-kt-element="messages"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer"
            data-kt-scroll-wrappers="#kt_content, #kt_chat_messenger_body"
            data-kt-scroll-offset="-2px"
          >
            <template v-for="(item, index) in messages" :key="index">
              <MessageIn
                ref="messagesInRef"
                :name="item.nickname"
                :image="item.profilePictureUrl"
                :time="item.time"
                :text="item.comment"
              ></MessageIn>
            </template>
          </div>
          <!--end::Messages-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Messenger-->
    </div>
    <div class="ms-lg-2 ms-xl-2 ms-md-2">
      <div style="font-size: 20px; font-weight: bold">
        Gift: {{ totalGiftCount }} / Members: {{ totalMemberCount }}
      </div>
      <div style="font-size: 20px; font-weight: bold">
        Like: {{ totalLikeCount }} / Comments: {{ totalCommentCount }}
      </div>
      <div class="topLikes">
        <!--begin::Card body-->
        <div class="card-body" id="kt_chat_messenger_body">
          <!--begin::Messages-->
          <div
            class="scroll-y me-n5 pe-5 h-lg-auto"
            ref="messagesRef"
            data-kt-element="messages"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer"
            data-kt-scroll-wrappers="#kt_content, #kt_chat_messenger_body"
            data-kt-scroll-offset="-2px"
          >
            <template v-for="(item, index) in topLikes" :key="index">
              <div class="d-flex flex-stack py-4">
                <!--begin::Details-->
                <div class="d-flex align-items-center">
                  <!--begin::Avatar-->
                  <div class="symbol symbol-45px symbol-circle">
                    <img v-if="item.image" :src="item.image" alt="" />
                    <span v-else class="symbol-label fs-6 fw-bolder">
                      {{ item.name.charAt(0) }}</span
                    >
                  </div>
                  <!--end::Avatar-->
                  <!--begin::Details-->
                  <div class="ms-5">
                    <a
                      href="#"
                      class="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2"
                      >{{ item.name }} ({{ item.likeCount }})</a
                    >
                  </div>
                  <!--end::Details-->
                </div>
                <!--end::Details-->
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!--end::Content-->
  </div>
  <!--end::Layout-->
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Dropdown4 from "@/components/dropdown/Dropdown4.vue";
import MessageIn from "@/components/messenger-parts/MessageIn.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import SocketioService from "@/core/plugins/connect";

interface KTMessage {
  type: string;
  name?: string;
  image: string;
  time: string;
  text: string;
}
interface KTContact {
  name: string;
  time: string;
  color: string;
  image: string;
  comments: object[];
  userId: string;
}
interface KTTopLike {
  image: string;
  time: string;
  likeCount: number;
  name: string;
  userId: string;
}
export default defineComponent({
  name: "private-chat",
  components: {
    Dropdown4,
    MessageIn,
  },
  data() {
    return {
      contacts: [] as KTContact[],
      topLikes: [] as KTTopLike[],
      messages: [] as any,
      username: null,
      totalLikeCount: 0,
      totalCommentCount: 0,
      totalGiftCount: 0,
      totalMemberCount: 0,
      connected: null,
      loading: false,
      search: "",
    };
  },
  mounted() {
    SocketioService.on("member", async (member) => {
      let opt = {
        name: member.nickname,
        time: new Date().toISOString().slice(0, 10).replace(/-/g, "/") + "",
        color: "string",
        image: member.profilePictureUrl,
        comments: [],
        userId: member.userId,
      };
      let index = this.topLikes.findIndex((item) => {
        return item.userId === member.userId;
      });
      if (index === -1) {
        this.contacts = [opt, ...this.contacts];
      }
      this.totalMemberCount++;
    });
    SocketioService.on("gift", async (gifts) => {
      this.totalGiftCount++;
    });
    SocketioService.on("chat", async (chat) => {
      console.warn("LIVE chat!", chat);
      //check user connect exists
      this.messages = [chat, ...this.messages];
      this.totalCommentCount++;
    });
    SocketioService.on("like", (chat) => {
      //check user connect exists
      let opt = {
        name: chat.nickname,
        time: Date.now() + "",
        image: chat.profilePictureUrl,
        likeCount: chat.likeCount,
        userId: chat.userId,
      };
      this.totalLikeCount = chat.totalLikeCount;

      let index = this.topLikes.findIndex((item) => {
        return item.userId === chat.userId;
      });
      if (index === -1) {
        this.topLikes = [opt, ...this.topLikes];
      }
      console.log("index", index);
    });
  },
  created() {
    SocketioService.setupSocketConnection();
  },
  methods: {
    onSearch() {
      this.contacts = this.contacts.filter((item) => {
        return item.name.includes(this.search);
      });
      console.log("onSearch", this.contacts, this.search);
    },
    async submitGetUser() {
      this.contacts = [];
      this.topLikes = [];
      this.messages = [];
      this.loading = true;
      SocketioService.connect(this.username, {
        enableExtendedGiftInfo: true,
      })
        .then((res: any) => {
          if (res.isConnected === true) {
            this.connected = this.username;
            this.username = null;
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          alert(e);
        });
    },
    arrayMove(arr, fromIndex, toIndex) {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      return arr;
    },
  },
  beforeUnmount() {
    SocketioService.disconnect();
  },
  setup() {
    const messagesRef = ref<null | HTMLElement>(null);
    const messagesInRef = ref<null | HTMLElement>(null);
    const messagesOutRef = ref<null | HTMLElement>(null);
    const route = useRoute();

    const newMessageText = ref("");

    const isGroupChat = computed(() => {
      return route.path.indexOf("/group-chat") !== -1;
    });

    onMounted(() => {
      setCurrentPageBreadcrumbs("Overview", ["Chat"]);
    });

    return {
      messagesRef,
      newMessageText,
      messagesInRef,
      messagesOutRef,
      isGroupChat,
    };
  },
});
</script>
<style>
.loading {
  font-size: 30px;
  font-weight: bold;
}
</style>
