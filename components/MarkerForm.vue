<template>
    <div>
      <input v-model="newMarker.name" placeholder="İsim">
      <input v-model.number="newMarker.latitude" placeholder="Enlem">
      <input v-model.number="newMarker.longitude" placeholder="Boylam">
      <button @click="saveMarker">Kaydet</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const newMarker = defineModel() // v-model desteği
  
  const emit = defineEmits(['save-marker'])
  
  const saveMarker = () => {
    emit('save-marker', newMarker)
    newMarker.value = { name: '', latitude: 0, longitude: 0 } // Sıfırla
  }
  </script>
  