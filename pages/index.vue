<template>
    <div>
      <div id="map" style="height: 500px;"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { createClient } from '@supabase/supabase-js'
  
  // Supabase yapılandırması
  const config = useRuntimeConfig()
  const supabase = createClient(
  'https://vdkqabfltwawewqxnyrh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka3FhYmZsdHdhd2V3cXhueXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNjkyMjcsImV4cCI6MjA1Mjk0NTIyN30.4OsViEW2qegFVb0yFXWyPHctxPAgaAOUNyqTCZNm18c'
)
  
  // Marker listesini saklayan reaktif değişken
  const markers = ref([])
  
  onMounted(async () => {
    if (typeof window === 'undefined') return
  
    const L = await import('leaflet')
  
    // Supabase'den marker verilerini al
    const { data, error } = await supabase.from('markers').select('*')
    if (error) {
      console.error('Supabase Hatası:', error)
      return
    }
  
    markers.value = data // Marker'ları güncelle
  
    // Leaflet haritasını oluştur
    const map = L.map('map').setView([data[0]?.latitude || 0, data[0]?.longitude || 0], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
  
    // Marker'ları haritaya ekle
    data.forEach((marker, index) => {
      const leafletMarker = L.marker([marker.latitude, marker.longitude], { draggable: true }).addTo(map)
      
      // Marker taşındığında konumu güncelle
      leafletMarker.on('dragend', async (event) => {
        const newLatLng = event.target.getLatLng()
        markers.value[index] = { ...markers.value[index], latitude: newLatLng.lat, longitude: newLatLng.lng }
        
        console.log(`Marker ${index + 1} yeni konumu:`, markers.value[index])
  
        // Supabase'de güncelle
        const { error } = await supabase
          .from('markers')
          .update({ latitude: newLatLng.lat, longitude: newLatLng.lng })
          .eq('id', marker.id)
  
        if (error) console.error('Supabase Güncelleme Hatası:', error)
      })
    })
  })
  </script>
  
  
  <style>
  </style>
  