<template>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>İsim</th>
        <th>Enlem</th>
        <th>Boylam</th>
        <th>Aksiyonlar</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="marker in markers" :key="marker.id">
        <td>{{ marker.id }}</td>
        <td>
          <input v-if="editingMarkers[marker.id]" v-model="marker.name" />
          <span v-else>{{ marker.name }}</span>
        </td>
        <td>
          <input v-if="editingMarkers[marker.id]" v-model="marker.latitude" type="number" />
          <span v-else>{{ marker.latitude.toFixed(6) }}</span>
        </td>
        <td>
          <input v-if="editingMarkers[marker.id]" v-model="marker.longitude" type="number" />
          <span v-else>{{ marker.longitude.toFixed(6) }}</span>
        </td>
        <td>
          <button @click="$emit('update-marker', marker)" class="btn btn-view">Konuma Git</button>
        
          <button 
    @click="toggleEdit(marker)" 
    v-if="!editingMarkers[marker.id]" 
    class="btn btn-edit">Düzenle
   
  </button>
  <button 
    @click="toggleEdit(marker)" 
    v-if="editingMarkers[marker.id]" 
    class="btn btn-save">
    Kaydet
  </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({ markers: Array });
const emit = defineEmits(['update-marker', 'edit-marker']);

// Her marker için düzenleme durumunu saklayan bir nesne
const editingMarkers = reactive({});

// Düzenleme durumunu değiştir
const toggleEdit = (marker) => {
  editingMarkers[marker.id] = !editingMarkers[marker.id];

// Düzenleme açıldığında draggable aktif etmesi için `emit` ile yukarı bildir
emit('edit-marker', { marker, isEditing: editingMarkers[marker.id] }); 
  
};

</script>

<style scoped>
/* Genel stil ve tablo düzenlemeleri */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #4CAF50;
  color: white;
}

td {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

/* Input alanları için stil */
input[type="number"], input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}

/* Butonlar için stil */
.btn {
  padding: 8px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view {
  background-color: #2196F3;
  color: white;
}

.btn-edit {
  background-color: #4CAF50;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}

/* Düzenleme modunda input kutularını vurgulama */
input:focus {
  border-color: #4CAF50;
  outline: none;
}
</style>
