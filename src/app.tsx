import { defineComponent, onMounted } from 'vue';
import game from './game'

export default defineComponent({
  name: 'App',

  setup() {
    onMounted(() => {
      game.init()
    })

    return () => (<canvas id="canvas"></canvas>)
  }
});