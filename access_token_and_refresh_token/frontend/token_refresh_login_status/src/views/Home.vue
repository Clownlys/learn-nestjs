<template>
    <div class="home">
      <h1>Welcome to my website!</h1>
      <p>{{ message }}</p>
      <p>Here you can find all sorts of interesting things.</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  export default {
    name: 'HomePage',
    setup() {
      const message = ref('Hello Vue 3!');
  
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
  