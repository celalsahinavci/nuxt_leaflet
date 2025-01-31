<template>
  <div class="container">
    <div id="map"></div>
    <h2>{{ addingMarker ? "Yeni Marker Ekleniyor..." : "Mevcut Markerlar" }}</h2>   
    <MarkerTable :markers="markers" @update-marker="handleMarkerUpdate" @edit-marker="handleEditUpdate" />

    <div class="button-group">
      <button @click="startAddingMarker" v-if="!addingMarker">➕ Yeni Marker Ekle</button>
      <button @click="saveNewMarker" v-if="addingMarker">✅ Kaydet</button>
      <button @click="cancelAddingMarker" v-if="addingMarker">❌ İptal</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMap } from '@/composable/useMap';
import MarkerTable from '@/components/MarkerTable.vue';

const { map,markers, addingMarker, startAddingMarker, saveNewMarker, cancelAddingMarker, updateMarkerInSupabase } = useMap();

const handleMarkerUpdate = (marker) => {
  console.log("Seçilen Marker:", marker);

  // Eğer harita mevcutsa
  if (map.value) {
    map.value.setView([marker.latitude, marker.longitude], 10); // Marker'a göre haritayı merkezle
  } else {
    console.warn('Harita yüklendiğinde, marker merkezleme işlemi yapılacak.');
  }
};

const handleEditUpdate = (marker) => {
  // Düzenleme işlemi başlatılacak
  updateMarkerInSupabase(marker);
};
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
  ~/composable/useMap