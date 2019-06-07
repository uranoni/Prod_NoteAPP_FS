<template>
  <v-container fluid>
    <h1>NOTE PAGE</h1>
    <v-btn v-on:click="test">存檔</v-btn>
    <v-layout row fill-height>
      <v-flex xs6>
        <textarea class="inputclass" :value="input" @input="update"></textarea>
      </v-flex>
      <v-flex xs6>
        <div v-html="compiledMarkdown"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
.inputclass {
  height: 100vh;
  width: 100%;
  background: #eee;
  border: 2px solid #eee;
}
</style>

<script>
export default {
  created() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push("/login");
    }
  },
  data() {
    return {
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      input: "# hello",
      tmp: " "
    };
  },
  computed: {
    // 轉譯功能的function 吐回到data.tmp
    compiledMarkdown: function() {
      this.tmp = marked(this.input, { sanitize: true });
      return this.tmp;
    }
  },
  methods: {
    //即時更新把左邊的markdown語法轉換到右邊
    update: _.debounce(function(e) {
      console.log(e);
      this.input = e.target.value;
    }, 300),
    // 把資料傳到後端
    test: function() {
      // 傳送資料到後端的方法
      // post 後面接url  第二個參數接資料

      axios
        .post("http://localhost:8787/rewrite", {
          user: "user",
          context: this.tmp
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>