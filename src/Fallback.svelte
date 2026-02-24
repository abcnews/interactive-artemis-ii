<div class="fallback">
  <div>
    <p>Sorry, there was an error loading this web app.</p>
    <p>Please try again later. (or contact byrd.joshua@abc.net.au)</p>
  </div>
</div>

<style lang="scss">
  .fallback {
    font-family: sans-serif;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 2em;

    div {
      text-align: center;
    }
  }
</style>
