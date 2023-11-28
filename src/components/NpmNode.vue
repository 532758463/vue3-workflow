
<template>
  <div class="wrapper gradient">
    <div class="inner">
      <div class="body">
        <div class="title">
          <slot>npm build</slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  overflow: hidden;
  display: flex;
  padding: 2px;
  position: relative;
  border-radius: 10px;
}

.wrapper.gradient:before {
  content: '';
  background: conic-gradient(from -160deg at 50% 50%, #e92a67 0deg, #a853ba 120deg, #2a8af6 240deg, rgba(42, 138, 246, 0) 360deg);
  animation: spinner 4s linear infinite;
  transform: translate(-50%, -50%) rotate(0deg);
  z-index: -1;
}

.gradient:before {
  content: '';
  position: absolute;
  padding-bottom: calc(100% * 1.41421356237);
  width: calc(100% * 1.41421356237);
  background: conic-gradient(from -160deg at 50% 50%, #e92a67 0deg, #a853ba 120deg, #2a8af6 240deg, #e92a67 360deg);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 100%
}

.inner {
  background: rgb(17, 17, 17);
  padding: 16px 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  position: relative;
}

.title {
  color: white;
}

@keyframes spinner {
  100% {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}
</style>