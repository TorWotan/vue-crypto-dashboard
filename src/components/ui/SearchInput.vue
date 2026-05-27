<template>
  <IconField>
    <InputIcon v-if="prefixText" class="icon-field-prefix">
      <span class="text-[16px] font-mono text-zinc-600 dark:text-zinc-400">{{ prefixText }}</span>
    </InputIcon>
    <InputIcon v-else-if="iconSearch" class="icon-field-magnifier">
      <KTIcon icon-name="magnifier" icon-type="outline" icon-class="text-md text-zinc-300 dark:text-zinc-500" />
    </InputIcon>
    <InputText
      type="text"
      class="placeholder-custom"
      v-model="searchValue"
      :class="[[className], iconSearch || prefixText ? 'ps-[30px]' : '', 'pe-[24px]']"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @input="onInput"
      @keydown="onKeydown"
      @keyup="onKeyup"
      @paste="onPaste"
    />
    <InputIcon v-if="searchValue" @click="clearSearch">
      <KTIcon
        icon-name="cross"
        icon-type="outline"
        icon-class="text-base text-zinc-400 dark:text-zinc-500 hover:text-primary dark:hover:text-primary-400 cursor-pointer"
      />
    </InputIcon>
  </IconField>
</template>

<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import KTIcon from '@/core/helpers/kt-icon/KTIcon.vue'

const searchValue = defineModel<string>()

interface SearchProps {
  placeholder?: string
  className?: string
  iconSearch?: boolean
  clearOnPaste?: boolean
  prefixText?: string
  maxlength?: number
}

const props = withDefaults(defineProps<SearchProps>(), {
  placeholder: 'Search...',
  className: 'h-[32px] w-[170px]',
  iconSearch: true,
  clearOnPaste: false,
  prefixText: undefined,
  maxlength: undefined,
})

const emit = defineEmits(['update:modelValue', 'clear', 'input', 'keydown', 'keyup'])

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value?.trim())
  emit('input', e)
}

const onKeydown = (e: KeyboardEvent) => {
  emit('keydown', e)
}

const onKeyup = (e: KeyboardEvent) => {
  emit('keyup', e)
}

const onPaste = (e: ClipboardEvent) => {
  if (!props.clearOnPaste) return
  e.preventDefault()
  const text = e.clipboardData?.getData('text') ?? ''
  const value = text.trim()
  searchValue.value = value
  emit('update:modelValue', value)
  emit('input', { target: { value } } as unknown as Event)
}

const clearSearch = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.icon-field-magnifier,
.icon-field-prefix {
  inset-inline-start: 8px !important;
}

.placeholder-custom {
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
}

.placeholder-custom::placeholder {
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: rgba(212, 212, 216, 1);
}
</style>
