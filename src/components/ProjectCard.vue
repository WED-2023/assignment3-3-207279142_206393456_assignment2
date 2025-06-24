<template>
  <div class="project-card card h-100 shadow-sm">
    <a :href="live" target="_blank" class="project-image-link">
      <div class="image-wrapper">
        <img v-if="image" :src="image" class="card-img-top" alt="Project image" />
        <div class="image-overlay">Click to open live site</div>
      </div>
    </a>
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">{{ description }}</p>
      <div class="d-flex justify-content-start gap-2">
        <a
          :href="github"
          target="_blank"
          class="btn btn-outline-dark btn-sm rounded-circle github-icon-btn"
        >
          <i class="bi bi-github github-icon"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectCard",
  props: {
    title: String,
    description: String,
    github: String,
    live: String,
    image: String
  }
};
</script>

<style scoped>
.project-card {
  width: 100%;
  max-width: 320px;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.2s ease;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.project-card:hover {
  transform: scale(1.01);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.card-img-top {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.project-image-link:hover .card-img-top {
  opacity: 0.75;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  width: 100%;
  text-align: center;
  padding: 8px;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.project-image-link:hover .image-overlay {
  opacity: 1;
}

.github-icon-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.github-icon {
  font-size: 1.5rem;
  line-height: 1;
}
</style>
