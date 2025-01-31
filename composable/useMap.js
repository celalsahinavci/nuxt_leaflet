import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

export function useMap() {
  // Supabase bağlantısı
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

  return {
    markers,
    map,
    addingMarker,
    startAddingMarker,
    saveNewMarker,
    cancelAddingMarker
  }
}
