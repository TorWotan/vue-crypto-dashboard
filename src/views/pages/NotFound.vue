<template>
  <NotFound class="py-12" :text="t('ui.pageNotFound')" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NotFound from '@/components/ui/badges/NotFound.vue'

const { t } = useI18n()
</script>
