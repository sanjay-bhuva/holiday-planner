<template>
  <div id="app">
    <HolidayPlanner/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HolidayPlanner from '@/components/HolidayPlanner.vue';

@Component({
  components: {
    HolidayPlanner,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
html, body {
  height: 100%;
  padding: 0;
  margin: 0;
}


body {
  display: flex;
  flex-direction: column;
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body > * {
  flex-shrink: 0;
}

#app {
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 2rem;
}
</style>
