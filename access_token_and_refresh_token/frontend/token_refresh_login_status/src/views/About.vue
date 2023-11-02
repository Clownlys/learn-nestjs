<template>
  <div class="home">
    <h1>Welcome to my website!</h1>
    <p>{{ message }}</p>
    <p>Here you can find all sorts of interesting things.</p>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue';
export default {
  name: 'AboutPage',
  setup() {
    const message = ref('Hello Vue 3!');
    const httpService = inject('httpService');
    function init() {
      httpService
        .post('/user/login', {
          username: '李四',
          password: '111111',
        })
        .then((res) => {
          console.log(res);
          const { access_token, refresh_token } = res.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
        });
      // httpService.get('/aaa').then((res) => {
      //     message.value = res.data.message;
      // });
    }
    function getAaa() {
      const access_token = localStorage.getItem('access_token');
      httpService
        .get('/aaa', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    onMounted(() => {
        getAaa();
        getAaa();
        getAaa();
        setTimeout(() => {
            getAaa();
        }, 1000);
    //   init();
    });
    return {
      message,
    };
  },
};
</script>

<style>
.home {
  text-align: center;
}
</style>
