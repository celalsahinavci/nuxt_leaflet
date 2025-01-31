<template>
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
      <tr v-for="marker in markers" :key="marker.id" @click="$emit('update-marker', marker)">
        <td>{{ marker.id }}</td>
        <td>{{ marker.name }}</td>
        <td>{{ marker.latitude.toFixed(6) }}</td>
        <td>{{ marker.longitude.toFixed(6) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({ markers: Array })
defineEmits(['update-marker'])
</script>