<div class="stars-background">
  <div id="stars"></div>
  <div id="stars2"></div>
  <div id="stars3"></div>
</div>

<style lang="scss">
  :root {
    --bg-gradient: linear-gradient(to bottom, #f5f7fa 0%, #c3cfe2 100%);
    --star-color: #707688; /* Darker stars for light background */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-gradient: radial-gradient(
        ellipse at bottom,
        #1b2735 0%,
        #090a0f 100%
      );
      --star-color: #fff;
    }
  }

  @function multiple-box-shadow($n) {
    $value: "#{random(2000)}px #{random(2000)}px var(--star-color)";
    @for $i from 2 through $n {
      $value: "#{$value} , #{random(2000)}px #{random(2000)}px var(--star-color)";
    }
    @return unquote($value);
  }

  $shadows-small: multiple-box-shadow(700);
  $shadows-medium: multiple-box-shadow(200);
  $shadows-big: multiple-box-shadow(100);

  .stars-background {
    background: var(--bg-gradient);
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }

  #stars {
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: $shadows-small;
  }

  #stars2 {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: $shadows-medium;
  }

  #stars3 {
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: $shadows-big;
  }
</style>
