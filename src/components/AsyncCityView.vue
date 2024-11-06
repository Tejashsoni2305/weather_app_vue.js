<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Loading State -->
    <div v-if="loading" class="text-white p-4 text-center">Loading...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 p-4 text-center">{{ error }}</div>

    <!-- Weather Overview (only displays if weatherData is available) -->
    <div v-else class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date().toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date().toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </p>
      <!-- Temperature and Feels Like -->
      <p class="text-8xl mb-8">{{ Math.round(weatherData.main.temp) }}&deg;C</p>
      <p>Feels like {{ Math.round(weatherData.main.feels_like) }} &deg;C</p>
      <!-- Weather Description and Icon -->
      <p class="capitalize">{{ weatherData.weather[0].description }}</p>
      <img
        class="w-[150px] h-auto"
        :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
        alt="Weather Icon"
      />
      
      <!-- Additional Weather Details -->
      <div class="flex flex-col items-center text-white mt-6">
        <p>Humidity: {{ weatherData.main.humidity }}%</p>
        <p>Wind Speed: {{ weatherData.wind.speed }} m/s</p>
        <p>Pressure: {{ weatherData.main.pressure }} hPa</p>
        <p>Min Temp: {{ Math.round(weatherData.main.temp_min) }}&deg;C</p>
        <p>Max Temp: {{ Math.round(weatherData.main.temp_max) }}&deg;C</p>
      </div>
    </div>

    <!-- Remove City Button -->
    <div
      class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Remove city</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref(null);
const weatherData = ref(null);

const getWeatherData = async () => {
  if (!route.query.lat || !route.query.lng) {
    error.value = "Latitude and longitude are missing";
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${route.query.lat}&lon=${route.query.lng}&appid=f744564a7e318fa1c2f77b6d29d5a218&units=metric`
    );

    weatherData.value = response.data;
  } catch (err) {
    console.error("Error fetching weather data:", err);
    error.value = "Failed to load weather data. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Fetch weather data on component load
getWeatherData();

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities")) || [];
  const updatedCities = cities.filter((city) => city.id !== route.query.id);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  router.push({ name: "home" });
};
</script>
