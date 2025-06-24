<template>
  <div class="about-page container mt-4">
    <h1 class="list-title">About</h1>
    <p>
      This recipe application was built as part of a comprehensive web development course project.
      It provides users with a complete platform to manage their culinary interests. Users can search for a wide variety of recipes using keywords or filters,
      mark recipes as favorites for quick access later, and contribute their own personal recipes to the system.
      Additionally, users can preserve family traditions by adding special family recipes and viewing them in a dedicated section.
      The site also offers a random suggestion feature that helps users discover new and interesting dishes they may not have thought of trying.
    </p>

    <p>
      The project includes full user authentication, responsive design, and dynamic data rendering.
      We developed a custom backend server using Node.js and Express, implemented a secure API to handle all user and recipe interactions,
      and connected the system to a relational database using SQL. The API supports functionality such as registration, login, fetching and saving recipes,
      managing favorites, and tracking recently viewed items.
    </p>

    <h2 class="list-title">Previous Projects</h2>
    <div class="row g-3 mt-3">
      <div class="col-md-4" v-for="project in projects" :key="project.title">
        <ProjectCard
          :title="project.title"
          :description="project.description"
          :github="project.github"
          :live="project.live"
          :image="project.image"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProjectCard from "@/components/ProjectCard.vue";
import bubbleImage from "@/assets/bubble-preview.png";
import miriamImage from "@/assets/miriam-preview.png";
import adelsonImage from "@/assets/adelson-preview.png";

export default {
  name: "AboutPage",
  components: {
    ProjectCard
  },
  data() {
    return {
      projects: [
        {
          title: "Bubble Invaders Game",
          description: "A JavaScript canvas game with enemy images and bullet logic.",
          github: "https://github.com/WED-2023/assignment2-207279142_206393456_assignment2.git",
          live: "https://wed-2023.github.io/assignment2-207279142_206393456_assignment2/",
          image: bubbleImage
        },
        {
          title: "Miriam Peretz Tribute",
          description: "A single-page tribute site for a modern Israeli leader.",
          github: "https://github.com/WED-2023/207279142.git",
          live: "https://wed-2023.github.io/207279142/",
          image: miriamImage
        },
        {
          title: "Miriam Adelson Tribute",
          description: "A tribute site for Miriam Adelson, part of our first assignment.",
          github: "https://github.com/WED-2023/assignment1-206393456.git",
          live: "https://wed-2023.github.io/assignment1-206393456/",
          image: adelsonImage
        }
      ]
    };
  }
};
</script>

<style scoped>
.about-page {
  line-height: 1.6;
}

.list-title {
  font-size: 2.6rem;
  font-weight: 800;
  text-align: center;
  color: #000000;
  margin: 40px 0 30px;
  position: relative;
  /* font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; */
  letter-spacing: 1px;
  text-transform: none;
  font-family: 'Pacifico', cursive;

}

.list-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #9ae0f1, #b3efe5);
  margin: 12px auto 0;
  border-radius: 2px;
}

</style>
