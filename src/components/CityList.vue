<template>
    <div>
      <div v-for="city in savedCities" :key="city.id">
        <CityCard :city="city" @click="goToCityView(city)" />
      </div>
      <p class="text-black flex py-6 px-3 bg-weather-secondary rounded-md shadow-md" v-if="savedCities.length === 0">No cities saved. To add cities, search in the field above</p>
    </div>
  </template>

<script setup>
import { ref } from 'vue';
import CityCard from './CityCard.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const savedCities = ref([]);
const getCities = async () => {
    if(localStorage.getItem('savedCities')){
        savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
        const requests = [];
        savedCities.value.forEach((city) => {
            requests.push(axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=288b6d094b69fec5793ecaa75a4760a1&units=metric`));
        });
    const weatherData = await Promise.all(requests);
    //flicker delay
    await new Promise((res) => setTimeout(res, 750));

    weatherData.forEach((value, index) => {
        savedCities.value[index].weather = value.data;
    });
    }
};
await getCities();
const router = useRouter();

const goToCityView = (city) => {
    router.push({
        name: "cityView",
        params: {state: city.state, city: city.city},
        query: {id: city.id, lat: city.coords.lat, lng: city.coords.lng}
    })
}
</script>