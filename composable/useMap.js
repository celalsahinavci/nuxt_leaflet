import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';


export function useMap() {
  
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );

  
  const markers = ref([]); 
  const map = ref(null); 
  const addingMarker = ref(false); 
  const tempMarker = ref(null); 
  const editingMarkers = ref({});

  const toggleEdit = (marker) => {
    // Eğer marker düzenleme moduna giriyorsa, draggable yap
    editingMarkers.value[marker.id] = !editingMarkers.value[marker.id];
  
    // Haritadaki marker'ı bul ve draggable özelliğini güncelle
    const leafletMarker = map.value?.eachLayer(layer => {
      if (layer instanceof L.Marker && layer.getLatLng().lat === marker.latitude && layer.getLatLng().lng === marker.longitude) {
        layer.dragging[editingMarkers.value[marker.id] ? 'enable' : 'disable']();
      }
    });
  };
  
  onMounted(async () => {
    if (typeof window === 'undefined') return;
    const L = await import('leaflet');
    
    const { data, error } = await supabase.from('markers').select('*');
    if (error) {
      console.error('Supabase Hatası:', error);
      return;
    }

    markers.value = data;

    
    map.value = L.map('map').setView([data[0]?.latitude || 0, data[0]?.longitude || 0], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);

    
    data.forEach((marker) => {
      const leafletMarker = L.marker([marker.latitude, marker.longitude], { draggable: false }).addTo(map.value);

      leafletMarker.on('dragend', async (event) => {
        const newLatLng = event.target.getLatLng();
        const updatedMarker = { ...marker, latitude: newLatLng.lat, longitude: newLatLng.lng };
        markers.value = markers.value.map(m => m.id === marker.id ? updatedMarker : m);

        const { error } = await supabase
          .from('markers')
          .update({ latitude: newLatLng.lat, longitude: newLatLng.lng })
          .eq('id', marker.id);

        if (error) console.error('Supabase Güncelleme Hatası:', error);
      });
    });
  });

  const updateMarkerInSupabase = async (updatedMarker) => {
    const { data, error } = await supabase
      .from('markers')
      .update({
        name: updatedMarker.name,
        latitude: updatedMarker.latitude,
        longitude: updatedMarker.longitude,
      })
      .match({ id: updatedMarker.id });
  
    if (error) {
      console.error('Marker güncellenirken hata oluştu:', error);
    } else {
      console.log('Marker güncellendi:', data);
    }
  };
  ;
 
  // Yeni marker eklemek için başlat
  const startAddingMarker = () => {
    addingMarker.value = true;
    map.value.on('click', addTemporaryMarker);
  };

  // Geçici marker eklemek
  const addTemporaryMarker = async (event) => {
    const L = await import('leaflet');

    if (tempMarker.value) {
      map.value.removeLayer(tempMarker.value);
    }

    tempMarker.value = L.marker(event.latlng, { draggable: true }).addTo(map.value);
  };

  // Yeni marker'ı kaydet
  const saveNewMarker = async () => {
    if (!tempMarker.value) return;

    const latlng = tempMarker.value.getLatLng();
    const newMarker = {
      name: "Yeni Marker",
      latitude: latlng.lat,
      longitude: latlng.lng
    };

    const { data, error } = await supabase.from('markers').insert([newMarker]).select('*');
    if (error) {
      console.error('Supabase Ekleme Hatası:', error);
      return;
    }

    markers.value.push(data[0]);
    map.value.removeLayer(tempMarker.value);
    tempMarker.value = null;
    addingMarker.value = false;
    map.value.off('click', addTemporaryMarker);
  };

  const deleteMarker = async (marker) => {
    const { error } = await supabase
      .from('markers')
      .delete()
      .eq('id', marker.id);
    
    if (error) {
      console.error('Marker Silme Hatası:', error);
      return;
    }

    // Silinen marker'ı listeden çıkar
    markers.value = markers.value.filter(m => m.id !== marker.id);
  };

  // Marker eklemeyi iptal et
  const cancelAddingMarker = () => {
    if (tempMarker.value) {
      map.value.removeLayer(tempMarker.value);
      tempMarker.value = null;
    }
    addingMarker.value = false;
    map.value.off('click', addTemporaryMarker);
  };

  return {
    markers,
    map,
    addingMarker,
    startAddingMarker,
    saveNewMarker,
    cancelAddingMarker,
    updateMarkerInSupabase,
    deleteMarker,
    toggleEdit
   
  };
}
