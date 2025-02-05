<template>
    <div>
      <transition name="slide-up">
        <div v-if="isOpen" class="bottom-sheet">
          <div class="sheet-content">
            <slot></slot>
            <button class="close-btn" @click="closeSheet">Kapat</button>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    isOpen: Boolean
  })
  
  const emit = defineEmits(["close"])
  
  const closeSheet = () => {
    emit("close")
  }
  </script>
  
  <style scoped>
  /* Bottom Sheet Stili */
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 12px 12px 0 0;
    z-index: 1000;
    transform: translateY(0);
    transition: transform 0.3s ease-in-out;
  }
  
  .sheet-content {
    text-align: center;
  }
  
  .close-btn {
    margin-top: 15px;
    padding: 10px 15px;
    border: none;
    background-color: #ff3d00;
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .close-btn:hover {
    background-color: #d32f2f;
  }
  
  /* Animasyon */
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: transform 0.3s ease-in-out;
  }
  
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(100%);
  }
  </style>
  