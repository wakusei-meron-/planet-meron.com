import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#0891B2',
            'primary-lighten-1': '#06B6D4',
            'primary-darken-1': '#0E7490',
            secondary: '#F59E0B',
            'secondary-lighten-1': '#FCD34D',
            'secondary-darken-1': '#D97706',
            accent: '#10B981',
            error: '#EF4444',
            info: '#3B82F6',
            success: '#10B981',
            warning: '#F59E0B',
            background: '#FFFFFF',
            surface: '#F9FAFB',
            'surface-variant': '#F3F4F6',
            'on-surface': '#111827',
            'on-surface-variant': '#4B5563',
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#06B6D4',
            'primary-lighten-1': '#22D3EE',
            'primary-darken-1': '#0891B2',
            secondary: '#FCD34D',
            'secondary-lighten-1': '#FDE68A',
            'secondary-darken-1': '#F59E0B',
            accent: '#34D399',
            error: '#F87171',
            info: '#60A5FA',
            success: '#34D399',
            warning: '#FCD34D',
            background: '#111827',
            surface: '#1F2937',
            'surface-variant': '#374151',
            'on-surface': '#F9FAFB',
            'on-surface-variant': '#D1D5DB',
          }
        }
      }
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
