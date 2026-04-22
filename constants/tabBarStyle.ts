import type { ViewStyle } from 'react-native';
import { COLORS } from '@/constants/colors';

export const TAB_BAR_STYLE: ViewStyle = {
    backgroundColor: COLORS.card,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    paddingBottom: 24,
    paddingTop: 12,
    height: 90,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
};

export const HIDDEN_TAB_BAR_STYLE: ViewStyle = {
    ...TAB_BAR_STYLE,
    display: 'none',
};
