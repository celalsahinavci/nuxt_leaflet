<template>
  <div>
    <LMap style="height: 100vh" :zoom="4" :center="[38, 40]">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
      <div v-for="marker in markers" :key="marker.id">
        <LMarker :lat-lng="[marker.latitude, marker.longitude]">
          <LPopup>
            <div>
              <p><strong>Marker Name:</strong> {{ marker.name }}</p>
              <p><strong>Latitude:</strong> {{ marker.latitude }}</p>
              <p><strong>Longitude:</strong> {{ marker.longitude }}</p>
              <button @click="openBottomSheet(marker)">Detay</button>
            </div>
          </LPopup>
        </LMarker>
      </div>
    </LMap>

    <!-- Bottom Sheet Bileşeni -->
    <BottomSheet :isOpen="isBottomSheetOpen" @close="isBottomSheetOpen = false">
      <h3>Marker Detayları</h3>
      <p><strong>İsim:</strong> {{ selectedMarker?.name }}</p>
      <p><strong>Latitude:</strong> {{ selectedMarker?.latitude }}</p>
      <p><strong>Longitude:</strong> {{ selectedMarker?.longitude }}</p>
    </BottomSheet>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMap } from '@/composable/useMap'
import BottomSheet from '@/components/BottomSheets.vue'

const { markers } = useMap()

const isBottomSheetOpen = ref(false)
const selectedMarker = ref(null)

// Bottom Sheet açma fonksiyonu
const openBottomSheet = (marker) => {
  selectedMarker.value = marker
  isBottomSheetOpen.value = true
}
</script>
