<template>
    <div class="container">
      <!-- Harita -->
      <div id="map"></div>
  
      <!-- Marker Tablosu -->
      <h2>{{ addingMarker ? "Yeni Marker Ekleniyor..." : "Mevcut Markerlar" }}</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Enlem</th>
            <th>Boylam</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="marker in markers" :key="marker.id">
            <td>{{ marker.id }}</td>
            <td>{{ marker.name }}</td>
            <td>{{ marker.latitude.toFixed(6) }}</td>
            <td>{{ marker.longitude.toFixed(6) }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Butonlar -->
      <div class="button-group">
        <button @click="startAddingMarker" v-if="!addingMarker">➕ Yeni Marker Ekle</button>
        <button @click="saveNewMarker" v-if="addingMarker">✅ Kaydet</button>
        <button @click="cancelAddingMarker" v-if="addingMarker">❌ İptal</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { createClient } from '@supabase/supabase-js'
  
  // Supabase bağlantısı
  const config = useRuntimeConfig()
  const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_KEY
)
  // Reaktif değişkenler
  const markers = ref([])
  const map = ref(null)
  const addingMarker = ref(false)
  const tempMarker = ref(null)
  
  onMounted(async () => {
    if (typeof window === 'undefined') return
    const L = await import('leaflet')
  
    const { data, error } = await supabase.from('markers').select('*')
    if (error) {
      console.error('Supabase Hatası:', error)
      return
    }
  
    markers.value = data
  
    // Harita oluşturma
    map.value = L.map('map').setView([data[0]?.latitude || 0, data[0]?.longitude || 0], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)
  
    // Marker ekleme
    data.forEach((marker, index) => {
      const leafletMarker = L.marker([marker.latitude, marker.longitude], { draggable: true }).addTo(map.value)
  
      leafletMarker.on('dragend', async (event) => {
        const newLatLng = event.target.getLatLng()
        markers.value[index] = { ...markers.value[index], latitude: newLatLng.lat, longitude: newLatLng.lng }
  
        const { error } = await supabase
          .from('markers')
          .update({ latitude: newLatLng.lat, longitude: newLatLng.lng })
          .eq('id', marker.id)
  
        if (error) console.error('Supabase Güncelleme Hatası:', error)
      })
    })
  })
  
  // Yeni marker ekleme
  const startAddingMarker = () => {
    addingMarker.value = true
    map.value.on('click', addTemporaryMarker)
  }
  
  const addTemporaryMarker = async (event) => {
    const L = await import('leaflet')
  
    if (tempMarker.value) {
      map.value.removeLayer(tempMarker.value)
    }
  
    tempMarker.value = L.marker(event.latlng, { draggable: true }).addTo(map.value)
  }
  
  const saveNewMarker = async () => {
    if (!tempMarker.value) return
  
    const latlng = tempMarker.value.getLatLng()
    const newMarker = {
      name: "Yeni Marker",
      latitude: latlng.lat,
      longitude: latlng.lng
    }
  
    const { data, error } = await supabase.from('markers').insert([newMarker]).select('*')
    if (error) {
      console.error('Supabase Ekleme Hatası:', error)
      return
    }
  
    markers.value.push(data[0])
    map.value.removeLayer(tempMarker.value)
    tempMarker.value = null
    addingMarker.value = false
    map.value.off('click', addTemporaryMarker)
  }
  
  const cancelAddingMarker = () => {
    if (tempMarker.value) {
      map.value.removeLayer(tempMarker.value)
      tempMarker.value = null
    }
    addingMarker.value = false
    map.value.off('click', addTemporaryMarker)
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  
  #map {
    width: 600px;
    height: 400px;
    border-radius: 16px;
    border: 2px solid #ddd;
    margin-bottom: 20px;
  }
  
  h2 {
    margin-bottom: 10px;
    color: #333;
  }
  
  table {
    width: 600px;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: 0.3s;
  }
  
  button:hover {
    opacity: 0.8;
  }
  
  button:nth-child(1) {
    background-color: #4CAF50;
    color: white;
  }
  
  button:nth-child(2) {
    background-color: #2196F3;
    color: white;
  }
  
  button:nth-child(3) {
    background-color: #F44336;
    color: white;
  }
  </style>
  