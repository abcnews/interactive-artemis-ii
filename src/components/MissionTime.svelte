<script lang="ts">
  type Props = {
    hour: number;
    min: number;
    sec: number;
  };

  let { hour, min, sec }: Props = $props();

  const pad = (n: number) => String(n).padStart(2, "0");
</script>

<div class="container">
  <div class="pill">
    <div class="content">
      <time class="mission-time" datetime={`PT${hour}H${min}M${sec}S`}>
        {pad(hour)}:{pad(min)}:{pad(sec)}
      </time>
    </div>
  </div>
</div>

<style lang="scss">
  @use "../styles/breakpoints.scss";

  .container {
    width: calc(100% - 52px);
    margin-inline: auto;

    @include breakpoints.for-tablet-up {
      max-width: 621.33px;
    }

    @include breakpoints.for-desktop-up {
      max-width: 700px;
      margin-inline: -18px;
    }
  }

  .pill {
    display: inline-block;
    padding: 5px 16px;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    background: #212121;
  }

  // .content {
  // }

  .mission-time {
    color: #f9f9f9;
    text-align: center;
    font-family: "abcsans condensed", ABCSans, "ABC Sans Nova", sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 135%; /* 21.6px */
  }
</style>
