<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Note APP</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn @click="gonote">
        <span class="mr-2">note</span>
      </v-btn>
      <v-btn v-if="this.$route.name != 'login' " @click="logout">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-alert :value="err" color="error" icon="warning" outline>{{errdata}} 錯誤</v-alert>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  created() {
    this.checkLogin();
  },
  data() {
    return {
      err: false,
      errdata: ""
    };
  },
  methods: {
    checkLogin() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$router.push("/login");
      } else {
        this.$router.push("/about");
      }
    },
    logout() {
      console.log(this.$route);
      this.axios({
        url: "http://localhost:8888/logout",
        method: "delete",
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(result => {
          localStorage.clear();
          this.$router.push("/login");
        })
        .catch(err => {
          this.err = true;
          this.errdata = err;
          localStorage.clear();
          this.$router.push("/login");
        });
    },
    gonote() {
      this.$router.push("/note");
    }
  }
};
</script>
